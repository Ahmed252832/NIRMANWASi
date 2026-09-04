<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['POST']);
api_require_role('employee');
api_require_csrf();
$conn = getConnection();
$employeeId = $_SESSION['emp_id'];
$bookingId = trim($_POST['bookingId'] ?? '');

if ($bookingId === '') {
    api_error(400, 'Booking ID is required.', 'validation_error');
}

$insertSql = "INSERT INTO Confirm_Allocation (Booking_id, Emp_id)
              SELECT b.Booking_id, :employee_id
              FROM Booking b
              WHERE b.Booking_id = :booking_id
                AND NOT EXISTS (
                    SELECT 1 FROM Confirm_Allocation ca WHERE ca.Booking_id = b.Booking_id
                )";
$insertStmt = oci_parse($conn, $insertSql);
oci_bind_by_name($insertStmt, ':employee_id', $employeeId);
oci_bind_by_name($insertStmt, ':booking_id', $bookingId);
if (!oci_execute($insertStmt, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    api_database_error($insertStmt, 'Employee allocation confirmation failed');
}
if (oci_num_rows($insertStmt) !== 1) {
    oci_rollback($conn);
    api_error(409, 'Booking was not found or is already confirmed.', 'invalid_state');
}

$bookingStmt = oci_parse($conn, "UPDATE Booking SET Booking_status = 'Confirmed'
                                 WHERE Booking_id = :booking_id");
oci_bind_by_name($bookingStmt, ':booking_id', $bookingId);
if (!oci_execute($bookingStmt, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    api_database_error($bookingStmt, 'Employee booking status update failed');
}

oci_commit($conn);
api_response(['success' => true, 'message' => 'Allocation confirmed successfully.']);
