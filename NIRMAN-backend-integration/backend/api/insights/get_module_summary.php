<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';
require_once __DIR__ . '/../../lib/policy.php';

api_bootstrap(['GET']);
api_require_authenticated();
$conn = getConnection();
$role = $_SESSION['role'];
$module = trim($_GET['module'] ?? '');
$scopeId = $_SESSION['role_id'];
$sql = '';
$title = 'Status distribution';
$bindScope = false;
$barConfig = null;
$lineConfig = null;

function module_insight_metric_rows($conn, $sql, $scopeId, $bindScope, $context)
{
    $stmt = oci_parse($conn, $sql);
    if ($bindScope) {
        oci_bind_by_name($stmt, ':scope_id', $scopeId);
    }
    if (!oci_execute($stmt)) {
        api_database_error($stmt, $context);
    }
    $rows = [];
    while ($row = oci_fetch_assoc($stmt)) {
        $rows[] = [
            'label' => $row['LABEL'] ?: 'Unspecified',
            'value' => (float)$row['METRIC_VALUE']
        ];
    }
    return $rows;
}

if ($role === 'employee') {
    api_require_employee_feature($conn, $module);
    $bindScope = true;
    $queries = [
        'tenders' => "SELECT t.Status AS Label, COUNT(*) AS Record_count FROM Tenders t WHERE t.Emp_id = :scope_id GROUP BY t.Status ORDER BY t.Status",
        'allocations' => "SELECT CASE WHEN ca.Booking_id IS NULL THEN 'Pending' ELSE 'Confirmed by me' END AS Label, COUNT(*) AS Record_count FROM Booking b LEFT JOIN Confirm_Allocation ca ON ca.Booking_id = b.Booking_id WHERE ca.Emp_id = :scope_id OR ca.Emp_id IS NULL GROUP BY CASE WHEN ca.Booking_id IS NULL THEN 'Pending' ELSE 'Confirmed by me' END",
        'payments' => "SELECT Payment_status AS Label, COUNT(*) AS Record_count FROM Payments WHERE Verified_by_Emp_id = :scope_id GROUP BY Payment_status ORDER BY Payment_status",
        'complaints' => "SELECT Status AS Label, COUNT(*) AS Record_count FROM Complaints WHERE Resolved_by_Emp_id = :scope_id GROUP BY Status ORDER BY Status",
        'projects' => "SELECT cp.Status AS Label, COUNT(DISTINCT cp.Project_id) AS Record_count FROM Construction_Project cp JOIN Tender_Award ta ON ta.Award_id = cp.Award_id JOIN Tender_Bids tb ON tb.Tender_id = ta.Tender_id AND tb.Bid_id = ta.Bid_id JOIN Tenders t ON t.Tender_id = ta.Tender_id JOIN Contractor_Rep cr ON cr.Rep_id = tb.Rep_id WHERE t.Emp_id = :scope_id OR ta.Emp_id = :scope_id OR EXISTS (SELECT 1 FROM Supervises s WHERE s.Emp_id = :scope_id AND s.Contractor_id = cr.Contractor_id) GROUP BY cp.Status ORDER BY cp.Status"
    ];
    $sql = $queries[$module] ?? '';
    $barQueries = [
        'tenders' => [
            'title' => 'Bids received by tender',
            'unit' => 'records',
            'sql' => "SELECT t.Title || ' (' || t.Tender_id || ')' AS Label, COUNT(tb.Bid_id) AS Metric_value FROM Tenders t LEFT JOIN Tender_Bids tb ON tb.Tender_id = t.Tender_id WHERE t.Emp_id = :scope_id GROUP BY t.Tender_id, t.Title ORDER BY t.Tender_id"
        ],
        'allocations' => [
            'title' => 'Allocation queue by project',
            'unit' => 'records',
            'sql' => "SELECT cp.Project_name AS Label, COUNT(*) AS Metric_value FROM Booking b JOIN Construction_Project cp ON cp.Project_id = b.Project_id LEFT JOIN Confirm_Allocation ca ON ca.Booking_id = b.Booking_id WHERE ca.Emp_id = :scope_id OR ca.Emp_id IS NULL GROUP BY cp.Project_name ORDER BY cp.Project_name"
        ],
        'payments' => [
            'title' => 'Assigned payment amount by status',
            'unit' => 'currency',
            'sql' => "SELECT NVL(Payment_status, 'Unspecified') AS Label, SUM(Amount) AS Metric_value FROM Payments WHERE Verified_by_Emp_id = :scope_id GROUP BY Payment_status ORDER BY Payment_status"
        ],
        'projects' => [
            'title' => 'Latest recorded project progress',
            'unit' => 'percent',
            'sql' => "SELECT DISTINCT cp.Project_name AS Label, latest.Progress_percent AS Metric_value FROM Construction_Project cp JOIN Tender_Award ta ON ta.Award_id = cp.Award_id JOIN Tender_Bids tb ON tb.Tender_id = ta.Tender_id AND tb.Bid_id = ta.Bid_id JOIN Tenders t ON t.Tender_id = ta.Tender_id JOIN Contractor_Rep cr ON cr.Rep_id = tb.Rep_id JOIN (SELECT Project_id, Progress_percent FROM (SELECT pu.Project_id, pu.Progress_percent, ROW_NUMBER() OVER (PARTITION BY pu.Project_id ORDER BY pu.Update_date DESC NULLS LAST, pu.Update_id DESC) AS Row_rank FROM Project_Update pu WHERE pu.Progress_percent IS NOT NULL) WHERE Row_rank = 1) latest ON latest.Project_id = cp.Project_id WHERE t.Emp_id = :scope_id OR ta.Emp_id = :scope_id OR EXISTS (SELECT 1 FROM Supervises s WHERE s.Emp_id = :scope_id AND s.Contractor_id = cr.Contractor_id) ORDER BY cp.Project_name"
        ]
    ];
    $lineQueries = [
        'payments' => [
            'title' => 'Verified payment value over time',
            'unit' => 'currency',
            'sql' => "SELECT TO_CHAR(Verified_at, 'YYYY-MM') AS Label, SUM(Amount) AS Metric_value FROM Payments WHERE Verified_by_Emp_id = :scope_id AND Payment_status = 'Verified' AND Verified_at IS NOT NULL GROUP BY TO_CHAR(Verified_at, 'YYYY-MM') ORDER BY Label"
        ],
        'complaints' => [
            'title' => 'Assigned complaints filed over time',
            'unit' => 'records',
            'sql' => "SELECT TO_CHAR(Filed_date, 'YYYY-MM') AS Label, COUNT(*) AS Metric_value FROM Complaints WHERE Resolved_by_Emp_id = :scope_id AND Filed_date IS NOT NULL GROUP BY TO_CHAR(Filed_date, 'YYYY-MM') ORDER BY Label"
        ],
        'projects' => [
            'title' => 'Relevant portfolio progress over time',
            'unit' => 'percent',
            'sql' => "SELECT TO_CHAR(pu.Update_date, 'YYYY-MM-DD') AS Label, ROUND(AVG(pu.Progress_percent), 1) AS Metric_value FROM Project_Update pu JOIN Construction_Project cp ON cp.Project_id = pu.Project_id JOIN Tender_Award ta ON ta.Award_id = cp.Award_id JOIN Tender_Bids tb ON tb.Tender_id = ta.Tender_id AND tb.Bid_id = ta.Bid_id JOIN Tenders t ON t.Tender_id = ta.Tender_id JOIN Contractor_Rep cr ON cr.Rep_id = tb.Rep_id WHERE pu.Update_date IS NOT NULL AND pu.Progress_percent IS NOT NULL AND (t.Emp_id = :scope_id OR ta.Emp_id = :scope_id OR EXISTS (SELECT 1 FROM Supervises s WHERE s.Emp_id = :scope_id AND s.Contractor_id = cr.Contractor_id)) GROUP BY TO_CHAR(pu.Update_date, 'YYYY-MM-DD') ORDER BY Label"
        ]
    ];
    $barConfig = $barQueries[$module] ?? null;
    $lineConfig = $lineQueries[$module] ?? null;
} elseif ($role === 'admin') {
    $queries = [
        'people' => 'SELECT Dept_name AS Label, COUNT(*) AS Record_count FROM Employee GROUP BY Dept_name ORDER BY Dept_name',
        'contractors' => 'SELECT Approval_status AS Label, COUNT(*) AS Record_count FROM Contractor_Rep GROUP BY Approval_status ORDER BY Approval_status',
        'portfolio' => 'SELECT Status AS Label, COUNT(*) AS Record_count FROM Construction_Project GROUP BY Status ORDER BY Status',
        'allocations' => "SELECT CASE WHEN ca.Booking_id IS NULL THEN 'Pending' ELSE 'Confirmed' END AS Label, COUNT(*) AS Record_count FROM Booking b LEFT JOIN Confirm_Allocation ca ON ca.Booking_id = b.Booking_id GROUP BY CASE WHEN ca.Booking_id IS NULL THEN 'Pending' ELSE 'Confirmed' END",
        'finance' => 'SELECT Payment_status AS Label, COUNT(*) AS Record_count FROM Payments GROUP BY Payment_status ORDER BY Payment_status',
        'complaints' => 'SELECT Status AS Label, COUNT(*) AS Record_count FROM Complaints GROUP BY Status ORDER BY Status',
        'tenders' => 'SELECT Status AS Label, COUNT(*) AS Record_count FROM Tenders GROUP BY Status ORDER BY Status'
    ];
    $sql = $queries[$module] ?? '';
    $barQueries = [
        'people' => ['title' => 'Employees by department', 'unit' => 'records', 'sql' => 'SELECT Dept_name AS Label, COUNT(*) AS Metric_value FROM Employee GROUP BY Dept_name ORDER BY Dept_name'],
        'contractors' => ['title' => 'Representatives by contractor', 'unit' => 'records', 'sql' => 'SELECT c.Company_name AS Label, COUNT(cr.Rep_id) AS Metric_value FROM Contractor c LEFT JOIN Contractor_Rep cr ON cr.Contractor_id = c.Contractor_id GROUP BY c.Company_name ORDER BY c.Company_name'],
        'portfolio' => ['title' => 'Latest recorded project progress', 'unit' => 'percent', 'sql' => "SELECT cp.Project_name AS Label, latest.Progress_percent AS Metric_value FROM Construction_Project cp JOIN (SELECT Project_id, Progress_percent FROM (SELECT pu.Project_id, pu.Progress_percent, ROW_NUMBER() OVER (PARTITION BY pu.Project_id ORDER BY pu.Update_date DESC NULLS LAST, pu.Update_id DESC) AS Row_rank FROM Project_Update pu WHERE pu.Progress_percent IS NOT NULL) WHERE Row_rank = 1) latest ON latest.Project_id = cp.Project_id ORDER BY cp.Project_name"],
        'allocations' => ['title' => 'Bookings by project', 'unit' => 'records', 'sql' => 'SELECT cp.Project_name AS Label, COUNT(*) AS Metric_value FROM Booking b JOIN Construction_Project cp ON cp.Project_id = b.Project_id GROUP BY cp.Project_name ORDER BY cp.Project_name'],
        'finance' => ['title' => 'Payment amount by status', 'unit' => 'currency', 'sql' => "SELECT NVL(Payment_status, 'Unspecified') AS Label, SUM(Amount) AS Metric_value FROM Payments GROUP BY Payment_status ORDER BY Payment_status"],
        'tenders' => ['title' => 'Bids received by tender', 'unit' => 'records', 'sql' => "SELECT t.Title || ' (' || t.Tender_id || ')' AS Label, COUNT(tb.Bid_id) AS Metric_value FROM Tenders t LEFT JOIN Tender_Bids tb ON tb.Tender_id = t.Tender_id GROUP BY t.Tender_id, t.Title ORDER BY t.Tender_id"]
    ];
    $lineQueries = [
        'portfolio' => ['title' => 'Portfolio progress over time', 'unit' => 'percent', 'sql' => "SELECT TO_CHAR(Update_date, 'YYYY-MM-DD') AS Label, ROUND(AVG(Progress_percent), 1) AS Metric_value FROM Project_Update WHERE Update_date IS NOT NULL AND Progress_percent IS NOT NULL GROUP BY TO_CHAR(Update_date, 'YYYY-MM-DD') ORDER BY Label"],
        'finance' => ['title' => 'Verified payment value over time', 'unit' => 'currency', 'sql' => "SELECT TO_CHAR(Verified_at, 'YYYY-MM') AS Label, SUM(Amount) AS Metric_value FROM Payments WHERE Payment_status = 'Verified' AND Verified_at IS NOT NULL GROUP BY TO_CHAR(Verified_at, 'YYYY-MM') ORDER BY Label"],
        'complaints' => ['title' => 'Complaints filed over time', 'unit' => 'records', 'sql' => "SELECT TO_CHAR(Filed_date, 'YYYY-MM') AS Label, COUNT(*) AS Metric_value FROM Complaints WHERE Filed_date IS NOT NULL GROUP BY TO_CHAR(Filed_date, 'YYYY-MM') ORDER BY Label"]
    ];
    $barConfig = $barQueries[$module] ?? null;
    $lineConfig = $lineQueries[$module] ?? null;
} elseif ($role === 'client') {
    $bindScope = true;
    $queries = [
        'bookings' => "SELECT CASE WHEN ca.Booking_id IS NULL THEN 'Awaiting allocation' ELSE 'Allocated' END AS Label, COUNT(*) AS Record_count FROM Booking b LEFT JOIN Confirm_Allocation ca ON ca.Booking_id = b.Booking_id WHERE b.Cl_id = :scope_id GROUP BY CASE WHEN ca.Booking_id IS NULL THEN 'Awaiting allocation' ELSE 'Allocated' END",
        'payments' => 'SELECT Payment_status AS Label, COUNT(*) AS Record_count FROM Payments WHERE Cl_id = :scope_id GROUP BY Payment_status ORDER BY Payment_status',
        'complaints' => 'SELECT Status AS Label, COUNT(*) AS Record_count FROM Complaints WHERE Cl_id = :scope_id GROUP BY Status ORDER BY Status'
    ];
    $sql = $queries[$module] ?? '';
    $barQueries = [
        'bookings' => ['title' => 'Booked value by project', 'unit' => 'currency', 'sql' => 'SELECT cp.Project_name AS Label, SUM(b.Due_amount) AS Metric_value FROM Booking b JOIN Construction_Project cp ON cp.Project_id = b.Project_id WHERE b.Cl_id = :scope_id GROUP BY cp.Project_name ORDER BY cp.Project_name'],
        'payments' => ['title' => 'My payment amount by status', 'unit' => 'currency', 'sql' => "SELECT NVL(Payment_status, 'Unspecified') AS Label, SUM(Amount) AS Metric_value FROM Payments WHERE Cl_id = :scope_id GROUP BY Payment_status ORDER BY Payment_status"]
    ];
    $lineQueries = [
        'bookings' => ['title' => 'Bookings created over time', 'unit' => 'records', 'sql' => "SELECT TO_CHAR(Booking_date, 'YYYY-MM') AS Label, COUNT(*) AS Metric_value FROM Booking WHERE Cl_id = :scope_id AND Booking_date IS NOT NULL GROUP BY TO_CHAR(Booking_date, 'YYYY-MM') ORDER BY Label"],
        'payments' => ['title' => 'Verified payment value over time', 'unit' => 'currency', 'sql' => "SELECT TO_CHAR(Verified_at, 'YYYY-MM') AS Label, SUM(Amount) AS Metric_value FROM Payments WHERE Cl_id = :scope_id AND Payment_status = 'Verified' AND Verified_at IS NOT NULL GROUP BY TO_CHAR(Verified_at, 'YYYY-MM') ORDER BY Label"],
        'complaints' => ['title' => 'My complaints filed over time', 'unit' => 'records', 'sql' => "SELECT TO_CHAR(Filed_date, 'YYYY-MM') AS Label, COUNT(*) AS Metric_value FROM Complaints WHERE Cl_id = :scope_id AND Filed_date IS NOT NULL GROUP BY TO_CHAR(Filed_date, 'YYYY-MM') ORDER BY Label"]
    ];
    $barConfig = $barQueries[$module] ?? null;
    $lineConfig = $lineQueries[$module] ?? null;
} elseif ($role === 'contractor') {
    policy_require_approved_representative($conn, $scopeId);
    $bindScope = true;
    $queries = [
        'tenders' => "SELECT CASE WHEN EXISTS (SELECT 1 FROM Tender_Bids own_bid WHERE own_bid.Tender_id = t.Tender_id AND own_bid.Rep_id = :scope_id) THEN 'Bid submitted' ELSE 'Available to bid' END AS Label, COUNT(*) AS Record_count FROM Tenders t WHERE t.Status = 'Published' AND t.Deadline >= TRUNC(SYSDATE) AND NOT EXISTS (SELECT 1 FROM Tender_Award ta WHERE ta.Tender_id = t.Tender_id) GROUP BY CASE WHEN EXISTS (SELECT 1 FROM Tender_Bids own_bid WHERE own_bid.Tender_id = t.Tender_id AND own_bid.Rep_id = :scope_id) THEN 'Bid submitted' ELSE 'Available to bid' END",
        'bids' => 'SELECT Bid_status AS Label, COUNT(*) AS Record_count FROM Tender_Bids WHERE Rep_id = :scope_id GROUP BY Bid_status ORDER BY Bid_status',
        'projects' => 'SELECT cp.Status AS Label, COUNT(*) AS Record_count FROM Tender_Bids tb JOIN Tender_Award ta ON ta.Tender_id = tb.Tender_id AND ta.Bid_id = tb.Bid_id JOIN Construction_Project cp ON cp.Award_id = ta.Award_id WHERE tb.Rep_id = :scope_id GROUP BY cp.Status ORDER BY cp.Status',
        'updates' => 'SELECT cp.Status AS Label, COUNT(*) AS Record_count FROM Tender_Bids tb JOIN Tender_Award ta ON ta.Tender_id = tb.Tender_id AND ta.Bid_id = tb.Bid_id JOIN Construction_Project cp ON cp.Award_id = ta.Award_id WHERE tb.Rep_id = :scope_id GROUP BY cp.Status ORDER BY cp.Status'
    ];
    $sql = $queries[$module] ?? '';
    $barQueries = [
        'tenders' => ['title' => 'Competition by open tender', 'unit' => 'records', 'sql' => "SELECT t.Title || ' (' || t.Tender_id || ')' AS Label, COUNT(tb.Bid_id) AS Metric_value FROM Tenders t LEFT JOIN Tender_Bids tb ON tb.Tender_id = t.Tender_id WHERE t.Status = 'Published' AND t.Deadline >= TRUNC(SYSDATE) AND NOT EXISTS (SELECT 1 FROM Tender_Award ta WHERE ta.Tender_id = t.Tender_id) GROUP BY t.Tender_id, t.Title ORDER BY t.Tender_id", 'bind' => false],
        'bids' => ['title' => 'My bid amount by tender', 'unit' => 'currency', 'sql' => "SELECT t.Title || ' (' || t.Tender_id || ')' AS Label, SUM(tb.Bid_amount) AS Metric_value FROM Tender_Bids tb JOIN Tenders t ON t.Tender_id = tb.Tender_id WHERE tb.Rep_id = :scope_id GROUP BY t.Tender_id, t.Title ORDER BY t.Tender_id"],
        'projects' => ['title' => 'Latest recorded project progress', 'unit' => 'percent', 'sql' => "SELECT cp.Project_name AS Label, latest.Progress_percent AS Metric_value FROM Tender_Bids tb JOIN Tender_Award ta ON ta.Tender_id = tb.Tender_id AND ta.Bid_id = tb.Bid_id JOIN Construction_Project cp ON cp.Award_id = ta.Award_id JOIN (SELECT Project_id, Progress_percent FROM (SELECT pu.Project_id, pu.Progress_percent, ROW_NUMBER() OVER (PARTITION BY pu.Project_id ORDER BY pu.Update_date DESC NULLS LAST, pu.Update_id DESC) AS Row_rank FROM Project_Update pu WHERE pu.Progress_percent IS NOT NULL) WHERE Row_rank = 1) latest ON latest.Project_id = cp.Project_id WHERE tb.Rep_id = :scope_id ORDER BY cp.Project_name"],
        'updates' => ['title' => 'Latest recorded project progress', 'unit' => 'percent', 'sql' => "SELECT cp.Project_name AS Label, latest.Progress_percent AS Metric_value FROM Tender_Bids tb JOIN Tender_Award ta ON ta.Tender_id = tb.Tender_id AND ta.Bid_id = tb.Bid_id JOIN Construction_Project cp ON cp.Award_id = ta.Award_id JOIN (SELECT Project_id, Progress_percent FROM (SELECT pu.Project_id, pu.Progress_percent, ROW_NUMBER() OVER (PARTITION BY pu.Project_id ORDER BY pu.Update_date DESC NULLS LAST, pu.Update_id DESC) AS Row_rank FROM Project_Update pu WHERE pu.Progress_percent IS NOT NULL) WHERE Row_rank = 1) latest ON latest.Project_id = cp.Project_id WHERE tb.Rep_id = :scope_id ORDER BY cp.Project_name"]
    ];
    $lineQueries = [
        'projects' => ['title' => 'Awarded-project progress over time', 'unit' => 'percent', 'sql' => "SELECT TO_CHAR(pu.Update_date, 'YYYY-MM-DD') AS Label, ROUND(AVG(pu.Progress_percent), 1) AS Metric_value FROM Project_Update pu JOIN Construction_Project cp ON cp.Project_id = pu.Project_id JOIN Tender_Award ta ON ta.Award_id = cp.Award_id JOIN Tender_Bids tb ON tb.Tender_id = ta.Tender_id AND tb.Bid_id = ta.Bid_id WHERE tb.Rep_id = :scope_id AND pu.Update_date IS NOT NULL AND pu.Progress_percent IS NOT NULL GROUP BY TO_CHAR(pu.Update_date, 'YYYY-MM-DD') ORDER BY Label"],
        'updates' => ['title' => 'Awarded-project progress over time', 'unit' => 'percent', 'sql' => "SELECT TO_CHAR(pu.Update_date, 'YYYY-MM-DD') AS Label, ROUND(AVG(pu.Progress_percent), 1) AS Metric_value FROM Project_Update pu JOIN Construction_Project cp ON cp.Project_id = pu.Project_id JOIN Tender_Award ta ON ta.Award_id = cp.Award_id JOIN Tender_Bids tb ON tb.Tender_id = ta.Tender_id AND tb.Bid_id = ta.Bid_id WHERE tb.Rep_id = :scope_id AND pu.Update_date IS NOT NULL AND pu.Progress_percent IS NOT NULL GROUP BY TO_CHAR(pu.Update_date, 'YYYY-MM-DD') ORDER BY Label"]
    ];
    $barConfig = $barQueries[$module] ?? null;
    $lineConfig = $lineQueries[$module] ?? null;
}

