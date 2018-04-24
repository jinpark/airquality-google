'use strict';

const {dialogflow} = require('actions-on-google');
const functions = require('firebase-functions');
const rp = require('request-promise-native');
const airvisualKey = functions.config().airvisual.key;
const mapquestKey = functions.config().mapquest.key;

const app = dialogflow({debug: true});


app.intent('get_location', (conv, {location}) => {
  console.log('location', location);
  return rp(`http://www.mapquestapi.com/geocoding/v1/address?key=${mapquestKey}&location=${location.city}`)
  .then((body) => {
    var resp = JSON.parse(body);
    console.log('geocode', resp);
    var lat = resp.results[0].locations[0].latLng.lat;
    var lon = resp.results[0].locations[0].latLng.lng;
    return rp(`https://api.airvisual.com/v2/nearest_city?key=${airvisualKey}&lat=${lat}&lon=${lon}`)
      .then((body)  => {
        var resp = JSON.parse(body);
        console.log('airvisual', lat, lon, resp);
        conv.close(`air quality in ${resp.data.city} is ${resp.data.current.pollution.aqius}`)
        return;
      });
  })



});

exports.airqualityAction = functions.https.onRequest(app);
