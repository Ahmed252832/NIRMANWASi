SYSTEM DESCRIPTION


This project is an independent Real Estate and Construction Management System
designed to support the major operational activities of a property development
organization.

The system manages people, employees, clients, departments, contractors,
contractor representatives, tenders, tender bids, tender awards, construction
projects, project areas, flats and units, bookings, payments, installments,
complaints, and construction progress updates.

Person is the general user entity of the system. Employee, Client, and
Contractor_Rep are specialized types of Person.

Employees perform the organization's administrative and operational activities.
Employees belong to departments and follow a managerial hierarchy in which one
employee may manage multiple subordinate employees. Employees can publish
tenders, verify payments, resolve client complaints, confirm property
booking-allocation processes, supervise contractors, and issue tender awards.

Clients use the system for property-related activities. A client can reserve a
flat or unit through a booking. The Booking, Reserves relationship, and
Flats & Units together form the Booking-Allocation Process. An employee confirms
this allocation process. Clients can also make payments associated with their
bookings, pay through installments where applicable, and file complaints.

The system also supports contractor and tender management. A contractor may be
represented by multiple Contractor Representatives. Contractor Representatives
can submit bids for published tenders. A tender may receive multiple bids. A
selected tender bid can result in a Tender Award, which is issued by an employee.

Each Tender Award results in a Construction Project. Every construction project
is associated with an Area and contains the flats or units involved in the
property-development process. Projects maintain information such as project name,
budget, deadline, status, and derived overdue state.

Construction progress is recorded through Project Updates. A construction
project can have multiple project updates, and Contractor Representatives provide
these updates. Each update records information such as update date, work notes,
and progress percentage.

The major functional areas of the system are therefore:

- User and person management
- Employee and department management
- Employee managerial hierarchy
- Client management
- Contractor and contractor representative management
- Tender publication and bid management
- Tender selection and award management
- Construction project management
- Area and location management
- Flat and unit management
- Booking and allocation management
- Payment and installment management
- Complaint filing and resolution
- Contractor supervision
- Construction progress tracking

The supplied ER model, entity definitions, relationship definitions,
cardinalities, aggregations, and database schema define the core data model and
business structure of the system.

The frontend should implement the functionality that logically follows from this
model. Additional simple usability features may be included where appropriate,
such as search, filtering, sorting, dashboard summaries, status indicators,
form validation, confirmation messages, and detail views, provided that these
features do not modify or contradict the established entities, relationships,

cardinalities, or business meaning of the system.

The system must remain a standalone and independent application and must not be
branded as, named after, or presented as the software system of any real-world
organization.

ENTITIES
ENTITIES AND ATTRIBUTES

1. Person
- Person_id [Primary Key]
- Name [Composite Attribute]
  - First_Name
  - Last_Name
- Contact_no
- Email
- Password


2. Employee
- Emp_id [Primary Key]
- Designation
- NID


3. Department [Weak Entity]
- Dept_name [Partial Key]
- Phone_no [Multivalued Attribute]
- Location
- Email
- Description


4. Tenders
- Tender_id [Primary Key]
- Deadline
- Day
- Title
- Bid_Details
- Status
- Task


5. Contractor_Rep
- Rep_id [Primary Key]
- Approval_status
- Title


6. Client
- Cl_id [Primary Key]
- Contact_no [Multivalued Attribute]
- NID


7. Payments [Weak Entity]
- Payment_id [Partial Key]
- Payment_status
- Verified_at
- Payment_method
- Amount
- Payment_due


8. Booking
- Booking_id [Primary Key]
- Booking_status
- Booking_date
- Due_amount


9. Flats & Units
- Unit_id [Primary Key]
- Unit_type
- Unit_no
- Status


10. Tender Bids [Weak Entity]
- Bid_id [Partial Key]
- Bid_status
- Bid_amount


11. Contractor
- Contractor_id [Primary Key]
- Company_name
- License_no
- License_due


12. Tender Award
- Award_id [Primary Key]
- Award_amount
- Award_date


13. Construction Project
- Project_id [Primary Key]
- Project_Budget
- Project_name
- Deadline
- Status
- Is_overdue [Derived Attribute]


14. Installment [Weak Entity]
- Installment_id [Partial Key]
- Amount
- Due_date
- Status
- Expired_at


