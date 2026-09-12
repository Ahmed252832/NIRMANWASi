<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
api_bootstrap(['GET']);
api_require_role('admin');
$conn = getConnection();

$sql = "SELECT u.Unit_id, u.Unit_type, u.Unit_no, u.Status,
               b.Booking_id, b.Cl_id, b.Project_id,
               p.First_Name, p.Last_Name,
               cp.Project_name
        FROM Flats_Units u
        LEFT JOIN Booking b ON b.Unit_id = u.Unit_id
        LEFT JOIN Client c ON c.Cl_id = b.Cl_id
        LEFT JOIN Person p ON p.Person_id = c.Person_id
        LEFT JOIN Construction_Project cp ON cp.Project_id = b.Project_id
        ORDER BY u.Unit_id";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Admin portfolio unit list failed');
}
$rows = [];
while ($row = oci_fetch_assoc($stmt)) {
    $rows[] = $row;
}
api_response($rows);
