
function setAdminText(elementId, value) {
  var element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

var adminContractorsCache = [];
var adminRepresentativesCache = [];
var adminEmployeesCache = [];
var adminDepartmentsCache = [];
var adminDepartmentPhonesCache = [];
var adminClientsCache = [];
var adminClientContactsCache = [];
var adminWorkRelationsCache = [];
var adminSupervisionsCache = [];
var adminAllocationsCache = [];
var adminPaymentsCache = [];
var adminInstallmentsCache = [];
var adminComplaintsCache = [];
var adminTendersCache = [];
var adminBidsCache = [];
var adminAwardsCache = [];
var adminAreasCache = [];
var adminPortfolioAreasCache = [];
var adminPortfolioProjectsCache = [];
var adminPortfolioUnitsCache = [];
var adminPortfolioUpdatesCache = [];

function fetchAdminContractors(callback) {
  fetch("../../backend/api/admin/get_contractors_admin.php")
    .then(function (r) { return r.json(); })
    .then(function (rows) {
      adminContractorsCache = rows.map(function (contractor) {
        return {
          contractorId: contractor.CONTRACTOR_ID,
          companyName: contractor.COMPANY_NAME,
          licenseNo: contractor.LICENSE_NO,
          licenseDue: contractor.LICENSE_DUE
        };
      });
      if (callback) {
        callback();
      }
    });
}

function fetchAdminRepresentatives(callback) {
  fetch("../../backend/api/admin/get_representatives_admin.php")
    .then(function (r) { return r.json(); })
    .then(function (rows) {
      adminRepresentativesCache = rows.map(function (rep) {
        return {
          repId: rep.REP_ID,
          title: rep.TITLE,
          approvalStatus: rep.APPROVAL_STATUS,
          contractorId: rep.CONTRACTOR_ID,
          firstName: rep.FIRST_NAME,
          lastName: rep.LAST_NAME,
          email: rep.EMAIL,
          contactNo: rep.CONTACT_NO,
          companyName: rep.COMPANY_NAME,
          profilePhoto: rep.PROFILE_PHOTO
        };
      });
      if (callback) {
        callback();
      }
    });
}

function fetchAdminEmployees(callback) {
  fetch("../../backend/api/admin/get_employees_admin.php")
    .then(function (r) { return r.json(); })
    .then(function (rows) {
      adminEmployeesCache = rows.map(function (employee) {
        return {
          employeeId: employee.EMP_ID,
          designation: employee.DESIGNATION,
          deptName: employee.DEPT_NAME,
          firstName: employee.FIRST_NAME,
          lastName: employee.LAST_NAME
        };
      });
      if (callback) {
        callback();
      }
    });
}

function fetchAdminPeopleDirectory(callback) {
  fetch("../../backend/api/admin/get_people_directory.php")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Admin people directory request failed");
      }
      return response.json();
    })
    .then(function (data) {
      var employees = Array.isArray(data.employees) ? data.employees : [];
      var departments = Array.isArray(data.departments) ? data.departments : [];
      var departmentPhones = Array.isArray(data.departmentPhones) ? data.departmentPhones : [];
      var clients = Array.isArray(data.clients) ? data.clients : [];
      var clientContacts = Array.isArray(data.clientContacts) ? data.clientContacts : [];
      var workRelations = Array.isArray(data.workRelations) ? data.workRelations : [];

      adminEmployeesCache = employees.map(function (employee) {
        return {
          employeeId: employee.EMP_ID,
          personId: employee.PERSON_ID,
          deptName: employee.DEPT_NAME,
          designation: employee.DESIGNATION,
          firstName: employee.FIRST_NAME,
          lastName: employee.LAST_NAME,
          contactNo: employee.CONTACT_NO,
          email: employee.EMAIL,
          profilePhoto: employee.PROFILE_PHOTO,
          name: ((employee.FIRST_NAME || "") + " " + (employee.LAST_NAME || "")).trim() || "Unknown employee"
        };
      });
      adminDepartmentsCache = departments.map(function (department) {
        return {
          deptName: department.DEPT_NAME,
          location: department.LOCATION,
          email: department.EMAIL,
          description: department.DESCRIPTION
        };
      });
      adminDepartmentPhonesCache = departmentPhones.map(function (phone) {
        return { deptName: phone.DEPT_NAME, phoneNo: phone.PHONE_NO };
      });
      adminClientsCache = clients.map(function (client) {
        return {
          clientId: client.CL_ID,
          personId: client.PERSON_ID,
          firstName: client.FIRST_NAME,
          lastName: client.LAST_NAME,
          contactNo: client.CONTACT_NO,
          email: client.EMAIL,
          profilePhoto: client.PROFILE_PHOTO,
          name: ((client.FIRST_NAME || "") + " " + (client.LAST_NAME || "")).trim() || "Unknown client"
        };
      });
      adminClientContactsCache = clientContacts.map(function (contact) {
        return { clientId: contact.CL_ID, contactNo: contact.CONTACT_NO };
      });
      adminWorkRelationsCache = workRelations.map(function (relation) {
        return {
          employeeId: relation.EMPLOYEE_ID,
          managerId: relation.MANAGER_ID,
          employeeName: ((relation.EMPLOYEE_FIRST_NAME || "") + " " + (relation.EMPLOYEE_LAST_NAME || "")).trim() || "Unknown employee",
          employeeDesignation: relation.EMPLOYEE_DESIGNATION,
          employeeDeptName: relation.EMPLOYEE_DEPT_NAME,
          managerName: ((relation.MANAGER_FIRST_NAME || "") + " " + (relation.MANAGER_LAST_NAME || "")).trim() || "Unknown manager",
          managerDesignation: relation.MANAGER_DESIGNATION
        };
      });

      if (callback) {
        callback();
      }
    })
    .catch(function (error) {
      console.error("Admin people directory load failed:", error);
      showPageAlert("Could not load the people directory.", "danger");
    });
}

function fetchAdminSupervisions(callback) {
  fetch("../../backend/api/admin/get_supervisions_admin.php")
    .then(function (r) { return r.json(); })
    .then(function (rows) {
      adminSupervisionsCache = rows.map(function (supervision) {
        return {
          employeeId: supervision.EMP_ID,
          contractorId: supervision.CONTRACTOR_ID,
          firstName: supervision.FIRST_NAME,
          lastName: supervision.LAST_NAME,
          designation: supervision.DESIGNATION,
          deptName: supervision.DEPT_NAME,
          companyName: supervision.COMPANY_NAME,
          licenseNo: supervision.LICENSE_NO
        };
      });
      if (callback) {
        callback();
      }
    });
}

function fetchAdminPayments(callback) {
  fetch("../../backend/api/admin/get_payments_admin.php")
    .then(function (r) { return r.json(); })
    .then(function (rows) {
      adminPaymentsCache = rows.map(function (payment) {
        return {
          clientId: payment.CL_ID,
          paymentId: payment.PAYMENT_ID,
          bookingId: payment.BOOKING_ID,
          verifiedByEmployeeId: payment.VERIFIED_BY_EMP_ID,
          paymentStatus: payment.PAYMENT_STATUS,
          verifiedAt: payment.VERIFIED_AT,
          paymentMethod: payment.PAYMENT_METHOD,
          amount: payment.AMOUNT,
          paymentDue: payment.PAYMENT_DUE,
          clientName: payment.FIRST_NAME + " " + payment.LAST_NAME,
          verifierName: payment.VERIFIER_FIRST ? (payment.VERIFIER_FIRST + " " + payment.VERIFIER_LAST) : null
        };
      });
      if (callback) {
        callback();
      }
    });
}

function fetchAdminInstallments(callback) {
  fetch("../../backend/api/admin/get_installments_admin.php")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Admin installment request failed");
      }
      return response.json();
    })
    .then(function (rows) {
      adminInstallmentsCache = rows.map(function (installment) {
        return {
          clientId: installment.CL_ID,
          paymentId: installment.PAYMENT_ID,
          installmentId: installment.INSTALLMENT_ID,
          amount: installment.AMOUNT,
          dueDate: installment.DUE_DATE,
          status: installment.STATUS,
          expiredAt: installment.EXPIRED_AT,
          clientName: ((installment.FIRST_NAME || "") + " " + (installment.LAST_NAME || "")).trim() || "Unknown client"
        };
      });
      if (callback) {
        callback();
      }
    })
    .catch(function (error) {
      console.error("Admin installment load failed:", error);
      showPageAlert("Could not load installment records.", "danger");
    });
}

function fetchAdminAllocations(callback) {
  fetch("../../backend/api/admin/get_allocations_admin.php")
    .then(function (r) { return r.json(); })
    .then(function (rows) {
      adminAllocationsCache = rows.map(function (booking) {
        return {
          bookingId: booking.BOOKING_ID,
          clientId: booking.CL_ID,
          unitId: booking.UNIT_ID,
          projectId: booking.PROJECT_ID,
          bookingStatus: booking.BOOKING_STATUS,
          bookingDate: booking.BOOKING_DATE,
          dueAmount: booking.DUE_AMOUNT,
          clientName: booking.FIRST_NAME + " " + booking.LAST_NAME,
          unitNo: booking.UNIT_NO,
          unitType: booking.UNIT_TYPE,
          projectName: booking.PROJECT_NAME,
          confirmedEmpId: booking.CONFIRMED_EMP_ID,
          confirmedEmpName: booking.EMP_FIRST_NAME ? (booking.EMP_FIRST_NAME + " " + booking.EMP_LAST_NAME) : null
        };
      });
      if (callback) {
        callback();
      }
    });
}

function fetchAdminComplaints(callback) {
  fetch("../../backend/api/admin/get_complaints_admin.php")
    .then(function (r) { return r.json(); })
    .then(function (rows) {
      adminComplaintsCache = rows.map(function (complaint) {
        return {
          complaintId: complaint.COMPLAINT_ID,
          clientId: complaint.CL_ID,
          resolvedByEmployeeId: complaint.RESOLVED_BY_EMP_ID,
          status: complaint.STATUS,
          filedDate: complaint.FILED_DATE,
          note: complaint.NOTE,
          resolution: complaint.RESOLUTION,
          clientName: complaint.FIRST_NAME + " " + complaint.LAST_NAME,
          employeeName: complaint.EMP_FIRST_NAME ? (complaint.EMP_FIRST_NAME + " " + complaint.EMP_LAST_NAME) : null
        };
      });
      if (callback) {
        callback();
      }
    });
}

function fetchAdminTenders(callback) {
  fetch("../../backend/api/admin/get_tenders_admin.php")
    .then(function (r) { return r.json(); })
    .then(function (rows) {
      adminTendersCache = rows.map(function (tender) {
        return {
          tenderId: tender.TENDER_ID,
          employeeId: tender.EMP_ID,
          deadline: tender.DEADLINE,
          day: tender.DAY,
          title: tender.TITLE,
          task: tender.TASK,
          bidDetails: tender.BID_DETAILS,
          status: tender.STATUS,
          publisherName: tender.FIRST_NAME + " " + tender.LAST_NAME,
          bidCount: tender.BID_COUNT
        };
      });
      if (callback) {
        callback();
      }
    });
}

function fetchAdminBids(callback) {
  fetch("../../backend/api/admin/get_bids_admin.php")
    .then(function (r) { return r.json(); })
    .then(function (rows) {
      adminBidsCache = rows.map(function (bid) {
        return {
          tenderId: bid.TENDER_ID,
          bidId: bid.BID_ID,
          repId: bid.REP_ID,
          bidStatus: bid.BID_STATUS,
          bidAmount: bid.BID_AMOUNT,
          tenderTitle: bid.TENDER_TITLE,
          tenderStatus: bid.TENDER_STATUS,
          repName: bid.FIRST_NAME + " " + bid.LAST_NAME,
          companyName: bid.COMPANY_NAME,
          awardId: bid.AWARD_ID
        };
      });
      if (callback) {
        callback();
      }
    });
}

