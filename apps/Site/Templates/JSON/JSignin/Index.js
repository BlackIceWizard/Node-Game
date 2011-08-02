exports.getContent = function ( data ) {
    if( data.get( 'success' ) ) {
        return '{ "errors" : {}, "success" : true }';
    } else {
        return '{ "errors" : '+JSON.stringify( data.get( 'errors' ) )+', "success" : false }';
    }
}