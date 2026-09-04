<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['POST']);
api_require_role('employee');
api_require_csrf();
$conn = getConnection();
$employeeId = $_SESSION['emp_id'];
$clientId = trim($_POST['clId'] ?? '');
$paymentId = trim($_POST['paymentId'] ?? '');

if ($clientId === '' || $paymentId === '') {
    api_error(400, 'Payment information is required.', 'validation_error');
}

$sql = "UPDATE Payments
        SET Payment_status = 'Verified', Verified_at = SYSDATE
        WHERE Cl_id = :client_id
          AND Payment_id = :payment_id
          AND Verified_by_Emp_id = :employee_id
          AND Payment_status = 'Pending'";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':client_id', $clientId);
oci_bind_by_name($stmt, ':payment_id', $paymentId);
oci_bind_by_name($stmt, ':employee_id', $employeeId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Employee payment verification failed');
}
if (oci_num_rows($stmt) !== 1) {
    api_error(409, 'Assigned payment was not found or is no longer pending.', 'invalid_state');
}

api_response(['success' => true, 'message' => 'Payment verified successfully.']);
