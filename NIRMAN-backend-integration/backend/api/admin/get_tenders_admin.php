<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
api_bootstrap(['GET']);
api_require_role('admin');
$conn = getConnection();

$sql = "SELECT t.Tender_id, t.Emp_id,
               TO_CHAR(t.Deadline, 'YYYY-MM-DD') AS Deadline,
               TO_CHAR(t.Day, 'YYYY-MM-DD') AS Day,
               t.Title, t.Bid_Details, t.Status, t.Task,
               p.First_Name, p.Last_Name,
               (SELECT COUNT(*) FROM Tender_Bids tb WHERE tb.Tender_id = t.Tender_id) AS Bid_count
        FROM Tenders t
        JOIN Employee e ON e.Emp_id = t.Emp_id
        JOIN Person p ON p.Person_id = e.Person_id
        ORDER BY t.Tender_id";

$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Admin tender list failed');
}

$tenders = [];
while ($row = oci_fetch_assoc($stmt)) {
    $tenders[] = $row;
}

api_response($tenders);
