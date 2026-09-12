<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
api_bootstrap(['GET']);
api_require_role('admin');
$conn = getConnection();

$sql = "SELECT *
        FROM admin_payments
        ORDER BY Cl_id, Payment_id";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Admin payment list failed');
}
$rows = [];
while ($row = oci_fetch_assoc($stmt)) {
    $rows[] = $row;
}
api_response($rows);
