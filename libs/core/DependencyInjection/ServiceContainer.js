var privats = {};

privats.ModuleProvider = null;
privats.Services = {};
privats.ServicesConfig = [];
privats.eventEmitter = null;
privats.callback = null;
privats.serviceListEndIsReached = false;
privats.servicesInProgress = 0;


exports.construct = function ( ModuleProvider, ConfigModule ) {
    var events = require("events");

    privats.ModuleProvider = ModuleProvider;
    privats.loadServicesConfig(  ConfigModule );

    privats.eventEmitter = new events.EventEmitter();
    privats.eventEmitter.addListener( 'ServiceInit', privats.serviceInitListener );
    privats.eventEmitter.addListener( 'AfterServiceInit', privats.afterServiceInitListener );
    privats.eventEmitter.addListener( 'AfterServiceConstruct', privats.afterServiceConstructListener );
    privats.eventEmitter.addListener( 'ServiceLevelInit', privats.serviceLevelInitListener );

    return exports;
};

privats.loadServicesConfig = function ( ConfigModule ) {
    privats.ServicesConfig = privats.ModuleProvider.getModule( ConfigModule ).ServicesConfig;

};

exports.initServices = function ( callback ) {
    privats.callback = callback;
    privats.registerModuleProvider();

    privats.eventEmitter.emit( 'ServiceLevelInit', privats.ServicesConfig );

};

privats.serviceLevelInitListener = function ( serviceLevel ) {
    var NextLevel = null;
    for( var serviceName in serviceLevel ) {

        if( typeof privats.Services[serviceName] != 'undefined' )
            continue;

        if( serviceName == 'NextLevel' ) {
            NextLevel = serviceLevel[serviceName];
            privats.eventEmitter.emit( 'ServiceLevelInit', NextLevel );

            continue;
        }

        var serviceDefinition = serviceLevel[serviceName];

        serviceDefinition.name = serviceName;

        privats.servicesInProgress++;

        privats.eventEmitter.emit( 'ServiceInit', serviceDefinition );

    }

    if( NextLevel == null )
        privats.serviceListEndIsReached = true;
};

privats.serviceInitListener = function ( serviceDefinition ) {
    console.log( 'Init log: Service "'+serviceDefinition.name+'" initializing' );
    var Module = privats.ModuleProvider.getModule( serviceDefinition.module );

    if( typeof Module.construct != 'undefined' ) {
        Module.construct( function ( Module ) {
            privats.eventEmitter.emit( 'AfterServiceConstruct', serviceDefinition, Module );
        });
    } else
        privats.eventEmitter.emit( 'AfterServiceInit', serviceDefinition.name, Module );
};

privats.afterServiceConstructListener = function ( serviceDefinition, Module ) {
    privats.eventEmitter.emit( 'AfterServiceInit', serviceDefinition.name, Module );
}

privats.afterServiceInitListener= function ( ServiceName, Service ) {
    privats.Services[ServiceName] = Service;

    console.log( 'Init log: Service "'+ServiceName+'" initialized' );

    privats.servicesInProgress--;

    if( privats.serviceListEndIsReached && privats.servicesInProgress == 0 ) {
        privats.callback( privats.Services );
    }
};

privats.registerModuleProvider = function() {
    privats.Services['ModuleProvider'] = privats.ModuleProvider;
};

exports.getServices = function() {
    return privats.Services;
};
