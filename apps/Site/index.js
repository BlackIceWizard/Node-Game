/*
 * Init environment
 */

var http   = require('http');
var path   = require('path');
var fs     = require('fs');


var rootDirectory = path.normalize( __dirname + '/../..' );

var ModuleProvider = require( rootDirectory + '/libs/core/ModuleProvider' ).construct( rootDirectory );

var ServiceContainer = ModuleProvider.getModule( 'Core/DependencyInjection/ServiceContainer' ).construct( ModuleProvider, 'Site/Config/Services' );

ModuleProvider.setServiceContainer( ServiceContainer );

ServiceContainer.initServices( serverUp );

function serverUp( Services ) {

    
    /*var doc = {
        //'_id' : Services.DocumentManager.toObjectID( '4db9adef351a4340ff2b69ce' ),
         Nick: 'Felix',
         Password: 'knsdfnksk',
         Email: 'black.ice.wizard@gmail.com',
         Site: 'nodegame.com',
         Addition: 'Я программирую игру на Node.js'
    }

    var User = mapper.map( 'Users', doc );*/

    /*Services.DocumentManager.findOneBy( 'Users', {}, function ( User ) {
        var mapper = Services.ModuleProvider.getModule( 'Core/ODM/Mapper' );
        console.log( mapper.mapReverse( User ) );
    });*/

    /*Services.DocumentManager.findOneBy( 'Users', {_id : Services.DocumentManager.toObjectID( '4dcef0dba2e8fce514000001' ) }, function ( User ) {
        var mapper = Services.ModuleProvider.getModule( 'Core/ODM/Mapper' );
        Services.DocumentManager.remove( User, function () {
            Services.DocumentManager.findOneBy( 'Users', {_id : Services.DocumentManager.toObjectID( '4dcef0dba2e8fce514000001' ) }, function ( User ) {
                var mapper = Services.ModuleProvider.getModule( 'Core/ODM/Mapper' );
                console.log( User );
            });
        });
    });*/

    /*Services.DocumentManager.findBy( 'Users', { 'Nick' : 'Felix' }, null, null, null, function ( Entities ) {
        var mapper = Services.ModuleProvider.getModule( 'Core/ODM/Mapper' );
        while( Entities.length ) {
            console.log( mapper.mapReverse( Entities.pop() ) );
        }
    });*/

    /*var connection  = Services.DocumentManager.getConnection();
    connection.collection( 'Users', function ( error, collection ){
        collection.findOne( { 'testfield' : { '$exists' : true  } }, function ( err, result ) {
            console.log( result );
        });
    });*/

    /*
     * Init HTTP Server
     */

    var HTTPDispatcher = Services.ModuleProvider.getModule( 'Core/MVC/Dispatcher' );

    HTTPDispatcher.construct();

    var SessionHandler = Services.ModuleProvider.getModule( 'Core/Session/Handler' );

    http.createServer(function (request, response) {
        if( request.url == '/favicon.ico'  ) {
            var faviconContent = fs.readFileSync( rootDirectory + '/apps/Site/assets/favicon.ico' );
            response.writeHead(200, {'Content-Type': 'image/gif'});
            response.end( faviconContent );
            return true;
        }

        //console.log( request.headers );

        var sessionId = SessionHandler.manageSessionState( request, response );

        HTTPDispatcher.dispatch( request, response, sessionId );
        
    }).listen(8080, '127.0.0.2' );

    console.log('HTTP Server running at http://127.0.0.2:8080/');








    /*
     * Init Socket Server
     */
    var SocketDispatcher = Services.ModuleProvider.getModule( 'Core/Socket/Dispatcher' );
    var ChatAppState = Services.ModuleProvider.getModule( 'Core/Chat/AppState' );
    ChatAppState.init();

    var net  = require("net");
    net.createServer(function (stream) {
        //console.log( "CreateTCPServer------------------------------------" );
        var ConnectionState = Services.ModuleProvider.getModule( 'Core/Chat/ConnectionState' ).getInstance();

        ChatAppState.appendNewConnection( ConnectionState );
        ConnectionState.setConnectionStream( stream );

        stream.setEncoding("utf8");

        //The fist thing what we need to do on open stream - write Crossdomain XML. It because we work with Flash player
        stream.write( Services.ModuleProvider.getModule( 'Helpers/Common' ).crossdomainXML() +"\0");

        //Always on connect we write "Hello" message
        stream.on("connect", function () {
            stream.write("hello\0");
            //console.log( 'TCP: Connecting' );
        });

        stream.on( 'data', function ( data ) {
            //console.log( 'TCP input: '+data );
            if( ConnectionState.getSession() == null ) {
                if( data == '<policy-file-request/>\0' )
                    data = '{ "dialog":"StartUp", "message":"<policy-file-request/>" }'+"\0";
            }
            SocketDispatcher.dispatch( data, ConnectionState, ChatAppState, stream );

        });

        stream.on("end", function () {
            var Session = ConnectionState.getSession();
            //console.log( 'TCP: End' );

            stream.end();

            if( Session !== null && Session.getUserId() !== null ) {
                //console.log( 'TCP: Delete user "'+Session.getUserId()+'"' );

                var User = ChatAppState.getParticipantByUserId( Session.getUserId() );
                ChatAppState.removeParticipant( Session.getUserId() );
                ChatAppState.Hooks.onLostUserConnection( User );
            }

            ChatAppState.removeConnection( ConnectionState );
        });
    }).listen(843, "127.0.0.2");

    console.log('TCP Server running at http://127.0.0.2:843/');


}
