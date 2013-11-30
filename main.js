var data = {};

(function () {

  $.tablesorter.addParser({
    // set a unique id
    id: 'ordno',
    is: function (s) {
      // return false so this parser is not auto detected
      return false;
    },
    format: function (s) {
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
        sorter: 'ordno'
      }
    }
  });

  $.getJSON('data/data.json',function (json_data) {
    var table_obj = $('#ordinance-list');
    $.each(json_data, function (index, item) {
      var table_row = $('<tr>', {id: item.fileno});
      var date = $('<td>', {html: item.date, class: 'date'});
      if (item.date != "TBD") {
        var date_parts = item.date.split("/");
        var datef = new Date("20" + date_parts[2], date_parts[0] - 1, 1, 0, 0, 0).getTime();
        datef = datef / 1000;
        if (!_.has(data, datef)) {
          data[datef] = 1;
        } else {
          data[datef] += 1;
        }
      }
      var ordlink = $('<a>', {html: item.ordno, href: item.url, target: "_blank"});
      var ordno = $('<td>').append(ordlink);
      var fileno = $('<td>', {html: item.fileno});
      var otype = $('<td>', {html: item.otype});
      var desc = $('<td>', {html: item.desc});
      table_row.append(date).append(ordno).append(fileno).append(otype).append(desc);
      table_obj.append(table_row);
    })
    //console.log(data);
  }).done(function () {
        $("#ordinance-table").trigger("update");
        var chart_data = []
        $.each(data, function (index, item) {
          chart_data.push({x: parseInt(index), y: item});
        })
        chart_data = _.sortBy(chart_data, function (o) {
          return o.x
        });
        var w = 1100;
        var h = 300;

        var graph = new Rickshaw.Graph({
          element: document.querySelector("#chart"),
          renderer: 'bar',
          width: w,
          height: h,
          series: [
            {
              name: 'Ordinances',
              data: chart_data,
              color: 'steelblue'
            }
          ]
        });

        var chart_svg = d3.select("#chart svg").attr("viewBox", "0 0 " + w + " " + h)
            .attr("preserveAspectRatio", "xMinYMin");

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
        });

        var yAxis = new Rickshaw.Graph.Axis.Y({
          graph: graph,
          orientation: 'left',
          element: document.getElementById('y_axis'),
        });

        yAxis.render();

        var hoverDetail = new Rickshaw.Graph.HoverDetail({
          graph: graph,
          formatter: function (series, x, y) {
            var d = new Date(x * 1000)
            var date = '<span class="date">' + (d.getMonth() + 1) + '/' + d.getFullYear() + '</span>';
            var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
            var content = swatch + series.name + ": " + parseInt(y) + '<br>' + date;
            return content;
          }
        });
        graph.render();
        xAxis.render();
        xAxis2.render();
        // set up events for the over
        var selectedBar = false;
        $('div#chart svg').on('click', 'rect', function (event) {
          // do something here
          if (selectedBar) {
            $(selectedBar).attr('fill', 'steelblue');
          }
          if (selectedBar != this) {
            $(this).attr('fill', 'navy');
            selectedBar = this;
          } else {
            selectedBar = false;
          }
          var selectedDate = new Date(chart_data[$(this).index()].x * 1000);
          filterByDate(selectedDate.getMonth() + 1, selectedDate.getFullYear());
        });
      });
})();

function filterByDate(month, year) {
  month = month.toString().length == 1 ? '0' + month.toString() : month;
  var re = new RegExp(month + '/[0-9]{2}/' + year.toString().substr(2,2));
  $('td.date').each(function(i, obj){
    $(obj).parent().show();
    if(!$(obj).html().match(re)) {
      $(obj).parent().hide();
    }
  })
}