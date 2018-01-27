var states = new Bloodhound({
	datumTokenizer: Bloodhound.tokenizers.obj.whitespace('state'),
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	// url points to a json file that contains an array of country names, see
	// https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
	prefetch: '../data/stateDict.json'
});

var countries = new Bloodhound({
	datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	// url points to a json file that contains an array of country names, see
	// https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
	prefetch: '../data/cDict.json'
});



var cities = new Bloodhound({
	datumTokenizer: Bloodhound.tokenizers.obj.whitespace('city'),
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	// url points to a json file that contains an array of country names, see
	// https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
	prefetch: '../data/cityDict.json'
});

var airports = new Bloodhound({
	datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	// url points to a json file that contains an array of country names, see
	// https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
	prefetch: '../data/aDict.json'
});

var us_regions = new Bloodhound({
	datumTokenizer: Bloodhound.tokenizers.obj.whitespace('region'),
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	// url points to a json file that contains an array of country names, see
	// https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
	prefetch: '../data/region.json'
});

var continents = new Bloodhound({
	datumTokenizer: Bloodhound.tokenizers.obj.whitespace('continent'),
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	// url points to a json file that contains an array of country names, see
	// https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
	prefetch: '../data/contiDict.json'
});


// passing in `null` for the `options` arguments will result in the default
// options being used
$('#prefetch .typeahead').typeahead({
	highlight: true
},  
{
	name: 'states',
	display: 'state',
	source: states,
	templates: {
		header: '<h3 class="title-name">States</h3>'
	},
	limit: 2
},
{
	name: 'countries',
	display: 'name',
	source: countries,
	templates: {
		header: '<h3 class="title-name">Countries</h3>'
	},
	limit: 3
},{
	name: 'cities',
	display: 'city',
	source: cities,
	templates: {
		header: '<h3 class="title-name">Cities</h3>'
	},
	limit: 4
}, 
{
	name: 'airports',
	display: 'name',
	source: airports,
	templates: {
		header: '<h3 class="title-name">Airports</h3>',
		suggestion: function(data) {
			return '<div>' + data.name + ' - <span style="margin-left: 0;"><strong>' + data.iata + '</strong></span></div>';
		}
	},
	limit: 2
},  {
	name: 'region_us',
	display: 'region',
	source: us_regions,
	templates: {
		header: '<h3 class="title-name">U.S. Regions</h3>'
	},
	limit: 2
}, {
	name: 'continents',
	display: 'continent',
	source: continents,
	templates: {
		header: '<h3 class="title-name">Continents</h3>'
	},
	limit: 2
});