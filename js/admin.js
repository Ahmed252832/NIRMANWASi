
function setAdminText(elementId, value) {
  var element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

function getAdminPerson(personId) {
  return findRecord(nirmanData.people, "personId", personId);
}

function getAdminEmployee(employeeId) {
  return findRecord(nirmanData.employees, "employeeId", employeeId);
}

function getAdminClient(clientId) {
  return findRecord(nirmanData.clients, "clientId", clientId);
}

function getAdminContractor(contractorId) {
  return findRecord(nirmanData.contractors, "contractorId", contractorId);
}

function getAdminProject(projectId) {
  return findRecord(nirmanData.projects, "projectId", projectId);
}

function getAdminArea(areaId) {
  return findRecord(nirmanData.areas, "areaId", areaId);
}

function getAdminUnit(unitId) {
  return findRecord(nirmanData.units, "unitId", unitId);
}

function getAdminBooking(bookingId) {
  return findRecord(nirmanData.bookings, "bookingId", bookingId);
}

function getAdminTender(tenderId) {
  return findRecord(nirmanData.tenders, "tenderId", tenderId);
}

function getAdminAward(awardId) {
  return findRecord(nirmanData.tenderAwards, "awardId", awardId);
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
  var date = new Date(dateValue + "23:59:59");
  var dayDifference;
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
  var dueDate = new Date(dateValue + "23:59:59");
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

function getUnconfirmedBookingCount() {
  var count = 0;
  for (var index = 0; index < nirmanData.bookings.length; index += 1) {
    if (!findRecord(nirmanData.allocationConfirmations, "bookingId", nirmanData.bookings[index].bookingId)) {
      count += 1;
    }
  }
  return count;
}

function getUnawardedReviewBidCount() {
  var count = 0;
  for (var index = 0; index < nirmanData.tenderBids.length; index += 1) {
    var bid = nirmanData.tenderBids[index];
    var hasAward = false;
    for (var awardIndex = 0; awardIndex < nirmanData.tenderAwards.length; awardIndex += 1) {
      if (nirmanData.tenderAwards[awardIndex].tenderId === bid.tenderId &&
          nirmanData.tenderAwards[awardIndex].bidId === bid.bidId) {
        hasAward = true;
      }
    }
    if (!hasAward && bid.bidStatus !== "Rejected") {
      count += 1;
    }
  }
  return count;
}

function renderDashboardPage() {
  var activeProjects = 0;
  var availableUnits = 0;
  var overdueProjects = 0;
  var pendingRepresentatives = 0;
  var pendingPayments = 0;
  var pendingComplaints = 0;
  var deadlines = [];
  var pendingItems = [];
  var recentItems = [];
  var index;

  for (index = 0; index < nirmanData.projects.length; index += 1) {
    if (nirmanData.projects[index].status !== "Completed" && nirmanData.projects[index].status !== "Closed") {
      activeProjects += 1;
    }
    if (isProjectOverdue(nirmanData.projects[index])) {
      overdueProjects += 1;
    }
    deadlines.push({
      label: nirmanData.projects[index].projectName,
      area: "Project deadline",
      date: nirmanData.projects[index].deadline
    });
  }
  for (index = 0; index < nirmanData.units.length; index += 1) {
    if (nirmanData.units[index].status === "Available" &&
        !findRecord(nirmanData.bookings, "unitId", nirmanData.units[index].unitId)) {
      availableUnits += 1;
    }
  }
  for (index = 0; index < nirmanData.contractorReps.length; index += 1) {
    if (nirmanData.contractorReps[index].approvalStatus === "Pending") {
      pendingRepresentatives += 1;
    }
  }
  for (index = 0; index < nirmanData.payments.length; index += 1) {
    if (nirmanData.payments[index].paymentStatus === "Pending") {
      pendingPayments += 1;
    }
    deadlines.push({
      label: nirmanData.payments[index].clientId + " / " + nirmanData.payments[index].paymentId,
      area: "Payment due",
      date: nirmanData.payments[index].paymentDue
    });
  }
  for (index = 0; index < nirmanData.complaints.length; index += 1) {
    if (nirmanData.complaints[index].status !== "Resolved") {
      pendingComplaints += 1;
    }
  }
  for (index = 0; index < nirmanData.tenders.length; index += 1) {
    deadlines.push({
      label: nirmanData.tenders[index].title,
      area: "Tender deadline",
      date: nirmanData.tenders[index].deadline
    });
  }
  for (index = 0; index < nirmanData.contractors.length; index += 1) {
    deadlines.push({
      label: nirmanData.contractors[index].companyName,
      area: "License due",
      date: nirmanData.contractors[index].licenseDue
    });
  }

  setAdminText("dashboardProjectCount", activeProjects);
  setAdminText("dashboardUnitCount", availableUnits);
  setAdminText("dashboardOverdueCount", overdueProjects);
  setAdminText("dashboardPendingCount", pendingRepresentatives + pendingPayments + pendingComplaints +
    getUnconfirmedBookingCount() + getUnawardedReviewBidCount());

  pendingItems.push(["RP", pendingRepresentatives + " representative approval(s)", "Review pending contractor representatives."]);
  pendingItems.push(["AL", getUnconfirmedBookingCount() + " allocation confirmation(s)", "Confirm existing booking-allocation processes."]);
  pendingItems.push(["PY", pendingPayments + " payment verification(s)", "Verify pending client payments."]);
  pendingItems.push(["CP", pendingComplaints + " unresolved complaint(s)", "Record complaint resolutions."]);
  pendingItems.push(["BD", getUnawardedReviewBidCount() + " eligible unawarded bid(s)", "Review bids before issuing an award and project."]);
  var pendingHtml = "";
  for (index = 0; index < pendingItems.length; index += 1) {
    pendingHtml += '<li class="activity-item"><span class="activity-marker">' + escapeHtml(pendingItems[index][0]) +
      '</span><div><h3>' + escapeHtml(pendingItems[index][1]) + "</h3><p>" +
      escapeHtml(pendingItems[index][2]) + "</p></div></li>";
  }
  document.getElementById("dashboardPendingList").innerHTML = pendingHtml;

  deadlines.sort(function (first, second) {
    var now = new Date().getTime();
    return Math.abs(new Date(first.date).getTime() - now) - Math.abs(new Date(second.date).getTime() - now);
  });
  var deadlineHtml = "";
  for (index = 0; index < deadlines.length && index < 8; index += 1) {
    var timeState = getDateState(deadlines[index].date);
    deadlineHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(deadlines[index].label) +
      "</span></td><td>" + escapeHtml(deadlines[index].area) + "</td><td>" +
      escapeHtml(formatDate(deadlines[index].date)) + "</td><td>" + createStatusBadge(timeState) + "</td></tr>";
  }
  document.getElementById("dashboardDeadlineBody").innerHTML = deadlineHtml;

  for (index = 0; index < nirmanData.projectUpdates.length; index += 1) {
    var updateProject = getAdminProject(nirmanData.projectUpdates[index].projectId);
    recentItems.push({
      marker: "UP",
      title: "Project update: " + (updateProject ? updateProject.projectName : nirmanData.projectUpdates[index].projectId),
      note: nirmanData.projectUpdates[index].workNote,
      date: nirmanData.projectUpdates[index].updateDate
    });
  }
  for (index = 0; index < nirmanData.bookings.length; index += 1) {
    recentItems.push({ marker: "BK", title: "Booking " + nirmanData.bookings[index].bookingId,
      note: getClientName(nirmanData.bookings[index].clientId) + " reserved unit " + nirmanData.bookings[index].unitId,
      date: nirmanData.bookings[index].bookingDate });
  }
  for (index = 0; index < nirmanData.complaints.length; index += 1) {
    recentItems.push({ marker: "CP", title: "Complaint " + nirmanData.complaints[index].complaintId,
      note: getClientName(nirmanData.complaints[index].clientId) + " / " + nirmanData.complaints[index].status,
      date: nirmanData.complaints[index].filedDate });
  }
  for (index = 0; index < nirmanData.tenderAwards.length; index += 1) {
    recentItems.push({ marker: "AW", title: "Tender award " + nirmanData.tenderAwards[index].awardId,
      note: nirmanData.tenderAwards[index].tenderId + " / bid " + nirmanData.tenderAwards[index].bidId,
      date: nirmanData.tenderAwards[index].awardDate });
  }
  recentItems.sort(function (first, second) { return new Date(second.date) - new Date(first.date); });
  var recentHtml = "";
  for (index = 0; index < recentItems.length && index < 7; index += 1) {
    recentHtml += '<li class="activity-item"><span class="activity-marker">' + escapeHtml(recentItems[index].marker) +
      '</span><div><h3>' + escapeHtml(recentItems[index].title) + "</h3><p>" +
      escapeHtml(recentItems[index].note) + " &middot; " + escapeHtml(formatDate(recentItems[index].date)) +
      "</p></div></li>";
  }
  document.getElementById("dashboardRecentList").innerHTML = recentHtml;
}

function renderPeoplePage() {
  var employeeHtml = "";
  var departmentHtml = "";
  var clientHtml = "";
  var relationHtml = "";
  var index;
  setAdminText("peopleEmployeeCount", nirmanData.employees.length);
  setAdminText("peopleDepartmentCount", nirmanData.departments.length);
  setAdminText("peopleClientCount", nirmanData.clients.length);
  setAdminText("peopleRelationCount", nirmanData.workRelations.length);

  for (index = 0; index < nirmanData.employees.length; index += 1) {
    var employee = nirmanData.employees[index];
    var employeePerson = getAdminPerson(employee.personId);
    employeeHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(getPersonName(employee.personId)) +
      '</span><span class="table-secondary-text">' + escapeHtml(employee.employeeId + " / " + employee.personId) +
      "</span></td><td>" + escapeHtml(employee.deptName) + "</td><td>" + escapeHtml(employee.designation) +
      "</td><td>" + escapeHtml(employeePerson ? employeePerson.email + " / " + employeePerson.contactNo : "Not available") +
      "</td><td>" + escapeHtml(employee.nid) + '</td><td><button class="mini-action people-detail" type="button" data-kind="employee" data-id="' +
      escapeHtml(employee.employeeId) + '">View</button></td></tr>';
  }
  document.getElementById("employeeTableBody").innerHTML = employeeHtml;

  for (index = 0; index < nirmanData.departments.length; index += 1) {
    var department = nirmanData.departments[index];
    var phones = [];
    var employeeCount = 0;
    for (var phoneIndex = 0; phoneIndex < nirmanData.departmentPhones.length; phoneIndex += 1) {
      if (nirmanData.departmentPhones[phoneIndex].deptName === department.deptName) {
        phones.push(nirmanData.departmentPhones[phoneIndex].phoneNo);
      }
    }
    for (var employeeIndex = 0; employeeIndex < nirmanData.employees.length; employeeIndex += 1) {
      if (nirmanData.employees[employeeIndex].deptName === department.deptName) {
        employeeCount += 1;
      }
    }
    departmentHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(department.deptName) +
      "</span></td><td>" + escapeHtml(department.location) + "</td><td>" + escapeHtml(department.email) +
      "</td><td>" + escapeHtml(phones.join(", ") || "None recorded") + "</td><td>" + employeeCount +
      "</td><td>" + escapeHtml(department.description) + "</td></tr>";
  }
  document.getElementById("departmentTableBody").innerHTML = departmentHtml;

  for (index = 0; index < nirmanData.clients.length; index += 1) {
    var client = nirmanData.clients[index];
    var clientPerson = getAdminPerson(client.personId);
    var contacts = [];
    for (var contactIndex = 0; contactIndex < nirmanData.clientContacts.length; contactIndex += 1) {
      if (nirmanData.clientContacts[contactIndex].clientId === client.clientId) {
        contacts.push(nirmanData.clientContacts[contactIndex].contactNo);
      }
    }
    clientHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(getPersonName(client.personId)) +
      '</span><span class="table-secondary-text">' + escapeHtml(client.clientId + " / " + client.personId) +
      "</span></td><td>" + escapeHtml(clientPerson ? clientPerson.email : "Not available") + "</td><td>" +
      escapeHtml(clientPerson ? clientPerson.contactNo : "Not available") + "</td><td>" + escapeHtml(contacts.join(", ") || "None recorded") +
      "</td><td>" + escapeHtml(client.nid) + '</td><td><button class="mini-action people-detail" type="button" data-kind="client" data-id="' +
      escapeHtml(client.clientId) + '">View</button></td></tr>';
  }
  document.getElementById("clientTableBody").innerHTML = clientHtml;

  for (index = 0; index < nirmanData.workRelations.length; index += 1) {
    var relation = nirmanData.workRelations[index];
    var manager = getAdminEmployee(relation.managerId);
    var subordinate = getAdminEmployee(relation.employeeId);
    relationHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(getEmployeeName(relation.managerId)) +
      '</span><span class="table-secondary-text">' + escapeHtml(relation.managerId) + "</span></td><td>" +
      escapeHtml(manager ? manager.designation : "Not available") + "</td><td><span class=\"table-primary-text\">" +
      escapeHtml(getEmployeeName(relation.employeeId)) + '</span><span class="table-secondary-text">' +
      escapeHtml(relation.employeeId) + "</span></td><td>" + escapeHtml(subordinate ? subordinate.designation : "Not available") +
      "</td><td>" + escapeHtml(subordinate ? subordinate.deptName : "Not available") + "</td></tr>";
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
    var employee = getAdminEmployee(recordId);
    var employeePerson = employee ? getAdminPerson(employee.personId) : null;
    if (!employee || !employeePerson) {
      return;
    }
    var managerName = "Top-level employee";
    var subordinateNames = [];
    for (var index = 0; index < nirmanData.workRelations.length; index += 1) {
      if (nirmanData.workRelations[index].employeeId === employee.employeeId) {
        managerName = getEmployeeName(nirmanData.workRelations[index].managerId);
      }
      if (nirmanData.workRelations[index].managerId === employee.employeeId) {
        subordinateNames.push(getEmployeeName(nirmanData.workRelations[index].employeeId));
      }
    }
    title = getPersonName(employee.personId);
    items = [["Employee / Person", employee.employeeId + " / " + employee.personId], ["Department", employee.deptName],
      ["Designation", employee.designation], ["NID", employee.nid], ["Email", employeePerson.email],
      ["Person contact", employeePerson.contactNo], ["Manager", managerName],
      ["Direct subordinates", subordinateNames.join(", ") || "None"]];
  } else {
    var client = getAdminClient(recordId);
    var clientPerson = client ? getAdminPerson(client.personId) : null;
    var contacts = [];
    if (!client || !clientPerson) {
      return;
    }
    for (var contactIndex = 0; contactIndex < nirmanData.clientContacts.length; contactIndex += 1) {
      if (nirmanData.clientContacts[contactIndex].clientId === client.clientId) {
        contacts.push(nirmanData.clientContacts[contactIndex].contactNo);
      }
    }
    title = getPersonName(client.personId);
    items = [["Client / Person", client.clientId + " / " + client.personId], ["NID", client.nid],
      ["Email", clientPerson.email], ["Person contact", clientPerson.contactNo],
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
  for (var index = 0; index < nirmanData.employees.length; index += 1) {
    html += '<option value="' + escapeHtml(nirmanData.employees[index].employeeId) + '">' +
      escapeHtml(getEmployeeName(nirmanData.employees[index].employeeId) + " - " + nirmanData.employees[index].designation) +
      "</option>";
  }
  select.innerHTML = html;
}

function renderContractorsPage() {
  var contractorHtml = "";
  var representativeHtml = "";
  var supervisionHtml = "";
  var pendingCount = 0;
  var index;
  for (index = 0; index < nirmanData.contractors.length; index += 1) {
    var contractor = nirmanData.contractors[index];
    var repNames = [];
    var supervisorNames = [];
    var licenseState = getLicenseState(contractor.licenseDue);
    for (var repIndex = 0; repIndex < nirmanData.contractorReps.length; repIndex += 1) {
      if (nirmanData.contractorReps[repIndex].contractorId === contractor.contractorId) {
        repNames.push(getRepresentativeName(nirmanData.contractorReps[repIndex].repId));
      }
    }
    for (var supervisorIndex = 0; supervisorIndex < nirmanData.supervisions.length; supervisorIndex += 1) {
      if (nirmanData.supervisions[supervisorIndex].contractorId === contractor.contractorId) {
        supervisorNames.push(getEmployeeName(nirmanData.supervisions[supervisorIndex].employeeId));
      }
    }
    contractorHtml += '<tr data-status="' + escapeHtml(licenseState) + '"><td><span class="table-primary-text">' +
      escapeHtml(contractor.companyName) + '</span><span class="table-secondary-text">' + escapeHtml(contractor.contractorId) +
      "</span></td><td>" + escapeHtml(contractor.licenseNo) + "</td><td>" + escapeHtml(formatDate(contractor.licenseDue)) +
      "</td><td>" + createStatusBadge(licenseState) + "</td><td>" + escapeHtml(repNames.join(", ") || "None") +
      "</td><td>" + escapeHtml(supervisorNames.join(", ") || "None") + "</td></tr>";
  }
  document.getElementById("contractorTableBody").innerHTML = contractorHtml;

  for (index = 0; index < nirmanData.contractorReps.length; index += 1) {
    var representative = nirmanData.contractorReps[index];
    var repPerson = getAdminPerson(representative.personId);
    var representedContractor = getAdminContractor(representative.contractorId);
    if (representative.approvalStatus === "Pending") {
      pendingCount += 1;
    }
    representativeHtml += '<tr data-status="' + escapeHtml(representative.approvalStatus) +
      '"><td><span class="table-primary-text">' + escapeHtml(getPersonName(representative.personId)) +
      '</span><span class="table-secondary-text">' + escapeHtml(representative.repId + " / " + representative.personId) +
      "</span></td><td>" + escapeHtml(representative.title) + "</td><td>" +
      escapeHtml(representedContractor ? representedContractor.companyName : "Unknown contractor") + "</td><td>" +
      escapeHtml(repPerson ? repPerson.email + " / " + repPerson.contactNo : "Not available") + "</td><td>" +
      createStatusBadge(representative.approvalStatus) + "</td><td>" +
      (representative.approvalStatus === "Pending" ? '<button class="mini-action approve-representative" type="button" data-id="' +
        escapeHtml(representative.repId) + '">Approve</button>' : "Approved") + "</td></tr>";
  }
  document.getElementById("representativeTableBody").innerHTML = representativeHtml;

  for (index = 0; index < nirmanData.supervisions.length; index += 1) {
    var supervision = nirmanData.supervisions[index];
    var supervisingEmployee = getAdminEmployee(supervision.employeeId);
    var supervisedContractor = getAdminContractor(supervision.contractorId);
    supervisionHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(getEmployeeName(supervision.employeeId)) +
      '</span><span class="table-secondary-text">' + escapeHtml(supervision.employeeId) + "</span></td><td>" +
      escapeHtml(supervisingEmployee ? supervisingEmployee.designation : "Not available") + "</td><td>" +
      escapeHtml(supervisingEmployee ? supervisingEmployee.deptName : "Not available") + "</td><td>" +
      escapeHtml(supervisedContractor ? supervisedContractor.companyName : "Unknown contractor") + "</td><td>" +
      escapeHtml(supervisedContractor ? supervisedContractor.licenseNo : "Not available") + "</td></tr>";
  }
  document.getElementById("supervisionTableBody").innerHTML = supervisionHtml;
  setAdminText("contractorCount", nirmanData.contractors.length);
  setAdminText("representativeCount", nirmanData.contractorReps.length);
  setAdminText("pendingRepresentativeCount", pendingCount);
  setAdminText("supervisionCount", nirmanData.supervisions.length);

  var approveButtons = document.querySelectorAll(".approve-representative");
  for (index = 0; index < approveButtons.length; index += 1) {
    approveButtons[index].addEventListener("click", function () {
      var representative = findRecord(nirmanData.contractorReps, "repId", this.getAttribute("data-id"));
      if (representative && window.confirm("Approve " + getRepresentativeName(representative.repId) + "?")) {
        representative.approvalStatus = "Approved";
        renderContractorsPage();
        applyAdminFilter("contractorTable");
        applyAdminFilter("representativeTable");
        applyAdminFilter("supervisionTable");
        showPageAlert("Representative approved in page memory only. No database record was changed.", "success");
      }
    });
  }
}

function initializeContractorForm() {
  var contractorSelect = document.getElementById("supervisionContractor");
  var form = document.getElementById("supervisionForm");
  populateEmployeeSelect("supervisionEmployee");
  var html = '<option value="">Choose a contractor</option>';
  for (var index = 0; index < nirmanData.contractors.length; index += 1) {
    html += '<option value="' + escapeHtml(nirmanData.contractors[index].contractorId) + '">' +
      escapeHtml(nirmanData.contractors[index].companyName) + "</option>";
  }
  contractorSelect.innerHTML = html;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var employeeId = document.getElementById("supervisionEmployee").value;
    var contractorId = document.getElementById("supervisionContractor").value;
    var duplicate = false;
    if (!getAdminEmployee(employeeId) || !getAdminContractor(contractorId)) {
      showPageAlert("Choose an existing employee and contractor.", "danger");
      return;
    }
    for (var index = 0; index < nirmanData.supervisions.length; index += 1) {
      if (nirmanData.supervisions[index].employeeId === employeeId &&
          nirmanData.supervisions[index].contractorId === contractorId) {
        duplicate = true;
      }
    }
    if (duplicate) {
      showPageAlert("That Employee-Contractor supervision pair already exists.", "danger");
      return;
    }
    if (!window.confirm("Create this supervision assignment?")) {
      return;
    }
    nirmanData.supervisions.push({ employeeId: employeeId, contractorId: contractorId });
    form.reset();
    hideAdminModal("supervisionModal");
    renderContractorsPage();
    applyAdminFilter("supervisionTable");
    showPageAlert("Supervision assignment added in page memory only. It will disappear after refresh.", "success");
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
  for (index = 0; index < nirmanData.areas.length; index += 1) {
    var area = nirmanData.areas[index];
    var projectNames = [];
    for (var projectIndex = 0; projectIndex < nirmanData.projects.length; projectIndex += 1) {
      if (nirmanData.projects[projectIndex].areaId === area.areaId) {
        projectNames.push(nirmanData.projects[projectIndex].projectName);
      }
    }
    areaHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(area.areaId) +
      "</span></td><td>" + escapeHtml("House " + area.houseNo + ", " + area.roadSector) + "</td><td>" +
      escapeHtml(area.latitude + ", " + area.longitude) + "</td><td>" + escapeHtml(area.boundaryInfo) + "</td><td>" +
      escapeHtml(projectNames.join(", ") || "None") + "</td></tr>";
  }
  document.getElementById("areaTableBody").innerHTML = areaHtml;

  for (index = 0; index < nirmanData.projects.length; index += 1) {
    var project = nirmanData.projects[index];
    var projectArea = getAdminArea(project.areaId);
    var deadlineState = isProjectOverdue(project) ? "Overdue" : "On schedule";
    var progress = getLatestProjectProgress(project.projectId);
    if (deadlineState === "Overdue") {
      overdueCount += 1;
    }
    projectHtml += '<tr data-status="' + escapeHtml(deadlineState) + '"><td><span class="table-primary-text">' +
      escapeHtml(project.projectName) + '</span><span class="table-secondary-text">' + escapeHtml(project.projectId) +
      "</span></td><td>" + escapeHtml(project.awardId) + "</td><td>" +
      escapeHtml(projectArea ? "House " + projectArea.houseNo + ", " + projectArea.roadSector : project.areaId) +
      "</td><td>" + escapeHtml(formatCurrency(project.projectBudget)) + "</td><td>" + escapeHtml(formatDate(project.deadline)) +
      "<span class=\"table-secondary-text\">" + createStatusBadge(deadlineState) + "</span></td><td>" +
      createStatusBadge(project.status) + "</td><td>" + escapeHtml(progress + "%") + "</td></tr>";
  }
  document.getElementById("projectTableBody").innerHTML = projectHtml;

  for (index = 0; index < nirmanData.units.length; index += 1) {
    var unit = nirmanData.units[index];
    var booking = findRecord(nirmanData.bookings, "unitId", unit.unitId);
    var bookingProject = booking ? getAdminProject(booking.projectId) : null;
    if (unit.status === "Available" && !booking) {
      availableCount += 1;
    }
    unitHtml += '<tr data-status="' + escapeHtml(unit.status) + '"><td><span class="table-primary-text">' +
      escapeHtml(unit.unitNo) + '</span><span class="table-secondary-text">' + escapeHtml(unit.unitId) +
      "</span></td><td>" + escapeHtml(unit.unitType) + "</td><td>" + createStatusBadge(unit.status) + "</td><td>" +
      escapeHtml(booking ? booking.bookingId + " / " + getClientName(booking.clientId) : "No booking context") + "</td><td>" +
      escapeHtml(bookingProject ? bookingProject.projectName + " (through " + booking.bookingId + ")" : "No project context") +
      "</td></tr>";
  }
  document.getElementById("unitTableBody").innerHTML = unitHtml;

  for (index = 0; index < nirmanData.projectUpdates.length; index += 1) {
    var update = nirmanData.projectUpdates[index];
    var updatedProject = getAdminProject(update.projectId);
    updateHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(update.projectId + " / " + update.updateId) +
      "</span></td><td>" + escapeHtml(updatedProject ? updatedProject.projectName : update.projectId) + "</td><td>" +
      escapeHtml(getRepresentativeName(update.repId)) + "</td><td>" + escapeHtml(formatDate(update.updateDate)) +
      "</td><td>" + escapeHtml(update.progressPercent + "%") + "</td><td>" + escapeHtml(update.workNote) + "</td></tr>";
  }
  document.getElementById("updateTableBody").innerHTML = updateHtml;
  setAdminText("portfolioAreaCount", nirmanData.areas.length);
  setAdminText("portfolioProjectCount", nirmanData.projects.length);
  setAdminText("portfolioUnitCount", nirmanData.units.length);
  setAdminText("portfolioUpdateCount", nirmanData.projectUpdates.length);
  setAdminText("portfolioOverdueNote", overdueCount + " overdue");
  setAdminText("portfolioAvailableNote", availableCount + " truly available");
}

function getBookingPaymentCount(bookingId) {
  var count = 0;
  for (var index = 0; index < nirmanData.payments.length; index += 1) {
    if (nirmanData.payments[index].bookingId === bookingId) {
      count += 1;
    }
  }
  return count;
}

function renderAllocationsPage() {
  var html = "";
  var confirmedCount = 0;
  var relatedPaymentCount = 0;
  for (var index = 0; index < nirmanData.bookings.length; index += 1) {
    var booking = nirmanData.bookings[index];
    var unit = getAdminUnit(booking.unitId);
    var project = getAdminProject(booking.projectId);
    var confirmation = findRecord(nirmanData.allocationConfirmations, "bookingId", booking.bookingId);
    var state = confirmation ? "Confirmed" : "Pending confirmation";
    var paymentCount = getBookingPaymentCount(booking.bookingId);
    relatedPaymentCount += paymentCount;
    if (confirmation) {
      confirmedCount += 1;
    }
    html += '<tr data-status="' + escapeHtml(state) + '"><td><span class="table-primary-text">' +
      escapeHtml(booking.bookingId) + '</span><span class="table-secondary-text">' + escapeHtml(formatDate(booking.bookingDate)) +
      "</span></td><td>" + escapeHtml(getClientName(booking.clientId)) + "<span class=\"table-secondary-text\">" +
      escapeHtml(booking.clientId) + "</span></td><td>" + escapeHtml(unit ? unit.unitNo + " / " + unit.unitType : booking.unitId) +
      "</td><td>" + escapeHtml(project ? project.projectName : booking.projectId) + "<span class=\"table-secondary-text\">" +
      escapeHtml(booking.projectId) + "</span></td><td>" + createStatusBadge(booking.bookingStatus) +
      '<span class="table-secondary-text">Due ' + escapeHtml(formatCurrency(booking.dueAmount)) + " / " + paymentCount +
      " payment(s)</span></td><td>" + (confirmation ? escapeHtml(getEmployeeName(confirmation.employeeId)) +
        '<span class="table-secondary-text">' + escapeHtml(confirmation.employeeId) + "</span>" : createStatusBadge(state)) +
      "</td><td>" + (confirmation ? "Confirmed" : '<button class="mini-action confirm-allocation" type="button" data-id="' +
        escapeHtml(booking.bookingId) + '">Confirm</button>') + "</td></tr>";
  }
  document.getElementById("allocationTableBody").innerHTML = html;
  setAdminText("allocationBookingCount", nirmanData.bookings.length);
  setAdminText("allocationConfirmedCount", confirmedCount);
  setAdminText("allocationPendingCount", nirmanData.bookings.length - confirmedCount);
  setAdminText("allocationPaymentCount", relatedPaymentCount);
  var buttons = document.querySelectorAll(".confirm-allocation");
  for (index = 0; index < buttons.length; index += 1) {
    buttons[index].addEventListener("click", function () {
      var booking = getAdminBooking(this.getAttribute("data-id"));
      if (!booking) {
        return;
      }
      document.getElementById("allocationBookingId").value = booking.bookingId;
      setAdminText("allocationSummary", booking.bookingId + " connects " + getClientName(booking.clientId) +
        ", unit " + booking.unitId + ", and project " + booking.projectId + ".");
      showAdminModal("allocationModal");
    });
  }
}

function initializeAllocationForm() {
  var form = document.getElementById("allocationForm");
  populateEmployeeSelect("allocationEmployee");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var bookingId = document.getElementById("allocationBookingId").value;
    var employeeId = document.getElementById("allocationEmployee").value;
    var booking = getAdminBooking(bookingId);
    if (!booking || !getAdminEmployee(employeeId)) {
      showPageAlert("Choose a pending booking and an existing employee.", "danger");
      return;
    }
    if (findRecord(nirmanData.allocationConfirmations, "bookingId", bookingId)) {
      showPageAlert("This Booking-Allocation Process is already confirmed.", "danger");
      return;
    }
    if (!window.confirm("Confirm this Booking-Allocation Process?")) {
      return;
    }
    nirmanData.allocationConfirmations.push({ bookingId: bookingId, employeeId: employeeId });
    booking.bookingStatus = "Confirmed";
    form.reset();
    hideAdminModal("allocationModal");
    renderAllocationsPage();
    applyAdminFilter("allocationTable");
    showPageAlert("Allocation confirmed in page memory only. No database record was changed.", "success");
  });
}

function getPaymentInstallments(payment) {
  var installments = [];
  for (var index = 0; index < nirmanData.installments.length; index += 1) {
    if (nirmanData.installments[index].clientId === payment.clientId &&
        nirmanData.installments[index].paymentId === payment.paymentId) {
      installments.push(nirmanData.installments[index]);
    }
  }
  return installments;
}

function findAdminPayment(clientId, paymentId) {
  for (var index = 0; index < nirmanData.payments.length; index += 1) {
    if (nirmanData.payments[index].clientId === clientId && nirmanData.payments[index].paymentId === paymentId) {
      return nirmanData.payments[index];
    }
  }
  return null;
}

function renderFinancePage() {
  var paymentHtml = "";
  var installmentHtml = "";
  var totalAmount = 0;
  var pendingCount = 0;
  var index;
  for (index = 0; index < nirmanData.payments.length; index += 1) {
    var payment = nirmanData.payments[index];
    var installments = getPaymentInstallments(payment);
    var verifier = getAdminEmployee(payment.verifiedByEmployeeId);
    totalAmount += Number(payment.amount);
    if (payment.paymentStatus === "Pending") {
      pendingCount += 1;
    }
    paymentHtml += '<tr data-status="' + escapeHtml(payment.paymentStatus) + '"><td><span class="table-primary-text">' +
      escapeHtml(payment.clientId + " / " + payment.paymentId) + '</span><span class="table-secondary-text">Weak Payment</span></td><td>' +
      escapeHtml(getClientName(payment.clientId)) + "</td><td>" + escapeHtml(payment.bookingId) + "</td><td>" +
      escapeHtml(formatCurrency(payment.amount)) + '<span class="table-secondary-text">' + escapeHtml(payment.paymentMethod) +
      "</span></td><td>" + escapeHtml(formatDate(payment.paymentDue)) + "</td><td>" +
      escapeHtml(verifier ? getEmployeeName(verifier.employeeId) : "Not yet assigned") + '<span class="table-secondary-text">' +
      escapeHtml(payment.verifiedAt ? "Verified " + formatAdminDateTime(payment.verifiedAt) : "Not yet verified") + "</span></td><td>" +
      createStatusBadge(payment.paymentStatus) + "</td><td>" + (payment.paymentStatus === "Pending" ?
        '<button class="mini-action verify-payment" type="button" data-client="' + escapeHtml(payment.clientId) +
        '" data-payment="' + escapeHtml(payment.paymentId) + '">Verify</button> ' : "") +
      '<button class="mini-action payment-installments" type="button" data-client="' + escapeHtml(payment.clientId) +
      '" data-payment="' + escapeHtml(payment.paymentId) + '">Installments (' + installments.length + ")</button></td></tr>";
  }
  document.getElementById("paymentTableBody").innerHTML = paymentHtml;

  for (index = 0; index < nirmanData.installments.length; index += 1) {
    var installment = nirmanData.installments[index];
    installmentHtml += '<tr data-status="' + escapeHtml(installment.status) + '"><td><span class="table-primary-text">' +
      escapeHtml(installment.clientId + " / " + installment.paymentId + " / " + installment.installmentId) +
      "</span></td><td>" + escapeHtml(installment.clientId + " / " + installment.paymentId) + "</td><td>" +
      escapeHtml(getClientName(installment.clientId)) + "</td><td>" + escapeHtml(formatCurrency(installment.amount)) +
      "</td><td>" + escapeHtml(formatDate(installment.dueDate)) + "</td><td>" + createStatusBadge(installment.status) +
      "</td><td>" + escapeHtml(installment.expiredAt ? formatDate(installment.expiredAt) : "Not expired") + "</td></tr>";
  }
  document.getElementById("installmentTableBody").innerHTML = installmentHtml;
  setAdminText("financePaymentCount", nirmanData.payments.length);
  setAdminText("financeTotalAmount", formatCurrency(totalAmount));
  setAdminText("financePendingCount", pendingCount);
  setAdminText("financeInstallmentCount", nirmanData.installments.length);

  var verifyButtons = document.querySelectorAll(".verify-payment");
  for (index = 0; index < verifyButtons.length; index += 1) {
    verifyButtons[index].addEventListener("click", function () {
      verifyAdminPayment(this.getAttribute("data-client"), this.getAttribute("data-payment"));
    });
  }
  var installmentButtons = document.querySelectorAll(".payment-installments");
  for (index = 0; index < installmentButtons.length; index += 1) {
    installmentButtons[index].addEventListener("click", function () {
      showPaymentInstallments(this.getAttribute("data-client"), this.getAttribute("data-payment"));
    });
  }
}

function verifyAdminPayment(clientId, paymentId) {
  var payment = findAdminPayment(clientId, paymentId);
  var employee;
  if (!payment || payment.paymentStatus !== "Pending") {
    showPageAlert("Only a current Pending payment can be verified.", "danger");
    return;
  }
  employee = getAdminEmployee(payment.verifiedByEmployeeId);
  if (!employee) {
    employee = getAdminEmployee("2");
  }
  if (!employee && nirmanData.employees.length > 0) {
    employee = nirmanData.employees[0];
  }
  if (!employee) {
    showPageAlert("No existing Employee is available to verify this payment.", "danger");
    return;
  }
  if (!window.confirm("Verify " + clientId + " / " + paymentId + " as " + getEmployeeName(employee.employeeId) + "?")) {
    return;
  }
  payment.verifiedByEmployeeId = employee.employeeId;
  payment.paymentStatus = "Verified";
  payment.verifiedAt = new Date().toISOString();
  renderFinancePage();
  applyAdminFilter("paymentTable");
  applyAdminFilter("installmentTable");
  showPageAlert("Payment verified in page memory only. The timestamp and status reset after refresh.", "success");
}

function showPaymentInstallments(clientId, paymentId) {
  var payment = findAdminPayment(clientId, paymentId);
  if (!payment) {
    return;
  }
  var installments = getPaymentInstallments(payment);
  var html = adminDetailList([["Payment owner", clientId + " / " + paymentId], ["Client", getClientName(clientId)],
    ["Booking", payment.bookingId], ["Payment amount", formatCurrency(payment.amount)], ["Installment count", installments.length]]);
  if (installments.length > 0) {
    html += '<div class="table-responsive mt-3"><table class="table"><thead><tr><th>Installment</th><th>Due</th><th>Amount</th><th>Status</th></tr></thead><tbody>';
    for (var index = 0; index < installments.length; index += 1) {
      html += "<tr><td>" + escapeHtml(installments[index].installmentId) + "</td><td>" +
        escapeHtml(formatDate(installments[index].dueDate)) + "</td><td>" + escapeHtml(formatCurrency(installments[index].amount)) +
        "</td><td>" + createStatusBadge(installments[index].status) + "</td></tr>";
    }
    html += "</tbody></table></div>";
  } else {
    html += '<p class="text-muted-custom mt-3 mb-0">No installments belong to this Payment.</p>';
  }
  setAdminText("installmentDetailTitle", "Installments for " + clientId + " / " + paymentId);
  document.getElementById("installmentDetailBody").innerHTML = html;
  showAdminModal("installmentDetailModal");
}

function renderComplaintsPage() {
  var html = "";
  var pendingCount = 0;
  var resolvedCount = 0;
  for (var index = 0; index < nirmanData.complaints.length; index += 1) {
    var complaint = nirmanData.complaints[index];
    if (complaint.status === "Resolved") {
      resolvedCount += 1;
    } else {
      pendingCount += 1;
    }
    html += '<tr data-status="' + escapeHtml(complaint.status) + '"><td><span class="table-primary-text">' +
      escapeHtml(complaint.complaintId) + '</span><span class="table-secondary-text">' + escapeHtml(formatDate(complaint.filedDate)) +
      "</span></td><td>" + escapeHtml(getClientName(complaint.clientId)) + '<span class="table-secondary-text">' +
      escapeHtml(complaint.clientId) + "</span></td><td>" + escapeHtml(complaint.note) + "</td><td>" +
      escapeHtml(getEmployeeName(complaint.resolvedByEmployeeId)) + "</td><td>" + createStatusBadge(complaint.status) +
      '</td><td><button class="mini-action complaint-detail" type="button" data-id="' + escapeHtml(complaint.complaintId) +
      '">Details</button> ' + (complaint.status === "Resolved" ? "" :
        '<button class="mini-action resolve-complaint" type="button" data-id="' + escapeHtml(complaint.complaintId) +
        '">Resolve</button>') + "</td></tr>";
  }
  document.getElementById("complaintTableBody").innerHTML = html;
  setAdminText("complaintTotalCount", nirmanData.complaints.length);
  setAdminText("complaintPendingCount", pendingCount);
  setAdminText("complaintResolvedCount", resolvedCount);
  setAdminText("complaintEmployeeCount", nirmanData.employees.length);
  var detailButtons = document.querySelectorAll(".complaint-detail");
  for (index = 0; index < detailButtons.length; index += 1) {
    detailButtons[index].addEventListener("click", function () {
      showComplaintDetails(this.getAttribute("data-id"));
    });
  }
  var resolveButtons = document.querySelectorAll(".resolve-complaint");
  for (index = 0; index < resolveButtons.length; index += 1) {
    resolveButtons[index].addEventListener("click", function () {
      openComplaintResolution(this.getAttribute("data-id"));
    });
  }
}

function showComplaintDetails(complaintId) {
  var complaint = findRecord(nirmanData.complaints, "complaintId", complaintId);
  if (!complaint) {
    return;
  }
  setAdminText("complaintDetailTitle", "Complaint " + complaint.complaintId);
  document.getElementById("complaintDetailBody").innerHTML = adminDetailList([
    ["Client", getClientName(complaint.clientId) + " (" + complaint.clientId + ")"],
    ["Filed date", formatDate(complaint.filedDate)], ["Status", complaint.status], ["Complaint note", complaint.note],
    ["Resolving employee", getEmployeeName(complaint.resolvedByEmployeeId)],
    ["Resolution", complaint.resolution || "Not yet resolved"]
  ]);
  showAdminModal("complaintDetailModal");
}

function openComplaintResolution(complaintId) {
  var complaint = findRecord(nirmanData.complaints, "complaintId", complaintId);
  if (!complaint || complaint.status === "Resolved") {
    showPageAlert("Only an unresolved complaint can be resolved.", "danger");
    return;
  }
  document.getElementById("resolveComplaintId").value = complaint.complaintId;
  document.getElementById("resolveComplaintStatus").value = "Resolved";
  document.getElementById("resolveComplaintEmployee").value = complaint.resolvedByEmployeeId;
  document.getElementById("resolveComplaintText").value = complaint.resolution;
  setAdminText("resolveComplaintSummary", complaint.complaintId + ": " + complaint.note);
  showAdminModal("complaintResolveModal");
}

function initializeComplaintForm() {
  var form = document.getElementById("complaintResolveForm");
  populateEmployeeSelect("resolveComplaintEmployee");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var complaintId = document.getElementById("resolveComplaintId").value;
    var status = document.getElementById("resolveComplaintStatus").value;
    var employeeId = document.getElementById("resolveComplaintEmployee").value;
    var resolution = document.getElementById("resolveComplaintText").value.trim();
    var complaint = findRecord(nirmanData.complaints, "complaintId", complaintId);
    if (!complaint || complaint.status === "Resolved") {
      showPageAlert("This complaint is missing or already resolved.", "danger");
      return;
    }
    if (status !== "Resolved" || !getAdminEmployee(employeeId) || resolution.length < 10) {
      showPageAlert("Choose Resolved, select an existing Employee, and enter at least 10 characters of resolution detail.", "danger");
      return;
    }
    if (!window.confirm("Resolve " + complaintId + "?")) {
      return;
    }
    complaint.status = status;
    complaint.resolution = resolution;
    complaint.resolvedByEmployeeId = employeeId;
    form.reset();
    hideAdminModal("complaintResolveModal");
    renderComplaintsPage();
    applyAdminFilter("complaintTable");
    showPageAlert("Complaint resolved in page memory only. No database record was changed.", "success");
  });
}

