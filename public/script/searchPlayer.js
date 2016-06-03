function searchPlayer(source)
{
	
	console.log(source);

	for(var i =0; i<source.length;i++)
	{
		$("#player_results").append("<b>"+source[i].name+"</b><br /><div class='sub_result'>JR:"+source[i].rating+"</div>");
	}

	$("#player_results").fadeIn();

}