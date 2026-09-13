<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
require_once __DIR__ . '/../../lib/profile_photo.php';

api_bootstrap(['POST']);
api_require_authenticated();
api_require_csrf();
$conn = getConnection();
$personId = $_SESSION['person_id'];

$lookupStmt = oci_parse($conn, 'SELECT Profile_photo FROM Person WHERE Person_id = :person_id');
oci_bind_by_name($lookupStmt, ':person_id', $personId);
if (!oci_execute($lookupStmt, OCI_NO_AUTO_COMMIT)) {
    api_database_error($lookupStmt, 'Profile photo lookup failed');
}
$person = oci_fetch_assoc($lookupStmt);
if (!$person) {
    oci_rollback($conn);
    api_error(404, 'Your Person record was not found.', 'person_not_found');
}

$profilePhoto = profile_photo_store_upload($_FILES['profilePhoto'] ?? null, true);
$updateStmt = oci_parse($conn, 'UPDATE Person SET Profile_photo = :profile_photo WHERE Person_id = :person_id');
oci_bind_by_name($updateStmt, ':profile_photo', $profilePhoto);
oci_bind_by_name($updateStmt, ':person_id', $personId);
if (!oci_execute($updateStmt, OCI_NO_AUTO_COMMIT) || oci_num_rows($updateStmt) !== 1) {
    oci_rollback($conn);
    profile_photo_delete_upload($profilePhoto);
    api_database_error($updateStmt, 'Profile photo update failed');
}
if (!oci_commit($conn)) {
    oci_rollback($conn);
    profile_photo_delete_upload($profilePhoto);
    api_database_error($conn, 'Profile photo commit failed');
}

profile_photo_delete_upload($person['PROFILE_PHOTO']);
api_response(['success' => true, 'message' => 'Profile photo updated.', 'profilePhoto' => $profilePhoto]);
