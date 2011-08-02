exports.prepare = function ( params, RequestState, callback ) {
    var DM = exports.Services.DocumentManager;
    //RequestState.logIn( DM.toObjectID( '4e0deb85cd795bb008000001' ) );
    var UserId = RequestState.getSession().getUserId();


    if( !UserId ) {
        callback( { 'auth' : false } );
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
