var privats = {};

exports.construct = function () {
    privats.router = exports.Services.ModuleProvider.getModule( 'Core/MVC/Router' );
};

exports.dispatch = function ( request, response, sessionid ) {

    var MP = exports.Services.ModuleProvider;

    var route = privats.router.getRoute( request );

    var Controller = MP.getModule( 'Site/Components/'+route.Component+'/Controller' );
    var Model      = MP.getModule( 'Site/Components/'+route.Component+'/Model' );
    var View       = MP.getModule( 'Site/Components/'+route.Component+'/View' );

    var RequestState = MP.getModule( 'Core/MVC/RequestState' ).getInstance();
    RequestState.setRequest( request );
    RequestState.setResponse( response );
    RequestState.setSession( sessionid );

    var namespace = { 'route' : route, "Controller" : Controller, 'Model' : Model, 'View' : View, 'RequestState' : RequestState };

    privats.grabbingRequestData ( namespace );
};

privats.grabbingRequestData = function ( namespace ) {

    var request = namespace.RequestState.getRequest();
    var RequestProcessor = exports.Services.RequestProcessor.getInstance( request.headers['content-type'] );

    var requestStr = "";

    request.addListener("data", function (chunk) { requestStr += chunk } );
    request.addListener("end", function () {
        RequestProcessor.parseRequestStr( requestStr );
        namespace.RequestState.setRequestData( RequestProcessor );
        setTimeout( privats.executingController, 0, namespace );
    } );
};

privats.executingController = function( namespace ) {
    //if action is set to the null, then not need in controller
    if( namespace.route.ActionParams.action === null ) {
        privats.postExecutingController( namespace );
        return;
    }

    var action = privats.ucfirst( namespace.route.ActionParams.action );

    if( typeof namespace.Controller[action] == 'undefined'  )
        throw new Error('Dispatcher: controller "Site/Components/'+namespace.route.Component+'/Controller" does not contain function "'+action+'"');

    namespace.Controller[action]( namespace.route.ActionParams, namespace.route.ViewParams, namespace.Model, namespace.RequestState, function () {
        privats.postExecutingController( namespace );
    });
};

privats.postExecutingController = function( namespace ) {
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
        setTimeout( privats.executingView, 0, namespace );
    }
};


privats.executingView = function ( namespace ) {

    var layout = namespace.route.ViewParams.getLayout();

    if( typeof namespace.View[layout] == 'undefined'  )
        throw new Error('Dispatcher: View "Site/Components/'+namespace.route.Component+'/View" does not contain function "'+layout+'"');

    namespace.View[layout]( namespace.route.ViewParams, namespace.RequestState, namespace.Model );

    setTimeout( privats.renderingTemplate, 0, namespace );
};

privats.renderingTemplate = function ( namespace ) {
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