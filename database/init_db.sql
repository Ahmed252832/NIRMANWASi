-- ============================================================
-- NIRMAN Database Initialization Script for XAMPP MySQL
-- ============================================================
-- Run this script in phpMyAdmin to create the database and tables

-- Create Database
CREATE DATABASE IF NOT EXISTS nirman_db;
USE nirman_db;

-- ============================================================
-- 1. PERSON TABLE (Parent table for all users)
-- ============================================================
CREATE TABLE IF NOT EXISTS Person (
    Person_id INT AUTO_INCREMENT PRIMARY KEY,
    First_Name VARCHAR(100) NOT NULL,
    Last_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) UNIQUE NOT NULL,
    Phone_No VARCHAR(20),
    Password VARCHAR(255) NOT NULL,
    Address VARCHAR(255),
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. EMPLOYEE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Employee (
    Emp_id INT AUTO_INCREMENT PRIMARY KEY,
    Person_id INT NOT NULL UNIQUE,
    Designation VARCHAR(100) NOT NULL, -- 'System Administrator', 'Supervisor', 'Finance Officer', etc.
    Department VARCHAR(100),
    Hire_Date DATE,
    CONSTRAINT Employee_Person_id_fk 
        FOREIGN KEY (Person_id) REFERENCES Person(Person_id) ON DELETE CASCADE
);

-- ============================================================
-- 3. CLIENT TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Client (
    Cl_id INT AUTO_INCREMENT PRIMARY KEY,
    Person_id INT NOT NULL UNIQUE,
    Company_Name VARCHAR(150),
    CNIC_NTN VARCHAR(50),
    Approval_Status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    CONSTRAINT Client_Person_id_fk 
        FOREIGN KEY (Person_id) REFERENCES Person(Person_id) ON DELETE CASCADE
);

