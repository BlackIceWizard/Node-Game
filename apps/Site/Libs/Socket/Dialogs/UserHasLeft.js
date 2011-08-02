var privats = {};

exports.talk = function ( message, ConnectionState, AppState, startDialog, callback ) {
    if( startDialog ) {
       callback( { 'UserNick' : message.User.getNick() } );
    }
};