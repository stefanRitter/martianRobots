/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 * 
 *
 *  Martian Robot - socketIO
 *
 */


(function() {

  var server = io.connect('http://localhost:5000');

  server.on('connect', function(data) {
    nickname = 'Mars Lander';
    server.emit('join', nickname);
  });

}).call(this);
