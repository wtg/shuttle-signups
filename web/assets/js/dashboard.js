// Add name to loading screen.
$.getJSON( "/api/current_user", function( data ) {
   var name = data.first_name;
   $(".loading").append('<h1>Hello there ' + name + '!</h1>')
   $(".loading").append("<h4 class = 'loading-text'>We're setting things up for you</h4>");
});

