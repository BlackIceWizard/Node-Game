var privats = {};

privats.ModuleProvider = null;
privats.Services = {};
privats.ServicesConfig = [];
privats.callback = null;
privats.serviceListEndIsReached = false;
privats.servicesInProgress = 0;


exports.construct = function ( ModuleProvider, ConfigModule ) {
    var events = require("events");

    privats.ModuleProvider = ModuleProvider;
    privats.loadServicesConfig(  ConfigModule );

    return exports;
};

privats.loadServicesConfig = function ( ConfigModule ) {
    privats.ServicesConfig = privats.ModuleProvider.getModule( ConfigModule ).ServicesConfig;

};

exports.initServices = function ( callback ) {
    privats.callback = callback;
    privats.registerModuleProvider();

    setTimeout( privats.serviceLevelInit, 0, privats.ServicesConfig );
};

privats.serviceLevelInit = function ( serviceLevel ) {
    var NextLevel = null;
    for( var serviceName in serviceLevel ) {

        if( typeof privats.Services[serviceName] != 'undefined' )
            continue;

        if( serviceName == 'NextLevel' ) {
            NextLevel = serviceLevel[serviceName];
            setTimeout( privats.serviceLevelInit, 0, NextLevel );

            continue;
        }

        var serviceDefinition = serviceLevel[serviceName];

        serviceDefinition.name = serviceName;

        privats.servicesInProgress++;

        setTimeout( privats.serviceInit, 0, serviceDefinition );
    }

    if( NextLevel == null )
        privats.serviceListEndIsReached = true;
};

privats.serviceInit = function ( serviceDefinition ) {
    console.log( 'Init log: Service "'+serviceDefinition.name+'" initializing' );
    var Module = privats.ModuleProvider.getModule( serviceDefinition.module );

    if( typeof Module.construct == 'function' ) {
        Module.construct( function ( Module ) {
            setTimeout( privats.afterServiceInit, 0, serviceDefinition.name, Module );
        });
    } else
        setTimeout( privats.afterServiceInit, 0, serviceDefinition.name, Module );
};

privats.afterServiceInit = function ( ServiceName, Service ) {
    privats.Services[ServiceName] = Service;

    console.log( 'Init log: Service "'+ServiceName+'" initialized' );

    privats.servicesInProgress--;

    if( privats.serviceListEndIsReached && privats.servicesInProgress == 0 )
        privats.callback( privats.Services );
};

privats.registerModuleProvider = function() {
    privats.Services['ModuleProvider'] = privats.ModuleProvider;
};

exports.getServices = function() {
    return privats.Services;
};