-- ============================================================
-- 4. CONTRACTOR TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Contractor (
    Cont_id INT AUTO_INCREMENT PRIMARY KEY,
    Company_Name VARCHAR(150) NOT NULL,
    Contact_Person VARCHAR(100),
    Email VARCHAR(150),
    Phone_No VARCHAR(20),
    CNIC_NTN VARCHAR(50),
    Registration_Number VARCHAR(50) UNIQUE,
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 5. CONTRACTOR_REP TABLE (Representatives of contractors)
-- ============================================================
CREATE TABLE IF NOT EXISTS Contractor_Rep (
    Rep_id INT AUTO_INCREMENT PRIMARY KEY,
    Person_id INT NOT NULL UNIQUE,
    Cont_id INT NOT NULL,
    Approval_status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    CONSTRAINT Contractor_Rep_Person_id_fk 
        FOREIGN KEY (Person_id) REFERENCES Person(Person_id) ON DELETE CASCADE,
    CONSTRAINT Contractor_Rep_Cont_id_fk 
        FOREIGN KEY (Cont_id) REFERENCES Contractor(Cont_id) ON DELETE CASCADE
);

-- ============================================================
-- 6. CONSTRUCTION_PROJECT TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Construction_Project (
    Proj_id INT AUTO_INCREMENT PRIMARY KEY,
    Project_Name VARCHAR(150) NOT NULL,
    Location VARCHAR(255),
    Start_Date DATE,
    End_Date DATE,
    Budget DECIMAL(15, 2),
    Description TEXT,
    Status VARCHAR(50) DEFAULT 'Planning', -- 'Planning', 'Active', 'Completed', 'On Hold'
    Supervisor_id INT,
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT Construction_Project_Supervisor_id_fk 
        FOREIGN KEY (Supervisor_id) REFERENCES Employee(Emp_id)
);

-- ============================================================
-- 7. AREA TABLE (Areas within construction projects)
-- ============================================================
CREATE TABLE IF NOT EXISTS Area (
    Area_id INT AUTO_INCREMENT PRIMARY KEY,
    Proj_id INT NOT NULL,
    Area_Name VARCHAR(100) NOT NULL,
    Square_Feet DECIMAL(10, 2),
    CONSTRAINT Area_Proj_id_fk 
        FOREIGN KEY (Proj_id) REFERENCES Construction_Project(Proj_id) ON DELETE CASCADE
);

-- ============================================================
-- 8. FLATS_UNITS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Flats_Units (
    Unit_id INT AUTO_INCREMENT PRIMARY KEY,
    Area_id INT NOT NULL,
    Unit_Number VARCHAR(50) NOT NULL,
    Unit_Type VARCHAR(100), -- 'Studio', '1BHK', '2BHK', etc.
    Square_Feet DECIMAL(10, 2),
    Price DECIMAL(15, 2),
    Status VARCHAR(50) DEFAULT 'Available', -- 'Available', 'Booked', 'Sold', 'Under Construction'
    CONSTRAINT Flats_Units_Area_id_fk 
        FOREIGN KEY (Area_id) REFERENCES Area(Area_id) ON DELETE CASCADE,
    CONSTRAINT unique_unit_per_area 
        UNIQUE (Area_id, Unit_Number)
);

-- ============================================================
-- 9. BOOKING TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Booking (
    Book_id INT AUTO_INCREMENT PRIMARY KEY,
    Cl_id INT NOT NULL,
    Unit_id INT NOT NULL,
    Booking_Date DATE NOT NULL,
    Down_Payment DECIMAL(15, 2),
    Status VARCHAR(50) DEFAULT 'Confirmed', -- 'Confirmed', 'Cancelled', 'Completed'
    CONSTRAINT Booking_Cl_id_fk 
        FOREIGN KEY (Cl_id) REFERENCES Client(Cl_id),
    CONSTRAINT Booking_Unit_id_fk 
        FOREIGN KEY (Unit_id) REFERENCES Flats_Units(Unit_id)
);

-- ============================================================
-- 10. TENDER TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Tender (
    Tender_id INT AUTO_INCREMENT PRIMARY KEY,
    Proj_id INT NOT NULL,
    Tender_Name VARCHAR(150) NOT NULL,
    Description TEXT,
    Budget DECIMAL(15, 2),
    Deadline DATE,
    Status VARCHAR(50) DEFAULT 'Draft', -- 'Draft', 'Published', 'Closed', 'Awarded'
    Published_Date DATE,
    CONSTRAINT Tender_Proj_id_fk 
        FOREIGN KEY (Proj_id) REFERENCES Construction_Project(Proj_id) ON DELETE CASCADE
);

-- ============================================================
-- 11. BID TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Bid (
    Bid_id INT AUTO_INCREMENT PRIMARY KEY,
    Tender_id INT NOT NULL,
    Rep_id INT NOT NULL,
    Bid_Amount DECIMAL(15, 2) NOT NULL,
    Bid_Date DATE NOT NULL,
    Status VARCHAR(50) DEFAULT 'Submitted', -- 'Submitted', 'Approved', 'Rejected', 'Awarded'
    CONSTRAINT Bid_Tender_id_fk 
        FOREIGN KEY (Tender_id) REFERENCES Tender(Tender_id) ON DELETE CASCADE,
    CONSTRAINT Bid_Rep_id_fk 
        FOREIGN KEY (Rep_id) REFERENCES Contractor_Rep(Rep_id) ON DELETE CASCADE
);

-- ============================================================
-- 12. AWARD TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Award (
    Award_id INT AUTO_INCREMENT PRIMARY KEY,
    Tender_id INT NOT NULL,
    Bid_id INT NOT NULL,
    Award_Date DATE,
    Contract_Value DECIMAL(15, 2),
    Status VARCHAR(50) DEFAULT 'Active',
    CONSTRAINT Award_Tender_id_fk 
        FOREIGN KEY (Tender_id) REFERENCES Tender(Tender_id) ON DELETE CASCADE,
    CONSTRAINT Award_Bid_id_fk 
        FOREIGN KEY (Bid_id) REFERENCES Bid(Bid_id) ON DELETE CASCADE
);

-- ============================================================
-- 13. PAYMENT TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Payment (
    Pay_id INT AUTO_INCREMENT PRIMARY KEY,
    Book_id INT NOT NULL,
    Amount DECIMAL(15, 2) NOT NULL,
    Payment_Date DATE NOT NULL,
    Payment_Method VARCHAR(50), -- 'Bank Transfer', 'Cash', 'Cheque', etc.
    Status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Completed', 'Failed'
    Emp_id INT,
    CONSTRAINT Payment_Book_id_fk 
        FOREIGN KEY (Book_id) REFERENCES Booking(Book_id) ON DELETE CASCADE,
    CONSTRAINT Payment_Emp_id_fk 
        FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id)
);

