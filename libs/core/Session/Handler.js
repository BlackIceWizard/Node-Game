var internal = {};

exports.construct = function ( callback ) {
    callback( exports );
};

exports.manageSessionState = function ( request, response ) {

    var sessionId = null;

    var isRegistered = 0;

    var Session = null;

    var MP = exports.Services.ModuleProvider;

    var SessionLifeTime = exports.Services.Config.get( "Site", "SessionLifeTime" );
    var USessionLifeTime = exports.Services.Config.get( "Site", "UnregisteredSessionLifeTime" );

    var SessionBase = MP.getModule( "Core/Session/Base" );

    var cookieSessionObject = null;

    //Look for already assigned session cookies
    //try {
        if( typeof request.headers.cookie != 'undefined' ) {

            var cookies = internal.parseCookieHeader( request.headers.cookie );

            var session_creation_time = 0;
            var newestCookieSessionId = null;

            //Parse session cookies and look for newest among theirs
            for( var i = 0; i < cookies.length; i++ ) {
                if( cookies[i].name == 'sessionid' ) {
                    var cookieSessionJSON = internal.decode( cookies[i].value );
                   
                    if( cookieSessionJSON ) {
                        cookieSessionObject = JSON.parse( cookieSessionJSON );
                        if( internal.isValidSessionCookie( cookieSessionObject ) && cookieSessionObject.t > session_creation_time ) {
                            newestCookieSessionId = cookieSessionObject;
                            session_creation_time = cookieSessionObject.t;
                        }
                    }
                }
            }
        }

        
        if( newestCookieSessionId ) {
            isRegistered = newestCookieSessionId.r;
            sessionId = newestCookieSessionId.id;

            //If decoded sessionId (UserId) isset in Session base then  they will use as current and will prolong
            //Else if cookies contains UserId then we will create new session with this UserId
            if( SessionBase.isset( sessionId ) ) {

                Session = SessionBase.getSession( sessionId );
                if( isRegistered )
                    Session.prolong( SessionLifeTime );
                else
                    Session.prolong( USessionLifeTime );

            } else if( isRegistered == 1 ) {
                Session = SessionBase.newSession( sessionId, true );
            }

        }
    /*} catch(err) {
        Session = null;
    }*/

    //If session cookies is not found then create session for not auth users
    if( !Session ){
        var now = new Date();
        sessionId = now.getTime();

        while(true) {
            if( ! SessionBase.isset( sessionId ) )
                break;
            else
                sessionId++;
        }

        Session = SessionBase.newSession( sessionId, false );
    }

    //exports.sendSessionCookie( sessionId, response );

    return sessionId;
};

exports.sendSessionCookie = function ( sessionId, response ) {
    var SessionBase = exports.Services.ModuleProvider.getModule( "Core/Session/Base" );
    var session = SessionBase.getSession( sessionId );
    //var SessionCookieLifeTime = exports.Services.Config.get( "Site", "SessionCookieLifeTime" );
    var now = new Date();
    //var expires = new Date( now.getTime() + SessionCookieLifeTime );
    var encodedSessionId = internal.encodeSessionId( now.getTime(), sessionId, session.getUserId() !== null ? 1 : 0 );

    response.setHeader( "Set-Cookie", 'sessionid=' + encodedSessionId + '; expires=' + session.getExpireDate().toGMTString() + '; path=/;' );
};

internal.encodeSessionId =function ( t, id, r ) {
    var cookieSessionObject = { 't' : t, 'id' : id, 'r' : r };
    return internal.encode( JSON.stringify( cookieSessionObject ) );
};

internal.isValidSessionCookie = function ( cookieObject ) {
    return typeof cookieObject.t != 'undefined' && typeof cookieObject.id != 'undefined' &&  typeof cookieObject.r != 'undefined';
};

internal.parseCookieHeader = function ( cookiesString ) {
    var StringHelper = exports.Services.ModuleProvider.getModule( 'Helpers/String' );
    var cookies = [];
    var nameValuePairs = cookiesString.split( ";" );

    for( var i = 0; i < nameValuePairs.length; i++ ) {
        if( nameValuePairs[i] == '' ) continue;
        var nameValuePair = nameValuePairs[i].split( "=" );
        cookies.push( { 'name' : StringHelper.trim( nameValuePair[0] ), 'value' : StringHelper.trim( nameValuePair[1] ) } );
    }

    return cookies;
};

exports.replaceWithUnregistered = function ( currentSessionId ) {
    var MP = exports.Services.ModuleProvider;
    var SessionBase = MP.getModule( "Core/Session/Base" );
    var now  = new Date();
    var newSessionId = now.getTime();
    
    SessionBase.destroySession( currentSessionId, true );
    SessionBase.newSession( newSessionId, false );

    return newSessionId;
};

exports.replaceWithRegistered = function ( currentSessionId, userId ) {
    var MP = exports.Services.ModuleProvider;
    var SessionBase = MP.getModule( "Core/Session/Base" );
    var newSessionId = userId;

    SessionBase.destroySession( currentSessionId, true );
    SessionBase.newSession( newSessionId, true );

    return newSessionId;
};

exports.getSession = function ( sessionId ) {
    var MP = exports.Services.ModuleProvider;
    return MP.getModule( "Core/Session/Base" ).getSession( sessionId );
};

exports.getSessionIdList = function ( authorized_only ) {
    var MP = exports.Services.ModuleProvider;
    var SessionBase = MP.getModule( "Core/Session/Base" );
    return SessionBase.getSessionIdList( authorized_only );
};

exports.getDecodedSession = function ( encoded_session_id ) {
    var SessionIdJSON = internal.decode( encoded_session_id );
    var SessionIdObject = JSON.parse( SessionIdJSON );
    return SessionIdObject.id;
};

internal.encode = function ( plainText ) {
    var crypto = require( 'crypto' );

    var encryption_key = exports.Services.Config.get( "Site", "SecretWord" );


    var cipher = crypto.createCipher('des-ede3-cbc', encryption_key );
    var encodedText = cipher.update(plainText, 'utf8', 'hex');
    encodedText += cipher.final('hex');

    return encodedText;
};

internal.decode = function( encodedText ) {
    var crypto = require( 'crypto' );

    var encryption_key = exports.Services.Config.get( "Site", "SecretWord" );

    var decipher = crypto.createDecipher('des-ede3-cbc', encryption_key );
    var plainText = decipher.update(encodedText, 'hex', 'utf8');
    plainText += decipher.final('utf8');

    return plainText;
};