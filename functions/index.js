'use strict';

const {dialogflow} = require('actions-on-google');
const functions = require('firebase-functions');

const app = dialogflow({debug: true});

app.intent('get_location', (conv, {location}) => {
  conv.close(`Alright, your location is ${location}! ` +
    `I hope you like it. See you next time.`);
});

exports.airqualityAction = functions.https.onRequest(app);