-- ============================================================
-- 14. COMPLAINT TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Complaint (
    Complaint_id INT AUTO_INCREMENT PRIMARY KEY,
    Cl_id INT NOT NULL,
    Description TEXT NOT NULL,
    Filed_Date DATE NOT NULL,
    Status VARCHAR(50) DEFAULT 'Open', -- 'Open', 'In Progress', 'Resolved', 'Closed'
    Resolution TEXT,
    Assigned_Emp_id INT,
    CONSTRAINT Complaint_Cl_id_fk 
        FOREIGN KEY (Cl_id) REFERENCES Client(Cl_id) ON DELETE CASCADE,
    CONSTRAINT Complaint_Assigned_Emp_id_fk 
        FOREIGN KEY (Assigned_Emp_id) REFERENCES Employee(Emp_id)
);

-- ============================================================
-- 15. PROJECT_UPDATE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Project_Update (
    Update_id INT AUTO_INCREMENT PRIMARY KEY,
    Proj_id INT NOT NULL,
    Update_Date DATE NOT NULL,
    Progress_Description TEXT,
    Completion_Percentage INT,
    Updated_by_Emp_id INT,
    CONSTRAINT Project_Update_Proj_id_fk 
        FOREIGN KEY (Proj_id) REFERENCES Construction_Project(Proj_id) ON DELETE CASCADE,
    CONSTRAINT Project_Update_Emp_id_fk 
        FOREIGN KEY (Updated_by_Emp_id) REFERENCES Employee(Emp_id)
);

-- ============================================================
-- 16. SUPERVISION TABLE (Employee supervises Projects)
-- ============================================================
CREATE TABLE IF NOT EXISTS Supervision (
    Sup_id INT AUTO_INCREMENT PRIMARY KEY,
    Emp_id INT NOT NULL,
    Proj_id INT NOT NULL,
    From_Date DATE,
    To_Date DATE,
    CONSTRAINT Supervision_Emp_id_fk 
        FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id) ON DELETE CASCADE,
    CONSTRAINT Supervision_Proj_id_fk 
        FOREIGN KEY (Proj_id) REFERENCES Construction_Project(Proj_id) ON DELETE CASCADE,
    CONSTRAINT unique_supervision 
        UNIQUE (Emp_id, Proj_id)
);

-- ============================================================
-- 17. ALLOCATION TABLE (Unit allocation to areas/projects)
-- ============================================================
CREATE TABLE IF NOT EXISTS Allocation (
    Alloc_id INT AUTO_INCREMENT PRIMARY KEY,
    Unit_id INT NOT NULL,
    Area_id INT NOT NULL,
    Alloc_Date DATE,
    Status VARCHAR(50) DEFAULT 'Confirmed',
    CONSTRAINT Allocation_Unit_id_fk 
        FOREIGN KEY (Unit_id) REFERENCES Flats_Units(Unit_id) ON DELETE CASCADE,
    CONSTRAINT Allocation_Area_id_fk 
        FOREIGN KEY (Area_id) REFERENCES Area(Area_id) ON DELETE CASCADE
);

-- ============================================================
-- Create Indexes for Better Performance
-- ============================================================
CREATE INDEX idx_person_email ON Person(Email);
CREATE INDEX idx_client_person_id ON Client(Person_id);
CREATE INDEX idx_employee_person_id ON Employee(Person_id);
CREATE INDEX idx_employee_designation ON Employee(Designation);
CREATE INDEX idx_construction_project_status ON Construction_Project(Status);
CREATE INDEX idx_flats_units_status ON Flats_Units(Status);
CREATE INDEX idx_booking_client_id ON Booking(Cl_id);
CREATE INDEX idx_booking_unit_id ON Booking(Unit_id);
CREATE INDEX idx_tender_project_id ON Tender(Proj_id);
CREATE INDEX idx_tender_status ON Tender(Status);
CREATE INDEX idx_bid_tender_id ON Bid(Tender_id);
CREATE INDEX idx_bid_status ON Bid(Status);
CREATE INDEX idx_payment_booking_id ON Payment(Book_id);
CREATE INDEX idx_payment_status ON Payment(Status);
CREATE INDEX idx_complaint_client_id ON Complaint(Cl_id);
CREATE INDEX idx_complaint_status ON Complaint(Status);

-- ============================================================
-- Done! Database structure created.
-- ============================================================
