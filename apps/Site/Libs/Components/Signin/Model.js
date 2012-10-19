var internal = {};

exports.prepareAndValidate = function ( data, errors ) {
    var String = exports.Services.ModuleProvider.getModule( 'Helpers/String' );
    var error_count = 0;

    data['Nick'] = String.trim( data['Nick'] );
    if( data['Nick'] == "" ) {
        errors['Nick'] =  "Нужно обязательно указать свой ник";
        error_count++;
    } else if( data['Nick'].length < 3 ) {
        errors['Nick'] =  "Ник не должен быть короче 3-х символов";
        error_count++;
    } else if( data['Nick'].length > 256 ) {
        errors['Nick'] =  "Ник не должен быть длиннее 256-х символов";
        error_count++;
    }

    if( data['Password'] == "" ) {
        errors['Password'] =  "Нужно обязательно указать пароль";
        error_count++;
    } else if( data['Password'].length < 3 ) {
        errors['Password'] =  "Пароль не должен быть короче 3-х символов";
        error_count++;
    } else if( data['Password'].length > 256 ) {
        errors['Password'] =  "Пароль не должен быть длиннее 256-х символов";
        error_count++;
    }

    if( data['Password'] != data['Repassword']  ) {
        errors['Repassword'] =  "Повторно введеный пароль не совпал с предыдущим";
        error_count++;
    }


    EmailPattern = /^[a-zA-Z]+(([\'\,\.\- ][a-zA-Z ])?[a-zA-Z]*)*\s+&lt;(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})&gt;$|^(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})$/i;
    data['Email'] = String.trim( data['Email'] );
    if( data['Email'] == "" ) {
        errors['Email'] =  "Нужно обязательно указать Email";
        error_count++;
    } else if( data['Email'].length > 1024 ) {
        errors['Email'] =  "Email не должен быть длиннее 1024-х символов";
        error_count++;
    } else if( !EmailPattern.test( data['Email'] ) ) {
        errors['Email'] =  "Email написан неправильно";
        error_count++;
    }

    SitePattern = new RegExp( '#^(http|https|ftp)\\://([a-zA-Z0-9\\.\\-]+(\\:[a-zA-Z0-9\\.&amp;%\\$\\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\\-]+\\.)*[a-zA-Z0-9\\-]+\\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\\:[0-9]+)*(/($|[a-zA-Z0-9\\.\\,\\?\'\\\\\\+&amp;%\\$#\\=~_\\-]+))*$#', 'i' );
    data['Site'] = String.trim( data['Site'] );
    if( data['Site'] ) {
        if( data['Site'].length > 2048 ) {
            errors['Site'] =  "Путь к сайту не должен быть длиннее 2048-х символов";
            error_count++;
        } else if( !SitePattern.test( data['Site'] ) ) {
            errors['Site'] =  "Путь к сайту написан неправильно";
            error_count++;
        }
    }

    data['Addition'] = String.trim( data['Addition'] );
    if( data['Addition'].length > 4096 ) {
        errors['Addition'] =  "Путь к сайту не должен быть длиннее 4096-х символов";
        error_count++;
    }

    return error_count; 
};