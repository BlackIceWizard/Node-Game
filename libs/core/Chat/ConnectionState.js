var privats = {};

exports.getInstance = function () {
    return new privats.ConnectionState();
};

privats.ConnectionState = function() {
    var Session = null;
    var isMessageQueueFree = true;
    var messageQueue = [];
    var participant = null;
    var number = null;

    this.stream = null;

    this.setConnectionStream = function ( stream ) {
        this.stream = stream;
    };

    this.getConnectionStream = function ( stream ) {
        return this.stream;
    };

    this.setSession = function ( pSession ) {
        Session = pSession;
    };

    this.getSession = function () {
        return Session;
    };

    this.pushInMessageQueue = function ( message ) {
        messageQueue.push( message );
    };

    this.popOutOfMessageQueue = function () {
        if( messageQueue.length )
            return messageQueue.pop();
        else
            return null;
    };

    this.isMessageQueueFree = function () {
        return isMessageQueueFree;
    };

    this.takePlaceInMessageQueue = function () {
        isMessageQueueFree = false;
    };

    this.setFreeMessageQueue = function () {
        isMessageQueueFree = true;
    };

    this.setParticipant = function ( pParticipant ) {
        participant = pParticipant;
    };

    this.getParticipant = function () {
        return participant;
    };

    this.setConnectionNumber = function ( pNumber ) {
        number = pNumber;
    };

    this.getConnectionNumber = function () {
        return number;
    };
};





