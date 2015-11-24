
$(document).ready(function() {
	$("#prev-trips,#next-trips").click(function() {
		loadTripsForDate($(this).attr('href'));
		return false;
	});

	$("#print").click(function(){
		window.print();
		return false;
	});

	$("#columns-form").submit(function() {
		loadTripsForDate(load_date);
		return false;
	});

	$("#filter-columns").click(function() {
		$.fn.colorbox({
			inline: true,
			href: '#columns',
			overlayClose: false,
			onClosed: function() {
				$("#columns-form").submit();
			}
		});
		return false;
	});

	/* Fetch trips */
	$("#columns-form").submit();
});

function loadTripsForDate(timeframe) {
	$("#trip-date").val(timeframe)
	if ($("#throbber").css('display') == 'none') $("#throbber").show();
	$("#print-trips").hide();

	$.getJSON('ajax/print-trips.php', $("#columns-form").serialize(), function(data) {
		load_date = timeframe;

		if (!data) {
			alert('Failed to retrieve records!');
			return;
		}

		$("#print-trips").html(data.trips_table);
		$("#prev-trips").attr('href', data.prev_date);
		$("#next-trips").attr('href', data.next_date);
		$("#print-title").html(data.title);
		document.title = data.title + ' - Print';

		if ($("#buttons").css('display') == 'none') $("#buttons").fadeIn();
		$("#throbber").hide();
		$("#print-trips").show();
	});
}