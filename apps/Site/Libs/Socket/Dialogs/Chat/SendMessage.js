var privats = {};

exports.talk = function ( message, ConnectionState, SocketFrame, startDialog, callback ) {
    SocketFrame.getHooks( 'Chat').onNewMessage( message.text, ConnectionState.getParticipant() );
};