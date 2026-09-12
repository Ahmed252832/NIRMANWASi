<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET']);
api_require_role('admin');
$conn = getConnection();

function admin_summary_rows($conn, $sql, $context)
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

$countSql = "SELECT
    (SELECT COUNT(*) FROM Person) AS Person_count,
    (SELECT COUNT(*) FROM Employee) AS Employee_count,
    (SELECT COUNT(*) FROM Client) AS Client_count,
    (SELECT COUNT(*) FROM Contractor) AS Contractor_count,
    (SELECT COUNT(*) FROM Contractor_Rep WHERE Approval_status = 'Pending') AS Pending_rep_count,
    (SELECT COUNT(*) FROM Construction_Project) AS Project_count,
    (SELECT COUNT(*) FROM Construction_Project WHERE Status <> 'Completed') AS Active_project_count,
    (SELECT COUNT(*) FROM Construction_Project
        WHERE Status <> 'Completed' AND Deadline < TRUNC(SYSDATE)) AS Overdue_project_count,
    (SELECT COUNT(*) FROM Tenders t WHERE t.Status = 'Published'
        AND t.Deadline >= TRUNC(SYSDATE)
        AND NOT EXISTS (SELECT 1 FROM Tender_Award ta WHERE ta.Tender_id = t.Tender_id)) AS Open_tender_count,
    (SELECT COUNT(*) FROM Payments WHERE Payment_status = 'Pending') AS Pending_payment_count,
    (SELECT NVL(SUM(Amount), 0) FROM Payments WHERE Payment_status = 'Verified') AS Verified_payment_total,
    (SELECT COUNT(*) FROM Complaints WHERE Status <> 'Resolved') AS Open_complaint_count,
    (SELECT COUNT(*) FROM Booking b WHERE NOT EXISTS
        (SELECT 1 FROM Confirm_Allocation ca WHERE ca.Booking_id = b.Booking_id)) AS Pending_allocation_count,
    (SELECT COUNT(*) FROM Tender_Bids tb
        WHERE NVL(tb.Bid_status, 'Pending') <> 'Rejected'
          AND NOT EXISTS (
              SELECT 1 FROM Tender_Award ta
              WHERE ta.Tender_id = tb.Tender_id AND ta.Bid_id = tb.Bid_id
          )) AS Pending_bid_review_count,
    (SELECT COUNT(*) FROM Flats_Units u WHERE u.Status = 'Available'
        AND NOT EXISTS (SELECT 1 FROM Booking b WHERE b.Unit_id = u.Unit_id)) AS Available_unit_count
FROM dual";
$countStmt = oci_parse($conn, $countSql);
if (!oci_execute($countStmt)) {
    api_database_error($countStmt, 'Admin dashboard totals failed');
}
$counts = oci_fetch_assoc($countStmt);

$projectStatus = admin_summary_rows(
    $conn,
    'SELECT Status, COUNT(*) AS Record_count FROM Construction_Project GROUP BY Status ORDER BY Status',
    'Admin project status summary failed'
);
$paymentStatus = admin_summary_rows(
    $conn,
    'SELECT Payment_status AS Status, COUNT(*) AS Record_count FROM Payments GROUP BY Payment_status ORDER BY Payment_status',
    'Admin payment status summary failed'
);
$bidStatus = admin_summary_rows(
    $conn,
    'SELECT Bid_status AS Status, COUNT(*) AS Record_count FROM Tender_Bids GROUP BY Bid_status ORDER BY Bid_status',
    'Admin bid status summary failed'
);
$deadlineSql = "SELECT * FROM (
    SELECT cp.Project_id, cp.Project_name, cp.Status,
           TO_CHAR(cp.Deadline, 'YYYY-MM-DD') AS Deadline,
           MAX(pu.Progress_percent) KEEP
               (DENSE_RANK LAST ORDER BY pu.Update_date NULLS FIRST, pu.Update_id) AS Current_progress
    FROM Construction_Project cp
    LEFT JOIN Project_Update pu ON pu.Project_id = cp.Project_id
    WHERE cp.Status <> 'Completed'
    GROUP BY cp.Project_id, cp.Project_name, cp.Status, cp.Deadline
    ORDER BY cp.Deadline, cp.Project_id
) WHERE ROWNUM <= 5";
$deadlines = admin_summary_rows($conn, $deadlineSql, 'Admin project deadline summary failed');

