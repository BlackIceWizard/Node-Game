var internal = {
    "SocketFrame" : null,
    "SocketDispatcher" : null
};

exports.setSocketFrame = function ( SocketFrame ) {
    internal.SocketFrame = SocketFrame;
};

exports.setSocketDispatcher = function ( SocketDispatcher ) {
    internal.SocketDispatcher = SocketDispatcher;
};

exports.onNewPlayer = function ( Game, newPlayer ) {
    var Players = Game.getPlayers();

    for( var i = 0; i < Players.length; i++ ) {
        var ConnectionState = Players[i].getConnectionState();
        internal.SocketDispatcher.initiateDialog(
            internal.SocketFrame.Areas.BomberMan,
            'NewPlayer',
            { 'nick' : newPlayer.getUser().getNick(), 'position' : newPlayer.getPosition(), 'team' : newPlayer.getTeam(), 'spawn_defence' : newPlayer.isSpawnDefenceActive() },
            ConnectionState,
            internal.SocketFrame );
    }
};

exports.onRespawnPlayer = function ( Game, newPlayer ) {
    var Players = Game.getPlayers();

    for( var i = 0; i < Players.length; i++ ) {
        var ConnectionState = Players[i].getConnectionState();
        internal.SocketDispatcher.initiateDialog(
            internal.SocketFrame.Areas.BomberMan,
            'RespawnPlayer',
            { 'nick' : newPlayer.getUser().getNick(), 'position' : newPlayer.getPosition(), 'team' : newPlayer.getTeam(), 'spawn_defence' : newPlayer.isSpawnDefenceActive() },
            ConnectionState,
            internal.SocketFrame );
    }
};

exports.onMovePlayer = function ( Game, Player ) {

    var Players = Game.getPlayers();

    for( var i = 0; i < Players.length; i++ ) {
        var ConnectionState = Players[i].getConnectionState();
        internal.SocketDispatcher.initiateDialog(
            internal.SocketFrame.Areas.BomberMan,
            'MovePlayer',
            { 'nick' : Player.getUser().getNick(), 'position' : Player.getPosition() },
            ConnectionState,
            internal.SocketFrame );
    }
};

exports.onDeactivateSpawnDefence = function ( Game, Player ) {

    var Players = Game.getPlayers();

    for( var i = 0; i < Players.length; i++ ) {
        var ConnectionState = Players[i].getConnectionState();
        internal.SocketDispatcher.initiateDialog(
            internal.SocketFrame.Areas.BomberMan,
            'DeactivateSpawnDefence',
            { 'nick' : Player.getUser().getNick() },
            ConnectionState,
            internal.SocketFrame );
    }
};

exports.onLostUserConnection = function ( ConnectionState ) {

    var Game = ConnectionState.getGame();
    var Player = ConnectionState.getPlayer();

    if( Game && Player ) {
        Game.removePlayer( Player );

        var Players = Game.getPlayers();

        for( var i = 0; i < Players.length; i++ ) {
            internal.SocketDispatcher.initiateDialog(
                internal.SocketFrame.Areas.BomberMan,
                'PlayerHasLeft',
                { 'nick' : Player.getUser().getNick() },
                Players[i].getConnectionState(),
                internal.SocketFrame );
        }
    }
};

exports.onAllocateBomb = function ( Game, Bomb ) {
    var Players = Game.getPlayers();

    for( var i = 0; i < Players.length; i++ ) {
        var ConnectionState = Players[i].getConnectionState();
        internal.SocketDispatcher.initiateDialog(
            internal.SocketFrame.Areas.BomberMan,
            'AllocateBomb',
            { 'position' : Bomb.getPosition() },
            ConnectionState,
            internal.SocketFrame );
    }
};

exports.onMarkWallReconstruction = function ( Game, Position ) {
    var Players = Game.getPlayers();

    for( var i = 0; i < Players.length; i++ ) {
        var ConnectionState = Players[i].getConnectionState();
        internal.SocketDispatcher.initiateDialog(
            internal.SocketFrame.Areas.BomberMan,
            'MarkWallReconstruction',
            { 'position' : Position },
            ConnectionState,
            internal.SocketFrame );
    }
};

exports.onWallReconstruction = function ( Game, Positions ) {
    var Players = Game.getPlayers();

    for( var i = 0; i < Players.length; i++ ) {
        var ConnectionState = Players[i].getConnectionState();
        internal.SocketDispatcher.initiateDialog(
            internal.SocketFrame.Areas.BomberMan,
            'WallReconstruction',
            { 'positions' : Positions },
            ConnectionState,
            internal.SocketFrame );
    }
};


exports.onBombExplosion = function ( Game, Bomb, AffectedEntities ) {
    var Players = Game.getPlayers();

    for( var i = 0; i < Players.length; i++ ) {
        var ConnectionState = Players[i].getConnectionState();
        internal.SocketDispatcher.initiateDialog(
            internal.SocketFrame.Areas.BomberMan,
            'BombExplosion',
            { 'position' : Bomb.getPosition(), 'range' : Bomb.getExplosionRange (), 'affected_entities' : AffectedEntities, 'team_score' : Game.getTeamScore() },
            ConnectionState,
            internal.SocketFrame );
    }
};