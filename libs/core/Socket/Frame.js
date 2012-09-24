var privats = {
    Hooks : {},
    AreasReversed : null
};

exports.RegistryConnections = null;

exports.Areas = {};

exports.Games = null;


exports.registerHooks = function ( area, HookModule ) {
    privats.Hooks[area] = HookModule;
    privats.Hooks[area].setSocketFrame( exports );
    privats.Hooks[area].setSocketDispatcher( exports.Services.ModuleProvider.getModule( 'Core/Socket/Dispatcher' ) );
};

exports.getAreaName = function ( AreaNumber ) {
    if( privats.AreasReversed === null ) {
        privats.AreasReversed = {};
        for( var AreaName in exports.Areas ) {
            privats.AreasReversed[exports.Areas[AreaName]] = AreaName;
        }
    }

    if( typeof privats.AreasReversed[AreaNumber] != 'undefined' )
        return privats.AreasReversed[AreaNumber];
    else
        return null;
};

exports.getHooks = function ( area ) {
    return privats.Hooks[area];
};



