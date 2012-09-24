exports.getContent = function ( data ) {
    //{ 'auth' : true, 'Nick' : User.getNick(), 'UserId' : User.getId() }
    var content = '<div style="float:right">';

    if( data.auth ) {
        content += 'Зравствуйте, '+data.Nick+'! '+
        '<a href="login/doLogOut" onclick="return confirm(\'Вы действительно хотитие выйти?\')">Выйти</a>';
    } else {
        content += 'Зравствуйте, Гость! Вы еще не авторизованы. '+
        '<a href="login">Авторизоваться</a>' +
        ' | '+
        '<a href="signin">Зарегистрироваться</a>';
    }
    content += '</div>'+
    '<div style="clear:both"></div>';
    return content;
};
