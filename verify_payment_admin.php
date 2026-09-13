<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'You must be logged in as Admin.']);
    exit;
}

$clId = trim($_POST['clId'] ?? '');
$paymentId = trim($_POST['paymentId'] ?? '');
$empId = trim($_POST['empId'] ?? '');

if ($clId === '' || $paymentId === '' || $empId === '') {
    echo json_encode(['success' => false, 'message' => 'Missing payment or employee information.']);
    exit;
}

$sql = "SELECT Payment_status FROM Payments WHERE Cl_id = :p_cl_id AND Payment_id = :p_payment_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_cl_id', $clId);
oci_bind_by_name($stmt, ':p_payment_id', $paymentId);
oci_execute($stmt);
$row = oci_fetch_assoc($stmt);

if (!$row) {
    echo json_encode(['success' => false, 'message' => 'Payment not found.']);
    exit;
}
if ($row['PAYMENT_STATUS'] !== 'Pending') {
    echo json_encode(['success' => false, 'message' => 'Only a Pending payment can be verified.']);
    exit;
}

$sql = "UPDATE Payments
        SET Payment_status = 'Verified', Verified_by_Emp_id = :p_emp_id, Verified_at = SYSDATE
        WHERE Cl_id = :p_cl_id AND Payment_id = :p_payment_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_emp_id', $empId);
oci_bind_by_name($stmt, ':p_cl_id', $clId);
oci_bind_by_name($stmt, ':p_payment_id', $paymentId);

if (!oci_execute($stmt)) {
    $e = oci_error($stmt);
    echo json_encode(['success' => false, 'message' => 'Could not verify payment: ' . $e['message']]);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Payment verified successfully.']);
