var internal = {};

exports.getInstance = function () {
    return new internal.Game();
};

internal.Game = function() {

    var Players = [];
    var Arena = null;
    var wallsPercentage = 40;
    var playersSpawnColumns = 3;
    var playersRespawnDelay = 1000;
    var playersSpawnDefenceDuration = 1500;
    var chainDetonationDelay = 60;
    var wallReconstructionPeriod = 150000;

    var TeamsScore = { '1' : 0, '2' : 0 };

    this.construct = function () {
        Arena = exports.Services.ModuleProvider.getModule( 'Core/BomberMan/Arena').getInstance();
        Arena.assignGame( this );

        Arena.placeWallInitialSet();
    };

    this.runWallReconstructionPeriod = function() {

        if( Players.length == 0 )
            return;

        var WallReconstruction = exports.Services.ModuleProvider.getModule( 'Core/BomberMan/WallsReconstruction').getInstance();
        var SocketFrame = exports.Services.ModuleProvider.getModule( 'Core/Socket/Frame' );
        var Game = this;

        setTimeout( function() {
            WallReconstruction.setGame( Game );
            WallReconstruction.setBomberManHooks( SocketFrame.getHooks( 'BomberMan' ) );
            WallReconstruction.startReconstruction();

            Game.runWallReconstructionPeriod();
        }, wallReconstructionPeriod );
    };

    this.getTeamScore = function () {
        return TeamsScore;
    };

    this.assignTeamWin = function( team ) {
        TeamsScore[team]++;
    };

    this.getWallsPercentage = function () {
        return wallsPercentage;
    };

    this.setWallsPercentage = function ( pWallsPercentage ) {
        wallsPercentage = pWallsPercentage;
    };

    this.getPlayerSpawnColumns = function () {
        return playersSpawnColumns;
    };

    this.setPlayersSpawnColumns = function ( pPlayersSpawnColumns ) {
        playersSpawnColumns = pPlayersSpawnColumns;
    };

    this.getPlayersSpawnDefenceDuration = function () {
        return playersSpawnDefenceDuration;
    };

    this.setPlayersSpawnDefenceDuration = function ( pPlayersSpawnDefenceDuration ) {
        playersSpawnDefenceDuration = pPlayersSpawnDefenceDuration;
    };

    this.getArenaFieldDimension = function () {
        return Arena.getFieldDimension();
    };

    this.assignNewPlayer = function ( Player ) {
        Players.push( Player );
        this.spawnNewPlayer( Player );

        if( Players.length == 1 ) {
            this.runWallReconstructionPeriod();
        }
    };

    this.removePlayer = function ( Player ) {
        for( var i = 0; i < Players.length; i++ ) {
            if( Players[i].getUser().getNick() == Player.getUser().getNick() ) {
                Players.splice( i, 1 );
            }
        }
    };

    this.getArena = function () {
        return Arena;
    };


    this.getPlayers = function () {
        return Players;
    };

    this.spawnNewPlayer = function ( Player ) {
        Player.setPosition( this.chooseSpawnPosition( Player.getTeam() ) );
        Player.activateSpawnDefence();

        var SocketFrame = exports.Services.ModuleProvider.getModule( 'Core/Socket/Frame' );
        SocketFrame.getHooks( 'BomberMan' ).onNewPlayer( this, Player );
    };

    this.respawnPlayer = function( Player ) {
        Player.setPosition( this.chooseSpawnPosition( Player.getTeam() ) );
        Player.activateSpawnDefence();
        Player.reanimate();

        var SocketFrame = exports.Services.ModuleProvider.getModule( 'Core/Socket/Frame' );
        SocketFrame.getHooks( 'BomberMan' ).onRespawnPlayer( this, Player );
    };

    this.chooseSpawnPosition = function ( team ) {
        return Arena.choosePlayerSpawnPosition( team );
    };

    this.getFullArenaState = function() {
        return Arena.getFullState()
    };

    this.processUserAction = function ( Player, key, state ) {
        Player.setKeyState( key, state );

        if( Player.isAnyMoveKeyActive() ) {
            if( !Player.isMoveCycleStarted() ) {
                Player.startMoveCycle( );
            }
        } else {
            Player.stopMoveCycle()
        }

        if( Player.isBombKeyActive() ) {
            if( !Player.isTryingAllocateBomb() ) {
                Player.startTryingAllocateBomb()
            }
        } else {
            Player.stopTryingAllocateBomb()
        }
    };

    this.processEffectsExplosion = function ( Bomb ) {
        var Entities = Arena.getEntitiesAffectedByExplosion( Bomb );

        var Affected = {
            'Players' : [],
            'Walls' : []
        };

        if( Entities.Walls.length ) {
            for( var i=0; i < Entities.Walls.length; i++ ) {
                Affected.Walls.push( Entities.Walls[i] );
                Arena.removeWall( Entities.Walls[i] );
            }
        }

        if( Entities.Bombs.length ) {
            for( var i=0; i < Entities.Bombs.length; i++ ) {
                Entities.Bombs[i].resetTimer( chainDetonationDelay );
            }
        }

        var Game = this;

        if( Entities.Players.length ) {
            for( var i=0; i < Entities.Players.length; i++ ) {

                Affected.Players.push( Entities.Players[i].getUser().getNick() );
                Entities.Players[i].kill();

                this.assignTeamWin( 3-Entities.Players[i].getTeam() );
            }

            setTimeout( function() {
                for( var i=0; i < Entities.Players.length; i++ ) {
                    Game.respawnPlayer( Entities.Players[i] );
                }
            }, playersRespawnDelay );
        }

        Arena.removeBomb( Bomb );

        return Affected;
    };
};





