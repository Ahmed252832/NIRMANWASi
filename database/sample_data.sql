INSERT ALL
    INTO Person (Person_id, First_Name, Last_Name, Contact_no, Email, Password) VALUES ('P001', 'Arif', 'Rahman', '01711000001', 'arif@nirman.demo', 'employee123')
    INTO Person (Person_id, First_Name, Last_Name, Contact_no, Email, Password) VALUES ('P002', 'Nusrat', 'Jahan', '01711000002', 'nusrat@nirman.demo', 'employee123')
    INTO Person (Person_id, First_Name, Last_Name, Contact_no, Email, Password) VALUES ('P003', 'Farhan', 'Ahmed', '01711000003', 'farhan@nirman.demo', 'employee123')
    INTO Person (Person_id, First_Name, Last_Name, Contact_no, Email, Password) VALUES ('P004', 'Samira', 'Khan', '01812000001', 'samira@nirman.demo', 'client123')
    INTO Person (Person_id, First_Name, Last_Name, Contact_no, Email, Password) VALUES ('P005', 'Rafiul', 'Islam', '01812000002', 'rafiul@nirman.demo', 'client123')
    INTO Person (Person_id, First_Name, Last_Name, Contact_no, Email, Password) VALUES ('P006', 'Tanvir', 'Hasan', '01913000001', 'tanvir@nirman.demo', 'contractor123')
    INTO Person (Person_id, First_Name, Last_Name, Contact_no, Email, Password) VALUES ('P007', 'Mehedi', 'Chowdhury', '01913000002', 'mehedi@nirman.demo', 'contractor123')
    INTO Person (Person_id, First_Name, Last_Name, Contact_no, Email, Password) VALUES ('P008', 'Sadia', 'Karim', '01711000004', 'sadia@nirman.demo', 'employee123')
    INTO Person (Person_id, First_Name, Last_Name, Contact_no, Email, Password) VALUES ('P009', 'Ayesha', 'Noor', '01812000003', 'ayesha@nirman.demo', 'client123')
    INTO Person (Person_id, First_Name, Last_Name, Contact_no, Email, Password) VALUES ('P010', 'Imran', 'Hossain', '01913000003', 'imran@nirman.demo', 'contractor123')
    INTO Person (Person_id, First_Name, Last_Name, Contact_no, Email, Password) VALUES ('P011', 'Faria', 'Sultana', '01913000004', 'faria@nirman.demo', 'contractor123')
    INTO Person (Person_id, First_Name, Last_Name, Contact_no, Email, Password) VALUES ('P012', 'Kabir', 'Miah', '01913000005', 'kabir@nirman.demo', 'contractor123')
    INTO Person (Person_id, First_Name, Last_Name, Contact_no, Email, Password) VALUES ('P013', 'Maliha', 'Akter', '01812000004', 'maliha@nirman.demo', 'client123')
    INTO Person (Person_id, First_Name, Last_Name, Contact_no, Email, Password) VALUES ('P014', 'Omar', 'Faruk', '01812000005', 'omar@nirman.demo', 'client123')
    INTO Person (Person_id, First_Name, Last_Name, Contact_no, Email, Password) VALUES ('P015', 'Rumana', 'Haque', '01711000005', 'rumana@nirman.demo', 'employee123')
    INTO Person (Person_id, First_Name, Last_Name, Contact_no, Email, Password) VALUES ('P016', 'Shafiq', 'Alam', '01711000006', 'shafiq@nirman.demo', 'employee123')
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Department (Dept_name, Location, Email, Description) VALUES ('Operations', 'North Wing, Level 3', 'operations@nirman.demo', 'Coordinates allocation and operational review.')
    INTO Department (Dept_name, Location, Email, Description) VALUES ('Finance', 'East Wing, Level 2', 'finance@nirman.demo', 'Reviews payments and installment schedules.')
    INTO Department (Dept_name, Location, Email, Description) VALUES ('Engineering', 'Project Wing, Level 4', 'engineering@nirman.demo', 'Monitors construction work and progress.')
    INTO Department (Dept_name, Location, Email, Description) VALUES ('Client Services', 'Welcome Wing, Level 1', 'clients@nirman.demo', 'Supports bookings and client complaints.')
    INTO Department (Dept_name, Location, Email, Description) VALUES ('Procurement', 'West Wing, Level 2', 'procurement@nirman.demo', 'Coordinates tenders and contractor records.')
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Department_Phone (Dept_name, Phone_no) VALUES ('Operations', '02-55001001')
    INTO Department_Phone (Dept_name, Phone_no) VALUES ('Operations', '02-55001002')
    INTO Department_Phone (Dept_name, Phone_no) VALUES ('Finance', '02-55002001')
    INTO Department_Phone (Dept_name, Phone_no) VALUES ('Engineering', '02-55003001')
    INTO Department_Phone (Dept_name, Phone_no) VALUES ('Client Services', '02-55004001')
    INTO Department_Phone (Dept_name, Phone_no) VALUES ('Procurement', '02-55005001')
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Contractor (Contractor_id, Company_name, License_no, License_due) VALUES ('CT001', 'BuildCore Developments', 'LIC-BC-7841', TO_DATE('30-04-2027', 'DD-MM-YYYY'))
    INTO Contractor (Contractor_id, Company_name, License_no, License_due) VALUES ('CT002', 'UrbanAxis Engineering', 'LIC-UA-5528', TO_DATE('18-10-2026', 'DD-MM-YYYY'))
    INTO Contractor (Contractor_id, Company_name, License_no, License_due) VALUES ('CT003', 'StoneBridge Works', 'LIC-SB-4310', TO_DATE('12-02-2028', 'DD-MM-YYYY'))
    INTO Contractor (Contractor_id, Company_name, License_no, License_due) VALUES ('CT004', 'CivicLine Builders', 'LIC-CL-6254', TO_DATE('25-08-2027', 'DD-MM-YYYY'))
    INTO Contractor (Contractor_id, Company_name, License_no, License_due) VALUES ('CT005', 'NorthSpan Construction', 'LIC-NS-9182', TO_DATE('15-12-2027', 'DD-MM-YYYY'))
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Area (Area_id, Boundary_info, House_No, Road_Sector, Latitude, Longitude) VALUES ('AR001', 'North canal boundary to the central avenue corridor.', '18', 'Road 7, Central District', 23.780800, 90.407100)
    INTO Area (Area_id, Boundary_info, House_No, Road_Sector, Latitude, Longitude) VALUES ('AR002', 'Eastern residential block beside the waterfront road.', '42', 'Sector 11, East Quarter', 23.793400, 90.421200)
    INTO Area (Area_id, Boundary_info, House_No, Road_Sector, Latitude, Longitude) VALUES ('AR003', 'Southern block between the park and market road.', '7', 'Road 3, South Quarter', 23.742100, 90.389500)
    INTO Area (Area_id, Boundary_info, House_No, Road_Sector, Latitude, Longitude) VALUES ('AR004', 'Western block near the community lake.', '25', 'Avenue 5, West District', 23.768200, 90.351400)
    INTO Area (Area_id, Boundary_info, House_No, Road_Sector, Latitude, Longitude) VALUES ('AR005', 'Northern block beside the university road.', '63', 'Sector 4, North District', 23.821600, 90.402800)
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Flats_Units (Unit_id, Unit_type, Unit_no, Status) VALUES ('U001', 'Apartment', 'A-401', 'Reserved')
    INTO Flats_Units (Unit_id, Unit_type, Unit_no, Status) VALUES ('U002', 'Apartment', 'A-402', 'Reserved')
    INTO Flats_Units (Unit_id, Unit_type, Unit_no, Status) VALUES ('U003', 'Commercial', 'C-12', 'Allocated')
    INTO Flats_Units (Unit_id, Unit_type, Unit_no, Status) VALUES ('U004', 'Apartment', 'B-305', 'Allocated')
    INTO Flats_Units (Unit_id, Unit_type, Unit_no, Status) VALUES ('U005', 'Studio', 'S-08', 'Reserved')
    INTO Flats_Units (Unit_id, Unit_type, Unit_no, Status) VALUES ('U006', 'Parking', 'P-14', 'Available')
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Employee (Emp_id, Person_id, Dept_name, Designation, NID) VALUES ('E001', 'P001', 'Operations', 'Operations Manager', 'NID-EMP-1001')
    INTO Employee (Emp_id, Person_id, Dept_name, Designation, NID) VALUES ('E002', 'P002', 'Finance', 'Finance Officer', 'NID-EMP-1002')
    INTO Employee (Emp_id, Person_id, Dept_name, Designation, NID) VALUES ('E003', 'P003', 'Engineering', 'Project Engineer', 'NID-EMP-1003')
    INTO Employee (Emp_id, Person_id, Dept_name, Designation, NID) VALUES ('E004', 'P008', 'Client Services', 'Client Service Officer', 'NID-EMP-1004')
    INTO Employee (Emp_id, Person_id, Dept_name, Designation, NID) VALUES ('E005', 'P015', 'Procurement', 'Procurement Officer', 'NID-EMP-1005')
    INTO Employee (Emp_id, Person_id, Dept_name, Designation, NID) VALUES ('E006', 'P016', 'Engineering', 'Site Engineer', 'NID-EMP-1006')
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Contractor_Rep (Rep_id, Person_id, Contractor_id, Approval_status, Title) VALUES ('R001', 'P006', 'CT001', 'Approved', 'Site Representative')
    INTO Contractor_Rep (Rep_id, Person_id, Contractor_id, Approval_status, Title) VALUES ('R002', 'P007', 'CT002', 'Approved', 'Bid Coordinator')
    INTO Contractor_Rep (Rep_id, Person_id, Contractor_id, Approval_status, Title) VALUES ('R003', 'P010', 'CT003', 'Approved', 'Project Coordinator')
    INTO Contractor_Rep (Rep_id, Person_id, Contractor_id, Approval_status, Title) VALUES ('R004', 'P011', 'CT004', 'Approved', 'Contract Manager')
    INTO Contractor_Rep (Rep_id, Person_id, Contractor_id, Approval_status, Title) VALUES ('R005', 'P012', 'CT005', 'Approved', 'Site Coordinator')
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Client (Cl_id, Person_id, NID) VALUES ('C001', 'P004', 'NID-CLI-2001')
    INTO Client (Cl_id, Person_id, NID) VALUES ('C002', 'P005', 'NID-CLI-2002')
    INTO Client (Cl_id, Person_id, NID) VALUES ('C003', 'P009', 'NID-CLI-2003')
    INTO Client (Cl_id, Person_id, NID) VALUES ('C004', 'P013', 'NID-CLI-2004')
    INTO Client (Cl_id, Person_id, NID) VALUES ('C005', 'P014', 'NID-CLI-2005')
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Client_Contact_no (Cl_id, Contact_no) VALUES ('C001', '01812000001')
    INTO Client_Contact_no (Cl_id, Contact_no) VALUES ('C001', '01614000001')
    INTO Client_Contact_no (Cl_id, Contact_no) VALUES ('C002', '01812000002')
    INTO Client_Contact_no (Cl_id, Contact_no) VALUES ('C003', '01812000003')
    INTO Client_Contact_no (Cl_id, Contact_no) VALUES ('C004', '01812000004')
    INTO Client_Contact_no (Cl_id, Contact_no) VALUES ('C005', '01812000005')
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Work_Relation (Employee_id, Manager_id) VALUES ('E002', 'E001')
    INTO Work_Relation (Employee_id, Manager_id) VALUES ('E003', 'E001')
    INTO Work_Relation (Employee_id, Manager_id) VALUES ('E004', 'E001')
    INTO Work_Relation (Employee_id, Manager_id) VALUES ('E005', 'E001')
    INTO Work_Relation (Employee_id, Manager_id) VALUES ('E006', 'E003')
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Tenders (Tender_id, Emp_id, Deadline, Day, Title, Bid_Details, Status, Task) VALUES ('T001', 'E001', TO_DATE('15-09-2026', 'DD-MM-YYYY'), TO_DATE('10-07-2026', 'DD-MM-YYYY'), 'Riverside Foundation and Structural Works', 'Submit a structural work proposal with a schedule and resource plan.', 'Published', 'Foundation and concrete structure')
    INTO Tenders (Tender_id, Emp_id, Deadline, Day, Title, Bid_Details, Status, Task) VALUES ('T002', 'E003', TO_DATE('25-08-2026', 'DD-MM-YYYY'), TO_DATE('28-06-2026', 'DD-MM-YYYY'), 'Meridian Heights Finishing Package', 'Submit a proposal for interior finishing and common-area services.', 'Awarded', 'Architectural finishing')
    INTO Tenders (Tender_id, Emp_id, Deadline, Day, Title, Bid_Details, Status, Task) VALUES ('T003', 'E001', TO_DATE('30-05-2026', 'DD-MM-YYYY'), TO_DATE('12-04-2026', 'DD-MM-YYYY'), 'Harborline Residential Construction', 'Submit a proposal for residential block construction.', 'Awarded', 'Residential building construction')
    INTO Tenders (Tender_id, Emp_id, Deadline, Day, Title, Bid_Details, Status, Task) VALUES ('T004', 'E005', TO_DATE('20-10-2026', 'DD-MM-YYYY'), TO_DATE('01-08-2026', 'DD-MM-YYYY'), 'Green Court Utility Works', 'Submit a proposal for utility lines and service areas.', 'Awarded', 'Utility installation')
    INTO Tenders (Tender_id, Emp_id, Deadline, Day, Title, Bid_Details, Status, Task) VALUES ('T005', 'E003', TO_DATE('05-11-2026', 'DD-MM-YYYY'), TO_DATE('15-08-2026', 'DD-MM-YYYY'), 'North Point Site Development', 'Submit a proposal for site preparation and access roads.', 'Awarded', 'Site preparation')
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Supervises (Emp_id, Contractor_id) VALUES ('E001', 'CT001')
    INTO Supervises (Emp_id, Contractor_id) VALUES ('E003', 'CT001')
    INTO Supervises (Emp_id, Contractor_id) VALUES ('E001', 'CT002')
    INTO Supervises (Emp_id, Contractor_id) VALUES ('E006', 'CT004')
    INTO Supervises (Emp_id, Contractor_id) VALUES ('E005', 'CT005')
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Tender_Bids (Tender_id, Bid_id, Rep_id, Bid_status, Bid_amount) VALUES ('T001', 'B001', 'R001', 'Under Review', 48500000)
    INTO Tender_Bids (Tender_id, Bid_id, Rep_id, Bid_status, Bid_amount) VALUES ('T001', 'B002', 'R002', 'Selected', 47250000)
    INTO Tender_Bids (Tender_id, Bid_id, Rep_id, Bid_status, Bid_amount) VALUES ('T002', 'B001', 'R001', 'Selected', 30750000)
    INTO Tender_Bids (Tender_id, Bid_id, Rep_id, Bid_status, Bid_amount) VALUES ('T003', 'B001', 'R003', 'Selected', 26750000)
    INTO Tender_Bids (Tender_id, Bid_id, Rep_id, Bid_status, Bid_amount) VALUES ('T004', 'B001', 'R004', 'Selected', 18500000)
    INTO Tender_Bids (Tender_id, Bid_id, Rep_id, Bid_status, Bid_amount) VALUES ('T005', 'B001', 'R005', 'Selected', 22000000)
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Tender_Award (Award_id, Tender_id, Bid_id, Emp_id, Award_amount, Award_date) VALUES ('A001', 'T002', 'B001', 'E001', 30750000, TO_DATE('30-06-2026', 'DD-MM-YYYY'))
    INTO Tender_Award (Award_id, Tender_id, Bid_id, Emp_id, Award_amount, Award_date) VALUES ('A002', 'T003', 'B001', 'E003', 26750000, TO_DATE('04-06-2026', 'DD-MM-YYYY'))
    INTO Tender_Award (Award_id, Tender_id, Bid_id, Emp_id, Award_amount, Award_date) VALUES ('A003', 'T001', 'B002', 'E001', 47250000, TO_DATE('18-09-2026', 'DD-MM-YYYY'))
    INTO Tender_Award (Award_id, Tender_id, Bid_id, Emp_id, Award_amount, Award_date) VALUES ('A004', 'T004', 'B001', 'E005', 18500000, TO_DATE('22-10-2026', 'DD-MM-YYYY'))
    INTO Tender_Award (Award_id, Tender_id, Bid_id, Emp_id, Award_amount, Award_date) VALUES ('A005', 'T005', 'B001', 'E003', 22000000, TO_DATE('08-11-2026', 'DD-MM-YYYY'))
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Construction_Project (Project_id, Award_id, Area_id, Project_Budget, Project_name, Deadline, Status) VALUES ('PR001', 'A001', 'AR001', 35000000, 'Meridian Heights', TO_DATE('30-03-2027', 'DD-MM-YYYY'), 'In Progress')
    INTO Construction_Project (Project_id, Award_id, Area_id, Project_Budget, Project_name, Deadline, Status) VALUES ('PR002', 'A002', 'AR002', 28000000, 'Harborline Residences', TO_DATE('15-07-2027', 'DD-MM-YYYY'), 'In Progress')
    INTO Construction_Project (Project_id, Award_id, Area_id, Project_Budget, Project_name, Deadline, Status) VALUES ('PR003', 'A003', 'AR003', 50000000, 'Riverside Court', TO_DATE('20-12-2027', 'DD-MM-YYYY'), 'Planned')
    INTO Construction_Project (Project_id, Award_id, Area_id, Project_Budget, Project_name, Deadline, Status) VALUES ('PR004', 'A004', 'AR004', 21000000, 'Green Court', TO_DATE('10-09-2027', 'DD-MM-YYYY'), 'In Progress')
    INTO Construction_Project (Project_id, Award_id, Area_id, Project_Budget, Project_name, Deadline, Status) VALUES ('PR005', 'A005', 'AR005', 24500000, 'North Point Homes', TO_DATE('25-11-2027', 'DD-MM-YYYY'), 'Planned')
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Booking (Booking_id, Cl_id, Unit_id, Project_id, Booking_status, Booking_date, Due_amount) VALUES ('BK001', 'C001', 'U002', 'PR001', 'Confirmed', TO_DATE('20-07-2026', 'DD-MM-YYYY'), 8500000)
    INTO Booking (Booking_id, Cl_id, Unit_id, Project_id, Booking_status, Booking_date, Due_amount) VALUES ('BK002', 'C002', 'U004', 'PR002', 'Confirmed', TO_DATE('02-08-2026', 'DD-MM-YYYY'), 6200000)
    INTO Booking (Booking_id, Cl_id, Unit_id, Project_id, Booking_status, Booking_date, Due_amount) VALUES ('BK003', 'C003', 'U001', 'PR003', 'Confirmed', TO_DATE('12-09-2026', 'DD-MM-YYYY'), 7200000)
    INTO Booking (Booking_id, Cl_id, Unit_id, Project_id, Booking_status, Booking_date, Due_amount) VALUES ('BK004', 'C004', 'U003', 'PR004', 'Confirmed', TO_DATE('28-10-2026', 'DD-MM-YYYY'), 5400000)
    INTO Booking (Booking_id, Cl_id, Unit_id, Project_id, Booking_status, Booking_date, Due_amount) VALUES ('BK005', 'C005', 'U005', 'PR005', 'Confirmed', TO_DATE('14-11-2026', 'DD-MM-YYYY'), 4800000)
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Confirm_Allocation (Booking_id, Emp_id) VALUES ('BK001', 'E004')
    INTO Confirm_Allocation (Booking_id, Emp_id) VALUES ('BK002', 'E004')
    INTO Confirm_Allocation (Booking_id, Emp_id) VALUES ('BK003', 'E001')
    INTO Confirm_Allocation (Booking_id, Emp_id) VALUES ('BK004', 'E004')
    INTO Confirm_Allocation (Booking_id, Emp_id) VALUES ('BK005', 'E001')
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Payments (Cl_id, Payment_id, Booking_id, Verified_by_Emp_id, Payment_status, Verified_at, Payment_method, Amount, Payment_due) VALUES ('C001', 'PAY001', 'BK001', 'E002', 'Verified', TO_DATE('22-07-2026 11:30', 'DD-MM-YYYY HH24:MI'), 'Bank Transfer', 3000000, TO_DATE('25-07-2026', 'DD-MM-YYYY'))
    INTO Payments (Cl_id, Payment_id, Booking_id, Verified_by_Emp_id, Payment_status, Verified_at, Payment_method, Amount, Payment_due) VALUES ('C001', 'PAY002', 'BK001', 'E002', 'Pending', NULL, 'Installment Plan', 3000000, TO_DATE('25-10-2026', 'DD-MM-YYYY'))
    INTO Payments (Cl_id, Payment_id, Booking_id, Verified_by_Emp_id, Payment_status, Verified_at, Payment_method, Amount, Payment_due) VALUES ('C002', 'PAY001', 'BK002', 'E002', 'Pending', NULL, 'Bank Transfer', 1600000, TO_DATE('20-08-2026', 'DD-MM-YYYY'))
    INTO Payments (Cl_id, Payment_id, Booking_id, Verified_by_Emp_id, Payment_status, Verified_at, Payment_method, Amount, Payment_due) VALUES ('C003', 'PAY001', 'BK003', 'E002', 'Verified', TO_DATE('15-09-2026 10:15', 'DD-MM-YYYY HH24:MI'), 'Bank Transfer', 2000000, TO_DATE('15-09-2026', 'DD-MM-YYYY'))
    INTO Payments (Cl_id, Payment_id, Booking_id, Verified_by_Emp_id, Payment_status, Verified_at, Payment_method, Amount, Payment_due) VALUES ('C004', 'PAY001', 'BK004', 'E002', 'Verified', TO_DATE('30-10-2026 14:20', 'DD-MM-YYYY HH24:MI'), 'Cheque', 1800000, TO_DATE('30-10-2026', 'DD-MM-YYYY'))
    INTO Payments (Cl_id, Payment_id, Booking_id, Verified_by_Emp_id, Payment_status, Verified_at, Payment_method, Amount, Payment_due) VALUES ('C005', 'PAY001', 'BK005', 'E002', 'Pending', NULL, 'Installment Plan', 1600000, TO_DATE('20-11-2026', 'DD-MM-YYYY'))
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Installment (Cl_id, Payment_id, Installment_id, Amount, Due_date, Status, Expired_at) VALUES ('C001', 'PAY002', 'I001', 1500000, TO_DATE('25-09-2026', 'DD-MM-YYYY'), 'Upcoming', NULL)
    INTO Installment (Cl_id, Payment_id, Installment_id, Amount, Due_date, Status, Expired_at) VALUES ('C001', 'PAY002', 'I002', 1500000, TO_DATE('25-10-2026', 'DD-MM-YYYY'), 'Upcoming', NULL)
    INTO Installment (Cl_id, Payment_id, Installment_id, Amount, Due_date, Status, Expired_at) VALUES ('C002', 'PAY001', 'I001', 800000, TO_DATE('20-08-2026', 'DD-MM-YYYY'), 'Pending', NULL)
    INTO Installment (Cl_id, Payment_id, Installment_id, Amount, Due_date, Status, Expired_at) VALUES ('C002', 'PAY001', 'I002', 800000, TO_DATE('20-09-2026', 'DD-MM-YYYY'), 'Upcoming', NULL)
    INTO Installment (Cl_id, Payment_id, Installment_id, Amount, Due_date, Status, Expired_at) VALUES ('C003', 'PAY001', 'I001', 1000000, TO_DATE('15-10-2026', 'DD-MM-YYYY'), 'Upcoming', NULL)
    INTO Installment (Cl_id, Payment_id, Installment_id, Amount, Due_date, Status, Expired_at) VALUES ('C005', 'PAY001', 'I001', 800000, TO_DATE('20-12-2026', 'DD-MM-YYYY'), 'Upcoming', NULL)
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Complaints (Complaint_id, Cl_id, Resolved_by_Emp_id, Status, Filed_date, Note, Resolution) VALUES ('CMP001', 'C001', 'E004', 'Pending', TO_DATE('05-08-2026', 'DD-MM-YYYY'), 'Please confirm when the allocation document will be available.', NULL)
    INTO Complaints (Complaint_id, Cl_id, Resolved_by_Emp_id, Status, Filed_date, Note, Resolution) VALUES ('CMP002', 'C002', 'E004', 'Resolved', TO_DATE('19-07-2026', 'DD-MM-YYYY'), 'The payment schedule was not visible.', 'The installment schedule was shared with the client.')
    INTO Complaints (Complaint_id, Cl_id, Resolved_by_Emp_id, Status, Filed_date, Note, Resolution) VALUES ('CMP003', 'C003', 'E004', 'Resolved', TO_DATE('18-09-2026', 'DD-MM-YYYY'), 'The booking confirmation email was delayed.', 'The confirmation was checked and sent again.')
    INTO Complaints (Complaint_id, Cl_id, Resolved_by_Emp_id, Status, Filed_date, Note, Resolution) VALUES ('CMP004', 'C004', 'E001', 'Pending', TO_DATE('02-11-2026', 'DD-MM-YYYY'), 'Please review the unit allocation details.', NULL)
    INTO Complaints (Complaint_id, Cl_id, Resolved_by_Emp_id, Status, Filed_date, Note, Resolution) VALUES ('CMP005', 'C005', 'E004', 'Resolved', TO_DATE('22-11-2026', 'DD-MM-YYYY'), 'The first payment due date needs clarification.', 'The due date and payment method were explained.')
