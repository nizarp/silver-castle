'use strict';

exports.welcomeMessage = "Welcome to Silver Castle. "; 
exports.selfIntro = "This is your customer relations manager. ";
exports.welcomeMessageReturn = "Welcome back to Palace Hotel. ";
exports.HelpMessage = "How can I help you today? ";
exports.emergencyDoctorMessage = "Definitely, I will send a doctor at once. Do you need anything else?";
exports.emergencyDoctorRePromptMessage = "Can I help you with anything else?";
exports.emergencyAmbulanceMessage = "Definitely, I will request an ambulance right away. Do you need anything else?";
exports.emergencyAmbulanceRePromptMessage = "Can I help you with anything else?";
exports.foodOrderConfirmationMessage = [
  "Sure. I will send it right way. ",
  "Alright. You will get it in ten minutes. "
];
exports.repeatFoodOrderConfirmationMessage = [
  "Sure. ",
  "Alright. ",
  "Okay. ",
  "Of course. "
];

exports.furtherHelpPhrases = [
  'What else can I help you with today? ',
  'Is there anything else you want me to help you with? ',
  'Anything else you need? '
];

exports.minRoomNumber = 100;
exports.maxRoomNumber = 900;
exports.roomNumber = 303;
exports.customers = [
  303: "Mr. James ",
  304: "Mrs. Susan "
];

exports.dbUrl = 'https://us-central1-westin-5b28e.cloudfunctions.net/addRequest';

exports.askResponse = function (app, responseToUser) {
  let googleResponse = app.buildRichResponse()
  .addSimpleResponse({
    speech: '<speak>' + responseToUser.speechText + '</speak>',
    displayText: responseToUser.displayText
  });
  app.ask(googleResponse, [responseToUser.repromptText]);
}

exports.tellResponse = function (app, responseToUser) {
  let googleResponse = app.buildRichResponse()
  .addSimpleResponse({
    speech: '<speak>' + responseToUser.speechText + '</speak>',
    displayText: responseToUser.displayText
  });
  app.tell(googleResponse);
};

exports.buildResponseToUser  = function (repromptText, speechText, displayText) {
  return {
    speechText: speechText || undefined,
    repromptText: repromptText || undefined,
    displayText: displayText || undefined
  }
};

exports.getGreetingTime = function(m) {
  var g = null; //return g
  
  if(!m || !m.isValid()) { return; } //if we can't find a valid or filled moment, we return.
  
  var split_afternoon = 12 //24hr time to split the afternoon
  var split_evening = 17 //24hr time to split the evening
  var currentHour = parseFloat(m.format("HH"));
  
  if(currentHour >= split_afternoon && currentHour <= split_evening) {
    g = "afternoon";
  } else if(currentHour >= split_evening) {
    g = "evening";
  } else {
    g = "morning";
  }
  
  return g;
}
