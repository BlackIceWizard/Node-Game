exports.ShowLoginPage = function ( ActionParams, ViewParams, Model, RequestState, callback ) {
    callback();
};

exports.DoLogIn = function ( ActionParams, ViewParams, Model, RequestState, callback ) {
    var RequestData = RequestState.getRequestData();

    Model.lookUpForUser( RequestData.getVar( 'Nick', '' ), RequestData.getVar( 'Password', '' ), function ( User ) {
        if( User === null ) {
            ViewParams.set( 'error', 'Пользователь с таким именем и паролем не найден' );
            callback();
            return;
        }


        RequestState.logIn( User.getId() );
        RequestState.setRedirect( '/' );
        callback();
    });
};

exports.DoLogOut = function ( ActionParams, ViewParams, Model, RequestState, callback ) {
    var Session = RequestState.logOut();
    RequestState.setRedirect( '/' );
    callback();
};