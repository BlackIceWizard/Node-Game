var privats = {};

exports.talk = function ( message, ConnectionState, SocketFrame, startDialog, callback ) {
    if( message == 'GetChatParticipantList' ) {
        callback( { 'ChatParticipants' : SocketFrame.RegistryConnections.getParticipantNickList() } );
    }
};

