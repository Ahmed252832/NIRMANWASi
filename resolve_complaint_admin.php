<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'You must be logged in as Admin.']);
    exit;
}

$complaintId = trim($_POST['complaintId'] ?? '');
$empId = trim($_POST['empId'] ?? '');
$resolution = trim($_POST['resolution'] ?? '');

if ($complaintId === '' || $empId === '' || strlen($resolution) < 10) {
    echo json_encode(['success' => false, 'message' => 'Choose an employee and enter at least 10 characters of resolution.']);
    exit;
}

$sql = "SELECT Status FROM Complaints WHERE Complaint_id = :p_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_id', $complaintId);
oci_execute($stmt);
$row = oci_fetch_assoc($stmt);

if (!$row) {
    echo json_encode(['success' => false, 'message' => 'Complaint not found.']);
    exit;
}
if ($row['STATUS'] === 'Resolved') {
    echo json_encode(['success' => false, 'message' => 'This complaint is already resolved.']);
    exit;
}

$sql = "UPDATE Complaints
        SET Status = 'Resolved', Resolution = :p_resolution, Resolved_by_Emp_id = :p_emp_id
        WHERE Complaint_id = :p_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_resolution', $resolution);
oci_bind_by_name($stmt, ':p_emp_id', $empId);
oci_bind_by_name($stmt, ':p_id', $complaintId);

if (!oci_execute($stmt)) {
    $e = oci_error($stmt);
    echo json_encode(['success' => false, 'message' => 'Could not resolve complaint: ' . $e['message']]);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Complaint resolved successfully.']);
