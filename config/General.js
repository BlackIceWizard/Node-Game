exports.configuration = {
    MongoDB : {
        port : 27017,
        host : 'localhost',
        database : 'nodegame'
    },

    Site : {
        SessionLifeTime : 24*60*60*1000,
        UnregisteredSessionLifeTime : 60*60*1000,
        SessionCookieLifeTime : 7*24*60*60*1000,
        SecretWord : 'test',
        //Base : 'http://bomberman.servegame.com:8080'
        Base : 'http://nodegame'
        //Base : 'http://195.114.242.216:8080'
    },

    Socket : {
        Areas : {
            Main : 1,
            Chat : 2,
            BomberMan : 3
        }
    }
};
