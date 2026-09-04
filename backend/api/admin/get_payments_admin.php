<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
api_bootstrap(['GET']);
api_require_role('admin');
$conn = getConnection();

$sql = "SELECT p.Cl_id, p.Payment_id, p.Booking_id, p.Verified_by_Emp_id, p.Payment_status,
               TO_CHAR(p.Verified_at, 'YYYY-MM-DD\"T\"HH24:MI:SS') AS Verified_at,
               p.Payment_method, p.Amount,
               TO_CHAR(p.Payment_due, 'YYYY-MM-DD') AS Payment_due,
               per.First_Name, per.Last_Name,
               ve.First_Name AS Verifier_First, ve.Last_Name AS Verifier_Last
        FROM Payments p
        JOIN Client c ON c.Cl_id = p.Cl_id
        JOIN Person per ON per.Person_id = c.Person_id
        LEFT JOIN Employee e ON e.Emp_id = p.Verified_by_Emp_id
        LEFT JOIN Person ve ON ve.Person_id = e.Person_id
        ORDER BY p.Cl_id, p.Payment_id";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Admin payment list failed');
}
$rows = [];
while ($row = oci_fetch_assoc($stmt)) {
    $rows[] = $row;
}
api_response($rows);
