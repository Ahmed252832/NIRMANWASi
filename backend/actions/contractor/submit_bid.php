<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
require_once __DIR__ . '/../../lib/policy.php';

api_bootstrap(['POST']);
api_require_role('contractor');
api_require_csrf();
$conn = getConnection();
$repId = $_SESSION['role_id'];
policy_require_approved_representative($conn, $repId);

$tenderId = trim($_POST['tenderId'] ?? '');
$amount = trim($_POST['amount'] ?? '');

if ($tenderId === '' || $amount === '') {
    api_error(400, 'Tender and bid amount are required.', 'validation_error');
}
if (!is_numeric($amount) || (float)$amount <= 0) {
    api_error(400, 'Bid amount must be greater than zero.', 'validation_error');
}

$sql = "SELECT Status FROM Tenders t
        WHERE Tender_id = :p_tender_id
          AND Status = 'Published'
          AND Deadline >= TRUNC(SYSDATE)
          AND NOT EXISTS (SELECT 1 FROM Tender_Award ta WHERE ta.Tender_id = t.Tender_id)";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_tender_id', $tenderId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Tender eligibility lookup failed');
}
$tender = oci_fetch_assoc($stmt);
if (!$tender) {
    api_error(409, 'The selected tender is not open for bids.', 'tender_not_open');
}

// Generate next Bid_id, unique within this Tender_id
$sql = "SELECT NVL(MAX(TO_NUMBER(REGEXP_REPLACE(Bid_id, '[^0-9]', ''))), 0) + 1 AS next_num
        FROM Tender_Bids WHERE Tender_id = :p_tender_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_tender_id', $tenderId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Bid ID generation failed');
}
$row = oci_fetch_assoc($stmt);
$bidId = 'B' . str_pad($row['NEXT_NUM'], 3, '0', STR_PAD_LEFT);

$sql = "INSERT INTO Tender_Bids (Tender_id, Bid_id, Rep_id, Bid_status, Bid_amount)
        VALUES (:p_tender_id, :p_bid_id, :p_rep_id, 'Under Review', :p_amount)";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_tender_id', $tenderId);
oci_bind_by_name($stmt, ':p_bid_id', $bidId);
oci_bind_by_name($stmt, ':p_rep_id', $repId);
oci_bind_by_name($stmt, ':p_amount', $amount);

if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Bid submission failed');
}

api_response(['success' => true, 'message' => 'Bid submitted successfully.', 'bidId' => $bidId]);
