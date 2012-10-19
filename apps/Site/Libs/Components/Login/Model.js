var internal = {};

exports.lookUpForUser = function ( nick, password, callback ) {
    var String = exports.Services.ModuleProvider.getModule( 'Helpers/String' );
    var DM = exports.Services.DocumentManager;
         
    DM.findOneBy( 'Users', { 'Nick' : String.trim( nick ), 'Password' : String.trim( password ) }, function ( User ) {
        callback( User );
    });

};