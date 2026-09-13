<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'client') {
    echo json_encode([]);
    exit;
}
$clId = $_SESSION['role_id'];

$sql = "SELECT b.Booking_id, b.Due_amount, u.Unit_no
        FROM Booking b
        JOIN Flats_Units u ON b.Unit_id = u.Unit_id
        WHERE b.Cl_id = :p_cl_id
        ORDER BY b.Booking_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_cl_id', $clId);
oci_execute($stmt);

$bookings = [];
while ($row = oci_fetch_assoc($stmt)) {
    $bookings[] = $row;
}

echo json_encode($bookings);
