<?php

require_once __DIR__ . '/api.php';

function policy_require_approved_representative($conn, $representativeId)
{
    $stmt = oci_parse(
        $conn,
        "SELECT Approval_status FROM Contractor_Rep WHERE Rep_id = :rep_id"
    );
    oci_bind_by_name($stmt, ':rep_id', $representativeId);

    if (!oci_execute($stmt)) {
        api_database_error($stmt, 'Could not validate representative approval');
    }

    $row = oci_fetch_assoc($stmt);
    if (!$row || $row['APPROVAL_STATUS'] !== 'Approved') {
        api_error(403, 'This representative account is not approved.', 'representative_not_approved');
    }
}

function policy_client_owns_booking($conn, $clientId, $bookingId)
{
    $stmt = oci_parse(
        $conn,
        "SELECT Booking_id FROM Booking WHERE Booking_id = :booking_id AND Cl_id = :client_id"
    );
    oci_bind_by_name($stmt, ':booking_id', $bookingId);
    oci_bind_by_name($stmt, ':client_id', $clientId);

    if (!oci_execute($stmt)) {
        api_database_error($stmt, 'Could not validate booking ownership');
    }

    return (bool)oci_fetch_assoc($stmt);
}

function policy_employee_owns_tender($conn, $employeeId, $tenderId)
{
    $stmt = oci_parse(
        $conn,
        "SELECT Tender_id FROM Tenders WHERE Tender_id = :tender_id AND Emp_id = :employee_id"
    );
    oci_bind_by_name($stmt, ':tender_id', $tenderId);
    oci_bind_by_name($stmt, ':employee_id', $employeeId);

    if (!oci_execute($stmt)) {
        api_database_error($stmt, 'Could not validate tender ownership');
    }

    return (bool)oci_fetch_assoc($stmt);
}

function policy_representative_can_access_project($conn, $representativeId, $projectId)
{
    $sql = "SELECT cp.Project_id
            FROM Construction_Project cp
            JOIN Tender_Award ta ON ta.Award_id = cp.Award_id
            JOIN Tender_Bids tb ON tb.Tender_id = ta.Tender_id AND tb.Bid_id = ta.Bid_id
            WHERE cp.Project_id = :project_id
              AND tb.Rep_id = :rep_id";
    $stmt = oci_parse($conn, $sql);
    oci_bind_by_name($stmt, ':project_id', $projectId);
    oci_bind_by_name($stmt, ':rep_id', $representativeId);

    if (!oci_execute($stmt)) {
        api_database_error($stmt, 'Could not validate project access');
    }

    return (bool)oci_fetch_assoc($stmt);
}
