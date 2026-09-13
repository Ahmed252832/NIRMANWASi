<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'contractor') {
    echo json_encode(['success' => false, 'message' => 'You must be logged in as a Contractor Representative.']);
    exit;
}
$repId = $_SESSION['role_id'];

$projectId = trim($_POST['projectId'] ?? '');
$updateDate = trim($_POST['updateDate'] ?? '');
$progress = trim($_POST['progress'] ?? '');
$workNote = trim($_POST['workNote'] ?? '');

if ($projectId === '' || $updateDate === '' || $progress === '' || $workNote === '') {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}
if (!is_numeric($progress) || $progress < 0 || $progress > 100) {
    echo json_encode(['success' => false, 'message' => 'Progress must be between 0 and 100.']);
    exit;
}

$sql = "SELECT cp.Project_id
        FROM Tender_Bids tb
        JOIN Tender_Award ta ON ta.Tender_id = tb.Tender_id AND ta.Bid_id = tb.Bid_id
        JOIN Construction_Project cp ON cp.Award_id = ta.Award_id
        WHERE tb.Rep_id = :p_rep_id AND cp.Project_id = :p_project_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_rep_id', $repId);
oci_bind_by_name($stmt, ':p_project_id', $projectId);
oci_execute($stmt);
if (!oci_fetch_assoc($stmt)) {
    echo json_encode(['success' => false, 'message' => 'That project is not linked to your awarded bids.']);
    exit;
}

$sql = "SELECT NVL(MAX(TO_NUMBER(REGEXP_REPLACE(Update_id, '[^0-9]', ''))), 0) + 1 AS next_num
        FROM Project_Update WHERE Project_id = :p_project_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_project_id', $projectId);
oci_execute($stmt);
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
    $e = oci_error($stmt);
    echo json_encode(['success' => false, 'message' => 'Could not add update: ' . $e['message']]);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Project update added successfully.', 'updateId' => $updateId]);
