var privats = {};

exports.talk = function ( message, ConnectionState, AppState, startDialog, callback ) {
    AppState.Hooks.onNewMessage( message.text, ConnectionState.getParticipant() );
};