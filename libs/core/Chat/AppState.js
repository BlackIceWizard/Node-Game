var privats = {
    'participantsList' : {},
    'connectionList' : {}
};

exports.init = function () {
    exports.Hooks = exports.Services.ModuleProvider.getModule( 'Core/Chat/AppHooks' );
    exports.Hooks.setApplication( exports );

};

exports.getParticipantNickList = function () {
    var nicks = [];
    for( var i in privats.participantsList )
        nicks.push( i );

    return nicks;
};

exports.assignNewParticipant = function ( UserId, callback ) {
    exports.Services.DocumentManager.find( 'Users', UserId, function ( User ) {
        privats.participantsList[User.getNick()] = { 'User' : User };
        callback();
    });
};

exports.removeParticipant = function ( UserId ) {
    for( var i in privats.participantsList ) {
        if( privats.participantsList[i].User.getId() == UserId ) {
            delete privats.participantsList[i];
            break;
        }
    }
};

exports.getParticipantByUserId = function ( UserId ) {
    for( var i in privats.participantsList ) {
        if( privats.participantsList[i].User.getId().toString() == UserId.toString() ) {
            //console.log( privats.participantsList[i].User.getId(), UserId );
            return privats.participantsList[i].User;
        }
    }
    return null;
};


exports.appendNewConnection = function ( ConnectionState ) {
    /*console.log( '--------- Before ---------' );
    for( var i = 0; i < privats.connectionList.length; i++ ) {
        var participant = privats.connectionList[i].getParticipant();
        console.log( i, participant ? participant.getNick() : participant, privats.connectionList[i].getConnectionNumber() );
    }*/
    var number = privats.generateConnectionNumber();
    privats.connectionList[number] = ConnectionState;
    ConnectionState.setConnectionNumber( number );
    /*console.log( '--------- After ---------' );
    for( var i = 0; i < privats.connectionList.length; i++ ) {
        var participant = privats.connectionList[i].getParticipant();
        console.log( i, participant ? participant.getNick() : participant, privats.connectionList[i].getConnectionNumber() );
    }
    console.log( '-------------------------' );*/
};

exports.removeConnection = function ( ConnectionState ) {
    delete privats.connectionList[ConnectionState.getConnectionNumber()];
};

exports.getConnections = function () {
    return privats.connectionList;
};

privats.generateConnectionNumber = function () {
    do {
        var number = Math.random();
    } while( typeof privats.connectionList[ number ] !== 'undefined' );

    return number;
};