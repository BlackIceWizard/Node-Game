var internal = {};

exports.getInstance = function () {
    return new internal.Arena();
};

internal.Arena = function() {

    var fieldDimension = [ 25, 15 ];
    var Game = null;
    var Bombs = {};
    var Walls = [];
    var alwaysClearCells = [];

    this.assignGame = function ( pGame ) {
        Game = pGame;
    };

    this.getFieldDimension = function () {
        return fieldDimension;
    };

    this.choosePlayerSpawnPosition = function ( team ) {
        var AvailableSpawnPositions = [];
        var playersSpawnColumns = Game.getPlayerSpawnColumns();
        
        for( var x = (team == 1 ? 1 : fieldDimension[0] );
             (team == 1 ? x <= playersSpawnColumns : x >= fieldDimension[0]-playersSpawnColumns ) ;
             (team == 1 ? x++ : x-- ) ) {
            for( var y = 1; y <= fieldDimension[1]; y++ ) {
                var available_neighbors = 0;
                if( !this.isAvailableSpawnPosition( [x, y] ) ){
                    continue;
                }

                if( this.isAvailableSpawnPosition( [x+1, y] ) )
                    available_neighbors++;
                if( this.isAvailableSpawnPosition( [x-1, y] ) )
                    available_neighbors++;
                if( this.isAvailableSpawnPosition( [x, y+1] ) )
                    available_neighbors++;
                if( this.isAvailableSpawnPosition( [x, y-1] ) )
                    available_neighbors++;

                if( available_neighbors > 1 ){
                    AvailableSpawnPositions.push( [x, y] );
                }
            }
        }

        var SpawnPosition = AvailableSpawnPositions[Math.round( Math.random() * ( AvailableSpawnPositions.length - 1 ) )];

        return [ [ SpawnPosition[0], 0 ], [ SpawnPosition[1], 0 ], (team == 1 ? 2 : 4 ) ];
    };

    this.isAvailableSpawnPosition = function ( Position ) {
        if( Walls.indexOf( Position[0]+'-'+ Position[1] ) != -1 ) {
            return false;
        }

        if( Position[0]%2 == 0 && Position[1]%2 == 0 ) {
            return false;
        }

        if( Position[0] < 1 || Position[0] > fieldDimension[0] || Position[1] < 1 || Position[1] > fieldDimension[1] ) {
            return false;
        }

        return true;
    };

    this.isPossibleToMove = function( Player, NewPosition ) {

        if( NewPosition[0][0] == 1 && NewPosition[0][1] < 0 )
            return false;
        if( NewPosition[0][0] == fieldDimension[0] && NewPosition[0][1] > 0 )
            return false;
        if( NewPosition[1][0] == 1 && NewPosition[1][1] < 0 )
            return false;
        if( NewPosition[1][0] == fieldDimension[1] && NewPosition[1][1] > 0 )
            return false;

        if( NewPosition[0][1] != 0 || NewPosition[1][1] != 0 ) {
            var CheckPosition = this.getPlayerOverlayPosition( NewPosition );

            if( CheckPosition[0]%2 == 0 && CheckPosition[1]%2 == 0 ) {
                return false;
            }

            if( Walls.indexOf( CheckPosition[0]+'-'+ CheckPosition[1] ) != -1 ) {
                return false;
            }

            if( typeof Bombs[CheckPosition[0]+'-'+ CheckPosition[1]] != "undefined"  ){
                var CurrentPosition = Player.getPosition();

                if( CurrentPosition[0][1] != 0 || CurrentPosition[1][1] != 0 ) {
                    var SecondaryPosition = this.getPlayerOverlayPosition( CurrentPosition );

                    if( SecondaryPosition[0]+'-'+SecondaryPosition[1] != CheckPosition[0]+'-'+ CheckPosition[1]
                        && CheckPosition[0]+'-'+ CheckPosition[1] != CurrentPosition[0][0]+'-'+CurrentPosition[1][0] ) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }

        return true;
    };

    this.getPlayerOverlayPosition = function ( Position ) {
        var SecondaryPosition = null;
        if( Position[0][1] > 0 )
            SecondaryPosition = [ Position[0][0] +1, Position[1][0] ];
        if( Position[0][1] < 0 )
            SecondaryPosition = [ Position[0][0] -1, Position[1][0] ];
        if( Position[1][1] > 0 )
            SecondaryPosition = [ Position[0][0], Position[1][0]+1 ];
        if( Position[1][1] < 0 )
            SecondaryPosition = [ Position[0][0], Position[1][0]-1 ];

        return SecondaryPosition;
    };

    this.isPossibleToAllocateBomb = function ( Position ) {
        if( typeof Bombs[Position[0]+'-'+Position[1]] != 'undefined' ) {
            return false
        }

        return true;
    };

    this.allocateBomb = function ( Bomb ) {
        var BombPosition = Bomb.getPosition();
        var bomb_ident = BombPosition[0]+'-'+BombPosition[1];
        Bombs[bomb_ident] = Bomb;
    };

    this.removeBomb = function ( Bomb ) {
        var BombPosition = Bomb.getPosition();
        var bomb_id = BombPosition[0]+'-'+BombPosition[1];
        delete Bombs[bomb_id];
    };

    this.getAlwaysClearPosition = function () {
        if( alwaysClearCells.length == 0 ) {
            alwaysClearCells = [
                '1-1', '1-2', '2-1',
                fieldDimension[0]+'-1', fieldDimension[0]+'-2', ( fieldDimension[0] - 1 )+'-1',
                fieldDimension[0]+'-'+fieldDimension[1], fieldDimension[0]+'-'+( fieldDimension[0] - 1 ), ( fieldDimension[0] - 1 )+'-'+fieldDimension[1],
                '1-'+fieldDimension[1], '1-'+( fieldDimension[1] - 1 ), '2-'+fieldDimension[1]
            ];
        }
        return alwaysClearCells;
    };

    this.placeWallInitialSet = function () {
        var wallsPercentage = Game.getWallsPercentage();

        var alwaysClearCells = this.getAlwaysClearPosition();

        for( var x = 1; x <= fieldDimension[0]; x++ ) {
            for( var y = 1; y <= fieldDimension[1]; y++ ) {

                if( x%2 == 0 && y%2 == 0 ) {
                    continue;
                }

                var coord_ident = x+'-'+y;
                var chance_to_placing = ( Math.random() * 100 ) <= wallsPercentage;


                if( alwaysClearCells.indexOf( coord_ident ) == -1 && chance_to_placing ) {
                    Walls.push( coord_ident );
                }
            }
        }

    };

    this.getPlayersOccupiedPositions = function() {
        var OccupiedPositions = [];
        var Players = Game.getPlayers();
        for( var i = 0; i < Players.length; i++ ) {
            var Position = Players[i].getPosition();
            OccupiedPositions.push( [Position[0][0], Position[1][0]] );
            var OverlayPosition = this.getPlayerOverlayPosition( Position );
            if( OverlayPosition !== null ) {
                OccupiedPositions.push( OverlayPosition );
            }
        }

        return OccupiedPositions;
    };

    this.placeWallsWhichPossible = function ( pWalls ) {
        var PlayersOccupiedPositions = this.getPlayersOccupiedPositions();

        for( var i = 0; i < pWalls.length; i++ ) {
            if( Walls.indexOf( pWalls[i][0]+'-'+pWalls[i][1] ) != -1 ) {
                pWalls.splice( i, 1 );
                i--;
            } else {
                for( var p = 0; p < PlayersOccupiedPositions.length; p++ ) {
                    if( pWalls[i][0] == PlayersOccupiedPositions[p][0] && pWalls[i][1] == PlayersOccupiedPositions[p][1] ) {
                        pWalls.splice( i, 1 );
                        i--;
                        break;
                    }
                }
            }
        }

        for( var i = 0; i < pWalls.length; i++ ) {
            Walls.push( pWalls[i][0]+'-'+pWalls[i][1] );
        }

        return pWalls;
    };

    this.removeWall = function( position ) {
        var wall_index = Walls.indexOf( position );
        Walls.splice( wall_index, 1 );
    };


    this.getFullState = function () {
        var result = {};

        var Players = Game.getPlayers();
        result.Players = [];

        for( var i = 0; i < Players.length; i++ ) {
            result.Players.push( { 'nick' : Players[i].getUser().getNick(), 'position' : Players[i].getPosition(), 'team' : Players[i].getTeam(), 'spawn_defence' : Players[i].isSpawnDefenceActive() }  );
        }

        result.Walls = Walls;

        return result;
    };

    this.getEntitiesAffectedByExplosion = function ( Bomb ) {
        var Entities = {
            'Players' : [],
            'Walls' : [],
            'Bombs' : []
        };


        var ExplosionPosition = Bomb.getPosition();

        var coords_transformation = {
            '1' : [0, -1],
            '2' : [1, 0],
            '3' : [0, 1],
            '4' : [-1, 0]
        };

        for( var r = 1; r <= 4; r++ ) {
            for( var i = 0; i <= Bomb.getExplosionRange(); i++ ) {
                if( r > 1 && i == 0 ) {
                    continue;
                }

                var x = [ ExplosionPosition[0] + coords_transformation[r][0]*i ];
                var y = [ ExplosionPosition[1] + coords_transformation[r][1]*i ];

                if( x%2 == 0 && y%2 == 0  ) {
                    break;
                }



                var wall_index = Walls.indexOf( x+'-'+y );
                if( wall_index != -1 ) {
                    Entities.Walls.push( Walls[wall_index] );
                    break;
                }

                if( i != 0 && typeof Bombs[x+'-'+y] != 'undefined' ) {
                    Entities.Bombs.push( Bombs[x+'-'+y] );
                    break;
                }

                var Players = Game.getPlayers();
                for( var p = 0; p < Players.length; p++ ) {
                    var PlayerPosition = Players[p].getPosition();
                    if( PlayerPosition[0][0] == x && PlayerPosition[1][0] == y && !Players[p].isSpawnDefenceActive() ) {
                        Entities.Players.push( Players[p] );
                    }
                }
            }

        }

        return Entities;
    };
};





