<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'contractor') {
    echo json_encode(['success' => false, 'message' => 'You must be logged in as a Contractor Representative.']);
    exit;
}
$repId = $_SESSION['role_id'];

$tenderId = trim($_POST['tenderId'] ?? '');
$amount = trim($_POST['amount'] ?? '');

if ($tenderId === '' || $amount === '') {
    echo json_encode(['success' => false, 'message' => 'Tender and bid amount are required.']);
    exit;
}

// Confirm rep is Approved
$sql = "SELECT Approval_status FROM Contractor_Rep WHERE Rep_id = :p_rep_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_rep_id', $repId);
oci_execute($stmt);
$rep = oci_fetch_assoc($stmt);
if (!$rep || $rep['APPROVAL_STATUS'] !== 'Approved') {
    echo json_encode(['success' => false, 'message' => 'Only an Approved representative can submit a bid.']);
    exit;
}

// Confirm tender is Published and deadline hasn't passed
$sql = "SELECT Status, Deadline FROM Tenders WHERE Tender_id = :p_tender_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_tender_id', $tenderId);
oci_execute($stmt);
$tender = oci_fetch_assoc($stmt);
if (!$tender || $tender['STATUS'] !== 'Published') {
    echo json_encode(['success' => false, 'message' => 'The selected tender is not Published.']);
    exit;
}

// Generate next Bid_id, unique within this Tender_id
$sql = "SELECT NVL(MAX(TO_NUMBER(REGEXP_REPLACE(Bid_id, '[^0-9]', ''))), 0) + 1 AS next_num
        FROM Tender_Bids WHERE Tender_id = :p_tender_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_tender_id', $tenderId);
oci_execute($stmt);
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
    $e = oci_error($stmt);
    echo json_encode(['success' => false, 'message' => 'Could not submit bid: ' . $e['message']]);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Bid submitted successfully.', 'bidId' => $bidId]);