function fetchAdminAwards(callback) {
  fetch("../../backend/api/admin/get_awards_admin.php")
    .then(function (r) { return r.json(); })
    .then(function (rows) {
      adminAwardsCache = rows.map(function (award) {
        return {
          awardId: award.AWARD_ID,
          tenderId: award.TENDER_ID,
          bidId: award.BID_ID,
          employeeId: award.EMP_ID,
          awardAmount: award.AWARD_AMOUNT,
          awardDate: award.AWARD_DATE,
          empName: award.FIRST_NAME + " " + award.LAST_NAME,
          projectId: award.PROJECT_ID,
          projectName: award.PROJECT_NAME
        };
      });
      if (callback) {
        callback();
      }
    });
}

function fetchAdminAreas(callback) {
  fetch("../../backend/api/admin/get_areas_admin.php")
    .then(function (r) { return r.json(); })
    .then(function (rows) {
      adminAreasCache = rows.map(function (area) {
        return {
          areaId: area.AREA_ID,
          houseNo: area.HOUSE_NO,
          roadSector: area.ROAD_SECTOR
        };
      });
      if (callback) {
        callback();
      }
    });
}

function fetchPortfolioAreas(callback) {
  fetch("../../backend/api/admin/get_portfolio_areas.php").then(function (r) { return r.json(); }).then(function (rows) {
    adminPortfolioAreasCache = rows.map(function (a) {
      return {
        areaId: a.AREA_ID,
        houseNo: a.HOUSE_NO,
        roadSector: a.ROAD_SECTOR,
        boundaryInfo: a.BOUNDARY_INFO,
        latitude: a.LATITUDE,
        longitude: a.LONGITUDE,
        projectId: a.PROJECT_ID,
        projectName: a.PROJECT_NAME
      };
    });
    if (callback) callback();
  });
}

function fetchPortfolioProjects(callback) {
  fetch("../../backend/api/admin/get_portfolio_projects.php").then(function (r) { return r.json(); }).then(function (rows) {
    adminPortfolioProjectsCache = rows.map(function (p) {
      return {
        projectId: p.PROJECT_ID,
        awardId: p.AWARD_ID,
        areaId: p.AREA_ID,
        projectBudget: p.PROJECT_BUDGET,
        projectName: p.PROJECT_NAME,
        deadline: p.DEADLINE,
        status: p.STATUS,
        houseNo: p.HOUSE_NO,
        roadSector: p.ROAD_SECTOR,
        latestProgress: p.LATEST_PROGRESS
      };
    });
    if (callback) callback();
  });
}

function fetchPortfolioUnits(callback) {
  fetch("../../backend/api/admin/get_portfolio_units.php").then(function (r) { return r.json(); }).then(function (rows) {
    adminPortfolioUnitsCache = rows.map(function (u) {
      return {
        unitId: u.UNIT_ID,
        unitType: u.UNIT_TYPE,
        unitNo: u.UNIT_NO,
        status: u.STATUS,
        bookingId: u.BOOKING_ID,
        clientId: u.CL_ID,
        projectId: u.PROJECT_ID,
        clientName: u.FIRST_NAME ? (u.FIRST_NAME + " " + u.LAST_NAME) : null,
        projectName: u.PROJECT_NAME
      };
    });
    if (callback) callback();
  });
}

function fetchPortfolioUpdates(callback) {
  fetch("../../backend/api/admin/get_portfolio_updates.php").then(function (r) { return r.json(); }).then(function (rows) {
    adminPortfolioUpdatesCache = rows.map(function (u) {
      return {
        projectId: u.PROJECT_ID,
        updateId: u.UPDATE_ID,
        repId: u.REP_ID,
        updateDate: u.UPDATE_DATE,
        workNote: u.WORK_NOTE,
        progressPercent: u.PROGRESS_PERCENT,
        projectName: u.PROJECT_NAME,
        repName: u.FIRST_NAME + " " + u.LAST_NAME
      };
    });
    if (callback) callback();
  });
}

function isEligibleAdminBid(bid) {
  return bid.tenderStatus !== "Awarded" && bid.bidStatus === "Selected" && !bid.awardId;
}

function adminDetailList(items) {
  var html = '<ul class="detail-list">';
  for (var index = 0; index < items.length; index += 1) {
    html += '<li><span class="detail-label">' + escapeHtml(items[index][0]) +
      '</span><span class="detail-value">' + escapeHtml(items[index][1]) + "</span></li>";
  }
  return html + "</ul>";
}

function adminRelatedDisclosure(title, description, records) {
  var html = '<details class="related-disclosure"><summary><span><strong>' + escapeHtml(title) +
    '</strong><small>' + escapeHtml(description) + '</small></span><span class="disclosure-action">Open</span></summary>' +
    '<div class="related-record-list">';
  if (!records.length) {
    html += '<p class="detail-empty-note">No related records are available.</p>';
  }
  for (var index = 0; index < records.length; index += 1) {
    html += '<article><div><strong>' + escapeHtml(records[index][0]) + '</strong><small>' +
      escapeHtml(records[index][1]) + '</small></div><div><strong>' + escapeHtml(records[index][2]) +
      '</strong><small>' + escapeHtml(records[index][3]) + '</small></div></article>';
  }
  return html + "</div></details>";
}

function showAdminRecordDetails(kind, recordKey) {
  var keyParts = String(recordKey || "").split("|");
  var record = null;
  var title = "Record details";
  var recordId = recordKey;
  var status = "Recorded";
  var summary = "Stored NIRMAN operational context.";
  var items = [];
  var relatedHtml = "";
  var index;

  if (kind === "department") {
    record = findRecord(adminDepartmentsCache, "deptName", recordKey);
    if (!record) return;
    var phones = adminDepartmentPhonesCache.filter(function (phone) { return phone.deptName === record.deptName; });
    var employees = adminEmployeesCache.filter(function (employee) { return employee.deptName === record.deptName; });
    title = record.deptName;
    recordId = "Department";
    status = record.location;
    summary = record.description;
    items = [["Location", record.location], ["Email", record.email], ["Phone numbers", phones.map(function (phone) {
      return phone.phoneNo;
    }).join(", ") || "None recorded"], ["Employees", employees.length]];
  } else if (kind === "relation") {
    for (index = 0; index < adminWorkRelationsCache.length; index += 1) {
      if (String(adminWorkRelationsCache[index].employeeId) === keyParts[0] &&
          String(adminWorkRelationsCache[index].managerId) === keyParts[1]) {
        record = adminWorkRelationsCache[index];
        break;
      }
    }
    if (!record) return;
    title = record.employeeName;
    recordId = record.employeeId;
    status = record.employeeDeptName;
    summary = "Reports to " + record.managerName + ".";
    items = [["Employee designation", record.employeeDesignation], ["Department", record.employeeDeptName],
      ["Manager", record.managerName + " (" + record.managerId + ")"], ["Manager designation", record.managerDesignation]];
  } else if (kind === "contractor") {
    record = findRecord(adminContractorsCache, "contractorId", recordKey);
    if (!record) return;
    var contractorReps = adminRepresentativesCache.filter(function (rep) { return rep.contractorId === record.contractorId; });
    var contractorSupervisions = adminSupervisionsCache.filter(function (supervision) {
      return supervision.contractorId === record.contractorId;
    });
    title = record.companyName;
    recordId = record.contractorId;
    status = getLicenseState(record.licenseDue);
    summary = "Licensed construction organization.";
    items = [["License", record.licenseNo], ["License due", formatDate(record.licenseDue)],
      ["Representatives", contractorReps.length], ["Supervising employees", contractorSupervisions.length]];
  } else if (kind === "representative") {
    record = findRecord(adminRepresentativesCache, "repId", recordKey);
    if (!record) return;
    title = record.firstName + " " + record.lastName;
    recordId = record.repId;
    status = record.approvalStatus;
    summary = record.title + " at " + record.companyName + ".";
    items = [["Contractor", record.companyName + " (" + record.contractorId + ")"], ["Email", record.email],
      ["Contact", record.contactNo], ["Approval", record.approvalStatus]];
  } else if (kind === "supervision") {
    for (index = 0; index < adminSupervisionsCache.length; index += 1) {
      if (String(adminSupervisionsCache[index].employeeId) === keyParts[0] &&
          String(adminSupervisionsCache[index].contractorId) === keyParts[1]) {
        record = adminSupervisionsCache[index];
        break;
      }
    }
    if (!record) return;
    title = record.companyName;
    recordId = record.contractorId;
    status = record.deptName;
    summary = record.firstName + " " + record.lastName + " supervises this contractor.";
    items = [["Employee", record.firstName + " " + record.lastName + " (" + record.employeeId + ")"],
      ["Designation", record.designation], ["Department", record.deptName], ["Contractor license", record.licenseNo]];
  } else if (kind === "area") {
    record = findRecord(adminPortfolioAreasCache, "areaId", recordKey);
    if (!record) return;
    var areaProjects = adminPortfolioAreasCache.filter(function (area) {
      return area.areaId === record.areaId && area.projectId;
    });
    title = "Area " + record.areaId;
    recordId = record.areaId;
    status = "Portfolio area";
    summary = "House " + record.houseNo + ", " + record.roadSector + ".";
    items = [["Boundary", record.boundaryInfo], ["Coordinates", record.latitude + ", " + record.longitude],
      ["Linked projects", areaProjects.length]];
    relatedHtml = adminRelatedDisclosure("Projects in this area", "Construction projects linked to this area",
      areaProjects.map(function (area) { return [area.projectName, area.projectId, area.roadSector, "Location"]; }));
  } else if (kind === "project") {
    record = findRecord(adminPortfolioProjectsCache, "projectId", recordKey);
    if (!record) return;
    var projectUpdates = adminPortfolioUpdatesCache.filter(function (update) { return update.projectId === record.projectId; });
    title = record.projectName;
    recordId = record.projectId;
    status = record.status;
    summary = "House " + record.houseNo + ", " + record.roadSector + ".";
    items = [["Budget", formatCurrency(record.projectBudget)], ["Deadline", formatDate(record.deadline)],
      ["Award", record.awardId], ["Area", record.areaId], ["Latest recorded progress", formatAdminProgress(record.latestProgress)],
      ["Recorded updates", projectUpdates.length]];
    relatedHtml = adminRelatedDisclosure("Progress history", "Dated Project_Update records for this project",
      projectUpdates.map(function (update) {
        return [formatDate(update.updateDate), update.workNote, formatAdminProgress(update.progressPercent), update.repName];
      }));
  } else if (kind === "unit") {
    record = findRecord(adminPortfolioUnitsCache, "unitId", recordKey);
    if (!record) return;
    title = record.unitNo + " / " + record.unitType;
    recordId = record.unitId;
    status = record.status;
    summary = record.projectName || "No project context is available.";
    items = [["Booking", record.bookingId || "No booking"], ["Client", record.clientName || "No client"],
      ["Client ID", record.clientId || "Not assigned"], ["Project", record.projectName || "Not linked"],
      ["Project ID", record.projectId || "Not linked"]];
  } else if (kind === "update") {
    for (index = 0; index < adminPortfolioUpdatesCache.length; index += 1) {
      if (String(adminPortfolioUpdatesCache[index].projectId) === keyParts[0] &&
          String(adminPortfolioUpdatesCache[index].updateId) === keyParts[1]) {
        record = adminPortfolioUpdatesCache[index];
        break;
      }
    }
    if (!record) return;
    title = record.projectName;
    recordId = record.projectId + " / " + record.updateId;
    status = "Progress update";
    summary = record.workNote;
    items = [["Update date", formatDate(record.updateDate)], ["Recorded progress", formatAdminProgress(record.progressPercent)],
      ["Representative", record.repName], ["Representative ID", record.repId]];
  } else if (kind === "allocation") {
    record = findRecord(adminAllocationsCache, "bookingId", recordKey);
    if (!record) return;
    title = record.unitNo + " / " + record.projectName;
    recordId = "Booking " + record.bookingId;
    status = record.confirmedEmpId ? "Confirmed" : "Pending confirmation";
    summary = record.clientName + " reserved this " + record.unitType + ".";
    items = [["Client", record.clientName + " (" + record.clientId + ")"], ["Booking date", formatDate(record.bookingDate)],
      ["Booking status", record.bookingStatus], ["Recorded due", formatCurrency(record.dueAmount)],
      ["Confirmed by", record.confirmedEmpName || "Not yet confirmed"]];
  } else if (kind === "payment") {
    for (index = 0; index < adminPaymentsCache.length; index += 1) {
      if (String(adminPaymentsCache[index].clientId) === keyParts[0] &&
          String(adminPaymentsCache[index].paymentId) === keyParts[1]) {
        record = adminPaymentsCache[index];
        break;
      }
    }
    if (!record) return;
    var paymentInstallments = adminInstallmentsCache.filter(function (installment) {
      return installment.clientId === record.clientId && installment.paymentId === record.paymentId;
    });
    title = record.clientName;
    recordId = record.clientId + " / " + record.paymentId;
    status = record.paymentStatus;
    summary = record.paymentMethod + " payment for Booking " + record.bookingId + ".";
    items = [["Amount", formatCurrency(record.amount)], ["Payment due", formatDate(record.paymentDue)],
      ["Verifier", record.verifierName || "Not yet assigned"], ["Verified at", formatAdminDateTime(record.verifiedAt)],
      ["Installment records", paymentInstallments.length]];
    relatedHtml = adminRelatedDisclosure("Installment records", "Child records kept separate from the payment amount",
      paymentInstallments.map(function (installment) {
        return [installment.installmentId, "Due " + formatDate(installment.dueDate), formatCurrency(installment.amount), installment.status];
      }));
  } else if (kind === "installment") {
    for (index = 0; index < adminInstallmentsCache.length; index += 1) {
      if (String(adminInstallmentsCache[index].clientId) === keyParts[0] &&
          String(adminInstallmentsCache[index].paymentId) === keyParts[1] &&
          String(adminInstallmentsCache[index].installmentId) === keyParts[2]) {
        record = adminInstallmentsCache[index];
        break;
      }
    }
    if (!record) return;
    title = "Installment " + record.installmentId;
    recordId = record.clientId + " / " + record.paymentId;
    status = record.status;
    summary = "Child installment record for " + record.clientName + ".";
    items = [["Amount", formatCurrency(record.amount)], ["Due date", formatDate(record.dueDate)],
      ["Expired at", record.expiredAt ? formatAdminDateTime(record.expiredAt) : "Not expired"]];
  } else {
    return;
  }

  var html = '<div class="detail-hero"><span class="entity-id">' + escapeHtml(recordId) + '</span><h3>' +
    escapeHtml(title) + '</h3><p>' + escapeHtml(summary) + '</p>' + createStatusBadge(status) + '</div>' +
    '<div class="detail-list-primary">' + adminDetailList(items) + '</div>' + relatedHtml;
  nirmanOpenDetailDrawer(title, html);
}

