var privats = {};

exports.talk = function ( message, ConnectionState, AppState, startDialog, callback ) {
    var MP = exports.Services.ModuleProvider;
    var SH = exports.Services.SessionHandler;

    if( message == '<policy-file-request/>' ) {
       callback( MP.getModule( 'Helpers/Common' ).crossdomainXML() );
    } else if(message == 'Hello') {
        console.log( 'TCP: Send sessionid query' );
        callback( "WhatYourSessionID" );
    } else if( typeof message == 'object' && typeof message.SessionId != 'undefined' ) {
        var session_id = SH.getDecodedSession( message.SessionId );
        var Session = SH.getSession( session_id );
        ConnectionState.setSession( Session );


        console.log( 'TCP: Take session id: '+message.SessionId+' ('+session_id+')' );
        
        if( Session.getUserId() === null ) {
            callback( "You are not authorized" );
        } else {
            AppState.assignNewParticipant( Session.getUserId(), function () {
                callback( "It`s all what I need" );
            });
        }
    }
};