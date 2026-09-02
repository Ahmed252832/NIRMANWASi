<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$sql = "SELECT s.Emp_id, s.Contractor_id,
               p.First_Name, p.Last_Name, e.Designation, e.Dept_name,
               c.Company_name, c.License_no
        FROM Supervises s
        JOIN Employee e ON e.Emp_id = s.Emp_id
        JOIN Person p ON p.Person_id = e.Person_id
        JOIN Contractor c ON c.Contractor_id = s.Contractor_id
        ORDER BY s.Emp_id, s.Contractor_id";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);
$supervisions = [];
while ($row = oci_fetch_assoc($stmt)) {
    $supervisions[] = $row;
}
echo json_encode($supervisions);