15. Complaints
- Complaint_id [Primary Key]
- Status
- Filed_date
- Note
- Resolution


16. Project Update [Weak Entity]
- Update_id [Partial Key]
- Work_note
- Progress_percent
- Update_date


17. Area
- Area_id [Primary Key]
- Boundary_info
- Address [Composite Attribute]
  - House_No
  - Road_Sector
- Centre_location [Composite Attribute]
  - Latitude
  - Longitude

RELATIONSHIPS
SPECIALIZATION (ISA):

Employee ISA Person.

Employee is a subtype of Person, and Person is the supertype.
Therefore, every Employee is a Person, but every Person is not necessarily an Employee.
SPECIALIZATION (ISA):

Contractor_Rep ISA Person.

Contractor_Rep is a subtype of Person, and Person is the supertype.
Therefore, every Contractor_Rep is a Person, but every Person is not necessarily a Contractor_Rep.
SPECIALIZATION (ISA):

Client ISA Person.

Client is a subtype of Person, and Person is the supertype.
Therefore, every Client is a Person, but every Person is not necessarily a Client.

RECURSIVE RELATIONSHIP:

Employee has a recursive relationship with Employee through Work Relation.

One employee manages many employees, while each employee works for one manager.

Cardinality:
Manager Employee 1 : N Subordinate Employees
RELATIONSHIP:

Employee resolves Complaints.

One Employee can resolve many Complaints, while each Complaint is resolved by one Employee.

Cardinality:
Employee 1 : N Complaints
RELATIONSHIP:

Employee publishes Tenders.

One Employee can publish many Tenders, while each Tender is published by one Employee.

Cardinality:
Employee 1 : N Tenders
RELATIONSHIP:

Employees belong to a Department.

One Department can have many Employees, while each Employee belongs to one Department.

Cardinality:
Department 1 : N Employee
RELATIONSHIP:

Client pays Payments.

One Client can make many Payments, while each Payment is made by one Client.

Cardinality:
Client 1 : N Payments
RELATIONSHIP:

Client files Complaints.

One Client can file many Complaints, while each Complaint is filed by one Client.

Cardinality:
Client 1 : N Complaints
RELATIONSHIP + AGGREGATION:

Client books through the Booking–Allocation Process.

The Booking–Allocation Process is an aggregation consisting of:
Booking — Reserves — Flats & Units.

One Client can make many Bookings, while each Booking belongs to one Client.

Each Booking reserves one Flat/Unit.

Cardinality:
Client 1 : N Booking
Booking 1 : 1 Flats & Units
RELATIONSHIP:

Contractor_Rep represents Contractor.

One Contractor can have many Contractor_Rep, while each Contractor_Rep represents one Contractor.

Cardinality:
Contractor 1 : N Contractor_Rep
RELATIONSHIP:

Contractor_Rep submits Tender Bids.

One Contractor_Rep can submit many Tender Bids, while each Tender Bid is submitted by one Contractor_Rep.

Cardinality:
Contractor_Rep 1 : N Tender_Bids
RELATIONSHIP:

Employee supervises Contractor.

One Employee can supervise many Contractors, and one Contractor can be supervised by many Employees.

Cardinality:
Employee M : N Contractor
RELATIONSHIP:

Tender receives Tender Bids.

One Tender can receive many Tender Bids, while each Tender Bid belongs to one Tender.

Cardinality:
Tender 1 : N Tender_Bids
RELATIONSHIP:

Employee verifies Payments.

One Employee can verify many Payments, while each Payment is verified by one Employee.

Cardinality:
Employee 1 : N Payments
RELATIONSHIP WITH AGGREGATION:

Employee confirms the Booking–Allocation Process.

The Booking–Allocation Process is an aggregation consisting of:
Booking — Reserves — Flats & Units.

One Employee can confirm many Booking–Allocation processes, while each Booking–Allocation process is confirmed by one Employee.

Cardinality:
Employee 1 : N Booking–Allocation Process
RELATIONSHIP WITH AGGREGATION:

Payments are pending for the Booking–Allocation Process.

The Booking–Allocation Process is an aggregation consisting of:
Booking — Reserves — Flats & Units.

