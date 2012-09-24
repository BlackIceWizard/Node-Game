exports.talk = function ( message, ConnectionState, SocketFrame, startDialog, callback ) {
    if( startDialog ) {
        callback( message );
    }
};