// d3.queue()
// 	.defer(d3.csv, "2016.csv")
// 	.defer(d3.csv, "2015.csv")
// 	.await(draw);

function draw(error, file1, file2) {
		if (error) {
			console.error('Oh dear, something went wrong: ' + error);
		} else {
			var data = file1.concat(file2);

			var dateFormat = d3.timeFormat('%m/%d/%Y');
			// var date1 = new Date("1991-1-2");
			// var date1_new = dateFormat(date1);
			//var temp = dateFormat.parse(data[0].YEAR + "-" + data[0].MONTH + "-" + "2");
			//console.log(date1_new);
			data.forEach(function(d) {
				var dateStr = d.YEAR + '-' + d.MONTH + '-02';
				d.date = new Date(dateStr);
				d.PASSENGERS = +d.PASSENGERS;
				d.MONTH = +d.MONTH;
			});
			//console.log(data);

			var ndx = crossfilter(data);
			var dateDim = ndx.dimension(function(d) { return d.date; });

			var minDate = dateDim.bottom(1)[0].date;
			var maxDate = dateDim.top(1)[0].date;


			var passengerByDate = dateDim.group().reduceSum(function(d) {
				return d.PASSENGERS;
			});

			var topDate = passengerByDate.top(1);
			// console.log(minDate);
			// console.log(new Date(2015, 0, 1));
			console.log(topDate[0].key);
			console.log(topDate[0].value);



			var moveChart = dc.lineChart('#move_chart');
			moveChart.renderArea(true)
				.width(990)
				.height(200)
				.dimension(dateDim)
				//.elasticY(true)
				.group(passengerByDate, 'Monthly Passenger Numbers')
				.transitionDuration(500)
				.margins({ top: 30, right: 50, bottom: 25, left: 40 })
				.x(d3.time.scale().domain([new Date(2015, 0, 1), new Date(2016, 11, 31)]))
				.y(d3.scale.linear().domain([10000000, 28000000]))
				.round(d3.time.month.round)
				.xUnits(d3.time.months)
				.renderHorizontalGridLines(true)
				.renderVerticalGridLines(true)
				.brushOn(false)
				.yAxis().tickFormat(d3.format('.3s'));


			var hits = dateDim.group().reduceSum(function(d) { return d.total; });

			dc.renderAll();
		}
	};