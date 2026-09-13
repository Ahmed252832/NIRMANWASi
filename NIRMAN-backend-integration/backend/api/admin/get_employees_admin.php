<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
api_bootstrap(['GET']);
api_require_role('admin');
$conn = getConnection();

$sql = "SELECT e.Emp_id, e.Designation, e.Dept_name, p.First_Name, p.Last_Name
        FROM Employee e
        JOIN Person p ON p.Person_id = e.Person_id
        ORDER BY e.Emp_id";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Admin employee list failed');
}
$employees = [];
while ($row = oci_fetch_assoc($stmt)) {
    $employees[] = $row;
}
api_response($employees);
