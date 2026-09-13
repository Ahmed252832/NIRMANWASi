<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$sql = "SELECT Unit_id, Unit_no, Unit_type, Status FROM Flats_Units WHERE Status = 'Available' ORDER BY Unit_id";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);

$units = [];
while ($row = oci_fetch_assoc($stmt)) {
    $units[] = $row;
}

echo json_encode($units);
