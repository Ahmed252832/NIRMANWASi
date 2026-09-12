<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET'], false);
$conn = getConnection();

$sql = "SELECT Contractor_id, Company_name FROM Contractor ORDER BY Contractor_id";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Public contractor option list failed');
}

$contractors = [];
while ($row = oci_fetch_assoc($stmt)) {
    $contractors[] = $row;
}

api_response($contractors);
