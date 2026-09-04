<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
require_once __DIR__ . '/../../lib/policy.php';

api_bootstrap(['GET']);
api_require_role('contractor');
$conn = getConnection();
$representativeId = $_SESSION['role_id'];
policy_require_approved_representative($conn, $representativeId);

function contractor_summary_rows($conn, $sql, &$representativeId, $context)
{
    $stmt = oci_parse($conn, $sql);
    oci_bind_by_name($stmt, ':representative_id', $representativeId);
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
    (SELECT COUNT(*) FROM Tender_Bids WHERE Rep_id = :representative_id) AS Bid_count,
    (SELECT COUNT(*) FROM Tender_Bids WHERE Rep_id = :representative_id AND Bid_status = 'Selected') AS Selected_bid_count,
    (SELECT COUNT(*) FROM Tender_Bids tb
     JOIN Tender_Award ta ON ta.Tender_id = tb.Tender_id AND ta.Bid_id = tb.Bid_id
     WHERE tb.Rep_id = :representative_id) AS Award_count,
    (SELECT COUNT(*) FROM Tender_Bids tb
     JOIN Tender_Award ta ON ta.Tender_id = tb.Tender_id AND ta.Bid_id = tb.Bid_id
     JOIN Construction_Project cp ON cp.Award_id = ta.Award_id
     WHERE tb.Rep_id = :representative_id) AS Project_count,
    (SELECT COUNT(*) FROM Tenders t
     WHERE t.Status = 'Published' AND t.Deadline >= TRUNC(SYSDATE)
       AND NOT EXISTS (SELECT 1 FROM Tender_Award ta WHERE ta.Tender_id = t.Tender_id)) AS Open_tender_count
FROM dual";
$countStmt = oci_parse($conn, $countSql);
oci_bind_by_name($countStmt, ':representative_id', $representativeId);
if (!oci_execute($countStmt)) {
    api_database_error($countStmt, 'Representative dashboard totals failed');
}
$counts = oci_fetch_assoc($countStmt);

$bidStatus = contractor_summary_rows(
    $conn,
    "SELECT Bid_status AS Status, COUNT(*) AS Record_count
     FROM Tender_Bids WHERE Rep_id = :representative_id
     GROUP BY Bid_status ORDER BY Bid_status",
    $representativeId,
    'Representative bid status summary failed'
);
$projectsSql = "SELECT cp.Project_id, cp.Project_name, cp.Status,
                       TO_CHAR(cp.Deadline, 'YYYY-MM-DD') AS Deadline,
                       NVL(MAX(pu.Progress_percent) KEEP
                           (DENSE_RANK LAST ORDER BY pu.Update_date, pu.Update_id), 0) AS Current_progress,
                       TO_CHAR(MAX(pu.Update_date), 'YYYY-MM-DD') AS Last_update_date
                FROM Tender_Bids tb
                JOIN Tender_Award ta ON ta.Tender_id = tb.Tender_id AND ta.Bid_id = tb.Bid_id
                JOIN Construction_Project cp ON cp.Award_id = ta.Award_id
                LEFT JOIN Project_Update pu ON pu.Project_id = cp.Project_id
                WHERE tb.Rep_id = :representative_id
                GROUP BY cp.Project_id, cp.Project_name, cp.Status, cp.Deadline
                ORDER BY cp.Deadline, cp.Project_id";
$projects = contractor_summary_rows($conn, $projectsSql, $representativeId, 'Representative project summary failed');

api_response([
    'counts' => [
        'bids' => (int)$counts['BID_COUNT'],
        'selectedBids' => (int)$counts['SELECTED_BID_COUNT'],
        'awards' => (int)$counts['AWARD_COUNT'],
        'projects' => (int)$counts['PROJECT_COUNT'],
        'openTenders' => (int)$counts['OPEN_TENDER_COUNT']
    ],
    'bidStatus' => $bidStatus,
    'projects' => $projects
]);