function initializeAdminRecordDetails() {
  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-admin-record]");
    if (!trigger) return;
    showAdminRecordDetails(trigger.getAttribute("data-admin-record"), trigger.getAttribute("data-admin-key"));
  });
}

function showAdminModal(modalId) {
  var modalElement = document.getElementById(modalId);
  if (modalElement && window.bootstrap) {
    bootstrap.Modal.getOrCreateInstance(modalElement).show();
  }
}

function hideAdminModal(modalId) {
  var modalElement = document.getElementById(modalId);
  if (modalElement && window.bootstrap) {
    bootstrap.Modal.getOrCreateInstance(modalElement).hide();
  }
}

function getDateState(dateValue) {
  var today = new Date();
  var date = new Date(dateValue + "T23:59:59");
  var dayDifference;
  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }
  today.setHours(0, 0, 0, 0);
  dayDifference = Math.ceil((date.getTime() - today.getTime()) / 86400000);
  if (dayDifference < 0) {
    return "Overdue";
  }
  if (dayDifference <= 30) {
    return "Due soon";
  }
  return "Upcoming";
}

function formatAdminDateTime(dateValue) {
  if (!dateValue) {
    return "Not yet verified";
  }
  var date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getLicenseState(dateValue) {
  var today = new Date();
  var dueDate = new Date(dateValue + "T23:59:59");
  var dayDifference;
  today.setHours(0, 0, 0, 0);
  dayDifference = Math.ceil((dueDate.getTime() - today.getTime()) / 86400000);
  if (dayDifference < 0) {
    return "Expired";
  }
  if (dayDifference <= 90) {
    return "Due soon";
  }
  return "Valid";
}

function countAdminRows(tableId) {
  var table = document.getElementById(tableId);
  var countElement = document.querySelector('[data-admin-count="' + tableId + '"]');
  var rows;
  var visibleCount = 0;
  if (!table || !countElement) {
    return;
  }
  rows = table.querySelectorAll("tbody tr");
  for (var index = 0; index < rows.length; index += 1) {
    if (rows[index].style.display !== "none") {
      visibleCount += 1;
    }
  }
  countElement.textContent = visibleCount + (visibleCount === 1 ? " record" : " records");
}

function applyAdminFilter(tableId) {
  var table = document.getElementById(tableId);
  var group = document.querySelector('.admin-filter-group[data-admin-table="' + tableId + '"]');
  var searchInput;
  var statusSelect;
  var query;
  var selectedStatus;
  var rows;
  if (!table || !group) {
    return;
  }
  searchInput = group.querySelector(".admin-search");
  statusSelect = group.querySelector(".admin-status");
  query = searchInput ? searchInput.value.toLowerCase().trim() : "";
  selectedStatus = statusSelect ? statusSelect.value.toLowerCase() : "all";
  rows = table.querySelectorAll("tbody tr");
  for (var index = 0; index < rows.length; index += 1) {
    var rowText = rows[index].textContent.toLowerCase();
    var rowStatus = String(rows[index].getAttribute("data-status") || "").toLowerCase();
    var matchesSearch = rowText.indexOf(query) >= 0;
    var matchesStatus = selectedStatus === "all" || rowStatus === selectedStatus;
    rows[index].style.display = matchesSearch && matchesStatus ? "" : "none";
  }
  countAdminRows(tableId);
}

function initializeAdminFilters() {
  var groups = document.querySelectorAll(".admin-filter-group");
  for (var index = 0; index < groups.length; index += 1) {
    var tableId = groups[index].getAttribute("data-admin-table");
    var searchInput = groups[index].querySelector(".admin-search");
    var statusSelect = groups[index].querySelector(".admin-status");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        applyAdminFilter(this.closest(".admin-filter-group").getAttribute("data-admin-table"));
      });
    }
    if (statusSelect) {
      statusSelect.addEventListener("change", function () {
        applyAdminFilter(this.closest(".admin-filter-group").getAttribute("data-admin-table"));
      });
    }
    applyAdminFilter(tableId);
  }
}

function renderDashboardPage() {
  fetch("../../backend/api/admin/get_dashboard_summary.php")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Admin dashboard request failed");
      }
      return response.json();
    })
    .then(function (data) {
      var counts = data.counts || {};
      var deadlines = Array.isArray(data.deadlineWatch) ? data.deadlineWatch : [];
      var recentItems = Array.isArray(data.recentWorkItems) ? data.recentWorkItems : [];
      var pendingItems = [
        ["RP", Number(counts.pendingRepresentatives) || 0, "representative approval", "Review pending contractor representatives.", "contractors.html"],
        ["AL", Number(counts.pendingAllocations) || 0, "allocation confirmation", "Confirm existing booking-allocation processes.", "allocations.html"],
        ["PY", Number(counts.pendingPayments) || 0, "payment verification", "Verify pending client payments.", "finance.html"],
        ["CP", Number(counts.openComplaints) || 0, "unresolved complaint", "Record complaint resolutions.", "complaints.html"],
        ["BD", Number(counts.pendingBidReviews) || 0, "eligible unawarded bid", "Review bids before issuing an award and project.", "tenders.html"]
      ];
      var pendingTotal = 0;
      var pendingHtml = "";
      var index;

      setAdminText("dashboardProjectCount", Number(counts.activeProjects) || 0);
      setAdminText("dashboardProjectNote", (Number(counts.projects) || 0) + " total project(s)");
      setAdminText("dashboardUnitCount", Number(counts.availableUnits) || 0);
      setAdminText("dashboardOverdueCount", Number(counts.overdueProjects) || 0);

      for (index = 0; index < pendingItems.length; index += 1) {
        pendingTotal += pendingItems[index][1];
        pendingHtml += '<li class="activity-item"><span class="activity-marker">' + escapeHtml(pendingItems[index][0]) +
          '</span><div><h3><a href="' + escapeHtml(pendingItems[index][4]) + '">' +
          escapeHtml(pendingItems[index][1] + " " + pendingItems[index][2] +
            (pendingItems[index][1] === 1 ? "" : "s")) + "</a></h3><p>" + escapeHtml(pendingItems[index][3]) +
          "</p></div></li>";
      }
      setAdminText("dashboardPendingCount", pendingTotal);
      document.getElementById("dashboardPendingList").innerHTML = pendingHtml;

      var deadlineHtml = "";
      var deadlineCards = "";
      for (index = 0; index < deadlines.length; index += 1) {
        var deadlineState = getDateState(deadlines[index].DEADLINE);
        deadlineCards += nirmanEntityCard({
          id: deadlines[index].RECORD_AREA,
          status: deadlineState,
          title: deadlines[index].RECORD_LABEL,
          summary: "Due " + formatDate(deadlines[index].DEADLINE),
          metrics: [["Area", deadlines[index].RECORD_AREA], ["Date", formatDate(deadlines[index].DEADLINE)]]
        });
        deadlineHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(deadlines[index].RECORD_LABEL) +
          "</span></td><td>" + escapeHtml(deadlines[index].RECORD_AREA) + "</td><td>" +
          escapeHtml(formatDate(deadlines[index].DEADLINE)) + "</td><td>" +
          createStatusBadge(getDateState(deadlines[index].DEADLINE)) + "</td></tr>";
      }
      document.getElementById("dashboardDeadlineBody").innerHTML = deadlineHtml ||
        '<tr><td colspan="4"><div class="empty-state"><span class="empty-state-mark">DL</span><h3>No deadlines</h3><p>No active deadline records are available.</p></div></td></tr>';
      nirmanMountEntitySpotlight("dashboardDeadlineBody", "adminDeadlineWorkspace", "Deadline watch",
        "Upcoming project, tender, payment, and license dates that need monitoring.", deadlineCards,
        "No active deadline records are available.");

      var recentHtml = "";
      for (index = 0; index < recentItems.length; index += 1) {
        recentHtml += '<li class="activity-item"><span class="activity-marker">' + escapeHtml(recentItems[index].MARKER) +
          '</span><div><h3>' + escapeHtml(recentItems[index].TITLE) + "</h3><p>" +
          escapeHtml(recentItems[index].NOTE) + " &middot; " + escapeHtml(formatDate(recentItems[index].ACTIVITY_DATE)) +
          "</p></div></li>";
      }
      document.getElementById("dashboardRecentList").innerHTML = recentHtml ||
        '<li class="activity-item"><span class="activity-marker">WK</span><div><h3>No recent work items</h3><p>New operational records will appear here.</p></div></li>';
      nirmanCollapseCardToDisclosure("dashboardRecentList", "Recent work items", "Latest updates, bookings, complaints, and awards");
      nirmanRenderDashboardInsights([
        { title: "Project status", items: data.projectStatus },
        { title: "Payment status", items: data.paymentStatus },
        { title: "Tender bid status", items: data.bidStatus }
      ]);
    })
    .catch(function (error) {
      console.error("Admin dashboard load failed:", error);
      showPageAlert("Could not load the Admin dashboard summary.", "danger");
    });
}

