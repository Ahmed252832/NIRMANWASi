<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$sql = "SELECT e.Emp_id, e.Designation, e.Dept_name, p.First_Name, p.Last_Name
        FROM Employee e
        JOIN Person p ON p.Person_id = e.Person_id
        ORDER BY e.Emp_id";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);
$employees = [];
while ($row = oci_fetch_assoc($stmt)) {
    $employees[] = $row;
}
echo json_encode($employees);
