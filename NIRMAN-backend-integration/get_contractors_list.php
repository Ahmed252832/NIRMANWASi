<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$sql = "SELECT Contractor_id, Company_name FROM Contractor ORDER BY Contractor_id";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);

$contractors = [];
while ($row = oci_fetch_assoc($stmt)) {
    $contractors[] = $row;
}

echo json_encode($contractors);
