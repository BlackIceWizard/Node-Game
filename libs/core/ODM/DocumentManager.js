var internal = {};
internal.connection = null;
internal.mapper = null;
internal.bson = null;
internal.entityProxies = {};

exports.construct = function ( callback ) {
    var ModuleProvider = exports.Services.ModuleProvider;

    internal.mapper = ModuleProvider.getModule( 'Core/ODM/Mapper' );
    internal.bson = ModuleProvider.getModule( 'MongoDB/Driver/bson/bson' );
    internal.entityProxies = ModuleProvider.getModule( 'Core/ODM/EntityProxiesGenerator' ).generateProxies();
    
    var DBConnector = ModuleProvider.getModule( 'Core/ODM/DBConnector' );

    DBConnector.construct( function ( DBConnector ) {
        DBConnector.getConnection( function ( err, connection ) {
            internal.connection = connection;
            callback( exports );
        });
    });
};

exports.getConnection = function() {
    return internal.connection;
};

exports.newEntity = function ( collectionName ) {
    return new internal.entityProxies[collectionName];
}

exports.find = function( collectionName, id, callback ) {
    if( typeof id != "object" )
        var id = exports.toObjectID( id );
    internal.findOne( collectionName, { '_id' : id }, callback );
};

exports.findOneBy = function( collectionName, selector, callback ) {
    internal.findOne( collectionName, selector, callback );
};

exports.findBy = function( collectionName, selector, skip, limit, sortParams, callback ) {
    options = {};
    if( skip )
        options.skip = skip;
    if( limit )
        options.limit = limit;
    if( sortParams )
        options.sort = sortParams;

    var docs = [];

    internal.connection.collection( collectionName, function ( error, collection ) {
        collection.find( selector, options, function ( err, cursor ) {
            cursor.each( function(err, document) {
                if (document != null) {
                  docs.push( internal.mapper.map( collectionName, document ) );
                } else {
                  callback( docs );
                }
            });
        });
    });
};

exports.save = function( entity, callback ) {
    var collectionName = entity.getCollectionName();
    var doc = internal.mapper.mapReverse( entity );

    internal.connection.collection( collectionName, function ( error, collection ) {
        if( error )
            throw new Error('Database Error: Cann`t select collection "' + collectionName + '" with error: "' + error + '"');

        collection.save( doc, {}, function ( err, doc ) {

            if( typeof err !== 'undefined' && err !== null)
                throw new Error( 'Document Manager: "'+ err +'"' );

            if( typeof doc._id !== 'undefined' ) {
                entity.setId( doc._id )
            }

            if( typeof callback != 'undefined' )
                callback( entity );
        });
    });
};

exports.remove = function ( entity, callback ) {
    var collectionName = entity.getCollectionName();

    internal.connection.collection( collectionName, function ( error, collection ) {
        collection.remove( { '_id' : entity.getId() }, callback );
    });
}

exports.toJSON = function( entity ) {
    return internal.mapper.mapReverse( entity );
};


exports.toObjectID = function ( str ) {
    return new internal.bson.ObjectID( str );
};

exports.bind = function ( Entity, data ) {
    internal.mapper.mapToEntity( Entity, data );
};

internal.findOne = function ( collectionName, params, callback ) {
    internal.connection.collection( collectionName, function ( error, collection ) {
        collection.findOne( params, function ( err, document ) {
            if( !document )
                callback( null );
            else {
                callback( internal.mapper.map( collectionName, document ) );
            }
        });
    });
};