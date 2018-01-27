var express = require('express');
var router = express.Router();

var main_controller = require('../controllers/main-controller');


router.get('/flight/:id', main_controller.allFlightInfo);
router.get('/', function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
})

module.exports = router;
