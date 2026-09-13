<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
api_bootstrap(['GET']);
api_require_role('admin');
$conn = getConnection();

$sql = "SELECT pu.Project_id, pu.Update_id, pu.Rep_id,
               TO_CHAR(pu.Update_date, 'YYYY-MM-DD') AS Update_date,
               pu.Work_note, pu.Progress_percent,
               cp.Project_name,
               p.First_Name, p.Last_Name
        FROM Project_Update pu
        JOIN Construction_Project cp ON cp.Project_id = pu.Project_id
        JOIN Contractor_Rep cr ON cr.Rep_id = pu.Rep_id
        JOIN Person p ON p.Person_id = cr.Person_id
        ORDER BY pu.Project_id, pu.Update_id";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Admin portfolio update list failed');
}
$rows = [];
while ($row = oci_fetch_assoc($stmt)) {
    $rows[] = $row;
}
api_response($rows);
