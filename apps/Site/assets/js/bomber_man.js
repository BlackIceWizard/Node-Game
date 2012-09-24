$(document).ready( function () {
    document.onkeydown = function( event ) { checkKeyCode( event, '1' ) };
    document.onkeyup = function( event ) { checkKeyCode( event, '0' ) };
});


function checkKeyCode(event, state) {

    var key_code = '';

    if(!event)
        var event = window.event;

    if (event.keyCode)
        key_code = event.keyCode;
    else if(event.which)
        key_code = event.which;


    var keyShift = event.shiftKey;
    var keyAlt   = event.altKey;
    var keyCtrl  = event.ctrlKey;

    if( BomberMan.initialized )
        BomberMan.keyboardListener( state,  key_code, keyShift, keyAlt, keyCtrl );
}

function PlayerConstructor () {
    this.Element = null;
    this.Position = null;
    this.AnimateState = 1;
    this.team = null;
    this.spawnDefence = true;
    this.spawnDefenceAnimationTimerId = null;
}

function PlayerDeadConstructor () {
    this.Element = null;
    this.Position = null;
    this.team = null;
    this.AnimateState = 1;
}

function BombConstructor () {
    this.Element = null;
    this.AnimateState = 1;
    this.Position = null;
    this.AnimateTimeoutId = null;
}

function BombExplosionConstructor () {
    this.Parts = [];
    this.AnimateState = 1;
    this.Position = null;
    this.range = null;
}

function BombExplosionPartConstructor () {
    this.Element = null;
    this.type = null;
    this.rotation = null;
    this.Position = null;
    this.numberInWawe = null;
}

function WallConstructor () {
    this.Element = null;
    this.Position = null;
}

function WallReconstructionMarkConstructor () {
    this.Element = null;
    this.Position = null;
}

function WallReconstructionConstructor () {
    this.Element = null;
    this.Position = null;
    this.AnimateState = 1;
}

function DestroyedWallConstructor () {
    this.Element = null;
    this.Position = null;
    this.AnimateState = 1;
}

BomberMan = new BomberManConstructor();

