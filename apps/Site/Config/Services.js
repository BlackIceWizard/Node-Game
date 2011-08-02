exports.ServicesConfig = {
    'ModuleProvider' : { module : 'Core/ModuleProvider' },
    'NextLevel' : {
        'Config' : { module : 'Core/Config' },
        'NextLevel' : {
            'RequestProcessor' : { module : 'Core/RequestProcessor' },
            'DocumentManager' : { module : 'Core/ODM/DocumentManager' },
            'EntityModel' : { module : 'Core/EntityModels/EntityModel' },
            'SessionHandler' : { module : 'Core/Session/Handler' }
        }
    }
};