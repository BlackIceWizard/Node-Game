/**
 @class Служит обработчиком HTTP запросов к серверу
 */
var ServiceContainer = function () {

    /** Содержит ModuleProvider */
    var ModuleProvider = null;

    /** Коллекция сервисов */
    var Services = {};

    /** Содержит конфигурацию ининциализации сервисов */
    var ServicesConfig = [];

    /** Функция обратного вызова запустится по окончанию инициализации сервисов */
    var callback = null;

    /** Счетчик количества сервисов, находящихся в процессе инициализации */
    var servicesInProgress = 0;

    /** Следующий уровень сервисов для инициализации */
    var NextLevel = 0;


    /**
     * Стандартная функция инициализации начального состояния класса
     * @param  {ModuleProvider} pModuleProvider Провайдер модулей нужен для работы класса и становится первым сервисом
     * @param  {Config} pConfigModule  Класс конфигурации
     * @return {ServiceContainer} Данный модуль
     */
    this.initialize = function ( pModuleProvider, pConfigModule ) {
        ModuleProvider = pModuleProvider;

        /** Загружаем конфигурацию инициализации сервисов */
        loadServicesConfig(  pConfigModule );

        /** Возвращаем данный модуль */
        return module.exports;
    };


    /**
     * Метод запускает инициализацию сервисов
     * @param {Function} pCallback Функция обратного вызова, которая запустится по окончанию инициализации сервисов
     */
    this.initServices = function ( pCallback ) {
        callback = pCallback;

        /** Регистрируем ModuleProvider как сервис. Это нужно делать в ручную, так как ModuleProvider инициализируется
         * раньше чем данный модуль */
        registerModuleProvider();

        /** Проводим рекурсивную инициализацию уровней сервисов */
        serviceLevelInit( ServicesConfig );
    };


    /**
     * Метод геттер для отдачи всего списка инициализированных сервисов
     * @return {Object} Список инициализированных сервисов
     */
    this.getServices = function() {
        return Services;
    };


    /**
     * Метод подгружает в класс конфигурацию инициализации сервисов
     * @param {Config} ConfigModule Модуль содержащий конфигурацию инициализации сервисов
     */
    var loadServicesConfig = function ( ConfigModule ) {
        ServicesConfig = ModuleProvider.getModule( ConfigModule ).ServicesConfig;
    };


    /**
     * Метод инициализирует один уровень сервисов из конфигурацию инициализации сервисов
     * @param {Object} serviceLevel часть или вся конфигурация инициализации сервисов
     */
    var serviceLevelInit = function ( serviceLevel ) {

        NextLevel = null;

        /** Перебираем один уровень сервисов */
        for( var serviceName in serviceLevel ) {
            /** Если наткнулись на объявление следующего уровня сервисов, то переходим к инициализации
             * обнаруженного уровня сервисов */
            if( serviceName == 'NextLevel' ) {
                /** Назначаем обнаруженный уровень сервисов в отдельную переменную */
                NextLevel = serviceLevel['NextLevel'];

                /** Так как уровень сервисов не явлется сервисом. переходим к следующей итерации */
                continue;
            }

            /** Берем объявление сервиса из конфигурации инициализации сервиса в отдельную переменную */
            var serviceDefinition = serviceLevel[serviceName];

            /** Далее наименование сервиса нам пригодится в самом объявлении сервиса */
            serviceDefinition.name = serviceName;

            /** Инкрементируем счетчик количества инициализируемых в данный момент сервисов */
            servicesInProgress++;

            /** Устанавливаем нулевой таймаут на инициализацию конкретного сервиса, чтобы инициализация
             * сервиса происходила в новом потоке */
            setTimeout( serviceInit, 0, serviceDefinition );
        }

    };


    /**
     * Метод инициализирует сервис
     * @param {Object} serviceDefinition Объявление сервиса
     */
    var serviceInit = function ( serviceDefinition ) {
        /** Выводим в консоль свединия о том, что запущена инициализация сервиса */
        console.log( 'Init log: Service "'+serviceDefinition.name+'" initializing' );

        /** Получаем модуль сервиса */
        var ServiceModule = ModuleProvider.getModule( serviceDefinition.module );

        /** Если сервис уже инициализирован, то повторная инициализация уже не нужна */
        if( typeof Services[serviceDefinition.name] != 'undefined' ) {
            afterServiceInit( serviceDefinition.name, ServiceModule );

        /** Если модуль сервиса содержит метод инициализации, то запускаем его, иначе
         *  отправляем его на регистрацию в списке сервисов */
        } else if( typeof ServiceModule.initialize == 'function' ) {
            ServiceModule.initialize( function ( ServiceModule ) {
                afterServiceInit( serviceDefinition.name, ServiceModule );
            });
        } else if( typeof ServiceModule.construct == 'function' ) {
            ServiceModule.construct( function ( ServiceModule ) {
                afterServiceInit( serviceDefinition.name, ServiceModule );
            });
        } else
            afterServiceInit( serviceDefinition.name, ServiceModule );
    };


    /**
     * Метод регистрирует сервис в списке сервисов после того как он был инициализирован
     * @param {String} ServiceName Наименование сервиса
     * @param {Object} Service Модуль сервиса
     */
    var afterServiceInit = function ( ServiceName, Service ) {
        /** Регистрируем инициализированный сервис */
        Services[ServiceName] = Service;

        /** Выводим в консоль уведомление о завершенной инициализации сервиса */
        console.log( 'Init log: Service "'+ServiceName+'" initialized' );

        /** Декрементируем счетчик сервисов, находящихся в процессе инициализации */
        servicesInProgress--;

        /** Если счетчик сервисов, находящихся
         * в процессе инициализации, уже равен нулю, то проверяем на наличие следующего уровня сервисов.*/
        if( servicesInProgress == 0 ) {
            if( NextLevel === null ) {
                /** Если нет следующего уровня сервисов, то выходим из процесса инициализации сервисов */
                callback( Services );
            } else {
                /** Иначе продолжаем рекурсивную инициализацию сервисов от следующего уровня сервисов и глубже */
                serviceLevelInit( NextLevel );
            }
        }


    };

    /** Метод регистрирует ModuleProvider как сервис. Это нужно делать в ручную, так как ModuleProvider инициализируется
     * раньше чем данный модуль */
    var registerModuleProvider = function() {
        Services['ModuleProvider'] = ModuleProvider;
    };
};


/** Делаем класс публичным для использования в других модулях */
module.exports = new ServiceContainer();
