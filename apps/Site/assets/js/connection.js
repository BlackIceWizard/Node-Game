function ConnectionConstructor() {

    this.DialogAreas = {
        Main : 1,
        Chat : 2,
        BomberMan : 3
    };
    this.DialogAreasNames = {
        1: 'Main',
        2: 'Chat',
        3: 'BomberMan'
    };

    var mySocket = null;
    var lastMessageNumber = 0;
    var incomingMessagesQueue = {
        'messages' : {},
        'lenght' : 0
    };

    var crossdomainXMLWasReceived = false;

    var waitingQueuedTimerId = null;
    var queueAttemptNumber = 0;
    var notCompletedMessage = '';


    this.init = function() {
        $(document).ready( function () {
            mySocket = new jSocket( jSocketReady, jSocketConnect, jSocketData, jSocketClose );

            mySocket.setup("my_socket","assets/jsocket/flash/jsocket.advanced.swf");
        });
    };

    var jSocketReady = function () {
        //console.log("Socket ready");
        mySocket.connect( "bomberman.servegame.com", 8430 );
        //mySocket.connect( "192.168.1.2", 8430 );
    };

    var jSocketConnect = function (success,data) {
        //console.log("Socket connected");
        if(!success) {
            //console.log("error:"+data);
            return;
        }

        mySocket.write( JSON.stringify( { area : Connection.DialogAreas.Main, dialog : 'StartUp', message : "Hello" } )+"\0" );
    };

    var jSocketData = function ( bytes ) {
        var RawData = mySocket.readUTFBytes( bytes );

        //console.log( '-- Receive Raw Message -- ', 'Data:', RawData );

        RawData = notCompletedMessage + RawData;
        notCompletedMessage = '';

        var data_parts = RawData.split( '\n' );

        notCompletedMessage = data_parts.splice( data_parts.length-1, 1 )[0];

        for( var i = 0; i < data_parts.length; i++ ) {
            if( data_parts[i].length == 0 )
                continue;

            if( !crossdomainXMLWasReceived && data_parts[i].substr( 0, 5) == '<?xml' ) {
                crossdomainXMLWasReceived = true;
                return;
            } else {
                var data = JSON.parse( data_parts[i] );
            }

            //console.log( '-- Receive Message -- ', 'Data:', data, 'Number:', data.n, 'Dialog:', data.dialog );

            if ( data.n == lastMessageNumber + 1 ) {
                queueAttemptNumber = 0;
                clearTimeout( waitingQueuedTimerId );

                lastMessageNumber = data.n;

                dispatch( data );

                if( incomingMessagesQueue.lenght > 0 ) {
                    if( typeof incomingMessagesQueue.messages[lastMessageNumber+1] != 'undefined' ) {
                        processQueuedMessage();
                    } else {
                        //console.log( '--Missing Message Detected--', 'Receive:', data.n, 'Last:', lastMessageNumber );
                        waitQueuedMessage();
                    }
                }

            } else if( data.n > lastMessageNumber+1 ) {
                if( typeof incomingMessagesQueue.messages[data.n] == 'undefined' ) {
                    incomingMessagesQueue.messages[data.n] = data;
                    incomingMessagesQueue.lenght++;
                }

                if( incomingMessagesQueue.lenght == 1 ) {
                    //console.log( '--Missing Message Detected--', 'Receive:', data.n, 'Last:', lastMessageNumber );
                    waitQueuedMessage();
                }

                if( incomingMessagesQueue.lenght >= 200 ){
                    window.location = window.location;
                }
            }
        }
    };

    var processQueuedMessage = function() {
        window.setTimeout( function () {
            var data = incomingMessagesQueue.messages[lastMessageNumber+1];
            delete incomingMessagesQueue.messages[lastMessageNumber+1];
            incomingMessagesQueue.lenght--;

            queueAttemptNumber = 0;
            clearTimeout( waitingQueuedTimerId );

            lastMessageNumber = data.n;

            dispatch( data );

            if( incomingMessagesQueue.lenght > 0 ) {
                if( typeof incomingMessagesQueue.messages[lastMessageNumber+1] != 'undefined' ) {
                    processQueuedMessage();
                } else {
                    //console.log( '--Missing Message Detected--', 'Receive:', data.n, 'Last:', lastMessageNumber );
                    waitQueuedMessage();
                }
            }
        }, 20 );
    };

    var waitQueuedMessage = function() {
        if( queueAttemptNumber == 10 ) {
            window.location = window.location;
        } else {
            queueAttemptNumber ++;
            waitingQueuedTimerId = window.setTimeout( function () {
                Connection.initiateDialog( Connection.DialogAreas.Main, 'RepeatMissingMessage', { 'message_number' : lastMessageNumber+1 } );
                waitQueuedMessage();
            }, 80 );
        }
    };

    var jSocketClose = function () {
        //console.log("Socket close");
    };

    var getCookie = function ( name ) {
        var pattern = "(?:; )?" + name + "=([^;]*);?";

        var regexp  = new RegExp(pattern);

        if (regexp.test(document.cookie))
            return decodeURIComponent(RegExp["$1"]);

        return null;
    };

    var dispatch = function ( data ) {
        //console.log( '-- Dispatch Message -- ', 'Data:', data, 'Number:', data.n, 'Dialog:', data.dialog );

        var talk_message = dialogs[Connection.DialogAreasNames[data.area]][data.dialog]( data.message );

        if (talk_message !== null)
            sendData( data.area, data.dialog, talk_message );

    };

    this.initiateDialog = function ( area, dialogName, message ) {
        var areaName = this.DialogAreasNames[area];
        var talk_message = dialogs[areaName][dialogName]( message, true );

        if (talk_message !== null)
            sendData( area, dialogName, talk_message );
    };

    var sendData = function ( area, dialog, message ) {
        //console.log( '-- Send Message -- ', 'Message:', message, 'Dialog:', dialog );
        mySocket.write(JSON.stringify({ 'area' : area, 'dialog' : dialog, 'message' : message }) + "\n\0");
    };

    var dialogs = {
        Main : {

            StartUp : function ( message ) {
                var output = null;
                if( message == "WhatYourSessionID" ) {
                    //console.log( 'Send SessionId' );
                    output =  { 'SessionId' : getCookie('sessionid') };
                } else if( message == "It`s all what I need" ) {
                    //console.log( 'StartUp Complete' );
                    Connection.initiateDialog( Connection.DialogAreas.Chat, 'Init' );

                    if( typeof BomberMan != "undefined" && typeof  BomberManParams != "undefined" ) {
                        BomberMan.init( BomberManParams );
                    }
                } else if( message == "You are not authorized" ) {

                }

                return output;
            },

            RepeatMissingMessage : function ( message ) {
                var output = null;
                output = message;
                //console.log( 'Send Missing Message Query', message );
                return output;
            }
        },

        Chat : {

            Init : function ( message, startDialog ) {

                var output = null;
                if( typeof startDialog != "undefined" && startDialog == true ) {
                    //console.log( 'Send Chat Participants Query' );
                    output =  'GetChatParticipantList';
                } else if( typeof message == 'object' && typeof message.ChatParticipants != "undefined" ) {
                    //console.log( 'Take Chat Participant List' );
                    Chat.init();
                    Chat.addChatUsers( message.ChatParticipants );

                }
                return output;
            },

            UserHasLeft : function ( message ) {
                var output = null;

                Chat.removeUserFromParticipants( message.UserNick );
                //console.log( 'User '+message.UserNick+' has left' );

                return output;
            },

            UserHasJoined : function ( message ) {
                var output = null;

                Chat.appendUserToParticipants( message.UserNick );
                //console.log( 'User '+message.UserNick+' has joined' );

                return output;
            },

            SendMessage : function ( message ) {
                var output = message;
                return output;
            },

            ReceiveMessage : function ( message ) {
                var output = null;
                Chat.appendMessage( message );
                return output;
            }
        },

        BomberMan : {
            Init : function ( message, startDialog ) {
                var output = null;
                if( typeof startDialog != "undefined" && startDialog == true ) {
                    //console.log( 'Send Query on Input in Game' );
                    output =  { 'TakeMeInGame' : { 'game' : BomberMan.game_ident, 'team' : BomberMan.team  }}
                } else if( message == "YouAreInGameNow" ) {
                    //console.log( 'Send Area Full State Query' );
                    output = "GiveMeFullArenaState";
                } else if( typeof message == 'object' && typeof message.FullArenaState == "object") {
                    //console.log( 'BomberMan Initialized' );
                    BomberMan.assignArenaState( message.FullArenaState );
                    BomberMan.initialized = true;

                    output = 'It`s all what I need';
                }
                return output;
            },

            NewPlayer : function ( message ) {
                var output = null;
                //console.log( 'Recieve Note About New Player' );
                if( BomberMan.initialized ) {
                    BomberMan.assignNewPlayer( message );
                }
                return output;
            },

            RespawnPlayer : function ( message ) {
                var output = null;
                //console.log( 'Recieve Note About New Player' );
                if( BomberMan.initialized ) {
                    BomberMan.respawnPlayer( message );
                }
                return output;
            },

            PlayerHasLeft : function ( message ) {
                var output = null;
                //console.log( 'User '+message.nick+' has left from game' );

                if( BomberMan.initialized ) {
                    BomberMan.removePlayer( message.nick );
                }

                return output;
            },

            Action : function ( message ) {
                var output = message;
                return output;
            },

            MovePlayer : function ( message ) {
                var output = null;
                //console.log( 'Recieve new Player position' );
                if( BomberMan.initialized ) {
                    BomberMan.movePlayer( message.nick, message.position );
                }
                return output;
            },

            DeactivateSpawnDefence : function ( message ) {
                var output = null;
                //console.log( 'Recieve Deactivate Spawn Defence' );
                if( BomberMan.initialized ) {
                    BomberMan.deactivateSpawnDefence( message.nick );
                }
                return output;
            },

            AllocateBomb : function ( message ) {
                var output = null;
                //console.log( 'Recieve Allocate Bomb' );
                if( BomberMan.initialized ) {
                    BomberMan.allocateBomb( message.position );
                }
                return output;
            },

            MarkWallReconstruction : function ( message ) {
                var output = null;
                //console.log( 'Recieve Mark Wall Reconstruction' );
                if( BomberMan.initialized ) {
                    BomberMan.markWallReconstruction( message.position );
                }
                return output;
            },

            WallReconstruction : function ( message ) {
                var output = null;
                //console.log( 'Recieve Wall Reconstruction' );
                if( BomberMan.initialized ) {
                    BomberMan.WallReconstruction( message.positions );
                }
                return output;
            },

            BombExplosion : function ( message ) {
                var output = null;
                //console.log( 'Recieve Explosion Bomb' );
                if( BomberMan.initialized ) {
                    BomberMan.detonateBomb( message.position, message.range );
                    BomberMan.destroyWalls( message.affected_entities.Walls );
                    BomberMan.killPlayers( message.affected_entities.Players );
                    BomberMan.refreshTeamScore( message.team_score );
                }
                return output;
            }
        }
    };
}

Connection = new ConnectionConstructor();
Connection.init();