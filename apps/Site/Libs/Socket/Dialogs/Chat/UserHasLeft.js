var internal = {};

exports.talk = function ( message, ConnectionState, SocketFrame, startDialog, callback ) {
    if( startDialog ) {
       callback( { 'UserNick' : message.User.getNick() } );
    }
};