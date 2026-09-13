<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$sql = "SELECT c.Complaint_id, c.Cl_id, c.Resolved_by_Emp_id, c.Status, c.Filed_date, c.Note, c.Resolution,
               p.First_Name, p.Last_Name,
               ep.First_Name AS Emp_First_Name, ep.Last_Name AS Emp_Last_Name
        FROM Complaints c
        JOIN Client cl ON cl.Cl_id = c.Cl_id
        JOIN Person p ON p.Person_id = cl.Person_id
        LEFT JOIN Employee e ON e.Emp_id = c.Resolved_by_Emp_id
        LEFT JOIN Person ep ON ep.Person_id = e.Person_id
        ORDER BY c.Complaint_id DESC";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);
$rows = [];
while ($row = oci_fetch_assoc($stmt)) {
    $rows[] = $row;
}
echo json_encode($rows);
