var internal = {};

exports.talk = function ( message, ConnectionState, SocketFrame, startDialog, callback ) {
    SocketFrame.getHooks( 'Chat').onNewMessage( message.text, ConnectionState.getParticipant() );
};