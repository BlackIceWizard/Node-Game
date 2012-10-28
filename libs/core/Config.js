/**
 * @class предоставляет доступ к конфигурации проекта.
 */
var Config = function () {

    /** Cодержит параметры конфигурации */
    var configuration = {};

    /** Список сервисов. Не инициализирован на момент инициализации модуля */
    var Services = {};


    /**
     * Инжектит сервисы в модуль
     * @param  {Object} pServices Список сервисов
     */
    this.assignServices = function ( pServices ) {
        Services = pServices;
    };


    /**
     * Инициализирует класс, подгружая конфигурацию проекта из файла
     * @param  {Function} callback Функция обратного вызова
     */
    this.initialize = function ( callback ) {
        /** Получаем модуль с параметрами конфигурации */
        var ConfigurationSource = Services.ModuleProvider.getModule( 'Config/General' );

        /** Записываем параметры конфигурации в приватное свойство класса */
        configuration = ConfigurationSource.configuration;

        /** Возвращаем модуль, чтобы сделать его сервисом */
        callback( module.exports );
    };


    /**
     * Метод геттер для отдачи параметра конфигурации
     * @param  {String} section Раздел параметров в конфигурации
     * @param  {String} key Ключ параметра в разделе
     * @return Mixed
     */
    this.get = function ( section, key ) {
        return configuration[section][key];
    };
};

/** Делаем класс публичным для использования в других модулях */
module.exports = new Config();