function findTenderBid(tenderId, bidId) {
  for (var index = 0; index < nirmanData.tenderBids.length; index += 1) {
    if (nirmanData.tenderBids[index].tenderId === tenderId && nirmanData.tenderBids[index].bidId === bidId) {
      return nirmanData.tenderBids[index];
    }
  }
  return null;
}

function findAwardForBid(tenderId, bidId) {
  for (var index = 0; index < nirmanData.tenderAwards.length; index += 1) {
    if (nirmanData.tenderAwards[index].tenderId === tenderId && nirmanData.tenderAwards[index].bidId === bidId) {
      return nirmanData.tenderAwards[index];
    }
  }
  return null;
}

function isEligibleBid(bid) {
  var tender = getAdminTender(bid.tenderId);
  return tender && tender.status !== "Awarded" && bid.bidStatus !== "Rejected" && !findAwardForBid(bid.tenderId, bid.bidId);
}

function populateAwardForm() {
  var bidSelect = document.getElementById("awardBidChoice");
  var employeeSelect = document.getElementById("awardEmployeeId");
  var areaSelect = document.getElementById("awardProjectArea");
  var bidHtml = '<option value="">Choose an eligible unawarded bid</option>';
  var areaHtml = '<option value="">Choose an existing area</option>';
  populateEmployeeSelect("awardEmployeeId");
  for (var index = 0; index < nirmanData.tenderBids.length; index += 1) {
    var bid = nirmanData.tenderBids[index];
    var tender = getAdminTender(bid.tenderId);
    if (isEligibleBid(bid)) {
      bidHtml += '<option value="' + escapeHtml(bid.tenderId + "|" + bid.bidId) + '">' +
        escapeHtml(bid.tenderId + " / " + bid.bidId + " - " + (tender ? tender.title : "Unknown tender") +
          " - " + formatCurrency(bid.bidAmount)) + "</option>";
    }
  }
  for (index = 0; index < nirmanData.areas.length; index += 1) {
    areaHtml += '<option value="' + escapeHtml(nirmanData.areas[index].areaId) + '">' +
      escapeHtml(nirmanData.areas[index].areaId + " - House " + nirmanData.areas[index].houseNo + ", " +
        nirmanData.areas[index].roadSector) + "</option>";
  }
  bidSelect.innerHTML = bidHtml;
  areaSelect.innerHTML = areaHtml;
  employeeSelect.value = "";
}

