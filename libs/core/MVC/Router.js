var privats = {};

exports.getRoute = function ( request ) {
    var MP = exports.Services.ModuleProvider;
    var result = { 'Component' : '', 'ActionParams' : {}, 'ViewParams' : {} };

    var requestMatching = MP.getModule( 'Site/Config/RequestMatching' ).requests;

    var matchedRequestDefinition = null;
    console.log( request.url );

    for( var i = 0; i < requestMatching.length; i++ ) {
        if( typeof requestMatching[i].URLregexp == 'undefined' )
            privats.initRequestDefinition( requestMatching[i] );

        for( var key in requestMatching[i].URLregexp ) {
            
            if( requestMatching[i].URLregexp[key].test( request.url ) ){

                matchedRequestDefinition = requestMatching[i];

                result.Component = requestMatching[i].Component;

                for( var param_name in requestMatching[i].ActionParams )
                    result.ActionParams[param_name] = requestMatching[i].ActionParams[param_name];

                var ViewParams = requestMatching[i].ViewParams;

                if( typeof ViewParams.layout == 'undefined' )
                    throw new Error('Dispatcher: matching for "'+request.url+'" does not contain information about view layout (ViewParams.layout)');
                if( typeof ViewParams.template == 'undefined' )
                    throw new Error('Dispatcher: matching for "'+request.url+'" does not contain information about view template (ViewParams.template)');
                if( typeof ViewParams.layoutFolder == 'undefined' )
                    throw new Error('Dispatcher: matching for "'+request.url+'" does not contain information about view layoutFolder (ViewParams.layoutFolder)');

                result.ViewParams = MP.getModule( 'Core/MVC/ViewParams' ).getInstance( ViewParams.template, ViewParams.layoutFolder, ViewParams.layout );

                if( requestMatching[i].segmentVars[key].length > 0 ) {
                    var SegmentActionParameters = privats.getSegmentActionParameters( request.url, matchedRequestDefinition, key );

                    for( param_name in SegmentActionParameters )
                        result.ActionParams[param_name] = SegmentActionParameters[param_name];
                }

                if( typeof result.ActionParams.action == 'undefined' )
                    throw new Error('Router: matching for "'+request.url+'" does not contain information about controller action (ActionParams.action)');


                break;
            }
        }
        
        if( matchedRequestDefinition !== null )
            break;
    }

    if( matchedRequestDefinition == null ) {
        result.Component = 'ErrorPage';
        result.ActionParams = { action : 'ShowErrorPage' };
        result.ViewParams = MP.getModule( 'Core/MVC/ViewParams' ).getInstance( 'Default', 'ErrorPage', 'PageNotFound404' );
    }

    return result;
};

privats.initRequestDefinition = function ( RequestDefinition ) {
    var segmentVarExp = /\{([^/]+)\}/ig;

    if( typeof(RequestDefinition.URL) != 'object' || !(RequestDefinition.URL instanceof Array) ) {
        RequestDefinition.URL = [RequestDefinition.URL];
    }

    RequestDefinition.URLregexp = {};
    RequestDefinition.segmentVars = {};

    for( var i = 0; i < RequestDefinition.URL.length; i++ ) {
        URL = RequestDefinition.URL[i];
        RequestDefinition.URLregexp[URL] = new RegExp( URL.replace( segmentVarExp, '([^/]+)' ), 'i' );

        RequestDefinition.segmentVars[URL] = [];

        while (( matchings = segmentVarExp.exec( URL)) != null)
            RequestDefinition.segmentVars[URL].push( matchings[1] );
    }
}

privats.getSegmentActionParameters = function( URL, definition, key ) {
    var SegmentActionParameters = {};

    matches = URL.match( definition.URLregexp[key] );
    /*console.log( definition.URLregexp );
    console.log( URL );
    console.log( matches );*/


    for( var i = 0; i < definition.segmentVars[key].length; i++ ) {
        SegmentActionParameters[definition.segmentVars[key][i]] = matches[ i+1 ];
    }

    return SegmentActionParameters;
};
