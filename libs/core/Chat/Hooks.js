var privats = {
    "SocketFrame" : null,
    "SocketDispatcher" : null
};

exports.setSocketFrame = function ( SocketFrame ) {
    privats.SocketFrame = SocketFrame;
};

exports.setSocketDispatcher = function ( SocketDispatcher ) {
    privats.SocketDispatcher = SocketDispatcher;
};


exports.onLostUserConnection = function ( User ) {
    var connections = privats.SocketFrame.RegistryConnections.getConnections();
    for( var i = 0 in connections ) {
        var ConnectionState = connections[i];

        if( ConnectionState.getConnectionStream().writable )
            privats.SocketDispatcher.initiateDialog( privats.SocketFrame.Areas.Chat, 'UserHasLeft', { 'User' : User }, ConnectionState, privats.SocketFrame );
    }
};

exports.onNewMessage = function ( message_text, User ) {
    var connections = privats.SocketFrame.RegistryConnections.getConnections();

    for( var i = 0 in connections ) {
        var ConnectionState = connections[i];
        //console.log( ConnectionState.getParticipant().getNick() );

        privats.SocketDispatcher.initiateDialog( privats.SocketFrame.Areas.Chat, 'ReceiveMessage', { 'text' : message_text, 'from_nick' : User.getNick() }, ConnectionState, privats.SocketFrame );
    }
};

exports.onNewUserConnection = function ( User ) {
    var connections = privats.SocketFrame.RegistryConnections.getConnections();

    for( var i = 0 in connections ) {
        var ConnectionState = connections[i];
        if( ConnectionState.getParticipant() !== null && User.getNick() != ConnectionState.getParticipant().getNick() )
            privats.SocketDispatcher.initiateDialog( privats.SocketFrame.Areas.Chat, 'UserHasJoined', { 'User' : User }, ConnectionState, privats.SocketFrame );
    }
};