function renderTendersPage() {
  var tenderHtml = "";
  var bidHtml = "";
  var awardHtml = "";
  var awardedTenderCount = 0;
  var index;
  for (index = 0; index < nirmanData.tenders.length; index += 1) {
    var tender = nirmanData.tenders[index];
    var bidCount = 0;
    if (tender.status === "Awarded") {
      awardedTenderCount += 1;
    }
    for (var bidIndex = 0; bidIndex < nirmanData.tenderBids.length; bidIndex += 1) {
      if (nirmanData.tenderBids[bidIndex].tenderId === tender.tenderId) {
        bidCount += 1;
      }
    }
    tenderHtml += '<tr data-status="' + escapeHtml(tender.status) + '"><td><span class="table-primary-text">' +
      escapeHtml(tender.title) + '</span><span class="table-secondary-text">' + escapeHtml(tender.tenderId) +
      "</span></td><td>" + escapeHtml(getEmployeeName(tender.employeeId)) + "</td><td>" + escapeHtml(formatDate(tender.day)) +
      "</td><td>" + escapeHtml(formatDate(tender.deadline)) + "<span class=\"table-secondary-text\">" +
      createStatusBadge(getDateState(tender.deadline)) + "</span></td><td>" + bidCount + "</td><td>" +
      createStatusBadge(tender.status) + '</td><td><button class="mini-action tender-detail" type="button" data-kind="tender" data-first="' +
      escapeHtml(tender.tenderId) + '">Details</button></td></tr>';
  }
  document.getElementById("tenderTableBody").innerHTML = tenderHtml;

  for (index = 0; index < nirmanData.tenderBids.length; index += 1) {
    var bid = nirmanData.tenderBids[index];
    var bidTender = getAdminTender(bid.tenderId);
    var representative = findRecord(nirmanData.contractorReps, "repId", bid.repId);
    var bidContractor = representative ? getAdminContractor(representative.contractorId) : null;
    var bidAward = findAwardForBid(bid.tenderId, bid.bidId);
    bidHtml += '<tr data-status="' + escapeHtml(bid.bidStatus) + '"><td><span class="table-primary-text">' +
      escapeHtml(bid.tenderId + " / " + bid.bidId) + '</span><span class="table-secondary-text">Weak Tender Bid</span></td><td>' +
      escapeHtml(bidTender ? bidTender.title : bid.tenderId) + "</td><td>" + escapeHtml(getRepresentativeName(bid.repId)) +
      '<span class="table-secondary-text">' + escapeHtml(bidContractor ? bidContractor.companyName : "Unknown contractor") +
      "</span></td><td>" + escapeHtml(formatCurrency(bid.bidAmount)) + "</td><td>" + createStatusBadge(bid.bidStatus) +
      "</td><td>" + escapeHtml(bidAward ? bidAward.awardId : "Unawarded") + "</td><td>" +
      '<button class="mini-action tender-detail" type="button" data-kind="bid" data-first="' + escapeHtml(bid.tenderId) +
      '" data-second="' + escapeHtml(bid.bidId) + '">Details</button> ' + (isEligibleBid(bid) ?
        '<button class="mini-action open-award" type="button" data-value="' + escapeHtml(bid.tenderId + "|" + bid.bidId) +
        '">Award</button>' : "") + "</td></tr>";
  }
  document.getElementById("bidTableBody").innerHTML = bidHtml;

  for (index = 0; index < nirmanData.tenderAwards.length; index += 1) {
    var award = nirmanData.tenderAwards[index];
    var awardProject = findRecord(nirmanData.projects, "awardId", award.awardId);
    awardHtml += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(award.awardId) +
      "</span></td><td>" + escapeHtml(award.tenderId + " / " + award.bidId) + "</td><td>" +
      escapeHtml(getEmployeeName(award.employeeId)) + "</td><td>" + escapeHtml(formatCurrency(award.awardAmount)) +
      "</td><td>" + escapeHtml(formatDate(award.awardDate)) + "</td><td>" +
      escapeHtml(awardProject ? awardProject.projectName + " (" + awardProject.projectId + ")" : "No resulting project") +
      '</td><td><button class="mini-action tender-detail" type="button" data-kind="award" data-first="' +
      escapeHtml(award.awardId) + '">Details</button></td></tr>';
  }
  document.getElementById("awardTableBody").innerHTML = awardHtml;
  setAdminText("tenderTotalCount", nirmanData.tenders.length);
  setAdminText("tenderBidCount", nirmanData.tenderBids.length);
  setAdminText("tenderAwardCount", nirmanData.tenderAwards.length);
  setAdminText("tenderProjectCount", nirmanData.projects.length);
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
  var bid = choice.length === 2 ? findTenderBid(choice[0], choice[1]) : null;
  if (bid) {
    document.getElementById("awardAmount").value = bid.bidAmount;
  }
}

