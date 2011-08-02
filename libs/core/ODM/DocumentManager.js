var privats = {};
privats.connection = null;
privats.mapper = null;
privats.bson = null;
privats.entityProxies = {};

exports.construct = function ( callback ) {
    var ModuleProvider = exports.Services.ModuleProvider;

    privats.mapper = ModuleProvider.getModule( 'Core/ODM/Mapper' );
    privats.bson = ModuleProvider.getModule( 'MongoDB/Driver/bson/bson' );
    privats.entityProxies = ModuleProvider.getModule( 'Core/ODM/EntityProxiesGenerator' ).generateProxies();
    
    var DBConnector = ModuleProvider.getModule( 'Core/ODM/DBConnector' );

    DBConnector.construct( function ( DBConnector ) {
        DBConnector.getConnection( function ( err, connection ) {
            privats.connection = connection;
            callback( exports );
        });
    });
};

exports.getConnection = function() {
    return privats.connection;
};

exports.newEntity = function ( collectionName ) {
    return new privats.entityProxies[collectionName];
}

exports.find = function( collectionName, id, callback ) {
    if( typeof id != "object" )
        var id = exports.toObjectID( id );
    privats.findOne( collectionName, { '_id' : id }, callback );
};

exports.findOneBy = function( collectionName, selector, callback ) {
    privats.findOne( collectionName, selector, callback );
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

    privats.connection.collection( collectionName, function ( error, collection ) {
        collection.find( selector, options, function ( err, cursor ) {
            cursor.each( function(err, document) {
                if (document != null) {
                  docs.push( privats.mapper.map( collectionName, document ) );
                } else {
                  callback( docs );
                }
            });
        });
    });
};

exports.save = function( entity, callback ) {
    var collectionName = entity.getCollectionName();
    var doc = privats.mapper.mapReverse( entity );

    privats.connection.collection( collectionName, function ( error, collection ) {
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

    privats.connection.collection( collectionName, function ( error, collection ) {
        collection.remove( { '_id' : entity.getId() }, callback );
    });
}

exports.toJSON = function( entity ) {
    return privats.mapper.mapReverse( entity );
};


exports.toObjectID = function ( str ) {
    return new privats.bson.ObjectID( str );
};

exports.bind = function ( Entity, data ) {
    privats.mapper.mapToEntity( Entity, data );
};

privats.findOne = function ( collectionName, params, callback ) {
    privats.connection.collection( collectionName, function ( error, collection ) {
        collection.findOne( params, function ( err, document ) {
            if( !document )
                callback( null );
            else {
                callback( privats.mapper.map( collectionName, document ) );
            }
        });
    });
};