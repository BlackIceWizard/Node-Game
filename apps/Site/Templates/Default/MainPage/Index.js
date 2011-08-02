exports.getContent = function ( data ) {
    return '<h1>Main page</h1>'+"\n"+
           '<p>Текст приветствия. новости и т.д.</p>'+
           '<p>Вы можете авторизироваться: <a href="login">Login</a></p>'+
           '<p>Вы можете Зарегистрироваться: <a href="signin">Signin</a></p>'+"\n"+
           '<script src="assets/js/jquery.js" type="text/javascript"></script>'+"\n"+

            //'<script src="../common/js/common.js" type="text/javascript"></script>'+

            '<script src="assets/js/swfobject.js" type="text/javascript"></script>'+"\n"+

            '<script src="assets/jsocket/src/jsocket.js" type="text/javascript"></script>'+"\n"+
            '<script src="assets/jsocket/src/jsocket.advanced.js" type="text/javascript"></script>'+"\n"+
            '<script src="assets/js/jsocket.init.js" type="text/javascript"></script>'+"\n"+
            '<script src="assets/js/chat.js" type="text/javascript"></script>'+"\n"+

            '<div id="my_socket"></div>'+"\n"+

            '<br/>Messeges:'+"\n"+
            '<div id="chatMessagesContainer"></div>'+"\n"+
            '<br/>Gamers:'+"\n"+
            '<div id="chatUserListContainer"></div>'+"\n"+
            '<br/><input type="text" id="chatInputField" size="50">'+"\n"+
            '<br/><input type="button" id="chatSendButton" value="Послать">'+"\n"
            ;

};