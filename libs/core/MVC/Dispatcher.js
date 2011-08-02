var privats = {};

privats.eventEmitter = null;

exports.construct = function () {
    privats.router = exports.Services.ModuleProvider.getModule( 'Core/MVC/Router' );

    var events = require("events");

    privats.eventEmitter = new events.EventEmitter();
    privats.eventEmitter.addListener( 'grabbingRequestData', privats.grabbingRequestDataListener );
    privats.eventEmitter.addListener( 'executingController', privats.executingControllerListener );
    privats.eventEmitter.addListener( 'executingView', privats.executingViewListener );
    privats.eventEmitter.addListener( 'renderingTemplate', privats.renderingTemplateListener );
};

exports.dispatch = function ( request, response, sessionid ) {

    var MP = exports.Services.ModuleProvider;

    var route = privats.router.getRoute( request );

    var Conrtoller = MP.getModule( 'Site/Components/'+route.Component+'/Controller' );
    var Model      = MP.getModule( 'Site/Components/'+route.Component+'/Model' );
    var View       = MP.getModule( 'Site/Components/'+route.Component+'/View' );

    var RequestState = MP.getModule( 'Core/MVC/RequestState' ).getInstance();
    RequestState.setRequest( request );
    RequestState.setResponse( response );
    RequestState.setSession( sessionid );

    var namespace = { 'route' : route, 'Conrtoller' : Conrtoller, 'Model' : Model, 'View' : View, 'RequestState' : RequestState };

    privats.eventEmitter.emit( "grabbingRequestData", namespace );
};

privats.grabbingRequestDataListener = function ( namespace ) {

    var request = namespace.RequestState.getRequest();
    var RequestProcessor = exports.Services.RequestProcessor.getInstance( request.headers['content-type'] );

    var requestStr = "";
    
    request.addListener("data", function (chunk) { requestStr += chunk } );
    request.addListener("end", function () {
        RequestProcessor.parseRequestStr( requestStr );
        namespace.RequestState.setRequestData( RequestProcessor );
        privats.eventEmitter.emit( "executingController", namespace );
    } );
};

privats.executingControllerListener = function( namespace ) {
    var action = privats.ucfirst( namespace.route.ActionParams.action );

    if( typeof namespace.Conrtoller[action] == 'undefined'  )
        throw new Error('Dispatcher: controller "Site/Components/'+namespace.route.Component+'/Controller" does not contain function "'+action+'"');

    namespace.Conrtoller[action]( namespace.route.ActionParams, namespace.route.ViewParams, namespace.Model, namespace.RequestState, function () {

        //if( namespace.RequestState.setResendSessionCookie() )
        exports.Services.ModuleProvider.getModule( 'Core/Session/Handler' ).sendSessionCookie( namespace.RequestState.getSessionId(), namespace.RequestState.getResponse() );

        var redirect = namespace.RequestState.getRedirect();
        if( redirect ) {
            var response = namespace.RequestState.getResponse();
            response.writeHead(301, {'Location': redirect } );
            response.end();
        } else {
            privats.eventEmitter.emit( "executingView", namespace );
        }
    });
};

privats.executingViewListener = function ( namespace ) {

    var layout = namespace.route.ViewParams.getLayout();

    if( typeof namespace.View[layout] == 'undefined'  )
        throw new Error('Dispatcher: View "Site/Components/'+namespace.route.Component+'/View" does not contain function "'+layout+'"');

    namespace.View[layout]( namespace.route.ViewParams, namespace.Model );

    privats.eventEmitter.emit( "renderingTemplate", namespace );
};

privats.renderingTemplateListener = function ( namespace ) {
    var response = namespace.RequestState.getResponse();

    var Template = exports.Services.ModuleProvider.getModule( 'Site/Templates/'+namespace.route.ViewParams.getTemplate() );

    Template.getContent( namespace.route.ViewParams, namespace.RequestState, function ( output ) {
        var contentType = Template.getContentType();
        privats.executeOutput( output, response, contentType );
    });
};

privats.executeOutput = function ( output, response, contentType ) {
    response.writeHead(200, {'Content-Type': contentType});
    response.end( output );
};

privats.ucfirst = function (str) {
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
};