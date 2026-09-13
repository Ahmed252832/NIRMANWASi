<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$sql = "SELECT ta.Award_id, ta.Tender_id, ta.Bid_id, ta.Emp_id, ta.Award_amount, ta.Award_date,
               p.First_Name, p.Last_Name,
               cp.Project_id, cp.Project_name
        FROM Tender_Award ta
        JOIN Employee e ON e.Emp_id = ta.Emp_id
        JOIN Person p ON p.Person_id = e.Person_id
        LEFT JOIN Construction_Project cp ON cp.Award_id = ta.Award_id
        ORDER BY ta.Award_id";

$stmt = oci_parse($conn, $sql);
oci_execute($stmt);

$awards = [];
while ($row = oci_fetch_assoc($stmt)) {
    $awards[] = $row;
}

echo json_encode($awards);
