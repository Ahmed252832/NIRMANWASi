
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
          companyName: rep.COMPANY_NAME
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
          nid: employee.NID,
          firstName: employee.FIRST_NAME,
          lastName: employee.LAST_NAME,
          contactNo: employee.CONTACT_NO,
          email: employee.EMAIL,
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
          nid: client.NID,
          firstName: client.FIRST_NAME,
          lastName: client.LAST_NAME,
          contactNo: client.CONTACT_NO,
          email: client.EMAIL,
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
        ["RP", Number(counts.pendingRepresentatives) || 0, "representative approval", "Review pending contractor representatives."],
        ["AL", Number(counts.pendingAllocations) || 0, "allocation confirmation", "Confirm existing booking-allocation processes."],
        ["PY", Number(counts.pendingPayments) || 0, "payment verification", "Verify pending client payments."],
        ["CP", Number(counts.openComplaints) || 0, "unresolved complaint", "Record complaint resolutions."],
        ["BD", Number(counts.pendingBidReviews) || 0, "eligible unawarded bid", "Review bids before issuing an award and project."]
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
          '</span><div><h3>' + escapeHtml(pendingItems[index][1] + " " + pendingItems[index][2] +
            (pendingItems[index][1] === 1 ? "" : "s")) + "</h3><p>" + escapeHtml(pendingItems[index][3]) +
          "</p></div></li>";
      }
      setAdminText("dashboardPendingCount", pendingTotal);
      document.getElementById("dashboardPendingList").innerHTML = pendingHtml;

      var deadlineHtml = "";
      for (index = 0; index < deadlines.length; index += 1) {
        deadlineHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(deadlines[index].RECORD_LABEL) +
          "</span></td><td>" + escapeHtml(deadlines[index].RECORD_AREA) + "</td><td>" +
          escapeHtml(formatDate(deadlines[index].DEADLINE)) + "</td><td>" +
          createStatusBadge(getDateState(deadlines[index].DEADLINE)) + "</td></tr>";
      }
      document.getElementById("dashboardDeadlineBody").innerHTML = deadlineHtml ||
        '<tr><td colspan="4"><div class="empty-state"><span class="empty-state-mark">DL</span><h3>No deadlines</h3><p>No active deadline records are available.</p></div></td></tr>';

      var recentHtml = "";
      for (index = 0; index < recentItems.length; index += 1) {
        recentHtml += '<li class="activity-item"><span class="activity-marker">' + escapeHtml(recentItems[index].MARKER) +
          '</span><div><h3>' + escapeHtml(recentItems[index].TITLE) + "</h3><p>" +
          escapeHtml(recentItems[index].NOTE) + " &middot; " + escapeHtml(formatDate(recentItems[index].ACTIVITY_DATE)) +
          "</p></div></li>";
      }
      document.getElementById("dashboardRecentList").innerHTML = recentHtml ||
        '<li class="activity-item"><span class="activity-marker">WK</span><div><h3>No recent work items</h3><p>New operational records will appear here.</p></div></li>';
    })
    .catch(function (error) {
      console.error("Admin dashboard load failed:", error);
      showPageAlert("Could not load the Admin dashboard summary.", "danger");
    });
}

