<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET']);
api_require_role('employee');
$conn = getConnection();
$empId = $_SESSION['emp_id'];

$sql1 = "SELECT COUNT(*) AS CNT FROM Booking b
         WHERE NOT EXISTS (
             SELECT 1 FROM Confirm_Allocation ca WHERE ca.Booking_id = b.Booking_id
         )";
$stmt1 = oci_parse($conn, $sql1);
if (!oci_execute($stmt1)) {
    api_database_error($stmt1, 'Pending allocation query failed');
}
$pendingAllocations = (int) oci_fetch_assoc($stmt1)['CNT'];

$sql2 = "SELECT COUNT(*) AS CNT FROM Payments
         WHERE Payment_status = 'Pending' AND Verified_by_Emp_id = :employee_id";
$stmt2 = oci_parse($conn, $sql2);
oci_bind_by_name($stmt2, ':employee_id', $empId);
if (!oci_execute($stmt2)) {
    api_database_error($stmt2, 'Pending payment query failed');
}
$pendingPayments = (int) oci_fetch_assoc($stmt2)['CNT'];

$sql3 = "SELECT COUNT(*) AS CNT FROM Complaints
         WHERE Status <> 'Resolved' AND Resolved_by_Emp_id = :employee_id";
$stmt3 = oci_parse($conn, $sql3);
oci_bind_by_name($stmt3, ':employee_id', $empId);
if (!oci_execute($stmt3)) {
    api_database_error($stmt3, 'Pending complaint query failed');
}
$pendingComplaints = (int) oci_fetch_assoc($stmt3)['CNT'];

$sql4 = "SELECT t.Tender_id, t.Title, TO_CHAR(t.Deadline, 'YYYY-MM-DD') AS Deadline, t.Status,
                (SELECT COUNT(*) FROM Tender_Bids tb WHERE tb.Tender_id = t.Tender_id) AS Bid_Count
         FROM Tenders t
         WHERE t.Emp_id = :empId
         ORDER BY t.Deadline";
$stmt4 = oci_parse($conn, $sql4);
oci_bind_by_name($stmt4, ':empId', $empId);
if (!oci_execute($stmt4)) {
    api_database_error($stmt4, 'Employee dashboard tender query failed');
}
$ownTenders = [];
while ($row = oci_fetch_assoc($stmt4)) {
    $ownTenders[] = [
        'TENDER_ID' => $row['TENDER_ID'],
        'TITLE' => $row['TITLE'],
        'DEADLINE' => $row['DEADLINE'],
        'STATUS' => $row['STATUS'],
        'BID_COUNT' => $row['BID_COUNT'],
    ];
}

$sql5 = "SELECT DISTINCT cp.Project_id, cp.Project_name, cp.Status,
                 TO_CHAR(cp.Deadline, 'YYYY-MM-DD') AS Deadline
         FROM Construction_Project cp
         JOIN Tender_Award ta ON ta.Award_id = cp.Award_id
         JOIN Tender_Bids tb ON tb.Tender_id = ta.Tender_id AND tb.Bid_id = ta.Bid_id
         JOIN Tenders t ON t.Tender_id = ta.Tender_id
         JOIN Contractor_Rep cr ON cr.Rep_id = tb.Rep_id
         WHERE t.Emp_id = :publisher_id
            OR ta.Emp_id = :award_employee_id
            OR EXISTS (
                SELECT 1 FROM Supervises s
                WHERE s.Emp_id = :supervisor_id
                  AND s.Contractor_id = cr.Contractor_id
            )
         ORDER BY cp.Project_id";
