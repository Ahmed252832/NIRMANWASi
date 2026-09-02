<?php
require_once 'config/db.php';
session_start();
$conn = getConnection();
header('Content-Type: application/json');

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if ($email === '' || $password === '') {
    echo json_encode(['success' => false, 'message' => 'Email or password is incorrect.']);
    exit;
}

$sql = "SELECT p.Person_id, p.First_Name, p.Last_Name, p.Password,
               e.Emp_id, e.Designation, e.Dept_name
        FROM Person p
        JOIN Employee e ON p.Person_id = e.Person_id
        WHERE p.Email = :email";

$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':email', $email);
oci_execute($stmt);
$row = oci_fetch_assoc($stmt);

if (!$row) {
    echo json_encode(['success' => false, 'message' => 'Email or password is incorrect.']);
    exit;
}

$storedPassword = $row['PASSWORD'];
$info = password_get_info($storedPassword);
$passwordMatches = $info['algo'] !== null
    ? password_verify($password, $storedPassword)
    : ($password === $storedPassword);

if (!$passwordMatches) {
    echo json_encode(['success' => false, 'message' => 'Email or password is incorrect.']);
    exit;
}

$_SESSION['person_id'] = $row['PERSON_ID'];
$_SESSION['emp_id'] = $row['EMP_ID'];
$_SESSION['role'] = 'employee';
$_SESSION['name'] = $row['FIRST_NAME'] . ' ' . $row['LAST_NAME'];

echo json_encode([
    'success' => true,
    'message' => 'Login successful.',
    'employeeId' => $row['EMP_ID'],
    'designation' => $row['DESIGNATION']
]);
