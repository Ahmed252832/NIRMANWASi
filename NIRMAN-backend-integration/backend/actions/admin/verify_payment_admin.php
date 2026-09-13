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

$requireAssignment = 0;
$rowsUpdated = 0;
$sql = "BEGIN
            verify_payment_proc(
                :p_cl_id,
                :p_payment_id,
                :p_emp_id,
                :require_assignment,
                :rows_updated
            );
        END;";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_emp_id', $empId);
oci_bind_by_name($stmt, ':p_cl_id', $clId);
oci_bind_by_name($stmt, ':p_payment_id', $paymentId);
oci_bind_by_name($stmt, ':require_assignment', $requireAssignment);
oci_bind_by_name($stmt, ':rows_updated', $rowsUpdated, -1, SQLT_INT);

if (!oci_execute($stmt, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    api_database_error($stmt, 'Payment verification failed');
}

if ((int)$rowsUpdated !== 1) {
    oci_rollback($conn);
    api_error(409, 'Payment was not found or is no longer pending.', 'invalid_state');
}

oci_commit($conn);
api_response(['success' => true, 'message' => 'Payment verified successfully.']);
