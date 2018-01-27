var test = function() {
	console.log("hello, I'm helper");
};



var test2 = function() {
	console.log(json);
};

var parseForm = function(formData) {
  var placeInfo = {};

  for (var i = 0; i < countryDict.length; i++) {
    if (countryDict[i].code === origin) {
      placeInfo.ORIGIN_COUNTRY_NAME = countryDict[i].name;
    }
    if (countryDict[i].code === dest) {
      placeInfo.DEST_COUNTRY_NAME = countryDict[i].name;
      // console.log(countryDict[i].name);
      // console.log("find");
    }
    if (typeof placeInfo.ORIGIN_COUNTRY_NAME !== "undefined" && typeof placeInfo.ORIGIN_COUNTRY_NAME !== "undefined") 
      break;
  }
};

var queryGen = function(placeInfo) {

}