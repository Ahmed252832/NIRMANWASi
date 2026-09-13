<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'You must be logged in as Admin.']);
    exit;
}

$repId = trim($_POST['repId'] ?? '');
if ($repId === '') {
    echo json_encode(['success' => false, 'message' => 'Representative ID is required.']);
    exit;
}

$sql = "UPDATE Contractor_Rep SET Approval_status = 'Approved' WHERE Rep_id = :p_rep_id AND Approval_status = 'Pending'";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_rep_id', $repId);

if (!oci_execute($stmt)) {
    $e = oci_error($stmt);
    echo json_encode(['success' => false, 'message' => 'Could not approve representative: ' . $e['message']]);
    exit;
}

if (oci_num_rows($stmt) === 0) {
    echo json_encode(['success' => false, 'message' => 'Representative not found or already approved.']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Representative approved successfully.']);
