
var currentEmployeeId = null;
var currentEmployeeDesignation = null;
var employeeAllocationsCache = [];
var employeeComplaintsCache = [];
var employeeProjectsCache = [];
var employeeAreasCache2 = [];
var employeeUpdatesCache = [];
var employeeUnitsCache = [];
var employeeAwardsCache = [];
var employeeBidsForProjectsCache = [];
var employeeContractorsCache = [];
var employeeSupervisionsCache = [];
var employeeRepsCache = [];
var employeePaymentsCache = [];
var employeePaymentBookingsCache = [];
var employeePaymentInstallmentsCache = [];

function employeeFetchAllocations(callback) {
  fetch("../../backend/api/employee/get_allocations_employee.php")
    .then(function (r) { return r.json(); })
    .then(function (rows) {
      employeeAllocationsCache = rows;
      if (callback) {
        callback();
      }
    })
    .catch(function (error) {
      console.error("Failed to load allocations:", error);
      showPageAlert("Could not load allocations.", "danger");
    });
}

function employeeSetText(elementId, value) {
  var element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

var employeeTendersCache = [];
var employeeBidsCache = [];
var employeeAreasCache = [];

function employeeFetchTendersData(callback) {
  Promise.all([
     fetch("../../backend/api/employee/get_tenders_employee.php").then(function (r) { return r.json(); }),
     fetch("../../backend/api/employee/get_bids_employee.php").then(function (r) { return r.json(); }),
     fetch("../../backend/api/employee/get_areas_employee.php").then(function (r) { return r.json(); })
  ]).then(function (results) {
    employeeTendersCache = results[0];
    employeeBidsCache = results[1];
    employeeAreasCache = results[2];
    if (callback) {
      callback();
    }
  }).catch(function (error) {
    console.error("Failed to load tenders data:", error);
    showPageAlert("Could not load tenders data.", "danger");
  });
}

function employeeGetTender(tenderId) {
  return findRecord(employeeTendersCache, "TENDER_ID", tenderId);
}

function employeeGetPaymentBooking(bookingId) {
  return findRecord(employeePaymentBookingsCache, "bookingId", bookingId);
}

function employeeFindBid(tenderId, bidId) {
  for (var i = 0; i < employeeBidsCache.length; i += 1) {
    if (employeeBidsCache[i].TENDER_ID === tenderId && employeeBidsCache[i].BID_ID === bidId) {
      return employeeBidsCache[i];
    }
  }
  return null;
}

function employeeFindPayment(clientId, paymentId) {
  var index;
  for (index = 0; index < employeePaymentsCache.length; index += 1) {
    if (String(employeePaymentsCache[index].clientId) === String(clientId) &&
        String(employeePaymentsCache[index].paymentId) === String(paymentId)) {
      return employeePaymentsCache[index];
    }
  }
  return null;
}

function employeeHasId(list, propertyName, value) {
  var normalizedValue = String(value).toLowerCase();
  var index;
  for (index = 0; index < list.length; index += 1) {
    if (String(list[index][propertyName]).toLowerCase() === normalizedValue) {
      return true;
    }
  }
  return false;
}

function employeeIsSimpleId(value) {
  return Boolean(value && value.length <= 20 && /^[A-Za-z0-9-]+$/.test(value));
}

function employeeGetTodayValue() {
  var today = new Date();
  var month = String(today.getMonth() + 1);
  var day = String(today.getDate());
  if (month.length < 2) {
    month = "0" + month;
  }
  if (day.length < 2) {
    day = "0" + day;
  }
  return today.getFullYear() + "-" + month + "-" + day;
}

function employeeFormatDateTime(value) {
  var date;
  if (!value) {
    return "Not yet verified";
  }
  date = new Date(value);
  if (isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function employeeDetailItem(label, value) {
  return '<li><span class="detail-label">' + escapeHtml(label) +
    '</span><span class="detail-value">' + escapeHtml(value) + "</span></li>";
}

function employeeDetailHtmlItem(label, safeHtml) {
  return '<li><span class="detail-label">' + escapeHtml(label) +
    '</span><span class="detail-value">' + safeHtml + "</span></li>";
}

function employeeEmptyTableRow(columnCount, title, message) {
  return '<tr class="no-results-row"><td colspan="' + columnCount +
    '"><div class="empty-state"><span class="empty-state-mark">--</span><h3>' +
    escapeHtml(title) + "</h3><p>" + escapeHtml(message) + "</p></div></td></tr>";
}

function employeeShowModal(modalId) {
  var modalElement = document.getElementById(modalId);
  if (modalElement && window.bootstrap && bootstrap.Modal &&
      typeof bootstrap.Modal.getOrCreateInstance === "function") {
    bootstrap.Modal.getOrCreateInstance(modalElement).show();
  }
}

function employeeHideModal(modalId) {
  var modalElement = document.getElementById(modalId);
  if (modalElement && window.bootstrap && bootstrap.Modal &&
      typeof bootstrap.Modal.getOrCreateInstance === "function") {
    bootstrap.Modal.getOrCreateInstance(modalElement).hide();
  }
}

function employeeApplyFilter(tableId) {
  var table = document.getElementById(tableId);
  var group = document.querySelector('.employee-filter-group[data-employee-table="' + tableId + '"]');
  var countElement = document.querySelector('[data-employee-count="' + tableId + '"]');
  var search;
  var status;
  var query;
  var selectedStatus;
  var rows;
  var visibleCount = 0;
  var index;
  if (!table || !group) {
    return;
  }
  search = group.querySelector(".employee-search");
  status = group.querySelector(".employee-status");
  query = search ? search.value.toLowerCase().trim() : "";
  selectedStatus = status ? status.value.toLowerCase() : "all";
  rows = table.querySelectorAll("tbody tr[data-filter-row]");
  for (index = 0; index < rows.length; index += 1) {
    var rowStatus = String(rows[index].getAttribute("data-status") || "").toLowerCase();
    var matchesSearch = rows[index].textContent.toLowerCase().indexOf(query) >= 0;
    var matchesStatus = selectedStatus === "all" || rowStatus === selectedStatus;
    rows[index].style.display = matchesSearch && matchesStatus ? "" : "none";
    if (matchesSearch && matchesStatus) {
      visibleCount += 1;
    }
  }
  if (countElement) {
    countElement.textContent = visibleCount + (visibleCount === 1 ? " record" : " records");
  }
}

function employeeApplyPageFilters() {
  var groups = document.querySelectorAll(".employee-filter-group");
  var index;
  for (index = 0; index < groups.length; index += 1) {
    employeeApplyFilter(groups[index].getAttribute("data-employee-table"));
  }
}

function employeeInitializeFilters() {
  var groups = document.querySelectorAll(".employee-filter-group");
  var index;
  for (index = 0; index < groups.length; index += 1) {
    var search = groups[index].querySelector(".employee-search");
    var status = groups[index].querySelector(".employee-status");
    if (search) {
      search.addEventListener("input", function () {
        employeeApplyFilter(this.closest(".employee-filter-group").getAttribute("data-employee-table"));
      });
    }
    if (status) {
      status.addEventListener("change", function () {
        employeeApplyFilter(this.closest(".employee-filter-group").getAttribute("data-employee-table"));
      });
    }
  }
  employeeApplyPageFilters();
}

function employeeCountTenderBids(tenderId) {
  var count = 0;
  for (var i = 0; i < employeeBidsCache.length; i += 1) {
    if (employeeBidsCache[i].TENDER_ID === tenderId) {
      count += 1;
    }
  }
  return count;
}

function employeeGetPaymentInstallments(payment) {
  var installments = [];
  var index;
  for (index = 0; index < employeePaymentInstallmentsCache.length; index += 1) {
    if (String(employeePaymentInstallmentsCache[index].clientId) === String(payment.clientId) &&
        String(employeePaymentInstallmentsCache[index].paymentId) === String(payment.paymentId)) {
      installments.push(employeePaymentInstallmentsCache[index]);
    }
  }
  installments.sort(function (first, second) {
    return new Date(first.dueDate) - new Date(second.dueDate);
  });
  return installments;
}

function employeeRenderDashboard() {
  fetch("../../backend/api/employee/get_employee_dashboard.php")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Employee dashboard request failed");
      }
      return response.json();
    })
    .then(function (data) {
      var ownTenders = Array.isArray(data.ownTenders) ? data.ownTenders : [];
      var projects = Array.isArray(data.projects) ? data.projects : [];
      employeeSetText("dashboardAllocationCount", data.pendingAllocations);
      employeeSetText("dashboardPaymentCount", data.pendingPayments);
      employeeSetText("dashboardComplaintCount", data.pendingComplaints);
      employeeSetText("dashboardTenderCount", ownTenders.length);

      var responsibilities = [
        ["AL", "Confirm Booking-Allocation Processes", data.pendingAllocations + " pending process(es)", "allocations.html"],
        ["PY", "Verify client Payments", data.pendingPayments + " pending payment(s)", "payments.html"],
        ["CP", "Resolve client Complaints", data.pendingComplaints + " unresolved complaint(s)", "complaints.html"],
        ["TN", "Publish and award Tenders", ownTenders.length + " tender(s) created by you", "tenders.html"],
        ["PR", "Supervise Contractors and Projects", "Check progress and deadlines", "projects.html"]
      ];
      var responsibilityHtml = "";
      for (var i = 0; i < responsibilities.length; i += 1) {
        responsibilityHtml += '<li class="activity-item"><span class="activity-marker">' +
          escapeHtml(responsibilities[i][0]) + '</span><div><h3><a href="' +
          escapeHtml(responsibilities[i][3]) + '">' + escapeHtml(responsibilities[i][1]) +
          "</a></h3><p>" + escapeHtml(responsibilities[i][2]) + "</p></div></li>";
      }
      var responsibilityList = document.getElementById("dashboardResponsibilityList");
      if (responsibilityList) {
        responsibilityList.innerHTML = responsibilityHtml;
      }

      var tenderHtml = "";
      for (var t = 0; t < ownTenders.length; t += 1) {
        var tender = ownTenders[t];
        tenderHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(tender.TENDER_ID) +
          '</span><span class="table-secondary-text">' + escapeHtml(tender.TITLE) +
          "</span></td><td>" + escapeHtml(formatDate(tender.DEADLINE)) + "</td><td>" +
          createStatusBadge(tender.STATUS) + "</td><td>" + escapeHtml(tender.BID_COUNT) + "</td></tr>";
      }
      var tenderBody = document.getElementById("dashboardTenderBody");
      if (tenderBody) {
        tenderBody.innerHTML = tenderHtml || employeeEmptyTableRow(4, "No tenders", "Published tenders will appear here.");
      }

      var projectHtml = "";
      for (var p = 0; p < projects.length; p += 1) {
        var project = projects[p];
        var isOverdue = new Date(project.DEADLINE + "T23:59:59") < new Date() && project.STATUS !== "Completed";
        var timeState = isOverdue ? "Overdue" : "On schedule";
        projectHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(project.PROJECT_NAME) +
          '</span><span class="table-secondary-text">' + escapeHtml(project.PROJECT_ID) + "</span></td><td>" +
          createStatusBadge(project.STATUS) + "</td><td>" + escapeHtml(formatDate(project.DEADLINE)) +
          "</td><td>" + createStatusBadge(timeState) + "</td><td>" + escapeHtml(project.PROGRESS + "%") + "</td></tr>";
      }
      var projectBody = document.getElementById("dashboardProjectBody");
      if (projectBody) {
        projectBody.innerHTML = projectHtml || employeeEmptyTableRow(5, "No projects", "Award-resulting projects will appear here.");
      }
    })
    .catch(function (error) {
      console.error("Dashboard load failed:", error);
      showPageAlert("Could not load dashboard data.", "danger");
    });
}

