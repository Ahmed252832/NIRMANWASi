<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$tenderId = $_POST['tenderId'];
$empId = $_POST['empId'];
$deadline = $_POST['deadline'];
$status = $_POST['status'];
$title = $_POST['title'];
$bidDetails = $_POST['bidDetails'];

$checkStmt = oci_parse($conn, "SELECT COUNT(*) AS CNT FROM Tenders WHERE Tender_id = :tid");
oci_bind_by_name($checkStmt, ':tid', $tenderId);
oci_execute($checkStmt);
if (oci_fetch_assoc($checkStmt)['CNT'] > 0) {
    echo json_encode(['success' => false, 'message' => 'Tender ID already exists.']);
    exit;
}

$sql = "INSERT INTO Tenders (Tender_id, Emp_id, Deadline, Title, Bid_Details, Status)
        VALUES (:tid, :empId, TO_DATE(:deadline, 'YYYY-MM-DD'), :title, :bidDetails, :status)";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':tid', $tenderId);
oci_bind_by_name($stmt, ':empId', $empId);
oci_bind_by_name($stmt, ':deadline', $deadline);
oci_bind_by_name($stmt, ':title', $title);
oci_bind_by_name($stmt, ':bidDetails', $bidDetails);
oci_bind_by_name($stmt, ':status', $status);

if (!oci_execute($stmt)) {
    $e = oci_error($stmt);
    echo json_encode(['success' => false, 'message' => 'Could not publish tender: ' . $e['message']]);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Tender published successfully.']);
