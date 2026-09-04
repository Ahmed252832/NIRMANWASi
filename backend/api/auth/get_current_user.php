<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET']);

if (!api_is_authenticated()) {
    api_response(['loggedIn' => false]);
}

$conn = getConnection();
$role = $_SESSION['role'];
$roleId = $_SESSION['role_id'];
$personId = $_SESSION['person_id'];

$sql = "SELECT First_Name, Last_Name, Email, Contact_no FROM Person WHERE Person_id = :p_pid";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_pid', $personId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Current user person query failed');
}
$person = oci_fetch_assoc($stmt);

if (!$person) {
    api_clear_identity();
    api_response(['loggedIn' => false]);
}

$roleSql = '';
if ($role === 'admin' || $role === 'employee') {
    $roleSql = "SELECT Emp_id FROM Employee WHERE Emp_id = :role_id AND Person_id = :person_id";
} elseif ($role === 'client') {
    $roleSql = "SELECT Cl_id FROM Client WHERE Cl_id = :role_id AND Person_id = :person_id";
} else {
    $roleSql = "SELECT Rep_id FROM Contractor_Rep
                WHERE Rep_id = :role_id AND Person_id = :person_id AND Approval_status = 'Approved'";
}

$roleStmt = oci_parse($conn, $roleSql);
oci_bind_by_name($roleStmt, ':role_id', $roleId);
oci_bind_by_name($roleStmt, ':person_id', $personId);
if (!oci_execute($roleStmt)) {
    api_database_error($roleStmt, 'Current user role query failed');
}

if (!oci_fetch_assoc($roleStmt)) {
    api_clear_identity();
    api_response(['loggedIn' => false]);
}

$response = [
    'loggedIn' => true,
    'role' => $role,
    'roleId' => $roleId,
    'firstName' => $person['FIRST_NAME'],
    'lastName' => $person['LAST_NAME'],
    'email' => $person['EMAIL'],
    'contactNo' => $person['CONTACT_NO'],
    'csrfToken' => api_csrf_token()
];

if ($role === 'contractor') {
    $sql2 = "SELECT Title, Approval_status FROM Contractor_Rep WHERE Rep_id = :p_rid";
    $stmt2 = oci_parse($conn, $sql2);
    oci_bind_by_name($stmt2, ':p_rid', $roleId);
    if (!oci_execute($stmt2)) {
        api_database_error($stmt2, 'Current representative query failed');
    }
    $rep = oci_fetch_assoc($stmt2);
    if ($rep) {
        $response['title'] = $rep['TITLE'];
        $response['approvalStatus'] = $rep['APPROVAL_STATUS'];
    }
}

api_response($response);
