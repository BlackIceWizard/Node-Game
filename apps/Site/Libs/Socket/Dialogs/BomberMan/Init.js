var privats = {};

exports.talk = function ( message, ConnectionState, SocketFrame, startDialog, callback ) {
    if( typeof message == 'object' && typeof message.TakeMeInGame == 'object' && typeof message.TakeMeInGame.game !== "undefined" && typeof message.TakeMeInGame.team !== "undefined" ) {

        var Game = SocketFrame.Games.getGame( parseInt( message.TakeMeInGame.game ) );
        if( Game !== null ) {
            var MP = exports.Services.ModuleProvider;
            var Player = MP.getModule( 'Core/BomberMan/Player').getInstance();

            var UserId = ConnectionState.getSession().getUserId();

            ConnectionState.setGame( Game );

            Player.setTeam( parseInt( message.TakeMeInGame.team ) );
            Player.setUser( SocketFrame.RegistryConnections.getParticipantByUserId( UserId ) );
            Player.setGame( ConnectionState.getGame() );
            Player.setBomberManHooks( SocketFrame.getHooks( 'BomberMan' ) );
            Player.setConnectionState( ConnectionState );

            Game.assignNewPlayer( Player );

            ConnectionState.setPlayer( Player );

            callback( 'YouAreInGameNow' );
        }
    } else if( message == "GiveMeFullArenaState" ) {
        var Game = ConnectionState.getGame();
        var ArenaState = Game.getFullArenaState();

        callback( { 'FullArenaState' : ArenaState } );
    }
};

