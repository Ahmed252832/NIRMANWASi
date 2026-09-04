<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
require_once __DIR__ . '/../../lib/policy.php';

api_bootstrap(['POST']);
api_require_role('employee');
api_require_csrf();
$conn = getConnection();
$employeeId = $_SESSION['emp_id'];

$tenderId = trim($_POST['tenderId'] ?? '');
$bidId = trim($_POST['bidId'] ?? '');
$action = trim($_POST['action'] ?? '');

if ($tenderId === '' || $bidId === '' || !in_array($action, ['select', 'reject'], true)) {
    api_error(400, 'Tender, bid, and a valid review action are required.', 'validation_error');
}
if (!policy_employee_owns_tender($conn, $employeeId, $tenderId)) {
    api_error(404, 'Tender bid was not found.', 'bid_not_found');
}

$nextStatus = $action === 'select' ? 'Selected' : 'Rejected';

if ($nextStatus === 'Selected') {
    $selectedSql = "SELECT Bid_id FROM Tender_Bids
                    WHERE Tender_id = :tender_id AND Bid_status = 'Selected' AND Bid_id <> :bid_id";
    $selectedStmt = oci_parse($conn, $selectedSql);
    oci_bind_by_name($selectedStmt, ':tender_id', $tenderId);
    oci_bind_by_name($selectedStmt, ':bid_id', $bidId);
    if (!oci_execute($selectedStmt)) {
        api_database_error($selectedStmt, 'Selected bid lookup failed');
    }
    if (oci_fetch_assoc($selectedStmt)) {
        api_error(409, 'Another bid is already selected for this tender.', 'bid_already_selected');
    }
}

$sql = "UPDATE Tender_Bids
        SET Bid_status = :status
        WHERE Tender_id = :tid AND Bid_id = :bid AND Bid_status = 'Under Review'";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':status', $nextStatus);
oci_bind_by_name($stmt, ':tid', $tenderId);
oci_bind_by_name($stmt, ':bid', $bidId);

if (!oci_execute($stmt, OCI_NO_AUTO_COMMIT)) {
    api_database_error($stmt, 'Bid review failed');
}
if (oci_num_rows($stmt) !== 1) {
    oci_rollback($conn);
    api_error(409, 'Bid was not found or is no longer under review.', 'invalid_state');
}

if ($nextStatus === 'Selected') {
    $sql2 = "UPDATE Tenders SET Status = 'Evaluation' WHERE Tender_id = :tid AND Status = 'Published'";
    $stmt2 = oci_parse($conn, $sql2);
    oci_bind_by_name($stmt2, ':tid', $tenderId);
    if (!oci_execute($stmt2, OCI_NO_AUTO_COMMIT)) {
        oci_rollback($conn);
        api_database_error($stmt2, 'Tender status update failed');
    }
}

oci_commit($conn);
api_response(['success' => true, 'message' => 'Bid marked ' . $nextStatus . '.']);
