<?php

/* Include Confugration File */
include_once dirname(__FILE__) . '/common.inc.php';

$json['errors'] = array();

if (empty($_REQUEST['date'])) {
    $json['errors'][] = 'You must select a date for this trip.';
}

if (empty($_REQUEST['time'])) {
    $json['errors'][] = 'You must select a time for this trip.';
}

//if (empty($_REQUEST['address'])) {
//    $json['errors'][] = 'Please provide a pickup location for this trip.';
//}

if (empty($json['errors'])) {
	
    $query = "INSERT INTO `trips` SET "
           . "date        = '" . mysql_real_escape_string($_REQUEST['date']) . "', "
           . "time        = '" . mysql_real_escape_string($_REQUEST['time']) . "', "
           . "cid         = '" . mysql_real_escape_string($_REQUEST['cid']) . "', "
           . "name        = '" . mysql_real_escape_string($_REQUEST['name']) . "', "
           . "passengers  = '" . mysql_real_escape_string($_REQUEST['passengers']) . "', "
           . "driver      = '" . mysql_real_escape_string($_REQUEST['driver']) . "', "
           . "phone       = '" . mysql_real_escape_string($_REQUEST['phone']) . "', "
           . "cost        = '" . mysql_real_escape_string($_REQUEST['cost']) . "', "
           . "address_apt = '" . mysql_real_escape_string($_REQUEST['address_apt']) . "', "
           . "address_num = '" . mysql_real_escape_string($_REQUEST['address_num']) . "', "
           . "address_street = '" . mysql_real_escape_string($_REQUEST['address']) . "', "
           . "destination = '" . mysql_real_escape_string($_REQUEST['destination']) . "', "
           . "comments    = '" . mysql_real_escape_string($_REQUEST['comments']) . "'";
	
    /**
     * Old Query
     */
    /*
    $query = "INSERT INTO `trips` SET "
           . "date        = '" . mysql_real_escape_string($_REQUEST['date']) . "', "
           . "time        = '" . mysql_real_escape_string($_REQUEST['time']) . "', "
           . "cid         = '" . mysql_real_escape_string($_REQUEST['cid']) . "', "
           . "name        = '" . mysql_real_escape_string($_REQUEST['name']) . "', "
           . "passengers  = '" . mysql_real_escape_string($_REQUEST['passengers']) . "', "
           . "driver      = '" . mysql_real_escape_string($_REQUEST['driver']) . "', "
           . "phone       = '" . mysql_real_escape_string($_REQUEST['phone']) . "', "
           . "cost        = '" . mysql_real_escape_string($_REQUEST['cost']) . "', "
           . "address     = '" . mysql_real_escape_string($_REQUEST['address']) . "', "
           . "destination = '" . mysql_real_escape_string($_REQUEST['destination']) . "', "
           . "comments    = '" . mysql_real_escape_string($_REQUEST['comments']) . "'";
	*/
           
    if (mysql_query($query)) {

        $json['message'] = 'Trip has successfully been added.';

        $trip_id = mysql_insert_id();

        $trip_table = 'trips';
        $select = mysql_query("SELECT * FROM $trip_table WHERE id = '" . $trip_id . "'");
        $record = mysql_fetch_assoc($select);

        $record['timestamp'] = $record['date'] . ' ' . $record['time'];

        $json['record']  = $record;

    } else {

        $json['errors'][] = 'Error occurred, please try again.';

    }

}

die(json_encode($json));

?>