SELECT 1 FROM DUAL;

INSERT ALL
    INTO Project_Update (Project_id, Update_id, Rep_id, Update_date, Work_note, Progress_percent) VALUES ('PR001', 'UP001', 'R001', TO_DATE('08-07-2026', 'DD-MM-YYYY'), 'Site preparation and safety perimeter completed.', 22)
    INTO Project_Update (Project_id, Update_id, Rep_id, Update_date, Work_note, Progress_percent) VALUES ('PR001', 'UP002', 'R001', TO_DATE('03-08-2026', 'DD-MM-YYYY'), 'Foundation reinforcement and concrete pour completed.', 38)
    INTO Project_Update (Project_id, Update_id, Rep_id, Update_date, Work_note, Progress_percent) VALUES ('PR002', 'UP001', 'R003', TO_DATE('27-07-2026', 'DD-MM-YYYY'), 'External wall work and service routing are in progress.', 68)
    INTO Project_Update (Project_id, Update_id, Rep_id, Update_date, Work_note, Progress_percent) VALUES ('PR003', 'UP001', 'R002', TO_DATE('25-09-2026', 'DD-MM-YYYY'), 'Ground survey and soil testing completed.', 12)
    INTO Project_Update (Project_id, Update_id, Rep_id, Update_date, Work_note, Progress_percent) VALUES ('PR004', 'UP001', 'R004', TO_DATE('05-11-2026', 'DD-MM-YYYY'), 'Utility trench marking has started.', 18)
    INTO Project_Update (Project_id, Update_id, Rep_id, Update_date, Work_note, Progress_percent) VALUES ('PR005', 'UP001', 'R005', TO_DATE('18-11-2026', 'DD-MM-YYYY'), 'Access road layout and site fencing completed.', 10)
SELECT 1 FROM DUAL;
