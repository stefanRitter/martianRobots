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

  // helpers
  function printOutput(message, error) {
    var div = '';
    error = error || false;

    if (error) {
      div = '<div class="error">ERROR: ' + message + '</div>';
    } else {
      div = '<div>' + message + '</div>';
    }

    $('.outputHistory').append(div);
  }

  function updateStatus(status) {
    $('#status').text("status: " + status);
  }


  // connect to server
  var server = io.connect(); // auto connect

  server.on('connect', function(data) {
    nickname = 'Mars Lander';
    server.emit('join', nickname);
  });

  server.on('welcome', function(data) {
    updateStatus('connected');
    printOutput(data.message);
  });


  // automatically select content when activated
  $("textarea")
      .focus(function () { $(this).select(); } )
      .mouseup(function (e) {e.preventDefault(); });


  // send commands to server
  $('form').on('submit', function(e) {
    e.preventDefault();

    var input = $("textarea").val();
    $("textarea").val('');

    server.emit('commands', input);
  });


  // receive Mars lander status updates
  server.on('output', function (data) {
    printOutput(data.message);
  });

  server.on('error', function (data) {
    printOutput(data.message, true);
  });

})(jQuery);
