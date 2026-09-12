<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['POST']);
api_require_role('employee');
api_require_csrf();
$conn = getConnection();
api_require_employee_feature($conn, 'payments');
$employeeId = $_SESSION['emp_id'];
$clientId = trim($_POST['clId'] ?? '');
$paymentId = trim($_POST['paymentId'] ?? '');

if ($clientId === '' || $paymentId === '') {
    api_error(400, 'Payment information is required.', 'validation_error');
}

$requireAssignment = 1;
$rowsUpdated = 0;
$sql = "BEGIN
            verify_payment_proc(
                :cl_id,
                :payment_id,
                :emp_id,
                :require_assignment,
                :rows_updated
            );
        END;";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':cl_id', $clientId);
oci_bind_by_name($stmt, ':payment_id', $paymentId);
oci_bind_by_name($stmt, ':emp_id', $employeeId);
oci_bind_by_name($stmt, ':require_assignment', $requireAssignment);
oci_bind_by_name($stmt, ':rows_updated', $rowsUpdated, -1, SQLT_INT);
if (!oci_execute($stmt, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    api_database_error($stmt, 'Employee payment verification failed');
}
if ((int)$rowsUpdated !== 1) {
    oci_rollback($conn);
    api_error(409, 'Assigned payment was not found or is no longer pending.', 'invalid_state');
}

oci_commit($conn);
api_response(['success' => true, 'message' => 'Payment verified successfully.']);
