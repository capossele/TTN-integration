var express = require('express');
var app = express();
const path = require('path');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const router = express.Router();

app.use(awsServerlessExpressMiddleware.eventContext())

router.get('/', function(req, res) {
  res.send({
    "Output": "Hello World!"
  });
});

router.post('/testPost', function(req, res) {
  res.status(201).json(req.apiGateway.event);
  //   {
  //   "Body": req.body,
  //   "Headers": req.headers
  // });
});

app.use('/', router)
// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
