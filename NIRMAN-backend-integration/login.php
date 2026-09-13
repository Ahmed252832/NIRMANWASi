<?php
require_once 'config/db.php';
$conn = getConnection();

header('Content-Type: application/json');

session_start();

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$selectedRole = trim($_POST['role'] ?? ''); // 'client', 'employee', or 'contractor'

if ($email === '' || $password === '') {
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
    exit;
}

// 1. Find the person by email
$sql = "SELECT Person_id, First_Name, Last_Name, Password
        FROM Person
        WHERE LOWER(Email) = LOWER(:email)";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':email', $email);
$execResult = oci_execute($stmt);
$person = oci_fetch_assoc($stmt);

if (!$person || !password_verify($password, $person['PASSWORD'])) {
    echo json_encode(['success' => false, 'message' => 'Email or password is incorrect.']);
    exit;
}

$personId = $person['PERSON_ID'];
$actualRole = '';
$roleId = null;

// 2. Check Employee
$sql = "SELECT Emp_id, Designation FROM Employee WHERE Person_id = :pid";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':pid', $personId);
oci_execute($stmt);
$employee = oci_fetch_assoc($stmt);

if ($employee) {
    $actualRole = ($employee['DESIGNATION'] === 'System Administrator') ? 'admin' : 'employee';
    $roleId = $employee['EMP_ID'];
}

// 3. Check Client (only if not already matched as employee)
if ($actualRole === '') {
    $sql = "SELECT Cl_id FROM Client WHERE Person_id = :pid";
    $stmt = oci_parse($conn, $sql);
    oci_bind_by_name($stmt, ':pid', $personId);
    oci_execute($stmt);
    $client = oci_fetch_assoc($stmt);

    if ($client) {
        $actualRole = 'client';
        $roleId = $client['CL_ID'];
    }
}

// 4. Check Contractor_Rep (only if not already matched)
if ($actualRole === '') {
    $sql = "SELECT Rep_id, Approval_status FROM Contractor_Rep WHERE Person_id = :pid";
    $stmt = oci_parse($conn, $sql);
    oci_bind_by_name($stmt, ':pid', $personId);
    oci_execute($stmt);
    $rep = oci_fetch_assoc($stmt);

    if ($rep) {
        if ($rep['APPROVAL_STATUS'] !== 'Approved') {
            echo json_encode(['success' => false, 'message' => 'This representative account is waiting for admin approval.']);
            exit;
        }
        $actualRole = 'contractor';
        $roleId = $rep['REP_ID'];
    }
}

if ($actualRole === '') {
    echo json_encode(['success' => false, 'message' => 'This account has no assigned role. Contact admin.']);
    exit;
}

// 5. If a specific role was requested on the login form, enforce it (for the non-admin login form)
if ($selectedRole !== '' && $selectedRole !== $actualRole) {
    echo json_encode(['success' => false, 'message' => 'This account does not match the selected role.']);
    exit;
}

// 6. Success — store session
$_SESSION['person_id'] = $personId;
$_SESSION['role'] = $actualRole;
$_SESSION['role_id'] = $roleId;
$_SESSION['first_name'] = $person['FIRST_NAME'];

echo json_encode([
    'success' => true,
    'message' => 'Login successful.',
    'role' => $actualRole,
    'destination' => 'pages/' . $actualRole . '/dashboard.html'
]);