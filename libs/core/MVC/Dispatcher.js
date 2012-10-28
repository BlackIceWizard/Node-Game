/**
 * @class Организует функционирование MVC модели. Получает на входе данные о HTTP запросе пользователя,
 * а на выходе результат для отображения в браузере (Headers, HTML/JSON текст)
 */
var Dispatcher = function () {

    /** Содержит объект Router */
    var router = null;

    /** Содержит сервис ModuleProvider */
    var MP = null;

    /** Сожержит HTTP путь к сайту проекта */
    var site_base = '';

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
     * Инициализирует класс
     */
    this.initialize = function () {
        router = Services.ModuleProvider.getModule( 'Core/MVC/Router' );
        MP = Services.ModuleProvider;
        site_base = Services.Config.get( 'Site', 'Base' );
    };


    /**
     * Запускает обработку HTTP запроса пользовательского браузера
     * @param {Object} request Стандартный объект запроса, создаваемый при отправке пользователем запроса
     * @param {Object} response Стандартный объект ответа на запрос, создаваемый при отправке пользователем запроса
     * @param {Integer} session_id Индентификатор сессии пользователя
     */
    this.dispatch = function ( request, response, session_id ) {

        /** Обрабатываем адрес запроса и получаем соответствующий для него route */
        var route = router.getRoute( request );

        /** Eсли action не установлен в запросе, то контроллер не понадобится */
        if( route.ActionParams.action !== null ) {
            var Controller = MP.getModule( 'Site/Components/'+route.Component+'/Controller' );
        }
        var Model      = MP.getModule( 'Site/Components/'+route.Component+'/Model' );
        var View       = MP.getModule( 'Site/Components/'+route.Component+'/View' );

        /** Инициализируем объект RequestState */
        var RequestState = MP.getModule( 'Core/MVC/RequestState' ).getInstance();
        RequestState.setRequest( request );
        RequestState.setResponse( response );
        RequestState.setSession( session_id );

        /** Создаем объект, который будет содержать необходимые данные для всех стадий обработки данного запроса */
        var namespace = {
            'route' : route,
            "Controller" : Controller,
            'Model' : Model,
            'View' : View,
            'RequestState' : RequestState
        };

        /** Запуск второй стадии обработки запроса - сбор данных из запроса */
        grabbingRequestData ( namespace );
    };


    /**
     * Метод осуществляет вторую стадию обработки запроса - сбор данных из запроса
     * @param {Object} namespace объект для передачи данных между стадими обработки запроса
     */
    var grabbingRequestData = function ( namespace ) {

        var request = namespace.RequestState.getRequest();

        /** Получаем RequestProcessor и инициализируем его */
        var RequestProcessor = MP.getModuleInstance( 'Core/RequestProcessor' );
        RequestProcessor.initialize( request.headers['content-type'] );

        var requestStr = "";

        /** Читаем текст запроса по кусочкам */
        request.addListener("data", function (chunk) { requestStr += chunk } );

        /** Когда весь текст запроса прочитан парсим его запускаем третью следующую стадию обработки запроса */
        request.addListener("end", function () {
            RequestProcessor.parseRequestStr( requestStr );
            namespace.RequestState.setRequestData( RequestProcessor );
            setTimeout( executingController, 0, namespace );
        } );
    };


    /**
     * Метод осуществляет третью стадию обработки запроса - запуск контроллера
     * @param {Object} namespace объект для передачи данных между стадими обработки запроса
     */
    var executingController = function( namespace ) {

        /** Eсли action не установлен в запросе, то запуск контроллера не требуется */
        if( namespace.route.ActionParams.action === null ) {
            /** Переходим к следующей стадии */
            postExecutingController( namespace );
            return;
        }

        var action = ucfirst( namespace.route.ActionParams.action );

        /** Создаем исключение, если в контроллере не обнаружена функция, соответствующая названию аction из запроса */
        if( typeof namespace.Controller[action] == 'undefined'  )
            throw new Error('Dispatcher: controller "Site/Components/'+namespace.route.Component+'/Controller" does not contain function "'+action+'"');

        /** Запускаем контроллер */
        namespace.Controller[action]( namespace.route.ActionParams, namespace.route.ViewParams, namespace.Model, namespace.RequestState, function () {
            /** Переходим к следующей стадии */
            postExecutingController( namespace );
        });
    };


    /**
     * Метод осуществляет третью стадию обработки запроса - обработка результатов работы контроллера
     * @param {Object} namespace объект для передачи данных между стадими обработки запроса
     */
    var postExecutingController = function( namespace ) {

        var SessionHandler = MP.getModule( 'Core/Session/Handler' );

        /** Посылаем куки с указанием ключа сессии пользователя */
        SessionHandler.sendSessionCookie( namespace.RequestState.getSessionId(), namespace.RequestState.getResponse() );

        /** Если во время выполнения контроллера мы указали редирект, то создаем редирект и прерываем
         * дальнейшую обработку запроса */
        var redirect = namespace.RequestState.getRedirect();
        if( redirect ) {

            if( redirect.substr( 0, 7 ) !== "http://" ) {


                if( redirect.substr( 0, 1 ) !== "/" )
                    redirect = '/'+redirect;

                redirect = site_base+redirect;
            }


            var response = namespace.RequestState.getResponse();
            /** Указываем редирект с 301 статусом в заголовках */
            response.writeHead(301, {'Location': redirect } );
            /** Отдаем ответ браузеру клиента */
            response.end();
        } else {
            /** Переходим к следующей стадии обработки запроса */
            setTimeout( executingView, 0, namespace );
        }
    };


    /**
     * Метод осуществляет четвертую стадию обработки запроса - обработка данных перед выводом в браузер
     * @param {Object} namespace объект для передачи данных между стадими обработки запроса
     */
    var executingView = function ( namespace ) {
        /** Получаем слой, в рамках которого мы будем делать вывод в браузер */
        var layout = namespace.route.ViewParams.getLayout();

        /** Если View не содержит функции для обработки нужного слоя, то создаем исключение */
        if( typeof namespace.View[layout] == 'undefined'  )
            throw new Error('Dispatcher: View "Site/Components/'+namespace.route.Component+'/View" does not contain function "'+layout+'"');

        /** Запускаем метод вью */
        namespace.View[layout]( namespace.route.ViewParams, namespace.RequestState, namespace.Model );

        /** Переходим к следующей стадии */
        setTimeout( renderingTemplate, 0, namespace );
    };


    /**
     * Метод осуществляет пятую стадию обработки запроса - рендеринг данных посылаемых браузеру пользователя
     * @param {Object} namespace объект для передачи данных между стадими обработки запроса
     */
    var renderingTemplate = function ( namespace ) {
        var response = namespace.RequestState.getResponse();

        /** Получаем шаблон в котором будет отображен нужный слой */
        var Template = MP.getModule( 'Site/Templates/'+namespace.route.ViewParams.getTemplate() );

        /** Запускаем получаем конечный вид данных отсылаемых пользователю */
        Template.getContent( namespace.route.ViewParams, namespace.RequestState, function ( output ) {
            var contentType = Template.getContentType();
            /** Отсылаем данные пользовательскому браузеру */
            executeOutput( output, response, contentType );
        });
    };


    /**
     * Метод осуществляет шестую стадию обработки запроса - вывод данных в пользовательский браузер
     * @param {String} output Выводимые данные
     * @param {Object} response Объект вывода
     * @param {String} contentType Тип выводимого контента для указания в заголовках
     */
    var executeOutput = function ( output, response, contentType ) {
        /** Указываем тип контента в заголовках */
        response.writeHead(200, {'Content-Type': contentType});

        /** Производим вывод данных */
        response.end( output );
    };


    /**
     * Делает первую букву в указанной строке в верхнем регистре
     * @param {String} str
     * @return {String}
     */
    var ucfirst = function (str) {
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
    };
};

/** Делаем класс публичным для использования в других модулях */
module.exports = new Dispatcher();