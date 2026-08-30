<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$tenderId = $_POST['tenderId'];
$bidId = $_POST['bidId'];
$action = $_POST['action'];
$nextStatus = $action === 'select' ? 'Selected' : 'Rejected';

$sql = "UPDATE Tender_Bids
        SET Bid_status = :status
        WHERE Tender_id = :tid AND Bid_id = :bid AND Bid_status = 'Under Review'";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':status', $nextStatus);
oci_bind_by_name($stmt, ':tid', $tenderId);
oci_bind_by_name($stmt, ':bid', $bidId);

if (!oci_execute($stmt, OCI_NO_AUTO_COMMIT)) {
    $e = oci_error($stmt);
    echo json_encode(['success' => false, 'message' => 'Could not update bid: ' . $e['message']]);
    exit;
}

if ($nextStatus === 'Selected') {
    $sql2 = "UPDATE Tenders SET Status = 'Evaluation' WHERE Tender_id = :tid AND Status = 'Published'";
    $stmt2 = oci_parse($conn, $sql2);
    oci_bind_by_name($stmt2, ':tid', $tenderId);
    oci_execute($stmt2, OCI_NO_AUTO_COMMIT);
}

oci_commit($conn);
echo json_encode(['success' => true, 'message' => 'Bid marked ' . $nextStatus . '.']);
