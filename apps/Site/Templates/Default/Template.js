exports.widgets = function ( data, requestState ) {
    return {
        'UserLinks' : { 'display' : true }
    }
};

exports.getContent = function ( data ) {
    var scriptLinksContent = '';
    var scriptLinks = data.getScriptLinks();
    for( var i in scriptLinks )
        scriptLinksContent += '<script src="'+scriptLinks[i]+'" type="text/javascript"></script>';

    var CSSLinksContent = '';
    var CSSLinks = data.getCSSLinks();
    for( var i in CSSLinks )
        CSSLinksContent += '<link href="'+CSSLinks[i]+'" type="text/css" rel="stylesheet"></link>';


    return '<!DOCTYPE html>' +
'        <html>'+
'            <head>'+
'                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'+
'                <title>Node Game</title>'+
'                <link href="/assets/css/style.css" type="text/css" rel="stylesheet"/>'+
'                <script src="/assets/js/jquery.js" type="text/javascript"></script>' +
                 scriptLinksContent +
                 CSSLinksContent +
'            </head>'+
'            <body>'+
'                    '+data.getWidgetContent( 'UserLinks' )+
'                    '+data.getLayoutContent()+
'            </body>'+
'        </html>';
};