function showTenderDetails(kind, firstId, secondId) {
  var title = "Tender record details";
  var items = [];
  if (kind === "tender") {
    var tender = getAdminTender(firstId);
    if (!tender) { return; }
    title = tender.title;
    items = [["Tender", tender.tenderId], ["Publisher", getEmployeeName(tender.employeeId)], ["Published", formatDate(tender.day)],
      ["Deadline", formatDate(tender.deadline)], ["Status", tender.status], ["Task", tender.task], ["Bid details", tender.bidDetails]];
  } else if (kind === "bid") {
    var bid = findTenderBid(firstId, secondId);
    var representative = bid ? findRecord(nirmanData.contractorReps, "repId", bid.repId) : null;
    var contractor = representative ? getAdminContractor(representative.contractorId) : null;
    if (!bid) { return; }
    title = "Bid " + bid.tenderId + " / " + bid.bidId;
    items = [["Tender / Bid ID", bid.tenderId + " / " + bid.bidId], ["Representative", getRepresentativeName(bid.repId)],
      ["Contractor", contractor ? contractor.companyName : "Unknown contractor"], ["Amount", formatCurrency(bid.bidAmount)],
      ["Status", bid.bidStatus], ["Award", findAwardForBid(bid.tenderId, bid.bidId) ? findAwardForBid(bid.tenderId, bid.bidId).awardId : "Unawarded"]];
  } else {
    var award = getAdminAward(firstId);
    var project = award ? findRecord(nirmanData.projects, "awardId", award.awardId) : null;
    var area = project ? getAdminArea(project.areaId) : null;
    if (!award) { return; }
    title = "Award " + award.awardId;
    items = [["Selected bid", award.tenderId + " / " + award.bidId], ["Issued by", getEmployeeName(award.employeeId)],
      ["Award amount", formatCurrency(award.awardAmount)], ["Award date", formatDate(award.awardDate)],
      ["Resulting project", project ? project.projectName + " (" + project.projectId + ")" : "Missing"],
      ["Project budget", project ? formatCurrency(project.projectBudget) : "Not available"],
      ["Project deadline", project ? formatDate(project.deadline) : "Not available"],
      ["Area", area ? "House " + area.houseNo + ", " + area.roadSector : "Not available"]];
  }
  setAdminText("tenderDetailTitle", title);
  document.getElementById("tenderDetailBody").innerHTML = adminDetailList(items);
  showAdminModal("tenderDetailModal");
}

