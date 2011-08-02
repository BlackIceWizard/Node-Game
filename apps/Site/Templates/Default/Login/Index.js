exports.getContent = function ( data ) {
    return '<h1>Страница авторизации</h1>'+
           '<form action="login/doLogIn" method="POST">'+
               ( data.get( 'error' ) ? '<div style="color:red;">'+data.get( 'error' )+'</div>' : '' )+
               '<div><span>Ник:</span> <input type="text" name="Nick" size="50"/></div>'+
               '<div><span>Пароль:</span> <input type="text" name="Password" size="50"/></div>'+
               '<div><input type="submit" value="Войти"></div>'+
            '</form>';
}