var privats = {};

privats.sessions = {};

privats.timeoutIds = {};

exports.newSession = function ( sessionId, isRegistered ) {

    if( typeof isRegistered == "undefined" )
        isRegistered = false;

    var SessionLifeTime = exports.Services.Config.get( "Site", "SessionLifeTime" );

    if( isRegistered ) {
        var userId = exports.Services.DocumentManager.toObjectID( sessionId );
        privats.sessions[sessionId] = new privats.Session( SessionLifeTime, userId );
    } else
        privats.sessions[sessionId] = new privats.Session( SessionLifeTime );

    privats.timeoutIds[sessionId] = setTimeout( exports.destroySession, SessionLifeTime, sessionId );

    return privats.sessions[sessionId];
};

exports.report = function () {
  console.log( privats.sessions );  
};

exports.isset = function ( sessionId ) {
    return typeof privats.sessions[sessionId] != "undefined";
};

exports.getSession = function ( sessionId ) {
    if( typeof privats.sessions[sessionId] != "undefined" ) {
        return privats.sessions[sessionId];
    } else {
        return null;
    }
};

exports.destroySession = function ( sessionId, force ) {

    if( typeof privats.sessions[sessionId] == "undefined" )
        return;
    
    if( typeof force == "undefined" )
        var force = false;

    var now  = new Date();
    var expireDate = privats.sessions[sessionId].getExpireDate();

    var difference = now.getTime() - expireDate.getTime();

    clearTimeout( privats.timeoutIds[sessionId] );

    if( force || ( difference < 1000 && difference > -1000 ) ) {
        delete privats.sessions[sessionId];
        delete privats.timeoutIds[sessionId];
    } else {
        privats.timeoutIds[sessionId] = setTimeout( exports.destroySession, difference, sessionId );
    }
};

exports.getSessionIdList = function ( authorized_only ) {
    if( typeof authorized_only == "undefined" )
        authorized_only = false;

    var result = [];
    for( var i in privats.sessions ) {
        if( authorized_only && privats.sessions[i].getUserId() === null )
            continue;

        result.push( i );
    }

    return result;
};

privats.Session = function ( sessionLiveTime, pUserId ) {
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
