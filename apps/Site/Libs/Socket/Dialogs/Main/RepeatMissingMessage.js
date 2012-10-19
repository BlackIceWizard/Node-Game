var internal = {};

exports.talk = function ( message, ConnectionState, SocketFrame, startDialog, callback ) {
    if( typeof message == 'object' && typeof message.message_number != "undefined" ) {

        var missed_message = ConnectionState.getMessageHistory().getMessage( message.message_number );
        if( missed_message !== null )
            ConnectionState.getConnectionStream().write( missed_message, 'UTF8' );
    } else {
        callback( 'MessageNotFound' );
    }
};

