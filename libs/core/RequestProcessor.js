var privats = {};

exports.construct = function ( callback ) {
    callback( exports );
}

exports.getInstance = function ( contentType ) {
    return new privats.instance( contentType )
}

privats.instance = function ( contentType ) {
    this.contentType = contentType;
    this.requestJSON = {};


    this.parseRequestStr = function( requestStr ) {
        if( !requestStr )
            return false;

        if( this.contentType.indexOf( 'application/x-www-form-urlencoded' ) != -1 ) {
            var queryString = require('querystring');
            this.requestJSON = queryString.parse(requestStr);
            
        } else {
            //var queryString = require('querystring');

        }
    };

    this.getRequestJSON = function() {
        return this.requestJSON;
    };

    this.getVar = function ( name, defaultValue ) {
        if( typeof defaultValue == "undefined" )
            var defaultValue = null;
        
        if( typeof this.requestJSON[name] != "undefined" )
            return this.requestJSON[name];
        else
            return defaultValue;
    };

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