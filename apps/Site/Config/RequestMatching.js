exports.requests = [
    /*  ----- Game Section -----  */
    {
        URL : [ '^/arena/{game}/{team}$' ],
        Component : 'Arena',
        ActionParams : { action : 'AssignInGame', game : null, team : null },
        ViewParams : { template : 'Default', layoutFolder : 'Arena',    layout : 'Index' }
    },

    /*  ----- Login Section -----  */
    {
        URL : [ '^/login/{action}$',
                '^/login/?$' ],
        Component : 'Login',
        ActionParams : { action : 'ShowLoginPage' },
        ViewParams : { template : 'Default', layoutFolder : 'Login',    layout : 'Index' }
    },

    /*  ----- SignIn Section -----  */

    {
        URL : [ '^/signin/welcome$' ],
        Component : 'Signin',
        ActionParams : { action : 'ShowWelcomePage' },
        ViewParams : { template : 'Default', layoutFolder : 'Signin',   layout : 'Welcome' }
    },
    {
        URL : '^/signin/?$',
        Component : 'Signin',
        ActionParams : { action : 'ShowSigninPage' },
        ViewParams : { template : 'Default', layoutFolder : 'Signin',   layout : 'Index' }
    },
    {
        URL : [ '^/jsignin/{action}$' ],
        Component : 'Signin',
        ActionParams : { action : 'ShowSigninPage' },
        ViewParams : { template : 'JSON', layoutFolder : 'JSignin',   layout : 'Index' }
    },




    /*  ----- content Section -----  */
    {
        URL : '^/page/{page}$',
        Component : 'ContentPage',
        ActionParams : { action : 'ShowContentPage' },
        ViewParams : { template : 'Default', layoutFolder : 'ContentPage', layout : '' }
    },

    /*  ----- Main Section -----  */

    {
        URL : '^/+$',
        Component : 'MainPage',
        ActionParams : { action : 'ShowMainPage' },
        ViewParams : { template : 'Default', layoutFolder : 'MainPage', layout : 'Index' }
    }
];