<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET']);
api_require_role('client');
$conn = getConnection();
$clientId = $_SESSION['role_id'];

function client_summary_rows($conn, $sql, &$clientId, $context)
{
    $stmt = oci_parse($conn, $sql);
    oci_bind_by_name($stmt, ':client_id', $clientId);
    if (!oci_execute($stmt)) {
        api_database_error($stmt, $context);
    }
    $rows = [];
    while ($row = oci_fetch_assoc($stmt)) {
        $rows[] = $row;
    }
    return $rows;
}

$countSql = "SELECT
    (SELECT COUNT(*) FROM Booking WHERE Cl_id = :client_id) AS Booking_count,
    (SELECT COUNT(*) FROM Payments WHERE Cl_id = :client_id) AS Payment_count,
    (SELECT COUNT(*) FROM Payments WHERE Cl_id = :client_id AND Payment_status = 'Pending') AS Pending_payment_count,
    (SELECT NVL(SUM(Amount), 0) FROM Payments WHERE Cl_id = :client_id AND Payment_status = 'Verified') AS Verified_payment_total,
    (SELECT COUNT(*) FROM Installment WHERE Cl_id = :client_id) AS Installment_count,
    (SELECT COUNT(*) FROM Booking b
        JOIN Confirm_Allocation ca ON ca.Booking_id = b.Booking_id
        WHERE b.Cl_id = :client_id) AS Confirmed_allocation_count,
    (SELECT COUNT(*) FROM Complaints WHERE Cl_id = :client_id AND Status <> 'Resolved') AS Open_complaint_count,
    (SELECT COUNT(*) FROM Flats_Units u WHERE u.Status = 'Available'
        AND NOT EXISTS (SELECT 1 FROM Booking b WHERE b.Unit_id = u.Unit_id)) AS Available_unit_count
FROM dual";
$countStmt = oci_parse($conn, $countSql);
oci_bind_by_name($countStmt, ':client_id', $clientId);
if (!oci_execute($countStmt)) {
    api_database_error($countStmt, 'Client dashboard totals failed');
}
$counts = oci_fetch_assoc($countStmt);

$paymentStatus = client_summary_rows(
    $conn,
    "SELECT Payment_status AS Status, COUNT(*) AS Record_count
     FROM Payments WHERE Cl_id = :client_id
     GROUP BY Payment_status ORDER BY Payment_status",
    $clientId,
    'Client payment status summary failed'
);
$complaintStatus = client_summary_rows(
    $conn,
    "SELECT Status, COUNT(*) AS Record_count
     FROM Complaints WHERE Cl_id = :client_id
     GROUP BY Status ORDER BY Status",
    $clientId,
    'Client complaint status summary failed'
);
$bookingSql = "SELECT * FROM (
    SELECT b.Booking_id, b.Booking_status,
           TO_CHAR(b.Booking_date, 'YYYY-MM-DD') AS Booking_date,
           b.Due_amount, u.Unit_no, u.Unit_type, cp.Project_id, cp.Project_name,
           CASE WHEN ca.Booking_id IS NULL THEN 'Pending confirmation'
                ELSE 'Allocation confirmed' END AS Allocation_status
    FROM Booking b
    JOIN Flats_Units u ON u.Unit_id = b.Unit_id
    JOIN Construction_Project cp ON cp.Project_id = b.Project_id
    LEFT JOIN Confirm_Allocation ca ON ca.Booking_id = b.Booking_id
    WHERE b.Cl_id = :client_id
    ORDER BY b.Booking_date DESC, b.Booking_id DESC
) WHERE ROWNUM <= 5";
$recentBookings = client_summary_rows($conn, $bookingSql, $clientId, 'Client recent booking summary failed');

$paymentSql = "SELECT * FROM (
    SELECT pay.Payment_id, pay.Booking_id, pay.Payment_status, pay.Payment_method,
           pay.Amount, TO_CHAR(pay.Payment_due, 'YYYY-MM-DD') AS Payment_due
    FROM Payments pay
    WHERE pay.Cl_id = :client_id
    ORDER BY pay.Payment_due DESC, pay.Payment_id DESC
) WHERE ROWNUM <= 5";
$recentPayments = client_summary_rows($conn, $paymentSql, $clientId, 'Client recent payment summary failed');

$installmentSql = "SELECT * FROM (
    SELECT i.Payment_id, i.Installment_id, i.Amount,
           TO_CHAR(i.Due_date, 'YYYY-MM-DD') AS Due_date, i.Status
    FROM Installment i
    WHERE i.Cl_id = :client_id
    ORDER BY i.Due_date, i.Payment_id, i.Installment_id
) WHERE ROWNUM <= 5";
$upcomingInstallments = client_summary_rows($conn, $installmentSql, $clientId, 'Client installment summary failed');

$complaintSql = "SELECT * FROM (
    SELECT co.Complaint_id, co.Status,
           TO_CHAR(co.Filed_date, 'YYYY-MM-DD') AS Filed_date,
           co.Note, co.Resolution
    FROM Complaints co
    WHERE co.Cl_id = :client_id
    ORDER BY co.Filed_date DESC, co.Complaint_id DESC
) WHERE ROWNUM <= 4";
$recentComplaints = client_summary_rows($conn, $complaintSql, $clientId, 'Client recent complaint summary failed');

api_response([
    'counts' => [
        'bookings' => (int)$counts['BOOKING_COUNT'],
        'payments' => (int)$counts['PAYMENT_COUNT'],
        'pendingPayments' => (int)$counts['PENDING_PAYMENT_COUNT'],
        'installments' => (int)$counts['INSTALLMENT_COUNT'],
        'confirmedAllocations' => (int)$counts['CONFIRMED_ALLOCATION_COUNT'],
        'openComplaints' => (int)$counts['OPEN_COMPLAINT_COUNT'],
        'availableUnits' => (int)$counts['AVAILABLE_UNIT_COUNT']
    ],
    'verifiedPaymentTotal' => $counts['VERIFIED_PAYMENT_TOTAL'],
    'paymentStatus' => $paymentStatus,
    'complaintStatus' => $complaintStatus,
    'recentBookings' => $recentBookings,
    'recentPayments' => $recentPayments,
    'upcomingInstallments' => $upcomingInstallments,
    'recentComplaints' => $recentComplaints
]);
