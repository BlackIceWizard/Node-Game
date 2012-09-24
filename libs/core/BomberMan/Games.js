var privats = {
    Games : []
};

exports.appendNewGame = function ( Game ) {
    privats.Games.push( Game );
};

exports.getGame = function ( key ) {
    if( typeof privats.Games[key] !== 'undefined' )
        return privats.Games[key];
    else
        return null;
};
