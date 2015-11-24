<?php

    /**
     * Start Session
     */
    @session_start();

    ini_set('memory_limit', '512M');
    
    /**
     * Establish Database Connection
     */
    $connection = mysql_connect('localhost', 'nanaimo8_airport', 'P@ssw0rd') or die ("database connection error");
    mysql_select_db('nanaimo8_airporter', $connection) or die("database selection error");

    /**
     * Authentication Function
     *
     * @return boolean
     */
    function auth() {
        global $_SESSION;
        /* Check Session Auth Token */
        if (!empty($_SESSION['authuser'])) {
            /* Extract Auth Information */
            list ($username, $password) = explode("-", $_SESSION['authuser']);
            /* Select Row */
            $result = mysql_query("SELECT * FROM `users` WHERE MD5(`username`) = '" . mysql_real_escape_string($username) . "' AND MD5(`password`) = '" . mysql_real_escape_string($password) . "'");
            $row = mysql_fetch_array($result);
            /* Check Row */
            if (!empty($row)) {
                /* Success */
                return $row;
                //return true;
            } else {
                /* Unset Token */
                unset($_SESSION['authuser']);
                /* Error */
                return false;
            }
        } else {
            /* Error */
            return false;
        }
    }

?>