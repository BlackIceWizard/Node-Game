exports.configuration = {
    MongoDB : {
        port : 27017,
        host : 'localhost',
        database : 'nodegame'
    },

    Site : {
        SessionLifeTime : 24*60*60*1000,
        UnregisteredSessionLifeTime : 1*60*60*1000,
        SessionCookieLifeTime : 7*24*60*60*1000,
        SecretWord : 'test'
    }
};
