var internal = {};

exports.generateProxies = function () {
    var entityDefinitionNames = exports.Services.ModuleProvider.discoverPath( 'Core/Entities' );
    var entityProxies = {};

    for( var di = 0; di < entityDefinitionNames.length; di++ ) {
        var collectionName = entityDefinitionNames[di];
        var entityDefinition =  exports.Services.ModuleProvider.getModule( 'Core/Entities/'+collectionName );

        var entityProxy = null;

        var propertyTemplates = [];

        for( var propertyName in entityDefinition.entityDefinition ) {
            propertyDefiniton = entityDefinition.entityDefinition[propertyName];

            propertyTemplates.push( internal.getSimplePropertyTemplate( propertyName ) );
        }
        var entityProxyTemplate = internal.getEntityProxyTemplate( collectionName, propertyTemplates );

        eval( entityProxyTemplate );

        entityProxies[collectionName] = entityProxy;
    }

    return entityProxies;
};

internal.getSimplePropertyTemplate = function( propertyName ) {
    return 'internal.'+propertyName+' = null;'+
    "\n" +'this.get'+internal.ucfirst(propertyName)+' = function(){' +
    "\n" +'    return internal.'+propertyName+';' +
    "\n" +'};'+
    "\n" +'this.set'+internal.ucfirst(propertyName)+' = function( value ){' +
    "\n" +'    internal.'+propertyName+' = value;' +
    "\n" +'};';
}

internal.getEntityProxyTemplate = function( collectionName, propertyTemplates ) {
    var template = 'entityProxy = function() {' +
    "\n" +'var internal = {};' +
    "\n" +'this.getCollectionName = function(){' +
    "\n" +'    return "'+collectionName+'";' +
    "\n" +'};' +
    "\n" +'internal._id = null;' +
    "\n" +'this.getId = function(){' +
    "\n" +'    return internal._id;' +
    "\n" +'};' +
    "\n" +'this.setId = function( value ){' +
    "\n" +'    internal._id = value;' +
    "\n" +'};';

    for( var i = 0; i< propertyTemplates.length; i++ ) {
        template += "\n\n"+propertyTemplates[i];
    }
    template += "\n"+'};';

    return template;
}

internal.ucfirst = function (str) {
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
}
