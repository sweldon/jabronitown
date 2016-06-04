$('#buttonID').click(function() {
  $.ajax({
      dataType: 'json',
      data: $('#player_searchbox').serialize(),
      type: 'POST',
      url: "./search",
      success: handleButtonResponse,
  });
  });//]]>

  function handleButtonResponse(data)
    {
        // parse the json string
        var jsonObject = JSON.parse(data);
        $('#player_results').append( jsonObject.message );
    }