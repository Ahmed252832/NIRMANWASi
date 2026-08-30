<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$sql = "SELECT cr.Rep_id, cr.Title, cr.Approval_status, cr.Contractor_id,
               p.First_Name, p.Last_Name, p.Email, p.Contact_no,
               c.Company_name
        FROM Contractor_Rep cr
        JOIN Person p ON p.Person_id = cr.Person_id
        JOIN Contractor c ON c.Contractor_id = cr.Contractor_id
        ORDER BY cr.Rep_id";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);
$reps = [];
while ($row = oci_fetch_assoc($stmt)) {
    $reps[] = $row;
}
echo json_encode($reps);
