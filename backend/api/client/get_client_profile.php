<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET']);
api_require_role('client');
$conn = getConnection();
$clId = $_SESSION['role_id'];

$sql = "SELECT c.Cl_id, c.NID, p.First_Name, p.Last_Name, p.Contact_no, p.Email
        FROM Client c JOIN Person p ON p.Person_id = c.Person_id
        WHERE c.Cl_id = :p_cl_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_cl_id', $clId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Client profile query failed');
}
$client = oci_fetch_assoc($stmt);

if (!$client) {
    api_error(404, 'Client profile was not found.', 'profile_not_found');
}

$sql = "SELECT Contact_no FROM Client_Contact_no WHERE Cl_id = :p_cl_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_cl_id', $clId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Client contact query failed');
}
$contacts = [];
while ($row = oci_fetch_assoc($stmt)) {
    $contacts[] = $row['CONTACT_NO'];
}

api_response(['found' => true, 'client' => $client, 'contacts' => $contacts]);
