<?php

/* Include Confugration Files */
include_once dirname(__FILE__) . '/../res/php/common.inc.php';
include_once dirname(__FILE__) . '/columns.config.php';

$trips = array();	/* Printed trips */
$user = auth();
if (empty($user)) {
	die('Not logged in.');
}

/* Print title */
if (isset($_REQUEST['date'])) {
	$timestamp = strtotime($_REQUEST['date']);
	$print_title = date('F jS, Y', $timestamp);

	/* Next/previous dates */
	$next_trip = date('Y-m-d', strtotime('+1 day', $timestamp));
	$prev_trip = date('Y-m-d', strtotime('-1 day', $timestamp));
}

/* Render template */
include_once dirname(__FILE__) . '/index.tpl';