var internal = {};

internal.sessions = {};

internal.timeoutIds = {};

exports.newSession = function ( sessionId, isRegistered ) {

    if( typeof isRegistered == "undefined" )
        isRegistered = false;

    var SessionLifeTime = exports.Services.Config.get( "Site", "SessionLifeTime" );

    if( isRegistered ) {
        var userId = exports.Services.DocumentManager.toObjectID( sessionId );
        internal.sessions[sessionId] = new internal.Session( SessionLifeTime, userId );
    } else
        internal.sessions[sessionId] = new internal.Session( SessionLifeTime );

    internal.timeoutIds[sessionId] = setTimeout( exports.destroySession, SessionLifeTime, sessionId );

    return internal.sessions[sessionId];
};

exports.report = function () {
  console.log( internal.sessions );
};

exports.isset = function ( sessionId ) {
    return typeof internal.sessions[sessionId] != "undefined";
};

exports.getSession = function ( sessionId ) {
    if( typeof internal.sessions[sessionId] != "undefined" ) {
        return internal.sessions[sessionId];
    } else {
        return null;
    }
};

exports.destroySession = function ( sessionId, force ) {

    if( typeof internal.sessions[sessionId] == "undefined" )
        return;
    
    if( typeof force == "undefined" )
        var force = false;

    var now  = new Date();
    var expireDate = internal.sessions[sessionId].getExpireDate();

    var difference = now.getTime() - expireDate.getTime();

    clearTimeout( internal.timeoutIds[sessionId] );

    if( force || ( difference < 1000 && difference > -1000 ) ) {
        delete internal.sessions[sessionId];
        delete internal.timeoutIds[sessionId];
    } else {
        internal.timeoutIds[sessionId] = setTimeout( exports.destroySession, difference, sessionId );
    }
};

exports.getSessionIdList = function ( authorized_only ) {
    if( typeof authorized_only == "undefined" )
        authorized_only = false;

    var result = [];
    for( var i in internal.sessions ) {
        if( authorized_only && internal.sessions[i].getUserId() === null )
            continue;

        result.push( i );
    }

    return result;
};

internal.Session = function ( sessionLiveTime, pUserId ) {
    var data = {};

    var createdDate = new Date();

    var expireDate = new Date( createdDate.getTime()+sessionLiveTime );

    var userId = null;

    if( typeof pUserId != "undefined" )
        userId = pUserId;


    this.getUserId = function () {
        return userId;
    };

    this.set = function ( varName, varValue ) {
        data[varName] = varValue;
    };

    this.get = function ( varName, defaultValue ) {
        if( typeof data[varName] != "undefined" ) {
            return data[varName];
        } else {
            if( typeof defaultValue == "undefined" )
                defaultValue = null;

            return defaultValue;
        }
    };

    this.prolong = function ( sessionLiveTime ) {
        var prolongDate = new Date();
        expireDate = new Date( prolongDate.getTime()+sessionLiveTime );
    };

    this.getExpireDate = function () {
        return expireDate;
    }
}
