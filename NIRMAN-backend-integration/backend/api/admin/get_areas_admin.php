<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
api_bootstrap(['GET']);
api_require_role('admin');
$conn = getConnection();

$sql = "SELECT Area_id, Boundary_info, House_no, Road_sector, Latitude, Longitude
        FROM Area
        ORDER BY Area_id";

$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Admin area list failed');
}

$areas = [];
while ($row = oci_fetch_assoc($stmt)) {
    $areas[] = $row;
}

api_response($areas);
