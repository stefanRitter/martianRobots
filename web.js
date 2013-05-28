// a simple node server using express

require('coffee-script');

var express = require("express"),
    app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.logger());
app.use(express.static(__dirname + '/public'));


app.get('/test', function(req, res) {
  // serve jasmine test page
  res.render('test');
});

app.get('/socketio', function(req, res) {
  // serve socketIO version
  res.render('socketio');
});

app.get('/*?', function(req, res) {
  // whatever else is requested respond with index.html
  res.render('index');
});


var port = process.env.PORT || 5000;
var server = app.listen(port, function() {
  console.log("Listening on " + port);
});

// set up the socketIO version of the app
require('./socketIO/socket-io')(app, server);
