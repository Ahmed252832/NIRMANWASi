<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['POST']);
api_require_role('employee');
api_require_csrf();
$conn = getConnection();

$tenderId = trim($_POST['tenderId'] ?? '');
$empId = $_SESSION['emp_id'];
$deadline = trim($_POST['deadline'] ?? '');
$title = trim($_POST['title'] ?? '');
$bidDetails = trim($_POST['bidDetails'] ?? '');
$task = trim($_POST['task'] ?? '');

if ($tenderId === '' || $title === '' || $bidDetails === '' || $task === '' || !api_is_iso_date($deadline)) {
    api_error(400, 'Tender ID, title, task, deadline, and bid details are required.', 'validation_error');
}
if (!preg_match('/^[A-Za-z0-9-]{1,10}$/', $tenderId)
    || strlen($title) > 100 || strlen($task) > 150 || strlen($bidDetails) > 500) {
    api_error(400, 'Tender fields exceed the database limits or the ID format is invalid.', 'validation_error');
}
if ($deadline < date('Y-m-d')) {
    api_error(400, 'Tender deadline cannot be in the past.', 'validation_error');
}

$checkStmt = oci_parse($conn, "SELECT COUNT(*) AS CNT FROM Tenders WHERE Tender_id = :tid");
oci_bind_by_name($checkStmt, ':tid', $tenderId);
if (!oci_execute($checkStmt)) {
    api_database_error($checkStmt, 'Tender duplicate check failed');
}
if (oci_fetch_assoc($checkStmt)['CNT'] > 0) {
    api_error(409, 'Tender ID already exists.', 'duplicate_tender');
}

$sql = "INSERT INTO Tenders (Tender_id, Emp_id, Deadline, Day, Title, Bid_Details, Status, Task)
        VALUES (:tid, :empId, TO_DATE(:deadline, 'YYYY-MM-DD'), TRUNC(SYSDATE),
                :title, :bidDetails, 'Published', :task)";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':tid', $tenderId);
oci_bind_by_name($stmt, ':empId', $empId);
oci_bind_by_name($stmt, ':deadline', $deadline);
oci_bind_by_name($stmt, ':title', $title);
oci_bind_by_name($stmt, ':bidDetails', $bidDetails);
oci_bind_by_name($stmt, ':task', $task);

if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Tender publication failed');
}

api_response(['success' => true, 'message' => 'Tender published successfully.']);
