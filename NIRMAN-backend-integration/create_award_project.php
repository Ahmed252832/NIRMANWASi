<?php
require_once 'config/db.php';
$conn = getConnection();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Only POST requests are accepted.']);
    exit;
}

$tenderId = trim($_POST['tenderId'] ?? '');
$bidId = trim($_POST['bidId'] ?? '');
$awardId = trim($_POST['awardId'] ?? '');
$empId = trim($_POST['empId'] ?? '');
$awardAmount = trim($_POST['awardAmount'] ?? '');
$awardDate = trim($_POST['awardDate'] ?? '');
$projectId = trim($_POST['projectId'] ?? '');
$areaId = trim($_POST['areaId'] ?? '');
$projectName = trim($_POST['projectName'] ?? '');
$projectBudget = trim($_POST['projectBudget'] ?? '');
$projectDeadline = trim($_POST['projectDeadline'] ?? '');
$projectStatus = trim($_POST['projectStatus'] ?? '');

if ($tenderId === '' || $bidId === '' || $awardId === '' || $empId === '' || $awardAmount === '' || $awardDate === '' || $projectId === '' || $areaId === '' || $projectName === '' || $projectBudget === '' || $projectDeadline === '' || $projectStatus === '') {
    echo json_encode(['success' => false, 'message' => 'Complete every field before creating the award and project.']);
    exit;
}

if (!is_numeric($awardAmount) || (float) $awardAmount <= 0) {
    echo json_encode(['success' => false, 'message' => 'Award amount must be greater than zero.']);
    exit;
}

if (!is_numeric($projectBudget) || (float) $projectBudget <= 0) {
    echo json_encode(['success' => false, 'message' => 'Project budget must be greater than zero.']);
    exit;
}

$checkTenderSql = "SELECT Tender_id, Status FROM Tenders WHERE Tender_id = :p_tender_id";
$checkTenderStmt = oci_parse($conn, $checkTenderSql);
oci_bind_by_name($checkTenderStmt, ':p_tender_id', $tenderId);
oci_execute($checkTenderStmt);
$tenderRow = oci_fetch_assoc($checkTenderStmt);
if (!$tenderRow) {
    echo json_encode(['success' => false, 'message' => 'Selected tender does not exist.']);
    exit;
}
if ($tenderRow['STATUS'] === 'Awarded') {
    echo json_encode(['success' => false, 'message' => 'This tender has already been awarded.']);
    exit;
}

$checkBidSql = "SELECT Tender_id, Bid_id, Bid_status FROM Tender_Bids WHERE Tender_id = :p_tender_id AND Bid_id = :p_bid_id";
$checkBidStmt = oci_parse($conn, $checkBidSql);
oci_bind_by_name($checkBidStmt, ':p_tender_id', $tenderId);
oci_bind_by_name($checkBidStmt, ':p_bid_id', $bidId);
oci_execute($checkBidStmt);
$bidRow = oci_fetch_assoc($checkBidStmt);
if (!$bidRow) {
    echo json_encode(['success' => false, 'message' => 'The selected tender bid could not be found.']);
    exit;
}
if ($bidRow['BID_STATUS'] === 'Rejected') {
    echo json_encode(['success' => false, 'message' => 'Rejected bids cannot be awarded.']);
    exit;
}

$awardExistsSql = "SELECT Award_id FROM Tender_Award WHERE Tender_id = :p_tender_id AND Bid_id = :p_bid_id";
$awardExistsStmt = oci_parse($conn, $awardExistsSql);
oci_bind_by_name($awardExistsStmt, ':p_tender_id', $tenderId);
oci_bind_by_name($awardExistsStmt, ':p_bid_id', $bidId);
oci_execute($awardExistsStmt);
if (oci_fetch_assoc($awardExistsStmt)) {
    echo json_encode(['success' => false, 'message' => 'This bid already has an award.']);
    exit;
}

$awardIdExistsSql = "SELECT Award_id FROM Tender_Award WHERE Award_id = :p_award_id";
$awardIdExistsStmt = oci_parse($conn, $awardIdExistsSql);
oci_bind_by_name($awardIdExistsStmt, ':p_award_id', $awardId);
oci_execute($awardIdExistsStmt);
if (oci_fetch_assoc($awardIdExistsStmt)) {
    echo json_encode(['success' => false, 'message' => 'Award ID already exists.']);
    exit;
}

$projectIdExistsSql = "SELECT Project_id FROM Construction_Project WHERE Project_id = :p_project_id";
$projectIdExistsStmt = oci_parse($conn, $projectIdExistsSql);
oci_bind_by_name($projectIdExistsStmt, ':p_project_id', $projectId);
oci_execute($projectIdExistsStmt);
if (oci_fetch_assoc($projectIdExistsStmt)) {
    echo json_encode(['success' => false, 'message' => 'Project ID already exists.']);
    exit;
}

