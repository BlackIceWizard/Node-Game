var privats = {};

exports.getInstance = function () {
    return new privats.ConnectionState();
};

privats.ConnectionState = function() {
    var Session = null;

    this.setSession = function ( pSession ) {
        Session = pSession;
    };

    this.getSession = function () {
        return Session;
    };
};