function BomberManConstructor( ) {
    this.Arena = {
        'Players' : {},
        'Bombs' : {},
        'Walls' : {},
        'WallReconstructionMarks' : {}
    };

    this.team = null;
    this.game_ident = null;
    this.initialized = false;
    this.ArenaElement = null;
    this.cell_size = 16;
    this.animation_period = 80;
    this.FieldDimension = null;
    this.SpawnDefenceFlickering = 60;

    this.BomberManSpriteSize = 18;

    this.keysState = {
        //up
        87 : 0,
        //left
        65 : 0,
        //right
        68 : 0,
        //bottom
        83 : 0,
        //bomb
        32 : 0
    };

    this.keysTimeoutIds = {};



    this.init = function ( params ){
        this.team = params.team;
        this.game_ident = params.game_ident;
        this.FieldDimension = params.FieldDimension;

        Connection.initiateDialog( Connection.DialogAreas.BomberMan, 'Init' );
        this.ArenaElement = $( '#arena' );
        $('.strong_wall_cell').css( 'background-position', getSprite( 'StrongWall' ) );
    };

    this.assignArenaState = function ( ArenaState ) {
        for( var i = 0; i < ArenaState.Players.length; i++ ) {
            this.assignNewPlayer( ArenaState.Players[i] );
        }

        for( var i = 0; i < ArenaState.Walls.length; i++ ) {
            var Coordinates = ArenaState.Walls[i].split( '-' );
            this.assignWall( Coordinates );
        }
    };

    this.markWallReconstruction = function ( Coordinates ) {
        ReconstructionMark = new WallReconstructionMarkConstructor();
        ReconstructionMark.Position = Coordinates;
        ReconstructionMark.Element = $( "<div class='sprite' style='width:16px; height:16px;'></div>" );
        this.ArenaElement.append( ReconstructionMark.Element );

        ReconstructionMark.Element.css( 'background-position', getSprite( 'WallReconstructionMark' ) );

        var LeftPosition = ( ReconstructionMark.Position[0] - 1 ) * this.cell_size;
        var TopPosition = ( ReconstructionMark.Position[1] - 1 ) * this.cell_size;

        ReconstructionMark.Element.css( 'left', LeftPosition );
        ReconstructionMark.Element.css( 'top', TopPosition );

        this.Arena.WallReconstructionMarks[Coordinates[0]+'-'+Coordinates[1]] = ReconstructionMark;
    };

    this.WallReconstruction = function( Coordinates ) {
        for( var i in this.Arena.WallReconstructionMarks ) {
            this.Arena.WallReconstructionMarks[i].Element.remove();
            delete this.Arena.WallReconstructionMarks[i];
        }

        for( var i =0; i< Coordinates.length; i++ ) {
            var WallReconstruction = new WallReconstructionConstructor();
            WallReconstruction.Position = Coordinates[i];
            this.assignWall( Coordinates[i] );
            this.Arena.Walls[Coordinates[i][0]+'-'+Coordinates[i][1]].Element.hide();

            this.showWallReconstruction( WallReconstruction );
        }
    };

    this.showWallReconstruction = function( WallReconstruction ) {
        this.actualizeWallReconstructionView( WallReconstruction );
        if( WallReconstruction.AnimateState <= 5 ) {
            WallReconstruction.AnimateState++;
            setTimeout( function() { BomberMan.showWallReconstruction( WallReconstruction ); }, BomberMan.animation_period );
        } else {
            WallReconstruction.Element.remove();
            if( typeof this.Arena.Walls[WallReconstruction.Position[0]+'-'+WallReconstruction.Position[1]] != "undefined" ) {
                this.Arena.Walls[WallReconstruction.Position[0]+'-'+WallReconstruction.Position[1]].Element.show();
            }
        }
    };

    this.actualizeWallReconstructionView = function ( WallReconstruction ) {
        if( WallReconstruction.Element === null ) {
            WallReconstruction.Element = $( "<div class='sprite' style='width:16px; height:16px;'></div>" );
            this.ArenaElement.append( WallReconstruction.Element );

            var LeftPosition = ( WallReconstruction.Position[0] - 1 ) * this.cell_size;
            var TopPosition = ( WallReconstruction.Position[1] - 1 ) * this.cell_size;

            WallReconstruction.Element.css( 'left', LeftPosition );
            WallReconstruction.Element.css( 'top', TopPosition );
        }

        WallReconstruction.Element.css( 'background-position', getSprite( 'WallReconstruction', WallReconstruction.AnimateState ) );
    };

    this.assignWall = function ( Coordinates ) {
        Wall = new WallConstructor();
        Wall.Position = Coordinates;
        Wall.Element = $( "<div class='sprite' style='width:16px; height:16px;'></div>" );
        this.ArenaElement.append( Wall.Element );

        Wall.Element.css( 'background-position', getSprite( 'Wall' ) );

        var LeftPosition = ( Wall.Position[0] - 1 ) * this.cell_size;
        var TopPosition = ( Wall.Position[1] - 1 ) * this.cell_size;

        Wall.Element.css( 'left', LeftPosition );
        Wall.Element.css( 'top', TopPosition );

        this.Arena.Walls[Coordinates[0]+'-'+Coordinates[1]] = Wall;
    };


    this.refreshTeamScore = function( team_score ) {
        $( '#blue_team_score').html( team_score[1] );
        $( '#red_team_score').html( team_score[2] );
    };

    this.assignNewPlayer = function ( PlayerData ) {

        var Player = new PlayerConstructor();
        var player_nick = PlayerData.nick;

        if( typeof this.Arena.Players[player_nick] == 'undefined' ) {
            this.Arena.Players[player_nick] = Player;
        } else {
            Player = this.Arena.Players[player_nick];
        }
        Player.Position = PlayerData.position;
        Player.team = PlayerData.team;
        Player.spawnDefence = PlayerData.spawn_defence;


        this.actualizePlayerView( Player );

        if( Player.spawnDefence && Player.spawnDefenceAnimationTimerId === null ) {
            this.enableSpawnDefence( Player );
        }
    };

    this.respawnPlayer = function ( PlayerData ) {

        var Player = new PlayerConstructor();
        var player_nick = PlayerData.nick;

        if( typeof this.Arena.Players[player_nick] == 'undefined' ) {
            this.Arena.Players[player_nick] = Player;
        } else {
            Player = this.Arena.Players[player_nick];
        }
        Player.Position = PlayerData.position;
        Player.team = PlayerData.team;
        Player.spawnDefence = PlayerData.spawn_defence;


        this.actualizePlayerView( Player );

        if( Player.spawnDefence ) {
            this.enableSpawnDefence( Player );
        }
    };

    this.enableSpawnDefence = function ( Player ) {
        Player.spawnDefenceAnimationTimerId = setTimeout( function() { BomberMan.animateSpawnDefence( Player ) }, BomberMan.SpawnDefenceFlickering );
    };

    this.animateSpawnDefence = function ( Player ) {
        Player.Element.toggle();
        Player.spawnDefenceAnimationTimerId = setTimeout( function() { BomberMan.animateSpawnDefence( Player ) }, BomberMan.SpawnDefenceFlickering );
    };

    this.deactivateSpawnDefence = function( nick ) {
        var Player = this.Arena.Players[nick];
        clearTimeout( Player.spawnDefenceAnimationTimerId );
        Player.Element.show();
    };

    this.actualizePlayerView = function ( Player ) {

        if( Player.Element === null ) {
            Player.Element = $( "<div class='sprite' style='width:18px; height:18px;'></div>" );
            this.ArenaElement.append( Player.Element );
        }

        Player.Element.css( 'background-position', getSprite( 'Player'+Player.team, Player.AnimateState, Player.Position[2] ) );

        var OverPixelsCorrection = Math.round( ( this.cell_size - this.BomberManSpriteSize ) / 2 );

        var LeftRoughPosition = ( Player.Position[0][0] - 1 ) * this.cell_size + OverPixelsCorrection;
        var TopRoughPosition = ( Player.Position[1][0] - 1 ) * this.cell_size + OverPixelsCorrection;
        var LeftAccuratePosition = LeftRoughPosition + Math.round( Player.Position[0][1] * ( this.cell_size / 5 ) );
        var TopAccuratePosition = TopRoughPosition + Math.round( Player.Position[1][1] * ( this.cell_size / 5 ) );

        Player.Element.css( 'left', LeftAccuratePosition );
        Player.Element.css( 'top', TopAccuratePosition );
    };

    this.removePlayer = function ( nick ) {
        this.Arena.Players[nick].Element.remove();
        delete this.Arena.Players[nick];
    };

    this.destroyWalls = function ( Walls ) {
        for( var i = 0; i < Walls.length; i++ ) {
            var Wall = this.Arena.Walls[ Walls[i] ];

            var DestroyedWall = new DestroyedWallConstructor();
            DestroyedWall.Position = Wall.Position;

            Wall.Element.remove();
            delete this.Arena.Walls[ Walls[i] ];

            this.showDestroyedWall( DestroyedWall );
        }
    };

    this.killPlayers = function ( Players ) {
        for( var i = 0; i < Players.length; i++ ) {
            var Player = this.Arena.Players[Players[i]];
            Player.Element.remove();

            var PlayerDead = new PlayerDeadConstructor();
            PlayerDead.Position = [ Player.Position[0][0], Player.Position[1][0]];
            PlayerDead.team = Player.team;

            delete this.Arena.Players[Players[i]];

            if (soundManager && soundManager.supported()) {
                //soundManager.stop( 'death' );
                soundManager.play( 'death' );
                // soundManager.sounds[self.soundID].play({pan:self.pan});
                // if (self.bonusSound != null) window.setTimeout(self.smashBonus,1000);
            }

            this.showPlayerDead( PlayerDead );
        }
    };

    this.showDestroyedWall = function( DestroyedWall ) {
        this.actualizeDestroyedWallView( DestroyedWall );
        if( DestroyedWall.AnimateState <= 6 ) {
            DestroyedWall.AnimateState++;
            setTimeout( function() { BomberMan.showDestroyedWall( DestroyedWall ); }, BomberMan.animation_period );
        } else {
            DestroyedWall.Element.remove();
        }
    };

    this.showPlayerDead = function( PlayerDead ) {
        this.actualizePlayerDeadView( PlayerDead );
        if( PlayerDead.AnimateState <= 7 ) {
            PlayerDead.AnimateState++;
            setTimeout( function() { BomberMan.showPlayerDead( PlayerDead ); }, BomberMan.animation_period );
        } else {
            PlayerDead.Element.remove();
        }
    };

    this.actualizeDestroyedWallView = function ( DestroyedWall ) {
        if( DestroyedWall.Element === null ) {
            DestroyedWall.Element = $( "<div class='sprite' style='width:16px; height:16px;'></div>" );
            this.ArenaElement.append( DestroyedWall.Element );

            var LeftPosition = ( DestroyedWall.Position[0] - 1 ) * this.cell_size;
            var TopPosition = ( DestroyedWall.Position[1] - 1 ) * this.cell_size;

            DestroyedWall.Element.css( 'left', LeftPosition );
            DestroyedWall.Element.css( 'top', TopPosition );
        }

        DestroyedWall.Element.css( 'background-position', getSprite( 'DestroyedWall', DestroyedWall.AnimateState ) );
    };

    this.actualizePlayerDeadView = function ( PlayerDead ) {
        if( PlayerDead.Element === null ) {
            PlayerDead.Element = $( "<div class='sprite' style='width:18px; height:18px;'></div>" );
            this.ArenaElement.append( PlayerDead.Element );

            var OverPixelsCorrection = Math.round( ( this.cell_size - this.BomberManSpriteSize ) / 2 );

            var LeftPosition = ( PlayerDead.Position[0] - 1 ) * this.cell_size + OverPixelsCorrection;
            var TopPosition = ( PlayerDead.Position[1] - 1 ) * this.cell_size + OverPixelsCorrection;

            PlayerDead.Element.css( 'left', LeftPosition );
            PlayerDead.Element.css( 'top', TopPosition );
        }

        PlayerDead.Element.css( 'background-position', getSprite( 'PlayerDead'+PlayerDead.team, PlayerDead.AnimateState ) );
    };

    this.keyboardListener = function ( state, key, shift, alt, ctrl ) {
        if( typeof BomberMan.keysState[key] !== 'undefined' && BomberMan.keysState[key] !== state ) {
            BomberMan.keysState[key] = state;
            Connection.initiateDialog( Connection.DialogAreas.BomberMan, 'Action', { 'key' : key, 'state' : state } );
        }
    };

    this.movePlayer = function( nick, position ) {
        this.Arena.Players[nick].Position = position;

        this.Arena.Players[nick].AnimateState++;
        if( this.Arena.Players[nick].AnimateState > 3 )
            this.Arena.Players[nick].AnimateState = 1;

        this.actualizePlayerView( this.Arena.Players[nick] );
    };

    this.allocateBomb = function ( position ) {
        var Bomb = new BombConstructor();

        Bomb.Position = position;

        this.Arena.Bombs[ position[0]+'-'+position[1] ] = Bomb;

        if (soundManager && soundManager.supported()) {
            //soundManager.stop( 'allocate_bomb' );
            soundManager.play( 'allocate_bomb' );
            // soundManager.sounds[self.soundID].play({pan:self.pan});
            // if (self.bonusSound != null) window.setTimeout(self.smashBonus,1000);
        }

        this.actualizeBombView( Bomb );

        BomberMan.animateBomb( Bomb );
    };

    this.actualizeBombView = function ( Bomb ) {
        if( Bomb.Element === null ) {
            Bomb.Element = $( "<div class='sprite' style='width:18px; height:18px;'></div>" );
            this.ArenaElement.append( Bomb.Element );

            var OverPixelsCorrection = Math.round( ( this.cell_size - this.BomberManSpriteSize ) / 2 );

            var LeftRoughPosition = ( Bomb.Position[0] - 1 ) * this.cell_size + OverPixelsCorrection;
            var TopRoughPosition = ( Bomb.Position[1] - 1 ) * this.cell_size + OverPixelsCorrection;

            Bomb.Element.css( 'left', LeftRoughPosition );
            Bomb.Element.css( 'top', TopRoughPosition );
        }

        Bomb.Element.css( 'background-position', getSprite( 'Bomb', Bomb.AnimateState ) );
    };

    this.animateBomb = function ( Bomb ) {
        if( typeof Bomb == "undefined" )
            return;

        Bomb.AnimateState++;
        if( Bomb.AnimateState > 3 )
            Bomb.AnimateState = 1;

        BomberMan.actualizeBombView( Bomb );
        Bomb.AnimateTimeoutId = window.setTimeout( function() { BomberMan.animateBomb( Bomb ); }, this.animation_period );
    };

    this.detonateBomb = function ( Position, range ) {
        var Bomb = this.Arena.Bombs[Position[0]+'-'+Position[1]];
        clearTimeout( Bomb.AnimateTimeoutId );
        Bomb.Element.remove();
        delete this.Arena.Bombs[Position[0]+'-'+Position[1]];

        var BombExplosion = new BombExplosionConstructor();
        BombExplosion.range = range;
        BombExplosion.Position = Position;

        if (soundManager && soundManager.supported()) {
            //soundManager.stop( 'bomb' );
            soundManager.play( 'bomb' );
            // soundManager.sounds[self.soundID].play({pan:self.pan});
            // if (self.bonusSound != null) window.setTimeout(self.smashBonus,1000);
        }

        this.showExplosion( BombExplosion );
    };

    this.showExplosion = function( BombExplosion ) {
        if( BombExplosion.Parts.length == 0 ) {

            var CenterPart = new BombExplosionPartConstructor();
            CenterPart.Position = BombExplosion.Position;
            CenterPart.type = 'BombExplosionCenter';

            BombExplosion.Parts.push( CenterPart );


            var coords_transformation = {
                '1' : [0, -1],
                '2' : [1, 0],
                '3' : [0, 1],
                '4' : [-1, 0]
            };

            //Top part
            for( var r = 1; r <= 4; r++ ) {
                for( var i = 1; i <= BombExplosion.range; i++ ) {
                    var ExplosionPart = new BombExplosionPartConstructor();

                    ExplosionPart.Position = [];
                    ExplosionPart.Position[0] = BombExplosion.Position[0]+coords_transformation[r][0] * i;
                    ExplosionPart.Position[1] = BombExplosion.Position[1]+coords_transformation[r][1] * i;

                    ExplosionPart.rotation = r;
                    ExplosionPart.numberInWawe = i;


                    if( !this.canPlaceExplosionPart( ExplosionPart ) )
                        break;

                    if( i == BombExplosion.range ) {
                        ExplosionPart.type = 'BombExplosionClose';
                    } else {
                        ExplosionPart.type = 'BombExplosionWave';
                    }

                    BombExplosion.Parts.push( ExplosionPart );
                }
            }
        }

        if( BombExplosion.AnimateState <= 7 ) {
            for( var j = 0 ; j < BombExplosion.Parts.length; j++ ){
                this.actualizeExplosionPart( BombExplosion.Parts[j], BombExplosion.AnimateState );
            }

            BombExplosion.AnimateState ++ ;

            window.setTimeout( function() { BomberMan.showExplosion( BombExplosion ); }, this.animation_period );
        } else {
            for( var v = 0 ; v < BombExplosion.Parts.length; v++ ){
                BombExplosion.Parts[v].Element.remove();
            }
        }
    };

    this.canPlaceExplosionPart = function ( ExplosionPart ) {
        if( ExplosionPart.Position[0]%2 == 0 && ExplosionPart.Position[1]%2 == 0 )
            return false;

        if( ExplosionPart.Position[0] < 1 || ExplosionPart.Position[0] > this.FieldDimension[0] )
            return false;

        if( ExplosionPart.Position[1] < 1 || ExplosionPart.Position[1] > this.FieldDimension[1] )
            return false;

        if( typeof this.Arena.Bombs[ExplosionPart.Position[0]+'-'+ExplosionPart.Position[1]] !=  "undefined" )
            return false;

        if( typeof this.Arena.Walls[ExplosionPart.Position[0]+'-'+ExplosionPart.Position[1]] !=  "undefined" )
            return false;

        return true;
    };

    this.actualizeExplosionPart = function ( ExplosionPart, animateState ) {
        if( ExplosionPart.Element === null ) {
            ExplosionPart.Element = $( "<div class='sprite' style='width:16px; height:16px;'></div>" );
            this.ArenaElement.append( ExplosionPart.Element );

            var LeftPosition = ( ExplosionPart.Position[0] - 1 ) * this.cell_size;
            var TopPosition = ( ExplosionPart.Position[1] - 1 ) * this.cell_size;

            ExplosionPart.Element.css( 'left', LeftPosition );
            ExplosionPart.Element.css( 'top', TopPosition );
        }

        var actualAnimateState = null;
        if( animateState > 4 ) {
            actualAnimateState = 4 - ( animateState - 4 );
        } else {
            actualAnimateState = animateState;
        }
        ExplosionPart.Element.css( 'background-position', getSprite( ExplosionPart.type, actualAnimateState, ExplosionPart.rotation ) );
    };
}

