'use strict';

const utilities = require('./utilities');
const https = require('https');
const admin = require('firebase-admin');
const moment = require('moment-timezone')

const actionMap = new Map();
admin.initializeApp({databaseURL: "https://palacehotel-5e988.firebaseio.com"});

actionMap.set('input.welcome', welcomeIntent);
actionMap.set('input.unknown', defaultIntent);
actionMap.set('orderFoodIntent', orderFoodIntent);
actionMap.set('medicalEmergencyIntent', medicalEmergencyIntent);

function welcomeIntent(app) {
  let speechText, repromptText, displayText;
  var room = utilities.roomNumber;

  var ref = admin.database().ref('/requests');
  return ref.orderByChild("room").equalTo(room).once('value', function(snapshot) {
    if(snapshot.val() === null) {
      speechText = repromptText = '<p><s> Good ' + utilities.getGreetingTime(moment().tz('Asia/Kolkata')) + ' ' 
        + utilities.customers[room] + '.' + utilities.selfIntro + utilities.HelpMessage + '</s></p>';
      displayText = speechText;
    } else {
      speechText = repromptText = '<p><s>' + utilities.welcomeMessageReturn + utilities.HelpMessage + '</s></p>';
      displayText = speechText;
    }  
    utilities.askResponse(app, utilities.buildResponseToUser(repromptText, speechText, displayText));
  });
}

function defaultIntent(app) {
  let speechText, repromptText, displayText;
  speechText = displayText = '<p><s>' + utilities.emergencyNoEntityMessage + '</s></p>';
  repromptText = utilities.helpDescription;
  utilities.askResponse(app, utilities.buildResponseToUser(repromptText, speechText, displayText));
}

function orderFoodIntent(app) {
  var foodType = app.getArgument('foodItems') || '';  
  validateFoodType(app, foodType);
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

    if(snapshot.val() === null) {
      
      var msgIndex = Math.floor(Math.random() * utilities.foodOrderConfirmationMessage.length);
      speechText = '<p><s>' + utilities.getRandomMessage(utilities.foodOrderConfirmationMessage)
        + utilities.getRandomMessage(utilities.furtherHelpPhrases) + '</s></p>';
      
      repromptText = utilities.getRandomMessage(utilities.furtherHelpPhrases);      
      displayText = utilities.firstOrderMessage;

    } else {
      
      speechText = '<p><s>' + utilities.getRandomMessage(utilities.foodOrderConfirmationMessage)
        + utilities.getRandomMessage(utilities.furtherHelpPhrases) + '</s></p>';
      
      repromptText = utilities.getRandomMessage(utilities.furtherHelpPhrases);
      displayText = utilities.repeatOrderMessage;
    }

    return ref.push(req).then(() => {      
      utilities.askResponse(app, utilities.buildResponseToUser(repromptText, speechText, displayText));
    });
  });
}

/*Get prompt message for a type*/
function getPromptMessageFor(type) {
  var message = utilities.getRandomMessage(utilities.emergencyNoEntityMessage);
  if (type == "doctor") {
      message = utilities.emergencyDoctorMessage;
  } else if (type == "ambulance") {
      message = utilities.emergencyAmbulanceMessage;
  }
  return message
}

/*Get reprompt message for a type*/
function getRePromptMessageFor(type) {
  var message = utilities.getRandomMessage(utilities.emergencyNoEntityMessage);
  if (type == "doctor") {
      message = utilities.emergencyDoctorRePromptMessage;
  } else if (type == "ambulance"){
      message = utilities.emergencyAmbulanceRePromptMessage;
  }
  return message;
}

/*Medical emergency Intent*/
function medicalEmergencyIntent(app) {
  var emergencyType = app.getArgument('emergency') || '';  
  var roomNumber = utilities.roomNumber; //Math.round(Math.random() * (utilities.maxRoomNumber - utilities.minRoomNumber) + utilities.minRoomNumber);
  var msg = roomNumber + ' - Request for ' + emergencyType;

  var req = {
    "room": roomNumber,
    "requestType": emergencyType,
    "msg": msg,
    "date": moment().format('YYYY-MM-DD')
  };

  let speechText = '<p><s>' + getPromptMessageFor(emergencyType) + '</s></p>';
  let repromptText = getRePromptMessageFor(emergencyType);
  let displayText = speechText;

  if(emergencyType == "") {
    utilities.askResponse(app, utilities.buildResponseToUser(repromptText, speechText, displayText));
  } else {
    var ref = admin.database().ref('/requests');
    return ref.push(req).then(() => {      
      utilities.askResponse(app, utilities.buildResponseToUser(repromptText, speechText, displayText));
    });
  }
}

function validateFoodType(app, foodType) {
  
  let speechText, repromptText, displayText;
  var valid = true;

  if(foodType == 'breakfast' && utilities.getGreetingTime(moment().tz('Asia/Kolkata')) == 'afternoon') {
    speechText = displayText = utilities.lateBreakfastLunchMessage 
      + utilities.getRandomMessage(utilities.furtherHelpPhrases);
    repromptText = utilities.getRandomMessage(utilities.furtherHelpPhrases);
    valid = false;
  }

  if(foodType == 'lunch' && utilities.getGreetingTime(moment().tz('Asia/Kolkata')) == 'evening') {
    speechText = displayText = utilities.lateLunchDinnerMessage 
      + utilities.getRandomMessage(utilities.furtherHelpPhrases);
    repromptText = utilities.getRandomMessage(utilities.furtherHelpPhrases);
    valid = false;
  }

  if(foodType == 'dinner' && utilities.getGreetingTime(moment().tz('Asia/Kolkata')) == 'morning') {
    speechText = displayText = utilities.lateDinnerBreakfastMessage 
      + utilities.getRandomMessage(utilities.furtherHelpPhrases);
    repromptText = utilities.getRandomMessage(utilities.furtherHelpPhrases);
    valid = false;
  }
  if(!valid) {
    utilities.askResponse(app, utilities.buildResponseToUser(repromptText, speechText, displayText));
  } 

  return;
}

module.exports = actionMap;
