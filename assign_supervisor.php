<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'You must be logged in as Admin.']);
    exit;
}

$empId = trim($_POST['empId'] ?? '');
$contractorId = trim($_POST['contractorId'] ?? '');

if ($empId === '' || $contractorId === '') {
    echo json_encode(['success' => false, 'message' => 'Choose an employee and a contractor.']);
    exit;
}

$sql = "SELECT COUNT(*) AS CNT FROM Supervises WHERE Emp_id = :p_emp_id AND Contractor_id = :p_contractor_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_emp_id', $empId);
oci_bind_by_name($stmt, ':p_contractor_id', $contractorId);
oci_execute($stmt);
$row = oci_fetch_assoc($stmt);

if ($row['CNT'] > 0) {
    echo json_encode(['success' => false, 'message' => 'That Employee-Contractor supervision pair already exists.']);
    exit;
}

$sql = "INSERT INTO Supervises (Emp_id, Contractor_id) VALUES (:p_emp_id, :p_contractor_id)";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_emp_id', $empId);
oci_bind_by_name($stmt, ':p_contractor_id', $contractorId);

if (!oci_execute($stmt)) {
    $e = oci_error($stmt);
    echo json_encode(['success' => false, 'message' => 'Could not create supervision: ' . $e['message']]);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Supervision assignment added successfully.']);
