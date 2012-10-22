/**
 * Функция для инстанциирования класса модуля. Если она присутствует в модуле, значит модуль можно инстанционировать
 * через функцию getModuleInstance сервиса ModuleProvider. Данная функция не может содержать параметров
 * @return {Object} ModuleInstance
 */
exports.getInstance = function () {
    return new RequestProcessor()
};

/**
 * @class Служит обработчиком HTTP запросов к серверу
 */
var RequestProcessor = function () {

    /** content-type обрабатываемого запроса */
    var contentType = '';

    /** JSON объект, содержащий посланные запросом данные */
    var requestJSON = {};

    /**
     * Стандартная функция инициализации начального состояния класса
     * @param  {String} pContentType content-type обрабатываемого запроса
     */
    this.initialize = function ( pContentType ) {
        contentType = pContentType;
    };


    /**
     * Метод для преобразования строки запроса в объект JSON
     * @param {String} requestStr Текст запроса
     * @return {Boolean}
     */
    this.parseRequestStr = function( requestStr ) {
        if( !requestStr )
            return false;

        /** Прорабатываем случай, когда POST запрос отправлен с enctype = "application/x-www-form-urlencoded" */
        if( contentType.indexOf( 'application/x-www-form-urlencoded' ) != -1 ) {
            var queryString = require('querystring');
            requestJSON = queryString.parse(requestStr);

        }
        /** Прорабатываем случай, когда POST запрос отправлен с enctype = "multipart/form-data" */
        else {
            //todo: проработать обработку POST запросов отправленых с enctype = "multipart/form-data"
            //var queryString = require('querystring');
        }

        return true;
    };


    /**
     * Метод getter для отдачи requestJSON
     * @return {JSON}
     */
    this.getRequestJSON = function() {
        return requestJSON;
    };


    /**
     * Метод getter для отдачи contentType
     * @return {String}
     */
    this.getContentType = function() {
        return contentType;
    };


    /**
     * Метод getter для отдачи параметра запроса
     * @param {String} name имя параметра
     * @param {String} defaultValue значение по умолчанию
     * @return {String} параметр запроса
     */
    this.getVar = function ( name, defaultValue ) {
        if( typeof defaultValue == "undefined" )
            var defaultValue = null;
        
        if( typeof requestJSON[name] != "undefined" )
            return requestJSON[name];
        else
            return defaultValue;
    };

    /**
     * Метод getter для отдачи числового параметра запроса
     * @param {String} name имя параметра
     * @param {String} defaultValue значение по умолчанию
     * @return {Integer} параметр запроса
     */
    this.getInt = function ( name, defaultValue ) {
        if( typeof defaultValue == "undefined" )
            var defaultValue = null;

        var result = this.getVar( name, defaultValue )

        if( result === null  )
            return null;
        else
            return parseInt( result );
    }
};