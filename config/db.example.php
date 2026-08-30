<?php
function getConnection() {
    $username = "SYSTEM";
    $password = "YOUR_PASSWORD_HERE";
    $connection_string = "localhost/XE";
    return oci_connect($username, $password, $connection_string);
}