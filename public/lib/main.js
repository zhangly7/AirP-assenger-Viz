$(document).ready(function() {
	$(".keen-dashboard").hide();

	$('[data-toggle="datepicker"]').datepicker({
		format: 'mm-yyyy',
		autoHide: true,
		startView: 2,
		startDate: '01/1990',
		endDate: '05/2017'
	});

	// $('.search-box').click(function(){
	// 		console.log($('[data-toggle="datepicker"]').datepicker('getMonthName'));
	// });

$("input[type='text']").on("click", function () {
   $(this).select();
});


	var airportInfo = airport_data;
	var carrierInfo = carrier_data;


/*=========== Form1 (Front Page) Submission Handler ============*/
	$('#form1').submit(function(e) {
		e.preventDefault();
		console.log("btn clicked");
		Pace.restart();

		// // test
		// d3.tsv("demo1.tsv", function(data) {
		// 	console.log(data);
		// 	var xf = crossfilter(data);
		// 	var groupname = "marker-select";
		// 	var facilities = xf.dimension(function(d) { return d.geo; });
		// 	var facilitiesGroup = facilities.group().reduceCount();

		// 	var marker = dc_leaflet.markerChart("#bubble-map", groupname)
		// 		.dimension(facilities)
		// 		.group(facilitiesGroup)
		// 		.width(425)
		// 		.height(349)
		// 		.center([42.69, 25.42])
		// 		.zoom(7)
		// 		.cluster(true);

		// 	var types = xf.dimension(function(d) { return d.type; });
		// 	var typesGroup = types.group().reduceCount();
		// 	dc.renderAll(groupname);

		// });


		var begin_date = $('#begin_date').datepicker('getDate');
		var end_date = $('#end_date').datepicker('getDate');

		var formData = {
			'origin': $('#origin_input').val(),
			'dest': $('#dest_input').val(),
			'begin_mon': begin_date.getMonth() + 1,
			'begin_year': begin_date.getFullYear(),
			'end_mon': end_date.getMonth() + 1,
			'end_year': end_date.getFullYear()
			//, 'dashboardType': 
		};
		$.ajax({
			type: "POST",
			url: "http://localhost:8080/data",
			data: formData,
			dataType: 'json',
			//dataType: "application/json",
			success: function(data) {

				if (data.length == 0) {
					alert("Opps, no data.. check your input");
				} else {
					if (data.length < 200) {
					alert("Data is not that much.")
					}
					var info = "<div id='info1'>" + formData.origin + " <span id='abc'>To</span> " + formData.dest + ";</div>";
					var info2 = "<div id='info2'>" + formData.begin_year + "-" +formData.begin_mon+ " <span id='abc'>To</span> " + formData.end_year + "-" +formData.end_mon + "</div>";
					$("#display_info").html(info);
					$("#display_info2").html(info2);

					$('#origin_input2').val(formData.origin);
					$('#dest_input2').val(formData.dest);
					$('#begin_date2').datepicker('setDate',begin_date);
					$('#end_date2').datepicker('setDate',end_date);



					$(".keen-dashboard").show().css("visibility", "visible");
					$(".main").remove();

					console.log("search-page removed");


					//JSON.stringify(d);
					//console.log(JSON.stringify(d));
					// d3.json(d, function(data) {
					data.forEach(function(d) {
						var dateStr = d.YEAR + '-' + d.MONTH + '-02';
						d.date = new Date(dateStr);
						d.rpm = d.PASSENGERS * d.DISTANCE;
						for (var i = 0; i < airport_data.length; i++) {
							if (airport_data[i].iata === d.ORIGIN) {
								d.ORIGIN = airport_data[i].name + " - " + d.ORIGIN;
								d.origin_geo = airport_data[i].lat + ',' + airport_data[i].lon;
							}
							if (airport_data[i].iata === d.DEST) {
								d.DEST = airport_data[i].name + " - " + d.DEST;
								d.dest_geo = airport_data[i].lat + ',' + airport_data[i].lon;
							}
							if (d.ORIGIN.length !== 3 && d.DEST.length !== 3)
								break;
						}
						for (var i = 0; i < carrier_data.length; i++) {
							if (carrier_data[i].code === d.UNIQUE_CARRIER) {
								d.UNIQUE_CARRIER = carrier_data[i].name;
							}
						}
						// d.PASSENGERS = +d.PASSENGERS;
						// d.MONTH = +d.MONTH;
					});
					//console.log(data);
					draw(data);
				}
			}
		});	// ajax END
	});		// form1 submit END


/*=========== Form2 (Dashboard) Submission Handler ============*/
	$('#form2').submit(function(e) {
		e.preventDefault();
		console.log("form2 sumit start");
		
		var begin_date = $('#begin_date2').datepicker('getDate');
		var end_date = $('#end_date2').datepicker('getDate');

		var formData = {
			'origin': $('#origin_input2').val(),
			'dest': $('#dest_input2').val(),
			'begin_mon': begin_date.getMonth() + 1,
			'begin_year': begin_date.getFullYear(),
			'end_mon': end_date.getMonth() + 1,
			'end_year': end_date.getFullYear()
		};
		$.ajax({
			type: "POST",
			url: "http://localhost:8080/data",
			data: formData,
			dataType: 'json',
			success: function(data) {

				if (data.length == 0) {
					alert("Opps, no data for your input..");
				} else {
					var info = "<div id='info1'>" + formData.origin + " <span id='abc'>To</span> " + formData.dest + ";</div>";
					var info2 = "<div id='info2'>" + formData.begin_year + "-" +formData.begin_mon+ " <span id='abc'>To</span> " + formData.end_year + "-" +formData.end_mon + "</div>";
					$("#display_info").html(info);
					$("#display_info2").html(info2);

					data.forEach(function(d) {
						var dateStr = d.YEAR + '-' + d.MONTH + '-02';
						d.date = new Date(dateStr);
						d.rpm = d.PASSENGERS * d.DISTANCE;
						for (var i = 0; i < airport_data.length; i++) {
							if (airport_data[i].iata === d.ORIGIN) {
								d.ORIGIN = airport_data[i].name + " - " + d.ORIGIN;
							}
							if (airport_data[i].iata === d.DEST) {
								d.DEST = airport_data[i].name + " - " + d.DEST;
							}
							if (d.ORIGIN.length !== 3 && d.DEST.length !== 3)
								break;
						}
						for (var i = 0; i < carrier_data.length; i++) {
							if (carrier_data[i].code === d.UNIQUE_CARRIER) {
								d.UNIQUE_CARRIER = carrier_data[i].name;
							}
						}
					});
					draw(data);
				}
			}
		});	// ajax END
	});	

});