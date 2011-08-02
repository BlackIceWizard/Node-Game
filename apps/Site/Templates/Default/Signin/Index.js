exports.getContent = function ( data ) {
    return '<h1>Страница регистрации</h1>'+
           '<form action="/signin/storeUser" method="POST" name="signinForm">'+
               '<div><span>Ник:</span> <input type="text" name="Nick" size="50"/></div>'+
               '<div class="formerror" id="NickError"></div>'+
               '<div><span>Пароль:</span> <input type="text" name="Password" size="50"/></div>'+
               '<div class="formerror" id="PasswordError"></div>'+
               '<div><span>Повтор пароля:</span> <input type="text" name="Repassword" size="50"/></div>'+
               '<div class="formerror" id="RepasswordError"></div>'+
               '<div><span>Email</span> <input type="text" name="Email" size="50"/></div>'+
               '<div class="formerror" id="EmailError"></div>'+
               '<div><span>WEB Сайт</span> <input type="text" name="Site" size="50"/></div>'+
               '<div class="formerror" id="SiteError"></div>'+
               '<div><span>Полное Имя</span> <input type="text" name="Name" size="50"/></div>'+
               '<div class="formerror" id="NameError"></div>'+
               '<div><span>Дополнительно о себе</span> <textarea cols="50" rows="6" name="Addition"></textarea></div>'+
               '<div class="formerror" id="AdditionError"></div>'+
               '<div><input type="button" value="Сохранить"/></div>'+
           '</form>';
}