function renderPeoplePage() {
  var employeeHtml = "";
  var employeeCards = "";
  var departmentHtml = "";
  var departmentCards = "";
  var clientHtml = "";
  var clientCards = "";
  var relationHtml = "";
  var relationCards = "";
  var index;
  setAdminText("peopleEmployeeCount", adminEmployeesCache.length);
  setAdminText("peopleDepartmentCount", adminDepartmentsCache.length);
  setAdminText("peopleClientCount", adminClientsCache.length);
  setAdminText("peopleRelationCount", adminWorkRelationsCache.length);

  for (index = 0; index < adminEmployeesCache.length; index += 1) {
    var employee = adminEmployeesCache[index];
    var employeeContact = (employee.email || "") + (employee.email && employee.contactNo ? " / " : "") + (employee.contactNo || "");
    employeeCards += nirmanEntityCard({
      id: employee.employeeId,
      status: employee.deptName,
      title: employee.name,
      initials: (employee.firstName || "?").charAt(0) + (employee.lastName || "").charAt(0),
      photo: employee.profilePhoto,
      personMeta: employee.designation,
      summary: employee.email,
      metrics: [["Department", employee.deptName], ["Contact", employee.contactNo]],
      footer: employee.designation,
      actions: '<button class="mini-action people-detail" type="button" data-kind="employee" data-id="' + escapeHtml(employee.employeeId) + '">View</button>'
    });
    employeeHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(employee.name) +
      '</span><span class="table-secondary-text">' + escapeHtml(employee.employeeId + " / " + employee.personId) +
      "</span></td><td>" + escapeHtml(employee.deptName) + "</td><td>" + escapeHtml(employee.designation) +
      "</td><td>" + escapeHtml(employeeContact || "Not available") +
      '</td><td>Restricted</td><td><button class="mini-action people-detail" type="button" data-kind="employee" data-id="' +
      escapeHtml(employee.employeeId) + '">View</button></td></tr>';
  }
  document.getElementById("employeeTableBody").innerHTML = employeeHtml;
  nirmanMountEntitySpotlight("employeeTableBody", "adminEmployeeSpotlight", "Employee directory",
    "Review department, designation, and contact context while sensitive national identifiers remain restricted.", employeeCards,
    "No employees are available.");

  for (index = 0; index < adminDepartmentsCache.length; index += 1) {
    var department = adminDepartmentsCache[index];
    var phones = [];
    var employeeCount = 0;
    for (var phoneIndex = 0; phoneIndex < adminDepartmentPhonesCache.length; phoneIndex += 1) {
      if (adminDepartmentPhonesCache[phoneIndex].deptName === department.deptName) {
        phones.push(adminDepartmentPhonesCache[phoneIndex].phoneNo);
      }
    }
    for (var employeeIndex = 0; employeeIndex < adminEmployeesCache.length; employeeIndex += 1) {
      if (adminEmployeesCache[employeeIndex].deptName === department.deptName) {
        employeeCount += 1;
      }
    }
    departmentCards += nirmanEntityCard({
      id: "Department",
      status: department.location,
      title: department.deptName,
      summary: department.description,
      metrics: [["Employees", employeeCount], ["Phones", phones.length], ["Email", department.email]],
      actions: '<button class="mini-action" type="button" data-admin-record="department" data-admin-key="' +
        escapeHtml(department.deptName) + '">Open department</button>'
    });
    departmentHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(department.deptName) +
      "</span></td><td>" + escapeHtml(department.location) + "</td><td>" + escapeHtml(department.email) +
      "</td><td>" + escapeHtml(phones.join(", ") || "None recorded") + "</td><td>" + employeeCount +
      "</td><td>" + escapeHtml(department.description) + "</td></tr>";
  }
  document.getElementById("departmentTableBody").innerHTML = departmentHtml;
  nirmanMountEntitySpotlight("departmentTableBody", "adminDepartmentSpotlight", "Departments",
    "Open a department for its location, contacts, and responsibility description.", departmentCards,
    "No departments are available.");

  for (index = 0; index < adminClientsCache.length; index += 1) {
    var client = adminClientsCache[index];
    var contacts = [];
    for (var contactIndex = 0; contactIndex < adminClientContactsCache.length; contactIndex += 1) {
      if (adminClientContactsCache[contactIndex].clientId === client.clientId) {
        contacts.push(adminClientContactsCache[contactIndex].contactNo);
      }
    }
    clientCards += nirmanEntityCard({
      id: client.clientId,
      status: "Client",
      title: client.name,
      initials: (client.firstName || "?").charAt(0) + (client.lastName || "").charAt(0),
      photo: client.profilePhoto,
      personMeta: client.email,
      summary: "Authenticated client profile with " + contacts.length + " registered contact number" + (contacts.length === 1 ? "." : "s."),
      metrics: [["Primary contact", client.contactNo], ["Contact records", contacts.length]],
      footer: client.email,
      actions: '<button class="mini-action people-detail" type="button" data-kind="client" data-id="' + escapeHtml(client.clientId) + '">View</button>'
    });
    clientHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(client.name) +
      '</span><span class="table-secondary-text">' + escapeHtml(client.clientId + " / " + client.personId) +
      "</span></td><td>" + escapeHtml(client.email || "Not available") + "</td><td>" +
      escapeHtml(client.contactNo || "Not available") + "</td><td>" + escapeHtml(contacts.join(", ") || "None recorded") +
      '</td><td>Restricted</td><td><button class="mini-action people-detail" type="button" data-kind="client" data-id="' +
      escapeHtml(client.clientId) + '">View</button></td></tr>';
  }
  document.getElementById("clientTableBody").innerHTML = clientHtml;
  nirmanMountEntitySpotlight("clientTableBody", "adminClientSpotlight", "Client directory",
    "Use profile identity and contact context for administration without exposing national identifiers.", clientCards,
    "No clients are available.");

  for (index = 0; index < adminWorkRelationsCache.length; index += 1) {
    var relation = adminWorkRelationsCache[index];
    relationCards += nirmanEntityCard({
      id: relation.employeeId,
      status: relation.employeeDeptName,
      title: relation.employeeName,
      summary: "Reports to " + relation.managerName + ".",
      metrics: [["Employee role", relation.employeeDesignation], ["Manager role", relation.managerDesignation]],
      actions: '<button class="mini-action" type="button" data-admin-record="relation" data-admin-key="' +
        escapeHtml(relation.employeeId + "|" + relation.managerId) + '">Open relation</button>'
    });
    relationHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(relation.managerName) +
      '</span><span class="table-secondary-text">' + escapeHtml(relation.managerId) + "</span></td><td>" +
      escapeHtml(relation.managerDesignation || "Not available") + "</td><td><span class=\"table-primary-text\">" +
      escapeHtml(relation.employeeName) + '</span><span class="table-secondary-text">' +
      escapeHtml(relation.employeeId) + "</span></td><td>" + escapeHtml(relation.employeeDesignation || "Not available") +
      "</td><td>" + escapeHtml(relation.employeeDeptName || "Not available") + "</td></tr>";
  }
  document.getElementById("relationTableBody").innerHTML = relationHtml;
  nirmanMountEntitySpotlight("relationTableBody", "adminRelationSpotlight", "Reporting relationships",
    "Manager-to-employee relationships with department and designation context.", relationCards,
    "No reporting relationships are available.");

  var detailButtons = document.querySelectorAll(".people-detail");
  for (index = 0; index < detailButtons.length; index += 1) {
    detailButtons[index].addEventListener("click", function () {
      showPeopleDetails(this.getAttribute("data-kind"), this.getAttribute("data-id"));
    });
  }
}

function showPeopleDetails(kind, recordId) {
  var items = [];
  var title = "Record details";
  if (kind === "employee") {
    var employee = findRecord(adminEmployeesCache, "employeeId", recordId);
    if (!employee) {
      return;
    }
    var managerName = "Top-level employee";
    var subordinateNames = [];
    for (var index = 0; index < adminWorkRelationsCache.length; index += 1) {
      if (adminWorkRelationsCache[index].employeeId === employee.employeeId) {
        managerName = adminWorkRelationsCache[index].managerName;
      }
      if (adminWorkRelationsCache[index].managerId === employee.employeeId) {
        subordinateNames.push(adminWorkRelationsCache[index].employeeName);
      }
    }
    title = employee.name;
    items = [["Employee / Person", employee.employeeId + " / " + employee.personId], ["Department", employee.deptName],
      ["Designation", employee.designation], ["Email", employee.email],
      ["Person contact", employee.contactNo], ["Manager", managerName],
      ["Direct subordinates", subordinateNames.join(", ") || "None"]];
  } else {
    var client = findRecord(adminClientsCache, "clientId", recordId);
    var contacts = [];
    if (!client) {
      return;
    }
    for (var contactIndex = 0; contactIndex < adminClientContactsCache.length; contactIndex += 1) {
      if (adminClientContactsCache[contactIndex].clientId === client.clientId) {
        contacts.push(adminClientContactsCache[contactIndex].contactNo);
      }
    }
    title = client.name;
    items = [["Client / Person", client.clientId + " / " + client.personId], ["Email", client.email],
      ["Person contact", client.contactNo],
      ["All client contacts", contacts.join(", ") || "None"]];
  }
  setAdminText("peopleDetailTitle", title);
  document.getElementById("peopleDetailBody").innerHTML = adminDetailList(items);
  showAdminModal("peopleDetailModal");
}

function populateEmployeeSelect(selectId) {
  var select = document.getElementById(selectId);
  if (!select) {
    return;
  }
  var html = '<option value="">Choose an employee</option>';
  for (var index = 0; index < adminEmployeesCache.length; index += 1) {
    var emp = adminEmployeesCache[index];
    html += '<option value="' + escapeHtml(emp.employeeId) + '">' +
      escapeHtml(emp.firstName + " " + emp.lastName + " - " + emp.designation) + "</option>";
  }
  select.innerHTML = html;
}

