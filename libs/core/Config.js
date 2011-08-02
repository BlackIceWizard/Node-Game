var privats = {};
privats.configration = {};

exports.construct = function ( callback ) {
    privats.configration = exports.Services.ModuleProvider.getModule( 'Config/General' ).configuration;

    callback( exports );
}

exports.get = function ( section, key ) {
    return privats.configration[section][key];
}
