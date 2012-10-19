function ChatConstuctor( ) {
    this.gamersList = [];

    this.init = function (){
        $('#chatSendButton').click( function () {
            var text = $('#chatInputField').val();
            $('#chatInputField').val( '' );
            Connection.initiateDialog( Connection.DialogAreas.Chat, 'SendMessage', { 'text' : text } );
        })
    };

    this.appendMessage = function ( message ) {
        var regexp  = new RegExp( "^\\[(.+)\\]:(.+)$" );

        if (regexp.test(message.text)) {
            var to_nick = RegExp["$1"]
            var message_text = RegExp["$2"];
            $('#chatMessagesContainer').append(
                '<li>' +
                    '<a href="#" onclick="Chat.writeTo($(this).text()); return false;"><b>'+message.from_nick+'</b></a>' +
                    ' → ' +
                    '<a href="#" onclick="Chat.writeTo($(this).text()); return false;"><b>'+to_nick+'</b></a>' +
                    ': ' +
                    message_text+
                '</li>' )
        } else {
            $('#chatMessagesContainer').append('<li><a href="#" onclick="Chat.writeTo($(this).text())"><b>'+message.from_nick+':</b></a> '+message.text+'</li>')
        }
    };

    this.addChatUsers = function( UserNicks ) {
        this.gamersList = UserNicks;
        this.drawParticipantsList();
    };

    this.drawParticipantsList = function () {
        var userListHTML = '<ul>';

        for( var u=0; u < this.gamersList.length; u++ ) {
            userListHTML += '<li><a href="#" onClick="Chat.writeTo($(this).text()); return false;">'+this.gamersList[u]+'</a></li>';
        }
        userListHTML += '</ul>'
        $( '#chatUserListContainer' ).html( userListHTML );
    };

    this.removeUserFromParticipants = function( UserNick ) {
        var indexForRemove = this.gamersList.indexOf( UserNick );
        this.gamersList.splice ( indexForRemove, 1 );
        this.drawParticipantsList();
    };

    this.appendUserToParticipants = function( UserNick ) {
        this.gamersList.push( UserNick );
        this.drawParticipantsList()
    };

    this.writeTo = function( nick ) {
        var current_val = $('#chatInputField').val();
        $('#chatInputField').val( '['+nick+']: '+current_val );
        return false;
    };
}

Chat = new ChatConstuctor();