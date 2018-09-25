'use strict';

const supertest = require('supertest'); 
const test = require('unit.js');
const app = require('../app.js');

const request = supertest(app);

describe('Tests app', function() {
  it('verifies get', function(done) {
    request.get('/').expect(200).end(function(err, result) {
        test.string(result.body.Output).contains('Hello');
        test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
        done(err);
    });
  });
  it('verifies post', function(done) {
    var payload = {
        "app_id" : "everydayiot",
        "dev_id": "temperature1",
        "hardware_serial": "4883C7DF30051783",
        "port": 25,
        "counter": 41,
        "payload_raw": "VDoyMi41Ng==",
        "metadata":
          { 
            "time": "2018-09-24T16:29:07.886534138Z",
            "frequency": 867.1,
            "modulation": "LORA",
            "data_rate": "SF12BW125",
            "coding_rate": "4/5",
            "gateways": [{
              "latitude": 0.0,
              "longitude": 0.0
            }]
          },
        "downlink_url": "https://integrations.thethingsnetwork.org/ttn-eu/api/v2/down/everydayiot/marketplace?key=ttn-account-v2.RpbgPHgq3lH82QJGC_2g1WEnX2ossRDVmH-WgPMfA-Q" 
    }

    request.post('/ttn').set('Authorization', '5qNJ0K0M7ZmW17AJMJtMgXEdXvN98i').send(payload).expect(204).end(function(err, result) {
        //test.string(result.body.Body).contains('test');
        //test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
        done(err);
    });
  });
});
