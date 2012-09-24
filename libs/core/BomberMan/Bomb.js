var privats = {};

exports.getInstance = function () {
    return new privats.Bomb();
};

privats.Bomb = function() {
    var Player = null;
    var Position = null;
    var BomberManHooks = null;
    var ExplosionTimerId = null;
    var ExplosionRange = 10;

    this.setBomberManHooks = function ( pHooks ) {
        BomberManHooks = pHooks;
    };

    this.getExplosionRange = function () {
        return ExplosionRange;
    };

    this.getBomberManHooks = function () {
        return BomberManHooks;
    };

    this.setPosition = function( pPosition ) {
        Position = pPosition;
    };

    this.getPosition = function() {
        return Position;
    };

    this.setPlayer = function ( pPlayer ) {
        Player = pPlayer;
    };

    this.getPlayer = function () {
        return Player;
    };

    this.setTimer = function () {
        var Bomb = this;
        ExplosionTimerId = setTimeout( function() { Bomb.detonate() }, 2000  );
    };

    this.detonate = function () {
        clearTimeout( ExplosionTimerId );
        var AffectedEntities = Player.getGame().processEffectsExplosion( this );
        BomberManHooks.onBombExplosion( Player.getGame(), this, AffectedEntities );
    };

    this.resetTimer = function ( chainDetonationDelay ) {
        clearTimeout( ExplosionTimerId );
        var Bomb = this;
        ExplosionTimerId = setTimeout( function() { Bomb.detonate() }, chainDetonationDelay  );
    };
};






