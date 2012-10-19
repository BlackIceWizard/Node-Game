var internal = {};

exports.dispatch = function( JSONData, ConnectionState, SocketFrame, stream ) {

    var MP = exports.Services.ModuleProvider;

    var data = JSON.parse( JSONData );

    if( typeof data.dialog == "undefined" )
        throw new Error('SocketDispatcher: dialog "'+JSON.stringify( JSONData )+'" receive data without dialog name');

    if( typeof data.message == "undefined" )
        throw new Error('SocketDispatcher: dialog "'+JSON.stringify( JSONData )+'" receive data without message');

    if( typeof data.area == "undefined" )
        throw new Error('SocketDispatcher: dialog "'+JSON.stringify( JSONData )+'" receive data without area');

    var AreaName = SocketFrame.getAreaName( data.area );

    if( AreaName === null )
        throw new Error('SocketDispatcher: dialog "'+JSON.stringify( JSONData )+'" receive data with not registered area number');

    var message = data.message;
    var dialogName = data.dialog;

    var output = MP.getModule( "Site/Socket/Dialogs/"+AreaName+"/"+dialogName ).talk( message, ConnectionState, SocketFrame, false, function ( output ) {
        //console.log( ConnectionState );
        internal.sendData( stream, data.area, dialogName, output, ConnectionState )
    });

};

exports.initiateDialog = function ( area, dialogName, message, ConnectionState, SocketFrame ) {
    var MP = exports.Services.ModuleProvider;
    var stream = ConnectionState.getConnectionStream();

    var AreaName = SocketFrame.getAreaName( area );

    var output = MP.getModule( "Site/Socket/Dialogs/"+AreaName+"/"+dialogName ).talk( message, ConnectionState, SocketFrame, true, function ( output ) {
        internal.sendData( stream, area, dialogName, output, ConnectionState )
    });
};

internal.sendData = function ( stream, area, dialogName, output, ConnectionState ) {
    if( output !== null ) {

        var messageNumber = ConnectionState.getMessageHistory().getNextMessageNumber();
        var str_output = JSON.stringify( { 'area' : area, 'dialog' : dialogName, 'n':messageNumber, 'message' : output })+"\n";
        ConnectionState.getMessageHistory().pushMessage( str_output );
        
        if( ConnectionState.isMessageQueueFree() ) {
            ConnectionState.takePlaceInMessageQueue();

            if( stream.writable ) {
                console.log( 'TCP output: '+str_output );
                stream.write( str_output, 'UTF8', function() {
                    setTimeout( function() { internal.afterSendData( stream, ConnectionState ) }, 20 );
                });
            } else {
                console.log( 'TCP error: stream not writable' );
            }
        } else {
            ConnectionState.pushInMessageQueue( str_output );
        }
    }
};


internal.afterSendData = function ( stream, ConnectionState ) {
    var str_output = ConnectionState.popOutOfMessageQueue();
    if( str_output === null ) {
        ConnectionState.setFreeMessageQueue();
    } else {
        if( stream.writable ) {
            console.log( 'TCP output: '+str_output );
            stream.write( str_output, 'UTF8', function() {
                setTimeout( function() { internal.afterSendData( stream, ConnectionState ) }, 20 );
            })
        } else {
            console.log( 'TCP error: stream not writable' );
        }
    }
};
