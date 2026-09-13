<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$sql = "SELECT t.Tender_id, t.Emp_id, t.Deadline, t.Title, t.Bid_Details, t.Status,
               p.First_Name, p.Last_Name,
               (SELECT COUNT(*) FROM Tender_Bids tb WHERE tb.Tender_id = t.Tender_id) AS Bid_count
        FROM Tenders t
        JOIN Employee e ON e.Emp_id = t.Emp_id
        JOIN Person p ON p.Person_id = e.Person_id
        ORDER BY t.Tender_id";

$stmt = oci_parse($conn, $sql);
oci_execute($stmt);

$tenders = [];
while ($row = oci_fetch_assoc($stmt)) {
    $tenders[] = $row;
}

echo json_encode($tenders);