function initializeTenderAwardForm() {
  var form = document.getElementById("tenderAwardForm");
  document.getElementById("awardBidChoice").addEventListener("change", updateAwardAmountFromBid);
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var choice = document.getElementById("awardBidChoice").value.split("|");
    var awardId = document.getElementById("awardId").value.trim();
    var employeeId = document.getElementById("awardEmployeeId").value;
    var awardAmount = Number(document.getElementById("awardAmount").value);
    var awardDate = document.getElementById("awardDate").value;
    var projectId = document.getElementById("awardProjectId").value.trim();
    var areaId = document.getElementById("awardProjectArea").value;
    var projectBudget = Number(document.getElementById("awardProjectBudget").value);
    var projectName = document.getElementById("awardProjectName").value.trim();
    var projectDeadline = document.getElementById("awardProjectDeadline").value;
    var projectStatus = document.getElementById("awardProjectStatus").value;
    var bid = choice.length === 2 ? findTenderBid(choice[0], choice[1]) : null;
    var tender = bid ? getAdminTender(bid.tenderId) : null;
    if (!bid || !tender || !isEligibleBid(bid)) {
      showPageAlert("Choose an eligible unawarded Bid from a Tender that is not already Awarded.", "danger");
      return;
    }
    if (!awardId || !getAdminEmployee(employeeId) || awardAmount <= 0 || !awardDate) {
      showPageAlert("Complete every Tender Award field with valid values.", "danger");
      return;
    }
    if (!projectId || !getAdminArea(areaId) || projectBudget <= 0 || !projectName || !projectDeadline || !projectStatus) {
      showPageAlert("Complete every Construction Project field and choose an existing Area.", "danger");
      return;
    }
    if (getAdminAward(awardId)) {
      showPageAlert("Award ID " + awardId + " already exists.", "danger");
      return;
    }
    if (findAwardForBid(bid.tenderId, bid.bidId)) {
      showPageAlert("That tender bid already has an award.", "danger");
      return;
    }
    if (getAdminProject(projectId)) {
      showPageAlert("Project ID " + projectId + " already exists.", "danger");
      return;
    }
    if (findRecord(nirmanData.projects, "awardId", awardId)) {
      showPageAlert("That Award is already used by a Construction Project.", "danger");
      return;
    }
    if (!window.confirm("Create Award " + awardId + " and its required Construction Project " + projectId + "?")) {
      return;
    }
    nirmanData.tenderAwards.push({ awardId: awardId, tenderId: bid.tenderId, bidId: bid.bidId,
      employeeId: employeeId, awardAmount: awardAmount, awardDate: awardDate });
    nirmanData.projects.push({ projectId: projectId, awardId: awardId, areaId: areaId,
      projectBudget: projectBudget, projectName: projectName, deadline: projectDeadline, status: projectStatus });
    bid.bidStatus = "Selected";
    tender.status = "Awarded";
    form.reset();
    hideAdminModal("tenderAwardModal");
    renderTendersPage();
    applyAdminFilter("tenderTable");
    applyAdminFilter("bidTable");
    applyAdminFilter("awardTable");
    showPageAlert("Award and required Construction Project created together in page memory only. Both disappear after refresh.", "success");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var page = document.body.getAttribute("data-admin-page");
  if (!page || !window.nirmanData) {
    return;
  }
  if (page === "dashboard") {
    renderDashboardPage();
  } else if (page === "people") {
    renderPeoplePage();
  } else if (page === "contractors") {
    renderContractorsPage();
    initializeContractorForm();
  } else if (page === "portfolio") {
    renderPortfolioPage();
  } else if (page === "allocations") {
    renderAllocationsPage();
    initializeAllocationForm();
  } else if (page === "finance") {
    renderFinancePage();
  } else if (page === "complaints") {
    renderComplaintsPage();
    initializeComplaintForm();
  } else if (page === "tenders") {
    renderTendersPage();
    initializeTenderAwardForm();
  }
  initializeAdminFilters();
});