One Booking–Allocation Process can have many Payments pending against it, while each Payment is associated with one Booking–Allocation Process.

Cardinality:
Booking–Allocation Process 1 : N Payments
RELATIONSHIP:

Tender Bid is selected for a Tender Award.

Each Tender Award is created from one selected Tender Bid, and each Tender Bid can result in at most one Tender Award.

Cardinality:
Tender_Bid 1 : 1 Tender_Award
RELATIONSHIP:

Employee awards Tender Awards.

One Employee can award many Tender Awards, while each Tender Award is awarded by one Employee.

Cardinality:
Employee 1 : N Tender_Award
RELATIONSHIP:

Payments have Installments.

One Payment can have many Installments, while each Installment belongs to one Payment.

Cardinality:
Payment 1 : N Installment
RELATIONSHIP:

Tender Award results in a Construction Project.

Each Tender Award results in one Construction Project, and each Construction Project comes from one Tender Award.

Cardinality:
Tender_Award 1 : 1 Construction_Project
RELATIONSHIP:

Contractor_Rep updates Project Update.

One Contractor_Rep can create many Project Updates, while each Project Update is created by one Contractor_Rep.

Cardinality:
Contractor_Rep 1 : N Project_Update
RELATIONSHIP:

Construction Project has Project Updates that represent its progress.

One Construction Project can have many Project Updates, while each Project Update belongs to one Construction Project.

Cardinality:
Construction_Project 1 : N Project_Update
RELATIONSHIP:

Construction Project is located in an Area.

One Area can contain many Construction Projects, while each Construction Project is located in one Area.

Cardinality:
Area 1 : N Construction_Project
RELATIONSHIP WITH AGGREGATION:

Construction Project has Booking–Allocation Processes.

The Booking–Allocation Process is an aggregation consisting of:
Booking — Reserves — Flats & Units.

One Construction Project can have many Booking–Allocation Processes, while each Booking–Allocation Process belongs to one Construction Project.

Cardinality:
Construction_Project 1 : N Booking–Allocation Process


SCHEMA DBML CODE
// ============================================================

// PERSON
// ER:
// Person_id
// Name = First_Name + Last_Name
// Contact_no
// Email
// Password
// ============================================================

Table Person {
  Person_id int [pk]
  First_Name varchar
  Last_Name varchar
  Contact_no varchar
  Email varchar
  Password varchar
}


// ============================================================
// EMPLOYEE
// Employee ISA Person
// ============================================================

Table Employee {
  Emp_id int [pk]
  Person_id int [not null, unique]
  Dept_name varchar
  Designation varchar
  NID varchar
}

Ref: Employee.Person_id > Person.Person_id


// ============================================================
// CONTRACTOR REPRESENTATIVE
// Contractor_Rep ISA Person
// ============================================================

Table Contractor_Rep {
  Rep_id int [pk]
  Person_id int [not null, unique]
  Contractor_id int
  Approval_status varchar
  Title varchar
}

Ref: Contractor_Rep.Person_id > Person.Person_id


// ============================================================
// CLIENT
// Client ISA Person
// ============================================================

Table Client {
  Cl_id int [pk]
  Person_id int [not null, unique]
  NID varchar
}

Ref: Client.Person_id > Person.Person_id


// ============================================================
// CLIENT CONTACT NUMBER
//
// Contact_no is multivalued for Client in the ER.
// Therefore it requires a separate relation.
// ============================================================

Table Client_Contact_no {
  Cl_id int
  Contact_no varchar

  indexes {
    (Cl_id, Contact_no) [pk]
  }
}

Ref: Client_Contact_no.Cl_id > Client.Cl_id


// ============================================================
// DEPARTMENT
//
// ER marks Department as a weak entity and Dept_name as its
// partial key.
//
// The ER also states:
// Department 1 : N Employee
//
// No separate owner identifier for Department is shown in the
// supplied ER specification. Therefore Dept_name is used as the
// relational identifier here.
// ============================================================

Table Department {
  Dept_name varchar [pk, note: 'Partial key in ER model']
  Location varchar
  Email varchar
  Description varchar
}


// Employee belongs to Department
Ref: Employee.Dept_name > Department.Dept_name


// ============================================================
// DEPARTMENT PHONE NUMBER
//
// Phone_no is multivalued.
// ============================================================

