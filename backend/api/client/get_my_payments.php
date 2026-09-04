<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET']);
api_require_role('client');
$conn = getConnection();
$clId = $_SESSION['role_id'];

$paymentSql = "SELECT pay.Cl_id, pay.Payment_id, pay.Booking_id,
                      pay.Verified_by_Emp_id, pay.Payment_status,
                      TO_CHAR(pay.Verified_at, 'YYYY-MM-DD\"T\"HH24:MI:SS') AS Verified_at,
                      pay.Payment_method, pay.Amount,
                      TO_CHAR(pay.Payment_due, 'YYYY-MM-DD') AS Payment_due,
                      ep.First_Name AS Verifier_First_Name,
                      ep.Last_Name AS Verifier_Last_Name
               FROM Payments pay
               JOIN Employee e ON e.Emp_id = pay.Verified_by_Emp_id
               JOIN Person ep ON ep.Person_id = e.Person_id
               WHERE pay.Cl_id = :p_cl_id
               ORDER BY pay.Payment_due DESC, pay.Payment_id DESC";
$paymentStmt = oci_parse($conn, $paymentSql);
oci_bind_by_name($paymentStmt, ':p_cl_id', $clId);
if (!oci_execute($paymentStmt)) {
    api_database_error($paymentStmt, 'Client payment list failed');
}

$payments = [];
while ($row = oci_fetch_assoc($paymentStmt)) {
    $payments[] = $row;
}

$installmentSql = "SELECT i.Cl_id, i.Payment_id, i.Installment_id, i.Amount,
                          TO_CHAR(i.Due_date, 'YYYY-MM-DD') AS Due_date,
                          i.Status,
                          TO_CHAR(i.Expired_at, 'YYYY-MM-DD\"T\"HH24:MI:SS') AS Expired_at
                   FROM Installment i
                   JOIN Payments pay
                     ON pay.Cl_id = i.Cl_id AND pay.Payment_id = i.Payment_id
                   WHERE pay.Cl_id = :p_cl_id
                   ORDER BY i.Due_date, i.Payment_id, i.Installment_id";
$installmentStmt = oci_parse($conn, $installmentSql);
oci_bind_by_name($installmentStmt, ':p_cl_id', $clId);
if (!oci_execute($installmentStmt)) {
    api_database_error($installmentStmt, 'Client installment list failed');
}

$installments = [];
while ($row = oci_fetch_assoc($installmentStmt)) {
    $installments[] = $row;
}

api_response(['payments' => $payments, 'installments' => $installments]);
