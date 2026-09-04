<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET']);
api_require_role('employee');
$conn = getConnection();
$empId = $_SESSION['emp_id'];

$sql1 = "SELECT p.Person_id, p.First_Name, p.Last_Name, p.Contact_no, p.Email,
                e.Emp_id, e.Designation, e.NID, e.Dept_name
         FROM Employee e
         JOIN Person p ON p.Person_id = e.Person_id
         WHERE e.Emp_id = :empId";
$stmt1 = oci_parse($conn, $sql1);
oci_bind_by_name($stmt1, ':empId', $empId);
if (!oci_execute($stmt1)) {
    api_database_error($stmt1, 'Employee profile query failed');
}
$main = oci_fetch_assoc($stmt1);

if (!$main) {
    api_error(404, 'Employee account was not found.', 'employee_not_found');
}

$deptName = $main['DEPT_NAME'];

$sql2 = "SELECT Dept_name, Location, Email, Description FROM Department WHERE Dept_name = :deptName";
$stmt2 = oci_parse($conn, $sql2);
oci_bind_by_name($stmt2, ':deptName', $deptName);
if (!oci_execute($stmt2)) {
    api_database_error($stmt2, 'Employee department query failed');
}
$department = oci_fetch_assoc($stmt2);

$sql3 = "SELECT Phone_no FROM Department_Phone WHERE Dept_name = :deptName";
$stmt3 = oci_parse($conn, $sql3);
oci_bind_by_name($stmt3, ':deptName', $deptName);
if (!oci_execute($stmt3)) {
    api_database_error($stmt3, 'Department phone query failed');
}
$phones = [];
while ($row = oci_fetch_assoc($stmt3)) {
    $phones[] = $row['PHONE_NO'];
}

$sql4 = "SELECT e.Emp_id, p.First_Name, p.Last_Name
         FROM Work_Relation wr
         JOIN Employee e ON e.Emp_id = wr.Manager_id
         JOIN Person p ON p.Person_id = e.Person_id
         WHERE wr.Employee_id = :empId";
$stmt4 = oci_parse($conn, $sql4);
oci_bind_by_name($stmt4, ':empId', $empId);
if (!oci_execute($stmt4)) {
    api_database_error($stmt4, 'Employee manager query failed');
}
$manager = oci_fetch_assoc($stmt4);

$sql5 = "SELECT e.Emp_id, p.First_Name, p.Last_Name, e.Designation, e.Dept_name
         FROM Work_Relation wr
         JOIN Employee e ON e.Emp_id = wr.Employee_id
         JOIN Person p ON p.Person_id = e.Person_id
         WHERE wr.Manager_id = :empId";
$stmt5 = oci_parse($conn, $sql5);
oci_bind_by_name($stmt5, ':empId', $empId);
if (!oci_execute($stmt5)) {
    api_database_error($stmt5, 'Employee subordinate query failed');
}
$subordinates = [];
while ($row = oci_fetch_assoc($stmt5)) {
    $subordinates[] = $row;
}

api_response([
    'success' => true,
    'person' => $main,
    'department' => $department,
    'phones' => $phones,
    'manager' => $manager ?: null,
    'subordinates' => $subordinates
]);
