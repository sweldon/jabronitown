	
	// console.log(source);
	// console.log(player);
	// for(var i =0; i<source.length;i++)
	// {
	// 	if((source[i].name).indexOf(player) > -1)
	// 	{
	// 		player_results.append("<b>"+source[i].name+"</b><br /><div class='sub_result'>JR:"+source[i].rating+"</div>");
	// 	}
		
	// }

	// $("#player_results").fadeIn();

$( document ).ready(function() {

	if ((typeof results !== 'undefined') && (typeof results !== ''))
	{
    console.log(results)
	for(var i =0; i<results.length;i++)
	{

			$("#player_results").append("<b>"+results[i].name+"</b><br /><div class='sub_result'>JR:"+results[i].rating+"</div>");
		
		
	}

	$("#player_results").fadeIn();
}
});