function renderContractorsPage() {
  var contractorHtml = "";
  var contractorCards = "";
  var representativeHtml = "";
  var representativeCards = "";
  var supervisionHtml = "";
  var supervisionCards = "";
  var pendingCount = 0;
  var index;
  for (index = 0; index < adminContractorsCache.length; index += 1) {
    var contractor = adminContractorsCache[index];
    var repNames = [];
    var supervisorNames = [];
    var licenseState = getLicenseState(contractor.licenseDue);
    for (var repIndex = 0; repIndex < adminRepresentativesCache.length; repIndex += 1) {
      if (adminRepresentativesCache[repIndex].contractorId === contractor.contractorId) {
        repNames.push(adminRepresentativesCache[repIndex].firstName + " " + adminRepresentativesCache[repIndex].lastName);
      }
    }
    for (var supIndex = 0; supIndex < adminSupervisionsCache.length; supIndex += 1) {
      if (adminSupervisionsCache[supIndex].contractorId === contractor.contractorId) {
        supervisorNames.push(adminSupervisionsCache[supIndex].firstName + " " + adminSupervisionsCache[supIndex].lastName);
      }
    }
    contractorCards += nirmanEntityCard({
      id: contractor.contractorId,
      status: licenseState,
      title: contractor.companyName,
      summary: "Licensed construction organization in the NIRMAN contractor directory.",
      metrics: [["License", contractor.licenseNo], ["License due", formatDate(contractor.licenseDue)], ["Representatives", repNames.length]],
      footer: supervisorNames.length ? supervisorNames.length + " supervising employee(s)" : "No supervision recorded",
      actions: '<button class="mini-action" type="button" data-admin-record="contractor" data-admin-key="' +
        escapeHtml(contractor.contractorId) + '">Open contractor</button>'
    });
    contractorHtml += '<tr data-status="' + escapeHtml(licenseState) + '"><td><span class="table-primary-text">' +
      escapeHtml(contractor.companyName) + '</span><span class="table-secondary-text">' + escapeHtml(contractor.contractorId) +
      "</span></td><td>" + escapeHtml(contractor.licenseNo) + "</td><td>" + escapeHtml(formatDate(contractor.licenseDue)) +
      "</td><td>" + createStatusBadge(licenseState) + "</td><td>" + escapeHtml(repNames.join(", ") || "None") +
      "</td><td>" + escapeHtml(supervisorNames.join(", ") || "None") + "</td></tr>";
  }
  document.getElementById("contractorTableBody").innerHTML = contractorHtml;
  nirmanMountEntitySpotlight("contractorTableBody", "adminContractorSpotlight", "Contractor organizations",
    "Monitor licensing health and representative coverage before consulting the detailed registers.", contractorCards,
    "No contractors are available.");

  for (index = 0; index < adminRepresentativesCache.length; index += 1) {
    var representative = adminRepresentativesCache[index];
    if (representative.approvalStatus === "Pending") {
      pendingCount += 1;
    }
    var representativeActions = '<button class="mini-action" type="button" data-admin-record="representative" data-admin-key="' +
      escapeHtml(representative.repId) + '">Details</button>';
    if (representative.approvalStatus === "Pending") {
      representativeActions += '<button class="mini-action approve-representative" type="button" data-id="' +
        escapeHtml(representative.repId) + '">Approve</button>';
    }
    representativeCards += nirmanEntityCard({
      id: representative.repId,
      status: representative.approvalStatus,
      title: representative.firstName + " " + representative.lastName,
      initials: (representative.firstName || "?").charAt(0) + (representative.lastName || "").charAt(0),
      photo: representative.profilePhoto,
      personMeta: representative.title,
      summary: representative.companyName,
      metrics: [["Contractor", representative.contractorId], ["Email", representative.email], ["Contact", representative.contactNo]],
      footer: "Representative account",
      actions: representativeActions
    });
    representativeHtml += '<tr data-status="' + escapeHtml(representative.approvalStatus) +
      '"><td><span class="table-primary-text">' + escapeHtml(representative.firstName + " " + representative.lastName) +
      '</span><span class="table-secondary-text">' + escapeHtml(representative.repId) +
      "</span></td><td>" + escapeHtml(representative.title) + "</td><td>" +
      escapeHtml(representative.companyName) + "</td><td>" +
      escapeHtml(representative.email + " / " + representative.contactNo) + "</td><td>" +
      createStatusBadge(representative.approvalStatus) + "</td><td>" +
      (representative.approvalStatus === "Pending" ? '<button class="mini-action approve-representative" type="button" data-id="' +
        escapeHtml(representative.repId) + '">Approve</button>' : "Approved") + "</td></tr>";
  }
  document.getElementById("representativeTableBody").innerHTML = representativeHtml;
  nirmanMountEntitySpotlight("representativeTableBody", "adminRepresentativeSpotlight", "Representative directory",
    "Review authenticated contractor representatives, their companies, and approval status visually.", representativeCards,
    "No contractor representatives are available.");

  for (index = 0; index < adminSupervisionsCache.length; index += 1) {
    var supervision = adminSupervisionsCache[index];
    supervisionCards += nirmanEntityCard({
      id: supervision.contractorId,
      status: supervision.deptName,
      title: supervision.companyName,
      summary: supervision.firstName + " " + supervision.lastName + " supervises this contractor.",
      metrics: [["Employee", supervision.employeeId], ["Designation", supervision.designation], ["License", supervision.licenseNo]],
      actions: '<button class="mini-action" type="button" data-admin-record="supervision" data-admin-key="' +
        escapeHtml(supervision.employeeId + "|" + supervision.contractorId) + '">Open assignment</button>'
    });
    supervisionHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(supervision.firstName + " " + supervision.lastName) +
      '</span><span class="table-secondary-text">' + escapeHtml(supervision.employeeId) + "</span></td><td>" +
      escapeHtml(supervision.designation) + "</td><td>" + escapeHtml(supervision.deptName) + "</td><td>" +
      escapeHtml(supervision.companyName) + "</td><td>" + escapeHtml(supervision.licenseNo) + "</td></tr>";
  }
  document.getElementById("supervisionTableBody").innerHTML = supervisionHtml;
  nirmanMountEntitySpotlight("supervisionTableBody", "adminSupervisionSpotlight", "Supervision assignments",
    "See which employee owns oversight for each contractor organization.", supervisionCards,
    "No contractor supervision assignments are available.");
  setAdminText("contractorCount", adminContractorsCache.length);
  setAdminText("representativeCount", adminRepresentativesCache.length);
  setAdminText("pendingRepresentativeCount", pendingCount);
  setAdminText("supervisionCount", adminSupervisionsCache.length);

  var approveButtons = document.querySelectorAll(".approve-representative");
  for (index = 0; index < approveButtons.length; index += 1) {
    approveButtons[index].addEventListener("click", function () {
      var repId = this.getAttribute("data-id");
      var representative = findRecord(adminRepresentativesCache, "repId", repId);
      if (!representative || !window.confirm("Approve " + representative.firstName + " " + representative.lastName + "?")) {
        return;
      }
      var formData = new FormData();
      formData.append("repId", repId);
  nirmanFetch("../../backend/actions/admin/approve_representative.php", { method: "POST", body: formData })
        .then(function (r) { return r.json(); })
        .then(function (result) {
          if (result.success) {
            fetchAdminRepresentatives(function () {
              renderContractorsPage();
              applyAdminFilter("representativeTable");
              showPageAlert(result.message, "success");
            });
          } else {
            showPageAlert(result.message, "danger");
          }
        })
        .catch(function () {
          showPageAlert("Something went wrong. Please try again.", "danger");
        });
    });
  }
}

function initializeContractorForm() {
  var contractorSelect = document.getElementById("supervisionContractor");
  var form = document.getElementById("supervisionForm");
  if (!contractorSelect || !form) {
    return;
  }
  populateEmployeeSelect("supervisionEmployee");
  var html = '<option value="">Choose a contractor</option>';
  for (var index = 0; index < adminContractorsCache.length; index += 1) {
    html += '<option value="' + escapeHtml(adminContractorsCache[index].contractorId) + '">' +
      escapeHtml(adminContractorsCache[index].companyName) + "</option>";
  }
  contractorSelect.innerHTML = html;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var employeeId = document.getElementById("supervisionEmployee").value;
    var contractorId = document.getElementById("supervisionContractor").value;
    if (!employeeId || !contractorId) {
      showPageAlert("Choose an employee and a contractor.", "danger");
      return;
    }
    if (!window.confirm("Create this supervision assignment?")) {
      return;
    }
    var formData = new FormData();
    formData.append("empId", employeeId);
    formData.append("contractorId", contractorId);
  nirmanFetch("../../backend/actions/admin/assign_supervisor.php", { method: "POST", body: formData })
      .then(function (r) { return r.json(); })
      .then(function (result) {
        if (result.success) {
          form.reset();
          hideAdminModal("supervisionModal");
          fetchAdminSupervisions(function () {
            renderContractorsPage();
            applyAdminFilter("supervisionTable");
            showPageAlert(result.message, "success");
          });
        } else {
          showPageAlert(result.message, "danger");
        }
      })
      .catch(function () {
        showPageAlert("Something went wrong. Please try again.", "danger");
      });
  });
}

function renderPortfolioPage() {
  var areaHtml = "";
  var areaCards = "";
  var projectHtml = "";
  var unitHtml = "";
  var unitCards = "";
  var updateHtml = "";
  var updateCards = "";
  var projectCards = "";
  var overdueCount = 0;
  var availableCount = 0;
  var index;

  var areaGroups = {};
  for (index = 0; index < adminPortfolioAreasCache.length; index += 1) {
    var a = adminPortfolioAreasCache[index];
    if (!areaGroups[a.areaId]) {
      areaGroups[a.areaId] = { area: a, projectNames: [] };
    }
    if (a.projectName) {
      areaGroups[a.areaId].projectNames.push(a.projectName);
    }
  }
  for (var areaId in areaGroups) {
    var group = areaGroups[areaId];
    var area = group.area;
    areaCards += nirmanEntityCard({
      id: area.areaId,
      status: "Portfolio area",
      title: "House " + area.houseNo + ", " + area.roadSector,
      summary: area.boundaryInfo,
      metrics: [["Projects", group.projectNames.length], ["Latitude", area.latitude], ["Longitude", area.longitude]],
      actions: '<button class="mini-action" type="button" data-admin-record="area" data-admin-key="' +
        escapeHtml(area.areaId) + '">Open area</button>'
    });
    areaHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(area.areaId) +
      "</span></td><td>" + escapeHtml("House " + area.houseNo + ", " + area.roadSector) + "</td><td>" +
      escapeHtml(area.latitude + ", " + area.longitude) + "</td><td>" + escapeHtml(area.boundaryInfo) + "</td><td>" +
      escapeHtml(group.projectNames.join(", ") || "None") + "</td></tr>";
  }
  document.getElementById("areaTableBody").innerHTML = areaHtml;
  nirmanMountEntitySpotlight("areaTableBody", "adminAreaSpotlight", "Portfolio areas",
    "Browse construction locations and their linked projects before consulting boundary records.", areaCards,
    "No portfolio areas are available.");

  for (index = 0; index < adminPortfolioProjectsCache.length; index += 1) {
    var project = adminPortfolioProjectsCache[index];
    var deadlineState = isProjectOverdue(project) ? "Overdue" : "On schedule";
    if (deadlineState === "Overdue") {
      overdueCount += 1;
    }
    projectCards += nirmanEntityCard({
      id: project.projectId,
      status: project.status,
      title: project.projectName,
      summary: "House " + project.houseNo + ", " + project.roadSector + " / " + deadlineState,
      metrics: [["Budget", formatCurrency(project.projectBudget)], ["Deadline", formatDate(project.deadline)], ["Award", project.awardId]],
      progress: project.latestProgress,
      progressLabel: "Latest recorded progress",
      footer: "Area " + project.areaId,
      actions: '<button class="mini-action" type="button" data-admin-record="project" data-admin-key="' +
        escapeHtml(project.projectId) + '">Open project</button>'
    });
    projectHtml += '<tr data-status="' + escapeHtml(deadlineState) + '"><td><span class="table-primary-text">' +
      escapeHtml(project.projectName) + '</span><span class="table-secondary-text">' + escapeHtml(project.projectId) +
      "</span></td><td>" + escapeHtml(project.awardId) + "</td><td>" +
      escapeHtml("House " + project.houseNo + ", " + project.roadSector) +
      "</td><td>" + escapeHtml(formatCurrency(project.projectBudget)) + "</td><td>" + escapeHtml(formatDate(project.deadline)) +
      "<span class=\"table-secondary-text\">" + createStatusBadge(deadlineState) + "</span></td><td>" +
      createStatusBadge(project.status) + "</td><td>" + nirmanProgressVisual(project.latestProgress, "Latest") + "</td></tr>";
  }
  document.getElementById("projectTableBody").innerHTML = projectHtml;
  nirmanMountEntitySpotlight("projectTableBody", "adminProjectSpotlight", "Portfolio delivery board",
    "Compare project status, deadline, budget, and genuine Project_Update progress before opening the registers.", projectCards,
    "No construction projects are available.");

  for (index = 0; index < adminPortfolioUnitsCache.length; index += 1) {
    var unit = adminPortfolioUnitsCache[index];
    if (unit.status === "Available" && !unit.bookingId) {
      availableCount += 1;
    }
    unitCards += nirmanEntityCard({
      id: unit.unitId,
      status: unit.status,
      title: unit.unitNo + " / " + unit.unitType,
      summary: unit.projectName || "No project context is available.",
      metrics: [["Booking", unit.bookingId || "Not booked"], ["Client", unit.clientName || "Not assigned"]],
      actions: '<button class="mini-action" type="button" data-admin-record="unit" data-admin-key="' +
        escapeHtml(unit.unitId) + '">Open unit</button>'
    });
    unitHtml += '<tr data-status="' + escapeHtml(unit.status) + '"><td><span class="table-primary-text">' +
      escapeHtml(unit.unitNo) + '</span><span class="table-secondary-text">' + escapeHtml(unit.unitId) +
      "</span></td><td>" + escapeHtml(unit.unitType) + "</td><td>" + createStatusBadge(unit.status) + "</td><td>" +
      escapeHtml(unit.bookingId ? unit.bookingId + " / " + unit.clientName : "No booking context") + "</td><td>" +
      escapeHtml(unit.projectName ? unit.projectName + " (through " + unit.bookingId + ")" : "No project context") +
      "</td></tr>";
  }
  document.getElementById("unitTableBody").innerHTML = unitHtml;
  nirmanMountEntitySpotlight("unitTableBody", "adminUnitSpotlight", "Unit inventory",
    "Review true availability and booking context without scanning the inventory register.", unitCards,
    "No unit inventory records are available.");

  for (index = 0; index < adminPortfolioUpdatesCache.length; index += 1) {
    var update = adminPortfolioUpdatesCache[index];
    updateCards += nirmanEntityCard({
      id: update.projectId + " / " + update.updateId,
      status: "Progress update",
      title: update.projectName,
      summary: update.workNote,
      metrics: [["Date", formatDate(update.updateDate)], ["Representative", update.repName]],
      progress: update.progressPercent,
      progressLabel: "Recorded progress",
      actions: '<button class="mini-action" type="button" data-admin-record="update" data-admin-key="' +
        escapeHtml(update.projectId + "|" + update.updateId) + '">Open update</button>'
    });
    updateHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(update.projectId + " / " + update.updateId) +
      "</span></td><td>" + escapeHtml(update.projectName) + "</td><td>" +
      escapeHtml(update.repName) + "</td><td>" + escapeHtml(formatDate(update.updateDate)) +
      "</td><td>" + escapeHtml(update.progressPercent + "%") + "</td><td>" + escapeHtml(update.workNote) + "</td></tr>";
  }
  document.getElementById("updateTableBody").innerHTML = updateHtml;
  nirmanMountEntitySpotlight("updateTableBody", "adminUpdateSpotlight", "Progress updates",
    "Review dated, project-specific progress records with their reporting representative.", updateCards,
    "No project progress updates are available.");

  setAdminText("portfolioAreaCount", Object.keys(areaGroups).length);
  setAdminText("portfolioProjectCount", adminPortfolioProjectsCache.length);
  setAdminText("portfolioUnitCount", adminPortfolioUnitsCache.length);
  setAdminText("portfolioUpdateCount", adminPortfolioUpdatesCache.length);
  setAdminText("portfolioOverdueNote", overdueCount + " overdue");
  setAdminText("portfolioAvailableNote", availableCount + " truly available");
}

