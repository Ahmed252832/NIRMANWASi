<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['POST']);
api_require_role('admin');
api_require_csrf();
$conn = getConnection();

$bookingId = trim($_POST['bookingId'] ?? '');
$empId = $_SESSION['emp_id'];

if ($bookingId === '') {
    api_error(400, 'Booking ID is required.', 'validation_error');
}

$sql = "INSERT INTO Confirm_Allocation (Booking_id, Emp_id)
        SELECT b.Booking_id, :p_emp_id
        FROM Booking b
        WHERE b.Booking_id = :p_booking_id
          AND NOT EXISTS (
              SELECT 1 FROM Confirm_Allocation ca WHERE ca.Booking_id = b.Booking_id
          )";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_booking_id', $bookingId);
oci_bind_by_name($stmt, ':p_emp_id', $empId);

if (!oci_execute($stmt, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    api_database_error($stmt, 'Allocation confirmation failed');
}
if (oci_num_rows($stmt) !== 1) {
    oci_rollback($conn);
    api_error(409, 'Booking was not found or is already confirmed.', 'invalid_state');
}

$sql = "UPDATE Booking SET Booking_status = 'Confirmed' WHERE Booking_id = :p_booking_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_booking_id', $bookingId);

if (!oci_execute($stmt, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    api_database_error($stmt, 'Booking status update failed');
}

oci_commit($conn);
api_response(['success' => true, 'message' => 'Allocation confirmed successfully.']);
