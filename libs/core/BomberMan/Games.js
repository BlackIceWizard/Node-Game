var internal = {
    Games : []
};

exports.appendNewGame = function ( Game ) {
    internal.Games.push( Game );
};

exports.getGame = function ( key ) {
    if( typeof internal.Games[key] !== 'undefined' )
        return internal.Games[key];
    else
        return null;
};
