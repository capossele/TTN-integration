var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const atob = require("atob");
var axios = require("axios");

const orionUrl = "http://35.229.108.169:1026/v2/op/update"
const marketplaceUrl = "https://iot-data-marketplace.com/charging/api/assetManagement/assets/createProduct"

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
  var marketplace = {}
  marketplace.headers = {
    "Content-Type" : "application/json",
    "Authorization" : "Bearer " + req.Authorization
  }
  marketplace.payload = {
    "dataSourceID" : req.body.dev_id,
    "fiwareService" : req.body.app_id
  }

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

  var test;
 
  axios.all([
    axios({
      method: 'POST', 
      url: marketplaceUrl, 
      headers: marketplace.headers,
      data: marketplace.payload 
    }),
    axios({
      method: 'POST', 
      url: orionUrl, 
      headers: msg.headers,
      data: msg.payload 
    })
  ])
  .then(axios.spread((marketplaceRes, orionRes) => {
    // do something with both responses
    console.log(marketplaceRes);
    console.log(orionRes);
    res.status(orionRes.status).json(orionRes.data);
  }))
  .catch(function (error) {
    console.log(error);
  });

  // //Marketplace POST
  // axios({
  //   method: 'POST', 
  //   url: marketplaceUrl, 
  //   headers: marketplace.headers,
  //   data: marketplace.payload 
  // })
  // .then(function (response) {
  //   console.log(response);
  //   //Orion POST
  //   axios({
  //     method: 'POST', 
  //     url: orionUrl, 
  //     headers: msg.headers,
  //     data: msg.payload 
  //   })
  //   .then(function (response) {
  //     console.log(response);
  //     res.status(response.status).json(response.data);
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });
  
});


function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
