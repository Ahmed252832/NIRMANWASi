<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET'], false);
$conn = getConnection();

$sql = "SELECT
            (SELECT COUNT(*) FROM Construction_Project) AS Project_count,
            (SELECT COUNT(*) FROM Construction_Project WHERE Status <> 'Completed') AS Active_project_count,
            (SELECT COUNT(*) FROM Flats_Units u
             WHERE u.Status = 'Available'
               AND NOT EXISTS (SELECT 1 FROM Booking b WHERE b.Unit_id = u.Unit_id)) AS Available_unit_count,
            (SELECT COUNT(*) FROM Tenders t
             WHERE t.Status = 'Published'
               AND t.Deadline >= TRUNC(SYSDATE)
               AND NOT EXISTS (SELECT 1 FROM Tender_Award ta WHERE ta.Tender_id = t.Tender_id)) AS Open_tender_count,
            (SELECT COUNT(*) FROM Contractor) AS Contractor_count
        FROM dual";
$stmt = oci_parse($conn, $sql);
if (!oci_execute($stmt)) {
    api_database_error($stmt, 'Public summary query failed');
}
$row = oci_fetch_assoc($stmt);

api_response([
    'projectCount' => (int)$row['PROJECT_COUNT'],
    'activeProjectCount' => (int)$row['ACTIVE_PROJECT_COUNT'],
    'availableUnitCount' => (int)$row['AVAILABLE_UNIT_COUNT'],
    'openTenderCount' => (int)$row['OPEN_TENDER_COUNT'],
    'contractorCount' => (int)$row['CONTRACTOR_COUNT']
]);
