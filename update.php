<?php

/**
 * This updates the old trips table format to the new address format (apt, house, street)
 */

if ( $_SERVER['REMOTE_ADDR'] != '70.66.70.30' ) {
	die;
}

$connection = mysql_connect('localhost', 'nanaimos_airport', 'f&hjk1dA#') or die ("database connection error");
mysql_select_db('nanaimos_airporter', $connection) or die("database selection error");
    
$sql = "SELECT * FROM `trips`";
$trips = mysql_query( $sql );

if ( $trips ) {
	$output = null;
	$count = 0;
	
	while ( $trip = mysql_fetch_assoc( $trips ) ) {
		$sql = "INSERT INTO `trips_new` 
						VALUES ('" . mysql_real_escape_string( $trip['id'] ) . "', 
								'" . mysql_real_escape_string( $trip['date'] ) . "',
								'" . mysql_real_escape_string( $trip['time'] ) . "',
								'" . mysql_real_escape_string( $trip['cid'] ) . "',
								'" . mysql_real_escape_string( $trip['name'] ) . "',
								'" . mysql_real_escape_string( $trip['passengers'] ) . "',
								'" . mysql_real_escape_string( $trip['driver'] ) . "',
								'" . mysql_real_escape_string( $trip['sent'] ) . "',
								'" . mysql_real_escape_string( $trip['phone'] ) . "',
								'" . mysql_real_escape_string( $trip['cost'] ) . "',";
		
		if ( substr( $trip['address'], 0, 1 ) == '#' || stristr( $trip['address'], '-' ) ) {
			# Includes apartment number!
			$num = split( '-', $trip['address'] );
			$num[0] = str_replace( '#', null, $num[0] );
			
			//var_dump( $trip['address'] ) . "\n";
			
			if ( count( $num ) == 1 ) {
				$s = split( ' ', ltrim( $num[0] ) );
				
				$addr_apt = trim( $s[0] );
				$addr_num = trim( $s[1] );
				$addr_street = trim( substr( $num[0], strlen( $s[0] ) + strlen( $s[1] ) ) );
			} elseif ( count( $num ) == 2 ) {
				$s = split( ' ', ltrim( $num[1] ) );
				
				$addr_apt = trim( $num[0] );
				$addr_num = trim( $s[0] );
				$addr_street = trim( substr( $num[1], strlen( $num[0] ) + strlen( $s[0] ) ) );
			}
			
			if ( is_numeric( $addr_apt ) && is_numeric( $addr_num ) ) {
				$set_extra = "'" . mysql_real_escape_string( $addr_apt ) . "', '" . mysql_real_escape_string( $addr_num ) . "', '" . mysql_real_escape_string( $addr_street ) . "',";
				
				//$output .= "APT + NUM: " . $addr_apt . " - " . $addr_num . " - " . $addr_street . "\n\n";
				$count++;
			} else {
				$set_extra = "NULL, NULL, '" . mysql_real_escape_string( $addr_street ) . "',";
				
				//$output .= "NOT FOUND: " . $trip['address'] . "\n\n";
				$count++;
			}
		} else {
			$addr = split( ' ', $trip['address'] );
			
			if ( is_numeric( $addr[0] ) ) {
				$addr_num = trim( $addr[0] );
				$addr_street = ltrim( substr( $trip['address'], strlen( $addr[0] ) ) );
				
				$set_extra = "NULL, '" . mysql_real_escape_string( $addr_num ) . "', '" . mysql_real_escape_string( $addr_street ) . "',";
				
				//$output .= "NUM: " . $addr_num . " - " . $addr_street . "\n\n";
				$count++;
			} else {
				$set_extra = "NULL, NULL, '" . mysql_real_escape_string( $trip['address'] ) . "',";
				
				//$output .= "STREET: " . $trip['address'] . " [" . $trip['id'] . "]\n\n";
				$count++;
			}
			//echo "NUM: " . $addr_num . "-" . $addr_street . "\n\n";
		}
		
		$sql .= $set_extra;
		$sql .= "'" . mysql_real_escape_string( $trip['destination'] ) . "', '" . mysql_real_escape_string( $trip['comments'] ) . "', '" . mysql_real_escape_string( $trip['colour'] ) . "', '" . mysql_real_escape_string( $trip['exclude'] ) . "')"; 
	
		$output .= $sql . "\n\n";
		
		if ( !mysql_query( $sql ) ) {
			echo "Failed: " . $sql . " - " . mysql_error() . "\n\n";
		}
	}
	
	//file_put_contents( "addr.txt", $output );
}