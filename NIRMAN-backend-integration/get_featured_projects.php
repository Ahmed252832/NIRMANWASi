<?php
require_once 'config/db.php';
$conn = getConnection();

$sql = "SELECT cp.Project_id, cp.Project_name, cp.Deadline, cp.Status,
               a.Road_Sector,
               MAX(pu.Progress_percent) AS Progress
        FROM Construction_Project cp
        JOIN Area a ON cp.Area_id = a.Area_id
        LEFT JOIN Project_Update pu ON cp.Project_id = pu.Project_id
        GROUP BY cp.Project_id, cp.Project_name, cp.Deadline, cp.Status, a.Road_Sector
        ORDER BY cp.Project_id";

$stmt = oci_parse($conn, $sql);
oci_execute($stmt);

$projects = [];
while ($row = oci_fetch_assoc($stmt)) {
    $projects[] = $row;
}

header('Content-Type: application/json');
echo json_encode($projects);