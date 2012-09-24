exports.AssignInGame = function ( ActionParams, ViewParams, Model, RequestState, callback ) {
    var MP = exports.Services.ModuleProvider;
    var Games = MP.getModule( 'Core/BomberMan/Games' );

    if( ActionParams.game !== null && ( ActionParams.team == 1 || ActionParams.team == 2 ) ){
        ViewParams.set( 'game_ident', ActionParams.game );
        ViewParams.set( 'team', ActionParams.team );


        callback();
    } else {
        RequestState.setRedirect( '/' );
        callback();
    }
};
