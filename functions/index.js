'use strict';

const functions = require('firebase-functions');
const DialogflowApp = require('actions-on-google').DialogflowApp;
const actionMap = require('./intentHandlers.js');

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const app = new DialogflowApp({request: request, response: response});  
  console.log('Request body: ' + JSON.stringify(request.body));
  app.handleRequest(actionMap);
});