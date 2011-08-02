exports.trim = function ( str, chars ) {
    if( typeof chars == "undefined" )
        chars = " \t\r";

    str = exports.ltrim( str, chars );
    str = exports.rtrim( str, chars );

    return str;
}

exports.ltrim = function ( str, chars ) {
    if( typeof chars == "undefined" )
        chars = " \t\r";

    return str.replace(new RegExp( '^(['+chars+']*)' ), '');
}

exports.rtrim = function ( str, chars ) {
    if( typeof chars == "undefined" )
        chars = " \t\r";

    return str.replace(new RegExp( '(['+chars+']*)$' ), '');
}