function employeeRenderProfile() {
  fetch("../../backend/api/employee/get_employee_profile.php")
    .then(function (response) { return response.json(); })
    .then(function (data) {
      if (!data.success) {
        showPageAlert("The Person and Employee records could not be found.", "danger");
        return;
      }

      var person = data.person;

      var personDetails = document.getElementById("profilePersonDetails");
      if (personDetails) {
        personDetails.innerHTML = employeeDetailItem("Person ID", person.PERSON_ID) +
          employeeDetailItem("First name", person.FIRST_NAME) +
          employeeDetailItem("Last name", person.LAST_NAME) +
          employeeDetailItem("Contact number", person.CONTACT_NO) +
          employeeDetailItem("Email", person.EMAIL);
      }

      var employeeDetails = document.getElementById("profileEmployeeDetails");
      if (employeeDetails) {
        employeeDetails.innerHTML = employeeDetailItem("Employee ID", person.EMP_ID) +
          employeeDetailItem("Person ID", person.PERSON_ID) +
          employeeDetailItem("Designation", person.DESIGNATION) +
          employeeDetailItem("NID", person.NID) +
          employeeDetailItem("Department", person.DEPT_NAME);
      }

      var departmentDetails = document.getElementById("profileDepartmentDetails");
      if (departmentDetails) {
        departmentDetails.innerHTML = data.department ?
          employeeDetailItem("Department name", data.department.DEPT_NAME) +
          employeeDetailItem("Location", data.department.LOCATION) +
          employeeDetailItem("Email", data.department.EMAIL) +
          employeeDetailItem("All phone numbers", data.phones.join(", ") || "None recorded") +
          employeeDetailItem("Description", data.department.DESCRIPTION) :
          employeeDetailItem("Department", "No matching Department record");
      }

      var managerElement = document.getElementById("profileManager");
      if (managerElement) {
        managerElement.innerHTML = data.manager ?
          '<div class="activity-item"><span class="activity-marker">MG</span><div><h3>' +
          escapeHtml(data.manager.FIRST_NAME + " " + data.manager.LAST_NAME) + "</h3><p>" +
          escapeHtml(data.manager.EMP_ID) + "</p></div></div>" :
          '<p class="text-muted-custom mb-0">' + escapeHtml(currentEmployeeId) +
          ' is a top-level employee with no direct manager record.</p>';
      }

      var subordinateHtml = "";
      for (var i = 0; i < data.subordinates.length; i += 1) {
        var subordinate = data.subordinates[i];
        subordinateHtml += '<li class="activity-item"><span class="activity-marker">SB</span><div><h3>' +
          escapeHtml(subordinate.FIRST_NAME + " " + subordinate.LAST_NAME) + "</h3><p>" +
          escapeHtml(subordinate.EMP_ID + " / " + subordinate.DESIGNATION + " / " + subordinate.DEPT_NAME) +
          "</p></div></li>";
      }
      var subordinateList = document.getElementById("profileSubordinateList");
      if (subordinateList) {
        subordinateList.innerHTML = subordinateHtml || '<li class="text-muted-custom">No direct subordinates.</li>';
      }
    })
    .catch(function (error) {
      console.error("Profile load failed:", error);
      showPageAlert("Could not load profile data.", "danger");
    });
}

