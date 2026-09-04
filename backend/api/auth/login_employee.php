<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['POST']);
$conn = getConnection();

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if ($email === '' || $password === '') {
    api_error(400, 'Email and password are required.', 'validation_error');
}

$sql = "SELECT p.Person_id, p.First_Name, p.Last_Name, p.Password,
               e.Emp_id, e.Designation, e.Dept_name
        FROM Person p
        JOIN Employee e ON p.Person_id = e.Person_id
        WHERE p.Email = :email";

$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':email', $email);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Employee login query failed');
}
$row = oci_fetch_assoc($stmt);

if (!$row) {
    api_error(401, 'Email or password is incorrect.', 'invalid_credentials');
}

if (!password_verify($password, $row['PASSWORD'])) {
    api_error(401, 'Email or password is incorrect.', 'invalid_credentials');
}

$role = $row['DESIGNATION'] === 'System Administrator' ? 'admin' : 'employee';
api_establish_identity($row['PERSON_ID'], $role, $row['EMP_ID'], $row['FIRST_NAME']);

api_response([
    'success' => true,
    'message' => 'Login successful.',
    'employeeId' => $row['EMP_ID'],
    'designation' => $row['DESIGNATION'],
    'role' => $role,
    'destination' => 'pages/' . $role . '/dashboard.html',
    'csrfToken' => api_csrf_token()
]);
