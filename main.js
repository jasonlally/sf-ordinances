var data = {};

(function() {

	$.tablesorter.addParser({ 
    // set a unique id 
    id: 'ordno', 
    is: function(s) { 
      // return false so this parser is not auto detected 
      return false; 
    }, 
    format: function(s) { 
      // format your data for normalization 
      var id_parts = s.split("-");
      var id = id_parts[0];
      if (id.length == 1) {
      	id = "00" + id.toString();
      } else if (id.length == 2) {
      	id = "0" + id.toString();
      }
      return id_parts[1] + id;
    }, 
    // set type, either numeric or text 
    type: 'numeric' 
    }); 

	$("#ordinance-table").tablesorter({
		headers: { 
      1: { 
          sorter:'ordno' 
      } 
  	}
	});

	$.getJSON('data/data.json', function(json_data){
		var table_obj = $('#ordinance-list');
		$.each(json_data, function(index, item){
			var table_row = $('<tr>', {id: item.fileno});
	   	var date = $('<td>', {html: item.date});
	  	if(item.date != "TBD") {
	  		var date_parts = item.date.split("/");
	      var datef = new Date("20" + date_parts[2], date_parts[0] - 1, 1,0,0,0).getTime();
	      datef = datef / 1000;
	      if(!_.has(data,datef)) {
	      	data[datef] = 1;
	      } else {
	      	data[datef] += 1;
	      }  
	    }
	  	var ordno = $('<td>', {html: item.ordno});
	 		var fileno = $('<td>', {html: item.fileno});
	   	var desc = $('<td>', {html: item.desc});
	    table_row.append(date).append(ordno).append(fileno).append(desc);
	    table_obj.append(table_row);
	  })
	  //console.log(data);
	}).done(function(){
		var sorting = [[0,1]]
	  $("#ordinance-table").trigger("update");
	  var chart_data = []
	  $.each(data, function(index, item){
	  	chart_data.push({x: parseInt(index), y: item});
	  })
	  chart_data = _.sortBy(chart_data, function(o){ return o.x });
	  console.log(chart_data);
	  /*var aggregated = d3.nest()
                   .key(function(d) { return (new Date(+d.x * 1000)).getMonth(); })
                   .rollup(function(d) { return d3.sum(d, function(e) { return +e.y; }); })
                   .entries(chart_data)
                   .map(function(d) { return {x: +d.key, y: d.values}; });
		console.log(aggregated);*/
		var w = 1100;
		var h = 300;

		var graph = new Rickshaw.Graph({
        element: document.querySelector("#chart"),
        renderer: 'line',
        width: w,
        height: h,
        series: [{
                data: chart_data,
                color: 'steelblue'
        }]
		});

		var chart_svg = d3.select("#chart svg").attr("viewBox", "0 0 " + w + " " + h )
    		 .attr("preserveAspectRatio", "xMinYMin");
/*
    var force = d3.layout.force()
    	.nodes(nodes)
    	.links(links)
    	.size([w, h]);

    force.on("tick", function() {
		  chart_svg.selectAll("line.link")
		    .attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });

		  chart_svg.selectAll("circle.node")
	      .attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; });
		});
*/
		console.log(graph);

		var time = new Rickshaw.Fixtures.Time();
		var month = time.unit('month');
		var year = time.unit('year');

		var xAxis = new Rickshaw.Graph.Axis.Time({
	    graph: graph,
	    timeUnit: month
		});

		var xAxis2 = new Rickshaw.Graph.Axis.Time({
			graph: graph,
			timeUnit: year,
			ticksTreatment: 'year'
		})
 
		graph.render();
		xAxis.render();
		xAxis2.render();

	})
})();