<?php

/* Include Confugration Files */
include_once dirname(__FILE__) . '/../../res/php/common.inc.php';
include_once dirname(__FILE__) . '/../columns.config.php';

$trips = array();	/* Printed trips */
$user = auth();
if (empty($user)) {
	die('Not logged in.');
}

/* Fetch schedule for the specified date */
if (isset($_REQUEST['date'])) {
	$sql = "SELECT * FROM `trips` WHERE recycled <> 'true' AND `date`='" . mysql_real_escape_string($_REQUEST['date']) . "' OR
										 (`date` IS NULL AND NOT FIND_IN_SET('" . mysql_real_escape_string($_REQUEST['date']) . "', `exclude`))
			ORDER BY `time` ASC";

	$result = mysql_query($sql, $connection);

	if ($result) {
		while ($row = mysql_fetch_assoc($result)) {
			$trips[] = $row;
		}
	}

	$filter = isset($_REQUEST['columns']) ? $_REQUEST['columns'] : array();

	/* Generate Print columns */
	gen_print_columns($trips, $filter);

	/* Render template */
	ob_start();
	include_once dirname(__FILE__) . '/print-trips.tpl';
	$trips_table = ob_get_clean();

	$json = array();
	$json['trips_table'] = $trips_table;
	$json['title'] = date('F jS, Y', strtotime($_REQUEST['date']));
	$json['prev_date'] = date('Y-m-d', strtotime('-1 day', strtotime($_REQUEST['date'])));
	$json['next_date'] = date('Y-m-d', strtotime('+1 day', strtotime($_REQUEST['date'])));

	echo json_encode($json);
}

