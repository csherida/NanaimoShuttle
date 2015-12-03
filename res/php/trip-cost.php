<?php

/* Include Confugration File */
include_once dirname(__FILE__) . '/common.inc.php';

$json = array();
$json['cost'] = 0;

if ( !empty( $_REQUEST['passengers'] ) && is_numeric( $_REQUEST['passengers'] ) && !empty( $_REQUEST['address'] ) ) {
	# Calculate cost!
	$sql = "SELECT `rate` FROM `streets` WHERE `name` LIKE '" . mysql_real_escape_string( $_REQUEST['address'] ) . "%'";
	$rate = mysql_query( $sql );
	
	if ( $rate ) {
		# Found rate for this street
		$street_cost = mysql_fetch_assoc( $rate );
		$extra_passengers = $_REQUEST['passengers'] > 1 ? $_REQUEST['passengers'] - 1 : 0;
		$extra_charge = $extra_passengers * 5;
		
		$final_rate = $street_cost['rate'] + $extra_charge;
		$json['cost'] = $final_rate;
	}
}

echo json_encode( $json );