function ChatConstuctor( ) {
    this.participantsList = [];

    this.init = function (){
        $('#chatSendButton').click( function () {
            var text = $('#chatInputField').val();
            $('#chatInputField').val( '' );
            initiateDialog( 'SendMessage', { 'text' : text } );
        })
    };

    this.appendMessage = function ( message ) {
        $('#chatMessagesContainer').append('<li><b>'+message.from_nick+':</b> '+message.text+'</li>')
    };

    this.addChatUsers = function( UserNicks ) {
        this.participantsList = UserNicks;
        this.drawParticipantsList();
    };
    
    this.drawParticipantsList = function () {
        var userListHTML = '<ul>';

        for( var u=0; u < this.participantsList.length; u++ ) {
            userListHTML += '<li><a href="#" onClick="Chat.writeTo($(this).text())">'+this.participantsList[u]+'</a></li>';
        }
        userListHTML += '</ul>'
        $( '#chatUserListContainer' ).html( userListHTML );
    };

    this.removeUserFromParticipants = function( UserNick ) {
        var indexForRemove = this.participantsList.indexOf( UserNick );
        this.participantsList.splice ( indexForRemove, 1 );
        this.drawParticipantsList();
    };

    this.appendUserToParticipants = function( UserNick ) {
        this.participantsList.push( UserNick );
        this.drawParticipantsList()
    }
}

Chat = new ChatConstuctor();