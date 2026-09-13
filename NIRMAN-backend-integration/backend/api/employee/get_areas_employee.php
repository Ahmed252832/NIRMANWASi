<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET']);
api_require_role('employee');
$conn = getConnection();
api_require_employee_feature($conn, 'tenders');

$stmt = oci_parse($conn, "SELECT Area_id, Boundary_info, House_no, Road_sector, Latitude, Longitude
                          FROM Area ORDER BY Area_id");
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Employee area list failed');
}

$areas = [];
while ($row = oci_fetch_assoc($stmt)) {
    $areas[] = $row;
}
api_response($areas);
