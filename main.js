(function() {
	$.getJSON('data/data.json', function(json_data){
	    var table_obj = $('#ordinance-list');
	    $.each(json_data, function(index, item){
	         var table_row = $('<tr>', {id: item.fileno});
	         var date = $('<td>', {html: item.date});
	         var ordno = $('<td>', {html: item.ordno});
	         var fileno = $('<td>', {html: item.fileno});
	         var desc = $('<td>', {html: item.desc});
	         table_row.append(date).append(ordno).append(fileno).append(desc);
	         table_obj.append(table_row);
	    })

	})
})();

