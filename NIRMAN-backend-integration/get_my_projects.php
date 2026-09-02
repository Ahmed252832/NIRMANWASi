<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'contractor') {
    echo json_encode([]);
    exit;
}

$repId = $_SESSION['role_id'];

$sql = "SELECT cp.Project_id, cp.Project_name, cp.Project_budget, cp.Deadline, cp.Status,
               ta.Award_id, ta.Award_amount, ta.Award_date,
               tb.Tender_id, tb.Bid_id,
               a.Area_id, a.House_No, a.Road_Sector, a.Boundary_info, a.Latitude, a.Longitude
        FROM Tender_Bids tb
        JOIN Tender_Award ta ON ta.Tender_id = tb.Tender_id AND ta.Bid_id = tb.Bid_id
        JOIN Construction_Project cp ON cp.Award_id = ta.Award_id
        JOIN Area a ON a.Area_id = cp.Area_id
        WHERE tb.Rep_id = :p_rep_id
        ORDER BY cp.Project_id";

$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':p_rep_id', $repId);
oci_execute($stmt);

$projects = [];
while ($row = oci_fetch_assoc($stmt)) {
    $sql2 = "SELECT Update_id, Update_date, Work_note, Progress_percent
             FROM (
                 SELECT Update_id, Update_date, Work_note, Progress_percent
                 FROM Project_Update
                 WHERE Project_id = :p_project_id
                 ORDER BY Update_date DESC, Update_id DESC
             )
             WHERE ROWNUM = 1";
    $stmt2 = oci_parse($conn, $sql2);
    oci_bind_by_name($stmt2, ':p_project_id', $row['PROJECT_ID']);
    oci_execute($stmt2);
    $latest = oci_fetch_assoc($stmt2);

    $row['LATEST_UPDATE'] = $latest ?: null;
    $projects[] = $row;
}

echo json_encode($projects);
