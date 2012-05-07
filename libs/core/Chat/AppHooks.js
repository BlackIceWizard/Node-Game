var privats = {
    'application' : null
};

exports.setApplication = function ( application ) {
    privats.application = application;
};


exports.onLostUserConnection = function ( User ) {
    var connections = privats.application.getConnections();
    for( var i = 0 in connections ) {
        var ConnectionState = connections[i];

        var SocketDispatcher = exports.Services.ModuleProvider.getModule( 'Core/Socket/Dispatcher' );
        if( ConnectionState.getConnectionStream().writable )
            SocketDispatcher.initiateDialog( 'UserHasLeft', { 'User' : User }, ConnectionState, privats.application );
    }
};

exports.onNewMessage = function ( message_text, User ) {
    var connections = privats.application.getConnections();

    for( var i = 0 in connections ) {
        var ConnectionState = connections[i];
        //console.log( ConnectionState.getParticipant().getNick() );

        var SocketDispatcher = exports.Services.ModuleProvider.getModule( 'Core/Socket/Dispatcher' );
        SocketDispatcher.initiateDialog( 'ReceiveMessage', { 'text' : message_text, 'from_nick' : User.getNick() }, ConnectionState, privats.application );
    }
};

exports.onNewUserConnection = function ( User ) {
    var connections = privats.application.getConnections();

    for( var i = 0 in connections ) {
        var ConnectionState = connections[i];
        var SocketDispatcher = exports.Services.ModuleProvider.getModule( 'Core/Socket/Dispatcher' );
        if( ConnectionState.getParticipant() !== null && User.getNick() != ConnectionState.getParticipant().getNick() )
            SocketDispatcher.initiateDialog( 'UserHasJoined', { 'User' : User }, ConnectionState, privats.application );
    }
};

