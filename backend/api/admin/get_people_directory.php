<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET']);
api_require_role('admin');
$conn = getConnection();

function admin_people_rows($conn, $sql, $context)
{
    $stmt = oci_parse($conn, $sql);
    if (!oci_execute($stmt)) {
        api_database_error($stmt, $context);
    }

    $rows = [];
    while ($row = oci_fetch_assoc($stmt)) {
        $rows[] = $row;
    }
    return $rows;
}

$employees = admin_people_rows(
    $conn,
    "SELECT e.Emp_id, e.Person_id, e.Dept_name, e.Designation, e.NID,
            p.First_Name, p.Last_Name, p.Contact_no, p.Email
     FROM Employee e
     JOIN Person p ON p.Person_id = e.Person_id
     ORDER BY e.Emp_id",
    'Admin people employee list failed'
);

$departments = admin_people_rows(
    $conn,
    'SELECT Dept_name, Location, Email, Description FROM Department ORDER BY Dept_name',
    'Admin people department list failed'
);

$departmentPhones = admin_people_rows(
    $conn,
    'SELECT Dept_name, Phone_no FROM Department_Phone ORDER BY Dept_name, Phone_no',
    'Admin people department phone list failed'
);

$clients = admin_people_rows(
    $conn,
    "SELECT c.Cl_id, c.Person_id, c.NID,
            p.First_Name, p.Last_Name, p.Contact_no, p.Email
     FROM Client c
     JOIN Person p ON p.Person_id = c.Person_id
     ORDER BY c.Cl_id",
    'Admin people client list failed'
);

$clientContacts = admin_people_rows(
    $conn,
    'SELECT Cl_id, Contact_no FROM Client_Contact_no ORDER BY Cl_id, Contact_no',
    'Admin people client contact list failed'
);

$workRelations = admin_people_rows(
    $conn,
    "SELECT wr.Employee_id, wr.Manager_id,
            ep.First_Name AS Employee_First_Name,
            ep.Last_Name AS Employee_Last_Name,
            e.Designation AS Employee_Designation,
            e.Dept_name AS Employee_Dept_Name,
            mp.First_Name AS Manager_First_Name,
            mp.Last_Name AS Manager_Last_Name,
            m.Designation AS Manager_Designation
     FROM Work_Relation wr
     JOIN Employee e ON e.Emp_id = wr.Employee_id
     JOIN Person ep ON ep.Person_id = e.Person_id
     JOIN Employee m ON m.Emp_id = wr.Manager_id
     JOIN Person mp ON mp.Person_id = m.Person_id
     ORDER BY wr.Manager_id, wr.Employee_id",
    'Admin people work relation list failed'
);

api_response([
    'employees' => $employees,
    'departments' => $departments,
    'departmentPhones' => $departmentPhones,
    'clients' => $clients,
    'clientContacts' => $clientContacts,
    'workRelations' => $workRelations
]);