function renderPeoplePage() {
  var employeeHtml = "";
  var departmentHtml = "";
  var clientHtml = "";
  var relationHtml = "";
  var index;
  setAdminText("peopleEmployeeCount", adminEmployeesCache.length);
  setAdminText("peopleDepartmentCount", adminDepartmentsCache.length);
  setAdminText("peopleClientCount", adminClientsCache.length);
  setAdminText("peopleRelationCount", adminWorkRelationsCache.length);

  for (index = 0; index < adminEmployeesCache.length; index += 1) {
    var employee = adminEmployeesCache[index];
    var employeeContact = (employee.email || "") + (employee.email && employee.contactNo ? " / " : "") + (employee.contactNo || "");
    employeeHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(employee.name) +
      '</span><span class="table-secondary-text">' + escapeHtml(employee.employeeId + " / " + employee.personId) +
      "</span></td><td>" + escapeHtml(employee.deptName) + "</td><td>" + escapeHtml(employee.designation) +
      "</td><td>" + escapeHtml(employeeContact || "Not available") +
      "</td><td>" + escapeHtml(employee.nid) + '</td><td><button class="mini-action people-detail" type="button" data-kind="employee" data-id="' +
      escapeHtml(employee.employeeId) + '">View</button></td></tr>';
  }
  document.getElementById("employeeTableBody").innerHTML = employeeHtml;

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
    departmentHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(department.deptName) +
      "</span></td><td>" + escapeHtml(department.location) + "</td><td>" + escapeHtml(department.email) +
      "</td><td>" + escapeHtml(phones.join(", ") || "None recorded") + "</td><td>" + employeeCount +
      "</td><td>" + escapeHtml(department.description) + "</td></tr>";
  }
  document.getElementById("departmentTableBody").innerHTML = departmentHtml;

  for (index = 0; index < adminClientsCache.length; index += 1) {
    var client = adminClientsCache[index];
    var contacts = [];
    for (var contactIndex = 0; contactIndex < adminClientContactsCache.length; contactIndex += 1) {
      if (adminClientContactsCache[contactIndex].clientId === client.clientId) {
        contacts.push(adminClientContactsCache[contactIndex].contactNo);
      }
    }
    clientHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(client.name) +
      '</span><span class="table-secondary-text">' + escapeHtml(client.clientId + " / " + client.personId) +
      "</span></td><td>" + escapeHtml(client.email || "Not available") + "</td><td>" +
      escapeHtml(client.contactNo || "Not available") + "</td><td>" + escapeHtml(contacts.join(", ") || "None recorded") +
      "</td><td>" + escapeHtml(client.nid) + '</td><td><button class="mini-action people-detail" type="button" data-kind="client" data-id="' +
      escapeHtml(client.clientId) + '">View</button></td></tr>';
  }
  document.getElementById("clientTableBody").innerHTML = clientHtml;

  for (index = 0; index < adminWorkRelationsCache.length; index += 1) {
    var relation = adminWorkRelationsCache[index];
    relationHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(relation.managerName) +
      '</span><span class="table-secondary-text">' + escapeHtml(relation.managerId) + "</span></td><td>" +
      escapeHtml(relation.managerDesignation || "Not available") + "</td><td><span class=\"table-primary-text\">" +
      escapeHtml(relation.employeeName) + '</span><span class="table-secondary-text">' +
      escapeHtml(relation.employeeId) + "</span></td><td>" + escapeHtml(relation.employeeDesignation || "Not available") +
      "</td><td>" + escapeHtml(relation.employeeDeptName || "Not available") + "</td></tr>";
  }
  document.getElementById("relationTableBody").innerHTML = relationHtml;

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
      ["Designation", employee.designation], ["NID", employee.nid], ["Email", employee.email],
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
    items = [["Client / Person", client.clientId + " / " + client.personId], ["NID", client.nid],
      ["Email", client.email], ["Person contact", client.contactNo],
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
  var representativeHtml = "";
  var supervisionHtml = "";
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
    contractorHtml += '<tr data-status="' + escapeHtml(licenseState) + '"><td><span class="table-primary-text">' +
      escapeHtml(contractor.companyName) + '</span><span class="table-secondary-text">' + escapeHtml(contractor.contractorId) +
      "</span></td><td>" + escapeHtml(contractor.licenseNo) + "</td><td>" + escapeHtml(formatDate(contractor.licenseDue)) +
      "</td><td>" + createStatusBadge(licenseState) + "</td><td>" + escapeHtml(repNames.join(", ") || "None") +
      "</td><td>" + escapeHtml(supervisorNames.join(", ") || "None") + "</td></tr>";
  }
  document.getElementById("contractorTableBody").innerHTML = contractorHtml;

  for (index = 0; index < adminRepresentativesCache.length; index += 1) {
    var representative = adminRepresentativesCache[index];
    if (representative.approvalStatus === "Pending") {
      pendingCount += 1;
    }
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

  for (index = 0; index < adminSupervisionsCache.length; index += 1) {
    var supervision = adminSupervisionsCache[index];
    supervisionHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(supervision.firstName + " " + supervision.lastName) +
      '</span><span class="table-secondary-text">' + escapeHtml(supervision.employeeId) + "</span></td><td>" +
      escapeHtml(supervision.designation) + "</td><td>" + escapeHtml(supervision.deptName) + "</td><td>" +
      escapeHtml(supervision.companyName) + "</td><td>" + escapeHtml(supervision.licenseNo) + "</td></tr>";
  }
  document.getElementById("supervisionTableBody").innerHTML = supervisionHtml;
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
  var projectHtml = "";
  var unitHtml = "";
  var updateHtml = "";
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
    areaHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(area.areaId) +
      "</span></td><td>" + escapeHtml("House " + area.houseNo + ", " + area.roadSector) + "</td><td>" +
      escapeHtml(area.latitude + ", " + area.longitude) + "</td><td>" + escapeHtml(area.boundaryInfo) + "</td><td>" +
      escapeHtml(group.projectNames.join(", ") || "None") + "</td></tr>";
  }
  document.getElementById("areaTableBody").innerHTML = areaHtml;

  for (index = 0; index < adminPortfolioProjectsCache.length; index += 1) {
    var project = adminPortfolioProjectsCache[index];
    var deadlineState = isProjectOverdue(project) ? "Overdue" : "On schedule";
    if (deadlineState === "Overdue") {
      overdueCount += 1;
    }
    projectHtml += '<tr data-status="' + escapeHtml(deadlineState) + '"><td><span class="table-primary-text">' +
      escapeHtml(project.projectName) + '</span><span class="table-secondary-text">' + escapeHtml(project.projectId) +
      "</span></td><td>" + escapeHtml(project.awardId) + "</td><td>" +
      escapeHtml("House " + project.houseNo + ", " + project.roadSector) +
      "</td><td>" + escapeHtml(formatCurrency(project.projectBudget)) + "</td><td>" + escapeHtml(formatDate(project.deadline)) +
      "<span class=\"table-secondary-text\">" + createStatusBadge(deadlineState) + "</span></td><td>" +
      createStatusBadge(project.status) + "</td><td>" + escapeHtml(project.latestProgress + "%") + "</td></tr>";
  }
  document.getElementById("projectTableBody").innerHTML = projectHtml;

  for (index = 0; index < adminPortfolioUnitsCache.length; index += 1) {
    var unit = adminPortfolioUnitsCache[index];
    if (unit.status === "Available" && !unit.bookingId) {
      availableCount += 1;
    }
    unitHtml += '<tr data-status="' + escapeHtml(unit.status) + '"><td><span class="table-primary-text">' +
      escapeHtml(unit.unitNo) + '</span><span class="table-secondary-text">' + escapeHtml(unit.unitId) +
      "</span></td><td>" + escapeHtml(unit.unitType) + "</td><td>" + createStatusBadge(unit.status) + "</td><td>" +
      escapeHtml(unit.bookingId ? unit.bookingId + " / " + unit.clientName : "No booking context") + "</td><td>" +
      escapeHtml(unit.projectName ? unit.projectName + " (through " + unit.bookingId + ")" : "No project context") +
      "</td></tr>";
  }
  document.getElementById("unitTableBody").innerHTML = unitHtml;

  for (index = 0; index < adminPortfolioUpdatesCache.length; index += 1) {
    var update = adminPortfolioUpdatesCache[index];
    updateHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(update.projectId + " / " + update.updateId) +
      "</span></td><td>" + escapeHtml(update.projectName) + "</td><td>" +
      escapeHtml(update.repName) + "</td><td>" + escapeHtml(formatDate(update.updateDate)) +
      "</td><td>" + escapeHtml(update.progressPercent + "%") + "</td><td>" + escapeHtml(update.workNote) + "</td></tr>";
  }
  document.getElementById("updateTableBody").innerHTML = updateHtml;

  setAdminText("portfolioAreaCount", Object.keys(areaGroups).length);
  setAdminText("portfolioProjectCount", adminPortfolioProjectsCache.length);
  setAdminText("portfolioUnitCount", adminPortfolioUnitsCache.length);
  setAdminText("portfolioUpdateCount", adminPortfolioUpdatesCache.length);
  setAdminText("portfolioOverdueNote", overdueCount + " overdue");
  setAdminText("portfolioAvailableNote", availableCount + " truly available");
}

