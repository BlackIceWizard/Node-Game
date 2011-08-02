var privats = {};

privats.db = null;

exports.construct = function ( callback ) {
    var mongodb = exports.Services.ModuleProvider.getModule( 'MongoDB/Driver' );

    var database = exports.Services.Config.get( 'MongoDB', 'database' );
    var host = exports.Services.Config.get( 'MongoDB', 'host' );
    var port = exports.Services.Config.get( 'MongoDB', 'port' );


    privats.db = new mongodb.Db(
        database,
        new mongodb.Server( host, port, {} ),
        {}
    );

    privats.db.addListener("error", function( error ) {
       throw new Error( "Can`t connecting to mongo -- perhaps it isn't running? Error: \n"+error );
    });

    callback( exports );
}

exports.getConnection = function ( callback ) {
    privats.db.open( callback );
}