Table Department_Phone {
  Dept_name varchar
  Phone_no varchar

  indexes {
    (Dept_name, Phone_no) [pk]
  }
}

Ref: Department_Phone.Dept_name > Department.Dept_name


// ============================================================
// RECURSIVE EMPLOYEE WORK RELATION
//
// One manager manages many employees.
// Each subordinate employee works for one manager.
// ============================================================

Table Work_Relation {
  Employee_id int [pk]
  Manager_id int [not null]
}

Ref: Work_Relation.Employee_id > Employee.Emp_id
Ref: Work_Relation.Manager_id > Employee.Emp_id


// ============================================================
// TENDERS
// ============================================================

Table Tenders {
  Tender_id int [pk]
  Emp_id int [not null]

  Deadline date
  Day date
  Title varchar
  Bid_Details text
  Status varchar
  Task varchar
}


// Employee publishes Tenders
// Employee 1 : N Tenders

Ref: Tenders.Emp_id > Employee.Emp_id


// ============================================================
// CONTRACTOR
// ============================================================

Table Contractor {
  Contractor_id int [pk]
  Company_name varchar
  License_no varchar
  License_due date
}


// Contractor 1 : N Contractor_Rep

Ref: Contractor_Rep.Contractor_id > Contractor.Contractor_id


// ============================================================
// EMPLOYEE SUPERVISES CONTRACTOR
//
// Employee M : N Contractor
// ============================================================

Table Supervises {
  Emp_id int
  Contractor_id int

  indexes {
    (Emp_id, Contractor_id) [pk]
  }
}

Ref: Supervises.Emp_id > Employee.Emp_id
Ref: Supervises.Contractor_id > Contractor.Contractor_id


// ============================================================
// TENDER BIDS
//
// Tender Bids is a weak entity.
// Bid_id is the partial key.
//
// Tender 1 : N Tender_Bids
// Contractor_Rep 1 : N Tender_Bids
// ============================================================

Table Tender_Bids {
  Tender_id int
  Bid_id int
  Rep_id int [not null]

  Bid_status varchar
  Bid_amount decimal

  indexes {
    (Tender_id, Bid_id) [pk]
  }
}


// Tender receives Tender Bids

Ref: Tender_Bids.Tender_id > Tenders.Tender_id


// Contractor_Rep submits Tender Bids

Ref: Tender_Bids.Rep_id > Contractor_Rep.Rep_id


// ============================================================
// TENDER AWARD
//
// One Tender Bid may result in at most one Tender Award.
// Each Tender Award corresponds to one selected Tender Bid.
//
// Employee 1 : N Tender_Award
// ============================================================

Table Tender_Award {
  Award_id int [pk]

  Tender_id int [not null]
  Bid_id int [not null]

  Emp_id int [not null]

  Award_amount decimal
  Award_date date

  indexes {
    (Tender_id, Bid_id) [unique]
  }
}


// Selected Tender Bid -> Tender Award

Ref: Tender_Award.(Tender_id, Bid_id) > Tender_Bids.(Tender_id, Bid_id)


// Employee awards Tender Award

Ref: Tender_Award.Emp_id > Employee.Emp_id


// ============================================================
// AREA
//
// Address is composite:
// Address = House_No + Road_Sector
//
// Centre_location is composite:
// Centre_location = Latitude + Longitude
// ============================================================

Table Area {
  Area_id int [pk]

  Boundary_info text

  House_No varchar
  Road_Sector varchar

  Latitude decimal
  Longitude decimal
}


// ============================================================
// CONSTRUCTION PROJECT
//
// Is_overdue is DERIVED in the ER.
// It should be calculated from project data rather than used as
// an independent stored business value.
// ============================================================

Table Construction_Project {
  Project_id int [pk]

  Award_id int [not null, unique]
  Area_id int [not null]

  Project_Budget decimal
  Project_name varchar
  Deadline date
  Status varchar

  Is_overdue boolean [note: 'Derived attribute in ER; calculate from Deadline/Status rather than treating as independently entered data']
}


// Tender Award 1 : 1 Construction Project

Ref: Construction_Project.Award_id > Tender_Award.Award_id


// Area 1 : N Construction Project

