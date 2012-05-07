exports.prepare = function ( params, RequestState, callback ) {
    params.auth = !!RequestState.getSession().getUserId();
    callback();
};
