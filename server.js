const mongoose = require('mongoose');
const flight = require("./app/model/flight-model.js");
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const util = require('util')


const app = express();

var router = express.Router();
var main_route = require('./routes/main-route');

var port = process.env.PORT || 8080;
var uri = 'mongodb://zhangly7:335506Mongo!@flight-cluster-shard-00-02-en3a6.mongodb.net:27017,' +
  'flight-cluster-shard-00-00-en3a6.mongodb.net:27017,' +
  'flight-cluster-shard-00-01-en3a6.mongodb.net:27017/flight' +
  '?ssl=true&replicaSet=Flight-Cluster-shard-0&authSource=admin';

mongoose.connect(uri, { useMongoClient: true });

app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.urlencoded({ extended: true }));

// Home page route
router.get('/', function(req, res) {
  res.sendFile(__dirname + "/public/search.html");
})


var regionDict = require('./public/data/region.json');
var continentDict = require('./public/data/contiDict.json');
var stateDict = require('./public/data/stateDict.json');
var countryDict = require('./public/data/cDict.json');
var cityDict = require('./public/data/cityDict.json');
var airportDict = require('./public/data/aDict.json');

var parsePlace = function(origin, dest) {
  var placeInfo = {};
  // Iterate regions
  for (var i = 0; i < regionDict.length; i++) {
    if (regionDict[i].region === origin) {
      placeInfo.ORIGIN_WAC = regionDict[i].code;
    }
    if (regionDict[i].region === dest) {
      placeInfo.DEST_WAC = regionDict[i].code;
    }
    if (Object.keys(placeInfo).length === 2)
      return placeInfo;
  }
  // Iterate continents
  for (var i = 0; i < continentDict.length; i++) {
    if (continentDict[i].continent === origin) {
      placeInfo.ORIGIN_WAC = continentDict[i].code;
    }
    if (continentDict[i].continent === dest) {
      placeInfo.DEST_WAC = continentDict[i].code;
    }
    if (Object.keys(placeInfo).length === 2)
      return placeInfo;
  }
  // Iterate states
  for (var i = 0; i < stateDict.length; i++) {
    if (stateDict[i].state === origin) {
      placeInfo.ORIGIN_STATE_ABR = stateDict[i].code;
    }
    if (stateDict[i].state === dest) {
      placeInfo.DEST_STATE_ABR = stateDict[i].code;
    }
    if (Object.keys(placeInfo).length === 2)
      return placeInfo;
  }
  // Iterate cities
  for (var i = 0; i < cityDict.length; i++) {
    if (cityDict[i].city === origin) {
      placeInfo.ORIGIN_CITY_NAME = cityDict[i].city;
    }
    if (cityDict[i].city === dest) {
      placeInfo.DEST_CITY_NAME = cityDict[i].city;
    }
    if (Object.keys(placeInfo).length === 2)
      return placeInfo;
  }
  // Iterate countries
  for (var i = 0; i < countryDict.length; i++) {
    if (countryDict[i].name === origin) {
      placeInfo.ORIGIN_COUNTRY = countryDict[i].code;
    }
    if (countryDict[i].name === dest) {
      placeInfo.DEST_COUNTRY = countryDict[i].code;
      // console.log(countryDict[i].name);
      // console.log("find");
    }
    // if (typeof placeInfo.ORIGIN_COUNTRY_NAME !== "undefined" && typeof placeInfo.ORIGIN_COUNTRY_NAME !== "undefined") 
    //   return placeInfo;
    if (Object.keys(placeInfo).length === 2)
      return placeInfo;
  }
  // Iterate Airports
  for (var i = 0; i < airportDict.length; i++) {
    if (airportDict[i].name === origin) {
      placeInfo.ORIGIN = airportDict[i].iata;
    }
    if (airportDict[i].name === dest) {
      placeInfo.DEST = airportDict[i].iata;
    }
    if (Object.keys(placeInfo).length === 2)
      return placeInfo;
  }

};

