<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
api_bootstrap(['GET']);
api_require_role('admin');
$conn = getConnection();

$sql = "SELECT cp.Project_id, cp.Award_id, cp.Area_id, cp.Project_Budget, cp.Project_name,
               TO_CHAR(cp.Deadline, 'YYYY-MM-DD') AS Deadline, cp.Status,
               a.House_No, a.Road_Sector
        FROM Construction_Project cp
        JOIN Area a ON a.Area_id = cp.Area_id
        ORDER BY cp.Project_id";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Admin portfolio project list failed');
}
$projects = [];
while ($row = oci_fetch_assoc($stmt)) {
    $sql2 = "SELECT Progress_percent FROM (
                SELECT Progress_percent FROM Project_Update
                WHERE Project_id = :p_project_id
                ORDER BY Update_date DESC, Update_id DESC
             ) WHERE ROWNUM = 1";
    $stmt2 = oci_parse($conn, $sql2);
    oci_bind_by_name($stmt2, ':p_project_id', $row['PROJECT_ID']);
    if (!oci_execute($stmt2)) {
        api_database_error($stmt2, 'Admin latest project progress failed');
    }
    $progressRow = oci_fetch_assoc($stmt2);
    $row['LATEST_PROGRESS'] = $progressRow ? $progressRow['PROGRESS_PERCENT'] : 0;
    $projects[] = $row;
}
api_response($projects);
