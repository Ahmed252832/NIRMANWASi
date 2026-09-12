<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET']);
api_require_role('contractor');

$conn = getConnection();
$repId = $_SESSION['role_id'];

$sql = "SELECT cr.Rep_id, cr.Title, cr.Approval_status, cr.Contractor_id,
               p.Person_id, p.First_Name, p.Last_Name, p.Email, p.Contact_no, p.Profile_photo
        FROM Contractor_Rep cr
        JOIN Person p ON p.Person_id = cr.Person_id
        WHERE cr.Rep_id = :repId";

$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':repId', $repId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Representative identity query failed');
}
$row = oci_fetch_assoc($stmt);

if (!$row) {
    api_error(404, 'Representative identity was not found.', 'identity_not_found');
}

api_response([
    'loggedIn' => true,
    'representativeId' => $row['REP_ID'],
    'personId' => $row['PERSON_ID'],
    'firstName' => $row['FIRST_NAME'],
    'lastName' => $row['LAST_NAME'],
    'title' => $row['TITLE'],
    'approvalStatus' => $row['APPROVAL_STATUS'],
    'contractorId' => $row['CONTRACTOR_ID'],
    'email' => $row['EMAIL'],
    'contactNo' => $row['CONTACT_NO'],
    'profilePhoto' => $row['PROFILE_PHOTO']
]);