function renderAllocationsPage() {
  var html = "";
  var cards = "";
  var confirmedCount = 0;
  for (var index = 0; index < adminAllocationsCache.length; index += 1) {
    var booking = adminAllocationsCache[index];
    var isConfirmed = Boolean(booking.confirmedEmpId);
    var state = isConfirmed ? "Confirmed" : "Pending confirmation";
    if (isConfirmed) {
      confirmedCount += 1;
    }
    var allocationAction = '<button class="mini-action" type="button" data-admin-record="allocation" data-admin-key="' +
      escapeHtml(booking.bookingId) + '">Details</button>';
    if (!isConfirmed) {
      allocationAction += '<button class="mini-action confirm-allocation" type="button" data-id="' +
        escapeHtml(booking.bookingId) + '">Confirm</button>';
    }
    cards += nirmanEntityCard({
      id: "Booking " + booking.bookingId,
      status: state,
      title: booking.unitNo + " / " + booking.projectName,
      summary: booking.clientName + " reserved this " + booking.unitType + ".",
      metrics: [["Booking date", formatDate(booking.bookingDate)], ["Due amount", formatCurrency(booking.dueAmount)], ["Booking", booking.bookingStatus]],
      footer: isConfirmed ? "Confirmed by " + booking.confirmedEmpName : "Pending allocation queue",
      actions: allocationAction
    });
    html += '<tr data-status="' + escapeHtml(state) + '"><td><span class="table-primary-text">' +
      escapeHtml("Booking " + booking.bookingId) + '</span><span class="table-secondary-text">' + escapeHtml(formatDate(booking.bookingDate)) +
      "</span></td><td>" + escapeHtml(booking.clientName) + "</td><td>" +
      escapeHtml(booking.unitNo + " - " + booking.unitType) + "</td><td>" + escapeHtml(booking.projectName) + "</td><td>" +
      createStatusBadge(booking.bookingStatus) + '<span class="table-secondary-text">Due ' +
      escapeHtml(formatCurrency(booking.dueAmount)) + "</span></td><td>" +
      (isConfirmed ? escapeHtml(booking.confirmedEmpName) : createStatusBadge(state)) + "</td><td>" +
      (isConfirmed ? "Confirmed" : '<button class="mini-action confirm-allocation" type="button" data-id="' +
        escapeHtml(booking.bookingId) + '">Confirm</button>') + "</td></tr>";
  }
  document.getElementById("allocationTableBody").innerHTML = html;
  nirmanMountEntitySpotlight("allocationTableBody", "adminAllocationSpotlight", "Allocation control board",
    "Review reserved units and pending confirmations before consulting the complete allocation register.", cards,
    "No booking allocations are available.");
  setAdminText("allocationBookingCount", adminAllocationsCache.length);
  setAdminText("allocationConfirmedCount", confirmedCount);
  setAdminText("allocationPendingCount", adminAllocationsCache.length - confirmedCount);
  setAdminText("allocationPaymentCount", "Separate");
  var buttons = document.querySelectorAll(".confirm-allocation");
  for (index = 0; index < buttons.length; index += 1) {
    buttons[index].addEventListener("click", function () {
      var booking = findRecord(adminAllocationsCache, "bookingId", this.getAttribute("data-id"));
      if (!booking) {
        return;
      }
      document.getElementById("allocationBookingId").value = booking.bookingId;
      setAdminText("allocationSummary", booking.clientName + " - " + booking.unitNo + " - " + booking.projectName);
      showAdminModal("allocationModal");
    });
  }
}

function initializeAllocationForm() {
  var form = document.getElementById("allocationForm");
  if (!form) {
    return;
  }
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var bookingId = document.getElementById("allocationBookingId").value;
    if (!bookingId) {
      showPageAlert("Choose a pending booking.", "danger");
      return;
    }
    if (!window.confirm("Confirm this Booking-Allocation Process?")) {
      return;
    }
    var formData = new FormData();
    formData.append("bookingId", bookingId);
  nirmanFetch("../../backend/actions/admin/confirm_allocation.php", { method: "POST", body: formData })
      .then(function (r) { return r.json(); })
      .then(function (result) {
        if (result.success) {
          form.reset();
          hideAdminModal("allocationModal");
          fetchAdminAllocations(function () {
            renderAllocationsPage();
            applyAdminFilter("allocationTable");
            showPageAlert(result.message, "success");
          });
        } else {
          showPageAlert(result.message, "danger");
        }
      })
      .catch(function () {
        showPageAlert("Something went wrong. Please try again.", "danger");
      });
  });
}

function renderFinancePage() {
  var paymentHtml = "";
  var paymentCards = "";
  var installmentHtml = "";
  var installmentCards = "";
  var totalAmount = 0;
  var pendingCount = 0;
  var index;
  for (index = 0; index < adminPaymentsCache.length; index += 1) {
    var payment = adminPaymentsCache[index];
    totalAmount += Number(payment.amount);
    if (payment.paymentStatus === "Pending") {
      pendingCount += 1;
    }
    var paymentAction = '<button class="mini-action" type="button" data-admin-record="payment" data-admin-key="' +
      escapeHtml(payment.clientId + "|" + payment.paymentId) + '">Details</button>';
    if (payment.paymentStatus === "Pending") {
      paymentAction += '<button class="mini-action verify-payment" type="button" data-client="' + escapeHtml(payment.clientId) +
        '" data-payment="' + escapeHtml(payment.paymentId) + '">Verify</button>';
    }
    paymentCards += nirmanEntityCard({
      id: payment.clientId + " / " + payment.paymentId,
      status: payment.paymentStatus,
      title: payment.clientName,
      summary: payment.paymentMethod + " for Booking " + payment.bookingId,
      metrics: [["Amount", formatCurrency(payment.amount)], ["Due", formatDate(payment.paymentDue)], ["Verifier", payment.verifierName || "Unassigned"]],
      footer: payment.verifiedAt ? "Verified " + formatAdminDateTime(payment.verifiedAt) : "Pending verification",
      actions: paymentAction
    });
    paymentHtml += '<tr data-status="' + escapeHtml(payment.paymentStatus) + '"><td><span class="table-primary-text">' +
      escapeHtml(payment.clientId + " / " + payment.paymentId) + '</span></td><td>' +
      escapeHtml(payment.clientName) + "</td><td>" + escapeHtml(payment.bookingId) + "</td><td>" +
      escapeHtml(formatCurrency(payment.amount)) + '<span class="table-secondary-text">' + escapeHtml(payment.paymentMethod) +
      "</span></td><td>" + escapeHtml(formatDate(payment.paymentDue)) + "</td><td>" +
      escapeHtml(payment.verifierName || "Not yet assigned") + '<span class="table-secondary-text">' +
      escapeHtml(payment.verifiedAt ? "Verified " + formatAdminDateTime(payment.verifiedAt) : "Not yet verified") + "</span></td><td>" +
      createStatusBadge(payment.paymentStatus) + "</td><td>" + (payment.paymentStatus === "Pending" ?
        '<button class="mini-action verify-payment" type="button" data-client="' + escapeHtml(payment.clientId) +
        '" data-payment="' + escapeHtml(payment.paymentId) + '">Verify</button>' : "") + "</td></tr>";
  }
  document.getElementById("paymentTableBody").innerHTML = paymentHtml;
  nirmanMountEntitySpotlight("paymentTableBody", "adminPaymentSpotlight", "Payment control board",
    "Review amounts, deadlines, and verification state before using the full payment and installment registers.", paymentCards,
    "No payments are available.");

  for (index = 0; index < adminInstallmentsCache.length; index += 1) {
    var installment = adminInstallmentsCache[index];
    installmentCards += nirmanEntityCard({
      id: installment.clientId + " / " + installment.paymentId + " / " + installment.installmentId,
      status: installment.status,
      title: installment.clientName,
      summary: "Child installment record kept separate from payment totals.",
      metrics: [["Amount", formatCurrency(installment.amount)], ["Due", formatDate(installment.dueDate)],
        ["Expired", installment.expiredAt ? formatAdminDateTime(installment.expiredAt) : "No"]],
      actions: '<button class="mini-action" type="button" data-admin-record="installment" data-admin-key="' +
        escapeHtml(installment.clientId + "|" + installment.paymentId + "|" + installment.installmentId) +
        '">Open installment</button>'
    });
    installmentHtml += '<tr data-status="' + escapeHtml(installment.status) + '"><td><span class="table-primary-text">' +
      escapeHtml(installment.clientId + " / " + installment.paymentId + " / " + installment.installmentId) +
      "</span></td><td>" + escapeHtml(installment.clientId + " / " + installment.paymentId) + "</td><td>" +
      escapeHtml(installment.clientName) + "</td><td>" + escapeHtml(formatCurrency(installment.amount)) +
      "</td><td>" + escapeHtml(formatDate(installment.dueDate)) + "</td><td>" + createStatusBadge(installment.status) +
      "</td><td>" + escapeHtml(installment.expiredAt ? formatDate(installment.expiredAt) : "Not expired") + "</td></tr>";
  }
  document.getElementById("installmentTableBody").innerHTML = installmentHtml;
  nirmanMountEntitySpotlight("installmentTableBody", "adminInstallmentSpotlight", "Installment schedule",
    "Review child installment due dates and status without combining them with payment totals.", installmentCards,
    "No installment records are available.");
  setAdminText("financePaymentCount", adminPaymentsCache.length);
  setAdminText("financeTotalAmount", formatCurrency(totalAmount));
  setAdminText("financePendingCount", pendingCount);
  setAdminText("financeInstallmentCount", adminInstallmentsCache.length);

  var verifyButtons = document.querySelectorAll(".verify-payment");
  for (index = 0; index < verifyButtons.length; index += 1) {
    verifyButtons[index].addEventListener("click", function () {
      verifyAdminPayment(this.getAttribute("data-client"), this.getAttribute("data-payment"));
    });
  }
}

