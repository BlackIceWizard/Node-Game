var internal = {
    "SocketFrame" : null,
    "SocketDispatcher" : null
};

exports.setSocketFrame = function ( SocketFrame ) {
    internal.SocketFrame = SocketFrame;
};

exports.setSocketDispatcher = function ( SocketDispatcher ) {
    internal.SocketDispatcher = SocketDispatcher;
};


exports.onLostUserConnection = function ( User ) {
    var connections = internal.SocketFrame.RegistryConnections.getConnections();
    for( var i = 0 in connections ) {
        var ConnectionState = connections[i];

        if( ConnectionState.getConnectionStream().writable )
            internal.SocketDispatcher.initiateDialog( internal.SocketFrame.Areas.Chat, 'UserHasLeft', { 'User' : User }, ConnectionState, internal.SocketFrame );
    }
};

exports.onNewMessage = function ( message_text, User ) {
    var connections = internal.SocketFrame.RegistryConnections.getConnections();

    for( var i = 0 in connections ) {
        var ConnectionState = connections[i];
        //console.log( ConnectionState.getParticipant().getNick() );

        internal.SocketDispatcher.initiateDialog( internal.SocketFrame.Areas.Chat, 'ReceiveMessage', { 'text' : message_text, 'from_nick' : User.getNick() }, ConnectionState, internal.SocketFrame );
    }
};

exports.onNewUserConnection = function ( User ) {
    var connections = internal.SocketFrame.RegistryConnections.getConnections();

    for( var i = 0 in connections ) {
        var ConnectionState = connections[i];
        if( ConnectionState.getParticipant() !== null && User.getNick() != ConnectionState.getParticipant().getNick() )
            internal.SocketDispatcher.initiateDialog( internal.SocketFrame.Areas.Chat, 'UserHasJoined', { 'User' : User }, ConnectionState, internal.SocketFrame );
    }
};

