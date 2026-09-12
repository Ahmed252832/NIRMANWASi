<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
require_once __DIR__ . '/../../lib/profile_photo.php';

api_bootstrap(['POST'], false);
$conn = getConnection();

$firstName = trim($_POST['firstName'] ?? '');
$lastName = trim($_POST['lastName'] ?? '');
$contactNo = trim($_POST['contactNo'] ?? '');
$email = strtolower(trim($_POST['email'] ?? ''));
$password = $_POST['password'] ?? '';
$title = trim($_POST['title'] ?? '');
$contractorId = trim($_POST['contractorId'] ?? '');

if ($firstName === '' || $lastName === '' || $contactNo === '' || $email === ''
    || $title === '' || $contractorId === '') {
    api_error(400, 'All required fields must be filled in.', 'validation_error');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    api_error(400, 'Enter a valid email address.', 'validation_error');
}
if (strlen($password) < 6 || strlen($password) > 72) {
    api_error(400, 'Password must contain 6 to 72 characters.', 'validation_error');
}
if (strlen($firstName) > 30 || strlen($lastName) > 30 || strlen($contactNo) > 20
    || strlen($email) > 60 || strlen($title) > 50 || strlen($contractorId) > 10) {
    api_error(400, 'One or more fields exceed the supported length.', 'validation_error');
}

$checkStmt = oci_parse($conn, 'SELECT COUNT(*) AS CNT FROM Person WHERE LOWER(Email) = LOWER(:email)');
oci_bind_by_name($checkStmt, ':email', $email);
if (!oci_execute($checkStmt)) {
    api_database_error($checkStmt, 'Representative registration email lookup failed');
}
if ((int)oci_fetch_assoc($checkStmt)['CNT'] > 0) {
    api_error(409, 'This email is already in use.', 'duplicate_email');
}

$contractorStmt = oci_parse($conn, 'SELECT Contractor_id FROM Contractor WHERE Contractor_id = :contractor_id');
oci_bind_by_name($contractorStmt, ':contractor_id', $contractorId);
if (!oci_execute($contractorStmt)) {
    api_database_error($contractorStmt, 'Registration contractor lookup failed');
}
if (!oci_fetch_assoc($contractorStmt)) {
    api_error(404, 'Selected contractor company does not exist.', 'contractor_not_found');
}

$personIdStmt = oci_parse($conn, "SELECT NVL(MAX(TO_NUMBER(REGEXP_REPLACE(Person_id, '[^0-9]', ''))), 0) + 1 AS Next_num FROM Person");
if (!oci_execute($personIdStmt)) {
    api_database_error($personIdStmt, 'Representative person ID generation failed');
}
$newPersonId = 'P' . str_pad(oci_fetch_assoc($personIdStmt)['NEXT_NUM'], 3, '0', STR_PAD_LEFT);

$repIdStmt = oci_parse($conn, "SELECT NVL(MAX(TO_NUMBER(REGEXP_REPLACE(Rep_id, '[^0-9]', ''))), 0) + 1 AS Next_num FROM Contractor_Rep");
if (!oci_execute($repIdStmt)) {
    api_database_error($repIdStmt, 'Representative ID generation failed');
}
$newRepId = 'R' . str_pad(oci_fetch_assoc($repIdStmt)['NEXT_NUM'], 3, '0', STR_PAD_LEFT);
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
if ($hashedPassword === false) {
    api_error(500, 'The account could not be created.', 'password_hash_failed');
}
$profilePhoto = profile_photo_store_upload($_FILES['profilePhoto'] ?? null);

$personStmt = oci_parse($conn, "INSERT INTO Person
    (Person_id, First_Name, Last_Name, Contact_no, Email, Password, Profile_photo)
    VALUES (:person_id, :first_name, :last_name, :contact_no, :email, :password_hash, :profile_photo)");
oci_bind_by_name($personStmt, ':person_id', $newPersonId);
oci_bind_by_name($personStmt, ':first_name', $firstName);
oci_bind_by_name($personStmt, ':last_name', $lastName);
oci_bind_by_name($personStmt, ':contact_no', $contactNo);
oci_bind_by_name($personStmt, ':email', $email);
oci_bind_by_name($personStmt, ':password_hash', $hashedPassword);
oci_bind_by_name($personStmt, ':profile_photo', $profilePhoto);
if (!oci_execute($personStmt, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    profile_photo_delete_upload($profilePhoto);
    api_database_error($personStmt, 'Representative person creation failed');
}

$repStmt = oci_parse($conn, "INSERT INTO Contractor_Rep
    (Rep_id, Person_id, Contractor_id, Approval_status, Title)
    VALUES (:rep_id, :person_id, :contractor_id, 'Pending', :title)");
oci_bind_by_name($repStmt, ':rep_id', $newRepId);
oci_bind_by_name($repStmt, ':person_id', $newPersonId);
oci_bind_by_name($repStmt, ':contractor_id', $contractorId);
oci_bind_by_name($repStmt, ':title', $title);
if (!oci_execute($repStmt, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    profile_photo_delete_upload($profilePhoto);
    api_database_error($repStmt, 'Representative role creation failed');
}

if (!oci_commit($conn)) {
    oci_rollback($conn);
    profile_photo_delete_upload($profilePhoto);
    api_database_error($conn, 'Representative registration commit failed');
}
api_response([
    'success' => true,
    'message' => 'Account created successfully. Awaiting admin approval.',
    'repId' => $newRepId
], 201);
