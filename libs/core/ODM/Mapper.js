var privats = {};

exports.map = function ( collectionName, doc ) {
    var Entity = exports.Services.DocumentManager.newEntity( collectionName );
    return exports.mapToEntity( Entity, doc );
}

exports.mapToEntity = function ( Entity, doc ) {
    var EntityDefinition = exports.Services.ModuleProvider.getModule( 'Core/Entities/'+Entity.getCollectionName() );

    Entity.setId( doc._id );

    for( var propertyName in EntityDefinition.entityDefinition ) {
        if( typeof doc[ propertyName ] == 'undefined' )
            continue;

        Entity['set'+privats.ucfirst( propertyName )]( doc[propertyName] );
    }
    return Entity;
}

exports.mapReverse = function ( Entity ) {
    var collectionName = Entity.getCollectionName();
    var EntityDefinition = exports.Services.ModuleProvider.getModule( 'Core/Entities/'+collectionName );

    var doc = {};

    if( Entity.getId() )
        doc._id = Entity.getId();

    for( var propertyName in EntityDefinition.entityDefinition )
        doc[propertyName] = Entity['get'+privats.ucfirst( propertyName )]();

    return doc;
}

privats.ucfirst = function (str) {
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
}