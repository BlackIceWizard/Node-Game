var internal = {};

internal.db = null;

exports.construct = function ( callback ) {
    var mongodb = exports.Services.ModuleProvider.getModule( 'MongoDB/Driver' );

    var database = exports.Services.Config.get( 'MongoDB', 'database' );
    var host = exports.Services.Config.get( 'MongoDB', 'host' );
    var port = exports.Services.Config.get( 'MongoDB', 'port' );


    internal.db = new mongodb.Db(
        database,
        new mongodb.Server( host, port, {} ),
        {}
    );

    internal.db.addListener("error", function( error ) {
       throw new Error( "Can`t connecting to mongo -- perhaps it isn't running? Error: \n"+error );
    });

    callback( exports );
}

exports.getConnection = function ( callback ) {
    internal.db.open( callback );
}