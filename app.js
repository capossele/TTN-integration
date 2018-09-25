var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const atob = require("atob");
var fetch = require("node-fetch");

const orionUrl = "http://35.229.108.169:1026/v2/op/update"

app.use(bodyParser.json())

app.get('/', function(req, res) {
  res.send({
    "Output": "Hello World!"
  });
});

app.post('/ttn', function(req, res) {
  // console.log({
  //   "Body": req.body,
  //   "Headers": req.headers
  // })
  
  var msg = {}
  msg.headers = {}
  msg.headers['Content-Type'] = 'application/json';
  msg.headers['Fiware-Service'] = req.body.app_id;
  var entities = []
  entities[0] = {
      "type" : "ttn-device",
      "id" : req.body.dev_id,
      "location" : {
          "value": {
            "coordinates": [
                  parseFloat(req.body.metadata.gateways[0].longitude), 
                  parseFloat(req.body.metadata.gateways[0].latitude)
                  ],
            "type": "Point"
          },
          "type" : "geo:json",
          "metadata" : {}
      }
  };
  entities[0].dateObserved = {
      "type": "DateTime",
      "value": new Date(req.body.metadata.time),
      "metadata": {}
  };
      
  var temperature_raw = b64DecodeUnicode(req.body.payload_raw);
  var temperature = temperature_raw.split(":") 
  
  entities[0].temperature = {
      "type":"Number",
      "value": parseFloat(temperature[temperature.length-1]),
      "metadata":{
          "unitCode":{
              "value":"C",
              "type":"Text"
          }
      }
  };
             
  var jsonMsg = {
      "actionType": "APPEND",
      "entities": entities
  }


  msg.payload = jsonMsg;

  console.log(msg);

  const orionParam = {
    headers: msg.headers,
    body: msg.payload,
    method: "POST"
  };
  var test;
  fetch(orionUrl, orionParam)
  .then(function(response) {
    test = response.status;
    console.log(response.status);
  })
  // .then(data=>{
  //   test = data.json();
  //   return test;
  // })
  // .then(r=>{
  //   console.log(r);
  // })
  .then(res.status(201).send(test))
  .catch(error=>console.log(error))

  //res.status(201).json(msg);
});


function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
