<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/api.php';

api_bootstrap(['GET']);
api_require_role('employee');
$conn = getConnection();
$employeeId = $_SESSION['emp_id'];

function employee_workspace_rows($conn, $sql, &$employeeId, $context)
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

$scope = "WITH relevant_projects AS (
              SELECT DISTINCT cp.Project_id
              FROM Construction_Project cp
              JOIN Tender_Award ta ON ta.Award_id = cp.Award_id
              JOIN Tenders t ON t.Tender_id = ta.Tender_id
              WHERE t.Emp_id = :employee_id OR ta.Emp_id = :employee_id
              UNION
              SELECT DISTINCT cp.Project_id
              FROM Construction_Project cp
              JOIN Tender_Award ta ON ta.Award_id = cp.Award_id
              JOIN Tender_Bids tb ON tb.Tender_id = ta.Tender_id AND tb.Bid_id = ta.Bid_id
              JOIN Contractor_Rep cr ON cr.Rep_id = tb.Rep_id
              JOIN Supervises s ON s.Contractor_id = cr.Contractor_id
              WHERE s.Emp_id = :employee_id
          ) ";

$projectsSql = $scope . "
    SELECT cp.Project_id, cp.Award_id, cp.Area_id, cp.Project_Budget, cp.Project_name,
           TO_CHAR(cp.Deadline, 'YYYY-MM-DD') AS Deadline, cp.Status,
           a.House_No, a.Road_Sector,
           NVL((SELECT MAX(pu.Progress_percent) KEEP
                       (DENSE_RANK LAST ORDER BY pu.Update_date, pu.Update_id)
                FROM Project_Update pu WHERE pu.Project_id = cp.Project_id), 0) AS Latest_progress
    FROM Construction_Project cp
    JOIN relevant_projects rp ON rp.Project_id = cp.Project_id
    JOIN Area a ON a.Area_id = cp.Area_id
    ORDER BY cp.Project_id";

$areasSql = $scope . "
    SELECT a.Area_id, a.House_No, a.Road_Sector, a.Boundary_info, a.Latitude, a.Longitude,
           cp.Project_id, cp.Project_name
    FROM relevant_projects rp
    JOIN Construction_Project cp ON cp.Project_id = rp.Project_id
    JOIN Area a ON a.Area_id = cp.Area_id
    ORDER BY a.Area_id, cp.Project_id";

$updatesSql = $scope . "
    SELECT pu.Project_id, pu.Update_id, pu.Rep_id,
           TO_CHAR(pu.Update_date, 'YYYY-MM-DD') AS Update_date,
           pu.Work_note, pu.Progress_percent, cp.Project_name, p.First_Name, p.Last_Name
    FROM relevant_projects rp
    JOIN Project_Update pu ON pu.Project_id = rp.Project_id
    JOIN Construction_Project cp ON cp.Project_id = pu.Project_id
    JOIN Contractor_Rep cr ON cr.Rep_id = pu.Rep_id
    JOIN Person p ON p.Person_id = cr.Person_id
    ORDER BY pu.Project_id, pu.Update_date, pu.Update_id";

$unitsSql = $scope . "
    SELECT u.Unit_id, u.Unit_type, u.Unit_no, u.Status,
           b.Booking_id, b.Cl_id, b.Project_id, p.First_Name, p.Last_Name, cp.Project_name
    FROM relevant_projects rp
    JOIN Booking b ON b.Project_id = rp.Project_id
    JOIN Flats_Units u ON u.Unit_id = b.Unit_id
    JOIN Client c ON c.Cl_id = b.Cl_id
    JOIN Person p ON p.Person_id = c.Person_id
    JOIN Construction_Project cp ON cp.Project_id = b.Project_id
    ORDER BY u.Unit_id";

$awardsSql = $scope . "
    SELECT ta.Award_id, ta.Tender_id, ta.Bid_id, ta.Emp_id, ta.Award_amount,
           TO_CHAR(ta.Award_date, 'YYYY-MM-DD') AS Award_date,
           p.First_Name, p.Last_Name, cp.Project_id, cp.Project_name
    FROM relevant_projects rp
    JOIN Construction_Project cp ON cp.Project_id = rp.Project_id
    JOIN Tender_Award ta ON ta.Award_id = cp.Award_id
    JOIN Employee e ON e.Emp_id = ta.Emp_id
    JOIN Person p ON p.Person_id = e.Person_id
    ORDER BY ta.Award_id";

