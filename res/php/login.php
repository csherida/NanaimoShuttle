<?php

/* Include Confugration File */
include_once dirname(__FILE__) . '/common.inc.php';

/* Error Collection */
$json['errors'] = array();

/* Require Username */
if (empty($_REQUEST['username'])) {
    $json['errors'][] = 'Username is a required field.';
}

/* Require Password */
if (empty($_REQUEST['password'])) {
    $json['errors'][] = 'Password is a required field.';
}

/* Check Errors */
if (empty($json['errors'])) {

    /* Check Row */
    $result = mysql_query("SELECT * FROM `users` WHERE
                            `username` = '" . mysql_real_escape_string($_REQUEST['username']) . "' AND
                            `password` = '" . mysql_real_escape_string($_REQUEST['password']) . "'");
    $row = mysql_fetch_array($result);

    if (!empty($row)) {

        /* Success */
        $json['message'] = 'You have successfully been logged in.';

        /* Store Session Auth Token */
        $_SESSION['authuser'] = md5($_REQUEST['username']) . '-' . md5($_REQUEST['password']);

    } else {

        /* Error */
        $json['errors'][] = 'Authentication Failed.';

    }

}

die(json_encode($json));

?>