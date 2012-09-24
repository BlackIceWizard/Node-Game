exports.Index = function ( ViewParams, RequestState, Model ) {
    ViewParams.appendScriptLink( 'assets/js/bomber_man.js' );
    ViewParams.appendScriptLink( 'assets/soundmanager/script/soundmanager2-nodebug.js' );
    ViewParams.appendScriptLink( 'assets/js/sound_manager_init.js' );

    var Games = exports.Services.ModuleProvider.getModule( 'Core/BomberMan/Games' );
    var Game = Games.getGame( ViewParams.get( 'game_ident' ) );
    var fieldDimension = Game.getArenaFieldDimension();
    ViewParams.set( 'fieldDimension', fieldDimension );
    ViewParams.set( 'teamScore', Game.getTeamScore() );

    ViewParams.appendScriptDeclaration(
        'var BomberManParams = { "game_ident": '+ViewParams.get( 'game_ident' )+', "team":'+ViewParams.get( 'team' )+', "FieldDimension": [ '+fieldDimension[0]+', '+fieldDimension[1]+' ] };'
    );
};