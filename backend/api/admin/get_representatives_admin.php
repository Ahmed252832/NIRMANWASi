<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
api_bootstrap(['GET']);
api_require_role('admin');
$conn = getConnection();

$sql = "SELECT cr.Rep_id, cr.Title, cr.Approval_status, cr.Contractor_id,
               p.First_Name, p.Last_Name, p.Email, p.Contact_no,
               c.Company_name
        FROM Contractor_Rep cr
        JOIN Person p ON p.Person_id = cr.Person_id
        JOIN Contractor c ON c.Contractor_id = cr.Contractor_id
        ORDER BY cr.Rep_id";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Admin representative list failed');
}
$reps = [];
while ($row = oci_fetch_assoc($stmt)) {
    $reps[] = $row;
}
api_response($reps);
