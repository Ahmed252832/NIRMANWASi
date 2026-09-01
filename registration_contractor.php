<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

$firstName = trim($_POST['firstName'] ?? '');
$lastName = trim($_POST['lastName'] ?? '');
$contactNo = trim($_POST['contactNo'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$title = trim($_POST['title'] ?? '');
$contractorId = trim($_POST['contractorId'] ?? '');

// Server-side validation — never trust the frontend alone
if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must contain at least 6 characters.']);
    exit;
}
if (empty($firstName) || empty($lastName) || empty($email) || empty($title) || empty($contractorId)) {
    echo json_encode(['success' => false, 'message' => 'All required fields must be filled in.']);
    exit;
}

// Check duplicate email
$checkStmt = oci_parse($conn, "SELECT COUNT(*) AS CNT FROM Person WHERE Email = :p_email");
oci_bind_by_name($checkStmt, ':p_email', $email);
oci_execute($checkStmt);
$checkRow = oci_fetch_assoc($checkStmt);

if ($checkRow['CNT'] > 0) {
    echo json_encode(['success' => false, 'message' => 'This email is already in use.']);
    exit;
}

// Confirm the chosen Contractor actually exists
$contractorCheck = oci_parse($conn, "SELECT COUNT(*) AS CNT FROM Contractor WHERE Contractor_id = :p_cid");
oci_bind_by_name($contractorCheck, ':p_cid', $contractorId);
oci_execute($contractorCheck);
$contractorRow = oci_fetch_assoc($contractorCheck);

if ($contractorRow['CNT'] == 0) {
    echo json_encode(['success' => false, 'message' => 'Selected contractor company does not exist.']);
    exit;
}

// Generate new Person_id (using MAX-based pattern, consistent with other endpoints)
$sql = "SELECT NVL(MAX(TO_NUMBER(REGEXP_REPLACE(Person_id, '[^0-9]', ''))), 0) + 1 AS next_num FROM Person";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);
$row = oci_fetch_assoc($stmt);
$newPersonId = "PER" . str_pad($row['NEXT_NUM'], 2, "0", STR_PAD_LEFT);

// Generate new Rep_id
$sql = "SELECT NVL(MAX(TO_NUMBER(REGEXP_REPLACE(Rep_id, '[^0-9]', ''))), 0) + 1 AS next_num FROM Contractor_Rep";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);
$row = oci_fetch_assoc($stmt);
$newRepId = "REP" . str_pad($row['NEXT_NUM'], 3, "0", STR_PAD_LEFT);

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert Person
$insertPerson = oci_parse($conn,
    "INSERT INTO Person (Person_id, First_Name, Last_Name, Contact_no, Email, Password)
     VALUES (:p_pid, :p_fname, :p_lname, :p_contact, :p_email, :p_pass)");
oci_bind_by_name($insertPerson, ':p_pid', $newPersonId);
oci_bind_by_name($insertPerson, ':p_fname', $firstName);
oci_bind_by_name($insertPerson, ':p_lname', $lastName);
oci_bind_by_name($insertPerson, ':p_contact', $contactNo);
oci_bind_by_name($insertPerson, ':p_email', $email);
oci_bind_by_name($insertPerson, ':p_pass', $hashedPassword);

if (!oci_execute($insertPerson, OCI_NO_AUTO_COMMIT)) {
    $e = oci_error($insertPerson);
    echo json_encode(['success' => false, 'message' => 'Could not create person: ' . $e['message']]);
    exit;
}

// Insert Contractor_Rep
$insertRep = oci_parse($conn,
    "INSERT INTO Contractor_Rep (Rep_id, Person_id, Contractor_id, Approval_status, Title)
     VALUES (:p_rid, :p_pid, :p_cid, 'Pending', :p_title)");
oci_bind_by_name($insertRep, ':p_rid', $newRepId);
oci_bind_by_name($insertRep, ':p_pid', $newPersonId);
oci_bind_by_name($insertRep, ':p_cid', $contractorId);
oci_bind_by_name($insertRep, ':p_title', $title);

if (!oci_execute($insertRep, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    $e = oci_error($insertRep);
    echo json_encode(['success' => false, 'message' => 'Could not create representative: ' . $e['message']]);
    exit;
}

oci_commit($conn);
echo json_encode(['success' => true, 'message' => 'Account created successfully. Awaiting admin approval.', 'repId' => $newRepId]);