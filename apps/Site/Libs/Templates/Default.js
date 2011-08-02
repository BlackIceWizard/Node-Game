var privats = {};

exports.getContentType = function () {
    return 'text/html; charset=UTF-8';
};

exports.getContent = function ( ViewParams, RequestState, callback ) {
    var Template = exports.Services.ModuleProvider.getModule( 'Site/HTML/Templates/'+ViewParams.getTemplate()+'/Template' );
    var Layout = exports.Services.ModuleProvider.getModule( 'Site/HTML/Templates/'+ViewParams.getTemplate()+'/'+ViewParams.getLayoutFolder()+'/'+ViewParams.getLayout() );

    privats.renderLayout( Layout, ViewParams, RequestState, function ( layoutContent ) {
        ViewParams.setLayoutContent( layoutContent );
        privats.renderLayout( Template, ViewParams, RequestState, function ( mainLayoutContent ) {
            callback( mainLayoutContent );
        });
    });
};

privats.renderLayout = function ( Layout, ViewParams, RequestState, callback ) {
    if( typeof Layout.widgets != 'undefined' ) {
        var widgets = Layout.widgets();

        var renderQueue = [];
        for( var i in widgets )
            renderQueue.push( i );

        privats.renderWidget( renderQueue, widgets, ViewParams, RequestState, privats.renderIterator, function () {
            var layoutContent = Layout.getContent( ViewParams );
            callback( layoutContent );
        });

    } else {
        var layoutContent = Layout.getContent( ViewParams );
        callback( layoutContent );
    }
};

privats.renderWidget = function ( renderQueue, widgets, ViewParams, RequestState, callback, finalCallback ) {
    var widgetName = renderQueue.pop();
    var widgetParams = widgets[widgetName];

    var MP = exports.Services.ModuleProvider;
    
    if( typeof widgetParams.display != 'undefined' && !widgetParams.display ) {
        ViewParams.appendWidgetContent( widgetName, '' );
    } else {

        var widget = MP.getModule( 'Site/Widgets/'+widgetName );
        var widgetLayout = MP.getModule( 'Site/HTML/Widgets/'+widgetName );

        widget.prepare( widgetParams, RequestState, function () {

            var widgetContent = widgetLayout.getContent( widgetParams );

            ViewParams.appendWidgetContent( widgetName, widgetContent );
            callback( renderQueue, widgets, ViewParams, RequestState, finalCallback );
        });
    }
};

privats.renderIterator = function ( renderQueue, widgets, ViewParams, RequestState, finalCallback ) {
    if( renderQueue.length == 0 ) {
        finalCallback();
    } else {
        privats.renderWidget( renderQueue, widgets, ViewParams, RequestState, privats.renderIterator, finalCallback );
    }
};