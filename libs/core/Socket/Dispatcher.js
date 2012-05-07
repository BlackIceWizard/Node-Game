var privats = {};

exports.dispatch = function( JSONData, ConnectionState, AppState, stream ) {

    var MP = exports.Services.ModuleProvider;

    if( JSONData[JSONData.length-1] == '\0' )
        JSONData = JSONData.substr( 0, JSONData.length -1 );

    var data = JSON.parse( JSONData );

    if( typeof data.dialog == "undefined" )
        throw new Error('SocketDispatcher: dialog "'+JSON.stringify( JSONData )+'" receive data without dialog name');

    if( typeof data.message == "undefined" )
        throw new Error('SocketDispatcher: dialog "'+JSON.stringify( JSONData )+'" receive data without message');

    var message = data.message;
    var dialogName = data.dialog;

    var output = MP.getModule( "Site/Socket/Dialogs/"+dialogName ).talk( message, ConnectionState, AppState, false, function ( output ) {
        //console.log( ConnectionState );
        privats.sendData( stream, dialogName, output, ConnectionState )
    });

};

exports.initiateDialog = function ( dialogName, message, ConnectionState, AppState ) {
    var MP = exports.Services.ModuleProvider;
    var stream = ConnectionState.getConnectionStream();
    var output = MP.getModule( "Site/Socket/Dialogs/"+dialogName ).talk( message, ConnectionState, AppState, true, function ( output ) {
        privats.sendData( stream, dialogName, output, ConnectionState )
    });
};

privats.sendData = function ( stream, dialogName, output, ConnectionState ) {
    if( output !== null ) {

        var str_output = JSON.stringify( { 'dialog' : dialogName, 'message' : output } ) + "\0";
        
        if( ConnectionState.isMessageQueueFree() ) {
            ConnectionState.takePlaceInMessageQueue();

            //if( stream.writable ) {
                //console.log( 'TCP output: '+str_output );

                stream.write( str_output, 'UTF8', function() {
                    //stream.pipe(stream);
                    privats.afterSendData( stream, ConnectionState )
                });
            /*} else {
                console.log( 'TCP error: stream not writable' );
            }*/
        } else {
            ConnectionState.pushInMessageQueue( str_output );
        }
    }
};


privats.afterSendData = function ( stream, ConnectionState ) {
    var str_output = ConnectionState.popOutOfMessageQueue();
    if( str_output === null ) {
        ConnectionState.setFreeMessageQueue();
    } else {
        if( stream.writable ) {
            //console.log( 'TCP output: '+str_output );
            //console.log( '---------------------------------------------------' );
            stream.write( str_output, 'UTF8', function() {
                stream.pipe(stream);
                privats.afterSendData( stream, ConnectionState )
            })
        } else {
            console.log( 'TCP error: stream not writable' );
        }
    }
};
