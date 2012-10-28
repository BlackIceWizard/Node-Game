/**
 * Функция для инстанциирования класса модуля. Если она присутствует в модуле, значит модуль можно инстанционировать
 * через функцию getModuleInstance сервиса ModuleProvider. Данная функция не может содержать параметров
 * @return {Object} ModuleInstance
 */
exports.getInstance = function () {
    return new RequestState()
};

/** Список сервисов. Не инициализирован на момент инициализации модуля */
var Services = {};

/**
 * Инжектит сервисы в модуль
 * @param  {Object} pServices Список сервисов
 */
exports.assignServices = function ( pServices ) {
    Services = pServices;
};

/**
 * @class Класс хранит данные о состоянии обработки запроса и сессию пользователя
 */
var RequestState = function () {

    /** @type {String} Содержит URL для редиректа */
    var redirect = null;

    /** @type {Object} Содержит Post данные запроса */
    var requestData = null;

    /** @type {Object} Стандартный объект запроса, создаваемый при отправке пользователем запроса */
    var request = null;

    /** @type {Object} Стандартный объект ответа на запрос, создаваемый при отправке пользователем запроса */
    var response = null;

    /** @type {Integer} Индентификатор сессии пользователя */
    var sessionId = null;

    /** @type {Object} Сессия пользователя, пославшего запрос */
    var Session = null;


    /**
     * Метод сеттер для внесения Post данных запроса
     * @param {Object} data Post данные запроса
     */
    this.setRequestData = function ( data ) {
        requestData = data;
    };


    /**
     * Метод геттер для взятия Post данных запроса
     * @return {Object} Post данные запроса
     */
    this.getRequestData = function () {
        return requestData;
    };


    /**
     * Метод сеттер для внесения стандартного объекта запроса
     * @param {Object} pRequest Стандартный объект запроса, создаваемый при отправке пользователем запроса
     */
    this.setRequest = function ( pRequest) {
        request = pRequest;
    };


    /**
     * Метод геттер для взятия стандартного объекта запроса
     * @return {Object} Стандартный объект запроса
     */
    this.getRequest = function () {
        return request;
    };


    /**
     * Метод сеттер для внесения стандартного объекта ответа
     * @param {Object} pResponse Стандартный объект ответа, создаваемый при отправке пользователем запроса
     */
    this.setResponse = function ( pResponse ) {
        response = pResponse;
    };


    /**
     * Метод геттер для взятия стандартного объекта ответа
     * @return {Object} Стандартный объект ответа
     */
    this.getResponse = function () {
        return response;
    };


    /**
     * Метод сеттер для внесения идентификатора сессии пользователя
     * @param {Integer} pSessionId Идентификатор сессии пользователя
     */
    this.setSession = function ( pSessionId ) {
        var MP = Services.ModuleProvider;

        sessionId = pSessionId;

        /** Получаем сессию по полученному в параметре идентификатору сессии */
        Session = MP.getModule( "Core/Session/Handler" ).getSession( sessionId );
    };


    /**
     * Метод геттер для взятия сессии пользователя
     * @return {Object} Сессия пользователя
     */
    this.getSession = function () {
        return Session;
    };


    /**
     * Метод геттер для взятия идентификатора сессии пользователя
     * @return {Integer} Идентификатор сессии пользователя
     */
    this.getSessionId = function () {
        return sessionId;
    };


    /**
     * Метод вносит в сесиию данные, говорящие, о том. что пользователь авторизован
     * @param {Object} userObjectId Идентификатор пользователя в базе данных
     */
    this.logIn = function ( userObjectId ) {
        var MP = Services.ModuleProvider;

        /** Заменяем текущую сессию пользователя на сессию, содержащую инфорамацию об аккаунте пользователя */
        var newSessionId = MP.getModule( "Core/Session/Handler" ).replaceWithRegistered( sessionId, userObjectId.toString() );

        /** Указываем сессию зарегистрированного пользователя как текущую сессию */
        this.setSession( newSessionId );
    };


    /**
     * Метод вносит в сесиию данные, говорящие, о том. что пользователь больше не авторизован
     */
    this.logOut = function () {
        var MP = Services.ModuleProvider;

        /** Заменяем текущую сессию пользователя на сессию, не содержащую инфорамацию об аккаунте пользователя */
        var newSessionId = MP.getModule( "Core/Session/Handler" ).replaceWithUnregistered( internal.sessionId );

        /** Указываем сессию незарегистрированного пользователя как текущую сессию */
        this.setSession( newSessionId );

    };


    /**
     * Метод сеттер для внесения URL редиректа
     * @param {String} url URL редиректа
     */
    this.setRedirect = function ( url ) {
        redirect = url;
    };


    /**
     * Метод геттер для внесения URL редиректа
     * @return {String} URL редиректа
     */
    this.getRedirect = function () {
        return redirect;
    };
};