function employeeBidIsEligibleForAward(bid) {
  return Boolean(bid && bid.TENDER_STATUS !== "Awarded" && bid.BID_STATUS === "Selected" && !bid.AWARD_ID);
}

function employeePopulateAwardChoices() {
  var bidSelect = document.getElementById("awardBid");
  var areaSelect = document.getElementById("projectArea");
  var previousBid = bidSelect ? bidSelect.value : "";
  var previousArea = areaSelect ? areaSelect.value : "";
  var bidHtml = '<option value="">Choose a selected, unawarded bid</option>';
  var areaHtml = '<option value="">Choose an area</option>';
  var i;
  if (bidSelect) {
    for (i = 0; i < employeeBidsCache.length; i += 1) {
      var bid = employeeBidsCache[i];
      if (employeeBidIsEligibleForAward(bid)) {
        bidHtml += '<option value="' + escapeHtml(bid.TENDER_ID + "|" + bid.BID_ID) + '">' +
          escapeHtml(bid.TENDER_ID + " / " + bid.BID_ID + " - " + formatCurrency(bid.BID_AMOUNT)) + "</option>";
      }
    }
    bidSelect.innerHTML = bidHtml;
    if (previousBid) {
      bidSelect.value = previousBid;
    }
  }
  if (areaSelect) {
    for (i = 0; i < employeeAreasCache.length; i += 1) {
      var area = employeeAreasCache[i];
      areaHtml += '<option value="' + escapeHtml(area.AREA_ID) + '">' +
        escapeHtml(area.AREA_ID + " - House " + area.HOUSE_NO + ", " + area.ROAD_SECTOR) + "</option>";
    }
    areaSelect.innerHTML = areaHtml;
    if (previousArea) {
      areaSelect.value = previousArea;
    }
  }
}

function employeeRenderTenders() {
  var tenderHtml = "";
  var bidHtml = "";
  var ownTenderCount = 0;
  var eligibleCount = 0;
  var i;

  for (i = 0; i < employeeTendersCache.length; i += 1) {
    var tender = employeeTendersCache[i];
    if (tender.EMP_ID === currentEmployeeId) {
      ownTenderCount += 1;
    }
    tenderHtml += '<tr data-filter-row data-status="' + escapeHtml(tender.STATUS) + '"><td><span class="table-primary-text">' +
      escapeHtml(tender.TENDER_ID) + '</span><span class="table-secondary-text">' + escapeHtml(tender.TITLE) +
      "</span></td><td>" + escapeHtml(tender.FIRST_NAME + " " + tender.LAST_NAME) +
      '<span class="table-secondary-text">' + escapeHtml(tender.EMP_ID) + "</span></td><td>" +
      escapeHtml(tender.BID_DETAILS) + "</td><td>" + escapeHtml(formatDate(tender.DEADLINE)) +
      '<span class="table-secondary-text">' + escapeHtml(tender.BID_COUNT + " bid(s)") +
      "</span></td><td>" + createStatusBadge(tender.STATUS) +
      '</td><td><button class="mini-action" type="button" data-tender-detail="' +
      escapeHtml(tender.TENDER_ID) + '">Details</button></td></tr>';
  }

  for (i = 0; i < employeeBidsCache.length; i += 1) {
    var bid = employeeBidsCache[i];
    var actionHtml = "";
    if (employeeBidIsEligibleForAward(bid)) {
      eligibleCount += 1;
    }
    if (bid.BID_STATUS === "Under Review" && bid.TENDER_STATUS !== "Awarded" && !bid.AWARD_ID) {
      actionHtml = '<button class="mini-action" type="button" data-bid-review="select" data-bid-key="' +
        escapeHtml(bid.TENDER_ID + "|" + bid.BID_ID) + '">Select</button> <button class="mini-action" type="button" data-bid-review="reject" data-bid-key="' +
        escapeHtml(bid.TENDER_ID + "|" + bid.BID_ID) + '">Reject</button>';
    } else if (employeeBidIsEligibleForAward(bid)) {
      actionHtml = '<button class="mini-action" type="button" data-open-award="' +
        escapeHtml(bid.TENDER_ID + "|" + bid.BID_ID) + '">Issue award</button>';
    } else {
      actionHtml = bid.AWARD_ID ? createStatusBadge("Awarded") + '<span class="table-secondary-text">' +
        escapeHtml(bid.AWARD_ID) + "</span>" : createStatusBadge(bid.BID_STATUS);
    }
    bidHtml += '<tr data-filter-row data-status="' + escapeHtml(bid.BID_STATUS) + '"><td><span class="table-primary-text">' +
      escapeHtml(bid.TENDER_ID + " / " + bid.BID_ID) + '</span><span class="table-secondary-text">Tender / Bid ID</span></td><td>' +
      escapeHtml(bid.TENDER_TITLE) + "</td><td>" + escapeHtml(bid.FIRST_NAME + " " + bid.LAST_NAME) +
      '<span class="table-secondary-text">' + escapeHtml(bid.COMPANY_NAME) +
      "</span></td><td>" + escapeHtml(formatCurrency(bid.BID_AMOUNT)) + "</td><td>" + createStatusBadge(bid.BID_STATUS) +
      '</td><td><div class="d-flex gap-2 flex-wrap"><button class="mini-action" type="button" data-bid-detail="' +
      escapeHtml(bid.TENDER_ID + "|" + bid.BID_ID) + '">Details</button>' + actionHtml + "</div></td></tr>";
  }

  var tenderBody = document.getElementById("tenderTableBody");
  var bidBody = document.getElementById("bidTableBody");
  if (tenderBody) {
    tenderBody.innerHTML = tenderHtml || employeeEmptyTableRow(6, "No tenders", "No Tender records are available.");
  }
  if (bidBody) {
    bidBody.innerHTML = bidHtml || employeeEmptyTableRow(6, "No bids", "No tender bids are available.");
  }

  employeeSetText("tenderCount", employeeTendersCache.length);
  employeeSetText("myTenderCount", ownTenderCount);
  employeeSetText("bidCount", employeeBidsCache.length);
  employeeSetText("eligibleBidCount", eligibleCount);
  employeePopulateAwardChoices();
  employeeApplyPageFilters();
}

