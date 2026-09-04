<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET']);
api_require_role('employee');
$conn = getConnection();
$employeeId = $_SESSION['emp_id'];

$sql = "SELECT b.Booking_id, b.Cl_id, b.Unit_id, b.Project_id, b.Booking_status,
               TO_CHAR(b.Booking_date, 'YYYY-MM-DD') AS Booking_date, b.Due_amount,
               p.First_Name, p.Last_Name, u.Unit_no, u.Unit_type, cp.Project_name,
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
        WHERE ca.Emp_id = :employee_id OR ca.Emp_id IS NULL
        ORDER BY b.Booking_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':employee_id', $employeeId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Employee allocation list failed');
}

$rows = [];
while ($row = oci_fetch_assoc($stmt)) {
    $rows[] = $row;
}
api_response($rows);
