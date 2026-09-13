<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET']);
api_require_role('admin');
$conn = getConnection();

$sql = "SELECT i.Cl_id, i.Payment_id, i.Installment_id, i.Amount,
               TO_CHAR(i.Due_date, 'YYYY-MM-DD') AS Due_date,
               i.Status,
               TO_CHAR(i.Expired_at, 'YYYY-MM-DD\"T\"HH24:MI:SS') AS Expired_at,
               person_record.First_Name, person_record.Last_Name
        FROM Installment i
        JOIN Payments p ON p.Cl_id = i.Cl_id AND p.Payment_id = i.Payment_id
        JOIN Client c ON c.Cl_id = p.Cl_id
        JOIN Person person_record ON person_record.Person_id = c.Person_id
        ORDER BY i.Cl_id, i.Payment_id, i.Installment_id";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Admin installment list failed');
}

$rows = [];
while ($row = oci_fetch_assoc($stmt)) {
    $rows[] = $row;
}
api_response($rows);
