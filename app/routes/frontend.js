var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

var router = express.Router();

// var Flickr = require("flickrapi"),
//     flickrOptions = {
//       api_key: "289922b7f2c27999cd3cd77f92034e75",
//       secret: "0b19ca222797dcd0"
//     };
 


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
    if(!err && JSON.parse(body).result.response.data){

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
            coords: body.trail
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

router.get('/zoo/lat/long', (req, res, next) => {
  request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+ -33.8670522+','+ 151.1957362 + '&radius=5000&types=zoo&key=AIzaSyDu4BggdV0fltM4Smcye1l1H2OYGoogxXk', (err, resp, body) => {
    res.json(JSON.parse(body));
  })
});

router.get('/flickr/:query', (req, res, next) => {
  var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=a828a6571bb4f0ff8890f7a386d61975&sort=interestingness-desc&per_page=100&format=json&tags=' + req.params.query;
  request(url, (err, resp, body) => {
    if(!err){
      body = body.slice(14, body.length-1);
      body = JSON.parse(body).photos;
      if(body.photo){
        var links = [];
        photo = body.photo;
      for(var i = 0; i < photo.length; i++){
        var link = 'http://farm' + photo[i].farm + '.staticflickr.com/' + photo[i].server + '/' + photo[i].id + '_' + photo[i].secret + '_s.jpg';
        links.push(link);
      }
      res.json({
        success: true,
        photos: links
      })

      }

    }
  });

});

module.exports = router;
