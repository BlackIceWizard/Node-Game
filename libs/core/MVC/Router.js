/**
 * @class обеспечивает маршрутизацию запросов
 */
var Router = function () {

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
     * Метод определяет компонент для обработки запроса и сопутствующие параметры
     * @param {Object} request стандартный объект запроса
     * @return {Object} параметры маршрутизации
     */
    this.getRoute = function ( request ) {
        var MP = Services.ModuleProvider;

        /** @namespace Объявляем структуру результирующих параметров маршрутизации */
        var result = { 'Component' : '', 'ActionParams' : {}, 'ViewParams' : {} };

        /** Получаем маршруты */
        var requestMatching = MP.getModule( 'Site/Config/RequestMatching' ).requests;

        var matchedRequestDefinition = null;

        /** Выводим запрошенный адресс в консоль */
        console.log( request.url );


        /** Перебираем все маршруты, чтобы найти совпадение с запрошенным адресом */
        for( var i = 0; i < requestMatching.length; i++ ) {

            /** Если объявление маршрута запроса не подготовлено, то делаем это сейчас */
            if( typeof requestMatching[i].URLregexp == 'undefined' )
                initRequestDefinition( requestMatching[i] );

            /** Перебираем шаблоны запросов конкретного маршрута */
            for( var key in requestMatching[i].URLregexp ) {

                /** Проверяем на соответствие адресу запроса рассматриваемый маршрут */
                if( requestMatching[i].URLregexp[key].test( request.url ) ){

                    /** Сохраняем найденный маршрут в переменную */
                    matchedRequestDefinition = requestMatching[i];

                    /** Указываем в результирующих параметрах компонент для обработки запроса */
                    result.Component = requestMatching[i].Component;

                    /** Указываем в результирующих параметрах action параметры */
                    for( var param_name in requestMatching[i].ActionParams )
                        result.ActionParams[param_name] = requestMatching[i].ActionParams[param_name];


                    var ViewParams = requestMatching[i].ViewParams;

                    /** Проверяем на наличие всех необходимых параметров View, если не находим, то создаем исключение */
                    if( typeof ViewParams.layout == 'undefined' )
                        throw new Error('Dispatcher: matching for "'+request.url+'" does not contain information about view layout (ViewParams.layout)');
                    if( typeof ViewParams.template == 'undefined' )
                        throw new Error('Dispatcher: matching for "'+request.url+'" does not contain information about view template (ViewParams.template)');
                    if( typeof ViewParams.layoutFolder == 'undefined' )
                        throw new Error('Dispatcher: matching for "'+request.url+'" does not contain information about view layoutFolder (ViewParams.layoutFolder)');

                    /** Если все параметры View обнаружены, то получаем ViewParams */
                    result.ViewParams = MP.getModule( 'Core/MVC/ViewParams' ).getInstance( ViewParams.template, ViewParams.layoutFolder, ViewParams.layout );

                    /** Указываем Action параметры, предусмотренные в шаблоне адреса запроса */
                    if( requestMatching[i].segmentVars[key].length > 0 ) {
                        var SegmentActionParameters = getSegmentActionParameters( request.url, matchedRequestDefinition, key );

                        for( param_name in SegmentActionParameters )
                            result.ActionParams[param_name] = SegmentActionParameters[param_name];
                    }

                    /** Если Action не был определен из маршрута, то создаем исключение */
                    if( typeof result.ActionParams.action == 'undefined' )
                        throw new Error('Router: matching for "'+request.url+'" does not contain information about controller action (ActionParams.action)');

                    break;
                }
            }

            if( matchedRequestDefinition !== null )
                break;
        }

        /** Если маршрут не был найден для адреса запроса, то перенаправляем на страницу ошибки */
        if( matchedRequestDefinition == null ) {
            result.Component = 'ErrorPage';
            result.ActionParams = { action : 'ShowErrorPage' };
            result.ViewParams = MP.getModule( 'Core/MVC/ViewParams' ).getInstance( 'Default', 'ErrorPage', 'PageNotFound404' );
        }

        return result;
    };


    /**
     * Метод инициализирует маршрут
     * @param {Object} RequestDefinition Маршрут
     */
    var initRequestDefinition = function ( RequestDefinition ) {
        var segmentVarExp = /\{([^/]+)\}/ig;

        if( typeof(RequestDefinition.URL) != 'object' || !(RequestDefinition.URL instanceof Array) ) {
            RequestDefinition.URL = [RequestDefinition.URL];
        }

        RequestDefinition.URLregexp = {};
        RequestDefinition.segmentVars = {};

        for( var i = 0; i < RequestDefinition.URL.length; i++ ) {
            URL = RequestDefinition.URL[i];
            RequestDefinition.URLregexp[URL] = new RegExp( URL.replace( segmentVarExp, '([^/]+)' ), 'i' );

            RequestDefinition.segmentVars[URL] = [];

            while (( matchings = segmentVarExp.exec( URL)) != null)
                RequestDefinition.segmentVars[URL].push( matchings[1] );
        }
    };


    /**
     * Находит Action параметры предусмотренные в шаблоне запроса
     * @param {String} URL Запрос
     * @param {Object} definition Маршрут
     * @param {Object} key ключ
     * @return {Object} Параметры
     */
    var getSegmentActionParameters = function( URL, definition, key ) {
        var SegmentActionParameters = {};

        matches = URL.match( definition.URLregexp[key] );
        /*console.log( definition.URLregexp );
        console.log( URL );
        console.log( matches );*/


        for( var i = 0; i < definition.segmentVars[key].length; i++ ) {
            SegmentActionParameters[definition.segmentVars[key][i]] = matches[ i+1 ];
        }

        return SegmentActionParameters;
    };
};

/** Делаем класс публичным для использования в других модулях */
module.exports = new Router();