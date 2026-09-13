<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET']);
api_require_role('client');
$conn = getConnection();
$clId = $_SESSION['role_id'];

$sql = "SELECT b.Booking_id, b.Cl_id, b.Unit_id, b.Project_id, b.Booking_status,
               TO_CHAR(b.Booking_date, 'YYYY-MM-DD') AS Booking_date, b.Due_amount,
               u.Unit_no, u.Unit_type, cp.Project_name,
               CASE WHEN ca.Booking_id IS NULL THEN 'Pending confirmation'
                    ELSE 'Confirmed' END AS Allocation_status,
               ca.Emp_id AS Confirmed_by_Emp_id,
               ep.First_Name AS Confirmer_First_Name,
               ep.Last_Name AS Confirmer_Last_Name
        FROM Booking b
        JOIN Flats_Units u ON b.Unit_id = u.Unit_id
        JOIN Construction_Project cp ON cp.Project_id = b.Project_id
        LEFT JOIN Confirm_Allocation ca ON ca.Booking_id = b.Booking_id
        LEFT JOIN Employee e ON e.Emp_id = ca.Emp_id
        LEFT JOIN Person ep ON ep.Person_id = e.Person_id
        WHERE b.Cl_id = :p_cl_id
        ORDER BY b.Booking_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_cl_id', $clId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Client booking list failed');
}

$bookings = [];
while ($row = oci_fetch_assoc($stmt)) {
    $bookings[] = $row;
}

api_response($bookings);
