$(document).ready(function(){
    var form = $( "form[name=signinForm]" );
    $("input[type=button]", form ).click(function(event){

        $.ajax({
            url: "jsignin/StoreUser",
            type : 'POST',
            dataType : 'json', 
            data : form.serialize(),
            success: function( data ){
                if( data.success ) {
                    window.location = 'signin/welcome'
                } else {
                    $( ".formerror" ).each( function() { $(this).html( "" ) } );
                    for( var i in data.errors ) {
                        $( "#"+i+'Error' ).html( data.errors[i] );
                    }
                }
            },
            error : function () {
                alert( 'Ошибка на стороне сервера.' );
            }
        });
        return false;
    });
});
