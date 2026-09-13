<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
require_once __DIR__ . '/../../lib/policy.php';

api_bootstrap(['POST']);
api_require_role('client');
api_require_csrf();
$conn = getConnection();
$clId = $_SESSION['role_id'];

$bookingId = trim($_POST['bookingId'] ?? '');
$method = trim($_POST['method'] ?? '');
$amount = trim($_POST['amount'] ?? '');
$paymentDue = trim($_POST['paymentDue'] ?? '');

$validMethods = ['Bank Transfer', 'Card', 'Cash', 'Installment Plan'];
if ($bookingId === '' || !in_array($method, $validMethods) || $amount === '' || $paymentDue === '') {
    api_error(400, 'All payment fields are required and must be valid.', 'validation_error');
}
if (!is_numeric($amount) || (float)$amount <= 0 || !api_is_iso_date($paymentDue)) {
    api_error(400, 'Enter a positive payment amount and a valid due date.', 'validation_error');
}
if (!policy_client_owns_booking($conn, $clId, $bookingId)) {
    api_error(404, 'Booking was not found.', 'booking_not_found');
}

$sql = "SELECT Emp_id FROM (
            SELECT Emp_id FROM Employee
            WHERE Dept_name = 'Finance'
            ORDER BY Emp_id
        ) WHERE ROWNUM = 1";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Payment verifier lookup failed');
}
$emp = oci_fetch_assoc($stmt);
if (!$emp) {
    api_error(409, 'No Finance employee is available to verify this payment.', 'verifier_unavailable');
}
$empId = $emp['EMP_ID'];

// Generate next Payment_id scoped to this client (composite PK is Cl_id + Payment_id)
$sql = "SELECT NVL(MAX(TO_NUMBER(REGEXP_REPLACE(Payment_id, '[^0-9]', ''))), 0) + 1 AS next_num
        FROM Payments WHERE Cl_id = :p_cl_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_cl_id', $clId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Payment ID generation failed');
}
$row = oci_fetch_assoc($stmt);
$paymentId = 'P' . str_pad($row['NEXT_NUM'], 3, '0', STR_PAD_LEFT);

$sql = "INSERT INTO Payments (Cl_id, Payment_id, Booking_id, Verified_by_Emp_id, Payment_status, Verified_at, Payment_method, Amount, Payment_due)
        VALUES (:p_cl_id, :p_payment_id, :p_booking_id, :p_emp_id, 'Pending', NULL, :p_method, :p_amount, TO_DATE(:p_due, 'YYYY-MM-DD'))";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_cl_id', $clId);
oci_bind_by_name($stmt, ':p_payment_id', $paymentId);
oci_bind_by_name($stmt, ':p_booking_id', $bookingId);
oci_bind_by_name($stmt, ':p_emp_id', $empId);
oci_bind_by_name($stmt, ':p_method', $method);
oci_bind_by_name($stmt, ':p_amount', $amount);
oci_bind_by_name($stmt, ':p_due', $paymentDue);

if (!oci_execute($stmt, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    api_database_error($stmt, 'Payment submission failed');
}

oci_commit($conn);
api_response(['success' => true, 'message' => 'Payment submitted successfully.', 'paymentId' => $paymentId]);
