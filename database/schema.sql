CREATE TABLE Person
(
    Person_id VARCHAR2(10),
    First_Name VARCHAR2(30),
    Last_Name VARCHAR2(30),
    Contact_no VARCHAR2(20),
    Email VARCHAR2(60),
    User_Password VARCHAR2(50),

    CONSTRAINT Person_Person_id_pk
        PRIMARY KEY (Person_id)
);

CREATE TABLE Department
(
    Dept_name VARCHAR2(40),
    Location VARCHAR2(80),
    Email VARCHAR2(60),
    Description VARCHAR2(300),

    CONSTRAINT Department_Dept_name_pk
        PRIMARY KEY (Dept_name)
);

CREATE TABLE Contractor
(
    Contractor_id VARCHAR2(10),
    Company_name VARCHAR2(80),
    Approval_state VARCHAR2(80),
    License_no VARCHAR2(30),
    License_due DATE,

    CONSTRAINT Contractor_Contractor_id_pk
        PRIMARY KEY (Contractor_id)
);

CREATE TABLE Area
(
    Area_id VARCHAR2(10),
    Boundary_info VARCHAR2(300),
    House_No VARCHAR2(20),
    Road_Sector VARCHAR2(80),
    Latitude NUMBER(10,6),
    Longitude NUMBER(10,6),

    CONSTRAINT Area_Area_id_pk
        PRIMARY KEY (Area_id)
);

CREATE TABLE Flats_Units
(
    Unit_id VARCHAR2(10),
    Unit_type VARCHAR2(30),
    Unit_no VARCHAR2(20),
    Status VARCHAR2(20),

    CONSTRAINT Flats_Units_Unit_id_pk
        PRIMARY KEY (Unit_id)
);

CREATE TABLE Employee
(
    Emp_id VARCHAR2(10),
    Person_id VARCHAR2(10) NOT NULL,
    Dept_name VARCHAR2(40) NOT NULL,
    Designation VARCHAR2(50),
    NID VARCHAR2(30),

    CONSTRAINT Employee_Emp_id_pk
        PRIMARY KEY (Emp_id),

    CONSTRAINT Employee_Person_id_uk
        UNIQUE (Person_id),

    CONSTRAINT Employee_Person_id_fk
        FOREIGN KEY (Person_id)
        REFERENCES Person (Person_id),

    CONSTRAINT Employee_Dept_name_fk
        FOREIGN KEY (Dept_name)
        REFERENCES Department (Dept_name)
);

CREATE TABLE Contractor_Rep
(
    Rep_id VARCHAR2(10),
    Person_id VARCHAR2(10) NOT NULL,
    Contractor_id VARCHAR2(10) NOT NULL,
    Approval_status VARCHAR2(20),
    Title VARCHAR2(50),

    CONSTRAINT Contractor_Rep_Rep_id_pk
        PRIMARY KEY (Rep_id),

    CONSTRAINT Contractor_Rep_Person_uk
        UNIQUE (Person_id),

    CONSTRAINT Contractor_Rep_Person_fk
        FOREIGN KEY (Person_id)
        REFERENCES Person (Person_id),

    CONSTRAINT Contractor_Rep_Contractor_fk
        FOREIGN KEY (Contractor_id)
        REFERENCES Contractor (Contractor_id)
);

CREATE TABLE Client
(
    Cl_id VARCHAR2(10),
    Person_id VARCHAR2(10) NOT NULL,
    NID VARCHAR2(30),

    CONSTRAINT Client_Cl_id_pk
        PRIMARY KEY (Cl_id),

    CONSTRAINT Client_Person_id_uk
        UNIQUE (Person_id),

    CONSTRAINT Client_Person_id_fk
        FOREIGN KEY (Person_id)
        REFERENCES Person (Person_id)
);

CREATE TABLE Department_Phone
(
    Dept_name VARCHAR2(40),
    Phone_no VARCHAR2(20),

    CONSTRAINT Department_Phone_pk
        PRIMARY KEY (Dept_name, Phone_no),

    CONSTRAINT Department_Phone_Dept_fk
        FOREIGN KEY (Dept_name)
        REFERENCES Department (Dept_name)
);

CREATE TABLE Client_Contact_no
(
    Cl_id VARCHAR2(10),
    Contact_no VARCHAR2(20),

    CONSTRAINT Client_Contact_no_pk
        PRIMARY KEY (Cl_id, Contact_no),

    CONSTRAINT Client_Contact_Client_fk
        FOREIGN KEY (Cl_id)
        REFERENCES Client (Cl_id)
);

CREATE TABLE Work_Relation
(
    Employee_id VARCHAR2(10),
    Manager_id VARCHAR2(10) NOT NULL,
    Status VARCHAR2(50),
    Date_Started DATE,
    Date_Ended DATE,

    CONSTRAINT Work_Relation_pk
        PRIMARY KEY (Employee_id),

    CONSTRAINT Work_Relation_Employee_fk
        FOREIGN KEY (Employee_id)
        REFERENCES Employee (Emp_id),

    CONSTRAINT Work_Relation_Manager_fk
        FOREIGN KEY (Manager_id)
        REFERENCES Employee (Emp_id)
);

