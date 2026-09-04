<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
api_bootstrap(['GET']);
api_require_role('admin');
$conn = getConnection();

$sql = "SELECT c.Contractor_id, c.Company_name, c.License_no,
               TO_CHAR(c.License_due, 'YYYY-MM-DD') AS License_due
        FROM Contractor c ORDER BY c.Contractor_id";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Admin contractor list failed');
}
$contractors = [];
while ($row = oci_fetch_assoc($stmt)) {
    $contractors[] = $row;
}
api_response($contractors);
