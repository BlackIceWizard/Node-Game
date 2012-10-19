/**
 @class Служит провайдером модулей
 */
var ModuleProvider = function() {

    /** Корневая директория проекта */
    var rootDirectory = '';

    /** Содержит все маршрутизации модулей */
    var ModuleRouts = null;

    /** Контейнер сервисов */
    var ServiceContainer = null;

    /** Кэш модулей, которые однажды были уже получены через данный класс */
    var CachedModules = {};


    /**
     * Инициализирует класс, подгружая маршрутизацию модулей из файла
     * @param  {String} pRootDirectory Корневая директория проекта
     * @return {ModuleProvider} Данный модуль
     */
    this.construct = function ( pRootDirectory ) {
        rootDirectory = pRootDirectory;

        /** Единственное место в проекте где модули проекта подлючаются функцией require() */
        ModuleRouts = require( rootDirectory+'/config/ModuleRouts' ).routs;

        /** Возращаем модуль, что бы сделать его сервисом */
        return module.exports;
    };


    /**
     * Назначает контейнер сервисов модулю
     * @param  {ServiceContainer} pServiceContainer Контейнер сервисов
     */
    this.setServiceContainer = function ( pServiceContainer ) {
        ServiceContainer = pServiceContainer;
    };


    /**
     * Метод для находит модуль по короткому пути: маршрут + уточнение директории + имя модуля
     * @param  {String} path Маршрут к модулю
     * @return Module
     */
    this.getModule = function ( path ) {

        /** Если искомый модуль уже был хоть раз получен через данную функцию, то просто возращаем его из кэша */
        if( typeof CachedModules[path] != 'undefined' )
            return CachedModules[path];

        /** Находим полный путь модулю */
        var route = getRoute( path );

        /** Если маршрут для модуля не найден в конфигурации проекта и полный путь составить не получилось,
         * то создаем исключение */
        if( route === null ) {
            throw new Error('ModuleProvider: not found ROUTE for PATH "'+path+'"');
        }

        var module_resolved = true;

        /** Проверяем на наличие запрошенного модуля */
        try {
            require.resolve( route );
        } catch (err) {
            module_resolved = false;
        }

        /** Если модуль не обнаружен по составленному полному пути, то создаем исключение */
        if( !module_resolved ) {
            throw new Error('ModuleProvider: MODULE "'+path+'" not found by ROUTE "'+route+'"');
        }

        /** Подгружаем модуль стандартной функцией языка **/
        var found_module =  require( route );

        /** Делаем инъекцию списка сервисов в подгруженный модуль,
         *  тем самым реализуется шаблон проектирования DependencyInjection */
        if( ServiceContainer )
            assignServicesIntoModule( found_module );

        return found_module;
    };

    /**
     * Метод определяет какой именно маршрут нужно использовать для нахождения модуля
     * @param  {String} path Маршрут к модулю
     * @return {String} Маршрут
     */
    var getRoute = function( path ) {
        var route = null;

        /** Проходим по всем маршрутам модулей, которые были указаны в конфигурации проекта, и ищем соответствия */
        for( var i = 0; i < ModuleRouts.length; i++ ) {

            /** Если маршрут состоит в пути искомого модуля и если он располагается в самом начале этого пути,
             *  то, значит, мы нашли искомый маршрут */
            if( path.indexOf( ModuleRouts[i].rool ) === 0 ) {

                /** Составляем полный путь до модуля в файловой системе сервера и выходим из перебора маршрутов */
                route = rootDirectory + '/' + ModuleRouts[i].route + path.substr( ModuleRouts[i].rool.length );
                break;
            }
        }

        return route;
    };

    /**
     * Метод для инъекции списка сервисов в модуль
     * @param  {Object} module Модуль для инъекции
     */
    var assignServicesIntoModule = function ( module ) {
        /** Список сервисов будет доступен в любом модуле через переменную Services в объекте exports */

        if ( typeof  module.assignServices != "undefined" ) {
            module.assignServices( ServiceContainer.getServices() );
        } else {
            module.Services = ServiceContainer.getServices();
        }


    };

    /**
     * Метод для нахождения всех модулей в указанной директории
     * @param  {String} path Маршрут к исследуемой директории
     * @param  {Boolean} [absolutePath=false] Флаг, указывающий нужны ли в результате полные пути к найденным модулям
     * @return {Array} Массив путей к найденным в директории модулям
     */
    this.discoverPath = function( path, absolutePath ) {
        /** Устанавливаем параметру значение по умолчанию */
        if( arguments.length < 2 )
            absolutePath = false; 
    
        var fs = require( 'fs' );
        var result = [];

        /** Определяем полный путь исследуемой директории */
        var route = getRoute( path );

        var FileList = [];

        /** Проверяем на наличие исследуемой директории, если она не обнаружена, то создаем исключение */
        try {
            FileList = fs.readdirSync( route );
        } catch (err) {
            throw new Error('ModuleProvider: PATH "'+path+'" not found by ROUTE "'+route+'"');
        }
    
        /** Перебираем найденные файлы в исследуемой директории */
        for( var i = 0; i < FileList.length; i++ ) {
            /** Проверяем чтобы файлы в результирующем наборе соответствовали шаблону *.js */
            if( FileList[i].substr( -3 ) != '.js' )
                continue;

            /** Исходя из значения параметра absolutePath делаем результирующие пути абсолютными
             *  или оставляем как есть */
            if( absolutePath )
                result.push( path + '/' + FileList[i].substr( 0, FileList[i].length-3 ) );
            else
                result.push( FileList[i].substr( 0, FileList[i].length-3 ) );
    
        }
    
        return result;
    };

    /**
     * Делает все то же самое что и функция getModule, но при этом запускает функцию getInstance найденного модуля
     * и возвращает ее результат
     * @param  {String} path Маршрут к модулю
     * @return ModuleInstance
     */
    this.getModuleInstance = function ( path ) {
        var found_module = module.exports.getModule( path );
        if( typeof  found_module.getInstance() == "undefined" ) {
            throw new Error('ModuleProvider: MODULE "'+path+'" not contain method "getInstance" ROUTE "'+route+'"');
        }

        return found_module.getInstance();
    }
};

/** Делаем класс публичным для использования в других модулях */
module.exports = new ModuleProvider();