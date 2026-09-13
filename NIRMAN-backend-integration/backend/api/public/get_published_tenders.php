<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET'], false);
$conn = getConnection();

$sql = "SELECT t.Tender_id, t.Emp_id,
               TO_CHAR(t.Deadline, 'YYYY-MM-DD') AS Deadline,
               TO_CHAR(t.Day, 'YYYY-MM-DD') AS Day,
               t.Title, t.Bid_Details, t.Status, t.Task,
               p.First_Name, p.Last_Name
        FROM Tenders t
        JOIN Employee e ON t.Emp_id = e.Emp_id
        JOIN Person p ON e.Person_id = p.Person_id
        WHERE t.Status = 'Published'
          AND t.Deadline >= TRUNC(SYSDATE)
          AND NOT EXISTS (SELECT 1 FROM Tender_Award ta WHERE ta.Tender_id = t.Tender_id)
        ORDER BY t.Deadline";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Published tender list failed');
}

$tenders = [];
while ($row = oci_fetch_assoc($stmt)) {
    $tenders[] = $row;
}

api_response($tenders);
