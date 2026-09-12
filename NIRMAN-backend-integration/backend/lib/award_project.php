<?php

function award_project_execute($conn, $employeeId, $requireTenderOwnership)
{
    $tenderId = trim($_POST['tenderId'] ?? '');
    $bidId = trim($_POST['bidId'] ?? '');
    $awardId = trim($_POST['awardId'] ?? '');
    $awardAmount = trim($_POST['awardAmount'] ?? '');
    $awardDate = trim($_POST['awardDate'] ?? '');
    $projectId = trim($_POST['projectId'] ?? '');
    $areaId = trim($_POST['areaId'] ?? '');
    $projectName = trim($_POST['projectName'] ?? '');
    $projectBudget = trim($_POST['projectBudget'] ?? '');
    $projectDeadline = trim($_POST['projectDeadline'] ?? '');
    $projectStatus = trim($_POST['projectStatus'] ?? '');

    $required = [$tenderId, $bidId, $awardId, $awardAmount, $awardDate, $projectId,
        $areaId, $projectName, $projectBudget, $projectDeadline, $projectStatus];
    if (in_array('', $required, true)) {
        api_error(400, 'Complete every field before creating the award and project.', 'validation_error');
    }
    if (!preg_match('/^[A-Za-z0-9-]{1,10}$/', $awardId)
        || !preg_match('/^[A-Za-z0-9-]{1,10}$/', $projectId)) {
        api_error(400, 'Award and project IDs must use at most 10 letters, numbers, or hyphens.', 'validation_error');
    }
    if (!is_numeric($awardAmount) || (float)$awardAmount <= 0
        || !is_numeric($projectBudget) || (float)$projectBudget <= 0) {
        api_error(400, 'Award amount and project budget must be greater than zero.', 'validation_error');
    }
    if (!api_is_iso_date($awardDate) || !api_is_iso_date($projectDeadline)) {
        api_error(400, 'Award date and project deadline must be valid dates.', 'validation_error');
    }
    if ($projectDeadline < $awardDate) {
        api_error(400, 'Project deadline cannot be earlier than the award date.', 'validation_error');
    }
    if (strlen($projectName) > 80 || !in_array($projectStatus, ['Planned', 'In Progress', 'Completed'], true)) {
        api_error(400, 'Enter a valid project name and status.', 'validation_error');
    }

    $areaStmt = oci_parse($conn, 'SELECT Area_id FROM Area WHERE Area_id = :area_id');
    oci_bind_by_name($areaStmt, ':area_id', $areaId);
    if (!oci_execute($areaStmt, OCI_NO_AUTO_COMMIT)) {
        api_database_error($areaStmt, 'Award area lookup failed');
    }
    if (!oci_fetch_assoc($areaStmt)) {
        oci_rollback($conn);
        api_error(404, 'Selected area was not found.', 'area_not_found');
    }

    $selectionSql = "SELECT t.Status, t.Emp_id, tb.Bid_status
                     FROM Tenders t
                     JOIN Tender_Bids tb ON tb.Tender_id = t.Tender_id
                     WHERE t.Tender_id = :tender_id AND tb.Bid_id = :bid_id
                     FOR UPDATE OF t.Status, tb.Bid_status";
    $selectionStmt = oci_parse($conn, $selectionSql);
    oci_bind_by_name($selectionStmt, ':tender_id', $tenderId);
    oci_bind_by_name($selectionStmt, ':bid_id', $bidId);
    if (!oci_execute($selectionStmt, OCI_NO_AUTO_COMMIT)) {
        api_database_error($selectionStmt, 'Award bid lookup failed');
    }
    $selection = oci_fetch_assoc($selectionStmt);
    if (!$selection || ($requireTenderOwnership && $selection['EMP_ID'] !== $employeeId)) {
        oci_rollback($conn);
        api_error(404, 'Selected tender bid was not found.', 'bid_not_found');
    }
    if ($selection['STATUS'] === 'Awarded' || $selection['BID_STATUS'] !== 'Selected') {
        oci_rollback($conn);
        api_error(409, 'Only a selected bid on an unawarded tender can be awarded.', 'invalid_state');
    }

    $duplicateSql = "SELECT 'award' AS Duplicate_type FROM Tender_Award
                     WHERE Award_id = :award_id OR Tender_id = :tender_id
                     UNION ALL
                     SELECT 'project' FROM Construction_Project WHERE Project_id = :project_id";
    $duplicateStmt = oci_parse($conn, $duplicateSql);
    oci_bind_by_name($duplicateStmt, ':award_id', $awardId);
    oci_bind_by_name($duplicateStmt, ':tender_id', $tenderId);
    oci_bind_by_name($duplicateStmt, ':project_id', $projectId);
    if (!oci_execute($duplicateStmt, OCI_NO_AUTO_COMMIT)) {
        oci_rollback($conn);
        api_database_error($duplicateStmt, 'Award duplicate lookup failed');
    }
    $duplicate = oci_fetch_assoc($duplicateStmt);
    if ($duplicate) {
        oci_rollback($conn);
        $message = $duplicate['DUPLICATE_TYPE'] === 'project'
            ? 'Project ID already exists.'
            : 'This tender or award ID has already been awarded.';
        api_error(409, $message, 'duplicate_award');
    }

    $awardSql = "INSERT INTO Tender_Award
                    (Award_id, Tender_id, Bid_id, Emp_id, Award_amount, Award_date)
                 VALUES
                    (:award_id, :tender_id, :bid_id, :employee_id, :award_amount,
                     TO_DATE(:award_date, 'YYYY-MM-DD'))";
    $awardStmt = oci_parse($conn, $awardSql);
    oci_bind_by_name($awardStmt, ':award_id', $awardId);
    oci_bind_by_name($awardStmt, ':tender_id', $tenderId);
    oci_bind_by_name($awardStmt, ':bid_id', $bidId);
    oci_bind_by_name($awardStmt, ':employee_id', $employeeId);
    oci_bind_by_name($awardStmt, ':award_amount', $awardAmount);
    oci_bind_by_name($awardStmt, ':award_date', $awardDate);
    if (!oci_execute($awardStmt, OCI_NO_AUTO_COMMIT)) {
        oci_rollback($conn);
        api_database_error($awardStmt, 'Award creation failed');
    }

    $projectSql = "INSERT INTO Construction_Project
                      (Project_id, Award_id, Area_id, Project_Budget, Project_name, Deadline, Status)
                   VALUES
                      (:project_id, :award_id, :area_id, :project_budget, :project_name,
                       TO_DATE(:project_deadline, 'YYYY-MM-DD'), :project_status)";
    $projectStmt = oci_parse($conn, $projectSql);
    oci_bind_by_name($projectStmt, ':project_id', $projectId);
    oci_bind_by_name($projectStmt, ':award_id', $awardId);
    oci_bind_by_name($projectStmt, ':area_id', $areaId);
    oci_bind_by_name($projectStmt, ':project_budget', $projectBudget);
    oci_bind_by_name($projectStmt, ':project_name', $projectName);
    oci_bind_by_name($projectStmt, ':project_deadline', $projectDeadline);
    oci_bind_by_name($projectStmt, ':project_status', $projectStatus);
    if (!oci_execute($projectStmt, OCI_NO_AUTO_COMMIT)) {
        oci_rollback($conn);
        api_database_error($projectStmt, 'Construction project creation failed');
    }

    $rejectSql = 'BEGIN reject_competing_bids_proc(:tender_id, :bid_id); END;';
    $rejectStmt = oci_parse($conn, $rejectSql);
    oci_bind_by_name($rejectStmt, ':tender_id', $tenderId);
    oci_bind_by_name($rejectStmt, ':bid_id', $bidId);
    if (!oci_execute($rejectStmt, OCI_NO_AUTO_COMMIT)) {
        oci_rollback($conn);
        api_database_error($rejectStmt, 'Competing bid update failed');
    }

    $tenderStmt = oci_parse($conn, "UPDATE Tenders SET Status = 'Awarded'
                                    WHERE Tender_id = :tender_id AND Status <> 'Awarded'");
    oci_bind_by_name($tenderStmt, ':tender_id', $tenderId);
    if (!oci_execute($tenderStmt, OCI_NO_AUTO_COMMIT) || oci_num_rows($tenderStmt) !== 1) {
        oci_rollback($conn);
        api_database_error($tenderStmt, 'Tender award finalization failed');
    }

    oci_commit($conn);
    api_response(['success' => true, 'message' => 'Award and construction project created successfully.']);
}
