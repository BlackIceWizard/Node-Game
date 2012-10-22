/**
 * @class Служит обработчиком HTTP запросов к серверу
 */
var ServiceContainer = function () {

    var router = null;
    var MP = null;
    var site_base = '';

    /** Список сервисов. Не инициализирован на момент инициализации модуля */
    var Services = {};

    /**
     * Инжектит сервисы в модуль
     * @param  {Object} pServices Список сервисов
     */
    this.assignServices = function ( pServices ) {
        Services = pServices;
    };

    this.construct = function () {
        router = Services.ModuleProvider.getModule( 'Core/MVC/Router' );
        MP = Services.ModuleProvider;
        site_base = Services.Config.get( 'Site', 'Base' );
    };

    this.dispatch = function ( request, response, sessionid ) {

        var route = router.getRoute( request );

        var Controller = MP.getModule( 'Site/Components/'+route.Component+'/Controller' );
        var Model      = MP.getModule( 'Site/Components/'+route.Component+'/Model' );
        var View       = MP.getModule( 'Site/Components/'+route.Component+'/View' );

        var RequestState = MP.getModule( 'Core/MVC/RequestState' ).getInstance();
        RequestState.setRequest( request );
        RequestState.setResponse( response );
        RequestState.setSession( sessionid );

        var namespace = { 'route' : route, "Controller" : Controller, 'Model' : Model, 'View' : View, 'RequestState' : RequestState };

        grabbingRequestData ( namespace );
    };

    var grabbingRequestData = function ( namespace ) {

        var request = namespace.RequestState.getRequest();

        var RequestProcessor = MP.getModuleInstance( 'Core/RequestProcessor' );
        RequestProcessor.initialize( request.headers['content-type'] );

        var requestStr = "";

        request.addListener("data", function (chunk) { requestStr += chunk } );
        request.addListener("end", function () {
            RequestProcessor.parseRequestStr( requestStr );
            namespace.RequestState.setRequestData( RequestProcessor );
            setTimeout( executingController, 0, namespace );
        } );
    };

    var executingController = function( namespace ) {
        //if action is set to the null, then not need in controller
        if( namespace.route.ActionParams.action === null ) {
            postExecutingController( namespace );
            return;
        }

        var action = ucfirst( namespace.route.ActionParams.action );

        if( typeof namespace.Controller[action] == 'undefined'  )
            throw new Error('Dispatcher: controller "Site/Components/'+namespace.route.Component+'/Controller" does not contain function "'+action+'"');

        namespace.Controller[action]( namespace.route.ActionParams, namespace.route.ViewParams, namespace.Model, namespace.RequestState, function () {
            postExecutingController( namespace );
        });
    };

    var postExecutingController = function( namespace ) {
        MP.getModule( 'Core/Session/Handler' ).sendSessionCookie( namespace.RequestState.getSessionId(), namespace.RequestState.getResponse() );

        var redirect = namespace.RequestState.getRedirect();
        if( redirect ) {

            if( redirect.substr( 0, 7 ) !== "http://" ) {


                if( redirect.substr( 0, 1 ) !== "/" )
                    redirect = '/'+redirect;

                redirect = site_base+redirect;
            }


            var response = namespace.RequestState.getResponse();
            response.writeHead(301, {'Location': redirect } );
            response.end();
        } else {
            setTimeout( executingView, 0, namespace );
        }
    };


    var executingView = function ( namespace ) {

        var layout = namespace.route.ViewParams.getLayout();

        if( typeof namespace.View[layout] == 'undefined'  )
            throw new Error('Dispatcher: View "Site/Components/'+namespace.route.Component+'/View" does not contain function "'+layout+'"');

        namespace.View[layout]( namespace.route.ViewParams, namespace.RequestState, namespace.Model );

        setTimeout( renderingTemplate, 0, namespace );
    };

    var renderingTemplate = function ( namespace ) {
        var response = namespace.RequestState.getResponse();

        var Template = MP.getModule( 'Site/Templates/'+namespace.route.ViewParams.getTemplate() );

        Template.getContent( namespace.route.ViewParams, namespace.RequestState, function ( output ) {
            var contentType = Template.getContentType();
            executeOutput( output, response, contentType );
        });
    };

    var executeOutput = function ( output, response, contentType ) {
        response.writeHead(200, {'Content-Type': contentType});
        response.end( output );
    };

    var ucfirst = function (str) {
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
    };
};