exports.ShowSigninPage = function ( ActionParams, ViewParams, Model, RequestState, callback ) {
    callback();
};

exports.ShowWelcomePage = function ( ActionParams, ViewParams, Model, RequestState, callback ) {
    callback();
};

exports.StoreUser = function ( ActionParams, ViewParams, Model, RequestState, callback ) {
    /*{ nick: '',
      password: '',
      repassword: '',
      email: '',
      site: '',
      name: '' }*/

    DM = exports.Services.DocumentManager;

    var RequestData = RequestState.getRequestData();

    var formData = RequestData.getRequestJSON();

    var errors = {};


    
    if( Model.prepareAndValidate( formData, errors ) > 0 ) {
        ViewParams.set( 'success', false );
        ViewParams.set( 'errors', errors );
        callback();
        return;
    }

    ViewParams.set( 'success', true );

    var User = DM.newEntity( 'Users' );

    DM.bind( User, formData );

    DM.save( User, function ( User ) {
        //RequestState.setRedirect( '/login' );
        callback();
    });

}; 