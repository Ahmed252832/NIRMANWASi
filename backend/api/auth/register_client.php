<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['POST'], false);
$conn = getConnection();

$firstName = trim($_POST['firstName'] ?? '');
$lastName = trim($_POST['lastName'] ?? '');
$contactNo = trim($_POST['contactNo'] ?? '');
$email = strtolower(trim($_POST['email'] ?? ''));
$password = $_POST['password'] ?? '';
$nid = trim($_POST['nid'] ?? '');
$additionalContact = trim($_POST['additionalContact'] ?? '');

if ($firstName === '' || $lastName === '' || $contactNo === '' || $email === '' || $nid === '') {
    api_error(400, 'All required fields must be filled in.', 'validation_error');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    api_error(400, 'Enter a valid email address.', 'validation_error');
}
if (strlen($password) < 6 || strlen($password) > 72) {
    api_error(400, 'Password must contain 6 to 72 characters.', 'validation_error');
}
if (strlen($firstName) > 30 || strlen($lastName) > 30 || strlen($contactNo) > 20
    || strlen($email) > 60 || strlen($nid) > 30 || strlen($additionalContact) > 20) {
    api_error(400, 'One or more fields exceed the supported length.', 'validation_error');
}
if ($additionalContact !== '' && $additionalContact === $contactNo) {
    api_error(400, 'The additional contact number must be different.', 'validation_error');
}

$checkStmt = oci_parse($conn, 'SELECT COUNT(*) AS CNT FROM Person WHERE LOWER(Email) = LOWER(:email)');
oci_bind_by_name($checkStmt, ':email', $email);
if (!oci_execute($checkStmt)) {
    api_database_error($checkStmt, 'Client registration email lookup failed');
}
if ((int)oci_fetch_assoc($checkStmt)['CNT'] > 0) {
    api_error(409, 'This email is already in use.', 'duplicate_email');
}

$personIdStmt = oci_parse($conn, "SELECT NVL(MAX(TO_NUMBER(REGEXP_REPLACE(Person_id, '[^0-9]', ''))), 0) + 1 AS Next_num FROM Person");
if (!oci_execute($personIdStmt)) {
    api_database_error($personIdStmt, 'Client person ID generation failed');
}
$newPersonId = 'P' . str_pad(oci_fetch_assoc($personIdStmt)['NEXT_NUM'], 3, '0', STR_PAD_LEFT);

$clientIdStmt = oci_parse($conn, "SELECT NVL(MAX(TO_NUMBER(REGEXP_REPLACE(Cl_id, '[^0-9]', ''))), 0) + 1 AS Next_num FROM Client");
if (!oci_execute($clientIdStmt)) {
    api_database_error($clientIdStmt, 'Client ID generation failed');
}
$newClientId = 'C' . str_pad(oci_fetch_assoc($clientIdStmt)['NEXT_NUM'], 3, '0', STR_PAD_LEFT);
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
if ($hashedPassword === false) {
    api_error(500, 'The account could not be created.', 'password_hash_failed');
}

$personStmt = oci_parse($conn, "INSERT INTO Person
    (Person_id, First_Name, Last_Name, Contact_no, Email, Password)
    VALUES (:person_id, :first_name, :last_name, :contact_no, :email, :password_hash)");
oci_bind_by_name($personStmt, ':person_id', $newPersonId);
oci_bind_by_name($personStmt, ':first_name', $firstName);
oci_bind_by_name($personStmt, ':last_name', $lastName);
oci_bind_by_name($personStmt, ':contact_no', $contactNo);
oci_bind_by_name($personStmt, ':email', $email);
oci_bind_by_name($personStmt, ':password_hash', $hashedPassword);
if (!oci_execute($personStmt, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    api_database_error($personStmt, 'Client person creation failed');
}

$clientStmt = oci_parse($conn, 'INSERT INTO Client (Cl_id, Person_id, NID) VALUES (:client_id, :person_id, :nid)');
oci_bind_by_name($clientStmt, ':client_id', $newClientId);
oci_bind_by_name($clientStmt, ':person_id', $newPersonId);
oci_bind_by_name($clientStmt, ':nid', $nid);
if (!oci_execute($clientStmt, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    api_database_error($clientStmt, 'Client role creation failed');
}

$contactStmt = oci_parse($conn, 'INSERT INTO Client_Contact_no (Cl_id, Contact_no) VALUES (:client_id, :contact_no)');
oci_bind_by_name($contactStmt, ':client_id', $newClientId);
oci_bind_by_name($contactStmt, ':contact_no', $contactNo);
if (!oci_execute($contactStmt, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    api_database_error($contactStmt, 'Client contact creation failed');
}

if ($additionalContact !== '') {
    $extraStmt = oci_parse($conn, 'INSERT INTO Client_Contact_no (Cl_id, Contact_no) VALUES (:client_id, :contact_no)');
    oci_bind_by_name($extraStmt, ':client_id', $newClientId);
    oci_bind_by_name($extraStmt, ':contact_no', $additionalContact);
    if (!oci_execute($extraStmt, OCI_NO_AUTO_COMMIT)) {
        oci_rollback($conn);
        api_database_error($extraStmt, 'Additional client contact creation failed');
    }
}

oci_commit($conn);
api_response([
    'success' => true,
    'message' => 'Account created successfully.',
    'clientId' => $newClientId
], 201);
