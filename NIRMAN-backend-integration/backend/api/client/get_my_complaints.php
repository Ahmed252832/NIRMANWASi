<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET']);
api_require_role('client');
$conn = getConnection();
$clId = $_SESSION['role_id'];

$sql = "SELECT c.Complaint_id, c.Cl_id, c.Resolved_by_Emp_id, c.Status,
               TO_CHAR(c.Filed_date, 'YYYY-MM-DD') AS Filed_date,
               c.Note, c.Resolution,
               ep.First_Name AS Employee_First_Name,
               ep.Last_Name AS Employee_Last_Name
        FROM Complaints c
        JOIN Employee e ON e.Emp_id = c.Resolved_by_Emp_id
        JOIN Person ep ON ep.Person_id = e.Person_id
        WHERE c.Cl_id = :p_cl_id
        ORDER BY c.Filed_date DESC, c.Complaint_id DESC";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_cl_id', $clId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Client complaint list failed');
}

$complaints = [];
while ($row = oci_fetch_assoc($stmt)) {
    $complaints[] = $row;
}

api_response($complaints);
