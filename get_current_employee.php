<?php
require_once 'config/db.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['emp_id']) || $_SESSION['role'] !== 'employee') {
    echo json_encode(['loggedIn' => false]);
    exit;
}

$conn = getConnection();

$sql = "SELECT e.Emp_id, e.Designation, e.Dept_name, p.Person_id, p.First_Name, p.Last_Name
        FROM Employee e
        JOIN Person p ON p.Person_id = e.Person_id
        WHERE e.Emp_id = :empId";

$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':empId', $_SESSION['emp_id']);
oci_execute($stmt);
$row = oci_fetch_assoc($stmt);

if (!$row) {
    echo json_encode(['loggedIn' => false]);
    exit;
}

echo json_encode([
    'loggedIn' => true,
    'employeeId' => $row['EMP_ID'],
    'personId' => $row['PERSON_ID'],
    'firstName' => $row['FIRST_NAME'],
    'lastName' => $row['LAST_NAME'],
    'designation' => $row['DESIGNATION'],
    'deptName' => $row['DEPT_NAME']
]);
