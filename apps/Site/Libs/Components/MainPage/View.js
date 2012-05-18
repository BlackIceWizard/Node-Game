exports.Index = function ( ViewParams, RequestState, Model ) {
    ViewParams.set( 'auth', !!RequestState.getSession().getUserId() );
};