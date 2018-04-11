'use strict';

const utilities = require('./utilities');
const https = require('https');
const admin = require('firebase-admin');
const moment = require('moment')

const actionMap = new Map();
admin.initializeApp({databaseURL: "https://palacehotel-5e988.firebaseio.com"});

actionMap.set('input.welcome', welcomeIntent);
actionMap.set('default', defaultIntent);
actionMap.set('orderFoodIntent', orderFoodIntent);

function welcomeIntent(app) {
  let speechText, repromptText, displayText;
  var room = utilities.roomNumber;

  return ref.orderByChild("room").equalTo(roomNumber).once('value', function(snapshot) {
    if(snapshot.val() === null) {
      speechText = repromptText = '<p><s> Good ' + utilities.getGreetingTime(moment()) + ', ' 
        + utilities.customers[room] + utilities.selfIntro + utilities.HelpMessage + '</s></p>';
      displayText = speechText;
    } else {
      speechText = repromptText = '<p><s>' + utilities.welcomeMessageReturn + utilities.HelpMessage + '</s></p>';
      displayText = speechText;
    }  
    utilities.askResponse(app, utilities.buildResponseToUser(repromptText, speechText, displayText));
  }
}

function defaultIntent(app) {
  let speechText, repromptText, displayText;
  speechText = repromptText = '<p><s>Would you like to hear about all Restaurants nearby?</s></p>';
  displayText = 'Would you like to hear about all Restaurants nearby?';
  let index = Math.floor(Math.random() * (HOTEL_LIST.hotels.length - 1)) + 1;
  app.setContext('non_aha_restuarant_context', 1, {
    index: index
  });
  utilities.askResponse(app, utilities.buildResponseToUser(repromptText, speechText, displayText));
}

function orderFoodIntent(app) {

  var foodType = app.getArgument('foodItems') || '';  
  var roomNumber = utilities.roomNumber; //Math.round(Math.random() * (utilities.maxRoomNumber - utilities.minRoomNumber) + utilities.minRoomNumber);
  var msg = roomNumber + ' - Request for ' + foodType;

  var req = {
    "room": roomNumber,
    "requestType": foodType,
    "msg": msg,
    "date": moment().format('YYYY-MM-DD')
  };

  var ref = admin.database().ref('/requests');
  
  return ref.orderByChild("room").equalTo(roomNumber).once('value', function(snapshot) {

    let speechText, repromptText, displayText;    
    var furtherMsgIndex = Math.floor(Math.random() * utilities.furtherHelpPhrases.length);

    if(snapshot.val() === null) {        
      
      var msgIndex = Math.floor(Math.random() * utilities.foodOrderConfirmationMessage.length);
      speechText = '<p><s>' + utilities.foodOrderConfirmationMessage[msgIndex] 
        + utilities.furtherHelpPhrases[furtherMsgIndex] + '</s></p>';
      
      furtherMsgIndex = Math.floor(Math.random() * utilities.furtherHelpPhrases.length);
      repromptText = utilities.furtherHelpPhrases[furtherMsgIndex];
      
      displayText = utilities.firstOrderMessage;

    } else {
      
      var msgIndex = Math.floor(Math.random() * utilities.repeatFoodOrderConfirmationMessage.length);
      speechText = '<p><s>' + utilities.repeatFoodOrderConfirmationMessage[msgIndex] 
        + utilities.furtherHelpPhrases[furtherMsgIndex] + '</s></p>';
      
      furtherMsgIndex = Math.floor(Math.random() * utilities.furtherHelpPhrases.length);  
      repromptText = utilities.furtherHelpPhrases[furtherMsgIndex];

      displayText = utilities.repeatOrderMessage;
    }

    return ref.push(req).then(() => {      
      utilities.askResponse(app, utilities.buildResponseToUser(repromptText, speechText, displayText));
    });
  });

}

module.exports = actionMap;
