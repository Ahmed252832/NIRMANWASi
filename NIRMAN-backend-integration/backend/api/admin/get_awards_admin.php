<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
api_bootstrap(['GET']);
api_require_role('admin');
$conn = getConnection();

$sql = "SELECT ta.Award_id, ta.Tender_id, ta.Bid_id, ta.Emp_id, ta.Award_amount,
               TO_CHAR(ta.Award_date, 'YYYY-MM-DD') AS Award_date,
               p.First_Name, p.Last_Name,
               cp.Project_id, cp.Project_name
        FROM Tender_Award ta
        JOIN Employee e ON e.Emp_id = ta.Emp_id
        JOIN Person p ON p.Person_id = e.Person_id
        LEFT JOIN Construction_Project cp ON cp.Award_id = ta.Award_id
        ORDER BY ta.Award_id";

$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Admin award list failed');
}

$awards = [];
while ($row = oci_fetch_assoc($stmt)) {
    $awards[] = $row;
}

api_response($awards);
