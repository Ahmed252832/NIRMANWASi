<?php
require_once 'config/db.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'contractor' || !isset($_SESSION['role_id'])) {
    echo json_encode(['loggedIn' => false]);
    exit;
}

$conn = getConnection();
$repId = $_SESSION['role_id'];

$sql = "SELECT cr.Rep_id, cr.Title, cr.Approval_status, cr.Contractor_id,
               p.Person_id, p.First_Name, p.Last_Name, p.Email, p.Contact_no
        FROM Contractor_Rep cr
        JOIN Person p ON p.Person_id = cr.Person_id
        WHERE cr.Rep_id = :repId";

$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':repId', $repId);
oci_execute($stmt);
$row = oci_fetch_assoc($stmt);

if (!$row) {
    echo json_encode(['loggedIn' => false]);
    exit;
}

echo json_encode([
    'loggedIn' => true,
    'representativeId' => $row['REP_ID'],
    'personId' => $row['PERSON_ID'],
    'firstName' => $row['FIRST_NAME'],
    'lastName' => $row['LAST_NAME'],
    'title' => $row['TITLE'],
    'approvalStatus' => $row['APPROVAL_STATUS'],
    'contractorId' => $row['CONTRACTOR_ID'],
    'email' => $row['EMAIL'],
    'contactNo' => $row['CONTACT_NO']
]);
