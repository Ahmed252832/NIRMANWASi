<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['POST']);
api_require_role('employee');
api_require_csrf();
$conn = getConnection();
$employeeId = $_SESSION['emp_id'];
$complaintId = trim($_POST['complaintId'] ?? '');
$resolution = trim($_POST['resolution'] ?? '');

if ($complaintId === '' || strlen($resolution) < 10 || strlen($resolution) > 500) {
    api_error(400, 'Complaint ID and a resolution of 10 to 500 characters are required.', 'validation_error');
}

$sql = "UPDATE Complaints
        SET Status = 'Resolved', Resolution = :resolution
        WHERE Complaint_id = :complaint_id
          AND Resolved_by_Emp_id = :employee_id
          AND Status <> 'Resolved'";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':resolution', $resolution);
oci_bind_by_name($stmt, ':complaint_id', $complaintId);
oci_bind_by_name($stmt, ':employee_id', $employeeId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Employee complaint resolution failed');
}
if (oci_num_rows($stmt) !== 1) {
    api_error(409, 'Assigned complaint was not found or is already resolved.', 'invalid_state');
}

api_response(['success' => true, 'message' => 'Complaint resolved successfully.']);
