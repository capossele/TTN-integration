var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send({
    "Output": "Hello World!"
  });
});

app.post('/', function(req, res) {
  res.send({
    "Total": req
    //"Body": req.body,
    //"Headers": req.headers
  });
});


// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
