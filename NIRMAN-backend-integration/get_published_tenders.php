<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$sql = "SELECT t.Tender_id, t.Emp_id, t.Deadline, t.Title, t.Bid_Details, t.Status,
               p.First_Name, p.Last_Name
        FROM Tenders t
        JOIN Employee e ON t.Emp_id = e.Emp_id
        JOIN Person p ON e.Person_id = p.Person_id
        WHERE t.Status = 'Published'
        ORDER BY t.Deadline";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);

$tenders = [];
while ($row = oci_fetch_assoc($stmt)) {
    $tenders[] = $row;
}

echo json_encode($tenders);
