<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$sql = "SELECT Area_id, Boundary_info, House_no, Road_sector, Latitude, Longitude
        FROM Area
        ORDER BY Area_id";

$stmt = oci_parse($conn, $sql);
oci_execute($stmt);

$areas = [];
while ($row = oci_fetch_assoc($stmt)) {
    $areas[] = $row;
}

echo json_encode($areas);
