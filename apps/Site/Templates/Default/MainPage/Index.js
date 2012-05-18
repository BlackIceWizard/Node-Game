exports.getContent = function ( data ) {
    var html = '<h1>Main page</h1>'+"\n"+
            '<p>Текст приветствия. новости и т.д.</p>';

    if( !data.get( 'auth' ) ) {
        html += '<p>Вы можете авторизироваться: <a href="login">Login</a></p>'+
                '<p>Вы можете Зарегистрироваться: <a href="signin">Signin</a></p>'+"\n";
    } else {
        html += '<p>Тестировать игру: <a href="arena">Arena</a></p>';
    }

    return html;
};