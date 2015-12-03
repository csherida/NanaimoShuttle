<?php

/* Include Confugration File */
include_once dirname(__FILE__) . '/common.inc.php';

$json['errors'] = array();

if (empty($_REQUEST['trip_id'])) {
    $json['errors'][] = 'You must provide the old default trip ID.';
}

if (empty($_REQUEST['effective_date'])) {
    $json['errors'][] = 'You must select an efective date for this change.';
}

if (empty($_REQUEST['time'])) {
    $json['errors'][] = 'You must select a new time for this default trip.';
}

//if (empty($_REQUEST['address'])) {
//    $json['errors'][] = 'Please provide a pickup location for this trip.';
//}

if (empty($json['errors'])) {
	
    $query = "CALL ChangeDefaultTime("
           . mysql_real_escape_string($_REQUEST['trip_id']) . ", "
           . "'" . mysql_real_escape_string($_REQUEST['time']) . "', "
           . "'" . mysql_real_escape_string($_REQUEST['effective_date']) . "')";
	
           
    if (mysql_query($query)) {

        $json['message'] = 'Default trip has successfully been added.';
//
//        $trip_id = mysql_insert_id();
//
//        $trip_table = 'trips';
//        $select = mysql_query("SELECT * FROM $trip_table WHERE recycled <> 'true' AND id = '" . $trip_id . "'");
//        $record = mysql_fetch_assoc($select);
//
//        $record['timestamp'] = $record['date'] . ' ' . $record['time'];
//
//        $json['record']  = $record;
//
//    } else {
//
//        $json['errors'][] = 'Error occurred, please try again.';
//
    }

}

die(json_encode($json));

?>