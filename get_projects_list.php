<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$sql = "SELECT Project_id, Project_name FROM Construction_Project ORDER BY Project_id";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);

$projects = [];
while ($row = oci_fetch_assoc($stmt)) {
    $projects[] = $row;
}

echo json_encode($projects);
