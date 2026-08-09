"use strict";

/*
  All sample information lives in this file so a future PHP layer can replace
  it without requiring the HTML layouts to be redesigned.
*/

var nirmanData = {
  adminAccounts: [
    {
      email: "admin@nirman.demo",
      password: "admin123",
      name: "System Administrator"
    }
  ],

  people: [
    {
      personId: "P001",
      firstName: "Arif",
      lastName: "Rahman",
      contactNo: "01711000001",
      email: "arif@nirman.demo",
      password: "employee123"
    },
    {
      personId: "P002",
      firstName: "Nusrat",
      lastName: "Jahan",
      contactNo: "01711000002",
      email: "nusrat@nirman.demo",
      password: "employee123"
    },
    {
      personId: "P003",
      firstName: "Farhan",
      lastName: "Ahmed",
      contactNo: "01711000003",
      email: "farhan@nirman.demo",
      password: "employee123"
    },
    {
      personId: "P004",
      firstName: "Samira",
      lastName: "Khan",
      contactNo: "01812000001",
      email: "samira@nirman.demo",
      password: "client123"
    },
    {
      personId: "P005",
      firstName: "Rafiul",
      lastName: "Islam",
      contactNo: "01812000002",
      email: "rafiul@nirman.demo",
      password: "client123"
    },
    {
      personId: "P006",
      firstName: "Tanvir",
      lastName: "Hasan",
      contactNo: "01913000001",
      email: "tanvir@nirman.demo",
      password: "contractor123"
    },
    {
      personId: "P007",
      firstName: "Mehedi",
      lastName: "Chowdhury",
      contactNo: "01913000002",
      email: "mehedi@nirman.demo",
      password: "contractor123"
    },
    {
      personId: "P008",
      firstName: "Sadia",
      lastName: "Karim",
      contactNo: "01711000004",
      email: "sadia@nirman.demo",
      password: "employee123"
    },
    {
      personId: "P009",
      firstName: "Ayesha",
      lastName: "Noor",
      contactNo: "01812000003",
      email: "ayesha@nirman.demo",
      password: "client123"
    }
  ],

  employees: [
    {
      employeeId: "E001",
      personId: "P001",
      deptName: "Operations",
      designation: "Operations Manager",
      nid: "NID-EMP-1001"
    },
    {
      employeeId: "E002",
      personId: "P002",
      deptName: "Finance",
      designation: "Finance Officer",
      nid: "NID-EMP-1002"
    },
    {
      employeeId: "E003",
      personId: "P003",
      deptName: "Engineering",
      designation: "Project Engineer",
      nid: "NID-EMP-1003"
    },
    {
      employeeId: "E004",
      personId: "P008",
      deptName: "Client Services",
      designation: "Client Service Officer",
      nid: "NID-EMP-1004"
    }
  ],

  departments: [
    {
      deptName: "Operations",
      location: "North Wing, Level 3",
      email: "operations@nirman.demo",
      description: "Coordinates allocation, procurement, and operational review."
    },
    {
      deptName: "Finance",
      location: "East Wing, Level 2",
      email: "finance@nirman.demo",
      description: "Reviews payments, installments, and financial schedules."
    },
    {
      deptName: "Engineering",
      location: "Project Wing, Level 4",
      email: "engineering@nirman.demo",
      description: "Monitors construction work and contractor progress."
    },
    {
      deptName: "Client Services",
      location: "Welcome Wing, Level 1",
      email: "clients@nirman.demo",
      description: "Supports bookings, allocation communication, and complaints."
    }
  ],

  departmentPhones: [
    { deptName: "Operations", phoneNo: "02-55001001" },
    { deptName: "Operations", phoneNo: "02-55001002" },
    { deptName: "Finance", phoneNo: "02-55002001" },
    { deptName: "Engineering", phoneNo: "02-55003001" },
    { deptName: "Engineering", phoneNo: "02-55003002" },
    { deptName: "Client Services", phoneNo: "02-55004001" }
  ],

  workRelations: [
    { employeeId: "E002", managerId: "E001" },
    { employeeId: "E003", managerId: "E001" },
    { employeeId: "E004", managerId: "E001" }
  ],

  clients: [
    { clientId: "C001", personId: "P004", nid: "NID-CLI-2001" },
    { clientId: "C002", personId: "P005", nid: "NID-CLI-2002" },
    { clientId: "C003", personId: "P009", nid: "NID-CLI-2003" }
  ],

  clientContacts: [
    { clientId: "C001", contactNo: "01812000001" },
    { clientId: "C001", contactNo: "01614000001" },
    { clientId: "C002", contactNo: "01812000002" },
    { clientId: "C003", contactNo: "01812000003" },
    { clientId: "C003", contactNo: "01614000003" }
  ],

  contractors: [
    {
      contractorId: "CT001",
      companyName: "BuildCore Developments",
      licenseNo: "LIC-BC-7841",
      licenseDue: "2027-04-30"
    },
    {
      contractorId: "CT002",
      companyName: "UrbanAxis Engineering",
      licenseNo: "LIC-UA-5528",
      licenseDue: "2026-10-18"
    }
  ],

  contractorReps: [
    {
      repId: "R001",
      personId: "P006",
      contractorId: "CT001",
      approvalStatus: "Approved",
      title: "Site Representative"
    },
    {
      repId: "R002",
      personId: "P007",
      contractorId: "CT002",
      approvalStatus: "Pending",
      title: "Bid Coordinator"
    }
  ],

  supervisions: [
    { employeeId: "E001", contractorId: "CT001" },
    { employeeId: "E003", contractorId: "CT001" },
    { employeeId: "E001", contractorId: "CT002" }
  ],

  tenders: [
    {
      tenderId: "T001",
      employeeId: "E001",
      deadline: "2026-09-15",
      day: "2026-07-10",
      title: "Riverside Foundation and Structural Works",
      bidDetails: "Submit a complete structural work proposal with schedule and resource plan.",
      status: "Published",
      task: "Foundation and reinforced concrete structure"
    },
    {
      tenderId: "T002",
      employeeId: "E003",
      deadline: "2026-08-25",
      day: "2026-06-28",
      title: "Meridian Heights Finishing Package",
      bidDetails: "Interior finishing, common-area services, and handover preparation.",
      status: "Awarded",
      task: "Architectural finishing and service coordination"
    },
    {
      tenderId: "T003",
      employeeId: "E001",
      deadline: "2026-05-30",
      day: "2026-04-12",
      title: "Harborline Residential Construction",
      bidDetails: "End-to-end residential block construction based on supplied drawings.",
      status: "Awarded",
      task: "Residential building construction"
    }
  ],

  tenderBids: [
    {
      tenderId: "T001",
      bidId: "B001",
      repId: "R001",
      bidStatus: "Under Review",
      bidAmount: 48500000
    },
    {
      tenderId: "T002",
      bidId: "B001",
      repId: "R001",
      bidStatus: "Selected",
      bidAmount: 30750000
    },
    {
      tenderId: "T003",
      bidId: "B001",
      repId: "R001",
      bidStatus: "Selected",
      bidAmount: 26750000
    }
  ],

  tenderAwards: [
    {
      awardId: "A001",
      tenderId: "T002",
      bidId: "B001",
      employeeId: "E001",
      awardAmount: 30750000,
      awardDate: "2026-06-30"
    },
    {
      awardId: "A002",
      tenderId: "T003",
      bidId: "B001",
      employeeId: "E003",
      awardAmount: 26750000,
      awardDate: "2026-06-04"
    }
  ],

  areas: [
    {
      areaId: "AR001",
      boundaryInfo: "North canal boundary to the central avenue corridor.",
      houseNo: "18",
      roadSector: "Road 7, Central District",
      latitude: 23.7808,
      longitude: 90.4071
    },
    {
      areaId: "AR002",
      boundaryInfo: "Eastern residential block beside the waterfront access road.",
      houseNo: "42",
      roadSector: "Sector 11, East Quarter",
      latitude: 23.7934,
      longitude: 90.4212
    }
  ],

  projects: [
    {
      projectId: "PR001",
      awardId: "A001",
      areaId: "AR001",
      projectBudget: 35000000,
      projectName: "Meridian Heights",
      deadline: "2027-03-30",
      status: "In Progress"
    },
    {
      projectId: "PR002",
      awardId: "A002",
      areaId: "AR002",
      projectBudget: 28000000,
      projectName: "Harborline Residences",
      deadline: "2026-07-15",
      status: "In Progress"
    }
  ],

  units: [
    { unitId: "U001", unitType: "Apartment", unitNo: "A-401", status: "Available" },
    { unitId: "U002", unitType: "Apartment", unitNo: "A-402", status: "Reserved" },
    { unitId: "U003", unitType: "Commercial", unitNo: "C-12", status: "Available" },
    { unitId: "U004", unitType: "Apartment", unitNo: "B-305", status: "Allocated" },
    { unitId: "U005", unitType: "Studio", unitNo: "S-08", status: "Available" },
    { unitId: "U006", unitType: "Parking", unitNo: "P-14", status: "Available" }
  ],

  bookings: [
    {
      bookingId: "BK001",
      clientId: "C001",
      unitId: "U002",
      projectId: "PR001",
      bookingStatus: "Confirmed",
      bookingDate: "2026-07-20",
      dueAmount: 8500000
    },
    {
      bookingId: "BK002",
      clientId: "C002",
      unitId: "U004",
      projectId: "PR002",
      bookingStatus: "Pending",
      bookingDate: "2026-08-02",
      dueAmount: 6200000
    }
  ],

  allocationConfirmations: [
    { bookingId: "BK001", employeeId: "E004" }
  ],

  payments: [
    {
      clientId: "C001",
      paymentId: "PAY001",
      bookingId: "BK001",
      verifiedByEmployeeId: "E002",
      paymentStatus: "Verified",
      verifiedAt: "2026-07-22T11:30:00",
      paymentMethod: "Bank Transfer",
      amount: 3000000,
      paymentDue: "2026-07-25"
    },
    {
      clientId: "C001",
      paymentId: "PAY002",
      bookingId: "BK001",
      verifiedByEmployeeId: "E002",
      paymentStatus: "Pending",
      verifiedAt: "",
      paymentMethod: "Installment Plan",
      amount: 3000000,
      paymentDue: "2026-10-25"
    },
    {
      clientId: "C002",
      paymentId: "PAY001",
      bookingId: "BK002",
      verifiedByEmployeeId: "E002",
      paymentStatus: "Pending",
      verifiedAt: "",
      paymentMethod: "Bank Transfer",
      amount: 1600000,
      paymentDue: "2026-08-20"
    }
  ],

  installments: [
    {
      clientId: "C001",
      paymentId: "PAY002",
      installmentId: "I001",
      amount: 1500000,
      dueDate: "2026-09-25",
      status: "Upcoming",
      expiredAt: ""
    },
    {
      clientId: "C001",
      paymentId: "PAY002",
      installmentId: "I002",
      amount: 1500000,
      dueDate: "2026-10-25",
      status: "Upcoming",
      expiredAt: ""
    },
    {
      clientId: "C002",
      paymentId: "PAY001",
      installmentId: "I001",
      amount: 800000,
      dueDate: "2026-08-20",
      status: "Pending",
      expiredAt: ""
    }
  ],

  complaints: [
    {
      complaintId: "CMP001",
      clientId: "C001",
      resolvedByEmployeeId: "E004",
      status: "Pending",
      filedDate: "2026-08-05",
      note: "Please confirm when the allocation document will be available.",
      resolution: ""
    },
    {
      complaintId: "CMP002",
      clientId: "C002",
      resolvedByEmployeeId: "E004",
      status: "Resolved",
      filedDate: "2026-07-19",
      note: "The payment schedule was not visible in my booking summary.",
      resolution: "The installment schedule was reviewed and shared with the client."
    }
  ],

  projectUpdates: [
    {
      projectId: "PR001",
      updateId: "UP001",
      repId: "R001",
      updateDate: "2026-07-08",
      workNote: "Site preparation and safety perimeter completed.",
      progressPercent: 22
    },
    {
      projectId: "PR001",
      updateId: "UP002",
      repId: "R001",
      updateDate: "2026-08-03",
      workNote: "Foundation reinforcement and first concrete pour completed.",
      progressPercent: 38
    },
    {
      projectId: "PR002",
      updateId: "UP001",
      repId: "R001",
      updateDate: "2026-07-27",
      workNote: "External wall work and service routing are in progress.",
      progressPercent: 68
    }
  ]
};
