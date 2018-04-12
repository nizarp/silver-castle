'use strict';

exports.welcomeMessage = "Welcome to Silver Castle. "; 
exports.welcomeMessageReturn = "Welcome back to Silver Castle. ";
exports.HelpMessage = "How can I help you today? ";
exports.emergencyDoctorMessage = "Definitely, I will send a doctor at once. Do you need anything else? ";
exports.emergencyDoctorRePromptMessage = "Can I help you with anything else? ";
exports.emergencyAmbulanceMessage = "Don't worry, I will request an ambulance right away. Do you need anything else? ";
exports.emergencyAmbulanceRePromptMessage = "Can I help you with anything else? ";
exports.lateBreakfastLunchMessage = 'Oh dear. It\'s too late for breakfast. But, don\'t worry. I will get you the lunch now. ';
exports.lateLunchDinnerMessage = 'Oh dear. It\'s too late for lunch. But, don\'t worry. I will get you the dinner now. ';
exports.lateDinnerBreakfastMessage = 'Oh dear. It\'s too late for dinner. But, don\'t worry. I will get you the breakfast now. ';
exports.helpDescription = 'I can help you order services like food and beverages, daily necessities, room services and get you help during any emergency situation. I can even answer your general queries. ';
exports.cancelMessage = 'I will be right here if you need anything. ';

exports.foodOrderConfirmationMessage = [
  "Why not. I will send it right way. ",
  "Alright. You will get it in ten minutes. ",
  "Sure. I will send it. ",
  "Okay. Sending it now. "
];

exports.emergencyNoEntityMessage = [
  "Sorry. I didn't catch that. Could you please repeat?"
];

exports.furtherHelpPhrases = [
  'What else can I help you with? ',
  'Is there anything else you want me to help you with? ',
  'Anything else you need? '
];

exports.minRoomNumber = 100;
exports.maxRoomNumber = 900;
exports.roomNumber = "s303";
exports.customers = {
  s303: "Mr. James ",
  s304: "Mrs. Susan "
};

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
};

/*Get a random message from the given list*/
exports.getRandomMessage = function(messages) {
  var index = Math.floor(Math.random() * messages.length);
  return messages[index]
};
