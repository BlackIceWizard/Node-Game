var privats = {
    "SocketFrame" : null,
    "SocketDispatcher" : null
};

exports.setSocketFrame = function ( SocketFrame ) {
    privats.SocketFrame = SocketFrame;
};

exports.setSocketDispatcher = function ( SocketDispatcher ) {
    privats.SocketDispatcher = SocketDispatcher;
};

exports.onNewPlayer = function ( Game, newPlayer ) {
    var Players = Game.getPlayers();

    for( var i = 0; i < Players.length; i++ ) {
        var ConnectionState = Players[i].getConnectionState();
        privats.SocketDispatcher.initiateDialog(
            privats.SocketFrame.Areas.BomberMan,
            'NewPlayer',
            { 'nick' : newPlayer.getUser().getNick(), 'position' : newPlayer.getPosition(), 'team' : newPlayer.getTeam(), 'spawn_defence' : newPlayer.isSpawnDefenceActive() },
            ConnectionState,
            privats.SocketFrame );
    }
};

exports.onRespawnPlayer = function ( Game, newPlayer ) {
    var Players = Game.getPlayers();

    for( var i = 0; i < Players.length; i++ ) {
        var ConnectionState = Players[i].getConnectionState();
        privats.SocketDispatcher.initiateDialog(
            privats.SocketFrame.Areas.BomberMan,
            'RespawnPlayer',
            { 'nick' : newPlayer.getUser().getNick(), 'position' : newPlayer.getPosition(), 'team' : newPlayer.getTeam(), 'spawn_defence' : newPlayer.isSpawnDefenceActive() },
            ConnectionState,
            privats.SocketFrame );
    }
};

exports.onMovePlayer = function ( Game, Player ) {

    var Players = Game.getPlayers();

    for( var i = 0; i < Players.length; i++ ) {
        var ConnectionState = Players[i].getConnectionState();
        privats.SocketDispatcher.initiateDialog(
            privats.SocketFrame.Areas.BomberMan,
            'MovePlayer',
            { 'nick' : Player.getUser().getNick(), 'position' : Player.getPosition() },
            ConnectionState,
            privats.SocketFrame );
    }
};

exports.onDeactivateSpawnDefence = function ( Game, Player ) {

    var Players = Game.getPlayers();

    for( var i = 0; i < Players.length; i++ ) {
        var ConnectionState = Players[i].getConnectionState();
        privats.SocketDispatcher.initiateDialog(
            privats.SocketFrame.Areas.BomberMan,
            'DeactivateSpawnDefence',
            { 'nick' : Player.getUser().getNick() },
            ConnectionState,
            privats.SocketFrame );
    }
};

exports.onLostUserConnection = function ( ConnectionState ) {

    var Game = ConnectionState.getGame();
    var Player = ConnectionState.getPlayer();

    if( Game && Player ) {
        Game.removePlayer( Player );

        var Players = Game.getPlayers();

        for( var i = 0; i < Players.length; i++ ) {
            privats.SocketDispatcher.initiateDialog(
                privats.SocketFrame.Areas.BomberMan,
                'PlayerHasLeft',
                { 'nick' : Player.getUser().getNick() },
                Players[i].getConnectionState(),
                privats.SocketFrame );
        }
    }
};

exports.onAllocateBomb = function ( Game, Bomb ) {
    var Players = Game.getPlayers();

    for( var i = 0; i < Players.length; i++ ) {
        var ConnectionState = Players[i].getConnectionState();
        privats.SocketDispatcher.initiateDialog(
            privats.SocketFrame.Areas.BomberMan,
            'AllocateBomb',
            { 'position' : Bomb.getPosition() },
            ConnectionState,
            privats.SocketFrame );
    }
};

exports.onMarkWallReconstruction = function ( Game, Position ) {
    var Players = Game.getPlayers();

    for( var i = 0; i < Players.length; i++ ) {
        var ConnectionState = Players[i].getConnectionState();
        privats.SocketDispatcher.initiateDialog(
            privats.SocketFrame.Areas.BomberMan,
            'MarkWallReconstruction',
            { 'position' : Position },
            ConnectionState,
            privats.SocketFrame );
    }
};

exports.onWallReconstruction = function ( Game, Positions ) {
    var Players = Game.getPlayers();

    for( var i = 0; i < Players.length; i++ ) {
        var ConnectionState = Players[i].getConnectionState();
        privats.SocketDispatcher.initiateDialog(
            privats.SocketFrame.Areas.BomberMan,
            'WallReconstruction',
            { 'positions' : Positions },
            ConnectionState,
            privats.SocketFrame );
    }
};


exports.onBombExplosion = function ( Game, Bomb, AffectedEntities ) {
    var Players = Game.getPlayers();

    for( var i = 0; i < Players.length; i++ ) {
        var ConnectionState = Players[i].getConnectionState();
        privats.SocketDispatcher.initiateDialog(
            privats.SocketFrame.Areas.BomberMan,
            'BombExplosion',
            { 'position' : Bomb.getPosition(), 'range' : Bomb.getExplosionRange (), 'affected_entities' : AffectedEntities, 'team_score' : Game.getTeamScore() },
            ConnectionState,
            privats.SocketFrame );
    }
};