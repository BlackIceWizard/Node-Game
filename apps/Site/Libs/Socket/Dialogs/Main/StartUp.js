var internal = {};

exports.talk = function ( message, ConnectionState, SocketFrame, startDialog, callback ) {
    var MP = exports.Services.ModuleProvider;
    var SH = exports.Services.SessionHandler;

    if( message == '<policy-file-request/>' ) {
       callback( MP.getModule( 'Helpers/Common' ).crossdomainXML() );
    } else if(message == 'Hello') {
        //console.log( 'TCP: Send sessionid query' );
        callback( "WhatYourSessionID" );
    } else if( typeof message == 'object' && typeof message.SessionId != 'undefined' && message.SessionId ) {
        var session_id = SH.getDecodedSession( message.SessionId );
        var Session = SH.getSession( session_id );
        ConnectionState.setSession( Session );


        //console.log( 'TCP: Take session id: '+message.SessionId+' ('+session_id+')' );
        
        if( Session.getUserId() === null ) {
            callback( "You are not authorized" );
        } else {

            var UserId = Session.getUserId();
            SocketFrame.RegistryConnections.assignNewParticipant( UserId, function () {

                callback( "It`s all what I need" );

                var newParticipant = SocketFrame.RegistryConnections.getParticipantByUserId( UserId );

                ConnectionState.setParticipant( newParticipant );

                var onNewUserConnectionHook = SocketFrame.getHooks( 'Chat').onNewUserConnection( newParticipant );
            });
        }
    }
};