if ($sql === '') {
    api_error(404, 'No visual summary is available for this module.', 'insight_not_found');
}
$titles = [
    'people' => 'Employees by department',
    'contractors' => 'Representative approval status',
    'portfolio' => 'Project status',
    'allocations' => 'Allocation status',
    'finance' => 'Payment status',
    'payments' => 'Payment status',
    'complaints' => 'Complaint status',
    'tenders' => 'Tender status',
    'bookings' => 'Allocation status',
    'bids' => 'Bid status',
    'projects' => 'Project status',
    'updates' => 'Awarded project status'
];
$title = $titles[$module] ?? $title;

$stmt = oci_parse($conn, $sql);
if ($bindScope) {
    oci_bind_by_name($stmt, ':scope_id', $scopeId);
}
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Module insight query failed');
}
$items = [];
$total = 0;
while ($row = oci_fetch_assoc($stmt)) {
    $count = (int)$row['RECORD_COUNT'];
    $items[] = ['label' => $row['LABEL'] ?: 'Unspecified', 'count' => $count];
    $total += $count;
}

$bar = null;
if ($barConfig) {
    $bar = [
        'title' => $barConfig['title'],
        'unit' => $barConfig['unit'],
        'items' => module_insight_metric_rows(
            $conn,
            $barConfig['sql'],
            $scopeId,
            $barConfig['bind'] ?? $bindScope,
            'Module bar chart query failed'
        )
    ];
}
$line = null;
if ($lineConfig) {
    $line = [
        'title' => $lineConfig['title'],
        'unit' => $lineConfig['unit'],
        'items' => module_insight_metric_rows(
            $conn,
            $lineConfig['sql'],
            $scopeId,
            $lineConfig['bind'] ?? $bindScope,
            'Module line chart query failed'
        )
    ];
}

api_response([
    'module' => $module,
    'title' => $title,
    'total' => $total,
    'items' => $items,
    'bar' => $bar,
    'line' => $line
]);
