<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET']);
api_require_role('employee');
$conn = getConnection();
$employeeId = $_SESSION['emp_id'];

$sql = "SELECT c.Complaint_id, c.Cl_id, c.Resolved_by_Emp_id, c.Status,
               TO_CHAR(c.Filed_date, 'YYYY-MM-DD') AS Filed_date, c.Note, c.Resolution,
               p.First_Name, p.Last_Name,
               ep.First_Name AS Emp_First_Name, ep.Last_Name AS Emp_Last_Name
        FROM Complaints c
        JOIN Client cl ON cl.Cl_id = c.Cl_id
        JOIN Person p ON p.Person_id = cl.Person_id
        JOIN Employee e ON e.Emp_id = c.Resolved_by_Emp_id
        JOIN Person ep ON ep.Person_id = e.Person_id
        WHERE c.Resolved_by_Emp_id = :employee_id
        ORDER BY c.Complaint_id DESC";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':employee_id', $employeeId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Employee complaint list failed');
}

$rows = [];
while ($row = oci_fetch_assoc($stmt)) {
    $rows[] = $row;
}
api_response($rows);
