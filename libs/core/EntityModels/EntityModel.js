var internal = {};
internal.dm = null;

exports.construct = function ( callback ) {
    internal.dm = exports.Services.DocumentManager;
    callback( exports );
};

exports.newEntity = function ( collection ) {
    
};

exports.find = function ( collection, id ) {

};

exports.save = function ( entity ) {

};

exports.remove = function ( entity ) {

};

exports.removeById = function ( id ) {

};

exports.bind = function ( entity, data ) {

};
