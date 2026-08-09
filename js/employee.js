
var currentEmployeeId = "1";

function employeeSetText(elementId, value) {
  var element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

function employeeGetCurrentEmployee() {
  return findRecord(nirmanData.employees, "employeeId", currentEmployeeId);
}

function employeeGetCurrentPerson() {
  var employee = employeeGetCurrentEmployee();
  return employee ? findRecord(nirmanData.people, "personId", employee.personId) : null;
}

function employeeGetTender(tenderId) {
  return findRecord(nirmanData.tenders, "tenderId", tenderId);
}

function employeeGetBooking(bookingId) {
  return findRecord(nirmanData.bookings, "bookingId", bookingId);
}

function employeeGetProject(projectId) {
  return findRecord(nirmanData.projects, "projectId", projectId);
}

function employeeGetArea(areaId) {
  return findRecord(nirmanData.areas, "areaId", areaId);
}

function employeeGetContractor(contractorId) {
  return findRecord(nirmanData.contractors, "contractorId", contractorId);
}

function employeeFindBid(tenderId, bidId) {
  var index;
  for (index = 0; index < nirmanData.tenderBids.length; index += 1) {
    if (nirmanData.tenderBids[index].tenderId === tenderId &&
        nirmanData.tenderBids[index].bidId === bidId) {
      return nirmanData.tenderBids[index];
    }
  }
  return null;
}

function employeeFindAwardForBid(tenderId, bidId) {
  var index;
  for (index = 0; index < nirmanData.tenderAwards.length; index += 1) {
    if (nirmanData.tenderAwards[index].tenderId === tenderId &&
        nirmanData.tenderAwards[index].bidId === bidId) {
      return nirmanData.tenderAwards[index];
    }
  }
  return null;
}

function employeeFindPayment(clientId, paymentId) {
  var index;
  for (index = 0; index < nirmanData.payments.length; index += 1) {
    if (nirmanData.payments[index].clientId === clientId &&
        nirmanData.payments[index].paymentId === paymentId) {
      return nirmanData.payments[index];
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

function employeeGetInitials(person) {
  if (!person) {
    return "--";
  }
  return String(person.firstName).charAt(0).toUpperCase() +
    String(person.lastName).charAt(0).toUpperCase();
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

function employeeRenderSharedIdentity() {
  var employee = employeeGetCurrentEmployee();
  var person = employeeGetCurrentPerson();
  var name = person ? person.firstName + " " + person.lastName : "Unknown employee";
  var role = employee ? employee.designation : "Employee record unavailable";
  var nameElements = document.querySelectorAll("[data-employee-name]");
  var roleElements = document.querySelectorAll("[data-employee-role]");
  var initialElements = document.querySelectorAll("[data-employee-initials]");
  var index;
  for (index = 0; index < nameElements.length; index += 1) {
    nameElements[index].textContent = name;
  }
  for (index = 0; index < roleElements.length; index += 1) {
    roleElements[index].textContent = role;
  }
  for (index = 0; index < initialElements.length; index += 1) {
    initialElements[index].textContent = employeeGetInitials(person);
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
  var index;
  for (index = 0; index < nirmanData.tenderBids.length; index += 1) {
    if (nirmanData.tenderBids[index].tenderId === tenderId) {
      count += 1;
    }
  }
  return count;
}

function employeeGetProjectUpdates(projectId) {
  var updates = [];
  var index;
  for (index = 0; index < nirmanData.projectUpdates.length; index += 1) {
    if (nirmanData.projectUpdates[index].projectId === projectId) {
      updates.push(nirmanData.projectUpdates[index]);
    }
  }
  updates.sort(function (first, second) {
    var dateDifference = new Date(second.updateDate) - new Date(first.updateDate);
    if (dateDifference !== 0) {
      return dateDifference;
    }
    return String(second.updateId).localeCompare(String(first.updateId));
  });
  return updates;
}

function employeeGetPaymentInstallments(payment) {
  var installments = [];
  var index;
  for (index = 0; index < nirmanData.installments.length; index += 1) {
    if (nirmanData.installments[index].clientId === payment.clientId &&
        nirmanData.installments[index].paymentId === payment.paymentId) {
      installments.push(nirmanData.installments[index]);
    }
  }
  installments.sort(function (first, second) {
    return new Date(first.dueDate) - new Date(second.dueDate);
  });
  return installments;
}

function employeeRenderDashboard() {
  var pendingAllocations = 0;
  var pendingPayments = 0;
  var pendingComplaints = 0;
  var ownTenders = [];
  var index;
  for (index = 0; index < nirmanData.bookings.length; index += 1) {
    if (!findRecord(nirmanData.allocationConfirmations, "bookingId", nirmanData.bookings[index].bookingId)) {
      pendingAllocations += 1;
    }
  }
  for (index = 0; index < nirmanData.payments.length; index += 1) {
    if (nirmanData.payments[index].paymentStatus === "Pending") {
      pendingPayments += 1;
    }
  }
  for (index = 0; index < nirmanData.complaints.length; index += 1) {
    if (nirmanData.complaints[index].status !== "Resolved") {
      pendingComplaints += 1;
    }
  }
  for (index = 0; index < nirmanData.tenders.length; index += 1) {
    if (nirmanData.tenders[index].employeeId === currentEmployeeId) {
      ownTenders.push(nirmanData.tenders[index]);
    }
  }
  employeeSetText("dashboardAllocationCount", pendingAllocations);
  employeeSetText("dashboardPaymentCount", pendingPayments);
  employeeSetText("dashboardComplaintCount", pendingComplaints);
  employeeSetText("dashboardTenderCount", ownTenders.length);

  var responsibilities = [
    ["AL", "Confirm Booking-Allocation Processes", pendingAllocations + " pending process(es)", "allocations.html"],
    ["PY", "Verify client Payments", pendingPayments + " pending payment(s)", "payments.html"],
    ["CP", "Resolve client Complaints", pendingComplaints + " unresolved complaint(s)", "complaints.html"],
    ["TN", "Publish and award Tenders", ownTenders.length + " tender(s) published by 1", "tenders.html"],
    ["PR", "Supervise Contractors and Projects", "Check progress and deadlines", "projects.html"]
  ];
  var responsibilityHtml = "";
  for (index = 0; index < responsibilities.length; index += 1) {
    responsibilityHtml += '<li class="activity-item"><span class="activity-marker">' +
      escapeHtml(responsibilities[index][0]) + '</span><div><h3><a href="' +
      escapeHtml(responsibilities[index][3]) + '">' + escapeHtml(responsibilities[index][1]) +
      "</a></h3><p>" + escapeHtml(responsibilities[index][2]) + "</p></div></li>";
  }
  var responsibilityList = document.getElementById("dashboardResponsibilityList");
  if (responsibilityList) {
    responsibilityList.innerHTML = responsibilityHtml;
  }

  ownTenders.sort(function (first, second) {
    return new Date(first.deadline) - new Date(second.deadline);
  });
  var tenderHtml = "";
  for (index = 0; index < ownTenders.length; index += 1) {
    tenderHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(ownTenders[index].tenderId) +
      '</span><span class="table-secondary-text">' + escapeHtml(ownTenders[index].title) +
      "</span></td><td>" + escapeHtml(formatDate(ownTenders[index].deadline)) + "</td><td>" +
      createStatusBadge(ownTenders[index].status) + "</td><td>" +
      escapeHtml(employeeCountTenderBids(ownTenders[index].tenderId)) + "</td></tr>";
  }
  var tenderBody = document.getElementById("dashboardTenderBody");
  if (tenderBody) {
    tenderBody.innerHTML = tenderHtml || employeeEmptyTableRow(4, "No 1 tenders", "Published tenders will appear here.");
  }

  var projectHtml = "";
  for (index = 0; index < nirmanData.projects.length; index += 1) {
    var project = nirmanData.projects[index];
    var updates = employeeGetProjectUpdates(project.projectId);
    var progress = updates.length ? updates[0].progressPercent : 0;
    var timeState = isProjectOverdue(project) ? "Overdue" : "On schedule";
    projectHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(project.projectName) +
      '</span><span class="table-secondary-text">' + escapeHtml(project.projectId) + "</span></td><td>" +
      createStatusBadge(project.status) + "</td><td>" + escapeHtml(formatDate(project.deadline)) +
      "</td><td>" + createStatusBadge(timeState) + "</td><td>" + escapeHtml(progress + "%") + "</td></tr>";
  }
  var projectBody = document.getElementById("dashboardProjectBody");
  if (projectBody) {
    projectBody.innerHTML = projectHtml || employeeEmptyTableRow(5, "No projects", "Award-resulting projects will appear here.");
  }
}

function employeeRenderProfile() {
  var employee = employeeGetCurrentEmployee();
  var person = employeeGetCurrentPerson();
  if (!employee || !person) {
    showPageAlert("The fixed 1 Person and Employee records could not be found.", "danger");
    return;
  }
  var department = findRecord(nirmanData.departments, "deptName", employee.deptName);
  var phones = [];
  var managerId = "";
  var subordinateIds = [];
  var index;
  for (index = 0; index < nirmanData.departmentPhones.length; index += 1) {
    if (nirmanData.departmentPhones[index].deptName === employee.deptName) {
      phones.push(nirmanData.departmentPhones[index].phoneNo);
    }
  }
  for (index = 0; index < nirmanData.workRelations.length; index += 1) {
    if (nirmanData.workRelations[index].employeeId === currentEmployeeId) {
      managerId = nirmanData.workRelations[index].managerId;
    }
    if (nirmanData.workRelations[index].managerId === currentEmployeeId) {
      subordinateIds.push(nirmanData.workRelations[index].employeeId);
    }
  }
  var personDetails = document.getElementById("profilePersonDetails");
  if (personDetails) {
    personDetails.innerHTML = employeeDetailItem("Person ID", person.personId) +
      employeeDetailItem("First name", person.firstName) +
      employeeDetailItem("Last name", person.lastName) +
      employeeDetailItem("Contact number", person.contactNo) +
      employeeDetailItem("Email", person.email);
  }
  var employeeDetails = document.getElementById("profileEmployeeDetails");
  if (employeeDetails) {
    employeeDetails.innerHTML = employeeDetailItem("Employee ID", employee.employeeId) +
      employeeDetailItem("Person ID", employee.personId) +
      employeeDetailItem("Designation", employee.designation) +
      employeeDetailItem("NID", employee.nid) +
      employeeDetailItem("Department", employee.deptName);
  }
  var departmentDetails = document.getElementById("profileDepartmentDetails");
  if (departmentDetails) {
    departmentDetails.innerHTML = department ?
      employeeDetailItem("Department name", department.deptName) +
      employeeDetailItem("Location", department.location) +
      employeeDetailItem("Email", department.email) +
      employeeDetailItem("All phone numbers", phones.join(", ") || "None recorded") +
      employeeDetailItem("Description", department.description) :
      employeeDetailItem("Department", "No matching Department record");
  }
  var manager = document.getElementById("profileManager");
  if (manager) {
    manager.innerHTML = managerId ? '<div class="activity-item"><span class="activity-marker">MG</span><div><h3>' +
      escapeHtml(getEmployeeName(managerId)) + "</h3><p>" + escapeHtml(managerId) + "</p></div></div>" :
      '<p class="text-muted-custom mb-0">1 is a top-level employee with no direct manager record.</p>';
  }
  var subordinateHtml = "";
  for (index = 0; index < subordinateIds.length; index += 1) {
    var subordinate = findRecord(nirmanData.employees, "employeeId", subordinateIds[index]);
    subordinateHtml += '<li class="activity-item"><span class="activity-marker">SB</span><div><h3>' +
      escapeHtml(getEmployeeName(subordinateIds[index])) + "</h3><p>" +
      escapeHtml(subordinate ? subordinate.employeeId + " / " + subordinate.designation + " / " + subordinate.deptName : subordinateIds[index]) +
      "</p></div></li>";
  }
  var subordinateList = document.getElementById("profileSubordinateList");
  if (subordinateList) {
    subordinateList.innerHTML = subordinateHtml || '<li class="text-muted-custom">No direct subordinates.</li>';
  }
}

function employeeBidIsEligibleForAward(bid) {
  var tender = bid ? employeeGetTender(bid.tenderId) : null;
  return Boolean(bid && tender && bid.bidStatus === "Selected" && tender.status !== "Awarded" &&
    !employeeFindAwardForBid(bid.tenderId, bid.bidId));
}

function employeePopulateAwardChoices() {
  var bidSelect = document.getElementById("awardBid");
  var areaSelect = document.getElementById("projectArea");
  var previousBid = bidSelect ? bidSelect.value : "";
  var previousArea = areaSelect ? areaSelect.value : "";
  var bidHtml = '<option value="">Choose a selected, unawarded bid</option>';
  var areaHtml = '<option value="">Choose an area</option>';
  var index;
  if (bidSelect) {
    for (index = 0; index < nirmanData.tenderBids.length; index += 1) {
      var bid = nirmanData.tenderBids[index];
      if (employeeBidIsEligibleForAward(bid)) {
        bidHtml += '<option value="' + escapeHtml(bid.tenderId + "|" + bid.bidId) + '">' +
          escapeHtml(bid.tenderId + " / " + bid.bidId + " - " + formatCurrency(bid.bidAmount)) + "</option>";
      }
    }
    bidSelect.innerHTML = bidHtml;
    bidSelect.value = previousBid;
  }
  if (areaSelect) {
    for (index = 0; index < nirmanData.areas.length; index += 1) {
      var area = nirmanData.areas[index];
      areaHtml += '<option value="' + escapeHtml(area.areaId) + '">' +
        escapeHtml(area.areaId + " - House " + area.houseNo + ", " + area.roadSector) + "</option>";
    }
    areaSelect.innerHTML = areaHtml;
    areaSelect.value = previousArea;
  }
}

function employeeRenderTenders() {
  var tenderHtml = "";
  var bidHtml = "";
  var ownTenderCount = 0;
  var eligibleCount = 0;
  var index;
  for (index = 0; index < nirmanData.tenders.length; index += 1) {
    var tender = nirmanData.tenders[index];
    if (tender.employeeId === currentEmployeeId) {
      ownTenderCount += 1;
    }
    tenderHtml += '<tr data-filter-row data-status="' + escapeHtml(tender.status) + '"><td><span class="table-primary-text">' +
      escapeHtml(tender.tenderId) + '</span><span class="table-secondary-text">' + escapeHtml(tender.title) +
      "</span></td><td>" + escapeHtml(getEmployeeName(tender.employeeId)) +
      '<span class="table-secondary-text">' + escapeHtml(tender.employeeId) + "</span></td><td>" +
      escapeHtml(tender.task) + "</td><td>" + escapeHtml(formatDate(tender.deadline)) +
      '<span class="table-secondary-text">' + escapeHtml(employeeCountTenderBids(tender.tenderId) + " bid(s)") +
      "</span></td><td>" + createStatusBadge(tender.status) +
      '</td><td><button class="mini-action" type="button" data-tender-detail="' +
      escapeHtml(tender.tenderId) + '">Details</button></td></tr>';
  }
  for (index = 0; index < nirmanData.tenderBids.length; index += 1) {
    var bid = nirmanData.tenderBids[index];
    var bidTender = employeeGetTender(bid.tenderId);
    var representative = findRecord(nirmanData.contractorReps, "repId", bid.repId);
    var contractor = representative ? employeeGetContractor(representative.contractorId) : null;
    var award = employeeFindAwardForBid(bid.tenderId, bid.bidId);
    var actionHtml = "";
    if (employeeBidIsEligibleForAward(bid)) {
      eligibleCount += 1;
    }
    if (bid.bidStatus === "Under Review" && !award && bidTender && bidTender.status !== "Awarded") {
      actionHtml = '<button class="mini-action" type="button" data-bid-review="select" data-bid-key="' +
        escapeHtml(bid.tenderId + "|" + bid.bidId) + '">Select</button> <button class="mini-action" type="button" data-bid-review="reject" data-bid-key="' +
        escapeHtml(bid.tenderId + "|" + bid.bidId) + '">Reject</button>';
    } else if (employeeBidIsEligibleForAward(bid)) {
      actionHtml = '<button class="mini-action" type="button" data-open-award="' +
        escapeHtml(bid.tenderId + "|" + bid.bidId) + '">Issue award</button>';
    } else {
      actionHtml = award ? createStatusBadge("Awarded") + '<span class="table-secondary-text">' +
        escapeHtml(award.awardId) + "</span>" : createStatusBadge(bid.bidStatus);
    }
    bidHtml += '<tr data-filter-row data-status="' + escapeHtml(bid.bidStatus) + '"><td><span class="table-primary-text">' +
      escapeHtml(bid.tenderId + " / " + bid.bidId) + '</span><span class="table-secondary-text">Tender / Bid ID</span></td><td>' +
      escapeHtml(bidTender ? bidTender.title : bid.tenderId) + "</td><td>" + escapeHtml(getRepresentativeName(bid.repId)) +
      '<span class="table-secondary-text">' + escapeHtml(contractor ? contractor.companyName : bid.repId) +
      "</span></td><td>" + escapeHtml(formatCurrency(bid.bidAmount)) + "</td><td>" + createStatusBadge(bid.bidStatus) +
      '</td><td><div class="d-flex gap-2 flex-wrap"><button class="mini-action" type="button" data-bid-detail="' +
      escapeHtml(bid.tenderId + "|" + bid.bidId) + '">Details</button>' + actionHtml + "</div></td></tr>";
  }
  var tenderBody = document.getElementById("tenderTableBody");
  var bidBody = document.getElementById("bidTableBody");
  if (tenderBody) {
    tenderBody.innerHTML = tenderHtml || employeeEmptyTableRow(6, "No tenders", "No Tender records are available.");
  }
  if (bidBody) {
    bidBody.innerHTML = bidHtml || employeeEmptyTableRow(6, "No bids", "No tender bids are available.");
  }
  employeeSetText("tenderCount", nirmanData.tenders.length);
  employeeSetText("myTenderCount", ownTenderCount);
  employeeSetText("bidCount", nirmanData.tenderBids.length);
  employeeSetText("eligibleBidCount", eligibleCount);
  employeePopulateAwardChoices();
  employeeApplyPageFilters();
}

function employeeOpenTenderDetail(tenderId) {
  var tender = employeeGetTender(tenderId);
  var bids = [];
  var index;
  if (!tender) {
    showPageAlert("The selected Tender could not be found.", "danger");
    return;
  }
  for (index = 0; index < nirmanData.tenderBids.length; index += 1) {
    if (nirmanData.tenderBids[index].tenderId === tenderId) {
      bids.push(nirmanData.tenderBids[index]);
    }
  }
  employeeSetText("tenderDetailTitle", tender.tenderId + " - " + tender.title);
  var html = '<ul class="detail-list">' + employeeDetailItem("Tender ID", tender.tenderId) +
    employeeDetailItem("Publisher", getEmployeeName(tender.employeeId) + " (" + tender.employeeId + ")") +
    employeeDetailItem("Publication day", formatDate(tender.day)) +
    employeeDetailItem("Deadline", formatDate(tender.deadline)) +
    employeeDetailHtmlItem("Status", createStatusBadge(tender.status)) +
    employeeDetailItem("Task", tender.task) + employeeDetailItem("Bid details", tender.bidDetails) + "</ul>";
  if (bids.length) {
    html += '<h3 class="h6 mt-4">Received bids</h3><div class="table-responsive"><table class="table"><thead><tr><th>Bid</th><th>Representative</th><th>Amount</th><th>Status</th></tr></thead><tbody>';
    for (index = 0; index < bids.length; index += 1) {
      html += "<tr><td>" + escapeHtml(bids[index].tenderId + " / " + bids[index].bidId) +
        "</td><td>" + escapeHtml(getRepresentativeName(bids[index].repId)) + "</td><td>" +
        escapeHtml(formatCurrency(bids[index].bidAmount)) + "</td><td>" + createStatusBadge(bids[index].bidStatus) + "</td></tr>";
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
  var tender = bid ? employeeGetTender(bid.tenderId) : null;
  var representative = bid ? findRecord(nirmanData.contractorReps, "repId", bid.repId) : null;
  var contractor = representative ? employeeGetContractor(representative.contractorId) : null;
  var award = bid ? employeeFindAwardForBid(bid.tenderId, bid.bidId) : null;
  var project = award ? findRecord(nirmanData.projects, "awardId", award.awardId) : null;
  if (!bid) {
    showPageAlert("The selected tender bid could not be found.", "danger");
    return;
  }
  employeeSetText("tenderDetailTitle", "Bid " + bid.tenderId + " / " + bid.bidId);
  var html = '<ul class="detail-list">' +
    employeeDetailItem("Bid ID", bid.tenderId + " / " + bid.bidId) +
    employeeDetailItem("Tender", tender ? tender.title : bid.tenderId) +
    employeeDetailItem("Representative", getRepresentativeName(bid.repId) + " (" + bid.repId + ")") +
    employeeDetailItem("Contractor", contractor ? contractor.companyName : "Unknown contractor") +
    employeeDetailItem("Bid amount", formatCurrency(bid.bidAmount)) +
    employeeDetailHtmlItem("Bid status", createStatusBadge(bid.bidStatus)) +
    employeeDetailItem("Matching award", award ? award.awardId : "Unawarded") +
    employeeDetailItem("Resulting project", project ? project.projectId + " / " + project.projectName : "No resulting project") +
    "</ul>";
  var body = document.getElementById("tenderDetailBody");
  if (body) {
    body.innerHTML = html;
  }
  employeeShowModal("tenderDetailModal");
}

function employeeReviewBid(compositeKey, action) {
  var parts = compositeKey.split("|");
  var bid = parts.length === 2 ? employeeFindBid(parts[0], parts[1]) : null;
  var tender = bid ? employeeGetTender(bid.tenderId) : null;
  var nextStatus = action === "select" ? "Selected" : "Rejected";
  if (!bid || !tender || bid.bidStatus !== "Under Review" || tender.status === "Awarded" ||
      employeeFindAwardForBid(parts[0], parts[1])) {
    showPageAlert("Only an unawarded Under Review bid on a non-Awarded Tender can be reviewed.", "danger");
    return;
  }
  if (!window.confirm(nextStatus + " bid " + bid.tenderId + " / " + bid.bidId + "?")) {
    return;
  }
  bid.bidStatus = nextStatus;
  if (nextStatus === "Selected" && tender.status === "Published") {
    tender.status = "Evaluation";
  }
  employeeRenderTenders();
  showPageAlert("Bid " + bid.tenderId + " / " + bid.bidId + " marked " + nextStatus + " for this session.", "success");
}

function employeeSubmitTender(event) {
  event.preventDefault();
  var form = event.currentTarget;
  var tenderId = document.getElementById("newTenderId").value.trim();
  var day = document.getElementById("newTenderDay").value;
  var deadline = document.getElementById("newTenderDeadline").value;
  var status = document.getElementById("newTenderStatus").value;
  var title = document.getElementById("newTenderTitle").value.trim();
  var task = document.getElementById("newTenderTask").value.trim();
  var bidDetails = document.getElementById("newTenderBidDetails").value.trim();
  if (!employeeIsSimpleId(tenderId)) {
    showPageAlert("Enter a Tender ID using only letters, numbers, and hyphens.", "danger");
    return;
  }
  if (employeeHasId(nirmanData.tenders, "tenderId", tenderId)) {
    showPageAlert("Tender ID " + tenderId + " already exists.", "danger");
    return;
  }
  if (!day || !deadline || isNaN(new Date(day).getTime()) || isNaN(new Date(deadline).getTime()) || deadline < day) {
    showPageAlert("Choose valid dates with the deadline on or after the publication day.", "danger");
    return;
  }
  if (status === "Awarded") {
    showPageAlert("A new Tender cannot be published as Awarded. Select a submitted bid before issuing an Award.", "danger");
    return;
  }
  if (status !== "Published" && status !== "Evaluation") {
    showPageAlert("Choose Published or Evaluation as the new Tender status.", "danger");
    return;
  }
  if (!title || title.length > 120 || !task || task.length > 180 ||
      !bidDetails || bidDetails.length > 500) {
    showPageAlert("Complete the title, task, and bid details within their displayed length limits.", "danger");
    return;
  }
  if (!window.confirm("Publish Tender " + tenderId + " as 1?")) {
    return;
  }
  nirmanData.tenders.push({
    tenderId: tenderId,
    employeeId: currentEmployeeId,
    deadline: deadline,
    day: day,
    title: title,
    bidDetails: bidDetails,
    status: status,
    task: task
  });
  form.reset();
  employeeHideModal("publishTenderModal");
  employeeRenderTenders();
  showPageAlert("Tender " + tenderId + " was added for this session.", "success");
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
    amountInput.value = bid.bidAmount;
  }
}

function employeeSubmitAward(event) {
  event.preventDefault();
  var form = event.currentTarget;
  var parts = document.getElementById("awardBid").value.split("|");
  var awardId = document.getElementById("awardId").value.trim();
  var awardAmountText = document.getElementById("awardAmount").value;
  var awardAmount = Number(awardAmountText);
  var awardDate = document.getElementById("awardDate").value;
  var projectId = document.getElementById("projectId").value.trim();
  var areaId = document.getElementById("projectArea").value;
  var projectName = document.getElementById("projectName").value.trim();
  var projectBudgetText = document.getElementById("projectBudget").value;
  var projectBudget = Number(projectBudgetText);
  var projectDeadline = document.getElementById("projectDeadline").value;
  var projectStatus = document.getElementById("projectStatus").value;
  var bid = parts.length === 2 ? employeeFindBid(parts[0], parts[1]) : null;
  var tender = bid ? employeeGetTender(bid.tenderId) : null;
  if (!employeeBidIsEligibleForAward(bid) || !tender) {
    showPageAlert("Choose a Selected, unawarded bid from a Tender that is not already Awarded.", "danger");
    return;
  }
  if (!employeeIsSimpleId(awardId) || employeeHasId(nirmanData.tenderAwards, "awardId", awardId)) {
    showPageAlert("Enter a unique Award ID using only letters, numbers, and hyphens.", "danger");
    return;
  }
  if (!awardAmountText || !isFinite(awardAmount) || awardAmount <= 0 || !awardDate || isNaN(new Date(awardDate).getTime())) {
    showPageAlert("Enter a valid positive Award amount and Award date.", "danger");
    return;
  }
  if (!employeeIsSimpleId(projectId) || employeeHasId(nirmanData.projects, "projectId", projectId)) {
    showPageAlert("Enter a unique Project ID using only letters, numbers, and hyphens.", "danger");
    return;
  }
  if (!employeeGetArea(areaId) || !projectName || !projectBudgetText || !isFinite(projectBudget) || projectBudget <= 0) {
    showPageAlert("Choose an existing Area and enter a Project name and positive budget.", "danger");
    return;
  }
  if (!projectDeadline || isNaN(new Date(projectDeadline).getTime()) || projectDeadline < awardDate) {
    showPageAlert("Choose a valid Project deadline on or after the Award date.", "danger");
    return;
  }
  if (["Planned", "In Progress", "Completed"].indexOf(projectStatus) === -1) {
    showPageAlert("Choose a valid Project status.", "danger");
    return;
  }
  if (employeeFindAwardForBid(bid.tenderId, bid.bidId) || findRecord(nirmanData.projects, "awardId", awardId)) {
    showPageAlert("The selected Bid or Award is already linked in the Award-Project chain.", "danger");
    return;
  }
  if (!window.confirm("Create Award " + awardId + " and required Project " + projectId + " together?")) {
    return;
  }

  nirmanData.tenderAwards.push({
    awardId: awardId,
    tenderId: bid.tenderId,
    bidId: bid.bidId,
    employeeId: currentEmployeeId,
    awardAmount: awardAmount,
    awardDate: awardDate
  });
  nirmanData.projects.push({
    projectId: projectId,
    awardId: awardId,
    areaId: areaId,
    projectBudget: projectBudget,
    projectName: projectName,
    deadline: projectDeadline,
    status: projectStatus
  });
  bid.bidStatus = "Selected";
  tender.status = "Awarded";
  form.reset();
  employeeHideModal("awardModal");
  employeeRenderTenders();
  showPageAlert("Award " + awardId + " and Project " + projectId + " were created together for this session.", "success");
}

function employeeInitializeTenders() {
  var publishForm = document.getElementById("publishTenderForm");
  var awardForm = document.getElementById("awardForm");
  var awardBid = document.getElementById("awardBid");
  var tenderDay = document.getElementById("newTenderDay");
  var awardDate = document.getElementById("awardDate");
  employeeRenderTenders();
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
  for (index = 0; index < nirmanData.bookings.length; index += 1) {
    var booking = nirmanData.bookings[index];
    var client = findRecord(nirmanData.clients, "clientId", booking.clientId);
    var unit = findRecord(nirmanData.units, "unitId", booking.unitId);
    var project = employeeGetProject(booking.projectId);
    var confirmation = findRecord(nirmanData.allocationConfirmations, "bookingId", booking.bookingId);
    var state = confirmation ? "Confirmed" : "Pending confirmation";
    if (confirmation) {
      confirmedCount += 1;
    }
    html += '<tr data-filter-row data-status="' + escapeHtml(state) + '"><td><span class="table-primary-text">' +
      escapeHtml(booking.bookingId) + '</span><span class="table-secondary-text">' + escapeHtml(formatDate(booking.bookingDate)) +
      "</span></td><td>" + escapeHtml(client ? getClientName(client.clientId) : "Unknown client") +
      '<span class="table-secondary-text">' + escapeHtml(booking.clientId) + "</span></td><td>" +
      escapeHtml(unit ? unit.unitNo + " / " + unit.unitType : booking.unitId) + '<span class="table-secondary-text">' +
      (unit ? createStatusBadge(unit.status) : "Unit unavailable") + "</span></td><td>" +
      escapeHtml(project ? project.projectName : booking.projectId) + '<span class="table-secondary-text">' +
      escapeHtml(booking.projectId) + "</span></td><td>" + createStatusBadge(booking.bookingStatus) +
      '<span class="table-secondary-text">Due ' + escapeHtml(formatCurrency(booking.dueAmount)) + "</span></td><td>" +
      (confirmation ? escapeHtml(getEmployeeName(confirmation.employeeId)) + '<span class="table-secondary-text">' +
        escapeHtml(confirmation.employeeId) + "</span>" : createStatusBadge(state)) + "</td><td>" +
      (confirmation ? "Confirmed" : '<button class="mini-action" type="button" data-confirm-allocation="' +
        escapeHtml(booking.bookingId) + '">Confirm</button>') + "</td></tr>";
  }
  var body = document.getElementById("allocationTableBody");
  if (body) {
    body.innerHTML = html || employeeEmptyTableRow(7, "No bookings", "No Booking-Allocation Processes are available.");
  }
  employeeSetText("allocationCount", nirmanData.bookings.length);
  employeeSetText("allocationConfirmedCount", confirmedCount);
  employeeSetText("allocationPendingCount", nirmanData.bookings.length - confirmedCount);
  employeeApplyPageFilters();
}

function employeeConfirmAllocation(bookingId) {
  var booking = employeeGetBooking(bookingId);
  var client = booking ? findRecord(nirmanData.clients, "clientId", booking.clientId) : null;
  var unit = booking ? findRecord(nirmanData.units, "unitId", booking.unitId) : null;
  var project = booking ? employeeGetProject(booking.projectId) : null;
  if (!booking || !client || !unit || !project) {
    showPageAlert("Booking, client, unit and project details are required before confirmation.", "danger");
    return;
  }
  if (findRecord(nirmanData.allocationConfirmations, "bookingId", bookingId)) {
    showPageAlert("This Booking allocation is already confirmed.", "danger");
    return;
  }
  if (!window.confirm("Confirm " + bookingId + " for " + getClientName(booking.clientId) + " as 1?")) {
    return;
  }
  nirmanData.allocationConfirmations.push({ bookingId: bookingId, employeeId: currentEmployeeId });
  booking.bookingStatus = "Confirmed";
  employeeRenderAllocations();
  showPageAlert("Booking allocation " + bookingId + " was confirmed for this session.", "success");
}

function employeeRenderPayments() {
  var html = "";
  var pendingCount = 0;
  var index;
  for (index = 0; index < nirmanData.payments.length; index += 1) {
    var payment = nirmanData.payments[index];
    var booking = employeeGetBooking(payment.bookingId);
    var installments = employeeGetPaymentInstallments(payment);
    var verified = payment.paymentStatus === "Verified" && payment.verifiedAt;
    if (payment.paymentStatus === "Pending") {
      pendingCount += 1;
    }
    html += '<tr data-filter-row data-status="' + escapeHtml(payment.paymentStatus) + '"><td><span class="table-primary-text">' +
      escapeHtml(payment.clientId + " / " + payment.paymentId) + '</span><span class="table-secondary-text">Client / Payment ID</span></td><td>' +
      escapeHtml(getClientName(payment.clientId)) + '<span class="table-secondary-text">' +
      escapeHtml(booking ? booking.bookingId + " / Unit " + booking.unitId : payment.bookingId) + "</span></td><td>" +
      escapeHtml(formatCurrency(payment.amount)) + '<span class="table-secondary-text">' + escapeHtml(payment.paymentMethod) +
      "</span></td><td>" + escapeHtml(formatDate(payment.paymentDue)) + "</td><td>" + createStatusBadge(payment.paymentStatus) +
      '<span class="table-secondary-text">' + escapeHtml(verified ? getEmployeeName(payment.verifiedByEmployeeId) + " / " +
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
  employeeSetText("paymentCount", nirmanData.payments.length);
  employeeSetText("paymentPendingCount", pendingCount);
  employeeSetText("installmentCount", nirmanData.installments.length);
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
    employeeDetailItem("Payment ID", payment.clientId + " / " + payment.paymentId) +
    employeeDetailItem("Client", getClientName(payment.clientId)) +
    employeeDetailItem("Booking-Allocation Process", payment.bookingId) +
    employeeDetailItem("Amount", formatCurrency(payment.amount)) +
    employeeDetailItem("Method", payment.paymentMethod) +
    employeeDetailItem("Payment due", formatDate(payment.paymentDue)) +
    employeeDetailHtmlItem("Status", createStatusBadge(payment.paymentStatus)) +
    employeeDetailItem("Verified by", payment.paymentStatus === "Verified" ?
      getEmployeeName(payment.verifiedByEmployeeId) + " at " + employeeFormatDateTime(payment.verifiedAt) : "Not yet verified") + "</ul>";
  if (installments.length) {
    html += '<h3 class="h6 mt-4">Owned Installments</h3><div class="table-responsive"><table class="table"><thead><tr><th>ID</th><th>Amount</th><th>Due</th><th>Status</th><th>Expired</th></tr></thead><tbody>';
    var index;
    for (index = 0; index < installments.length; index += 1) {
      var installment = installments[index];
      html += "<tr><td>" + escapeHtml(installment.clientId + " / " + installment.paymentId + " / " + installment.installmentId) +
        "</td><td>" + escapeHtml(formatCurrency(installment.amount)) + "</td><td>" + escapeHtml(formatDate(installment.dueDate)) +
        "</td><td>" + createStatusBadge(installment.status) + "</td><td>" +
        escapeHtml(installment.expiredAt ? employeeFormatDateTime(installment.expiredAt) : "Not expired") + "</td></tr>";
    }
    html += "</tbody></table></div>";
  } else {
    html += '<p class="text-muted-custom mt-3 mb-0">No installments are available for this payment.</p>';
  }
  employeeSetText("installmentTitle", "Installments for " + payment.clientId + " / " + payment.paymentId);
  var body = document.getElementById("installmentBody");
  if (body) {
    body.innerHTML = html;
  }
  employeeShowModal("installmentModal");
}

function employeeVerifyPayment(compositeKey) {
  var parts = compositeKey.split("|");
  var payment = parts.length === 2 ? employeeFindPayment(parts[0], parts[1]) : null;
  var booking = payment ? employeeGetBooking(payment.bookingId) : null;
  var client = payment ? findRecord(nirmanData.clients, "clientId", payment.clientId) : null;
  if (!payment || !booking || !client || booking.clientId !== payment.clientId) {
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
  if (!window.confirm("Verify Payment " + payment.clientId + " / " + payment.paymentId + " as 1?")) {
    return;
  }
  payment.paymentStatus = "Verified";
  payment.verifiedByEmployeeId = currentEmployeeId;
  payment.verifiedAt = new Date().toISOString();
  employeeRenderPayments();
  showPageAlert("Payment " + payment.clientId + " / " + payment.paymentId + " was verified for this session.", "success");
}

function employeeRenderComplaints() {
  var html = "";
  var pendingCount = 0;
  var resolvedCount = 0;
  var index;
  for (index = 0; index < nirmanData.complaints.length; index += 1) {
    var complaint = nirmanData.complaints[index];
    if (complaint.status === "Resolved") {
      resolvedCount += 1;
    } else {
      pendingCount += 1;
    }
    html += '<tr data-filter-row data-status="' + escapeHtml(complaint.status) + '"><td><span class="table-primary-text">' +
      escapeHtml(complaint.complaintId) + "</span></td><td>" + escapeHtml(getClientName(complaint.clientId)) +
      '<span class="table-secondary-text">' + escapeHtml(complaint.clientId) + "</span></td><td>" +
      escapeHtml(formatDate(complaint.filedDate)) + "</td><td>" + escapeHtml(complaint.note) + "</td><td>" +
      createStatusBadge(complaint.status) + '<span class="table-secondary-text">' +
      escapeHtml(complaint.status === "Resolved" ? getEmployeeName(complaint.resolvedByEmployeeId) : "Not yet resolved") +
      "</span></td><td>" + escapeHtml(complaint.resolution || "Not yet resolved") + "</td><td>" +
      (complaint.status === "Resolved" ? "Resolved" : '<button class="mini-action" type="button" data-resolve-complaint="' +
        escapeHtml(complaint.complaintId) + '">Resolve</button>') + "</td></tr>";
  }
  var body = document.getElementById("complaintTableBody");
  if (body) {
    body.innerHTML = html || employeeEmptyTableRow(7, "No complaints", "No Client-filed Complaints are available.");
  }
  employeeSetText("complaintCount", nirmanData.complaints.length);
  employeeSetText("complaintPendingCount", pendingCount);
  employeeSetText("complaintResolvedCount", resolvedCount);
  employeeApplyPageFilters();
}

function employeeOpenResolution(complaintId) {
  var complaint = findRecord(nirmanData.complaints, "complaintId", complaintId);
  var form = document.getElementById("resolutionForm");
  if (!complaint || complaint.status === "Resolved") {
    showPageAlert("Only an unresolved Complaint can receive a resolution.", "danger");
    return;
  }
  if (form) {
    form.reset();
  }
  document.getElementById("resolutionComplaintId").value = complaint.complaintId;
  employeeSetText("resolutionSummary", complaint.complaintId + " from " + getClientName(complaint.clientId) + ": " + complaint.note);
  employeeShowModal("resolutionModal");
}

function employeeSubmitResolution(event) {
  event.preventDefault();
  var form = event.currentTarget;
  var complaintId = document.getElementById("resolutionComplaintId").value;
  var resolution = document.getElementById("resolutionText").value.trim();
  var complaint = findRecord(nirmanData.complaints, "complaintId", complaintId);
  if (!complaint || complaint.status === "Resolved") {
    showPageAlert("The Complaint is missing or already resolved.", "danger");
    return;
  }
  if (resolution.length < 10 || resolution.length > 500) {
    showPageAlert("Enter a resolution from 10 to 500 characters.", "danger");
    return;
  }
  if (!window.confirm("Resolve Complaint " + complaintId + " as 1?")) {
    return;
  }
  complaint.status = "Resolved";
  complaint.resolution = resolution;
  complaint.resolvedByEmployeeId = currentEmployeeId;
  form.reset();
  employeeHideModal("resolutionModal");
  employeeRenderComplaints();
  showPageAlert("Complaint " + complaintId + " was resolved for this session.", "success");
}

function employeeGetProjectContractor(project) {
  var award = project ? findRecord(nirmanData.tenderAwards, "awardId", project.awardId) : null;
  var bid = award ? employeeFindBid(award.tenderId, award.bidId) : null;
  var representative = bid ? findRecord(nirmanData.contractorReps, "repId", bid.repId) : null;
  return representative ? employeeGetContractor(representative.contractorId) : null;
}

function employeeRenderProjects() {
  var projectHtml = "";
  var supervisionHtml = "";
  var overdueCount = 0;
  var ownSupervisions = [];
  var index;
  for (index = 0; index < nirmanData.supervisions.length; index += 1) {
    if (nirmanData.supervisions[index].employeeId === currentEmployeeId) {
      ownSupervisions.push(nirmanData.supervisions[index]);
    }
  }
  for (index = 0; index < nirmanData.projects.length; index += 1) {
    var project = nirmanData.projects[index];
    var area = employeeGetArea(project.areaId);
    var updates = employeeGetProjectUpdates(project.projectId);
    var progress = updates.length ? updates[0].progressPercent : 0;
    var overdue = isProjectOverdue(project);
    if (overdue) {
      overdueCount += 1;
    }
    projectHtml += '<tr data-filter-row data-status="' + escapeHtml(project.status) + '"><td><span class="table-primary-text">' +
      escapeHtml(project.projectName) + '</span><span class="table-secondary-text">' + escapeHtml(project.projectId) +
      "</span></td><td>" + escapeHtml(area ? area.areaId + " / House " + area.houseNo + ", " + area.roadSector : project.areaId) +
      "</td><td>" + escapeHtml(formatCurrency(project.projectBudget)) + '<span class="table-secondary-text">' +
      escapeHtml(project.awardId) + "</span></td><td>" + escapeHtml(formatDate(project.deadline)) +
      '<span class="table-secondary-text">' + (overdue ? createStatusBadge("Overdue") : createStatusBadge("On schedule")) +
      "</span></td><td>" + createStatusBadge(project.status) + "</td><td><strong>" + escapeHtml(progress + "%") +
      '</strong><span class="table-secondary-text">' + escapeHtml(updates.length + " update(s)") +
      '</span></td><td><button class="mini-action" type="button" data-project-updates="' +
      escapeHtml(project.projectId) + '">Details</button></td></tr>';
  }
  for (index = 0; index < ownSupervisions.length; index += 1) {
    var contractor = employeeGetContractor(ownSupervisions[index].contractorId);
    var representativeNames = [];
    var otherSupervisors = [];
    var repIndex;
    var supervisionIndex;
    if (!contractor) {
      continue;
    }
    for (repIndex = 0; repIndex < nirmanData.contractorReps.length; repIndex += 1) {
      if (nirmanData.contractorReps[repIndex].contractorId === contractor.contractorId) {
        representativeNames.push(getRepresentativeName(nirmanData.contractorReps[repIndex].repId));
      }
    }
    for (supervisionIndex = 0; supervisionIndex < nirmanData.supervisions.length; supervisionIndex += 1) {
      if (nirmanData.supervisions[supervisionIndex].contractorId === contractor.contractorId &&
          nirmanData.supervisions[supervisionIndex].employeeId !== currentEmployeeId) {
        otherSupervisors.push(getEmployeeName(nirmanData.supervisions[supervisionIndex].employeeId));
      }
    }
    supervisionHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(contractor.companyName) +
      '</span><span class="table-secondary-text">' + escapeHtml(contractor.contractorId) + "</span></td><td>" +
      escapeHtml(contractor.licenseNo) + '<span class="table-secondary-text">Due ' +
      escapeHtml(formatDate(contractor.licenseDue)) + "</span></td><td>" +
      escapeHtml(representativeNames.join(", ") || "None") + "</td><td>" +
      escapeHtml(otherSupervisors.join(", ") || "None") + "</td><td>" +
      escapeHtml(getEmployeeName(currentEmployeeId) + " (" + currentEmployeeId + ")") + "</td></tr>";
  }
  var projectBody = document.getElementById("projectTableBody");
  var supervisionBody = document.getElementById("supervisionTableBody");
  if (projectBody) {
    projectBody.innerHTML = projectHtml || employeeEmptyTableRow(7, "No projects", "No Award-resulting Projects are available.");
  }
  if (supervisionBody) {
    supervisionBody.innerHTML = supervisionHtml || employeeEmptyTableRow(5, "No assignments", "1 does not supervise a Contractor yet.");
  }
  employeeSetText("projectCount", nirmanData.projects.length);
  employeeSetText("projectOverdueCount", overdueCount);
  employeeSetText("projectUpdateCount", nirmanData.projectUpdates.length);
  employeeSetText("supervisionCount", ownSupervisions.length);
  employeePopulateSupervisionChoices();
  employeeApplyPageFilters();
}

function employeePopulateSupervisionChoices() {
  var select = document.getElementById("supervisionContractor");
  var html = '<option value="">Choose a Contractor</option>';
  var eligibleCount = 0;
  var index;
  if (!select) {
    return;
  }
  for (index = 0; index < nirmanData.contractors.length; index += 1) {
    var contractor = nirmanData.contractors[index];
    var alreadyAssigned = false;
    var supervisionIndex;
    for (supervisionIndex = 0; supervisionIndex < nirmanData.supervisions.length; supervisionIndex += 1) {
      if (nirmanData.supervisions[supervisionIndex].employeeId === currentEmployeeId &&
          nirmanData.supervisions[supervisionIndex].contractorId === contractor.contractorId) {
        alreadyAssigned = true;
      }
    }
    if (!alreadyAssigned) {
      eligibleCount += 1;
      html += '<option value="' + escapeHtml(contractor.contractorId) + '">' +
        escapeHtml(contractor.contractorId + " - " + contractor.companyName) + "</option>";
    }
  }
  if (eligibleCount === 0) {
    html = '<option value="">No unsupervised Contractors</option>';
  }
  select.innerHTML = html;
  select.disabled = eligibleCount === 0;
  var form = document.getElementById("supervisionForm");
  var submitButton = form ? form.querySelector('button[type="submit"]') : null;
  if (submitButton) {
    submitButton.disabled = eligibleCount === 0;
  }
}

function employeeShowProjectUpdates(projectId) {
  var project = employeeGetProject(projectId);
  if (!project) {
    showPageAlert("The selected Project could not be found.", "danger");
    return;
  }
  var area = employeeGetArea(project.areaId);
  var award = findRecord(nirmanData.tenderAwards, "awardId", project.awardId);
  var contractor = employeeGetProjectContractor(project);
  var updates = employeeGetProjectUpdates(project.projectId);
  var bookingCount = 0;
  var index;
  for (index = 0; index < nirmanData.bookings.length; index += 1) {
    if (nirmanData.bookings[index].projectId === project.projectId) {
      bookingCount += 1;
    }
  }
  employeeSetText("projectUpdateTitle", project.projectId + " - " + project.projectName);
  var html = '<div class="row g-4"><div class="col-lg-6"><h3 class="h6">Project details</h3><ul class="detail-list">' +
    employeeDetailItem("Project ID", project.projectId) + employeeDetailItem("Name", project.projectName) +
    employeeDetailItem("Budget", formatCurrency(project.projectBudget)) + employeeDetailItem("Deadline", formatDate(project.deadline)) +
    employeeDetailHtmlItem("Status", createStatusBadge(project.status)) +
    employeeDetailHtmlItem("Overdue", createStatusBadge(isProjectOverdue(project) ? "Overdue" : "On schedule")) +
    employeeDetailItem("Award", award ? award.awardId + " / " + award.tenderId + " / " + award.bidId : project.awardId) +
    employeeDetailItem("Resulting Contractor", contractor ? contractor.companyName : "Not available through the selected Bid") +
    employeeDetailItem("Booking-Allocation Processes", bookingCount) +
    '</ul></div><div class="col-lg-6"><h3 class="h6">Area details</h3><ul class="detail-list">' +
    (area ? employeeDetailItem("Area ID", area.areaId) + employeeDetailItem("Address", "House " + area.houseNo + ", " + area.roadSector) +
      employeeDetailItem("Boundary", area.boundaryInfo) + employeeDetailItem("Centre location", area.latitude + ", " + area.longitude) :
      employeeDetailItem("Area", "No matching Area record")) + "</ul></div></div>";
  html += '<hr class="my-4"><h3 class="h6">Project Update history</h3>';
  if (updates.length) {
    html += '<div class="timeline-list mt-3">';
    for (index = 0; index < updates.length; index += 1) {
      var update = updates[index];
      html += '<div class="timeline-item"><span class="timeline-dot"></span><div class="timeline-content"><h3>' +
        escapeHtml(update.projectId + " / " + update.updateId + " - " + update.progressPercent + "%") +
        "</h3><p>" + escapeHtml(update.workNote) + '</p><span class="timeline-date">' +
        escapeHtml(formatDate(update.updateDate) + " / " + getRepresentativeName(update.repId) + " (" + update.repId + ")") +
        "</span></div></div>";
    }
    html += "</div>";
  } else {
    html += '<p class="text-muted-custom mt-3 mb-0">No Project Updates belong to this Project.</p>';
  }
  var body = document.getElementById("projectUpdateBody");
  if (body) {
    body.innerHTML = html;
  }
  employeeShowModal("projectUpdateModal");
}

function employeeSubmitSupervision(event) {
  event.preventDefault();
  var form = event.currentTarget;
  var contractorId = document.getElementById("supervisionContractor").value;
  var contractor = employeeGetContractor(contractorId);
  var index;
  if (!contractor) {
    showPageAlert("Choose an existing Contractor not already supervised by 1.", "danger");
    return;
  }
  for (index = 0; index < nirmanData.supervisions.length; index += 1) {
    if (nirmanData.supervisions[index].employeeId === currentEmployeeId &&
        nirmanData.supervisions[index].contractorId === contractorId) {
      showPageAlert("1 already supervises this Contractor.", "danger");
      return;
    }
  }
  if (!window.confirm("Assign 1 to supervise " + contractor.companyName + "?")) {
    return;
  }
  nirmanData.supervisions.push({ employeeId: currentEmployeeId, contractorId: contractorId });
  form.reset();
  employeeHideModal("supervisionModal");
  employeeRenderProjects();
  showPageAlert("1 was assigned to " + contractor.companyName + " for this session.", "success");
}

function employeeInitializeProjects() {
  var form = document.getElementById("supervisionForm");
  employeeRenderProjects();
  if (form) {
    form.addEventListener("submit", employeeSubmitSupervision);
  }
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
  if (!page || typeof nirmanData === "undefined") {
    return;
  }
  employeeRenderSharedIdentity();
  employeeInitializeDelegatedActions();
  if (page === "dashboard") {
    employeeRenderDashboard();
  } else if (page === "profile") {
    employeeRenderProfile();
  } else if (page === "tenders") {
    employeeInitializeTenders();
  } else if (page === "allocations") {
    employeeRenderAllocations();
  } else if (page === "payments") {
    employeeRenderPayments();
  } else if (page === "complaints") {
    employeeRenderComplaints();
    var resolutionForm = document.getElementById("resolutionForm");
    if (resolutionForm) {
      resolutionForm.addEventListener("submit", employeeSubmitResolution);
    }
  } else if (page === "projects") {
    employeeInitializeProjects();
  }
  employeeInitializeFilters();
});
