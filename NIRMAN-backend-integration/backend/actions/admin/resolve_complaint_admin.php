<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['POST']);
api_require_role('admin');
api_require_csrf();
$conn = getConnection();

$complaintId = trim($_POST['complaintId'] ?? '');
$empId = $_SESSION['emp_id'];
$resolution = trim($_POST['resolution'] ?? '');

// Server-side validation
if (strlen(trim($resolution)) < 10 || strlen($resolution) > 500) {
    api_error(400, 'Resolution must be between 10 and 500 characters.', 'validation_error');
}
if ($complaintId === '') {
    api_error(400, 'Complaint ID is required.', 'validation_error');
}

$sql = "UPDATE Complaints
        SET Status = 'Resolved', Resolution = :res, Resolved_by_Emp_id = :emp
        WHERE Complaint_id = :id AND Status <> 'Resolved'";
$stmt = oci_parse($conn, $sql);

oci_bind_by_name($stmt, ":id", $complaintId);
oci_bind_by_name($stmt, ":res", $resolution);
oci_bind_by_name($stmt, ":emp", $empId);

if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Complaint resolution failed');
}
if (oci_num_rows($stmt) !== 1) {
    api_error(409, 'Complaint was not found or is already resolved.', 'invalid_state');
}

api_response([
    "success" => true,
    "message" => "Complaint resolved successfully."
]);
