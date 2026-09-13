<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$sql = "SELECT pu.Project_id, pu.Update_id, pu.Rep_id, pu.Update_date, pu.Work_note, pu.Progress_percent,
               cp.Project_name,
               p.First_Name, p.Last_Name
        FROM Project_Update pu
        JOIN Construction_Project cp ON cp.Project_id = pu.Project_id
        JOIN Contractor_Rep cr ON cr.Rep_id = pu.Rep_id
        JOIN Person p ON p.Person_id = cr.Person_id
        ORDER BY pu.Project_id, pu.Update_id";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);
$rows = [];
while ($row = oci_fetch_assoc($stmt)) {
    $rows[] = $row;
}
echo json_encode($rows);
