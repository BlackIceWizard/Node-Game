var internal = {
    'projectRootDirectory' : null
};

exports.testParams = {};

exports.init = function ( callback ) {
    var path   = require('path');
    internal.projectRootDirectory = path.normalize( __dirname + '/../../../../' );
    callback()
};

exports.testInstantiate = function( callback ) {
    //exports.assertThrow
    internal.ModuleProvider = require( internal.projectRootDirectory + '/libs/core/ModuleProvider' ).construct( internal.projectRootDirectory );
    
    callback();
};

exports.providerModuleFileList = function ( callback ) {
    var data = [
        [ 1, 2 ],
        [ 3, 4 ]
    ];
    callback( data );
};

exports.testParams.testGetModule = { 'dependOn' : 'testInstantiate', 'provider' : 'providerModuleFileList' };
exports.testGetModule = function( first, second, callback ) {
    callback();
};





