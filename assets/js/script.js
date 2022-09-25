$( function() {
    var availableTags = [
      "Toronto",
      "Hong Kong",
    ];
    $( "#search" ).autocomplete({
      source: availableTags
    });
  } );


  DateTime.now()