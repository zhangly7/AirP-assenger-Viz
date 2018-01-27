// d3.queue()
// 	.defer(d3.csv, "2016.csv")
// 	.defer(d3.csv, "2015.csv")
// 	.await(draw);


function draw(data) {
	var ndx = crossfilter(data);
	var dateDim = ndx.dimension(function(d) { return d.date; });
	var originDim = ndx.dimension(function(d) { return d.ORIGIN; });
	var destDim = ndx.dimension(function(d) { return d.DEST; });
	var airlineDim = ndx.dimension(function(d) { return d.UNIQUE_CARRIER });
	var yearDim = ndx.dimension(function(d) { return d.YEAR; });



	var quarterDim = ndx.dimension(function(d) {
		if (d.QUARTER == 1) {
			return 'Q1';
		} else if (d.QUARTER == 2) {
			return 'Q2';
		} else if (d.QUARTER == 3) {
			return 'Q3';
		} else {
			return 'Q4';
		}
	});

	var monthDim = ndx.dimension(function(d) {
		if (d.MONTH == 1) {
			return 'Jan';
		} else if (d.MONTH == 2) {
			return 'Feb';
		} else if (d.MONTH == 3) {
			return 'Mar';
		} else if (d.MONTH == 4) {
			return 'Apr';
		} else if (d.MONTH == 5) {
			return 'May';
		} else if (d.MONTH == 6) {
			return 'Jun';
		} else if (d.MONTH == 7) {
			return 'Jul';
		} else if (d.MONTH == 8) {
			return 'Aug';
		} else if (d.MONTH == 9) {
			return 'Sep';
		} else if (d.MONTH == 10) {
			return 'Oct';
		} else if (d.MONTH == 11) {
			return 'Nov';
		} else if (d.MONTH == 12) {
			return 'Dec';
		}
	});

	var minDate = dateDim.bottom(1)[0]["date"];
	var maxDate = dateDim.top(1)[0]["date"];
	var minYear = dateDim.bottom(1)[0]["YEAR"];
	var maxYear = dateDim.top(1)[0]["YEAR"];



	// console.log(minDate);
	// console.log(maxDate);

	var psgerByDate = dateDim.group().reduceSum(function(d) {
		return d.PASSENGERS;
	});
	var psgerByOrigin = originDim.group().reduceSum(function(d) {
		return d.PASSENGERS;
	});
	var psgerByDest = destDim.group().reduceSum(function(d) {
		return d.PASSENGERS;
	});
	var psgerByAirline = airlineDim.group().reduceSum(function(d) {
		return d.PASSENGERS;
	});
	var psgerByQuarter = quarterDim.group().reduceSum(function(d) {
		return d.PASSENGERS;
	});
	var psgerByMonth = monthDim.group().reduceSum(function(d) {
		return d.PASSENGERS;
	});

	var totalPsger = ndx.groupAll().reduceSum(function(d) { return d.PASSENGERS; });
	var totalRpm = ndx.groupAll().reduceSum(function(d) { return d.rpm});

	var rpmByYear = yearDim.group().reduceSum(function(d) { return d.rpm});

	//var topDate = psgerByDate.top(1);
	// console.log(minDate);
	// console.log(new Date(2015, 0, 1));
	// console.log(topDate[0].key);
	// console.log(topDate[0].value);

	var flowChart = dc.lineChart('#time-chart');
	var originChart = dc.rowChart("#origin");
	var destChart = dc.rowChart("#dest");
	var airlinePie = dc.pieChart("#airline");

	var psgerBarQuar = dc.barChart("#quarterPsg");
	var psgerBarMonth = dc.barChart("#monthPsg");

	var totalPsgerDisplay = dc.numberDisplay("#passenger_num");
	var rpmDisplay = dc.numberDisplay("#rpm");

	var annualRpm = dc.barChart("#anual-rpm");









	flowChart.renderArea(true)
		.width(1000)
		.height(350)
		.mouseZoomable(true)
		.dimension(dateDim)
		//.elasticY(true)
		.group(psgerByDate)
		.transitionDuration(800)
		.margins({ top: 30, right: 50, bottom: 25, left: 60 })
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)

		// .y(d3.scale.linear().domain([10000000, 28000000]))
		.round(d3.time.month.round)
		.xUnits(d3.time.months)
		.renderHorizontalGridLines(true)
		.renderVerticalGridLines(true)
		//.brushOn(false)
		.yAxis().tickFormat(d3.format('.3s'));


	originChart
		.width(460)
		.height(290)
		.rowsCap(8)
		.ordering(function(d) { return -d.value })
		.dimension(originDim)
		.group(psgerByOrigin)
		.elasticX(true)
		.xAxis().ticks(4);


	destChart
		.width(460)
		.height(290)
		.rowsCap(8)
		.ordering(function(d) { return -d.value })
		.dimension(destDim)
		.group(psgerByDest)
		.elasticX(true)
		.xAxis().ticks(4);

	airlinePie
		.width(480)
		.height(290)
		.slicesCap(4)
		.innerRadius(80)
		.dimension(airlineDim)
		.group(psgerByAirline)
		.renderLabel(false)
		.legend(dc.legend())
		//.drawPaths(true)
		.on('pretransition', function(chart) {
			chart.selectAll('text.pie-slice').text(function(d) {
				return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
			})
		});



	psgerBarQuar
		.width(400)
		.height(220)
		.transitionDuration(800)
		.dimension(quarterDim)
		.group(psgerByQuarter)
		.margins({ top: 10, right: 50, bottom: 30, left: 50 })
		.centerBar(false)
		.gap(5)
		.elasticY(true)
		.x(d3.scale.ordinal().domain(quarterDim))
		.xUnits(dc.units.ordinal)
		.renderHorizontalGridLines(true)
		//.ordering(function(d){return d.value;})
		.yAxis().tickFormat(d3.format("s"));

	psgerBarMonth
		.width(440)
		.height(220)
		.transitionDuration(800)
		.dimension(monthDim)
		.group(psgerByMonth)
		.margins({ top: 10, right: 50, bottom: 30, left: 50 })
		.centerBar(false)
		.gap(5)
		.elasticY(true)
		.x(d3.scale.ordinal().domain(monthDim))
		.xUnits(dc.units.ordinal)
		.renderHorizontalGridLines(true)
		.ordering(function(d) { return -d.value })
		.yAxis().tickFormat(d3.format("s"));



	totalPsgerDisplay
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d) { return d; })
		.group(totalPsger)
		.formatNumber(d3.format(".3s"));

	rpmDisplay
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d) { return d; })
		.group(totalRpm)
		.formatNumber(d3.format(".3s"));

	annualRpm
    .width(460)
    .height(220)
    .margins({top: 10, right: 50, bottom: 30, left: 50})
    .dimension(yearDim)
    .group(rpmByYear)
    .transitionDuration(800)
    .x(d3.scale.ordinal().domain(yearDim))
    .xUnits(dc.units.ordinal)
    .renderHorizontalGridLines(true)
    .elasticY(true)
    .yAxis().tickFormat(d3.format("s"));


	dc.renderAll();
};