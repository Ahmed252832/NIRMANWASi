<?php
require_once 'config/db.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['emp_id']) || $_SESSION['role'] !== 'employee') {
    echo json_encode(['loggedIn' => false]);
    exit;
}

$conn = getConnection();
$empId = isset($_GET['empId']) ? $_GET['empId'] : $_SESSION['emp_id'];

$sql1 = "SELECT COUNT(*) AS CNT FROM Booking b
         WHERE NOT EXISTS (
             SELECT 1 FROM Confirm_Allocation ca WHERE ca.Booking_id = b.Booking_id
         )";
$stmt1 = oci_parse($conn, $sql1);
oci_execute($stmt1);
$pendingAllocations = (int) oci_fetch_assoc($stmt1)['CNT'];

$sql2 = "SELECT COUNT(*) AS CNT FROM Payments WHERE Payment_status = 'Pending'";
$stmt2 = oci_parse($conn, $sql2);
oci_execute($stmt2);
$pendingPayments = (int) oci_fetch_assoc($stmt2)['CNT'];

$sql3 = "SELECT COUNT(*) AS CNT FROM Complaints WHERE Status <> 'Resolved'";
$stmt3 = oci_parse($conn, $sql3);
oci_execute($stmt3);
$pendingComplaints = (int) oci_fetch_assoc($stmt3)['CNT'];

$sql4 = "SELECT t.Tender_id, t.Title, t.Deadline, t.Status,
                (SELECT COUNT(*) FROM Tender_Bids tb WHERE tb.Tender_id = t.Tender_id) AS Bid_Count
         FROM Tenders t
         WHERE t.Emp_id = :empId
         ORDER BY t.Deadline";
$stmt4 = oci_parse($conn, $sql4);
oci_bind_by_name($stmt4, ':empId', $empId);
oci_execute($stmt4);
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

$sql5 = "SELECT cp.Project_id, cp.Project_name, cp.Status, cp.Deadline,
                NVL(MAX(pu.Progress_percent), 0) AS Progress
         FROM Construction_Project cp
         LEFT JOIN Project_Update pu ON pu.Project_id = cp.Project_id
         GROUP BY cp.Project_id, cp.Project_name, cp.Status, cp.Deadline
         ORDER BY cp.Project_id";
$stmt5 = oci_parse($conn, $sql5);
oci_execute($stmt5);
$projects = [];
while ($row = oci_fetch_assoc($stmt5)) {
    $projects[] = [
        'PROJECT_ID' => $row['PROJECT_ID'],
        'PROJECT_NAME' => $row['PROJECT_NAME'],
        'STATUS' => $row['STATUS'],
        'DEADLINE' => $row['DEADLINE'],
        'PROGRESS' => $row['PROGRESS'],
    ];
}

echo json_encode([
    'loggedIn' => true,
    'pendingAllocations' => $pendingAllocations,
    'pendingPayments' => $pendingPayments,
    'pendingComplaints' => $pendingComplaints,
    'ownTenders' => $ownTenders,
    'projects' => $projects
]);
