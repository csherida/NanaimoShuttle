<?php

/* Include Confugration File */
include_once dirname(__FILE__) . '/common.inc.php';

$table = 'trips';
$query = "SELECT id, time, name, address_street, destination FROM $table WHERE date IS NULL AND CURDATE() BETWEEN effective and expiration ORDER BY time DESC";

$json['query'] = $query;

$select_trips = mysql_query($query);
while ($trips = mysql_fetch_assoc($select_trips)) {
    //$trips['date']      = !empty($trips['date']) ? $trips['date'] : $_REQUEST['date'];
    //$trips['timestamp'] = $trips['date'] . ' ' . $trips['time'];
    $json['trips'][] = $trips;
}

die(json_encode($json));

?>