CREATE TABLE Tenders
(
    Tender_id VARCHAR2(10),
    Emp_id VARCHAR2(10) NOT NULL,
    Deadline DATE,
    Day DATE,
    Title VARCHAR2(100),
    Bid_Details VARCHAR2(500),
    Status VARCHAR2(20),
    Task VARCHAR2(150),

    CONSTRAINT Tenders_Tender_id_pk
        PRIMARY KEY (Tender_id),

    CONSTRAINT Tenders_Emp_id_fk
        FOREIGN KEY (Emp_id)
        REFERENCES Employee (Emp_id)
);

CREATE TABLE Tender_Bids
(
    Tender_id VARCHAR2(10),
    Bid_id VARCHAR2(10),
    Rep_id VARCHAR2(10) NOT NULL,
    Bid_status VARCHAR2(20),
    Bid_amount NUMBER(14,2),

    CONSTRAINT Tender_Bids_pk
        PRIMARY KEY (Tender_id, Bid_id),

    CONSTRAINT Tender_Bids_Tender_fk
        FOREIGN KEY (Tender_id)
        REFERENCES Tenders (Tender_id),

    CONSTRAINT Tender_Bids_Rep_fk
        FOREIGN KEY (Rep_id)
        REFERENCES Contractor_Rep (Rep_id)
);

CREATE TABLE Tender_Award
(
    Award_id VARCHAR2(10),
    Tender_id VARCHAR2(10) NOT NULL,
    Bid_id VARCHAR2(10) NOT NULL,
    Emp_id VARCHAR2(10) NOT NULL,
    Award_amount NUMBER(14,2),
    Award_date DATE,

    CONSTRAINT Tender_Award_Award_id_pk
        PRIMARY KEY (Award_id),

    CONSTRAINT Tender_Award_Bid_uk
        UNIQUE (Tender_id, Bid_id),

    CONSTRAINT Tender_Award_Bid_fk
        FOREIGN KEY (Tender_id, Bid_id)
        REFERENCES Tender_Bids (Tender_id, Bid_id),

    CONSTRAINT Tender_Award_Emp_fk
        FOREIGN KEY (Emp_id)
        REFERENCES Employee (Emp_id)
);

CREATE TABLE Construction_Project
(
    Project_id VARCHAR2(10),
    Award_id VARCHAR2(10) NOT NULL,
    Area_id VARCHAR2(10) NOT NULL,
    Project_Budget NUMBER(14,2),
    Project_name VARCHAR2(80),
    Deadline DATE,
    Status VARCHAR2(20),

    CONSTRAINT CP_Project_id_pk
        PRIMARY KEY (Project_id),

    CONSTRAINT CP_Award_id_uk
        UNIQUE (Award_id),

    CONSTRAINT CP_Award_id_fk
        FOREIGN KEY (Award_id)
        REFERENCES Tender_Award (Award_id),

    CONSTRAINT CP_Area_id_fk
        FOREIGN KEY (Area_id)
        REFERENCES Area (Area_id)
);

CREATE TABLE Booking
(
    Booking_id VARCHAR2(10),
    Cl_id VARCHAR2(10) NOT NULL,
    Unit_id VARCHAR2(10) NOT NULL,
    Project_id VARCHAR2(10) NOT NULL,
    Booking_status VARCHAR2(20),
    Booking_date DATE,
    Due_amount NUMBER(14,2),

    CONSTRAINT Booking_Booking_id_pk
        PRIMARY KEY (Booking_id),

    CONSTRAINT Booking_Unit_id_uk
        UNIQUE (Unit_id),

    CONSTRAINT Booking_Cl_id_fk
        FOREIGN KEY (Cl_id)
        REFERENCES Client (Cl_id),

    CONSTRAINT Booking_Unit_id_fk
        FOREIGN KEY (Unit_id)
        REFERENCES Flats_Units (Unit_id),

    CONSTRAINT Booking_Project_id_fk
        FOREIGN KEY (Project_id)
        REFERENCES Construction_Project (Project_id)
);

CREATE TABLE Confirm_Allocation
(
    Booking_id VARCHAR2(10),
    Cl_id VARCHAR2(10),
    Unit_id VARCHAR2(10),
    Emp_id VARCHAR2(10) NOT NULL,

    CONSTRAINT Confirm_Allocation_pk
        PRIMARY KEY (Booking_id, Cl_id, Unit_id, Emp_id),

    CONSTRAINT Confirm_Allocation_Book_fk
        FOREIGN KEY (Booking_id)
        REFERENCES Booking (Booking_id),

    CONSTRAINT Confirm_Allocation_Client_fk
        FOREIGN KEY (Cl_id)
        REFERENCES Client (Cl_id),

    CONSTRAINT Confirm_Allocation_Unit_fk
        FOREIGN KEY (Unit_id)
        REFERENCES Flats_Units (Unit_id),

    CONSTRAINT Confirm_Allocation_Emp_fk
        FOREIGN KEY (Emp_id)
        REFERENCES Employee (Emp_id)
);

