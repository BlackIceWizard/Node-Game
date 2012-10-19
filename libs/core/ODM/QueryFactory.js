var internal = {};

exports.getQuery = function () {
    return new internal.query( exports.Services.DocumentManager );
};


internal.query = function ( DocumentManager ) {
    this.dm = DocumentManager;

    this.action = null;

    this.sortBy = null;
    this.collection = null;
    this.expression = null;
    this.callback = null;
    this.maxResults = null;
    this.offset = null;

    this.find = function( collection, expression, callback ) {
        this.action = 'find';
        this.setCollection( collection );
        this.setExpression( expression );
        this.setCallback( callback );
    };

    this.setSortBy = function ( params ) {
        this.sortBy = params;
    };

    this.setCollection = function ( collection ) {
        this.collection = collection;
    };

    this.setExpression = function ( expression ) {
        this.expression = expression;
    };

    this.setCallback = function ( callback ) {
        this.callback = callback;
    };

    this.setMaxResults = function ( maxResults ) {
        this.maxResults = maxResults;
    };

    this.setOffset = function ( offset ) {
        this.offset = offset;
    };

    this.fetch() {
        //this.dm.connection
    };

    this.insert = function( collection, entity, callback ) {

    };

    this.remove = function( collection, query, callback ) {

    };

    this.update = function( collection, entity, callback ) {

    };

};