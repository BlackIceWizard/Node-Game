exports.requests = [
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

    /*  ----- MainPage Section -----  */

    {
        URL : '^/+$',
        Component : 'MainPage',
        ActionParams : { action : 'ShowMainPage' },
        ViewParams : { template : 'Default', layoutFolder : 'MainPage', layout : 'Index' }
    }
];