CREATE TABLE Payments
(
    Cl_id VARCHAR2(10),
    Payment_id VARCHAR2(10),
    Booking_id VARCHAR2(10) NOT NULL,
    Verified_by_Emp_id VARCHAR2(10) NOT NULL,
    Payment_status VARCHAR2(20),
    Verified_at DATE,
    Payment_method VARCHAR2(30),
    Amount NUMBER(14,2),
    Payment_due DATE,

    CONSTRAINT Payments_pk
        PRIMARY KEY (Cl_id, Payment_id),

    CONSTRAINT Payments_Client_fk
        FOREIGN KEY (Cl_id)
        REFERENCES Client (Cl_id),

    CONSTRAINT Payments_Booking_fk
        FOREIGN KEY (Booking_id)
        REFERENCES Booking (Booking_id),

    CONSTRAINT Payments_Verifier_fk
        FOREIGN KEY (Verified_by_Emp_id)
        REFERENCES Employee (Emp_id)
);

CREATE TABLE Installment
(
    Cl_id VARCHAR2(10),
    Payment_id VARCHAR2(10),
    Installment_id VARCHAR2(10),
    Amount NUMBER(14,2),
    Due_date DATE,
    Status VARCHAR2(20),
    Expired_at DATE,

    CONSTRAINT Installment_pk
        PRIMARY KEY (Cl_id, Payment_id, Installment_id),

    CONSTRAINT Installment_Payment_fk
        FOREIGN KEY (Cl_id, Payment_id)
        REFERENCES Payments (Cl_id, Payment_id)
);

CREATE TABLE Complaints
(
    Complaint_id VARCHAR2(10),
    Cl_id VARCHAR2(10) NOT NULL,
    Resolved_by_Emp_id VARCHAR2(10) NOT NULL,
    Status VARCHAR2(20),
    Filed_date DATE,
    Note VARCHAR2(500),
    Resolution VARCHAR2(500),

    CONSTRAINT Complaints_Complaint_id_pk
        PRIMARY KEY (Complaint_id),

    CONSTRAINT Complaints_Client_fk
        FOREIGN KEY (Cl_id)
        REFERENCES Client (Cl_id),

    CONSTRAINT Complaints_Resolver_fk
        FOREIGN KEY (Resolved_by_Emp_id)
        REFERENCES Employee (Emp_id)
);

CREATE TABLE Against
(
    Complaint_id VARCHAR2(10),
    Project_id VARCHAR2(10),

    CONSTRAINT Against_pk
        PRIMARY KEY (Complaint_id, Project_id),

    CONSTRAINT Against_Complaint_fk
        FOREIGN KEY (Complaint_id)
        REFERENCES Complaints (Complaint_id),

    CONSTRAINT Against_Project_fk
        FOREIGN KEY (Project_id)
        REFERENCES Construction_Project (Project_id)
);

CREATE TABLE Project_Update
(
    Project_id VARCHAR2(10),
    Update_id VARCHAR2(10),
    Rep_id VARCHAR2(10) NOT NULL,
    Update_date DATE,
    Work_note VARCHAR2(500),
    Progress_percent NUMBER(5,2),

    CONSTRAINT Project_Update_pk
        PRIMARY KEY (Project_id, Update_id),

    CONSTRAINT Project_Update_Project_fk
        FOREIGN KEY (Project_id)
        REFERENCES Construction_Project (Project_id),

    CONSTRAINT Project_Update_Rep_fk
        FOREIGN KEY (Rep_id)
        REFERENCES Contractor_Rep (Rep_id),

    CONSTRAINT Project_Update_Progress_ck
        CHECK (Progress_percent BETWEEN 0 AND 100)
);

CREATE TABLE Supervises
(
    Emp_id VARCHAR2(10),
    Contractor_id VARCHAR2(10),
    Project_id VARCHAR2(10),

    CONSTRAINT Supervises_pk
        PRIMARY KEY (Emp_id, Contractor_id),

    CONSTRAINT Supervises_Emp_fk
        FOREIGN KEY (Emp_id)
        REFERENCES Employee (Emp_id),

    CONSTRAINT Supervises_Contractor_fk
        FOREIGN KEY (Contractor_id)
        REFERENCES Contractor (Contractor_id),

    CONSTRAINT Supervises_Project_fk
        FOREIGN KEY (Project_id)
        REFERENCES Construction_Project (Project_id)
);

CREATE TABLE Books
(
    Cl_id      VARCHAR2(10),
    Booking_id VARCHAR2(10),
    Unit_id    VARCHAR2(10),

    CONSTRAINT Books_pk
        PRIMARY KEY (Cl_id, Booking_id, Unit_id),

    CONSTRAINT Books_Client_fk
        FOREIGN KEY (Cl_id)
        REFERENCES Client (Cl_id),

    CONSTRAINT Books_Booking_fk
        FOREIGN KEY (Booking_id)
        REFERENCES Booking (Booking_id),

    CONSTRAINT Books_Unit_fk
        FOREIGN KEY (Unit_id)
        REFERENCES Flats_Units (Unit_id)
);
