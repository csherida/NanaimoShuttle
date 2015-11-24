<?php

/**
 * Configuration file for columns that can be printed
 */

$_COLUMNS = array();
//$_COLUMNS['ID'] = array('db_column' => 'id');
$_COLUMNS['Date'] = array('db_column' => 'date');
$_COLUMNS['Time'] = array('db_column' => 'time');
$_COLUMNS['Sent'] = null;											/* Custom format */
$_COLUMNS['CID'] = array('db_column' => 'cid');
$_COLUMNS['Driver'] = array('db_column' => 'driver');
$_COLUMNS['Name'] = array('db_column' => 'name');
$_COLUMNS['#'] = array('db_column' => 'passengers');
$_COLUMNS['Address'] = null;										/* Custom format */
$_COLUMNS['Destination'] = array('db_column' => 'destination');
$_COLUMNS['Comments'] = array('db_column' => 'comments', 'nodisplay' => true);
$_COLUMNS['Phone'] = array('db_column' => 'phone');
$_COLUMNS['Cost'] = array('db_column' => 'cost');

function get_print_columns($force_all = false, $filter = array()) {
	global $_COLUMNS;
	$cols = array();

	foreach ($_COLUMNS as $name => $info) {
		if ((!isset($info['nodisplay']) || $info['nodisplay'] == false) || $force_all == true) {
			if (count($filter) > 0 && !in_array($name, $filter)) continue;

			$cols[] = $name;
		}
	}

	return $cols;
}

function gen_print_columns(&$trips, $filter = array()) {
	global $_COLUMNS;
	if (!is_array($trips)) return false;

	foreach ($trips as &$trip) {
		$trip['print_columns'] = array();
		foreach ($_COLUMNS as $display_name => $info) {
			if (count($filter) > 0 && !in_array($display_name, $filter)) continue;

			if (function_exists('format_' . $display_name)) {
				$trip['print_columns'][$display_name] = call_user_func('format_' . $display_name, $trip);
			} elseif (isset($info['db_column'])) {
				if (isset($trip[$info['db_column']])) {
					$trip['print_columns'][$display_name] = $trip[$info['db_column']];
				}
			}
		}
	}
}

function format_address($trip) {
	$address = null;

	if (!empty($trip['address_apt'])) {
		$address .= '#' . $trip['address_apt'] . '-';
	}

	if (!empty($trip['address_num'])) {
		$address .= $trip['address_num'] . ' ';
	}

	if (!empty($trip['address_street'])) {
		$address .= $trip['address_street'];
	}

	return trim($address);
}

function format_sent($trip) {
	return $trip['sent'] == 'true' ? 'Yes' : 'No';
}

function format_cost($trip) {
	return '$' . number_format($trip['cost'], 2);
}

function format_comments($trip) {
	return stripslashes($trip['comments']);
}

function format_date($trip) {
	return !empty($trip['date']) ? $trip['date'] : date('Y-m-d');
}