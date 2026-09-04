<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET'], false);
$conn = getConnection();

$sql = "SELECT u.Unit_id, u.Unit_no, u.Unit_type, u.Status
        FROM Flats_Units u
        WHERE u.Status = 'Available'
          AND NOT EXISTS (SELECT 1 FROM Booking b WHERE b.Unit_id = u.Unit_id)
        ORDER BY u.Unit_id";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Available unit list failed');
}

$units = [];
while ($row = oci_fetch_assoc($stmt)) {
    $units[] = $row;
}

api_response($units);
