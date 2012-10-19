var internal = {};

exports.getInstance = function () {
    return new internal.WallsReconstruction();
};

internal.WallsReconstruction = function() {
    var Game = null;
    var BomberManHooks = null;
    var CellsForReconstruction = [];
    var maxWalls = 30;

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

    this.startReconstruction = function () {
        var fieldDimension = Game.getArenaFieldDimension();
        var spawnColumns = Game.getPlayerSpawnColumns();

        var start_appear = [];

        var xLimits = spawnColumns;
        if( spawnColumns % 2 == 1 ) {
            xLimits++;
        }

        start_appear[0] = ( Math.round( Math.random() *( fieldDimension[0]/2 - xLimits ) ) + 1 ) * 2 - 1 + xLimits;
        start_appear[1] = ( Math.round( Math.random() *( fieldDimension[1]/2 ) ) + 1 ) * 2 - 1;

        CellsForReconstruction.push( start_appear );

        BomberManHooks.onMarkWallReconstruction( Game, start_appear );

        this.runReconstructionPeriod();
    };

    this.runReconstructionPeriod = function () {
        if( CellsForReconstruction.length >= maxWalls ){
            this.allocateWallsOnMarkers();
        } else {

            var newMarkPosition = null;
            for( var i = 1; i <= 200; i++ ) {
                var Mark = CellsForReconstruction[Math.round( Math.random()*( CellsForReconstruction.length-1 ) )];
                var availablePositions = [];
                if( this.canMarkPosition( [Mark[0]+1, Mark[1]] ) )
                    availablePositions.push( [Mark[0]+1, Mark[1]] );
                if( this.canMarkPosition( [Mark[0]-1, Mark[1]] ) )
                    availablePositions.push( [Mark[0]-1, Mark[1]] );
                if( this.canMarkPosition( [Mark[0], Mark[1]+1] ) )
                    availablePositions.push( [Mark[0], Mark[1]+1] );
                if( this.canMarkPosition( [Mark[0], Mark[1]-1] ) )
                    availablePositions.push( [Mark[0], Mark[1]-1] );

                if( availablePositions.length ) {
                    newMarkPosition = availablePositions[Math.round( Math.random()*( availablePositions.length-1 ) )];
                    break;
                }
            }

            if( newMarkPosition === null ) {
                this.allocateWallsOnMarkers();
            } else {
                CellsForReconstruction.push( newMarkPosition );
                BomberManHooks.onMarkWallReconstruction( Game, newMarkPosition );

                var WallsReconstruction = this;
                setTimeout( function() { WallsReconstruction.runReconstructionPeriod(); }, 100 );
            }
        }
    };

    this.canMarkPosition = function( Position ) {
        var fieldDimension = Game.getArenaFieldDimension();
        var alwaysClearPosition = Game.getArena().getAlwaysClearPosition();

        if( alwaysClearPosition.indexOf( Position[0]+'-'+Position[1] ) !== -1 )
            return false;

        if( Position[0]%2 == 0 &&  Position[1]%2 == 0 )
            return false;

        if( Position[0] <= 0 ||  Position[1] <= 0 )
            return false;

        if( Position[0] > fieldDimension[0] ||  Position[1]  > fieldDimension[1] )
            return false;

        for( var i = 0; i < CellsForReconstruction.length; i++ ) {
            if( CellsForReconstruction[i][0] == Position[0] && CellsForReconstruction[i][1] == Position[1] )
                return false;
        }

        return true;
    };

    this.allocateWallsOnMarkers = function () {
        CellsForReconstruction = Game.getArena().placeWallsWhichPossible( CellsForReconstruction );
        BomberManHooks.onWallReconstruction( Game, CellsForReconstruction );
    }
};






