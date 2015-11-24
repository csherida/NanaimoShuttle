<?php

/* Include Confugration File */
include_once dirname(__FILE__) . '/common.inc.php';

$date   = $_REQUEST['date'];
$filter = $_REQUEST['filter'];

$where = "";
$search = array();
if (is_array($filter)) {
	for ($i = 0; $i < count($filter); $i++) {
	    $search[] = $filter[$i]['field'];
		switch($filter[$i]['data']['type']) {
			case 'string' : $qs .= " AND `" . $filter[$i]['field'] . "` LIKE '%" . $filter[$i]['data']['value'] . "%'"; break;
			case 'list' :
				if (strstr($filter[$i]['data']['value'],',')) {
					$fi = explode(',',$filter[$i]['data']['value']);
					for ($q = 0; $q < count($fi); $q++) {
						$fi[$q] = "'" . $fi[$q] . "'";
					}
					$filter[$i]['data']['value'] = implode(',', $fi);
					$qs .= " AND `" . $filter[$i]['field'] . "` IN (" . $filter[$i]['data']['value'] . ")";
				} else {
					$qs .= " AND `" . $filter[$i]['field'] . "` = '" . $filter[$i]['data']['value'] . "'";
				}
			break;
			case 'boolean' : $qs .= " AND `" . $filter[$i]['field'] . "` = '" . ($filter[$i]['data']['value']) . "'"; break;
			case 'numeric' :
				switch ($filter[$i]['data']['comparison']) {
					case 'eq' : $qs .= " AND `" . $filter[$i]['field'] . "` = " . $filter[$i]['data']['value']; break;
					case 'lt' : $qs .= " AND `" . $filter[$i]['field'] . "` < " . $filter[$i]['data']['value']; break;
					case 'gt' : $qs .= " AND `" . $filter[$i]['field'] . "` > " . $filter[$i]['data']['value']; break;
				}
			break;
			case 'date' :
				switch ($filter[$i]['data']['comparison']) {
					case 'eq' : $qs .= " AND `" . $filter[$i]['field'] . "` = '" . date('Y-m-d', strtotime($filter[$i]['data']['value'])) . "'"; break;
					case 'lt' : $qs .= " AND `" . $filter[$i]['field'] . "` < '" . date('Y-m-d', strtotime($filter[$i]['data']['value'])) . "'"; break;
					case 'gt' : $qs .= " AND `" . $filter[$i]['field'] . "` > '" . date('Y-m-d', strtotime($filter[$i]['data']['value'])) . "'"; break;
				}
			break;
		}
	}
	$where .= $qs;
} else {
    $where .= "(`date` = '" . $date . "' OR (`date` IS NULL AND NOT FIND_IN_SET('" . $date . "', `exclude`)))";
}

//if (in_array('date', $search)) {
//    $query = "SELECT * FROM trips WHERE " . trim($where, " AND");
//} else {
//    $query = "SELECT * FROM trips WHERE (`date` = '" . $date . "' OR (`date` IS NULL AND NOT FIND_IN_SET('" . $date . "', `exclude`)))" . $where;
//}

$table = 'trips';
$query = "SELECT * FROM $table WHERE " . trim($where, " AND");

$json['query'] = $query;

$select_trips = mysql_query($query);
while ($trips = mysql_fetch_assoc($select_trips)) {
    $trips['date']      = !empty($trips['date']) ? $trips['date'] : $_REQUEST['date'];
    $trips['timestamp'] = $trips['date'] . ' ' . $trips['time'];
    $json['trips'][] = $trips;
}

die(json_encode($json));

?>