$deadlineWatchSql = "SELECT Record_label, Record_area,
                            TO_CHAR(Deadline_date, 'YYYY-MM-DD') AS Deadline
                     FROM (
                         SELECT Record_label, Record_area, Deadline_date, Record_key
                         FROM (
                             SELECT cp.Project_name AS Record_label,
                                    'Project deadline' AS Record_area,
                                    cp.Deadline AS Deadline_date,
                                    'PR:' || cp.Project_id AS Record_key
                             FROM Construction_Project cp
                             WHERE cp.Status <> 'Completed'
                             UNION ALL
                             SELECT t.Title, 'Tender deadline', t.Deadline, 'TN:' || t.Tender_id
                             FROM Tenders t
                             WHERE t.Status = 'Published'
                             UNION ALL
                             SELECT 'Payment ' || pay.Payment_id || ' - ' || p.First_Name || ' ' || p.Last_Name,
                                    'Payment due', pay.Payment_due,
                                    'PY:' || pay.Cl_id || ':' || pay.Payment_id
                             FROM Payments pay
                             JOIN Client c ON c.Cl_id = pay.Cl_id
                             JOIN Person p ON p.Person_id = c.Person_id
                             WHERE pay.Payment_status = 'Pending'
                             UNION ALL
                             SELECT c.Company_name, 'License due', c.License_due, 'CO:' || c.Contractor_id
                             FROM Contractor c
                         )
                         WHERE Deadline_date IS NOT NULL
                         ORDER BY ABS(TRUNC(Deadline_date) - TRUNC(SYSDATE)), Deadline_date, Record_key
                     )
                     WHERE ROWNUM <= 8";
$deadlineWatch = admin_summary_rows($conn, $deadlineWatchSql, 'Admin deadline watch failed');

$recentWorkSql = "SELECT Marker, Title, Note,
                         TO_CHAR(Activity_date, 'YYYY-MM-DD') AS Activity_date
                  FROM (
                      SELECT Marker, Title, Note, Activity_date, Record_key
                      FROM (
                          SELECT 'UP' AS Marker,
                                 'Project update: ' || cp.Project_name AS Title,
                                 pu.Work_note AS Note,
                                 pu.Update_date AS Activity_date,
                                 'UP:' || pu.Project_id || ':' || pu.Update_id AS Record_key
                          FROM Project_Update pu
                          JOIN Construction_Project cp ON cp.Project_id = pu.Project_id
                          UNION ALL
                          SELECT 'BK', 'Booking ' || b.Booking_id,
                                 p.First_Name || ' ' || p.Last_Name || ' reserved unit ' || b.Unit_id,
                                 b.Booking_date, 'BK:' || b.Booking_id
                          FROM Booking b
                          JOIN Client c ON c.Cl_id = b.Cl_id
                          JOIN Person p ON p.Person_id = c.Person_id
                          UNION ALL
                          SELECT 'CP', 'Complaint ' || co.Complaint_id,
                                 p.First_Name || ' ' || p.Last_Name || ' / ' || co.Status,
                                 co.Filed_date, 'CP:' || co.Complaint_id
                          FROM Complaints co
                          JOIN Client c ON c.Cl_id = co.Cl_id
                          JOIN Person p ON p.Person_id = c.Person_id
                          UNION ALL
                          SELECT 'AW', 'Tender award ' || ta.Award_id,
                                 t.Title || ' - Bid ' || ta.Bid_id,
                                 ta.Award_date, 'AW:' || ta.Award_id
                          FROM Tender_Award ta
                          JOIN Tenders t ON t.Tender_id = ta.Tender_id
                      )
                      WHERE Activity_date IS NOT NULL
                      ORDER BY Activity_date DESC, Record_key DESC
                  )
                  WHERE ROWNUM <= 7";
$recentWorkItems = admin_summary_rows($conn, $recentWorkSql, 'Admin recent work summary failed');

api_response([
    'counts' => [
        'people' => (int)$counts['PERSON_COUNT'],
        'employees' => (int)$counts['EMPLOYEE_COUNT'],
        'clients' => (int)$counts['CLIENT_COUNT'],
        'contractors' => (int)$counts['CONTRACTOR_COUNT'],
        'pendingRepresentatives' => (int)$counts['PENDING_REP_COUNT'],
        'projects' => (int)$counts['PROJECT_COUNT'],
        'activeProjects' => (int)$counts['ACTIVE_PROJECT_COUNT'],
        'overdueProjects' => (int)$counts['OVERDUE_PROJECT_COUNT'],
        'openTenders' => (int)$counts['OPEN_TENDER_COUNT'],
        'pendingPayments' => (int)$counts['PENDING_PAYMENT_COUNT'],
        'openComplaints' => (int)$counts['OPEN_COMPLAINT_COUNT'],
        'pendingAllocations' => (int)$counts['PENDING_ALLOCATION_COUNT'],
        'pendingBidReviews' => (int)$counts['PENDING_BID_REVIEW_COUNT'],
        'availableUnits' => (int)$counts['AVAILABLE_UNIT_COUNT']
    ],
    'verifiedPaymentTotal' => $counts['VERIFIED_PAYMENT_TOTAL'],
    'projectStatus' => $projectStatus,
    'paymentStatus' => $paymentStatus,
    'bidStatus' => $bidStatus,
    'upcomingProjectDeadlines' => $deadlines,
    'deadlineWatch' => $deadlineWatch,
    'recentWorkItems' => $recentWorkItems
]);
