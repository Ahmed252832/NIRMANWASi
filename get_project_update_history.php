<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$projectId = trim($_GET['projectId'] ?? '');
if ($projectId === '') {
    echo json_encode([]);
    exit;
}

$sql = "SELECT pu.Update_id, pu.Update_date, pu.Work_note, pu.Progress_percent, pu.Rep_id,
               p.First_Name, p.Last_Name
        FROM Project_Update pu
        JOIN Contractor_Rep cr ON cr.Rep_id = pu.Rep_id
        JOIN Person p ON p.Person_id = cr.Person_id
        WHERE pu.Project_id = :p_project_id
        ORDER BY pu.Update_date DESC, pu.Update_id DESC";

$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_project_id', $projectId);
oci_execute($stmt);

$updates = [];
while ($row = oci_fetch_assoc($stmt)) {
    $updates[] = $row;
}

echo json_encode($updates);
