var privats = {};

privats.rootDirectory = '';
privats.ModuleRouts = null;
privats.ServiceContainer = null;
privats.CachedModules = {};

exports.construct = function ( rootDirectory ) {
    privats.rootDirectory = rootDirectory;
    privats.ModuleRouts = require( privats.rootDirectory+'/config/ModuleRouts' ).routs;
    return exports;
};

exports.setServiceContainer = function ( service_container ) {
    privats.ServiceContainer = service_container;
};

exports.getModule = function ( path ) {
    if( typeof privats.CachedModules[path] != 'undefined' )
        return privats.CachedModules[path];

    return privats.loadModule( path );    
};

privats.getRoute = function( path ) {
    var route = null;

    for( var i = 0; i < privats.ModuleRouts.length; i++ ) {
        if( path.indexOf( privats.ModuleRouts[i].rool ) === 0 ) {

            route = privats.rootDirectory + '/' + privats.ModuleRouts[i].route + path.substr( privats.ModuleRouts[i].rool.length );
            break;
        }
    }

    return route;
}

privats.loadModule = function( path ) {
   
    var route = privats.getRoute( path );

    var moduleresolved = true;

    try {
        require.resolve( route );
    } catch (err) {
        moduleresolved = false;
    }

    if( route === null ) {
        throw new Error('ModuleProvider: not found ROUTE for PATH "'+path+'"');
    }

    if( !moduleresolved ) {
        throw new Error('ModuleProvider: MODULE "'+path+'" not found by ROUTE "'+route+'"');
    }

    var module =  require( route );

    if( privats.ServiceContainer )
        privats.assignServicesIntoModule( module );

    return module;
}

exports.discoverPath = function( path, absolutePath ) {
    if( typeof absolutePath == 'undefined' )
        absolutePath = false; 

    var fs = require( 'fs' );
    var result = [];

    var route = privats.getRoute( path );

    var FileList = [];

    try {
        FileList = fs.readdirSync( route );
    } catch (err) {
        throw new Error('ModuleProvider: PATH "'+path+'" not found by ROUTE "'+route+'"');
    }

    for( var i = 0; i < FileList.length; i++ ) {
        if( FileList[i].substr( -3 ) != '.js' )
            continue;

        if( absolutePath )
            result.push( path + '/' + FileList[i].substr( 0, FileList[i].length-3 ) );
        else
            result.push( FileList[i].substr( 0, FileList[i].length-3 ) );

    }

    return result;
}



privats.assignServicesIntoModule = function ( module ) {
    module.Services = privats.ServiceContainer.getServices();
}