Ref: Construction_Project.Area_id > Area.Area_id


// ============================================================
// FLATS & UNITS
// ============================================================

Table Flats_Units {
  Unit_id int [pk]

  Unit_type varchar
  Unit_no varchar
  Status varchar
}


// ============================================================
// BOOKING
//
// Booking participates in:
//
// Booking 1 : 1 Flats & Units
// Client 1 : N Booking
// Construction_Project 1 : N Booking-Allocation Process
//
// Booking + Reserves + Flats_Units forms the
// Booking-Allocation Process aggregation.
// ============================================================

Table Booking {
  Booking_id int [pk]

  Cl_id int [not null]
  Unit_id int [not null, unique]
  Project_id int [not null]

  Booking_status varchar
  Booking_date date
  Due_amount decimal
}


// Client books

Ref: Booking.Cl_id > Client.Cl_id


// Booking reserves exactly one Flat / Unit

Ref: Booking.Unit_id > Flats_Units.Unit_id


// Construction Project has Booking-Allocation Processes

Ref: Booking.Project_id > Construction_Project.Project_id


// ============================================================
// EMPLOYEE CONFIRMS BOOKING-ALLOCATION PROCESS
//
// Employee 1 : N Booking-Allocation Process
//
// Booking_id identifies the aggregated Booking-Allocation
// instance because the reserved Unit is already linked to Booking.
// ============================================================

Table Confirm_Allocation {
  Booking_id int [pk]
  Emp_id int [not null]
}

Ref: Confirm_Allocation.Booking_id > Booking.Booking_id
Ref: Confirm_Allocation.Emp_id > Employee.Emp_id


// ============================================================
// PAYMENTS
//
// Payments is a weak entity.
// Payment_id is its partial key.
//
// Client 1 : N Payments
// Booking-Allocation Process 1 : N Payments
// Employee 1 : N Payments (verifies)
// ============================================================

Table Payments {
  Cl_id int
  Payment_id int

  Booking_id int [not null]
  Verified_by_Emp_id int [not null]

  Payment_status varchar
  Verified_at datetime
  Payment_method varchar
  Amount decimal
  Payment_due date

  indexes {
    (Cl_id, Payment_id) [pk]
  }
}


// Client pays Payments

Ref: Payments.Cl_id > Client.Cl_id


// Payment is pending against Booking-Allocation Process

Ref: Payments.Booking_id > Booking.Booking_id


// Employee verifies Payments

Ref: Payments.Verified_by_Emp_id > Employee.Emp_id


// ============================================================
// INSTALLMENT
//
// Installment is a weak entity.
// Installment_id is its partial key.
//
// Payment 1 : N Installment
// ============================================================

Table Installment {
  Cl_id int
  Payment_id int
  Installment_id int

  Amount decimal
  Due_date date
  Status varchar
  Expired_at datetime

  indexes {
    (Cl_id, Payment_id, Installment_id) [pk]
  }
}


// Payment has Installments

Ref: Installment.(Cl_id, Payment_id) > Payments.(Cl_id, Payment_id)


// ============================================================
// COMPLAINTS
//
// Client 1 : N Complaints
// Employee 1 : N Complaints
// ============================================================

Table Complaints {
  Complaint_id int [pk]

  Cl_id int [not null]
  Resolved_by_Emp_id int [not null]

  Status varchar
  Filed_date date
  Note text
  Resolution text
}


// Client files Complaints

Ref: Complaints.Cl_id > Client.Cl_id


// Employee resolves Complaints

Ref: Complaints.Resolved_by_Emp_id > Employee.Emp_id


// ============================================================
// PROJECT UPDATE
//
// Project Update is a weak entity.
// It is identified within its Construction Project.
//
// Construction_Project 1 : N Project_Update
// Contractor_Rep 1 : N Project_Update
// ============================================================

Table Project_Update {
  Project_id int
  Update_id int

  Rep_id int [not null]

  Update_date date
  Work_note text
  Progress_percent decimal

  indexes {
    (Project_id, Update_id) [pk]
  }
}


// Construction Project has Project Updates

Ref: Project_Update.Project_id > Construction_Project.Project_id


// Contractor_Rep creates/updates Project Update

Ref: Project_Update.Rep_id > Contractor_Rep.Rep_id
