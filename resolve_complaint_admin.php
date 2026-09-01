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

// Server-side validation
if (strlen(trim($resolution)) < 10 || strlen($resolution) > 500) {
    echo json_encode(['success' => false, 'message' => 'Resolution must be between 10 and 500 characters.']);
    exit;
}
if ($complaintId === '' || $empId === '') {
    echo json_encode(['success' => false, 'message' => 'Choose an employee and complaint before resolving.']);
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

$sql = "BEGIN resolve_complaint_proc(:id, :res, :emp); END;";

$stmt = oci_parse($conn, $sql);

oci_bind_by_name($stmt, ":id", $complaintId);
oci_bind_by_name($stmt, ":res", $resolution);
oci_bind_by_name($stmt, ":emp", $empId);

if (!oci_execute($stmt)) {

    $e = oci_error($stmt);

    echo json_encode([
        "success" => false,
        "message" => $e['message']
    ]);

    exit;
}

echo json_encode([
    "success" => true,
    "message" => "Complaint resolved successfully."
]);
