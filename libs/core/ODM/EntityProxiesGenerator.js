var privats = {};

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

            propertyTemplates.push( privats.getSimplePropertyTemplate( propertyName ) );
        }
        var entityProxyTemplate = privats.getEntityProxyTemplate( collectionName, propertyTemplates );

        eval( entityProxyTemplate );

        entityProxies[collectionName] = entityProxy;
    }

    return entityProxies;
};

privats.getSimplePropertyTemplate = function( propertyName ) {
    return 'privats.'+propertyName+' = null;'+
    "\n" +'this.get'+privats.ucfirst(propertyName)+' = function(){' +
    "\n" +'    return privats.'+propertyName+';' +
    "\n" +'};'+
    "\n" +'this.set'+privats.ucfirst(propertyName)+' = function( value ){' +
    "\n" +'    privats.'+propertyName+' = value;' +
    "\n" +'};';
}

privats.getEntityProxyTemplate = function( collectionName, propertyTemplates ) {
    var template = 'entityProxy = function() {' +
    "\n" +'var privats = {};' +
    "\n" +'this.getCollectionName = function(){' +
    "\n" +'    return "'+collectionName+'";' +
    "\n" +'};' +
    "\n" +'privats._id = null;' +
    "\n" +'this.getId = function(){' +
    "\n" +'    return privats._id;' +
    "\n" +'};' +
    "\n" +'this.setId = function( value ){' +
    "\n" +'    privats._id = value;' +
    "\n" +'};';

    for( var i = 0; i< propertyTemplates.length; i++ ) {
        template += "\n\n"+propertyTemplates[i];
    }
    template += "\n"+'};';

    return template;
}

privats.ucfirst = function (str) {
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
}
