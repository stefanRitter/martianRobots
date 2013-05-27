// a simple node server using express

var express = require("express");
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.logger());
app.use(express.static(__dirname + '/public'));

app.get('/test', function(req, res) {
  // serve jasmine test page
  res.render('test');
});

app.get('/*?', function(req, res) {
  // whatever else is requested respond with index.html
  res.render('index');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
