exports.entityDefinition = {
    Nick : {
        nullable: false,
        type: 'string',
        typeAttributes : {
            maxLength : 256,
            minLength : 3,
            pattern: null
        }
    },

    Password : {
        nullable: false,
        type: 'string',
        typeAttributes : {
            maxLength : 256,
            minLength : 3,
            pattern: null
        }
    },

    Email : {
        nullable: false,
        type: 'string',
        typeAttributes : {
            maxLength : 1024,
            minLength : null,
            pattern: /^[a-zA-Z]+(([\'\,\.\- ][a-zA-Z ])?[a-zA-Z]*)*\s+&lt;(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})&gt;$|^(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})$/i
        }
    },

    Site : {
        nullable: true,
        type: 'string',
        typeAttributes : {
            maxLength : 2048,
            minLength : null,
            pattern: new RegExp( '#^(http|https|ftp)\\://([a-zA-Z0-9\\.\\-]+(\\:[a-zA-Z0-9\\.&amp;%\\$\\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\\-]+\\.)*[a-zA-Z0-9\\-]+\\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\\:[0-9]+)*(/($|[a-zA-Z0-9\\.\\,\\?\'\\\\\\+&amp;%\\$#\\=~_\\-]+))*$#', 'i' )
        }
    },

    Addition: {
        nullable: true,
        type: 'string',
        typeAttributes : {
            maxLength : 4096,
            minLength : null,
            pattern: null
        }
    }
}