var queryGenerator = function(placeInfo, b_m, b_y, e_m, e_y) {
  var dynamicQuery = {};
  var originType = "";
  var destType = "";
    console.log("typeof b_y is" + typeof b_y);
  b_m = parseInt(b_m);
  b_y = parseInt(b_y);
  e_m = parseInt(e_m);
  e_y = parseInt(e_y);

  if (b_y !== e_y) {
    dynamicQuery = { $and: [{ $or: [{ $or: [{ $and: [{ "YEAR": b_y }, { "MONTH": { $gte: b_m } }] }, { $and: [{ "YEAR": e_y }, { "MONTH": { $lte: e_m } }] }] }, { "YEAR": { $gt: b_y, $lt: e_y } }] }] };
  } else {
    dynamicQuery = { $and: [{ $and: [{ "MONTH": { $gte: b_m, $lte: e_y } }, { "YEAR": b_y }] }] };
  }
  if (Object.keys(placeInfo)[0].indexOf("ORIGIN") !== -1) {
    originType = Object.keys(placeInfo)[0];
    destType = Object.keys(placeInfo)[1];
  } else {
    originType = Object.keys(placeInfo)[1];
    destType = Object.keys(placeInfo)[0];
  }

  var addonOrigin = {};
  var addonDest = {};

  if (originType == "ORIGIN_WAC") {
    addonOrigin.ORIGIN_WAC = { $in: placeInfo[originType] };
  } else if (originType == "ORIGIN_STATE_ABR") {
    addonOrigin.ORIGIN_STATE_ABR = placeInfo[originType];
  } else if (originType == "ORIGIN_CITY_NAME") {
    addonOrigin.ORIGIN_CITY_NAME = placeInfo[originType];
  } else if (originType == "ORIGIN") {
    addonOrigin.ORIGIN = placeInfo[originType];
  } else if (originType == "ORIGIN_COUNTRY") {
    addonOrigin['ORIGIN_COUNTRY'] = placeInfo[originType];
  }

  if (destType == "DEST_WAC") {
    addonDest.DEST_WAC = { $in: placeInfo[destType] };
  } else if (destType == "DEST_STATE_ABR") {
    addonDest.DEST_STATE_ABR = placeInfo[destType];
  } else if (destType == "DEST_CITY_NAME") {
    addonDest.DEST_CITY_NAME = placeInfo[destType];
  } else if (destType == "DEST") {
    addonDest.DEST = placeInfo[destType];
  } else if (destType == "DEST_COUNTRY") {
    addonDest['DEST_COUNTRY'] = placeInfo[destType];
  }

  dynamicQuery["$and"].push(addonOrigin);
  dynamicQuery["$and"].push(addonDest);
  console.log(dynamicQuery);
  console.log(util.inspect(dynamicQuery, false, null))

  return dynamicQuery;
};



// For mongo collection us_flight, USE NOW!!!!
router.post('/data', function(req, res) {

  var b_m = req.body.begin_mon;
  var b_y = req.body.begin_year;
  var e_m = req.body.end_mon;
  var e_y = req.body.end_year;

  console.log("b_m is "+b_m);
  console.log("b_y is "+b_y);
  console.log("e_m is "+e_m);
  console.log("e_y is "+e_y);

  var orgin_dest = parsePlace(req.body.origin, req.body.dest);
  console.log(orgin_dest);
  if (!orgin_dest || Object.keys(orgin_dest).length !== 2) {
    res.json([]);
  }
  var query = queryGenerator(orgin_dest,b_m,b_y,e_m,e_y);
  //    flight.find({"ORIGIN":ORIGIN}, {'_id': 0,'PASSENGERS':1, 'DISTANCE': 1, 'ORIGIN': 1, 'DEST': 1, }, function(err, data) {
  flight.find(query,
    //{ ORIGIN_COUNTRY: "NL", DEST_COUNTRY: "US", YEAR: { $in: [2002, 2003] }, PASSENGERS: { $gt: 0 } },
    //{ $and: [{ $and: [{ "MONTH": { $gte: 2, $lte: 4 } }, { "YEAR": 2012 }] }, {"ORIGIN_COUNTRY": "FR"}] },
    //   { '_id': 0, 'PASSENGERS': 1, 'DISTANCE': 1, 'UNIQUE_CARRIER': 1, 'CARRIER_NAME': 0, 'ORIGIN': 1, 'ORIGIN_CITY_NAME': 1, 'ORIGIN_COUNTRY': 1, 'ORIGIN_COUNTRY_NAME': 0, 'ORIGIN_WAC': 1, 'DEST': 1, 'DEST_CITY_NAME': 1, 'DEST_COUNTRY': 1, 'DEST_COUNTRY_NAME': 0, 'DEST_WAC': 1, 'YEAR': 1, 'MONTH': 1, 'QUARTER': 1 },
    { '_id': 0, 'PASSENGERS': 1, 'DISTANCE': 1, 'UNIQUE_CARRIER': 1, 'ORIGIN': 1, 'ORIGIN_CITY_NAME': 1, 'ORIGIN_COUNTRY': 1, 'ORIGIN_WAC': 1, 'DEST': 1, 'DEST_CITY_NAME': 1, 'DEST_COUNTRY': 1, 'DEST_WAC': 1, 'YEAR': 1, 'MONTH': 1, 'QUARTER': 1 },
    function(err, data) {
      // if there is an error, send the error. 
      if (err)
        res.send(err);
      res.json(data); // return all nerds in JSON format
    }
  );
})



app.listen(port);
app.use('/', router);

app.use('/flight', main_route);
//app.use(express.static(__dirname + '/public')); 
app.use(express.static(path.join(__dirname, 'public')));

console.log('Running on port ' + port);