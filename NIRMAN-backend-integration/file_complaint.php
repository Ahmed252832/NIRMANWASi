<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'client') {
    echo json_encode(['success' => false, 'message' => 'You must be logged in as a Client.']);
    exit;
}
$clId = $_SESSION['role_id'];

$filedDate = trim($_POST['filedDate'] ?? '');
$note = trim($_POST['note'] ?? '');

if ($filedDate === '' || strlen($note) < 10 || strlen($note) > 500) {
    echo json_encode(['success' => false, 'message' => 'A valid filed date and a note (10-500 chars) are required.']);
    exit;
}

// Placeholder: auto-assign any existing employee until real assignment/routing exists
$sql = "SELECT Emp_id FROM Employee WHERE ROWNUM = 1 ORDER BY Emp_id";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);
$emp = oci_fetch_assoc($stmt);

if (!$emp) {
    echo json_encode(['success' => false, 'message' => 'No employee exists yet to assign this complaint to.']);
    exit;
}
$empId = $emp['EMP_ID'];

// Generate next Complaint_id
$sql = "SELECT NVL(MAX(TO_NUMBER(REGEXP_REPLACE(Complaint_id, '[^0-9]', ''))), 0) + 1 AS next_num FROM Complaints";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);
$row = oci_fetch_assoc($stmt);
$complaintId = 'CP' . str_pad($row['NEXT_NUM'], 4, '0', STR_PAD_LEFT);

$sql = "INSERT INTO Complaints (Complaint_id, Cl_id, Resolved_by_Emp_id, Status, Filed_date, Note, Resolution)
        VALUES (:cid, :clid, :empid, 'Pending', TO_DATE(:fdate, 'YYYY-MM-DD'), :note, NULL)";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':cid', $complaintId);
oci_bind_by_name($stmt, ':clid', $clId);
oci_bind_by_name($stmt, ':empid', $empId);
oci_bind_by_name($stmt, ':fdate', $filedDate);
oci_bind_by_name($stmt, ':note', $note);

if (!oci_execute($stmt, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    $e = oci_error($stmt);
    echo json_encode(['success' => false, 'message' => 'Could not file complaint: ' . $e['message']]);
    exit;
}

oci_commit($conn);
echo json_encode(['success' => true, 'message' => 'Complaint submitted successfully.', 'complaintId' => $complaintId]);