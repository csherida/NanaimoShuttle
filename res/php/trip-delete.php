<?php

/* Include Confugration File */
include_once dirname(__FILE__) . '/common.inc.php';

$json['errors'] = array();

if (empty($_REQUEST['id'])) {
    $json['errors'][] = 'Please select the trip you would like to remove.';
}

$table = 'trips';
$select_trip = mysql_query("SELECT * FROM $table WHERE id = '" . mysql_real_escape_string($_REQUEST['id']) . "'");
$trip = mysql_fetch_array($select_trip);

if (empty($trip)) {
    $json['errors'][] = 'The selected trip could not be found.';
}

if (empty($json['errors'])) {

    if (!empty($trip['date'])) {

        $query = "DELETE FROM $table WHERE recycled <> 'true' AND id  = '" . mysql_real_escape_string($_REQUEST['id']) . "'";

    } else {

        $query = "UPDATE $table SET exclude = TRIM(BOTH ',' FROM CONCAT(exclude, ',', '" . mysql_real_escape_string($_REQUEST['date']) . "', ',')) WHERE NOT FIND_IN_SET(exclude, '" . mysql_real_escape_string($_REQUEST['date']) . "') AND id = '" . mysql_real_escape_string($_REQUEST['id']) . "'";

    }

    if (mysql_query($query)) {

        $json['message'] = 'Trip has successfully been removed.';

    } else {

        $json['errors'][] = 'Error occurred, please try again.';

    }

}

die(json_encode($json));

?>