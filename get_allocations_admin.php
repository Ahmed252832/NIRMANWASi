<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$sql = "SELECT b.Booking_id, b.Cl_id, b.Unit_id, b.Project_id, b.Booking_status, b.Booking_date, b.Due_amount,
               p.First_Name, p.Last_Name,
               u.Unit_no, u.Unit_type,
               cp.Project_name,
               ca.Emp_id AS Confirmed_Emp_id,
               pe.First_Name AS Emp_First_Name, pe.Last_Name AS Emp_Last_Name
        FROM Booking b
        JOIN Client c ON c.Cl_id = b.Cl_id
        JOIN Person p ON p.Person_id = c.Person_id
        JOIN Flats_Units u ON u.Unit_id = b.Unit_id
        JOIN Construction_Project cp ON cp.Project_id = b.Project_id
        LEFT JOIN Confirm_Allocation ca ON ca.Booking_id = b.Booking_id
        LEFT JOIN Employee e ON e.Emp_id = ca.Emp_id
        LEFT JOIN Person pe ON pe.Person_id = e.Person_id
        ORDER BY b.Booking_id";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);
$rows = [];
while ($row = oci_fetch_assoc($stmt)) {
    $rows[] = $row;
}
echo json_encode($rows);