function renderAllocationsPage() {
  var html = "";
  var confirmedCount = 0;
  for (var index = 0; index < adminAllocationsCache.length; index += 1) {
    var booking = adminAllocationsCache[index];
    var isConfirmed = Boolean(booking.confirmedEmpId);
    var state = isConfirmed ? "Confirmed" : "Pending confirmation";
    if (isConfirmed) {
      confirmedCount += 1;
    }
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
  var installmentHtml = "";
  var totalAmount = 0;
  var pendingCount = 0;
  var index;
  for (index = 0; index < adminPaymentsCache.length; index += 1) {
    var payment = adminPaymentsCache[index];
    totalAmount += Number(payment.amount);
    if (payment.paymentStatus === "Pending") {
      pendingCount += 1;
    }
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

  for (index = 0; index < adminInstallmentsCache.length; index += 1) {
    var installment = adminInstallmentsCache[index];
    installmentHtml += '<tr data-status="' + escapeHtml(installment.status) + '"><td><span class="table-primary-text">' +
      escapeHtml(installment.clientId + " / " + installment.paymentId + " / " + installment.installmentId) +
      "</span></td><td>" + escapeHtml(installment.clientId + " / " + installment.paymentId) + "</td><td>" +
      escapeHtml(installment.clientName) + "</td><td>" + escapeHtml(formatCurrency(installment.amount)) +
      "</td><td>" + escapeHtml(formatDate(installment.dueDate)) + "</td><td>" + createStatusBadge(installment.status) +
      "</td><td>" + escapeHtml(installment.expiredAt ? formatDate(installment.expiredAt) : "Not expired") + "</td></tr>";
  }
  document.getElementById("installmentTableBody").innerHTML = installmentHtml;
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
  var pendingCount = 0;
  var resolvedCount = 0;
  for (var index = 0; index < adminComplaintsCache.length; index += 1) {
    var complaint = adminComplaintsCache[index];
    if (complaint.status === "Resolved") {
      resolvedCount += 1;
    } else {
      pendingCount += 1;
    }
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
  var awardHtml = "";
  var awardedTenderCount = 0;
  var index;
  for (index = 0; index < adminTendersCache.length; index += 1) {
    var tender = adminTendersCache[index];
    if (tender.status === "Awarded") {
      awardedTenderCount += 1;
    }
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

  for (index = 0; index < adminBidsCache.length; index += 1) {
    var bid = adminBidsCache[index];
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

  for (index = 0; index < adminAwardsCache.length; index += 1) {
    var award = adminAwardsCache[index];
    awardHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(award.awardId) +
      "</span></td><td>" + escapeHtml(award.tenderId + " / " + award.bidId) + "</td><td>" +
      escapeHtml(award.empName) + "</td><td>" + escapeHtml(formatCurrency(award.awardAmount)) +
      "</td><td>" + escapeHtml(formatDate(award.awardDate)) + "</td><td>" +
      escapeHtml(award.projectId ? award.projectName + " (" + award.projectId + ")" : "No resulting project") +
      '</td><td><button class="mini-action tender-detail" type="button" data-kind="award" data-first="' +
      escapeHtml(award.awardId) + '">Details</button></td></tr>';
  }
  document.getElementById("awardTableBody").innerHTML = awardHtml;
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
  if (kind === "tender") {
    var tender = findRecord(adminTendersCache, "tenderId", firstId);
    if (!tender) { return; }
    title = tender.title;
    items = [["Tender", tender.tenderId], ["Publisher", tender.publisherName], ["Published", formatDate(tender.day)],
      ["Deadline", formatDate(tender.deadline)], ["Status", tender.status], ["Task", tender.task],
      ["Bid details", tender.bidDetails]];
  } else if (kind === "bid") {
    var bid = findRecord(adminBidsCache.filter(function (b) { return b.tenderId === firstId; }), "bidId", secondId);
    if (!bid) { return; }
    title = "Bid " + bid.tenderId + " / " + bid.bidId;
    items = [["Tender / Bid ID", bid.tenderId + " / " + bid.bidId], ["Representative", bid.repName],
      ["Contractor", bid.companyName], ["Amount", formatCurrency(bid.bidAmount)],
      ["Status", bid.bidStatus], ["Award", bid.awardId || "Unawarded"]];
  } else {
    var award = findRecord(adminAwardsCache, "awardId", firstId);
    if (!award) { return; }
    title = "Award " + award.awardId;
    items = [["Selected bid", award.tenderId + " / " + award.bidId], ["Issued by", award.empName],
      ["Award amount", formatCurrency(award.awardAmount)], ["Award date", formatDate(award.awardDate)],
      ["Resulting project", award.projectId ? award.projectName + " (" + award.projectId + ")" : "Missing"]];
  }
  setAdminText("tenderDetailTitle", title);
  document.getElementById("tenderDetailBody").innerHTML = adminDetailList(items);
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
      initializeAdminPage(page);
    })
    .catch(function () {
      window.location.href = "../../admin-login.html";
    });
});
