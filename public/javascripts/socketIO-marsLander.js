/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 * 
 *
 *  Martian Robot - socketIO
 *
 */


(function($) {

  // connect to server
  var server = io.connect('http://localhost:5000');

  server.on('connect', function(data) {
    $('#status').text('status: connected');
    nickname = 'Mars Lander';
    server.emit('join', nickname);
  });


  // automatically select content when activated
  $("textarea")
      .focus(function () { $(this).select(); } )
      .mouseup(function (e) {e.preventDefault(); });

  $('form').on('submit', function(e) {
    e.preventDefault();

    // TODO
  });

})(jQuery);