function verifyAdminPayment(clientId, paymentId) {
  var payment = findRecord(adminPaymentsCache.filter(function (p) { return p.clientId === clientId; }), "paymentId", paymentId);
  if (!payment || payment.paymentStatus !== "Pending") {
    showPageAlert("Only a current Pending payment can be verified.", "danger");
    return;
  }
  if (!window.confirm("Verify " + clientId + " / " + paymentId + " using your Admin employee identity?")) {
    return;
  }
  var formData = new FormData();
  formData.append("clId", clientId);
  formData.append("paymentId", paymentId);
  nirmanFetch("../../backend/actions/admin/verify_payment_admin.php", { method: "POST", body: formData })
    .then(function (r) { return r.json(); })
    .then(function (result) {
      if (result.success) {
        fetchAdminPayments(function () {
          renderFinancePage();
          applyAdminFilter("paymentTable");
          applyAdminFilter("installmentTable");
          showPageAlert(result.message, "success");
        });
      } else {
        showPageAlert(result.message, "danger");
      }
    })
    .catch(function () {
      showPageAlert("Something went wrong. Please try again.", "danger");
    });
}

function renderComplaintsPage() {
  var html = "";
  var cards = "";
  var pendingCount = 0;
  var resolvedCount = 0;
  for (var index = 0; index < adminComplaintsCache.length; index += 1) {
    var complaint = adminComplaintsCache[index];
    if (complaint.status === "Resolved") {
      resolvedCount += 1;
    } else {
      pendingCount += 1;
    }
    var complaintActions = '<button class="mini-action complaint-detail" type="button" data-id="' +
      escapeHtml(complaint.complaintId) + '">Details</button>';
    if (complaint.status !== "Resolved") {
      complaintActions += '<button class="mini-action resolve-complaint" type="button" data-id="' +
        escapeHtml(complaint.complaintId) + '">Resolve</button>';
    }
    cards += nirmanEntityCard({
      id: complaint.complaintId,
      status: complaint.status,
      title: complaint.clientName,
      summary: complaint.note,
      metrics: [["Filed", formatDate(complaint.filedDate)], ["Employee", complaint.employeeName || "Unassigned"], ["Resolution", complaint.resolution ? "Recorded" : "Pending"]],
      footer: "Client-service record",
      actions: complaintActions
    });
    html += '<tr data-status="' + escapeHtml(complaint.status) + '"><td><span class="table-primary-text">' +
      escapeHtml(complaint.complaintId) + '</span><span class="table-secondary-text">' + escapeHtml(formatDate(complaint.filedDate)) +
      "</span></td><td>" + escapeHtml(complaint.clientName) + "</td><td>" +
      escapeHtml(complaint.note) + "</td><td>" + escapeHtml(complaint.employeeName || "Not yet assigned") + "</td><td>" +
      createStatusBadge(complaint.status) + '</td><td><button class="mini-action complaint-detail" type="button" data-id="' +
      escapeHtml(complaint.complaintId) + '">Details</button> ' + (complaint.status === "Resolved" ? "" :
        '<button class="mini-action resolve-complaint" type="button" data-id="' + escapeHtml(complaint.complaintId) +
        '">Resolve</button>') + "</td></tr>";
  }
  document.getElementById("complaintTableBody").innerHTML = html;
  nirmanMountEntitySpotlight("complaintTableBody", "adminComplaintSpotlight", "Complaint operations",
    "Prioritize unresolved client requests before opening the detailed complaint audit register.", cards,
    "No complaints are available.");
  setAdminText("complaintTotalCount", adminComplaintsCache.length);
  setAdminText("complaintPendingCount", pendingCount);
  setAdminText("complaintResolvedCount", resolvedCount);
  setAdminText("complaintEmployeeCount", adminEmployeesCache.length);

  var detailButtons = document.querySelectorAll(".complaint-detail");
  for (var index2 = 0; index2 < detailButtons.length; index2 += 1) {
    detailButtons[index2].addEventListener("click", function () {
      showComplaintDetails(this.getAttribute("data-id"));
    });
  }
  var resolveButtons = document.querySelectorAll(".resolve-complaint");
  for (var index3 = 0; index3 < resolveButtons.length; index3 += 1) {
    resolveButtons[index3].addEventListener("click", function () {
      openComplaintResolution(this.getAttribute("data-id"));
    });
  }
}

function showComplaintDetails(complaintId) {
  var complaint = findRecord(adminComplaintsCache, "complaintId", complaintId);
  if (!complaint) {
    return;
  }
  setAdminText("complaintDetailTitle", "Complaint " + complaint.complaintId);
  document.getElementById("complaintDetailBody").innerHTML = adminDetailList([
    ["Client", complaint.clientName],
    ["Filed date", formatDate(complaint.filedDate)], ["Status", complaint.status], ["Complaint note", complaint.note],
    ["Resolving employee", complaint.employeeName || "Not yet assigned"],
    ["Resolution", complaint.resolution || "Not yet resolved"]
  ]);
  showAdminModal("complaintDetailModal");
}

function openComplaintResolution(complaintId) {
  var complaint = findRecord(adminComplaintsCache, "complaintId", complaintId);
  if (!complaint || complaint.status === "Resolved") {
    showPageAlert("Only an unresolved complaint can be resolved.", "danger");
    return;
  }
  document.getElementById("resolveComplaintId").value = complaint.complaintId;
  document.getElementById("resolveComplaintText").value = "";
  setAdminText("resolveComplaintSummary", complaint.complaintId + ": " + complaint.note);
  showAdminModal("complaintResolveModal");
}

function initializeComplaintForm() {
  var form = document.getElementById("complaintResolveForm");
  if (!form) {
    return;
  }
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var complaintId = document.getElementById("resolveComplaintId").value;
    var resolution = document.getElementById("resolveComplaintText").value.trim();
    if (resolution.length < 10) {
      showPageAlert("Enter at least 10 characters of resolution detail.", "danger");
      return;
    }
    if (!window.confirm("Resolve " + complaintId + "?")) {
      return;
    }
    var formData = new FormData();
    formData.append("complaintId", complaintId);
    formData.append("resolution", resolution);
  nirmanFetch("../../backend/actions/admin/resolve_complaint_admin.php", { method: "POST", body: formData })
      .then(function (r) { return r.json(); })
      .then(function (result) {
        if (result.success) {
          form.reset();
          hideAdminModal("complaintResolveModal");
          fetchAdminComplaints(function () {
            renderComplaintsPage();
            applyAdminFilter("complaintTable");
            showPageAlert(result.message, "success");
          });
        } else {
          showPageAlert(result.message, "danger");
        }
      })
      .catch(function () {
        showPageAlert("Something went wrong. Please try again.", "danger");
      });
  });
}

function populateAwardForm() {
  var bidSelect = document.getElementById("awardBidChoice");
  var areaSelect = document.getElementById("awardProjectArea");
  var bidHtml = '<option value="">Choose an eligible unawarded bid</option>';
  var areaHtml = '<option value="">Choose an existing area</option>';
  for (var index = 0; index < adminBidsCache.length; index += 1) {
    var bid = adminBidsCache[index];
    if (isEligibleAdminBid(bid)) {
      bidHtml += '<option value="' + escapeHtml(bid.tenderId + "|" + bid.bidId) + '">' +
        escapeHtml(bid.tenderId + " / " + bid.bidId + " - " + bid.tenderTitle + " - " + formatCurrency(bid.bidAmount)) + "</option>";
    }
  }
  for (index = 0; index < adminAreasCache.length; index += 1) {
    var area = adminAreasCache[index];
    areaHtml += '<option value="' + escapeHtml(area.areaId) + '">' +
      escapeHtml(area.areaId + " - House " + area.houseNo + ", " + area.roadSector) + "</option>";
  }
  bidSelect.innerHTML = bidHtml;
  areaSelect.innerHTML = areaHtml;
}

function renderTendersPage() {
  var tenderHtml = "";
  var bidHtml = "";
  var bidCards = "";
  var awardHtml = "";
  var awardCards = "";
  var tenderCards = "";
  var awardedTenderCount = 0;
  var index;
  for (index = 0; index < adminTendersCache.length; index += 1) {
    var tender = adminTendersCache[index];
    if (tender.status === "Awarded") {
      awardedTenderCount += 1;
    }
    tenderCards += nirmanEntityCard({
      id: tender.tenderId,
      status: tender.status,
      title: tender.title,
      summary: tender.task,
      metrics: [["Deadline", formatDate(tender.deadline)], ["Bids", tender.bidCount], ["Publisher", tender.publisherName]],
      footer: "Published " + formatDate(tender.day),
      actions: '<button class="mini-action tender-detail" type="button" data-kind="tender" data-first="' +
        escapeHtml(tender.tenderId) + '">Open details</button>'
    });
    tenderHtml += '<tr data-status="' + escapeHtml(tender.status) + '"><td><span class="table-primary-text">' +
      escapeHtml(tender.title) + '</span><span class="table-secondary-text">' + escapeHtml(tender.tenderId) +
      "</span></td><td>" + escapeHtml(tender.publisherName) + "</td><td>" + escapeHtml(formatDate(tender.day)) +
      "</td><td>" + escapeHtml(formatDate(tender.deadline)) +
      "<span class=\"table-secondary-text\">" + createStatusBadge(getDateState(tender.deadline)) + "</span></td><td>" +
      tender.bidCount + "</td><td>" + createStatusBadge(tender.status) +
      '</td><td><button class="mini-action tender-detail" type="button" data-kind="tender" data-first="' +
      escapeHtml(tender.tenderId) + '">Details</button></td></tr>';
  }
  document.getElementById("tenderTableBody").innerHTML = tenderHtml;
  nirmanMountEntitySpotlight("tenderTableBody", "adminTenderSpotlight", "Tender portfolio",
    "Browse tender tasks, deadlines, and bid volume visually; use the registers for exact bid and award comparison.", tenderCards,
    "No tenders are available.");

  for (index = 0; index < adminBidsCache.length; index += 1) {
    var bid = adminBidsCache[index];
    var bidActions = '<button class="mini-action tender-detail" type="button" data-kind="bid" data-first="' +
      escapeHtml(bid.tenderId) + '" data-second="' + escapeHtml(bid.bidId) + '">Details</button>';
    if (isEligibleAdminBid(bid)) {
      bidActions += '<button class="mini-action open-award" type="button" data-value="' +
        escapeHtml(bid.tenderId + "|" + bid.bidId) + '">Award</button>';
    }
    bidCards += nirmanEntityCard({
      id: bid.tenderId + " / " + bid.bidId,
      status: bid.bidStatus,
      title: bid.companyName,
      summary: bid.repName + " bid for " + bid.tenderTitle + ".",
      metrics: [["Amount", formatCurrency(bid.bidAmount)], ["Tender", bid.tenderStatus], ["Award", bid.awardId || "Unawarded"]],
      actions: bidActions
    });
    bidHtml += '<tr data-status="' + escapeHtml(bid.bidStatus) + '"><td><span class="table-primary-text">' +
      escapeHtml(bid.tenderId + " / " + bid.bidId) + '</span></td><td>' +
      escapeHtml(bid.tenderTitle) + "</td><td>" + escapeHtml(bid.repName) +
      '<span class="table-secondary-text">' + escapeHtml(bid.companyName) +
      "</span></td><td>" + escapeHtml(formatCurrency(bid.bidAmount)) + "</td><td>" + createStatusBadge(bid.bidStatus) +
      "</td><td>" + escapeHtml(bid.awardId || "Unawarded") + "</td><td>" +
      '<button class="mini-action tender-detail" type="button" data-kind="bid" data-first="' + escapeHtml(bid.tenderId) +
      '" data-second="' + escapeHtml(bid.bidId) + '">Details</button> ' + (isEligibleAdminBid(bid) ?
        '<button class="mini-action open-award" type="button" data-value="' + escapeHtml(bid.tenderId + "|" + bid.bidId) +
        '">Award</button>' : "") + "</td></tr>";
  }
  document.getElementById("bidTableBody").innerHTML = bidHtml;
  nirmanMountEntitySpotlight("bidTableBody", "adminBidSpotlight", "Bid review queue",
    "Compare submitted amounts and selection state within their tender before issuing an award.", bidCards,
    "No tender bids are available.");

  for (index = 0; index < adminAwardsCache.length; index += 1) {
    var award = adminAwardsCache[index];
    awardCards += nirmanEntityCard({
      id: award.awardId,
      status: "Awarded",
      title: award.projectName || "Award without project context",
      summary: "Selected bid " + award.tenderId + " / " + award.bidId + ".",
      metrics: [["Amount", formatCurrency(award.awardAmount)], ["Award date", formatDate(award.awardDate)], ["Issued by", award.empName]],
      footer: award.projectId ? "Project " + award.projectId : "No resulting project",
      actions: '<button class="mini-action tender-detail" type="button" data-kind="award" data-first="' +
        escapeHtml(award.awardId) + '">Open award</button>'
    });
    awardHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(award.awardId) +
      "</span></td><td>" + escapeHtml(award.tenderId + " / " + award.bidId) + "</td><td>" +
      escapeHtml(award.empName) + "</td><td>" + escapeHtml(formatCurrency(award.awardAmount)) +
      "</td><td>" + escapeHtml(formatDate(award.awardDate)) + "</td><td>" +
      escapeHtml(award.projectId ? award.projectName + " (" + award.projectId + ")" : "No resulting project") +
      '</td><td><button class="mini-action tender-detail" type="button" data-kind="award" data-first="' +
      escapeHtml(award.awardId) + '">Details</button></td></tr>';
  }
  document.getElementById("awardTableBody").innerHTML = awardHtml;
  nirmanMountEntitySpotlight("awardTableBody", "adminAwardSpotlight", "Award register overview",
    "Trace each award from selected bid to its resulting construction project.", awardCards,
    "No tender awards are available.");
  setAdminText("tenderTotalCount", adminTendersCache.length);
  setAdminText("tenderBidCount", adminBidsCache.length);
  setAdminText("tenderAwardCount", adminAwardsCache.length);
  setAdminText("tenderProjectCount", adminAwardsCache.filter(function (a) { return a.projectId; }).length);
  setAdminText("tenderAwardedNote", awardedTenderCount + " tender(s) marked Awarded");
  populateAwardForm();

  var detailButtons = document.querySelectorAll(".tender-detail");
  for (index = 0; index < detailButtons.length; index += 1) {
    detailButtons[index].addEventListener("click", function () {
      showTenderDetails(this.getAttribute("data-kind"), this.getAttribute("data-first"), this.getAttribute("data-second"));
    });
  }
  var awardButtons = document.querySelectorAll(".open-award");
  for (index = 0; index < awardButtons.length; index += 1) {
    awardButtons[index].addEventListener("click", function () {
      document.getElementById("awardBidChoice").value = this.getAttribute("data-value");
      updateAwardAmountFromBid();
      showAdminModal("tenderAwardModal");
    });
  }
}

