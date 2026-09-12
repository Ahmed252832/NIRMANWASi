<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET']);
api_require_role('employee');

$conn = getConnection();

$sql = "SELECT e.Emp_id, e.Designation, e.Dept_name, p.Person_id, p.First_Name, p.Last_Name,
               p.Profile_photo
        FROM Employee e
        JOIN Person p ON p.Person_id = e.Person_id
        WHERE e.Emp_id = :empId";

$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':empId', $_SESSION['emp_id']);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Current employee query failed');
}
$row = oci_fetch_assoc($stmt);

if (!$row) {
    api_error(404, 'Employee account was not found.', 'employee_not_found');
}
$access = api_employee_access($conn, $row['EMP_ID']);

api_response([
    'loggedIn' => true,
    'employeeId' => $row['EMP_ID'],
    'personId' => $row['PERSON_ID'],
    'firstName' => $row['FIRST_NAME'],
    'lastName' => $row['LAST_NAME'],
    'designation' => $row['DESIGNATION'],
    'deptName' => $row['DEPT_NAME'],
    'profilePhoto' => $row['PROFILE_PHOTO'],
    'permissions' => $access['features'],
    'csrfToken' => api_csrf_token()
]);
