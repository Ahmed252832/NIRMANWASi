<?php
require_once 'config/db.php';
$conn = getConnection();

$sql = "SELECT Project_id, Project_name, Status FROM Construction_Project";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);

$projects = [];
while ($row = oci_fetch_assoc($stmt)) {
    $projects[] = $row;
}

header('Content-Type: application/json');
echo json_encode($projects);