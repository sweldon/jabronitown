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


$( "#addbutton" ).click(function() {

	// $("#card").flip({axis: 'x', front: '#added_results', back: '#player_results'});

  // $("#summary_wrapper").fadeOut();
  // $("#added_results").slideDown();
  


$("#summary_wrapper").fadeOut(function() {
    $("#add_form").submit();
});


});

$( ".votebox" ).click(function() {

 $("#upvote_form").submit();


});


});

