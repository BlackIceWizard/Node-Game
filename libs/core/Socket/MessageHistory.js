var privats = {};

exports.getInstance = function () {
    return new privats.MessageHistory();
};

privats.MessageHistory = function() {
    var messages = {};
    var capacity = 200;
    var topMessageNumber = 0;
    var bottomMessageNumber = 1;

    this.getMessage = function ( number ) {
        if( typeof messages[number] != 'undefined' )
            return messages[number];
        else
            return null;
    };

    this.getNextMessageNumber = function () {
        return topMessageNumber + 1;
    };

    this.pushMessage = function ( message ) {
        topMessageNumber++;

        messages[topMessageNumber] = message;

        if(topMessageNumber - bottomMessageNumber > capacity ) {
            delete messages[bottomMessageNumber];
            bottomMessageNumber++;
        }

        return topMessageNumber;
    }
};





