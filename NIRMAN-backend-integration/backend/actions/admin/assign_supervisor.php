<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['POST']);
api_require_role('admin');
api_require_csrf();
$conn = getConnection();

$empId = trim($_POST['empId'] ?? '');
$contractorId = trim($_POST['contractorId'] ?? '');

if ($empId === '' || $contractorId === '') {
    api_error(400, 'Choose an employee and a contractor.', 'validation_error');
}

$sql = "SELECT
            (SELECT COUNT(*) FROM Employee WHERE Emp_id = :p_emp_id) AS Employee_count,
            (SELECT COUNT(*) FROM Contractor WHERE Contractor_id = :p_contractor_id) AS Contractor_count,
            (SELECT COUNT(*) FROM Supervises
             WHERE Emp_id = :p_emp_id AND Contractor_id = :p_contractor_id) AS Assignment_count
        FROM dual";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_emp_id', $empId);
oci_bind_by_name($stmt, ':p_contractor_id', $contractorId);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Supervision lookup failed');
}
$row = oci_fetch_assoc($stmt);

if ((int)$row['EMPLOYEE_COUNT'] !== 1 || (int)$row['CONTRACTOR_COUNT'] !== 1) {
    api_error(404, 'Selected employee or contractor was not found.', 'assignment_target_not_found');
}
if ((int)$row['ASSIGNMENT_COUNT'] > 0) {
    api_error(409, 'That supervision assignment already exists.', 'duplicate_assignment');
}

$sql = "INSERT INTO Supervises (Emp_id, Contractor_id) VALUES (:p_emp_id, :p_contractor_id)";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_emp_id', $empId);
oci_bind_by_name($stmt, ':p_contractor_id', $contractorId);

if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Supervision assignment failed');
}

api_response(['success' => true, 'message' => 'Supervision assignment added successfully.']);
