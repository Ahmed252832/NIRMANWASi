<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
api_bootstrap(['GET']);
api_require_role('admin');
$conn = getConnection();

$sql = "SELECT a.Area_id, a.House_No, a.Road_Sector, a.Boundary_info, a.Latitude, a.Longitude,
               cp.Project_id, cp.Project_name
        FROM Area a
        LEFT JOIN Construction_Project cp ON cp.Area_id = a.Area_id
        ORDER BY a.Area_id";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Admin portfolio area list failed');
}
$rows = [];
while ($row = oci_fetch_assoc($stmt)) {
    $rows[] = $row;
}
api_response($rows);
