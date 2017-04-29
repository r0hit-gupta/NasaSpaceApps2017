var express = require('express');
var router = express.Router();
var request = require('request');
var multer  = require('multer');
var upload = multer();
// Twilio setup

var accountSid = 'AC2e778bf79df8fda1e6899658b6ff54d5';
var authToken = '6cf2f95fa521c952f57ef3c5d1b4f284';
var client = require('twilio')(accountSid, authToken);

// grab the soul model we just created
var Soul = require('../models/souls');

// Add the soul to database
router.get('/track/:id/:lat/:lng', function(req, res, next) {
  Soul.update({
    id: req.params.id
  }, {
    id: req.params.id,
    lat: req.params.lat,
    lng: req.params.lng
  }, {
    upsert: true
  }, function(err) {
    if (err) {
      console.log(err);
      res.json({
        result: 0
      });
    } else
      res.json({
        result: 1
      })
  });
});

// API to locate the soul on phone
router.get('/locate/:soulid', function(req, res, next) {
  Soul.findOne({
    id: req.params.soulid
  }, 'id lat lng', function(err, soul) {
    // console.log(soul);
    if (err) {
      res.json({
        result: 0
      });
    } else {
      res.json({
        result: 1,
        id: soul.id,
        lat: soul.lat,
        lng: soul.lng
      });
    }
  });
});

// End point to get phone number of the police station
router.get('/phone/:id', function(req, res, next) {
  const API_KEY = 'AIzaSyCdW8DZofdjeJfGNI6jJ1SP5cj3bABLcnI';
  var id = req.params.id;
  var url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + id + '&key=' + API_KEY;
  request(url, (result, error, body) => {
    // console.log(body);
    res.send(body);
  });
});

router.post('/findhelp', upload.array(),function(req, res, next) {
  var numbers = req.body.number;
  console.log(numbers);
  numbers = numbers.replace(/[-\s]/g, '').split(',');
  for(var i = 0; i < numbers.length; i++){
    numbers[i] = numbers[i].slice(-10);
    callForHelp(numbers[i]);
  }
  console.log(numbers);
  res.send(numbers);
});

// Initiate calls to emergency contacts
function callForHelp(number){
  var base = 'http://twimlets.com/echo?Twiml=';
  var XML = base + encodeURIComponent('<Response><Say voice="alice">This is an emergency alert. Your contact Chetan Kaushik is in trouble! We have sent you a link to track your contact in realtime.</Say></Response>');
  client.calls.create({
    // url: "http://demo.twilio.com/docs/voice.xml",
    url: XML,
    to: '+91'+number, // Text this number
    from: '+15017082982 ' // From a valid Twilio number
  }, function(err, message) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("success");
    }
  });
}

module.exports = router;
