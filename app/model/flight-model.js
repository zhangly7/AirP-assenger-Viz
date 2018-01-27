var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;


var bigSchema = new Schema({});
// var flight = mongoose.model('test',{});
var flight = mongoose.model('FlightInfo',bigSchema,"us_flight");

module.exports = flight;