$bidsSql = $scope . "
    SELECT tb.Tender_id, tb.Bid_id, tb.Rep_id, tb.Bid_status, tb.Bid_amount,
           t.Title AS Tender_title, t.Status AS Tender_status,
           p.First_Name, p.Last_Name, c.Company_name, ta.Award_id
    FROM relevant_projects rp
    JOIN Construction_Project cp ON cp.Project_id = rp.Project_id
    JOIN Tender_Award ta ON ta.Award_id = cp.Award_id
    JOIN Tender_Bids tb ON tb.Tender_id = ta.Tender_id AND tb.Bid_id = ta.Bid_id
    JOIN Tenders t ON t.Tender_id = tb.Tender_id
    JOIN Contractor_Rep cr ON cr.Rep_id = tb.Rep_id
    JOIN Person p ON p.Person_id = cr.Person_id
    JOIN Contractor c ON c.Contractor_id = cr.Contractor_id
    ORDER BY tb.Tender_id, tb.Bid_id";

$contractorsSql = "SELECT DISTINCT c.Contractor_id, c.Company_name, c.License_no,
                          TO_CHAR(c.License_due, 'YYYY-MM-DD') AS License_due
                   FROM Contractor c
                   JOIN Contractor_Rep cr ON cr.Contractor_id = c.Contractor_id
                   WHERE EXISTS (
                       SELECT 1 FROM Supervises s
                       WHERE s.Contractor_id = c.Contractor_id AND s.Emp_id = :employee_id
                   ) OR EXISTS (
                       SELECT 1 FROM Tender_Bids tb
                       JOIN Tenders t ON t.Tender_id = tb.Tender_id
                       WHERE tb.Rep_id = cr.Rep_id AND t.Emp_id = :employee_id
                   )
                   ORDER BY c.Contractor_id";

$supervisionsSql = "SELECT s.Emp_id, s.Contractor_id, p.First_Name, p.Last_Name,
                           e.Designation, e.Dept_name, c.Company_name, c.License_no
                    FROM Supervises s
                    JOIN Employee e ON e.Emp_id = s.Emp_id
                    JOIN Person p ON p.Person_id = e.Person_id
                    JOIN Contractor c ON c.Contractor_id = s.Contractor_id
                    WHERE s.Emp_id = :employee_id
                    ORDER BY s.Contractor_id";

$representativesSql = "SELECT cr.Rep_id, cr.Title, cr.Approval_status, cr.Contractor_id,
                              p.First_Name, p.Last_Name, c.Company_name
                       FROM Contractor_Rep cr
                       JOIN Person p ON p.Person_id = cr.Person_id
                       JOIN Contractor c ON c.Contractor_id = cr.Contractor_id
                       WHERE EXISTS (
                           SELECT 1 FROM Supervises s
                           WHERE s.Contractor_id = cr.Contractor_id AND s.Emp_id = :employee_id
                       ) OR EXISTS (
                           SELECT 1 FROM Tender_Bids tb
                           JOIN Tenders t ON t.Tender_id = tb.Tender_id
                           WHERE tb.Rep_id = cr.Rep_id AND t.Emp_id = :employee_id
                       )
                       ORDER BY cr.Rep_id";

api_response([
    'projects' => employee_workspace_rows($conn, $projectsSql, $employeeId, 'Employee project list failed'),
    'areas' => employee_workspace_rows($conn, $areasSql, $employeeId, 'Employee project area list failed'),
    'updates' => employee_workspace_rows($conn, $updatesSql, $employeeId, 'Employee project update list failed'),
    'units' => employee_workspace_rows($conn, $unitsSql, $employeeId, 'Employee project unit list failed'),
    'awards' => employee_workspace_rows($conn, $awardsSql, $employeeId, 'Employee award list failed'),
    'bids' => employee_workspace_rows($conn, $bidsSql, $employeeId, 'Employee project bid list failed'),
    'contractors' => employee_workspace_rows($conn, $contractorsSql, $employeeId, 'Employee contractor list failed'),
    'supervisions' => employee_workspace_rows($conn, $supervisionsSql, $employeeId, 'Employee supervision list failed'),
    'representatives' => employee_workspace_rows($conn, $representativesSql, $employeeId, 'Employee representative list failed')
]);
