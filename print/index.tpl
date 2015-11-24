<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
<title><?=$print_title;?> - Print</title>
<link href="./css/print.css?v1" rel="stylesheet" type="text/css" media="screen" />
<link href="./css/print.css?v1" rel="stylesheet" type="text/css" media="print" />
<link href="./css/colorbox.css" rel="stylesheet" type="text/css" media="screen" />

<script src="http://www.google.com/jsapi"></script>
<script type="text/javascript">
	google.load("jquery", "1.4.2");
	var load_date = '<?=$_REQUEST['date'];?>';
</script>

<script type="text/javascript" src="./js/jquery.colorbox-min.js"></script>
<script type="text/javascript" src="./js/print.js"></script>

</head>

<body>

<h3 id="print-title"><?=$print_title;?></h3>

<div id="buttons" style="display: none;">
	<a class="slkbutton" id="prev-trips" href="<?=$prev_trip;?>"><</a>
	<a class="slkbutton" id="print" href="#print">Print</a>
	<a class="slkbutton" id="filter-columns" href="#columns">Columns...</a>
	<a class="slkbutton" id="next-trips" href="<?=$next_trip;?>">></a>
</div>

<br />
<img id="throbber" src="img/loading.gif" />
<div id="print-trips"></div>

<div style="display: none;">
	<div id="columns">
		<p>Select the columns to display:</p>
		<form action="<?=$_SERVER['REQUEST_URI'];?>" id="columns-form" method="POST">
			<ul class="list-columns">
				<?php foreach (get_print_columns(true) as $column): ?>
					<li><label><input type="checkbox" name="columns[]" value="<?=$column;?>" checked="checked" /><?=$column;?></label></li>
				<?php endforeach; ?>
			</ul>

			<input type="hidden" name="date" id="trip-date" value="<?=$_REQUEST['date'];?>" />
		</form>
	</div>
</div>

</body>

</html>
