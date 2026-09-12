<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
require_once __DIR__ . '/../../lib/policy.php';

api_bootstrap(['GET']);
api_require_role('contractor');
$conn = getConnection();
$repId = $_SESSION['role_id'];
policy_require_approved_representative($conn, $repId);

$sql = "SELECT tb.Tender_id, tb.Bid_id, tb.Bid_status, tb.Bid_amount,
               t.Title,
               ta.Award_id, ta.Award_amount,
               TO_CHAR(ta.Award_date, 'YYYY-MM-DD') AS Award_date
        FROM Tender_Bids tb
        JOIN Tenders t ON tb.Tender_id = t.Tender_id
        LEFT JOIN Tender_Award ta ON ta.Tender_id = tb.Tender_id AND ta.Bid_id = tb.Bid_id
        WHERE tb.Rep_id = :p_rep_id
        ORDER BY tb.Tender_id, tb.Bid_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_rep_id', $repId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Representative bid list failed');
}

$bids = [];
while ($row = oci_fetch_assoc($stmt)) {
    $bids[] = $row;
}

api_response($bids);
