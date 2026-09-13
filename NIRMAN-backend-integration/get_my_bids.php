<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'contractor') {
    echo json_encode([]);
    exit;
}
$repId = $_SESSION['role_id'];

$sql = "SELECT tb.Tender_id, tb.Bid_id, tb.Bid_status, tb.Bid_amount,
               t.Title,
               ta.Award_id, ta.Award_amount, ta.Award_date
        FROM Tender_Bids tb
        JOIN Tenders t ON tb.Tender_id = t.Tender_id
        LEFT JOIN Tender_Award ta ON ta.Tender_id = tb.Tender_id AND ta.Bid_id = tb.Bid_id
        WHERE tb.Rep_id = :p_rep_id
        ORDER BY tb.Tender_id, tb.Bid_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_rep_id', $repId);
oci_execute($stmt);

$bids = [];
while ($row = oci_fetch_assoc($stmt)) {
    $bids[] = $row;
}

echo json_encode($bids);
