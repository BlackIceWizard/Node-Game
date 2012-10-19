var internal = {
    "gamersList" : {},
    'connectionList' : {}
};

exports.getParticipantNickList = function () {
    var nicks = [];
    for( var i in internal.gamersList )
        nicks.push( i );

    return nicks;
};

exports.assignNewParticipant = function ( UserId, callback ) {
    exports.Services.DocumentManager.find( 'Users', UserId, function ( User ) {
        internal.gamersList[User.getNick()] = { 'User' : User };
        callback();
    });
};

exports.removeParticipant = function ( UserId ) {
    for( var i in internal.gamersList ) {
        if( internal.gamersList[i].User.getId() == UserId ) {
            delete internal.gamersList[i];
            break;
        }
    }
};

exports.getParticipantByUserId = function ( UserId ) {
    for( var i in internal.gamersList ) {
        if( internal.gamersList[i].User.getId().toString() == UserId.toString() ) {
            //console.log( internal.participantsList[i].User.getId(), UserId );
            return internal.gamersList[i].User;
        }
    }
    return null;
};


exports.appendNewConnection = function ( ConnectionState ) {
    /*console.log( '--------- Before ---------' );
    for( var i = 0; i < internal.connectionList.length; i++ ) {
        var participant = internal.connectionList[i].getParticipant();
        console.log( i, participant ? participant.getNick() : participant, internal.connectionList[i].getConnectionNumber() );
    }*/
    var number = internal.generateConnectionNumber();
    internal.connectionList[number] = ConnectionState;
    ConnectionState.setConnectionNumber( number );
    /*console.log( '--------- After ---------' );
    for( var i = 0; i < internal.connectionList.length; i++ ) {
        var participant = internal.connectionList[i].getParticipant();
        console.log( i, participant ? participant.getNick() : participant, internal.connectionList[i].getConnectionNumber() );
    }
    console.log( '-------------------------' );*/
};

exports.removeConnection = function ( ConnectionState ) {
    delete internal.connectionList[ConnectionState.getConnectionNumber()];
};

exports.getConnections = function () {
    return internal.connectionList;
};

internal.generateConnectionNumber = function () {
    do {
        var number = Math.random();
    } while( typeof internal.connectionList[ number ] !== 'undefined' );

    return number;
};