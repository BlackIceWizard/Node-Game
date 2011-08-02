$(document).ready( function () {
    mySocket = new jSocket( JsocketReady, JsocketConnect, JsocketData, JsocketClose );

    mySocket.setup("my_socket","assets/jsocket/flash/jsocket.advanced.swf");
});

var mySocket;

function JsocketReady() {
    console.log("Socket ready");
    mySocket.connect( "127.0.0.2", 843 );
}

function JsocketConnect(success,data) {
    console.log("Socket connected");
    if(!success) {
        console.log("error:"+data);
        return;
    }

    mySocket.write( JSON.stringify( { dialog : 'StartUp', message : "Hello" } )+"\0" );
}

function JsocketData( bytes ) {
    var JSONdata = mySocket.readMultiByte(bytes, "UTF-8");

    var data = JSON.parse(JSONdata);
    console.log( "Socket data", data );
    var talk_message = dialogs[data.dialog]( data.message );

    if (talk_message !== null)
        sendData( data.dialog, talk_message );
}

function JsocketClose() {
    console.log("Socket close");
}



function getCookie( name ) {
    var pattern = "(?:; )?" + name + "=([^;]*);?";

    var regexp  = new RegExp(pattern);

    if (regexp.test(document.cookie))
        return decodeURIComponent(RegExp["$1"]);

    return null;
}

function initiateDialog( dialogName, message ) {
    var talk_message = dialogs[dialogName]( message, true );

    if (talk_message !== null)
        sendData( dialogName, talk_message );
}

function sendData( dialog, message ) {
    mySocket.write(JSON.stringify({ dialog : dialog, message : message }) + "\0");
}

var dialogs = {
    StartUp : function ( message ) {
        var output = null;
        if( message == "WhatYourSessionID" ) {
            console.log( 'Send SessionId' );
            output =  { 'SessionId' : getCookie('sessionid') };
        } else if( message == "It`s all what I need" ) {
            console.log( 'StartUp Complete' );
            initiateDialog( 'InitChat' );
        } else if( message == "You are not authorized" ) {

        }
        
        return output;
    },

    InitChat : function ( message, startDialog ) {

        var output = null;
        if( typeof startDialog != "undefined" && startDialog == true ) {
            console.log( 'Send Chat Participants Query' );
            output =  'GetChatParticipantList';
        } else if( typeof message == 'object' && typeof message.ChatParticipants != "undefined" ) {
            console.log( 'Take Chat Participant List' );
            Chat.addChatUsers( message.ChatParticipants );
        }
        return output;
    },

    UserHasLeft : function ( message ) {
        var output = null;

        Chat.removeUserFromParticipants( message.UserNick );
        console.log( 'User '+message.UserNick+' has left' );

        return output;
    }
};