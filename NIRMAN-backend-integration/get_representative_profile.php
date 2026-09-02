<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'contractor') {
    echo json_encode(['found' => false]);
    exit;
}
$repId = $_SESSION['role_id'];

$sql = "SELECT cr.Rep_id, cr.Title, cr.Approval_status, cr.Contractor_id,
               p.First_Name, p.Last_Name, p.Contact_no, p.Email,
               c.Company_name, c.License_no, c.License_due
        FROM Contractor_Rep cr
        JOIN Person p ON p.Person_id = cr.Person_id
        JOIN Contractor c ON c.Contractor_id = cr.Contractor_id
        WHERE cr.Rep_id = :p_rep_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_rep_id', $repId);
oci_execute($stmt);
$rep = oci_fetch_assoc($stmt);

if (!$rep) {
    echo json_encode(['found' => false]);
    exit;
}

$sql = "SELECT cr.Rep_id, cr.Title, cr.Approval_status, p.First_Name, p.Last_Name
        FROM Contractor_Rep cr JOIN Person p ON p.Person_id = cr.Person_id
        WHERE cr.Contractor_id = :p_contractor_id AND cr.Rep_id != :p_rep_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_contractor_id', $rep['CONTRACTOR_ID']);
oci_bind_by_name($stmt, ':p_rep_id', $repId);
oci_execute($stmt);
$others = [];
while ($row = oci_fetch_assoc($stmt)) {
    $others[] = $row;
}

echo json_encode(['found' => true, 'rep' => $rep, 'others' => $others]);
