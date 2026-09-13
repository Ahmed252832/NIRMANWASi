<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET']);
api_require_role('employee');
$conn = getConnection();
api_require_employee_feature($conn, 'tenders');
$employeeId = $_SESSION['emp_id'];

$sql = "SELECT t.Tender_id, t.Emp_id, p.First_Name, p.Last_Name,
               TO_CHAR(t.Deadline, 'YYYY-MM-DD') AS Deadline,
               TO_CHAR(t.Day, 'YYYY-MM-DD') AS Day,
               t.Title, t.Bid_Details, t.Status, t.Task,
               (SELECT COUNT(*) FROM Tender_Bids tb WHERE tb.Tender_id = t.Tender_id) AS Bid_Count
         FROM Tenders t
         JOIN Employee e ON e.Emp_id = t.Emp_id
         JOIN Person p ON p.Person_id = e.Person_id
         WHERE t.Emp_id = :employee_id
         ORDER BY t.Tender_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':employee_id', $employeeId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Employee tender query failed');
}
$tenders = [];
while ($row = oci_fetch_assoc($stmt)) {
    $tenders[] = $row;
}
api_response($tenders);
