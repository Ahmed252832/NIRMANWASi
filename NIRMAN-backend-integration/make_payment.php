<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'client') {
    echo json_encode(['success' => false, 'message' => 'You must be logged in as a Client.']);
    exit;
}
$clId = $_SESSION['role_id'];

$bookingId = trim($_POST['bookingId'] ?? '');
$method = trim($_POST['method'] ?? '');
$amount = trim($_POST['amount'] ?? '');
$paymentDue = trim($_POST['paymentDue'] ?? '');

$validMethods = ['Bank Transfer', 'Card', 'Cash', 'Installment Plan'];
if ($bookingId === '' || !in_array($method, $validMethods) || $amount === '' || $paymentDue === '') {
    echo json_encode(['success' => false, 'message' => 'All payment fields are required and must be valid.']);
    exit;
}

// Confirm this booking really belongs to the logged-in client
$sql = "SELECT Booking_id FROM Booking WHERE Booking_id = :p_booking_id AND Cl_id = :p_cl_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_booking_id', $bookingId);
oci_bind_by_name($stmt, ':p_cl_id', $clId);
oci_execute($stmt);
if (!oci_fetch_assoc($stmt)) {
    echo json_encode(['success' => false, 'message' => 'That booking does not belong to your account.']);
    exit;
}

// Placeholder: auto-assign any existing employee as verifier until real verification flow exists
$sql = "SELECT Emp_id FROM Employee WHERE ROWNUM = 1 ORDER BY Emp_id";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);
$emp = oci_fetch_assoc($stmt);
if (!$emp) {
    echo json_encode(['success' => false, 'message' => 'No employee exists yet to verify this payment.']);
    exit;
}
$empId = $emp['EMP_ID'];

// Generate next Payment_id scoped to this client (composite PK is Cl_id + Payment_id)
$sql = "SELECT NVL(MAX(TO_NUMBER(REGEXP_REPLACE(Payment_id, '[^0-9]', ''))), 0) + 1 AS next_num
        FROM Payments WHERE Cl_id = :p_cl_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_cl_id', $clId);
oci_execute($stmt);
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
    $e = oci_error($stmt);
    echo json_encode(['success' => false, 'message' => 'Could not submit payment: ' . $e['message']]);
    exit;
}

oci_commit($conn);
echo json_encode(['success' => true, 'message' => 'Payment submitted successfully.', 'paymentId' => $paymentId]);
