<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'client') {
    echo json_encode(['found' => false]);
    exit;
}
$clId = $_SESSION['role_id'];

$sql = "SELECT c.Cl_id, c.NID, p.First_Name, p.Last_Name, p.Contact_no, p.Email
        FROM Client c JOIN Person p ON p.Person_id = c.Person_id
        WHERE c.Cl_id = :p_cl_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_cl_id', $clId);
oci_execute($stmt);
$client = oci_fetch_assoc($stmt);

if (!$client) {
    echo json_encode(['found' => false]);
    exit;
}

$sql = "SELECT Contact_no FROM Client_Contact_no WHERE Cl_id = :p_cl_id";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_cl_id', $clId);
oci_execute($stmt);
$contacts = [];
while ($row = oci_fetch_assoc($stmt)) {
    $contacts[] = $row['CONTACT_NO'];
}

echo json_encode(['found' => true, 'client' => $client, 'contacts' => $contacts]);
