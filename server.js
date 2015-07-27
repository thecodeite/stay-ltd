var express = require('express');

var app = express();

app.use(function(req, res){
  console.log(req.method, req.url);
});

app.get('/', function(req, res){
  
});

app.use(express.static('client'));

app.get(function(req, res){
  res.send("Not found");
});

var port = process.env.PORT || 8901;

var server = app.listen(port, function () {

  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);

});