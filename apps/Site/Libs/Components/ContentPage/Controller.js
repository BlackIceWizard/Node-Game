exports.ShowContentPage = function ( ActionParams, ViewParams, Model, requestState, callback ) {

    switch( ActionParams.page ) {
        case 'project-idea' :
            ViewParams.setLayout( 'ProjectIdea' );
            break;
        case 'auditory' :
            ViewParams.setLayout( 'Auditory' );
            break;
        case 'business-plan' :
            ViewParams.setLayout( 'BusinessPlan' );
            break;
        case 'competitors' :
            ViewParams.setLayout( 'Competitors' );
            break;
        case 'benefits' :
            ViewParams.setLayout( 'Benefits' );
            break;
        case 'promotion' :
            ViewParams.setLayout( 'Promotion' );
            break;
        case 'what-has-been-done' :
            ViewParams.setLayout( 'WhatHasBeenDone' );
            break;
        default:
            RequestState.setRedirect( '/' );
            break;
    }

    callback();
};