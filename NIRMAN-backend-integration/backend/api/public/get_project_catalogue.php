<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET'], false);
$conn = getConnection();

$sql = "SELECT cp.Project_id, cp.Project_name, cp.Status,
               TO_CHAR(cp.Deadline, 'YYYY-MM-DD') AS Deadline,
               a.Area_id, a.House_no, a.Road_sector, a.Boundary_info,
               a.Latitude, a.Longitude,
               NVL(MAX(pu.Progress_percent) KEEP
                   (DENSE_RANK LAST ORDER BY pu.Update_date, pu.Update_id), 0) AS Current_progress,
               TO_CHAR(MAX(pu.Update_date), 'YYYY-MM-DD') AS Last_update_date
        FROM Construction_Project cp
        JOIN Area a ON a.Area_id = cp.Area_id
        LEFT JOIN Project_Update pu ON pu.Project_id = cp.Project_id
        GROUP BY cp.Project_id, cp.Project_name, cp.Status, cp.Deadline,
                 a.Area_id, a.House_no, a.Road_sector, a.Boundary_info,
                 a.Latitude, a.Longitude
        ORDER BY cp.Project_id";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Public project catalogue query failed');
}

$projects = [];
while ($row = oci_fetch_assoc($stmt)) {
    $projects[] = $row;
}
api_response($projects);
