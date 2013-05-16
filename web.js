// a static node server using express

var express = require("express");
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.logger());
app.use(express.static(__dirname + '/public'));

app.get('/*?', function(req, res) {
  // whatever is requested which is not in /public respond with index.html
  res.render('index');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

