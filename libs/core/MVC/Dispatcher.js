/**
 * @type Config
 * */
var internal = {};

exports.construct = function () {
    internal.router = exports.Services.ModuleProvider.getModule( 'Core/MVC/Router' );
    internal.MP = exports.Services.ModuleProvider;
};

exports.dispatch = function ( request, response, sessionid ) {



    var route = internal.router.getRoute( request );

    var Controller = internal.MP.getModule( 'Site/Components/'+route.Component+'/Controller' );
    var Model      = internal.MP.getModule( 'Site/Components/'+route.Component+'/Model' );
    var View       = internal.MP.getModule( 'Site/Components/'+route.Component+'/View' );

    var RequestState = internal.MP.getModule( 'Core/MVC/RequestState' ).getInstance();
    RequestState.setRequest( request );
    RequestState.setResponse( response );
    RequestState.setSession( sessionid );

    var namespace = { 'route' : route, "Controller" : Controller, 'Model' : Model, 'View' : View, 'RequestState' : RequestState };

    internal.grabbingRequestData ( namespace );
};

internal.grabbingRequestData = function ( namespace ) {

    var request = namespace.RequestState.getRequest();

    var RequestProcessor = internal.MP.getModuleInstance( 'Core/RequestProcessor' );
    RequestProcessor.initialize( request.headers['content-type'] );

    var requestStr = "";

    request.addListener("data", function (chunk) { requestStr += chunk } );
    request.addListener("end", function () {
        RequestProcessor.parseRequestStr( requestStr );
        namespace.RequestState.setRequestData( RequestProcessor );
        setTimeout( internal.executingController, 0, namespace );
    } );
};

internal.executingController = function( namespace ) {
    //if action is set to the null, then not need in controller
    if( namespace.route.ActionParams.action === null ) {
        internal.postExecutingController( namespace );
        return;
    }

    var action = internal.ucfirst( namespace.route.ActionParams.action );

    if( typeof namespace.Controller[action] == 'undefined'  )
        throw new Error('Dispatcher: controller "Site/Components/'+namespace.route.Component+'/Controller" does not contain function "'+action+'"');

    namespace.Controller[action]( namespace.route.ActionParams, namespace.route.ViewParams, namespace.Model, namespace.RequestState, function () {
        internal.postExecutingController( namespace );
    });
};

internal.postExecutingController = function( namespace ) {
    exports.Services.ModuleProvider.getModule( 'Core/Session/Handler' ).sendSessionCookie( namespace.RequestState.getSessionId(), namespace.RequestState.getResponse() );

    var redirect = namespace.RequestState.getRedirect();
    if( redirect ) {

        if( redirect.substr( 0, 7 ) !== "http://" ) {
            var site_base = exports.Services.Config.get( 'Site', 'Base' );

            if( redirect.substr( 0, 1 ) !== "/" )
                redirect = '/'+redirect;

            redirect = site_base+redirect;
        }


        var response = namespace.RequestState.getResponse();
        response.writeHead(301, {'Location': redirect } );
        response.end();
    } else {
        setTimeout( internal.executingView, 0, namespace );
    }
};


internal.executingView = function ( namespace ) {

    var layout = namespace.route.ViewParams.getLayout();

    if( typeof namespace.View[layout] == 'undefined'  )
        throw new Error('Dispatcher: View "Site/Components/'+namespace.route.Component+'/View" does not contain function "'+layout+'"');

    namespace.View[layout]( namespace.route.ViewParams, namespace.RequestState, namespace.Model );

    setTimeout( internal.renderingTemplate, 0, namespace );
};

internal.renderingTemplate = function ( namespace ) {
    var response = namespace.RequestState.getResponse();

    var Template = exports.Services.ModuleProvider.getModule( 'Site/Templates/'+namespace.route.ViewParams.getTemplate() );

    Template.getContent( namespace.route.ViewParams, namespace.RequestState, function ( output ) {
        var contentType = Template.getContentType();
        internal.executeOutput( output, response, contentType );
    });
};

internal.executeOutput = function ( output, response, contentType ) {
    response.writeHead(200, {'Content-Type': contentType});
    response.end( output );
};

internal.ucfirst = function (str) {
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
};