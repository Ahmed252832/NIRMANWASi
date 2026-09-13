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

$projectId = trim($_POST['projectId'] ?? '');
$unitId = trim($_POST['unitId'] ?? '');
$bookingDate = trim($_POST['bookingDate'] ?? '');
$dueAmount = trim($_POST['dueAmount'] ?? '');

if ($projectId === '' || $unitId === '' || $bookingDate === '' || $dueAmount === '') {
    echo json_encode(['success' => false, 'message' => 'All booking fields are required.']);
    exit;
}

// Confirm unit is actually available right now
$sql = "SELECT Status FROM Flats_Units WHERE Unit_id = :p_unit_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_unit_id', $unitId);
oci_execute($stmt);
$unit = oci_fetch_assoc($stmt);

if (!$unit) {
    echo json_encode(['success' => false, 'message' => 'Selected unit does not exist.']);
    exit;
}

if ($unit['STATUS'] !== 'Available') {
    oci_rollback($conn);
    echo json_encode(['success' => false, 'message' => 'This unit is no longer available.']);
    exit;
}

// Generate next Booking_id (e.g. B0001)
$sql = "SELECT NVL(MAX(TO_NUMBER(REGEXP_REPLACE(Booking_id, '[^0-9]', ''))), 0) + 1 AS next_num FROM Booking";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);
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
    $e = oci_error($stmt);
    echo json_encode(['success' => false, 'message' => 'Could not create booking: ' . $e['message']]);
    exit;
}

// Mark unit as booked so it can't be double-booked
$sql = "UPDATE Flats_Units SET Status = 'Booked' WHERE Unit_id = :p_unit_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_unit_id', $unitId);

if (!oci_execute($stmt, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    $e = oci_error($stmt);
    echo json_encode(['success' => false, 'message' => 'Could not update unit status: ' . $e['message']]);
    exit;
}

oci_commit($conn);
echo json_encode(['success' => true, 'message' => 'Booking created successfully.', 'bookingId' => $bookingId]);