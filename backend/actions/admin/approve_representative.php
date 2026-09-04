<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['POST']);
api_require_role('admin');
api_require_csrf();
$conn = getConnection();

$repId = trim($_POST['repId'] ?? '');
if ($repId === '') {
    api_error(400, 'Representative ID is required.', 'validation_error');
}

$sql = "UPDATE Contractor_Rep SET Approval_status = 'Approved' WHERE Rep_id = :p_rep_id AND Approval_status = 'Pending'";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_rep_id', $repId);

if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Representative approval failed');
}

if (oci_num_rows($stmt) === 0) {
    api_error(409, 'Representative was not found or is no longer pending.', 'invalid_state');
}

api_response(['success' => true, 'message' => 'Representative approved successfully.']);
