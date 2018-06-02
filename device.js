'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');
const request = require('retry-request');

//CONFIGURATION
var projectId = "MYPROJECTID";
var cloudRegion = "MYCLOUDREGION";
var registryId = "MYREGISTRYID";
var deviceId = "MYDEVICEID";
var privateKeyPath = "private_key.pem";
var pathSuffix = ":publishEvent";
var algorithm = "RS256";
var tokenExpMins = 20;
//END CONFIGURATION

let iatTime = parseInt(Date.now() / 1000);
let authToken = createJwt(projectId, privateKeyPath, algorithm);
const devicePath = `projects/${projectId}/locations/${cloudRegion}/registries/${registryId}/devices/${deviceId}`;
const urlBase = `https://cloudiotdevice.googleapis.com/v1/${devicePath}`;
const url = `${urlBase}${pathSuffix}`;

function createJwt (projectId, privateKeyPath, algorithm) {
    const token = {
      'iat': parseInt(Date.now() / 1000),
      'exp': parseInt(Date.now() / 1000) + 20 * 60,
      'aud': projectId
    };
    const privateKey = fs.readFileSync(privateKeyPath);
    return jwt.sign(token, privateKey, { algorithm: algorithm });    
}

var deviceNames = ['SBS01', 'SBS02', 'SBS03', 'SBS04', 'SBS05']

function generateRandomPayload (){
  var rnd = Math.random();
  if (rnd < 0.20){
    return getFlowValue();
  }
  if (rnd>=0.20 && rnd<0.55){
    return getTemperatureValues();
  }
  if (rnd>=0.55 && rnd<0.70){
    return getHumidityValues();
  }
  if (rnd>=0.7 && rnd<=1){
    return getSoundValues();
  }
}

function getFlowValue(){
  var data = {}
  data['deviceValue'] = Math.random()*100+60;
  data['deviceParameter'] = 'Flow';
  data['deviceId'] = deviceNames[Math.floor(Math.random() * deviceNames.length)];
  var date = new Date();
  data['dateTime'] = date.toISOString();
  return data;
}

function getTemperatureValues(){
  var data = {}
  data['deviceValue'] = Math.random()*20+30;
  data['deviceParameter'] = 'Temperature';
  data['deviceId'] = deviceNames[Math.floor(Math.random() * deviceNames.length)];
  var date = new Date();
  data['dateTime'] = date.toISOString();
  return data;
}

function getHumidityValues(){
  var data = {}
  data['deviceValue'] = Math.random()*70+50;
  data['deviceParameter'] = 'Humidity';
  data['deviceId'] = deviceNames[Math.floor(Math.random() * deviceNames.length)];
  var date = new Date();
  data['dateTime'] = date.toISOString();
  return data;
}

function getSoundValues(){
  var data = {}
  data['deviceValue'] = Math.random()*120+60;
  data['deviceParameter'] = 'Sound';
  data['deviceId'] = deviceNames[Math.floor(Math.random() * deviceNames.length)];
  var date = new Date();
  data['dateTime'] = date.toISOString();
  return data;
}

function publishAsync (authToken) {
    const payload = JSON.stringify(generateRandomPayload());
    console.log('Publishing message:', payload);
    const binaryData = Buffer.from(payload).toString('base64');
    const postData = {
      binary_data: binaryData
      };

    const options = {
      url: url,
      headers: {
        'authorization': `Bearer ${authToken}`,
        'content-type': 'application/json',
        'cache-control': 'no-cache'
      },
      body: postData,
      json: true,
      method: 'POST',
      retries: 5,
      shouldRetryFn:
        function (incomingHttpMessage) {
          return incomingHttpMessage.statusMessage !== 'OK';
        }
    };

    const delayMs = 1000;
    console.log(JSON.stringify(request));
    request(options, function (error, response, body) {
      if (error) {
        console.error('Received error: ', error);
      } else if (response.body.error) {
        console.error('Received error: ' + JSON.stringify(response.body.error));
      } else {
        console.log('Message sent.');
      }
      setTimeout(function () {
        let secsFromIssue = parseInt(Date.now() / 1000) - iatTime;
        if (secsFromIssue > tokenExpMins * 60) {
        iatTime = parseInt(Date.now() / 1000);
        console.log(`\tRefreshing token after ${secsFromIssue} seconds.`);
        authToken = createJwt(projectId, privateKeyFile, algorithm);
      }
      publishAsync(authToken);
    }, delayMs);
    });
  }

  publishAsync(authToken);
