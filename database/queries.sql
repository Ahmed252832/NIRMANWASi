-- Query 1:
SELECT Person.First_Name,
       Person.Last_Name,
       Booking.Booking_id,
       Flats_Units.Unit_no,
       Flats_Units.Unit_type,
       Construction_Project.Project_name,
       Booking.Booking_status
FROM Person JOIN Client ON Person.Person_id = Client.Person_id JOIN Booking ON Client.Cl_id = Booking.Cl_id
    JOIN Flats_Units ON Booking.Unit_id = Flats_Units.Unit_id 
    JOIN Construction_Project ON Booking.Project_id = Construction_Project.Project_id;

-- Query 2:
SELECT Tenders.Tender_id,
       Tenders.Title,
       Tender_Bids.Bid_id,
       Tender_Bids.Bid_status,
       Tender_Bids.Bid_amount,
       Person.First_Name,
       Person.Last_Name,
       Contractor.Company_name
FROM Tenders JOIN Tender_Bids ON Tenders.Tender_id = Tender_Bids.Tender_id
JOIN Contractor_Rep ON Tender_Bids.Rep_id = Contractor_Rep.Rep_id
JOIN Person ON Contractor_Rep.Person_id = Person.Person_id
JOIN Contractor ON Contractor_Rep.Contractor_id = Contractor.Contractor_id;

-- Query 3: Show the average recorded progress for each project
SELECT Construction_Project.Project_id,
       Construction_Project.Project_name,
       Area.Road_Sector,
       COUNT(Project_Update.Update_id) AS Number_of_updates,
       ROUND(AVG(Project_Update.Progress_percent), 2) AS Average_progress
FROM Construction_Project JOIN Area ON Construction_Project.Area_id = Area.Area_id
JOIN Project_Update ON Construction_Project.Project_id = Project_Update.Project_id
GROUP BY Construction_Project.Project_id,
         Construction_Project.Project_name,
         Area.Road_Sector;

-- Query 4: Showing installment totals for payments that use installments
SELECT Payments.Cl_id,
       Person.First_Name,
       Person.Last_Name,
       Payments.Payment_id,
       Payments.Payment_status,
       COUNT(Installment.Installment_id) AS Number_of_installments,
       SUM(Installment.Amount) AS Total_installment_amount
FROM Person
JOIN Client
    ON Person.Person_id = Client.Person_id
JOIN Payments
    ON Client.Cl_id = Payments.Cl_id
JOIN Installment
    ON Payments.Cl_id = Installment.Cl_id
   AND Payments.Payment_id = Installment.Payment_id
GROUP BY Payments.Cl_id,
         Person.First_Name,
         Person.Last_Name,
         Payments.Payment_id,
         Payments.Payment_status;

-- Query 5: Show employees assigned to resolve more than one complaint
SELECT Employee.Emp_id,
       Person.First_Name,
       Person.Last_Name,
       COUNT(Complaints.Complaint_id) AS Complaint_count
FROM Employee
JOIN Person
    ON Employee.Person_id = Person.Person_id
JOIN Complaints
    ON Employee.Emp_id = Complaints.Resolved_by_Emp_id
GROUP BY Employee.Emp_id,
         Person.First_Name,
         Person.Last_Name
HAVING COUNT(Complaints.Complaint_id) > 1;
