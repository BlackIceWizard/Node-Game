var privats = {
    "gamersList" : {},
    'connectionList' : {}
};

exports.getParticipantNickList = function () {
    var nicks = [];
    for( var i in privats.gamersList )
        nicks.push( i );

    return nicks;
};

exports.assignNewParticipant = function ( UserId, callback ) {
    exports.Services.DocumentManager.find( 'Users', UserId, function ( User ) {
        privats.gamersList[User.getNick()] = { 'User' : User };
        callback();
    });
};

exports.removeParticipant = function ( UserId ) {
    for( var i in privats.gamersList ) {
        if( privats.gamersList[i].User.getId() == UserId ) {
            delete privats.gamersList[i];
            break;
        }
    }
};

exports.getParticipantByUserId = function ( UserId ) {
    for( var i in privats.gamersList ) {
        if( privats.gamersList[i].User.getId().toString() == UserId.toString() ) {
            //console.log( privats.participantsList[i].User.getId(), UserId );
            return privats.gamersList[i].User;
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