$( document ).ready(function(){

// Search box is the value you're going to send to the function. Change this to include all fields
$("#player_searchbox").keyup(function(event){
    if(event.keyCode == 13){
        $("#search_button").click();
    }
    if ( event.keyCode === 27 ) { // ESC
        $( "#close" ).click();
    }
})


});