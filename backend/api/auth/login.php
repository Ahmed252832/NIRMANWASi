<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['POST']);
$conn = getConnection();

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$selectedRole = trim($_POST['role'] ?? ''); // 'client', 'employee', or 'contractor'

if ($email === '' || $password === '') {
    api_error(400, 'Email and password are required.', 'validation_error');
}

// 1. Find the person by email
$sql = "SELECT Person_id, First_Name, Last_Name, Password
        FROM Person
        WHERE LOWER(Email) = LOWER(:email)";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':email', $email);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Login person query failed');
}
$person = oci_fetch_assoc($stmt);

if (!$person) {
    api_error(401, 'Email or password is incorrect.', 'invalid_credentials');
}

if (!password_verify($password, $person['PASSWORD'])) {
    api_error(401, 'Email or password is incorrect.', 'invalid_credentials');
}

$personId = $person['PERSON_ID'];
$actualRole = '';
$roleId = null;

// 2. Check Employee
$sql = "SELECT Emp_id, Designation FROM Employee WHERE Person_id = :pid";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':pid', $personId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Login employee query failed');
}
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
    if (!oci_execute($stmt)) {
        api_database_error($stmt, 'Login client query failed');
    }
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
    if (!oci_execute($stmt)) {
        api_database_error($stmt, 'Login representative query failed');
    }
    $rep = oci_fetch_assoc($stmt);

    if ($rep) {
        if ($rep['APPROVAL_STATUS'] !== 'Approved') {
            api_error(403, 'This representative account is waiting for admin approval.', 'representative_not_approved');
        }
        $actualRole = 'contractor';
        $roleId = $rep['REP_ID'];
    }
}

if ($actualRole === '') {
    api_error(403, 'This account has no assigned role. Contact admin.', 'role_not_assigned');
}

// 5. If a specific role was requested on the login form, enforce it (for the non-admin login form)
if ($selectedRole !== '' && $selectedRole !== $actualRole) {
    api_error(403, 'This account does not match the selected role.', 'role_mismatch');
}

api_establish_identity($personId, $actualRole, $roleId, $person['FIRST_NAME']);

api_response([
    'success' => true,
    'message' => 'Login successful.',
    'role' => $actualRole,
    'destination' => 'pages/' . $actualRole . '/dashboard.html',
    'csrfToken' => api_csrf_token()
]);
