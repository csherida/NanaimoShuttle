<?php

/* Include Confugration File */
include_once dirname(__FILE__) . '/common.inc.php';

$json['errors'] = array();

$table = 'trips';
$select_trip = mysql_query("SELECT * FROM $table WHERE id = '" . mysql_real_escape_string($_REQUEST['id']) . "'");
$trip = mysql_fetch_array($select_trip);

if (empty($trip)) {
    $json['errors'][] = 'The selected trip could not be found.';
}

if (empty($json['errors'])) {

    if (!empty($trip['date'])) {

        $query  = "UPDATE $table SET `" . mysql_real_escape_string($_REQUEST['field']) . "` = '" . mysql_real_escape_string($_REQUEST['value']) . "'  WHERE id = '" . mysql_real_escape_string($_REQUEST['id']) . "'";
        $result = mysql_query($query) or die($query . mysql_error());
        $json['queries'][] = $query;

    } else {

        // default trip, create for date
        $address_fields = '`address_apt`, `address_num`, `address_street`';
        $query = "INSERT INTO $table (SELECT '' AS `id`, '" . mysql_real_escape_string($_REQUEST['date']) . "' AS `date`, `time`, `cid`, `name`, `passengers`, `driver`, `sent`, `phone`, `cost`, $address_fields, `destination`, `comments`, `colour`, '' FROM $table WHERE id = '" . mysql_real_escape_string($_REQUEST['id']) . "')";
        $result = mysql_query($query) or die($query . mysql_error());
        $json['queries'][] = $query;

        // update value
        $query = "UPDATE $table SET `" . mysql_real_escape_string($_REQUEST['field']) . "` = '" . mysql_real_escape_string($_REQUEST['value']) . "' WHERE id = '" . mysql_insert_id() . "'";
        $result = mysql_query($query) or die($query . mysql_error());
        $json['queries'][] = $query;

        // update default trip, exclude date
        $query = "UPDATE $table SET exclude = TRIM(BOTH ',' FROM CONCAT(exclude, ',', '" . mysql_real_escape_string($_REQUEST['date']) . "', ',')) WHERE NOT FIND_IN_SET('" . mysql_real_escape_string($_REQUEST['date']) . "', exclude) AND id = '" . mysql_real_escape_string($_REQUEST['id']) . "'";
        $result = mysql_query($query) or die($query . mysql_error());
        $json['queries'][] = $query;

        if ($_REQUEST['field'] == 'date') {
            // update default trip, exclude date
            $query = "UPDATE $table SET exclude = TRIM(BOTH ',' FROM CONCAT(exclude, ',', '" . mysql_real_escape_string($_REQUEST['value']) . "', ',')) WHERE NOT FIND_IN_SET('" . mysql_real_escape_string($_REQUEST['value']) . "', exclude) AND id = '" . mysql_real_escape_string($_REQUEST['id']) . "'";
            $result = mysql_query($query) or die($query . mysql_error());
            $json['queries'][] = $query;
        }

    }

    if ($result) {

        $json['message'] = 'Trip has successfully been updated.';

    } else {

        $json['errors'][] = 'Error occurred, please try again.';

    }

}

die(json_encode($json));

?>