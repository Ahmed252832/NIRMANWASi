<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
require_once __DIR__ . '/../../lib/policy.php';

api_bootstrap(['POST']);
api_require_role('contractor');
api_require_csrf();
$conn = getConnection();
$repId = $_SESSION['role_id'];
policy_require_approved_representative($conn, $repId);

$projectId = trim($_POST['projectId'] ?? '');
$updateDate = trim($_POST['updateDate'] ?? '');
$progress = trim($_POST['progress'] ?? '');
$workNote = trim($_POST['workNote'] ?? '');

if ($projectId === '' || $updateDate === '' || $progress === '' || $workNote === '') {
    api_error(400, 'All fields are required.', 'validation_error');
}
if (!is_numeric($progress) || $progress < 0 || $progress > 100) {
    api_error(400, 'Progress must be between 0 and 100.', 'validation_error');
}
if (!api_is_iso_date($updateDate) || strlen($workNote) > 500) {
    api_error(400, 'Enter a valid update date and a note no longer than 500 characters.', 'validation_error');
}

if (!policy_representative_can_access_project($conn, $repId, $projectId)) {
    api_error(404, 'Project was not found.', 'project_not_found');
}

$sql = "SELECT NVL(MAX(TO_NUMBER(REGEXP_REPLACE(Update_id, '[^0-9]', ''))), 0) + 1 AS next_num
        FROM Project_Update WHERE Project_id = :p_project_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_project_id', $projectId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Project update ID generation failed');
}
$row = oci_fetch_assoc($stmt);
$updateId = 'U' . str_pad($row['NEXT_NUM'], 3, '0', STR_PAD_LEFT);

$sql = "INSERT INTO Project_Update (Project_id, Update_id, Rep_id, Update_date, Work_note, Progress_percent)
        VALUES (:p_project_id, :p_update_id, :p_rep_id, TO_DATE(:p_date, 'YYYY-MM-DD'), :p_note, :p_progress)";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_project_id', $projectId);
oci_bind_by_name($stmt, ':p_update_id', $updateId);
oci_bind_by_name($stmt, ':p_rep_id', $repId);
oci_bind_by_name($stmt, ':p_date', $updateDate);
oci_bind_by_name($stmt, ':p_note', $workNote);
oci_bind_by_name($stmt, ':p_progress', $progress);

if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Project update submission failed');
}

api_response(['success' => true, 'message' => 'Project update added successfully.', 'updateId' => $updateId]);
