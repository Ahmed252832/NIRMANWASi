<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET']);
api_require_role('employee');
$conn = getConnection();
$employeeId = $_SESSION['emp_id'];

$paymentSql = "SELECT pay.Cl_id, pay.Payment_id, pay.Booking_id, pay.Verified_by_Emp_id,
                      pay.Payment_status,
                      TO_CHAR(pay.Verified_at, 'YYYY-MM-DD\"T\"HH24:MI:SS') AS Verified_at,
                      pay.Payment_method, pay.Amount,
                      TO_CHAR(pay.Payment_due, 'YYYY-MM-DD') AS Payment_due,
                      p.First_Name || ' ' || p.Last_Name AS Client_name
               FROM Payments pay
               JOIN Client c ON c.Cl_id = pay.Cl_id
               JOIN Person p ON p.Person_id = c.Person_id
               WHERE pay.Verified_by_Emp_id = :employee_id
               ORDER BY pay.Cl_id, pay.Payment_id";
$paymentStmt = oci_parse($conn, $paymentSql);
oci_bind_by_name($paymentStmt, ':employee_id', $employeeId);
if (!oci_execute($paymentStmt)) {
    api_database_error($paymentStmt, 'Employee payment list failed');
}

$payments = [];
while ($row = oci_fetch_assoc($paymentStmt)) {
    $payments[] = [
        'clientId' => $row['CL_ID'],
        'clientName' => $row['CLIENT_NAME'],
        'paymentId' => $row['PAYMENT_ID'],
        'bookingId' => $row['BOOKING_ID'],
        'verifiedByEmployeeId' => $row['VERIFIED_BY_EMP_ID'],
        'paymentStatus' => $row['PAYMENT_STATUS'],
        'verifiedAt' => $row['VERIFIED_AT'] ?: '',
        'paymentMethod' => $row['PAYMENT_METHOD'],
        'amount' => $row['AMOUNT'],
        'paymentDue' => $row['PAYMENT_DUE']
    ];
}

$bookingSql = "SELECT DISTINCT b.Booking_id, b.Cl_id, b.Unit_id, b.Project_id, b.Booking_status,
                      TO_CHAR(b.Booking_date, 'YYYY-MM-DD') AS Booking_date, b.Due_amount
               FROM Booking b
               JOIN Payments pay ON pay.Booking_id = b.Booking_id AND pay.Cl_id = b.Cl_id
               WHERE pay.Verified_by_Emp_id = :employee_id
               ORDER BY b.Booking_id";
$bookingStmt = oci_parse($conn, $bookingSql);
oci_bind_by_name($bookingStmt, ':employee_id', $employeeId);
if (!oci_execute($bookingStmt)) {
    api_database_error($bookingStmt, 'Employee payment booking list failed');
}
$bookings = [];
while ($row = oci_fetch_assoc($bookingStmt)) {
    $bookings[] = [
        'bookingId' => $row['BOOKING_ID'],
        'clientId' => $row['CL_ID'],
        'unitId' => $row['UNIT_ID'],
        'projectId' => $row['PROJECT_ID'],
        'bookingStatus' => $row['BOOKING_STATUS'],
        'bookingDate' => $row['BOOKING_DATE'],
        'dueAmount' => $row['DUE_AMOUNT']
    ];
}

$installmentSql = "SELECT i.Cl_id, i.Payment_id, i.Installment_id, i.Amount,
                          TO_CHAR(i.Due_date, 'YYYY-MM-DD') AS Due_date, i.Status,
                          TO_CHAR(i.Expired_at, 'YYYY-MM-DD\"T\"HH24:MI:SS') AS Expired_at
                   FROM Installment i
                   JOIN Payments pay ON pay.Cl_id = i.Cl_id AND pay.Payment_id = i.Payment_id
                   WHERE pay.Verified_by_Emp_id = :employee_id
                   ORDER BY i.Cl_id, i.Payment_id, i.Installment_id";
$installmentStmt = oci_parse($conn, $installmentSql);
oci_bind_by_name($installmentStmt, ':employee_id', $employeeId);
if (!oci_execute($installmentStmt)) {
    api_database_error($installmentStmt, 'Employee installment list failed');
}
$installments = [];
while ($row = oci_fetch_assoc($installmentStmt)) {
    $installments[] = [
        'clientId' => $row['CL_ID'],
        'paymentId' => $row['PAYMENT_ID'],
        'installmentId' => $row['INSTALLMENT_ID'],
        'amount' => $row['AMOUNT'],
        'dueDate' => $row['DUE_DATE'],
        'status' => $row['STATUS'],
        'expiredAt' => $row['EXPIRED_AT'] ?: ''
    ];
}

api_response(['payments' => $payments, 'bookings' => $bookings, 'installments' => $installments]);