function employeeOpenTenderDetail(tenderId) {
  var tender = employeeGetTender(tenderId);
  var bids = [];
  var i;
  if (!tender) {
    showPageAlert("The selected Tender could not be found.", "danger");
    return;
  }
  for (i = 0; i < employeeBidsCache.length; i += 1) {
    if (employeeBidsCache[i].TENDER_ID === tenderId) {
      bids.push(employeeBidsCache[i]);
    }
  }
  employeeSetText("tenderDetailTitle", tender.TENDER_ID + " - " + tender.TITLE);
  var html = '<ul class="detail-list">' + employeeDetailItem("Tender ID", tender.TENDER_ID) +
    employeeDetailItem("Publisher", tender.FIRST_NAME + " " + tender.LAST_NAME + " (" + tender.EMP_ID + ")") +
    employeeDetailItem("Deadline", formatDate(tender.DEADLINE)) +
    employeeDetailHtmlItem("Status", createStatusBadge(tender.STATUS)) +
    employeeDetailItem("Bid details", tender.BID_DETAILS) + "</ul>";
  if (bids.length) {
    html += '<h3 class="h6 mt-4">Received bids</h3><div class="table-responsive"><table class="table"><thead><tr><th>Bid</th><th>Representative</th><th>Amount</th><th>Status</th></tr></thead><tbody>';
    for (i = 0; i < bids.length; i += 1) {
      html += "<tr><td>" + escapeHtml(bids[i].TENDER_ID + " / " + bids[i].BID_ID) +
        "</td><td>" + escapeHtml(bids[i].FIRST_NAME + " " + bids[i].LAST_NAME) + "</td><td>" +
        escapeHtml(formatCurrency(bids[i].BID_AMOUNT)) + "</td><td>" + createStatusBadge(bids[i].BID_STATUS) + "</td></tr>";
    }
    html += "</tbody></table></div>";
  } else {
    html += '<p class="text-muted-custom mt-3 mb-0">No bids belong to this Tender.</p>';
  }
  var body = document.getElementById("tenderDetailBody");
  if (body) {
    body.innerHTML = html;
  }
  employeeShowModal("tenderDetailModal");
}

function employeeOpenBidDetail(compositeKey) {
  var parts = compositeKey.split("|");
  var bid = parts.length === 2 ? employeeFindBid(parts[0], parts[1]) : null;
  if (!bid) {
    showPageAlert("The selected tender bid could not be found.", "danger");
    return;
  }
  employeeSetText("tenderDetailTitle", "Bid " + bid.TENDER_ID + " / " + bid.BID_ID);
  var html = '<ul class="detail-list">' +
    employeeDetailItem("Bid", bid.TENDER_ID + " / " + bid.BID_ID) +
    employeeDetailItem("Tender", bid.TENDER_TITLE) +
    employeeDetailItem("Representative", bid.FIRST_NAME + " " + bid.LAST_NAME + " (" + bid.REP_ID + ")") +
    employeeDetailItem("Contractor", bid.COMPANY_NAME) +
    employeeDetailItem("Bid amount", formatCurrency(bid.BID_AMOUNT)) +
    employeeDetailHtmlItem("Bid status", createStatusBadge(bid.BID_STATUS)) +
    employeeDetailItem("Matching award", bid.AWARD_ID || "Unawarded") + "</ul>";
  var body = document.getElementById("tenderDetailBody");
  if (body) {
    body.innerHTML = html;
  }
  employeeShowModal("tenderDetailModal");
}

