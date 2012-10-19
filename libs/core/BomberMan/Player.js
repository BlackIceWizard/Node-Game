var internal = {};

exports.getInstance = function () {
    return new internal.Player();
};

internal.Player = function() {
    var team = null;
    var User = null;
    var Game = null;
    var Position = null;
    var ConnectionState = null;
    var BomberManHooks = null;

    var MoveCycleStarted = false;
    var MovieTimerId = null;

    var TryingAllocateBomb = false;

    var SpawnDefence = false;
    var Dead = false;

    var keysState = {
        //up
        '87' : 0,
        //left
        '65' : 0,
        //right
        '68' : 0,
        //bottom
        '83' : 0,
        //bomb
        '32' : 0
    };

    this.setUser = function ( pUser ) {
        User = pUser;
    };

    this.getUser = function () {
        return User;
    };

    this.setConnectionState = function ( pConnectionState ) {
        ConnectionState = pConnectionState;
    };

    this.getConnectionState = function () {
        return ConnectionState;
    };

    this.setBomberManHooks = function ( pHooks ) {
        BomberManHooks = pHooks;
    };

    this.getBomberManHooks = function () {
        return BomberManHooks;
    };

    this.setGame = function ( pGame ) {
        Game = pGame;
    };

    this.getGame = function () {
        return Game;
    };

    this.kill = function () {
        Dead = true;
    };

    this.isDead = function () {
        return Dead;
    };

    this.reanimate = function() {
        Dead = false;
    };

    this.setTeam = function ( p_team ) {
        team = p_team;
    };

    this.getTeam = function () {
        return team;
    };

    this.setPosition = function( pPosition ) {
        Position = pPosition;
    };

    this.getPosition = function() {
        return Position;
    };

    this.setKeyState = function ( key, state ) {
        keysState[key] = parseInt( state );
    };

    this.getKeysState = function () {
        return keysState;
    };

    this.isAnyMoveKeyActive = function ( ) {
        return ( keysState['87'] || keysState['68'] || keysState['83'] || keysState['65'] ) == true;
    };

    this.isBombKeyActive = function ( ) {
        return ( keysState['32'] == 1 );
    };

    this.isTryingAllocateBomb = function () {
        return TryingAllocateBomb;
    };

    this.startTryingAllocateBomb = function () {
        TryingAllocateBomb = true;

        this.iterateTryingAllocateBomb( this );
    };

    this.iterateTryingAllocateBomb = function ( Player ) {
        if( Player.isTryingAllocateBomb() ) {
            Player.allocateBombIfPossible();
            setTimeout( Player.iterateTryingAllocateBomb, 160, Player );
        }
    };

    this.stopTryingAllocateBomb = function () {
        TryingAllocateBomb = false;
    };

    this.startMoveCycle = function () {
        MoveCycleStarted = true;

        this.iterateMovement( this );
    };

    this.iterateMovement = function ( Player ) {
        if( Player.isMoveCycleStarted() ) {
            MovieTimerId = setTimeout( function() {
                Player.moveIfPossible();
                Player.iterateMovement( Player )
            }, 80 );
        }
    };

    this.stopMoveCycle = function () {
        MoveCycleStarted = false;
        clearTimeout( MovieTimerId );
    };

    this.allocateBombIfPossible = function () {
        if( Dead )
            return false;

        var PositionForBombAllocation = [ Position[0][0], Position[1][0] ];
        if( Game.getArena().isPossibleToAllocateBomb( PositionForBombAllocation ) ) {
            var Bomb = exports.Services.ModuleProvider.getModule( 'Core/BomberMan/Bomb').getInstance();
            Bomb.setPlayer( this );
            Bomb.setPosition( PositionForBombAllocation );
            Bomb.setBomberManHooks( BomberManHooks );

            Game.getArena().allocateBomb( Bomb );

            BomberManHooks.onAllocateBomb( Game, Bomb );

            Bomb.setTimer()
        }
    };

    this.moveIfPossible = function () {

        if( Dead )
            return false;

        var NewPosition = null;

        if( keysState['87'] )
            NewPosition = this.calculatePosition( 1, 0, 0, 0 );

        if( keysState['68'] )
            NewPosition = this.calculatePosition( 0, 1, 0, 0 );

        if( keysState['83'] )
            NewPosition = this.calculatePosition( 0, 0, 1, 0 );

        if( keysState['65'] )
            NewPosition = this.calculatePosition( 0, 0, 0, 1 );

        if( NewPosition !== null && Game.getArena().isPossibleToMove( this, NewPosition ) ) {
            Position = NewPosition;
            BomberManHooks.onMovePlayer( Game, this );
        }
    };

    this.isMoveCycleStarted = function () {
        return MoveCycleStarted;
    };

    this.calculatePosition = function ( up, right, down, left ) {
        var NewPosition = [[Position[0][0],Position[0][1]],[Position[1][0],Position[1][1]],Position[2]];
        if( down ) {
            NewPosition[2] = 3;
            if( Position[1][1] < 2 ) {
                NewPosition[1][1] = Position[1][1] + 1;
            } else {
                NewPosition[1][1] = -2;
                NewPosition[1][0] = Position[1][0] + 1
            }
            NewPosition[0][1] = 0;
        }

        if( right ) {
            NewPosition[2] = 2;
            if( Position[0][1] < 2 ) {
                NewPosition[0][1] = Position[0][1] + 1;
            } else {
                NewPosition[0][1] = -2;
                NewPosition[0][0] = Position[0][0] + 1
            }
            NewPosition[1][1] = 0;
        }

        if( up ) {
            NewPosition[2] = 1;
            if( Position[1][1] > -2 ) {
                NewPosition[1][1] = Position[1][1] -1;
            } else {
                NewPosition[1][1] = 2;
                NewPosition[1][0] = Position[1][0] -1;
            }
            NewPosition[0][1] = 0;
        }

        if( left ) {
            NewPosition[2] = 4;
            if( Position[0][1] > -2 ) {
                NewPosition[0][1] = Position[0][1] -1;
            } else {
                NewPosition[0][1] = 2;
                NewPosition[0][0] = Position[0][0] -1;
            }
            NewPosition[1][1] = 0;
        }

        return NewPosition;
    };

    this.isSpawnDefenceActive = function() {
        return SpawnDefence;
    };

    this.activateSpawnDefence = function() {
        SpawnDefence = true;
        var Player = this;
        setTimeout( function() { Player.deactivateSpawnDefence(); }, Game.getPlayersSpawnDefenceDuration() );
    };

    this.deactivateSpawnDefence = function() {
        SpawnDefence = false;
        BomberManHooks.onDeactivateSpawnDefence( Game, this );
    }
};






