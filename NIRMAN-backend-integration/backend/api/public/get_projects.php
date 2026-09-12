<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET'], false);
$conn = getConnection();

$sql = "SELECT Project_id, Project_name, Status FROM Construction_Project";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Public project list failed');
}

$projects = [];
while ($row = oci_fetch_assoc($stmt)) {
    $projects[] = $row;
}

api_response($projects);
