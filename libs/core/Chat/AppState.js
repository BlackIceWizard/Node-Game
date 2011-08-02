var privats = {
    'participantsList' : {}
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
            console.log( privats.participantsList[i].User.getId(), UserId );
            return privats.participantsList[i].User;
        }
    }
    return null;
};



