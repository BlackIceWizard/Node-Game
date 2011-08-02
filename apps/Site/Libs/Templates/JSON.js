exports.getContentType = function () {
    return 'application/json; charset=UTF-8';
};

exports.getContent = function ( ViewParams, RequestState, callback ) {
    var Layout = exports.Services.ModuleProvider.getModule( 'Site/HTML/Templates/'+ViewParams.getTemplate()+'/'+ViewParams.getLayoutFolder()+'/'+ViewParams.getLayout() );
    callback( Layout.getContent( ViewParams ) );
};