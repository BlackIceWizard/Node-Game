var privats = {};

exports.getInstance = function () {
    return new privats.instance();
};

privats.instance = function () {
    var privats = {
        //'resendSessionCookie' : false,
        'redirect' : null,
        'requestData' : null,
        'request' : null,
        'response' : null,
        'sessionId' : null,
        'Session' : null
    };

    this.setRequestData = function ( data ) {
        privats.requestData = data;
    };

    this.getRequestData = function () {
        return privats.requestData;
    };

    this.setRequest = function ( request) {
        privats.request = request;
    };

    this.getRequest = function () {
        return privats.request;
    };

    this.setResponse = function ( responce ) {
        privats.responce = responce;
    };

    this.getResponse = function () {
        return privats.responce;
    };

    this.setSession = function ( sessionId ) {
        var MP = exports.Services.ModuleProvider;

        privats.sessionId = sessionId;
        privats.Session = MP.getModule( "Core/Session/Handler" ).getSession( sessionId );
    };

    this.getSession = function () {
        return privats.Session;
    };

    this.getSessionId = function () {
        return privats.sessionId;
    };

    this.logIn = function ( userObjectId ) {
        var MP = exports.Services.ModuleProvider;
        var newSessionId = MP.getModule( "Core/Session/Handler" ).replaceWithRegistered( privats.sessionId, userObjectId.toString() );
        this.setSession( newSessionId );
        //this.setResendSessionCookie( true );

    };

    this.logOut = function () {
        var MP = exports.Services.ModuleProvider;
        var newSessionId = MP.getModule( "Core/Session/Handler" ).replaceWithUnregistered( privats.sessionId );
        this.setSession( newSessionId );
        //this.setResendSessionCookie( true );
    };

    this.setRedirect = function ( url ) {
        privats.redirect = url;
    };

    this.getRedirect = function ( url ) {
        return privats.redirect;
    };

    /*this.setResendSessionCookie = function( isNeed ) {
        privats.resendSessionCookie = isNeed;
    };

    this.getResendSessionCookie = function() {
        return privats.resendSessionCookie;
    };*/
};