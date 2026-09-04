<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
require_once __DIR__ . '/../../lib/policy.php';

api_bootstrap(['GET']);
api_require_role('contractor');
$conn = getConnection();
$representativeId = $_SESSION['role_id'];
policy_require_approved_representative($conn, $representativeId);

$projectId = trim($_GET['projectId'] ?? '');
if ($projectId === '') {
    api_error(400, 'Project ID is required.', 'validation_error');
}

if (!policy_representative_can_access_project($conn, $representativeId, $projectId)) {
    api_error(404, 'Project was not found.', 'project_not_found');
}

$sql = "SELECT pu.Update_id, TO_CHAR(pu.Update_date, 'YYYY-MM-DD') AS Update_date,
               pu.Work_note, pu.Progress_percent, pu.Rep_id,
               p.First_Name, p.Last_Name
        FROM Project_Update pu
        JOIN Contractor_Rep cr ON cr.Rep_id = pu.Rep_id
        JOIN Person p ON p.Person_id = cr.Person_id
        WHERE pu.Project_id = :p_project_id
        ORDER BY pu.Update_date DESC, pu.Update_id DESC";

$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_project_id', $projectId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Project update history query failed');
}

$updates = [];
while ($row = oci_fetch_assoc($stmt)) {
    $updates[] = $row;
}

api_response($updates);
