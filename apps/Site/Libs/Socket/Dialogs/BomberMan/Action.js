var privats = {};

exports.talk = function ( message, ConnectionState, SocketFrame, startDialog, callback ) {
    ConnectionState.getGame().processUserAction( ConnectionState.getPlayer(), message.key, message.state );
};