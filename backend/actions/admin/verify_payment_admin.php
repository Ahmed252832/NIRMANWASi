<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['POST']);
api_require_role('admin');
api_require_csrf();
$conn = getConnection();

$clId = trim($_POST['clId'] ?? '');
$paymentId = trim($_POST['paymentId'] ?? '');
$empId = $_SESSION['emp_id'];

if ($clId === '' || $paymentId === '') {
    api_error(400, 'Payment information is required.', 'validation_error');
}

$sql = "UPDATE Payments
        SET Payment_status = 'Verified', Verified_by_Emp_id = :p_emp_id, Verified_at = SYSDATE
        WHERE Cl_id = :p_cl_id AND Payment_id = :p_payment_id AND Payment_status = 'Pending'";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_emp_id', $empId);
oci_bind_by_name($stmt, ':p_cl_id', $clId);
oci_bind_by_name($stmt, ':p_payment_id', $paymentId);

if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Payment verification failed');
}

if (oci_num_rows($stmt) === 0) {
    api_error(409, 'Payment was not found or is no longer pending.', 'invalid_state');
}

api_response(['success' => true, 'message' => 'Payment verified successfully.']);