function getSprite( element, state, rotation ) {
    var stateList = null;

    if( element == "Player1" ) {
        if( rotation == 1 ) {
            stateList = { '1': '-58px -1px', '2': '-77px -1px', '3': '-96px -1px' };
        }
        if( rotation == 3 ) {
            stateList = { '1': '-1px -1px', '2': '-20px -1px', '3': '-39px -1px' };
        }
        if( rotation == 4 ) {
            stateList = { '1': '-1px -20px', '2': '-20px -20px', '3': '-39px -20px' };
        }
        if( rotation == 2 ) {
            stateList = { '1': '-58px -20px', '2': '-77px -20px', '3': '-96px -20px' };
        }

        return stateList[state];
    } else if( element == "Player2" ) {
        if( rotation == 1 ) {
            stateList = { '1': '-58px -58px', '2': '-77px -58px', '3': '-96px -58px' };
        }
        if( rotation == 3 ) {
            stateList = { '1': '-1px -58px', '2': '-20px -58px', '3': '-39px -58px' };
        }
        if( rotation == 4 ) {
            stateList = { '1': '-1px -77px', '2': '-20px -77px', '3': '-39px -77px' };
        }
        if( rotation == 2 ) {
            stateList = { '1': '-58px -77px', '2': '-77px -77px', '3': '-96px -77px' };
        }

        return stateList[state];
    } else if( element == "Wall" ) {
        return '-18px -242px';
    } else if( element == "WallReconstructionMark" ) {
        return '-18px -259px';
    } else if ( element == "StrongWall" ) {
        return '-1px -242px';
    } else if( element == "Bomb" ) {
        stateList = { '1': '-1px -115px', '2': '-20px -115px', '3': '-39px -115px' };
        return stateList[state];
    } else if( element == "BombExplosionCenter" ) {
        stateList = { '1': '-18px -157px', '2': '-69px -157px', '3': '-18px -208px', '4': '-69px -208px' };
        return stateList[state];
    } else if( element == "BombExplosionClose" ) {
        if( rotation == 1 ) {
            stateList = { '1': '-18px -140px', '2': '-69px -140px', '3': '-18px -191px', '4': '-69px -191px' };
        }
        if( rotation == 3 ) {
            stateList = { '1': '-18px -174px', '2': '-69px -174px', '3': '-18px -225px', '4': '-69px -225px' };
        }
        if( rotation == 4 ) {
            stateList = { 1: '-1px -157px', '2': '-52px -157px', '3': '-1px -208px', '4': '-52px -208px' };
        }
        if( rotation == 2 ) {
            stateList = { '1': '-35px -157px', '2': '-86px -157px', '3': '-35px -208px', '4': '-86px -208px' };
        }

        return stateList[state];
    } else if( element == "BombExplosionWave" ) {
        if( rotation == 1 ) {
            stateList = { '1': '-1px -174px', '2': '-52px -174px', '3': '-1px -225px', '4': '-52px -225px' };
        }
        if( rotation == 3 ) {
            stateList = { '1': '-1px -174px', '2': '-52px -174px', '3': '-1px -225px', '4': '-52px -225px' };
        }
        if( rotation == 4 ) {
            stateList = { '1': '-35px -174px', '2': '-86px -174px', '3': '-35px -225px', '4': '-86px -225px' };
        }
        if( rotation == 2 ) {
            stateList = { '1': '-35px -174px', '2': '-86px -174px', '3': '-35px -225px', '4': '-86px -225px' };
        }

        return stateList[state];
    } else if( element == "DestroyedWall" ) {
        stateList = { '1': '-35px -242px', '2': '-52px -242px', '3': '-69px -242px', '4': '-86px -242px', '5': '-103px -242px', '6': '-121px -242px' };
        return stateList[state];
    } else if( element == "WallReconstruction" ) {
        stateList = { '1': '-35px -259px', '2': '-52px -259px', '3': '-69px -259px', '4': '-86px -259px', '5': '-103px -259px' };
        return stateList[state];
    } else if( element == "PlayerDead1" ) {
        stateList = { '1': '-1px -39px', '2': '-20px -39px', '3': '-39px -39px', '4': '-58px -39px', '5': '-77px -39px', '6': '-96px -39px', '7': '-115px -39px' };
        return stateList[state];
    } else if( element == "PlayerDead2" ) {
        stateList = { '1': '-1px -96px', '2': '-20px -96px', '3': '-39px -96px', '4': '-58px -96px', '5': '-77px -96px', '6': '-96px -96px', '7': '-115px -96px' };
        return stateList[state];
    }




    return null;
}
