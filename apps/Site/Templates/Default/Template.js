exports.widgets = function ( data, requestState ) {
    return {
        'UserLinks' : { 'display' : true },
        'Chat' : { 'display' : true },
        'MainMenu' : { 'display' : true }
    }
};

exports.getContent = function ( data ) {

    var site_base = exports.Services.Config.get( 'Site', 'Base' );

    var scriptDeclarationsContent = '';
    var scriptDeclarations = data.getScriptDeclarations();
    if( scriptDeclarations.length > 0 ) {
        scriptDeclarationsContent +="<script type='text/javascript'>";

        for( var sdi in scriptDeclarations )
            scriptDeclarationsContent += "\n"+scriptDeclarations[sdi];

        scriptDeclarationsContent +="</script>";
    }

    var scriptLinksContent = '';
    var scriptLinks = data.getScriptLinks();
    for( var si in scriptLinks )
        scriptLinksContent += '<script src="'+site_base+'/'+scriptLinks[si]+'" type="text/javascript"></script>';

    var CSSLinksContent = '';
    var CSSLinks = data.getCSSLinks();
    for( var ci in CSSLinks )
        CSSLinksContent += '<link href="'+site_base+'/'+CSSLinks[ci]+'" type="text/css" rel="stylesheet"></link>';


    return '<!DOCTYPE html>' +
'        <html>'+
'            <head>'+
'                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'+
'                <title>Node Game</title>'+
'                <base href="'+site_base+'" />'+
'                <link href="'+site_base+'/assets/css/style.css" type="text/css" rel="stylesheet"/>'+
'                <script src="'+site_base+'/assets/js/jquery.js" type="text/javascript"></script>' +
'                <script src="'+site_base+'/assets/js/swfobject.js" type="text/javascript"></script>'+"\n"+
'                <script src="'+site_base+'/assets/jsocket/src/jsocket.js" type="text/javascript"></script>'+"\n"+
'                <script src="'+site_base+'/assets/jsocket/src/jsocket.advanced.js" type="text/javascript"></script>'+"\n"+
'                <script src="'+site_base+'/assets/js/connection.js" type="text/javascript"></script>'+"\n"+
'                <script src="'+site_base+'/assets/js/chat.js" type="text/javascript"></script>'+"\n"+
                 scriptLinksContent +
                 CSSLinksContent +
                 scriptDeclarationsContent+
'            </head>'+
'            <body>'+
'                    '+data.getWidgetContent( 'UserLinks' )+
'                    <div>'+
'                       '+data.getWidgetContent( 'MainMenu' )+
'                    </div>'+
'                    '+data.getLayoutContent()+
'                    '+data.getWidgetContent( 'Chat' )+
'            </body>'+
'        </html>';
};