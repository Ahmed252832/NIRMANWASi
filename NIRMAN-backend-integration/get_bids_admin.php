<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$sql = "SELECT tb.Tender_id, tb.Bid_id, tb.Rep_id, tb.Bid_status, tb.Bid_amount,
               t.Title AS Tender_title, t.Status AS Tender_status,
               p.First_Name, p.Last_Name,
               c.Company_name,
               ta.Award_id
        FROM Tender_Bids tb
        JOIN Tenders t ON t.Tender_id = tb.Tender_id
        JOIN Contractor_Rep cr ON cr.Rep_id = tb.Rep_id
        JOIN Person p ON p.Person_id = cr.Person_id
        JOIN Contractor c ON c.Contractor_id = cr.Contractor_id
        LEFT JOIN Tender_Award ta ON ta.Tender_id = tb.Tender_id AND ta.Bid_id = tb.Bid_id
        ORDER BY tb.Tender_id, tb.Bid_id";

$stmt = oci_parse($conn, $sql);
oci_execute($stmt);

$bids = [];
while ($row = oci_fetch_assoc($stmt)) {
    $bids[] = $row;
}

echo json_encode($bids);
