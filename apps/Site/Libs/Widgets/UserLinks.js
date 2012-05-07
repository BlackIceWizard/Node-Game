exports.prepare = function ( params, RequestState, callback ) {
    var DM = exports.Services.DocumentManager;

    var UserId = RequestState.getSession().getUserId();


    if( !UserId ) {
        params.auth = false;
        callback();
        return;
    }


    DM.find( 'Users', UserId, function ( User ) {

        if( User == null ) {
            params.auth = false;
            callback();
            return;
        }

        params.auth = true;
        params.Nick = User.getNick();
        params.UserId = User.getId();

        callback();
    })

};
