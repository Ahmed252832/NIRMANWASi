<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
api_bootstrap(['GET']);
api_require_role('admin');
$conn = getConnection();

$sql = "SELECT s.Emp_id, s.Contractor_id,
               p.First_Name, p.Last_Name, e.Designation, e.Dept_name,
               c.Company_name, c.License_no
        FROM Supervises s
        JOIN Employee e ON e.Emp_id = s.Emp_id
        JOIN Person p ON p.Person_id = e.Person_id
        JOIN Contractor c ON c.Contractor_id = s.Contractor_id
        ORDER BY s.Emp_id, s.Contractor_id";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Admin supervision list failed');
}
$supervisions = [];
while ($row = oci_fetch_assoc($stmt)) {
    $supervisions[] = $row;
}
api_response($supervisions);
