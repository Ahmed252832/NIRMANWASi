
var nirmanData = {
  people: [
    {
      personId: "1",
      firstName: "Arif",
      lastName: "Rahman",
      contactNo: "01711000001",
      email: "arif@nirman.com",
      password: "employee123"
    },
    {
      personId: "2",
      firstName: "Nusrat",
      lastName: "Jahan",
      contactNo: "01711000002",
      email: "nusrat@nirman.com",
      password: "employee123"
    },
    {
      personId: "3",
      firstName: "Farhan",
      lastName: "Ahmed",
      contactNo: "01711000003",
      email: "farhan@nirman.com",
      password: "employee123"
    },
    {
      personId: "4",
      firstName: "Samira",
      lastName: "Khan",
      contactNo: "01812000001",
      email: "samira@nirman.com",
      password: "client123"
    },
    {
      personId: "5",
      firstName: "Rafiul",
      lastName: "Islam",
      contactNo: "01812000002",
      email: "rafiul@nirman.com",
      password: "client123"
    },
    {
      personId: "6",
      firstName: "Tanvir",
      lastName: "Hasan",
      contactNo: "01913000001",
      email: "tanvir@nirman.com",
      password: "contractor123"
    },
    {
      personId: "7",
      firstName: "Mehedi",
      lastName: "Chowdhury",
      contactNo: "01913000002",
      email: "mehedi@nirman.com",
      password: "contractor123"
    },
    {
      personId: "8",
      firstName: "Sadia",
      lastName: "Karim",
      contactNo: "01711000004",
      email: "sadia@nirman.com",
      password: "employee123"
    },
    {
      personId: "9",
      firstName: "Ayesha",
      lastName: "Noor",
      contactNo: "01812000003",
      email: "ayesha@nirman.com",
      password: "client123"
    },
    {
      personId: "10",
      firstName: "System",
      lastName: "Administrator",
      contactNo: "01711000005",
      email: "admin@nirman.com",
      password: "admin123"
    }
  ],

  employees: [
    {
      employeeId: "1",
      personId: "1",
      deptName: "Operations",
      designation: "Operations Manager",
      nid: "NID-EMP-1001"
    },
    {
      employeeId: "2",
      personId: "2",
      deptName: "Finance",
      designation: "Finance Officer",
      nid: "NID-EMP-1002"
    },
    {
      employeeId: "3",
      personId: "3",
      deptName: "Engineering",
      designation: "Project Engineer",
      nid: "NID-EMP-1003"
    },
    {
      employeeId: "4",
      personId: "8",
      deptName: "Client Services",
      designation: "Client Service Officer",
      nid: "NID-EMP-1004"
    },
    {
      employeeId: "5",
      personId: "10",
      deptName: "Administration",
      designation: "System Administrator",
      nid: "NID-EMP-1005"
    }
  ],

  departments: [
    {
      deptName: "Operations",
      location: "North Wing, Level 3",
      email: "operations@nirman.com",
      description: "Coordinates allocation, procurement, and operational review."
    },
    {
      deptName: "Finance",
      location: "East Wing, Level 2",
      email: "finance@nirman.com",
      description: "Reviews payments, installments, and financial schedules."
    },
    {
      deptName: "Engineering",
      location: "Project Wing, Level 4",
      email: "engineering@nirman.com",
      description: "Monitors construction work and contractor progress."
    },
    {
      deptName: "Client Services",
      location: "Welcome Wing, Level 1",
      email: "clients@nirman.com",
      description: "Supports bookings, allocation communication, and complaints."
    },
    {
      deptName: "Administration",
      location: "Main Office, Level 2",
      email: "admin@nirman.com",
      description: "Handles system administration and general management."
    }
  ],

  departmentPhones: [
    { deptName: "Operations", phoneNo: "02-55001001" },
    { deptName: "Operations", phoneNo: "02-55001002" },
    { deptName: "Finance", phoneNo: "02-55002001" },
    { deptName: "Engineering", phoneNo: "02-55003001" },
    { deptName: "Engineering", phoneNo: "02-55003002" },
    { deptName: "Client Services", phoneNo: "02-55004001" },
    { deptName: "Administration", phoneNo: "02-55005001" }
  ],

  workRelations: [
    { employeeId: "2", managerId: "1" },
    { employeeId: "3", managerId: "1" },
    { employeeId: "4", managerId: "1" }
  ],

  clients: [
    { clientId: "1", personId: "4", nid: "NID-CLI-2001" },
    { clientId: "2", personId: "5", nid: "NID-CLI-2002" },
    { clientId: "3", personId: "9", nid: "NID-CLI-2003" }
  ],

  clientContacts: [
    { clientId: "1", contactNo: "01812000001" },
    { clientId: "1", contactNo: "01614000001" },
    { clientId: "2", contactNo: "01812000002" },
    { clientId: "3", contactNo: "01812000003" },
    { clientId: "3", contactNo: "01614000003" }
  ],

  contractors: [
    {
      contractorId: "1",
      companyName: "BuildCore Developments",
      licenseNo: "LIC-BC-7841",
      licenseDue: "2027-04-30"
    },
    {
      contractorId: "2",
      companyName: "UrbanAxis Engineering",
      licenseNo: "LIC-UA-5528",
      licenseDue: "2026-10-18"
    }
  ],

  contractorReps: [
    {
      repId: "1",
      personId: "6",
      contractorId: "1",
      approvalStatus: "Approved",
      title: "Site Representative"
    },
    {
      repId: "2",
      personId: "7",
      contractorId: "2",
      approvalStatus: "Pending",
      title: "Bid Coordinator"
    }
  ],

  supervisions: [
    { employeeId: "1", contractorId: "1" },
    { employeeId: "3", contractorId: "1" },
    { employeeId: "1", contractorId: "2" }
  ],

  tenders: [
    {
      tenderId: "1",
      employeeId: "1",
      deadline: "2026-09-15",
      day: "2026-07-10",
      title: "Riverside Foundation and Structural Works",
      bidDetails: "Submit a complete structural work proposal with schedule and resource plan.",
      status: "Published",
      task: "Foundation and reinforced concrete structure"
    },
    {
      tenderId: "2",
      employeeId: "3",
      deadline: "2026-08-25",
      day: "2026-06-28",
      title: "GANGCHILL Finishing Package",
      bidDetails: "Interior finishing, common-area services, and handover preparation.",
      status: "Awarded",
      task: "Architectural finishing and service coordination"
    },
    {
      tenderId: "3",
      employeeId: "1",
      deadline: "2026-05-30",
      day: "2026-04-12",
      title: "KRISHNOCHURA Residential Construction",
      bidDetails: "End-to-end residential block construction based on supplied drawings.",
      status: "Awarded",
      task: "Residential building construction"
    }
  ],

  tenderBids: [
    {
      tenderId: "1",
      bidId: "1",
      repId: "1",
      bidStatus: "Under Review",
      bidAmount: 48500000
    },
    {
      tenderId: "2",
      bidId: "1",
      repId: "1",
      bidStatus: "Selected",
      bidAmount: 30750000
    },
    {
      tenderId: "3",
      bidId: "1",
      repId: "1",
      bidStatus: "Selected",
      bidAmount: 26750000
    }
  ],

  tenderAwards: [
    {
      awardId: "1",
      tenderId: "2",
      bidId: "1",
      employeeId: "1",
      awardAmount: 30750000,
      awardDate: "2026-06-30"
    },
    {
      awardId: "2",
      tenderId: "3",
      bidId: "1",
      employeeId: "3",
      awardAmount: 26750000,
      awardDate: "2026-06-04"
    }
  ],

  areas: [
    {
      areaId: "1",
      boundaryInfo: "Near Sector 7 lake and the main avenue of Uttara.",
      houseNo: "18",
      roadSector: "Avenue No. 3, Road No. 7, Uttara, Dhaka",
      latitude: 23.7808,
      longitude: 90.4071
    },
    {
      areaId: "2",
      boundaryInfo: "Inside Bashundhara residential area near the main road.",
      houseNo: "42",
      roadSector: "Avenue No. 5, Road No. 11, Bashundhara R/A, Dhaka",
      latitude: 23.7934,
      longitude: 90.4212
    }
  ],

  projects: [
    {
      projectId: "1",
      awardId: "1",
      areaId: "1",
      projectBudget: 35000000,
      projectName: "GANGCHILL",
      deadline: "2027-03-30",
      status: "In Progress"
    },
    {
      projectId: "2",
      awardId: "2",
      areaId: "2",
      projectBudget: 28000000,
      projectName: "KRISHNOCHURA",
      deadline: "2026-07-15",
      status: "In Progress"
    }
  ],

  units: [
    { unitId: "1", unitType: "Apartment", unitNo: "A-401", status: "Available" },
    { unitId: "2", unitType: "Apartment", unitNo: "A-402", status: "Reserved" },
    { unitId: "3", unitType: "Commercial", unitNo: "C-12", status: "Available" },
    { unitId: "4", unitType: "Apartment", unitNo: "B-305", status: "Allocated" },
    { unitId: "5", unitType: "Studio", unitNo: "S-08", status: "Available" },
    { unitId: "6", unitType: "Parking", unitNo: "P-14", status: "Available" }
  ],

  bookings: [
    {
      bookingId: "1",
      clientId: "1",
      unitId: "2",
      projectId: "1",
      bookingStatus: "Confirmed",
      bookingDate: "2026-07-20",
      dueAmount: 8500000
    },
    {
      bookingId: "2",
      clientId: "2",
      unitId: "4",
      projectId: "2",
      bookingStatus: "Pending",
      bookingDate: "2026-08-02",
      dueAmount: 6200000
    }
  ],

  allocationConfirmations: [
    { bookingId: "1", employeeId: "4" }
  ],

  payments: [
    {
      clientId: "1",
      paymentId: "1",
      bookingId: "1",
      verifiedByEmployeeId: "2",
      paymentStatus: "Verified",
      verifiedAt: "2026-07-22T11:30:00",
      paymentMethod: "Bank Transfer",
      amount: 3000000,
      paymentDue: "2026-07-25"
    },
    {
      clientId: "1",
      paymentId: "2",
      bookingId: "1",
      verifiedByEmployeeId: "2",
      paymentStatus: "Pending",
      verifiedAt: "",
      paymentMethod: "Installment Plan",
      amount: 3000000,
      paymentDue: "2026-10-25"
    },
    {
      clientId: "2",
      paymentId: "1",
      bookingId: "2",
      verifiedByEmployeeId: "2",
      paymentStatus: "Pending",
      verifiedAt: "",
      paymentMethod: "Bank Transfer",
      amount: 1600000,
      paymentDue: "2026-08-20"
    }
  ],

  installments: [
    {
      clientId: "1",
      paymentId: "2",
      installmentId: "1",
      amount: 1500000,
      dueDate: "2026-09-25",
      status: "Upcoming",
      expiredAt: ""
    },
    {
      clientId: "1",
      paymentId: "2",
      installmentId: "2",
      amount: 1500000,
      dueDate: "2026-10-25",
      status: "Upcoming",
      expiredAt: ""
    },
    {
      clientId: "2",
      paymentId: "1",
      installmentId: "1",
      amount: 800000,
      dueDate: "2026-08-20",
      status: "Pending",
      expiredAt: ""
    }
  ],

  complaints: [
    {
      complaintId: "1",
      clientId: "1",
      resolvedByEmployeeId: "4",
      status: "Pending",
      filedDate: "2026-08-05",
      note: "Please confirm when the allocation document will be available.",
      resolution: ""
    },
    {
      complaintId: "2",
      clientId: "2",
      resolvedByEmployeeId: "4",
      status: "Resolved",
      filedDate: "2026-07-19",
      note: "The payment schedule was not visible in my booking summary.",
      resolution: "The installment schedule was reviewed and shared with the client."
    }
  ],

  projectUpdates: [
    {
      projectId: "1",
      updateId: "1",
      repId: "1",
      updateDate: "2026-07-08",
      workNote: "Site preparation and safety perimeter completed.",
      progressPercent: 22
    },
    {
      projectId: "1",
      updateId: "2",
      repId: "1",
      updateDate: "2026-08-03",
      workNote: "Foundation reinforcement and first concrete pour completed.",
      progressPercent: 38
    },
    {
      projectId: "2",
      updateId: "1",
      repId: "1",
      updateDate: "2026-07-27",
      workNote: "External wall work and service routing are in progress.",
      progressPercent: 68
    }
  ]
};