function updateAwardAmountFromBid() {
  var choice = document.getElementById("awardBidChoice").value.split("|");
  var bid = choice.length === 2 ? findRecord(adminBidsCache.filter(function (b) { return b.tenderId === choice[0]; }), "bidId", choice[1]) : null;
  if (bid) {
    document.getElementById("awardAmount").value = bid.bidAmount;
  }
}

function showTenderDetails(kind, firstId, secondId) {
  var title = "Tender record details";
  var items = [];
  var status = "Recorded";
  var summary = "Tender chain record.";
  var relatedHtml = "";
  if (kind === "tender") {
    var tender = findRecord(adminTendersCache, "tenderId", firstId);
    if (!tender) { return; }
    var tenderBids = adminBidsCache.filter(function (bid) { return bid.tenderId === tender.tenderId; });
    title = tender.title;
    status = tender.status;
    summary = tender.task;
    items = [["Tender", tender.tenderId], ["Publisher", tender.publisherName], ["Published", formatDate(tender.day)],
      ["Deadline", formatDate(tender.deadline)], ["Status", tender.status], ["Task", tender.task],
      ["Bid details", tender.bidDetails]];
    relatedHtml = adminRelatedDisclosure("Same-tender bid comparison", "Amounts and statuses for bids on this tender",
      tenderBids.map(function (bid) {
        return [bid.companyName, bid.repName + " / " + bid.bidId, formatCurrency(bid.bidAmount), bid.bidStatus];
      }));
  } else if (kind === "bid") {
    var bid = findRecord(adminBidsCache.filter(function (b) { return b.tenderId === firstId; }), "bidId", secondId);
    if (!bid) { return; }
    var comparisonBids = adminBidsCache.filter(function (candidate) { return candidate.tenderId === bid.tenderId; });
    title = "Bid " + bid.tenderId + " / " + bid.bidId;
    status = bid.bidStatus;
    summary = bid.companyName + " submission for " + bid.tenderTitle + ".";
    items = [["Tender / Bid ID", bid.tenderId + " / " + bid.bidId], ["Representative", bid.repName],
      ["Contractor", bid.companyName], ["Amount", formatCurrency(bid.bidAmount)],
      ["Status", bid.bidStatus], ["Award", bid.awardId || "Unawarded"]];
    relatedHtml = adminRelatedDisclosure("Same-tender bid comparison", "Amounts and statuses for bids on this tender",
      comparisonBids.map(function (candidate) {
        return [candidate.companyName, candidate.repName + " / " + candidate.bidId,
          formatCurrency(candidate.bidAmount), candidate.bidStatus];
      }));
  } else {
    var award = findRecord(adminAwardsCache, "awardId", firstId);
    if (!award) { return; }
    title = "Award " + award.awardId;
    status = "Awarded";
    summary = award.projectId ? "Created " + award.projectName + "." : "No resulting project is recorded.";
    items = [["Selected bid", award.tenderId + " / " + award.bidId], ["Issued by", award.empName],
      ["Award amount", formatCurrency(award.awardAmount)], ["Award date", formatDate(award.awardDate)],
      ["Resulting project", award.projectId ? award.projectName + " (" + award.projectId + ")" : "Missing"]];
  }
  setAdminText("tenderDetailTitle", title);
  document.getElementById("tenderDetailBody").innerHTML = '<div class="detail-hero"><span class="entity-id">' +
    escapeHtml(firstId) + '</span><h3>' + escapeHtml(title) + '</h3><p>' + escapeHtml(summary) + '</p>' +
    createStatusBadge(status) + '</div><div class="detail-list-primary">' + adminDetailList(items) + '</div>' + relatedHtml;
  showAdminModal("tenderDetailModal");
}

function initializeTenderAwardForm() {
  var form = document.getElementById("tenderAwardForm");
  var bidChoice = document.getElementById("awardBidChoice");
  if (!form || !bidChoice) {
    return;
  }
  bidChoice.addEventListener("change", updateAwardAmountFromBid);
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var choice = bidChoice.value.split("|");
    if (choice.length !== 2) {
      showPageAlert("Choose an eligible unawarded bid.", "danger");
      return;
    }
    if (!window.confirm("Create this Award and its required Construction Project?")) {
      return;
    }
    var formData = new FormData();
    formData.append("tenderId", choice[0]);
    formData.append("bidId", choice[1]);
    formData.append("awardId", document.getElementById("awardId").value.trim());
    formData.append("awardAmount", document.getElementById("awardAmount").value);
    formData.append("awardDate", document.getElementById("awardDate").value);
    formData.append("projectId", document.getElementById("awardProjectId").value.trim());
    formData.append("areaId", document.getElementById("awardProjectArea").value);
    formData.append("projectName", document.getElementById("awardProjectName").value.trim());
    formData.append("projectBudget", document.getElementById("awardProjectBudget").value);
    formData.append("projectDeadline", document.getElementById("awardProjectDeadline").value);
    formData.append("projectStatus", document.getElementById("awardProjectStatus").value);

  nirmanFetch("../../backend/actions/admin/create_award_project.php", { method: "POST", body: formData })
      .then(function (r) { return r.json(); })
      .then(function (result) {
        if (result.success) {
          form.reset();
          hideAdminModal("tenderAwardModal");
          fetchAdminTenders(function () {
            fetchAdminBids(function () {
              fetchAdminAwards(function () {
                renderTendersPage();
                applyAdminFilter("tenderTable");
                applyAdminFilter("bidTable");
                applyAdminFilter("awardTable");
                showPageAlert(result.message, "success");
              });
            });
          });
        } else {
          showPageAlert(result.message, "danger");
        }
      })
      .catch(function () {
        showPageAlert("Something went wrong. Please try again.", "danger");
      });
  });
}

function initializeAdminPage(page) {
  if (page === "dashboard") {
    renderDashboardPage();
  } else if (page === "people") {
    fetchAdminPeopleDirectory(function () {
      renderPeoplePage();
      initializeAdminFilters();
    });
    return;
  } else if (page === "contractors") {
    fetchAdminContractors(function () {
      fetchAdminRepresentatives(function () {
        fetchAdminEmployees(function () {
          fetchAdminSupervisions(function () {
            renderContractorsPage();
            initializeContractorForm();
            initializeAdminFilters();
          });
        });
      });
    });
    return;
  } else if (page === "portfolio") {
    fetchPortfolioAreas(function () {
      fetchPortfolioProjects(function () {
        fetchPortfolioUnits(function () {
          fetchPortfolioUpdates(function () {
            renderPortfolioPage();
            initializeAdminFilters();
          });
        });
      });
    });
    return;
  } else if (page === "allocations") {
    fetchAdminEmployees(function () {
      fetchAdminAllocations(function () {
        renderAllocationsPage();
        initializeAllocationForm();
        initializeAdminFilters();
      });
    });
    return;
  } else if (page === "finance") {
    fetchAdminPayments(function () {
      fetchAdminInstallments(function () {
        renderFinancePage();
        initializeAdminFilters();
      });
    });
    return;
  } else if (page === "complaints") {
    fetchAdminEmployees(function () {
      fetchAdminComplaints(function () {
        renderComplaintsPage();
        initializeComplaintForm();
        initializeAdminFilters();
      });
    });
    return;
  } else if (page === "tenders") {
    fetchAdminEmployees(function () {
      fetchAdminAreas(function () {
        fetchAdminTenders(function () {
          fetchAdminBids(function () {
            fetchAdminAwards(function () {
              renderTendersPage();
              initializeTenderAwardForm();
              initializeAdminFilters();
            });
          });
        });
      });
    });
    return;
  }
  initializeAdminFilters();
}

document.addEventListener("DOMContentLoaded", function () {
  var page = document.body.getAttribute("data-admin-page");
  if (!page) {
    return;
  }

  fetch("../../backend/api/auth/get_current_user.php")
    .then(function (response) { return response.json(); })
    .then(function (result) {
      if (!result.loggedIn || result.role !== "admin") {
        window.location.href = "../../admin-login.html";
        return;
      }
      setNirmanCsrfToken(result.csrfToken);
      var adminInitials = (result.firstName.charAt(0) + result.lastName.charAt(0)).toUpperCase();
      nirmanApplyProfilePhoto(".topbar-right .user-avatar", result.profilePhoto, adminInitials);
      var adminName = document.querySelector(".topbar-right .user-chip-name strong");
      var adminRole = document.querySelector(".topbar-right .user-chip-name span");
      if (adminName) adminName.textContent = result.firstName + " " + result.lastName;
      if (adminRole) adminRole.textContent = result.designation || "System Administrator";
      nirmanLoadModuleInsights("admin", page);
      initializeAdminRecordDetails();
      initializeAdminPage(page);
    })
    .catch(function () {
      window.location.href = "../../admin-login.html";
    });
});
