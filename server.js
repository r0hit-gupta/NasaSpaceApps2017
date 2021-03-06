// server.js

// modules =================================================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var favicon = require('serve-favicon');
var cors = require('cors');
var morgan = require('morgan');
// configuration ===========================================

// config files
// var db = require('./config/db');

// set our port
var port = process.env.PORT || 8080;

// connect to our mongoDB database
// mongoose.connect(db.url, function(err) { if (err) console.log(err); } );

// set the view engine to ejs
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

// use favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// log requests
app.use(morgan('dev'));
// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// enable CORS
app.use(cors());

// routes ==================================================
var routes = require('./app/routes/frontend'); // configure our routes
var souls = require('./app/routes/souls');

app.use('/', routes);
app.use('/api', souls);

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);

// shoutout to the user
console.log('Magic happens on port ' + port);

// expose app
exports = module.exports = app;
