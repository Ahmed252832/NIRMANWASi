<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'You must be logged in as Admin.']);
    exit;
}

$bookingId = trim($_POST['bookingId'] ?? '');
$empId = trim($_POST['empId'] ?? '');

if ($bookingId === '' || $empId === '') {
    echo json_encode(['success' => false, 'message' => 'Choose a booking and a confirming employee.']);
    exit;
}

$sql = "SELECT COUNT(*) AS CNT FROM Confirm_Allocation WHERE Booking_id = :p_booking_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_booking_id', $bookingId);
oci_execute($stmt);
$row = oci_fetch_assoc($stmt);
if ($row['CNT'] > 0) {
    echo json_encode(['success' => false, 'message' => 'This booking is already confirmed.']);
    exit;
}

$sql = "INSERT INTO Confirm_Allocation (Booking_id, Emp_id) VALUES (:p_booking_id, :p_emp_id)";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_booking_id', $bookingId);
oci_bind_by_name($stmt, ':p_emp_id', $empId);

if (!oci_execute($stmt, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    $e = oci_error($stmt);
    echo json_encode(['success' => false, 'message' => 'Could not confirm allocation: ' . $e['message']]);
    exit;
}

$sql = "UPDATE Booking SET Booking_status = 'Confirmed' WHERE Booking_id = :p_booking_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_booking_id', $bookingId);

if (!oci_execute($stmt, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    $e = oci_error($stmt);
    echo json_encode(['success' => false, 'message' => 'Could not update booking status: ' . $e['message']]);
    exit;
}

oci_commit($conn);
echo json_encode(['success' => true, 'message' => 'Allocation confirmed successfully.']);
