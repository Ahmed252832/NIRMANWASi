<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$sql = "SELECT a.Area_id, a.House_No, a.Road_Sector, a.Boundary_info, a.Latitude, a.Longitude,
               cp.Project_id, cp.Project_name
        FROM Area a
        LEFT JOIN Construction_Project cp ON cp.Area_id = a.Area_id
        ORDER BY a.Area_id";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);
$rows = [];
while ($row = oci_fetch_assoc($stmt)) {
    $rows[] = $row;
}
echo json_encode($rows);
