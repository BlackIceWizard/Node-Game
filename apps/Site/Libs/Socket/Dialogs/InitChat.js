var privats = {};

exports.talk = function ( message, ConnectionState, AppState, startDialog, callback ) {
    if( message == 'GetChatParticipantList' ) {
        callback( { 'ChatParticipants' : AppState.getParticipantNickList() } );
    }
};

