<?php
require_once 'config/db.php';
$conn = getConnection();

// Read the submitted form data
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$contactNo = $_POST['contactNo'];
$email = $_POST['email'];
$password = $_POST['password'];
$nid = $_POST['nid'];
$additionalContact = isset($_POST['additionalContact']) ? $_POST['additionalContact'] : '';

// Server-side validation — never trust the frontend alone
if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must contain at least 6 characters.']);
    exit;
}
if (empty($firstName) || empty($lastName) || empty($email) || empty($nid)) {
    echo json_encode(['success' => false, 'message' => 'All required fields must be filled in.']);
    exit;
}

// Step 1: Check if the email is already used
$checkStmt = oci_parse($conn, "SELECT COUNT(*) AS CNT FROM Person WHERE Email = :email");
oci_bind_by_name($checkStmt, ':email', $email);
oci_execute($checkStmt);
$checkRow = oci_fetch_assoc($checkStmt);

if ($checkRow['CNT'] > 0) {
    echo json_encode(['success' => false, 'message' => 'This email is already in use.']);
    exit;
}

// Step 2: Generate a new Person_id (simple beginner approach: count + 1)
$countStmt = oci_parse($conn, "SELECT COUNT(*) AS CNT FROM Person");
oci_execute($countStmt);
$countRow = oci_fetch_assoc($countStmt);
$newPersonId = "PER" . str_pad($countRow['CNT'] + 1, 2, "0", STR_PAD_LEFT);

// Step 3: Generate a new Cl_id the same way
$clientCountStmt = oci_parse($conn, "SELECT COUNT(*) AS CNT FROM Client");
oci_execute($clientCountStmt);
$clientCountRow = oci_fetch_assoc($clientCountStmt);
$newClientId = "C" . str_pad($clientCountRow['CNT'] + 1, 3, "0", STR_PAD_LEFT);

// Step 4: Hash the password (never store plain text)
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Step 5: Insert Person (using NO_AUTO_COMMIT so we can undo everything if a later step fails)
$insertPerson = oci_parse($conn,
    "INSERT INTO Person (Person_id, First_Name, Last_Name, Contact_no, Email, Password)
     VALUES (:pid, :fname, :lname, :contact, :email, :pass)");
oci_bind_by_name($insertPerson, ':pid', $newPersonId);
oci_bind_by_name($insertPerson, ':fname', $firstName);
oci_bind_by_name($insertPerson, ':lname', $lastName);
oci_bind_by_name($insertPerson, ':contact', $contactNo);
oci_bind_by_name($insertPerson, ':email', $email);
oci_bind_by_name($insertPerson, ':pass', $hashedPassword);

if (!oci_execute($insertPerson, OCI_NO_AUTO_COMMIT)) {
    $e = oci_error($insertPerson);
    echo json_encode(['success' => false, 'message' => 'Could not create person: ' . $e['message']]);
    exit;
}

// Step 6: Insert Client
$insertClient = oci_parse($conn,
    "INSERT INTO Client (Cl_id, Person_id, NID) VALUES (:cid, :pid, :nid)");
oci_bind_by_name($insertClient, ':cid', $newClientId);
oci_bind_by_name($insertClient, ':pid', $newPersonId);
oci_bind_by_name($insertClient, ':nid', $nid);

if (!oci_execute($insertClient, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn); // undo the Person insert too
    $e = oci_error($insertClient);
    echo json_encode(['success' => false, 'message' => 'Could not create client: ' . $e['message']]);
    exit;
}

// Step 7: Insert primary contact number
$insertContact = oci_parse($conn,
    "INSERT INTO Client_Contact_no (Cl_id, Contact_no) VALUES (:cid, :contact)");
oci_bind_by_name($insertContact, ':cid', $newClientId);
oci_bind_by_name($insertContact, ':contact', $contactNo);

if (!oci_execute($insertContact, OCI_NO_AUTO_COMMIT)) {
    oci_rollback($conn);
    $e = oci_error($insertContact);
    echo json_encode(['success' => false, 'message' => 'Could not save contact number: ' . $e['message']]);
    exit;
}

// Step 8: Insert additional contact number, only if provided
if (!empty($additionalContact)) {
    $insertExtraContact = oci_parse($conn,
        "INSERT INTO Client_Contact_no (Cl_id, Contact_no) VALUES (:cid, :contact)");
    oci_bind_by_name($insertExtraContact, ':cid', $newClientId);
    oci_bind_by_name($insertExtraContact, ':contact', $additionalContact);

    if (!oci_execute($insertExtraContact, OCI_NO_AUTO_COMMIT)) {
        oci_rollback($conn);
        $e = oci_error($insertExtraContact);
        echo json_encode(['success' => false, 'message' => 'Could not save additional contact: ' . $e['message']]);
        exit;
    }
}

// Step 9: Everything succeeded — make it permanent
oci_commit($conn);

echo json_encode(['success' => true, 'message' => 'Account created successfully.', 'clientId' => $newClientId]);