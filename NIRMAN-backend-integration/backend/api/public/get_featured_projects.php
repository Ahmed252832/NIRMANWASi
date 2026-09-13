<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET'], false);
$conn = getConnection();

$sql = "SELECT cp.Project_id, cp.Project_name,
               TO_CHAR(cp.Deadline, 'YYYY-MM-DD') AS Deadline, cp.Status,
               a.Road_Sector,
               NVL(MAX(pu.Progress_percent) KEEP
                   (DENSE_RANK LAST ORDER BY pu.Update_date, pu.Update_id), 0) AS Progress
        FROM Construction_Project cp
        JOIN Area a ON cp.Area_id = a.Area_id
        LEFT JOIN Project_Update pu ON cp.Project_id = pu.Project_id
        GROUP BY cp.Project_id, cp.Project_name, cp.Deadline, cp.Status, a.Road_Sector
        ORDER BY cp.Project_id";

$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Featured project list failed');
}

$projects = [];
while ($row = oci_fetch_assoc($stmt)) {
    $projects[] = $row;
}

api_response($projects);