function employeeReviewBid(compositeKey, action) {
  var parts = compositeKey.split("|");
  if (!window.confirm((action === "select" ? "Select" : "Reject") + " bid " + compositeKey + "?")) {
    return;
  }
  var formData = new FormData();
  formData.append("tenderId", parts[0]);
  formData.append("bidId", parts[1]);
  formData.append("action", action);
  nirmanFetch("../../backend/actions/employee/review_bid.php", { method: "POST", body: formData })
    .then(function (r) { return r.json(); })
    .then(function (result) {
      if (result.success) {
        employeeFetchTendersData(function () {
          employeeRenderTenders();
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

function employeeSubmitTender(event) {
  event.preventDefault();
  var form = event.currentTarget;
  var formData = new FormData();
  formData.append("tenderId", document.getElementById("newTenderId").value.trim());
  formData.append("deadline", document.getElementById("newTenderDeadline").value);
  formData.append("title", document.getElementById("newTenderTitle").value.trim());
  formData.append("task", document.getElementById("newTenderTask").value.trim());
  formData.append("bidDetails", document.getElementById("newTenderBidDetails").value.trim());

  if (!window.confirm("Publish this Tender?")) {
    return;
  }

  nirmanFetch("../../backend/actions/employee/publish_tender.php", { method: "POST", body: formData })
    .then(function (r) { return r.json(); })
    .then(function (result) {
      if (result.success) {
        form.reset();
        employeeHideModal("publishTenderModal");
        employeeFetchTendersData(function () {
          employeeRenderTenders();
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

function employeeOpenAwardForm(compositeKey) {
  employeePopulateAwardChoices();
  var select = document.getElementById("awardBid");
  if (select) {
    select.value = compositeKey || "";
  }
  employeeSetAwardAmount();
  employeeHideModal("tenderDetailModal");
  employeeShowModal("awardModal");
}

function employeeSetAwardAmount() {
  var select = document.getElementById("awardBid");
  var amountInput = document.getElementById("awardAmount");
  var parts = select ? select.value.split("|") : [];
  var bid = parts.length === 2 ? employeeFindBid(parts[0], parts[1]) : null;
  if (bid && amountInput) {
    amountInput.value = bid.BID_AMOUNT;
  }
}

function employeeSubmitAward(event) {
  event.preventDefault();
  var form = event.currentTarget;
  var parts = document.getElementById("awardBid").value.split("|");
  if (parts.length !== 2) {
    showPageAlert("Choose a Selected, unawarded bid.", "danger");
    return;
  }
  if (!window.confirm("Create this Award and required Project together?")) {
    return;
  }

  var formData = new FormData();
  formData.append("tenderId", parts[0]);
  formData.append("bidId", parts[1]);
  formData.append("awardId", document.getElementById("awardId").value.trim());
  formData.append("awardAmount", document.getElementById("awardAmount").value);
  formData.append("awardDate", document.getElementById("awardDate").value);
  formData.append("projectId", document.getElementById("projectId").value.trim());
  formData.append("areaId", document.getElementById("projectArea").value);
  formData.append("projectName", document.getElementById("projectName").value.trim());
  formData.append("projectBudget", document.getElementById("projectBudget").value);
  formData.append("projectDeadline", document.getElementById("projectDeadline").value);
  formData.append("projectStatus", document.getElementById("projectStatus").value);

  nirmanFetch("../../backend/actions/employee/create_award_project.php", { method: "POST", body: formData })
    .then(function (r) { return r.json(); })
    .then(function (result) {
      if (result.success) {
        form.reset();
        employeeHideModal("awardModal");
        employeeFetchTendersData(function () {
          employeeRenderTenders();
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

function employeeInitializeTenders() {
  var publishForm = document.getElementById("publishTenderForm");
  var awardForm = document.getElementById("awardForm");
  var awardBid = document.getElementById("awardBid");
  var tenderDay = document.getElementById("newTenderDay");
  var awardDate = document.getElementById("awardDate");

  employeeFetchTendersData(function () {
    employeeRenderTenders();
  });

  if (tenderDay) {
    tenderDay.value = employeeGetTodayValue();
  }
  if (awardDate) {
    awardDate.value = employeeGetTodayValue();
  }
  if (publishForm) {
    publishForm.addEventListener("submit", employeeSubmitTender);
  }
  if (awardForm) {
    awardForm.addEventListener("submit", employeeSubmitAward);
  }
  if (awardBid) {
    awardBid.addEventListener("change", employeeSetAwardAmount);
  }
}

function employeeRenderAllocations() {
  var html = "";
  var confirmedCount = 0;
  var index;

  for (index = 0; index < employeeAllocationsCache.length; index += 1) {
    var booking = employeeAllocationsCache[index];
    var isConfirmed = Boolean(booking.CONFIRMED_EMP_ID);
    var state = isConfirmed ? "Confirmed" : "Pending confirmation";
    if (isConfirmed) {
      confirmedCount += 1;
    }
    html += '<tr data-filter-row data-status="' + escapeHtml(state) + '"><td><span class="table-primary-text">' +
      escapeHtml(booking.BOOKING_ID) + '</span><span class="table-secondary-text">' + escapeHtml(formatDate(booking.BOOKING_DATE)) +
      "</span></td><td>" + escapeHtml(booking.FIRST_NAME + " " + booking.LAST_NAME) +
      '<span class="table-secondary-text">' + escapeHtml(booking.CL_ID) + "</span></td><td>" +
      escapeHtml(booking.UNIT_NO + " / " + booking.UNIT_TYPE) + "</td><td>" +
      escapeHtml(booking.PROJECT_NAME) + '<span class="table-secondary-text">' +
      escapeHtml(booking.PROJECT_ID) + "</span></td><td>" + createStatusBadge(booking.BOOKING_STATUS) +
      '<span class="table-secondary-text">Due ' + escapeHtml(formatCurrency(booking.DUE_AMOUNT)) + "</span></td><td>" +
      (isConfirmed ? escapeHtml(booking.EMP_FIRST_NAME + " " + booking.EMP_LAST_NAME) + '<span class="table-secondary-text">' +
        escapeHtml(booking.CONFIRMED_EMP_ID) + "</span>" : createStatusBadge(state)) + "</td><td>" +
      (isConfirmed ? "Confirmed" : '<button class="mini-action" type="button" data-confirm-allocation="' +
        escapeHtml(booking.BOOKING_ID) + '">Confirm</button>') + "</td></tr>";
  }

  var body = document.getElementById("allocationTableBody");
  if (body) {
    body.innerHTML = html || employeeEmptyTableRow(7, "No bookings", "No Booking-Allocation Processes are available.");
  }
  employeeSetText("allocationCount", employeeAllocationsCache.length);
  employeeSetText("allocationConfirmedCount", confirmedCount);
  employeeSetText("allocationPendingCount", employeeAllocationsCache.length - confirmedCount);
  employeeApplyPageFilters();
}

function employeeConfirmAllocation(bookingId) {
  if (!window.confirm("Confirm " + bookingId + "?")) {
    return;
  }

  var formData = new FormData();
  formData.append("bookingId", bookingId);
  nirmanFetch("../../backend/actions/employee/confirm_allocation.php", { method: "POST", body: formData })
    .then(function (r) { return r.json(); })
    .then(function (result) {
      if (result.success) {
        employeeFetchAllocations(function () {
          employeeRenderAllocations();
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

function employeeRenderPayments() {
  var html = "";
  var pendingCount = 0;
  var index;
  for (index = 0; index < employeePaymentsCache.length; index += 1) {
    var payment = employeePaymentsCache[index];
    var booking = employeeGetPaymentBooking(payment.bookingId);
    var installments = employeeGetPaymentInstallments(payment);
    var verified = payment.paymentStatus === "Verified" && payment.verifiedAt;
    if (payment.paymentStatus === "Pending") {
      pendingCount += 1;
    }
    html += '<tr data-filter-row data-status="' + escapeHtml(payment.paymentStatus) + '"><td><span class="table-primary-text">' +
      escapeHtml("Payment " + payment.paymentId) + "</span></td><td>" +
      escapeHtml(payment.clientName || payment.clientId) + '<span class="table-secondary-text">' +
      escapeHtml(booking ? "Booking " + booking.bookingId : "Booking unavailable") + "</span></td><td>" +
      escapeHtml(formatCurrency(payment.amount)) + '<span class="table-secondary-text">' + escapeHtml(payment.paymentMethod) +
      "</span></td><td>" + escapeHtml(formatDate(payment.paymentDue)) + "</td><td>" + createStatusBadge(payment.paymentStatus) +
      '<span class="table-secondary-text">' + escapeHtml(verified ? payment.verifiedByEmployeeId + " / " +
        employeeFormatDateTime(payment.verifiedAt) : "Not yet verified") + "</span></td><td>" +
      '<button class="mini-action" type="button" data-payment-installments="' +
      escapeHtml(payment.clientId + "|" + payment.paymentId) + '">Details (' + escapeHtml(installments.length) +
      ")</button></td><td>" + (payment.paymentStatus === "Pending" ?
        '<button class="mini-action" type="button" data-verify-payment="' +
        escapeHtml(payment.clientId + "|" + payment.paymentId) + '">Verify</button>' : "Verified") + "</td></tr>";
  }
  var body = document.getElementById("paymentTableBody");
  if (body) {
    body.innerHTML = html || employeeEmptyTableRow(7, "No payments", "No Client-owned Payment records are available.");
  }
  employeeSetText("paymentCount", employeePaymentsCache.length);
  employeeSetText("paymentPendingCount", pendingCount);
  employeeSetText("installmentCount", employeePaymentInstallmentsCache.length);
  employeeApplyPageFilters();
}

function employeeShowInstallments(compositeKey) {
  var parts = compositeKey.split("|");
  var payment = parts.length === 2 ? employeeFindPayment(parts[0], parts[1]) : null;
  if (!payment) {
    showPageAlert("The selected payment could not be found.", "danger");
    return;
  }
  var installments = employeeGetPaymentInstallments(payment);
  var html = '<ul class="detail-list">' +
      employeeDetailItem("Payment", "Payment " + payment.paymentId) +
    employeeDetailItem("Client", payment.clientName || payment.clientId) +
    employeeDetailItem("Booking-Allocation Process", payment.bookingId) +
    employeeDetailItem("Amount", formatCurrency(payment.amount)) +
    employeeDetailItem("Method", payment.paymentMethod) +
    employeeDetailItem("Payment due", formatDate(payment.paymentDue)) +
    employeeDetailHtmlItem("Status", createStatusBadge(payment.paymentStatus)) +
    employeeDetailItem("Verified by", payment.paymentStatus === "Verified" ?
      payment.verifiedByEmployeeId + " at " + employeeFormatDateTime(payment.verifiedAt) : "Not yet verified") + "</ul>";
  if (installments.length) {
    html += '<h3 class="h6 mt-4">Owned Installments</h3><div class="table-responsive"><table class="table"><thead><tr><th>ID</th><th>Amount</th><th>Due</th><th>Status</th><th>Expired</th></tr></thead><tbody>';
    var index;
    for (index = 0; index < installments.length; index += 1) {
      var installment = installments[index];
      html += "<tr><td>Installment " + escapeHtml(installment.installmentId) +
        "</td><td>" + escapeHtml(formatCurrency(installment.amount)) + "</td><td>" + escapeHtml(formatDate(installment.dueDate)) +
        "</td><td>" + createStatusBadge(installment.status) + "</td><td>" +
        escapeHtml(installment.expiredAt ? employeeFormatDateTime(installment.expiredAt) : "Not expired") + "</td></tr>";
    }
    html += "</tbody></table></div>";
  } else {
    html += '<p class="text-muted-custom mt-3 mb-0">No installments are available for this payment.</p>';
  }
  employeeSetText("installmentTitle", "Installments for " + (payment.clientName || payment.clientId) + " - Payment " + payment.paymentId);
  var body = document.getElementById("installmentBody");
  if (body) {
    body.innerHTML = html;
  }
  employeeShowModal("installmentModal");
}

function employeeVerifyPayment(compositeKey) {
  var parts = compositeKey.split("|");
  var payment = parts.length === 2 ? employeeFindPayment(parts[0], parts[1]) : null;
  var booking = payment ? employeeGetPaymentBooking(payment.bookingId) : null;
  if (!payment || !booking || String(booking.clientId) !== String(payment.clientId)) {
    showPageAlert("Payment verification requires an existing Client and Booking-Allocation Process.", "danger");
    return;
  }
  if (payment.paymentStatus !== "Pending") {
    showPageAlert("Only a Pending Payment can be verified.", "danger");
    return;
  }
  if (!isFinite(Number(payment.amount)) || Number(payment.amount) <= 0 || !payment.paymentMethod || !payment.paymentDue) {
    showPageAlert("The Payment needs a positive amount, method, and due date before verification.", "danger");
    return;
  }
  if (!window.confirm("Verify Payment " + payment.paymentId + " for " + (payment.clientName || payment.clientId) + "?")) {
    return;
  }
  var formData = new FormData();
  formData.append("clId", payment.clientId);
  formData.append("paymentId", payment.paymentId);
  nirmanFetch("../../backend/actions/employee/verify_payment.php", { method: "POST", body: formData })
    .then(function (r) { return r.json(); })
    .then(function (result) {
      if (!result.success) {
        showPageAlert(result.message, "danger");
        return;
      }
      employeeFetchPayments(function () {
        employeeRenderPayments();
        showPageAlert(result.message, "success");
      });
    })
    .catch(function () {
      showPageAlert("Something went wrong. Please try again.", "danger");
    });
}

function employeeFetchPayments(callback) {
  fetch("../../backend/api/employee/get_payments_employee.php")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      employeePaymentsCache = data.payments || [];
      employeePaymentBookingsCache = data.bookings || [];
      employeePaymentInstallmentsCache = data.installments || [];
      if (callback) {
        callback();
      }
    })
    .catch(function (error) {
      console.error("Failed to load payments:", error);
      showPageAlert("Could not load payments.", "danger");
    });
}

function employeeFetchComplaints(callback) {
  fetch("../../backend/api/employee/get_complaints_employee.php")
    .then(function (r) { return r.json(); })
    .then(function (rows) {
      employeeComplaintsCache = rows;
      if (callback) {
        callback();
      }
    })
    .catch(function (error) {
      console.error("Failed to load complaints:", error);
      showPageAlert("Could not load complaints.", "danger");
    });
}

function employeeRenderComplaints() {
  var html = "";
  var pendingCount = 0;
  var resolvedCount = 0;
  var index;

  for (index = 0; index < employeeComplaintsCache.length; index += 1) {
    var complaint = employeeComplaintsCache[index];
    if (complaint.STATUS === "Resolved") {
      resolvedCount += 1;
    } else {
      pendingCount += 1;
    }
    html += '<tr data-filter-row data-status="' + escapeHtml(complaint.STATUS) + '"><td><span class="table-primary-text">' +
      escapeHtml(complaint.COMPLAINT_ID) + "</span></td><td>" + escapeHtml(complaint.FIRST_NAME + " " + complaint.LAST_NAME) +
      '<span class="table-secondary-text">' + escapeHtml(complaint.CL_ID) + "</span></td><td>" +
      escapeHtml(formatDate(complaint.FILED_DATE)) + "</td><td>" + escapeHtml(complaint.NOTE) + "</td><td>" +
      createStatusBadge(complaint.STATUS) + '<span class="table-secondary-text">' +
      escapeHtml(complaint.STATUS === "Resolved" ? (complaint.EMP_FIRST_NAME + " " + complaint.EMP_LAST_NAME) : "Not yet resolved") +
      "</span></td><td>" + escapeHtml(complaint.RESOLUTION || "Not yet resolved") + "</td><td>" +
      (complaint.STATUS === "Resolved" ? "Resolved" : '<button class="mini-action" type="button" data-resolve-complaint="' +
        escapeHtml(complaint.COMPLAINT_ID) + '">Resolve</button>') + "</td></tr>";
  }

  var body = document.getElementById("complaintTableBody");
  if (body) {
    body.innerHTML = html || employeeEmptyTableRow(7, "No complaints", "No Client-filed Complaints are available.");
  }
  employeeSetText("complaintCount", employeeComplaintsCache.length);
  employeeSetText("complaintPendingCount", pendingCount);
  employeeSetText("complaintResolvedCount", resolvedCount);
  employeeApplyPageFilters();
}

function employeeOpenResolution(complaintId) {
  var complaint = findRecord(employeeComplaintsCache, "COMPLAINT_ID", complaintId);
  var form = document.getElementById("resolutionForm");
  if (!complaint || complaint.STATUS === "Resolved") {
    showPageAlert("Only an unresolved Complaint can receive a resolution.", "danger");
    return;
  }
  if (form) {
    form.reset();
  }
  document.getElementById("resolutionComplaintId").value = complaint.COMPLAINT_ID;
  employeeSetText("resolutionSummary", complaint.COMPLAINT_ID + " from " + complaint.FIRST_NAME + " " + complaint.LAST_NAME + ": " + complaint.NOTE);
  employeeShowModal("resolutionModal");
}

function employeeSubmitResolution(event) {
  event.preventDefault();
  var form = event.currentTarget;
  var complaintId = document.getElementById("resolutionComplaintId").value;
  var resolution = document.getElementById("resolutionText").value.trim();

  if (resolution.length < 10 || resolution.length > 500) {
    showPageAlert("Enter a resolution from 10 to 500 characters.", "danger");
    return;
  }
  if (!window.confirm("Resolve Complaint " + complaintId + "?")) {
    return;
  }

  var formData = new FormData();
  formData.append("complaintId", complaintId);
  formData.append("resolution", resolution);

  nirmanFetch("../../backend/actions/employee/resolve_complaint.php", { method: "POST", body: formData })
    .then(function (r) { return r.json(); })
    .then(function (result) {
      if (result.success) {
        form.reset();
        employeeHideModal("resolutionModal");
        employeeFetchComplaints(function () {
          employeeRenderComplaints();
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

function employeeFetchProjectsData(callback) {
  fetch("../../backend/api/employee/get_project_workspace.php").then(function (r) { return r.json(); }).then(function (data) {
    employeeProjectsCache = data.projects || [];
    employeeAreasCache2 = data.areas || [];
    employeeUpdatesCache = data.updates || [];
    employeeUnitsCache = data.units || [];
    employeeAwardsCache = data.awards || [];
    employeeBidsForProjectsCache = data.bids || [];
    employeeContractorsCache = data.contractors || [];
    employeeSupervisionsCache = data.supervisions || [];
    employeeRepsCache = data.representatives || [];
    if (callback) {
      callback();
    }
  }).catch(function (error) {
    console.error("Failed to load projects data:", error);
    showPageAlert("Could not load projects data.", "danger");
  });
}

function employeeGetProjectUpdatesFor(projectId) {
  return employeeUpdatesCache.filter(function (u) { return u.PROJECT_ID === projectId; });
}

function employeeGetProjectContractorName(project) {
  var award = findRecord(employeeAwardsCache, "AWARD_ID", project.AWARD_ID);
  if (!award) {
    return null;
  }
  var bid = employeeBidsForProjectsCache.filter(function (b) {
    return b.TENDER_ID === award.TENDER_ID && b.BID_ID === award.BID_ID;
  })[0];
  return bid ? bid.COMPANY_NAME : null;
}

function employeeRenderProjects() {
  var projectHtml = "";
  var supervisionHtml = "";
  var overdueCount = 0;
  var ownSupervisions = employeeSupervisionsCache.filter(function (s) {
    return s.EMP_ID === currentEmployeeId;
  });
  var index;

  for (index = 0; index < employeeProjectsCache.length; index += 1) {
    var project = employeeProjectsCache[index];
    var updates = employeeGetProjectUpdatesFor(project.PROJECT_ID);
    var isOverdue = new Date(project.DEADLINE) < new Date() && project.STATUS !== "Completed";
    if (isOverdue) {
      overdueCount += 1;
    }

    projectHtml += '<tr data-filter-row data-status="' + escapeHtml(project.STATUS) + '"><td><span class="table-primary-text">' +
      escapeHtml(project.PROJECT_NAME) + '</span><span class="table-secondary-text">' + escapeHtml(project.PROJECT_ID) +
      "</span></td><td>" + escapeHtml("House " + project.HOUSE_NO + ", " + project.ROAD_SECTOR) + "</td><td>" +
      escapeHtml(formatCurrency(project.PROJECT_BUDGET)) + '<span class="table-secondary-text">' +
      escapeHtml(project.AWARD_ID) + "</span></td><td>" + escapeHtml(formatDate(project.DEADLINE)) +
      '<span class="table-secondary-text">' + (isOverdue ? createStatusBadge("Overdue") : createStatusBadge("On schedule")) +
      "</span></td><td>" + createStatusBadge(project.STATUS) + "</td><td><strong>" +
      escapeHtml(project.LATEST_PROGRESS + "%") + '</strong></td><td><span class="table-secondary-text">' +
      escapeHtml(updates.length + " update(s)") +
      '</span><button class="mini-action ms-2" type="button" data-project-updates="' +
      escapeHtml(project.PROJECT_ID) + '">Details</button></td></tr>';
  }

  for (index = 0; index < ownSupervisions.length; index += 1) {
    var supervision = ownSupervisions[index];
    var contractorReps = employeeRepsCache
      .filter(function (r) { return r.CONTRACTOR_ID === supervision.CONTRACTOR_ID; })
      .map(function (r) { return r.FIRST_NAME + " " + r.LAST_NAME; });
    supervisionHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(supervision.COMPANY_NAME) +
      '</span><span class="table-secondary-text">' + escapeHtml(supervision.CONTRACTOR_ID) + "</span></td><td>" +
      escapeHtml(supervision.LICENSE_NO) + "</td><td>" + escapeHtml(contractorReps.join(", ") || "None") + "</td><td>" +
      escapeHtml(supervision.FIRST_NAME + " " + supervision.LAST_NAME + " (" + supervision.EMP_ID + ")") + "</td></tr>";
  }

  var projectBody = document.getElementById("projectTableBody");
  var supervisionBody = document.getElementById("supervisionTableBody");
  if (projectBody) {
    projectBody.innerHTML = projectHtml || employeeEmptyTableRow(7, "No projects", "No Award-resulting Projects are available.");
  }
  if (supervisionBody) {
    supervisionBody.innerHTML = supervisionHtml || employeeEmptyTableRow(4, "No assignments", "You do not supervise a Contractor yet.");
  }

  employeeSetText("projectCount", employeeProjectsCache.length);
  employeeSetText("projectOverdueCount", overdueCount);
  employeeSetText("projectUpdateCount", employeeUpdatesCache.length);
  employeeSetText("supervisionCount", ownSupervisions.length);
  employeeApplyPageFilters();
}

function employeeShowProjectUpdates(projectId) {
  var project = findRecord(employeeProjectsCache, "PROJECT_ID", projectId);
  if (!project) {
    showPageAlert("The selected Project could not be found.", "danger");
    return;
  }
  var area = findRecord(employeeAreasCache2, "AREA_ID", project.AREA_ID);
  var contractorName = employeeGetProjectContractorName(project);
  var updates = employeeGetProjectUpdatesFor(project.PROJECT_ID);
  var bookingCount = employeeUnitsCache.filter(function (u) { return u.PROJECT_ID === project.PROJECT_ID; }).length;
  var isOverdue = new Date(project.DEADLINE) < new Date() && project.STATUS !== "Completed";

  employeeSetText("projectUpdateTitle", project.PROJECT_ID + " - " + project.PROJECT_NAME);
  var html = '<div class="row g-4"><div class="col-lg-6"><h3 class="h6">Project details</h3><ul class="detail-list">' +
    employeeDetailItem("Project ID", project.PROJECT_ID) + employeeDetailItem("Name", project.PROJECT_NAME) +
    employeeDetailItem("Budget", formatCurrency(project.PROJECT_BUDGET)) + employeeDetailItem("Deadline", formatDate(project.DEADLINE)) +
    employeeDetailHtmlItem("Status", createStatusBadge(project.STATUS)) +
    employeeDetailHtmlItem("Overdue", createStatusBadge(isOverdue ? "Overdue" : "On schedule")) +
    employeeDetailItem("Award", project.AWARD_ID) +
    employeeDetailItem("Resulting Contractor", contractorName || "Not available through the selected Bid") +
    employeeDetailItem("Booking-Allocation Processes", bookingCount) +
    '</ul></div><div class="col-lg-6"><h3 class="h6">Area details</h3><ul class="detail-list">' +
    (area ? employeeDetailItem("Area ID", area.AREA_ID) + employeeDetailItem("Address", "House " + area.HOUSE_NO + ", " + area.ROAD_SECTOR) +
      employeeDetailItem("Boundary", area.BOUNDARY_INFO) + employeeDetailItem("Centre location", area.LATITUDE + ", " + area.LONGITUDE) :
      employeeDetailItem("Area", "No matching Area record")) + "</ul></div></div>";

  html += '<hr class="my-4"><h3 class="h6">Project Update history</h3>';
  if (updates.length) {
    html += '<div class="timeline-list mt-3">';
    for (var i = 0; i < updates.length; i += 1) {
      var update = updates[i];
      html += '<div class="timeline-item"><span class="timeline-dot"></span><div class="timeline-content"><h3>' +
        escapeHtml(update.PROJECT_ID + " / " + update.UPDATE_ID + " - " + update.PROGRESS_PERCENT + "%") +
        "</h3><p>" + escapeHtml(update.WORK_NOTE) + '</p><span class="timeline-date">' +
        escapeHtml(formatDate(update.UPDATE_DATE) + " / " + update.FIRST_NAME + " " + update.LAST_NAME) +
        "</span></div></div>";
    }
    html += "</div>";
  } else {
    html += '<p class="text-muted-custom mt-3 mb-0">No Project Updates belong to this Project.</p>';
  }

  document.getElementById("projectUpdateBody").innerHTML = html;
  employeeShowModal("projectUpdateModal");
}

function employeeInitializeProjects() {
  employeeFetchProjectsData(function () {
    employeeRenderProjects();
  });
}

function employeeInitializeDelegatedActions() {
  document.addEventListener("click", function (event) {
    var target = event.target;
    var button;
    button = target.closest("[data-tender-detail]");
    if (button) {
      employeeOpenTenderDetail(button.getAttribute("data-tender-detail"));
      return;
    }
    button = target.closest("[data-bid-detail]");
    if (button) {
      employeeOpenBidDetail(button.getAttribute("data-bid-detail"));
      return;
    }
    button = target.closest("[data-bid-review]");
    if (button) {
      employeeReviewBid(button.getAttribute("data-bid-key"), button.getAttribute("data-bid-review"));
      return;
    }
    button = target.closest("[data-open-award]");
    if (button) {
      employeeOpenAwardForm(button.getAttribute("data-open-award"));
      return;
    }
    button = target.closest("[data-confirm-allocation]");
    if (button) {
      employeeConfirmAllocation(button.getAttribute("data-confirm-allocation"));
      return;
    }
    button = target.closest("[data-payment-installments]");
    if (button) {
      employeeShowInstallments(button.getAttribute("data-payment-installments"));
      return;
    }
    button = target.closest("[data-verify-payment]");
    if (button) {
      employeeVerifyPayment(button.getAttribute("data-verify-payment"));
      return;
    }
    button = target.closest("[data-resolve-complaint]");
    if (button) {
      employeeOpenResolution(button.getAttribute("data-resolve-complaint"));
      return;
    }
    button = target.closest("[data-project-updates]");
    if (button) {
      employeeShowProjectUpdates(button.getAttribute("data-project-updates"));
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var page = document.body.getAttribute("data-employee-page");
  if (!page) {
    return;
  }

  fetch("../../backend/api/employee/get_current_employee.php")
    .then(function (response) { return response.json(); })
    .then(function (result) {
      if (!result.loggedIn) {
        window.location.href = "../../login.html";
        return;
      }

      currentEmployeeId = result.employeeId;
      currentEmployeeDesignation = result.designation;
      setNirmanCsrfToken(result.csrfToken);

      var nameElements = document.querySelectorAll("[data-employee-name]");
      var roleElements = document.querySelectorAll("[data-employee-role]");
      var initialElements = document.querySelectorAll("[data-employee-initials]");
      for (var i = 0; i < nameElements.length; i += 1) {
        nameElements[i].textContent = result.firstName + " " + result.lastName;
      }
      for (var j = 0; j < roleElements.length; j += 1) {
        roleElements[j].textContent = result.designation;
      }
      for (var k = 0; k < initialElements.length; k += 1) {
        initialElements[k].textContent = (result.firstName.charAt(0) + result.lastName.charAt(0)).toUpperCase();
      }

      employeeInitializeDelegatedActions();

      if (page === "dashboard") {
        employeeRenderDashboard();
      } else if (page === "profile") {
        employeeRenderProfile();
      }
      else if (page === "tenders") {
        employeeInitializeTenders();
      } else if (page === "allocations") {
        employeeFetchAllocations(function () {
          employeeRenderAllocations();
        });
      } else if (page === "payments") {
        employeeFetchPayments(function () {
          employeeRenderPayments();
        });
      } else if (page === "complaints") {
        employeeFetchComplaints(function () {
          employeeRenderComplaints();
        });
        var resolutionForm = document.getElementById("resolutionForm");
        if (resolutionForm) {
          resolutionForm.addEventListener("submit", employeeSubmitResolution);
        }
      } else if (page === "projects") {
        employeeInitializeProjects();
      }

      employeeInitializeFilters();
    })
    .catch(function (error) {
      console.error("Could not verify login:", error);
      window.location.href = "../../login.html";
    });
});
