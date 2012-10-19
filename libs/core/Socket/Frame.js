var internal = {
    Hooks : {},
    AreasReversed : null
};

exports.RegistryConnections = null;

exports.Areas = {};

exports.Games = null;


exports.registerHooks = function ( area, HookModule ) {
    internal.Hooks[area] = HookModule;
    internal.Hooks[area].setSocketFrame( exports );
    internal.Hooks[area].setSocketDispatcher( exports.Services.ModuleProvider.getModule( 'Core/Socket/Dispatcher' ) );
};

exports.getAreaName = function ( AreaNumber ) {
    if( internal.AreasReversed === null ) {
        internal.AreasReversed = {};
        for( var AreaName in exports.Areas ) {
            internal.AreasReversed[exports.Areas[AreaName]] = AreaName;
        }
    }

    if( typeof internal.AreasReversed[AreaNumber] != 'undefined' )
        return internal.AreasReversed[AreaNumber];
    else
        return null;
};

exports.getHooks = function ( area ) {
    return internal.Hooks[area];
};



