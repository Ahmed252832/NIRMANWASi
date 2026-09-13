<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['role']) || !isset($_SESSION['role_id'])) {
    echo json_encode(['loggedIn' => false]);
    exit;
}

$role = $_SESSION['role'];
$roleId = $_SESSION['role_id'];
$personId = $_SESSION['person_id'];

$sql = "SELECT First_Name, Last_Name, Email, Contact_no FROM Person WHERE Person_id = :p_pid";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_pid', $personId);
oci_execute($stmt);
$person = oci_fetch_assoc($stmt);

if (!$person) {
    echo json_encode(['loggedIn' => false]);
    exit;
}

$response = [
    'loggedIn' => true,
    'role' => $role,
    'roleId' => $roleId,
    'firstName' => $person['FIRST_NAME'],
    'lastName' => $person['LAST_NAME'],
    'email' => $person['EMAIL'],
    'contactNo' => $person['CONTACT_NO']
];

if ($role === 'contractor') {
    $sql2 = "SELECT Title, Approval_status FROM Contractor_Rep WHERE Rep_id = :p_rid";
    $stmt2 = oci_parse($conn, $sql2);
    oci_bind_by_name($stmt2, ':p_rid', $roleId);
    oci_execute($stmt2);
    $rep = oci_fetch_assoc($stmt2);
    if ($rep) {
        $response['title'] = $rep['TITLE'];
        $response['approvalStatus'] = $rep['APPROVAL_STATUS'];
    }
}

echo json_encode($response);
