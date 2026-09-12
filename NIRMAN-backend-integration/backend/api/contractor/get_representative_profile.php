<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
require_once __DIR__ . '/../../lib/policy.php';

api_bootstrap(['GET']);
api_require_role('contractor');
$conn = getConnection();
$repId = $_SESSION['role_id'];
policy_require_approved_representative($conn, $repId);

$sql = "SELECT cr.Rep_id, cr.Title, cr.Approval_status, cr.Contractor_id,
               p.First_Name, p.Last_Name, p.Contact_no, p.Email, p.Profile_photo,
               c.Company_name, c.License_no,
               TO_CHAR(c.License_due, 'YYYY-MM-DD') AS License_due
        FROM Contractor_Rep cr
        JOIN Person p ON p.Person_id = cr.Person_id
        JOIN Contractor c ON c.Contractor_id = cr.Contractor_id
        WHERE cr.Rep_id = :p_rep_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_rep_id', $repId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Representative profile query failed');
}
$rep = oci_fetch_assoc($stmt);

if (!$rep) {
    api_error(404, 'Representative profile was not found.', 'profile_not_found');
}

$sql = "SELECT cr.Rep_id, cr.Title, cr.Approval_status, p.First_Name, p.Last_Name
        FROM Contractor_Rep cr JOIN Person p ON p.Person_id = cr.Person_id
        WHERE cr.Contractor_id = :p_contractor_id AND cr.Rep_id != :p_rep_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_contractor_id', $rep['CONTRACTOR_ID']);
oci_bind_by_name($stmt, ':p_rep_id', $repId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Company representative list failed');
}
$others = [];
while ($row = oci_fetch_assoc($stmt)) {
    $others[] = $row;
}

api_response(['found' => true, 'rep' => $rep, 'others' => $others]);