$stmt5 = oci_parse($conn, $sql5);
oci_bind_by_name($stmt5, ':publisher_id', $empId);
oci_bind_by_name($stmt5, ':award_employee_id', $empId);
oci_bind_by_name($stmt5, ':supervisor_id', $empId);
if (!oci_execute($stmt5)) {
    api_database_error($stmt5, 'Employee dashboard project query failed');
}
$projects = [];
while ($row = oci_fetch_assoc($stmt5)) {
    $progressSql = "SELECT Progress_percent FROM (
                        SELECT Progress_percent
                        FROM Project_Update
                        WHERE Project_id = :project_id
                        ORDER BY Update_date DESC, Update_id DESC
                    ) WHERE ROWNUM = 1";
    $progressStmt = oci_parse($conn, $progressSql);
    $projectId = $row['PROJECT_ID'];
    oci_bind_by_name($progressStmt, ':project_id', $projectId);
    if (!oci_execute($progressStmt)) {
        api_database_error($progressStmt, 'Employee project progress query failed');
    }
    $progressRow = oci_fetch_assoc($progressStmt);
    $projects[] = [
        'PROJECT_ID' => $row['PROJECT_ID'],
        'PROJECT_NAME' => $row['PROJECT_NAME'],
        'STATUS' => $row['STATUS'],
        'DEADLINE' => $row['DEADLINE'],
        'PROGRESS' => $progressRow ? $progressRow['PROGRESS_PERCENT'] : 0,
    ];
}

function employee_dashboard_distribution($conn, $sql, &$employeeId, $context)
{
    $stmt = oci_parse($conn, $sql);
    oci_bind_by_name($stmt, ':employee_id', $employeeId);
    if (!oci_execute($stmt)) {
        api_database_error($stmt, $context);
    }
    $rows = [];
    while ($row = oci_fetch_assoc($stmt)) {
        $rows[] = $row;
    }
    return $rows;
}

$tenderStatus = employee_dashboard_distribution(
    $conn,
    "SELECT Status, COUNT(*) AS Record_count FROM Tenders
     WHERE Emp_id = :employee_id GROUP BY Status ORDER BY Status",
    $empId,
    'Employee tender status summary failed'
);
$paymentStatus = employee_dashboard_distribution(
    $conn,
    "SELECT Payment_status AS Status, COUNT(*) AS Record_count FROM Payments
     WHERE Verified_by_Emp_id = :employee_id GROUP BY Payment_status ORDER BY Payment_status",
    $empId,
    'Employee payment status summary failed'
);
$complaintStatus = employee_dashboard_distribution(
    $conn,
    "SELECT Status, COUNT(*) AS Record_count FROM Complaints
     WHERE Resolved_by_Emp_id = :employee_id GROUP BY Status ORDER BY Status",
    $empId,
    'Employee complaint status summary failed'
);
$projectStatusSql = "SELECT cp.Status, COUNT(DISTINCT cp.Project_id) AS Record_count
    FROM Construction_Project cp
    JOIN Tender_Award ta ON ta.Award_id = cp.Award_id
    JOIN Tender_Bids tb ON tb.Tender_id = ta.Tender_id AND tb.Bid_id = ta.Bid_id
    JOIN Tenders t ON t.Tender_id = ta.Tender_id
    JOIN Contractor_Rep cr ON cr.Rep_id = tb.Rep_id
    WHERE t.Emp_id = :employee_id
       OR ta.Emp_id = :employee_id
       OR EXISTS (
           SELECT 1 FROM Supervises s
           WHERE s.Emp_id = :employee_id AND s.Contractor_id = cr.Contractor_id
       )
    GROUP BY cp.Status ORDER BY cp.Status";
$projectStatus = employee_dashboard_distribution(
    $conn,
    $projectStatusSql,
    $empId,
    'Employee project status summary failed'
);

api_response([
    'loggedIn' => true,
    'pendingAllocations' => $pendingAllocations,
    'pendingPayments' => $pendingPayments,
    'pendingComplaints' => $pendingComplaints,
    'ownTenders' => $ownTenders,
    'projects' => $projects,
    'tenderStatus' => $tenderStatus,
    'paymentStatus' => $paymentStatus,
    'complaintStatus' => $complaintStatus,
    'projectStatus' => $projectStatus
]);
