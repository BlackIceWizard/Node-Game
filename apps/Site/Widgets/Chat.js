exports.getContent = function ( data ) {
    if( data.auth ) {
        return '<div id="my_socket"></div>'+"\n"+

                '<br/>Messeges:'+"\n"+
                '<div id="chatMessagesContainer"></div>'+"\n"+
                '<br/>Gamers:'+"\n"+
                '<div id="chatUserListContainer"></div>'+"\n"+
                '<br/><input type="text" id="chatInputField" size="50">'+"\n"+
                '<br/><input type="button" id="chatSendButton" value="Послать">'+"\n";
    } else {
        return '';
    }
};