$areaExistsSql = "SELECT Area_id FROM Area WHERE Area_id = :p_area_id";
$areaExistsStmt = oci_parse($conn, $areaExistsSql);
oci_bind_by_name($areaExistsStmt, ':p_area_id', $areaId);
oci_execute($areaExistsStmt);
if (!oci_fetch_assoc($areaExistsStmt)) {
    echo json_encode(['success' => false, 'message' => 'Selected area does not exist.']);
    exit;
}

$employeeExistsSql = "SELECT Emp_id FROM Employee WHERE Emp_id = :p_emp_id";
$employeeExistsStmt = oci_parse($conn, $employeeExistsSql);
oci_bind_by_name($employeeExistsStmt, ':p_emp_id', $empId);
oci_execute($employeeExistsStmt);
if (!oci_fetch_assoc($employeeExistsStmt)) {
    echo json_encode(['success' => false, 'message' => 'Selected employee does not exist.']);
    exit;
}

oci_set_client_identifier($conn, 'award_project');
oci_execute(oci_parse($conn, 'BEGIN NULL; END;')); // initialize transaction context

$insertAwardSql = "INSERT INTO Tender_Award (Award_id, Tender_id, Bid_id, Emp_id, Award_amount, Award_date)
                  VALUES (:p_award_id, :p_tender_id, :p_bid_id, :p_emp_id, :p_award_amount, TO_DATE(:p_award_date, 'YYYY-MM-DD'))";
$insertAwardStmt = oci_parse($conn, $insertAwardSql);
oci_bind_by_name($insertAwardStmt, ':p_award_id', $awardId);
oci_bind_by_name($insertAwardStmt, ':p_tender_id', $tenderId);
oci_bind_by_name($insertAwardStmt, ':p_bid_id', $bidId);
oci_bind_by_name($insertAwardStmt, ':p_emp_id', $empId);
oci_bind_by_name($insertAwardStmt, ':p_award_amount', $awardAmount);
oci_bind_by_name($insertAwardStmt, ':p_award_date', $awardDate);

$insertProjectSql = "INSERT INTO Construction_Project (Project_id, Award_id, Area_id, Project_Budget, Project_name, Deadline, Status)
                    VALUES (:p_project_id, :p_award_id, :p_area_id, :p_project_budget, :p_project_name, TO_DATE(:p_project_deadline, 'YYYY-MM-DD'), :p_project_status)";
$insertProjectStmt = oci_parse($conn, $insertProjectSql);
oci_bind_by_name($insertProjectStmt, ':p_project_id', $projectId);
oci_bind_by_name($insertProjectStmt, ':p_award_id', $awardId);
oci_bind_by_name($insertProjectStmt, ':p_area_id', $areaId);
oci_bind_by_name($insertProjectStmt, ':p_project_budget', $projectBudget);
oci_bind_by_name($insertProjectStmt, ':p_project_name', $projectName);
oci_bind_by_name($insertProjectStmt, ':p_project_deadline', $projectDeadline);
oci_bind_by_name($insertProjectStmt, ':p_project_status', $projectStatus);

$updateBidSql = "UPDATE Tender_Bids SET Bid_status = 'Selected' WHERE Tender_id = :p_tender_id AND Bid_id = :p_bid_id";
$updateBidStmt = oci_parse($conn, $updateBidSql);
oci_bind_by_name($updateBidStmt, ':p_tender_id', $tenderId);
oci_bind_by_name($updateBidStmt, ':p_bid_id', $bidId);

$updateTenderSql = "UPDATE Tenders SET Status = 'Awarded' WHERE Tender_id = :p_tender_id";
$updateTenderStmt = oci_parse($conn, $updateTenderSql);
oci_bind_by_name($updateTenderStmt, ':p_tender_id', $tenderId);

$success = true;
if (!oci_execute($insertAwardStmt)) { $success = false; }
if ($success && !oci_execute($insertProjectStmt)) { $success = false; }
if ($success && !oci_execute($updateBidStmt)) { $success = false; }
if ($success && !oci_execute($updateTenderStmt)) { $success = false; }

if ($success) {
    oci_commit($conn);
    echo json_encode(['success' => true, 'message' => 'Award and construction project created successfully.']);
    exit;
}

oci_rollback($conn);
$error = oci_error($conn);
$message = isset($error['message']) ? $error['message'] : 'Unable to create award and project.';
echo json_encode(['success' => false, 'message' => $message]);
