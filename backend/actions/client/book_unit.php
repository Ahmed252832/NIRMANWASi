<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['POST']);
api_require_role('client');
api_require_csrf();
$conn = getConnection();
$clId = $_SESSION['role_id'];

$projectId = trim($_POST['projectId'] ?? '');
$unitId = trim($_POST['unitId'] ?? '');
$bookingDate = trim($_POST['bookingDate'] ?? '');
$dueAmount = trim($_POST['dueAmount'] ?? '');

if ($projectId === '' || $unitId === '' || $bookingDate === '' || $dueAmount === '') {
    api_error(400, 'All booking fields are required.', 'validation_error');
}
if (!api_is_iso_date($bookingDate) || !is_numeric($dueAmount) || (float)$dueAmount <= 0) {
    api_error(400, 'Enter a valid booking date and a positive due amount.', 'validation_error');
}

$projectStmt = oci_parse($conn, "SELECT Project_id FROM Construction_Project WHERE Project_id = :project_id");
oci_bind_by_name($projectStmt, ':project_id', $projectId);
if (!oci_execute($projectStmt)) {
    api_database_error($projectStmt, 'Booking project lookup failed');
}
if (!oci_fetch_assoc($projectStmt)) {
    api_error(404, 'Selected project was not found.', 'project_not_found');
}

$sql = "SELECT Unit_id FROM Flats_Units u
        WHERE u.Unit_id = :p_unit_id
          AND u.Status = 'Available'
          AND NOT EXISTS (SELECT 1 FROM Booking b WHERE b.Unit_id = u.Unit_id)";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_unit_id', $unitId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Unit availability lookup failed');
}
$unit = oci_fetch_assoc($stmt);

if (!$unit) {
    api_error(409, 'This unit is no longer available.', 'unit_unavailable');
}

// Generate next Booking_id (e.g. B0001)
$sql = "SELECT NVL(MAX(TO_NUMBER(REGEXP_REPLACE(Booking_id, '[^0-9]', ''))), 0) + 1 AS next_num FROM Booking";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Booking ID generation failed');
}
$row = oci_fetch_assoc($stmt);
$bookingId = 'B' . str_pad($row['NEXT_NUM'], 4, '0', STR_PAD_LEFT);

// Insert booking
$sql = "INSERT INTO Booking (Booking_id, Cl_id, Unit_id, Project_id, Booking_status, Booking_date, Due_amount)
    VALUES (:bid, :clid, :p_unit_id, :pid, 'Pending', TO_DATE(:bdate, 'YYYY-MM-DD'), :amount)";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':bid', $bookingId);
oci_bind_by_name($stmt, ':clid', $clId);
oci_bind_by_name($stmt, ':p_unit_id', $unitId);
oci_bind_by_name($stmt, ':pid', $projectId);
oci_bind_by_name($stmt, ':bdate', $bookingDate);
oci_bind_by_name($stmt, ':amount', $dueAmount);

if (!oci_execute($stmt, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    api_database_error($stmt, 'Booking creation failed');
}

// Mark unit as booked so it can't be double-booked
$sql = "UPDATE Flats_Units SET Status = 'Booked'
        WHERE Unit_id = :p_unit_id AND Status = 'Available'";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_unit_id', $unitId);

if (!oci_execute($stmt, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    api_database_error($stmt, 'Unit status update failed');
}
if (oci_num_rows($stmt) !== 1) {
    oci_rollback($conn);
    api_error(409, 'This unit is no longer available.', 'unit_unavailable');
}

oci_commit($conn);
api_response(['success' => true, 'message' => 'Booking created successfully.', 'bookingId' => $bookingId]);
