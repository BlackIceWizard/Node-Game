var privats = {};

exports.getInstance = function ( template, layoutFolder, layout ) {
    var instance = new privats.Instance();
    instance.construct( template, layoutFolder, layout );
    return instance; 
};

privats.Instance = function () {

    var page = {
        scriptLinks : [],
        scriptDeclarations : [],
        CSSLinks : [],
        layoutContent : '',
        widgets : {}
    };

    var composition = {
        template : '',
        layoutFolder : '',
        layout : ''
    };

    var data = {};

    this.construct = function ( template, layoutFolder, layout ) {
        this.setTemplate( template );
        this.setLayoutFolder( layoutFolder );
        this.setLayout( layout );
    };

    this.setTemplate = function ( template ) { composition.template = template; };
    this.getTemplate = function () { return composition.template; };

    this.setLayoutFolder = function ( layoutFolder ) { composition.layoutFolder = layoutFolder; };
    this.getLayoutFolder = function () { return composition.layoutFolder; };

    this.setLayout = function ( layout ) { composition.layout = layout; };
    this.getLayout = function () { return composition.layout; };

    this.appendScriptLink = function ( link ) { page.scriptLinks.push( link ); };
    this.getScriptLinks = function () { return page.scriptLinks; };

    this.appendCSSLink = function ( link ) { page.CSSLinks.push( link ); };
    this.getCSSLinks = function () { return page.CSSLinks; };

    this.appendScriptDeclaration = function ( script ) { page.scriptDeclarations.push( script ); };
    this.getScriptDeclarations = function () { return page.scriptDeclarations; };

    this.setLayoutContent = function ( content ) { page.layoutContent = content; };
    this.getLayoutContent = function () { return page.layoutContent; };

    this.appendWidgetContent = function ( widgetName, content ) { page.widgets[widgetName] = content; };
    this.getWidgetContent = function ( widgetName ) { return page.widgets[widgetName]; };

    this.set = function ( parameter, parameterValue ) {
        data[parameter] = parameterValue;
    };

    this.append = function ( parameter, paremeterValue ) {
        if( typeof data[parameter] == "undefined" )
            data[parameter] = [ paremeterValue ];
        else
            data[parameter].push( paremeterValue );
    };

    this.get = function ( parameter, defaultValue ) {

        if( typeof data[parameter] != "undefined" ) {
            return data[parameter];
        } else {
            if( typeof defaultValue == "undefined" )
                defaultValue = null;
            
            return defaultValue;
        }
    };
};