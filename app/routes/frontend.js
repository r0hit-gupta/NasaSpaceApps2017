var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

var router = express.Router();

var Soul = require('../models/souls');

router.get('/', function (req, res, next) {
  res.render('404');
});


router.get('/:flight', (req, res, next) => {
  request('https://api.flightradar24.com/common/v1/flight/list.json?query='+ req.params.flight+'&fetchBy=flight&page=1', (err, resp, body) => {
    if(!err){
      var id, number;
      body = JSON.parse(body).result.response.data;
      for(var i= 0; i < body.length; i++){
        if(body[i].identification.id){
          id = body[i].identification.id;
          number = body[i].identification.callsign;
          break;
        }
      }

      res.send('https://www.flightradar24.com/'+number+'/'+id+'/3d');
    }
  });
});


router.get('/coord/:flight', (req, res, next) => {
  request('https://api.flightradar24.com/common/v1/flight/list.json?query='+ req.params.flight+'&fetchBy=flight&page=1', (err, resp, body) => {
    console.log(body);
    if(!err && JSON.parse(body)){

      var id, number;
      body = JSON.parse(body).result.response.data;
      for(var i= 0; i < body.length; i++){
        if(body[i].identification.id){
          id = body[i].identification.id;
          number = body[i].identification.callsign;
          break;
        }
      }
      request('https://data-live.flightradar24.com/clickhandler/?version=1.5&flight='+id, (err, resp, body) => {
      if(!err && body != 'Array'){
        body = JSON.parse(body);

        if(body.trail[0]){
          res.json({
            success: true,
            pos1: body.trail[0],
            pos2: body.trail[1]
          });
          }
          else {
            res.json({
              success: false
            })
          }
        }
      });
    }
  });
});
module.exports = router;
