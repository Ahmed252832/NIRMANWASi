<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['POST']);
api_require_role('client');
api_require_csrf();
$conn = getConnection();
$clId = $_SESSION['role_id'];

$filedDate = trim($_POST['filedDate'] ?? '');
$note = trim($_POST['note'] ?? '');

if (!api_is_iso_date($filedDate) || strlen($note) < 10 || strlen($note) > 500) {
    api_error(400, 'A valid filed date and a note of 10 to 500 characters are required.', 'validation_error');
}

$sql = "SELECT Emp_id FROM (
            SELECT Emp_id FROM Employee
            WHERE Dept_name = 'Client Services'
            ORDER BY Emp_id
        ) WHERE ROWNUM = 1";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Complaint assignee lookup failed');
}
$emp = oci_fetch_assoc($stmt);

if (!$emp) {
    api_error(409, 'No Client Services employee is available for this complaint.', 'assignee_unavailable');
}
$empId = $emp['EMP_ID'];

// Generate next Complaint_id
$sql = "SELECT NVL(MAX(TO_NUMBER(REGEXP_REPLACE(Complaint_id, '[^0-9]', ''))), 0) + 1 AS next_num FROM Complaints";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Complaint ID generation failed');
}
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
    api_database_error($stmt, 'Complaint submission failed');
}

oci_commit($conn);
api_response(['success' => true, 'message' => 'Complaint submitted successfully.', 'complaintId' => $complaintId]);
