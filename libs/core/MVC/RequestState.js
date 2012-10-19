var internal = {};

exports.getInstance = function () {
    return new internal.instance();
};

internal.instance = function () {
    var internal = {
        //'resendSessionCookie' : false,
        'redirect' : null,
        'requestData' : null,
        'request' : null,
        'response' : null,
        'sessionId' : null,
        'Session' : null
    };

    this.setRequestData = function ( data ) {
        internal.requestData = data;
    };

    this.getRequestData = function () {
        return internal.requestData;
    };

    this.setRequest = function ( request) {
        internal.request = request;
    };

    this.getRequest = function () {
        return internal.request;
    };

    this.setResponse = function ( responce ) {
        internal.responce = responce;
    };

    this.getResponse = function () {
        return internal.responce;
    };

    this.setSession = function ( sessionId ) {
        var MP = exports.Services.ModuleProvider;

        internal.sessionId = sessionId;
        internal.Session = MP.getModule( "Core/Session/Handler" ).getSession( sessionId );
    };

    this.getSession = function () {
        return internal.Session;
    };

    this.getSessionId = function () {
        return internal.sessionId;
    };

    this.logIn = function ( userObjectId ) {
        var MP = exports.Services.ModuleProvider;
        var newSessionId = MP.getModule( "Core/Session/Handler" ).replaceWithRegistered( internal.sessionId, userObjectId.toString() );
        this.setSession( newSessionId );
        //this.setResendSessionCookie( true );

    };

    this.logOut = function () {
        var MP = exports.Services.ModuleProvider;
        var newSessionId = MP.getModule( "Core/Session/Handler" ).replaceWithUnregistered( internal.sessionId );
        this.setSession( newSessionId );
        //this.setResendSessionCookie( true );
    };

    this.setRedirect = function ( url ) {
        internal.redirect = url;
    };

    this.getRedirect = function ( url ) {
        return internal.redirect;
    };

    /*this.setResendSessionCookie = function( isNeed ) {
        internal.resendSessionCookie = isNeed;
    };

    this.getResendSessionCookie = function() {
        return internal.resendSessionCookie;
    };*/
};