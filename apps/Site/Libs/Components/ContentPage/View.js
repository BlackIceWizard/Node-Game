exports.Index = function ( ViewParams, RequestState, Model ) {
    ViewParams.set( 'auth', !!RequestState.getSession().getUserId() );
};

exports.ProjectIdea = function ( ViewParams, RequestState, Model ) {
    ViewParams.set( 'page', 'ProjectIdea' );
};

exports.Auditory = function ( ViewParams, RequestState, Model ) {
    ViewParams.set( 'page', 'Auditory' );
};

exports.BusinessPlan = function ( ViewParams, RequestState, Model ) {
    ViewParams.set( 'page', 'BusinessPlan' );
};

exports.Competitors = function ( ViewParams, RequestState, Model ) {
    ViewParams.set( 'page', 'Competitors' );
};

exports.Benefits = function ( ViewParams, RequestState, Model ) {
    ViewParams.set( 'page', 'Benefits' );
};

exports.Promotion = function ( ViewParams, RequestState, Model ) {
    ViewParams.set( 'page', 'Promotion' );
};

exports.WhatHasBeenDone = function ( ViewParams, RequestState, Model ) {
    ViewParams.set( 'page', 'WhatHasBeenDone' );
};