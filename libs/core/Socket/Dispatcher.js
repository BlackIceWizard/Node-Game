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
        console.log( ConnectionState );
        privats.sendData( stream, dialogName, output )
    });

};

exports.initiateDialog = function ( dialogName, message, ConnectionState, AppState, stream ) {
    var MP = exports.Services.ModuleProvider;
    var output = MP.getModule( "Site/Socket/Dialogs/"+dialogName ).talk( message, ConnectionState, AppState, true, function ( output ) {
        privats.sendData( stream, dialogName, output )
    });
};

privats.sendData = function ( stream, dialogName, output ) {
    if( output !== null ) {
        var str_output = JSON.stringify( { 'dialog' : dialogName, 'message' : output } ) + "\0";
        console.log( 'TCP output: '+str_output );
        stream.write( str_output );
    }
};
