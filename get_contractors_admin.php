<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$sql = "SELECT c.Contractor_id, c.Company_name, c.License_no, c.License_due
        FROM Contractor c ORDER BY c.Contractor_id";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);
$contractors = [];
while ($row = oci_fetch_assoc($stmt)) {
    $contractors[] = $row;
}
echo json_encode($contractors);
