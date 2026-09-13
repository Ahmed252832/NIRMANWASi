<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$sql = "SELECT p.Cl_id, p.Payment_id, p.Booking_id, p.Verified_by_Emp_id, p.Payment_status,
               p.Verified_at, p.Payment_method, p.Amount, p.Payment_due,
               per.First_Name, per.Last_Name,
               ve.First_Name AS Verifier_First, ve.Last_Name AS Verifier_Last
        FROM Payments p
        JOIN Client c ON c.Cl_id = p.Cl_id
        JOIN Person per ON per.Person_id = c.Person_id
        LEFT JOIN Employee e ON e.Emp_id = p.Verified_by_Emp_id
        LEFT JOIN Person ve ON ve.Person_id = e.Person_id
        ORDER BY p.Cl_id, p.Payment_id";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);
$rows = [];
while ($row = oci_fetch_assoc($stmt)) {
    $rows[] = $row;
}
echo json_encode($rows);
