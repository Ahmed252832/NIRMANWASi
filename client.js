
var currentClientId = "1";

function clientSetText(elementId, value) {
  var element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

function clientGetCurrentClient() {
  return findRecord(nirmanData.clients, "clientId", currentClientId);
}

function clientGetCurrentPerson() {
  var client = clientGetCurrentClient();
  return client ? findRecord(nirmanData.people, "personId", client.personId) : null;
}

function clientGetProject(projectId) {
  return findRecord(nirmanData.projects, "projectId", projectId);
}

function clientGetUnit(unitId) {
  return findRecord(nirmanData.units, "unitId", unitId);
}

function clientGetBooking(bookingId) {
  return findRecord(nirmanData.bookings, "bookingId", bookingId);
}

function clientGetOwnBookings() {
  var bookings = [];
  for (var index = 0; index < nirmanData.bookings.length; index += 1) {
    if (nirmanData.bookings[index].clientId === currentClientId) {
      bookings.push(nirmanData.bookings[index]);
    }
  }
  return bookings;
}

function clientGetOwnPayments() {
  var payments = [];
  for (var index = 0; index < nirmanData.payments.length; index += 1) {
    if (nirmanData.payments[index].clientId === currentClientId) {
      payments.push(nirmanData.payments[index]);
    }
  }
  return payments;
}

function clientGetOwnInstallments() {
  var installments = [];
  for (var index = 0; index < nirmanData.installments.length; index += 1) {
    if (nirmanData.installments[index].clientId === currentClientId &&
        clientFindPayment(nirmanData.installments[index].paymentId)) {
      installments.push(nirmanData.installments[index]);
    }
  }
  return installments;
}

function clientGetOwnComplaints() {
  var complaints = [];
  for (var index = 0; index < nirmanData.complaints.length; index += 1) {
    if (nirmanData.complaints[index].clientId === currentClientId) {
      complaints.push(nirmanData.complaints[index]);
    }
  }
  return complaints;
}

function clientFindPayment(paymentId) {
  for (var index = 0; index < nirmanData.payments.length; index += 1) {
    if (nirmanData.payments[index].clientId === currentClientId &&
        nirmanData.payments[index].paymentId === paymentId) {
      return nirmanData.payments[index];
    }
  }
  return null;
}

function clientGetPaymentInstallments(paymentId) {
  var installments = [];
  for (var index = 0; index < nirmanData.installments.length; index += 1) {
    var installment = nirmanData.installments[index];
    if (installment.clientId === currentClientId && installment.paymentId === paymentId) {
      installments.push(installment);
    }
  }
  return installments;
}

function clientGetProjectUpdates(projectId) {
  var updates = [];
  for (var index = 0; index < nirmanData.projectUpdates.length; index += 1) {
    if (nirmanData.projectUpdates[index].projectId === projectId) {
      updates.push(nirmanData.projectUpdates[index]);
    }
  }
  updates.sort(function (first, second) {
    return new Date(second.updateDate) - new Date(first.updateDate);
  });
  return updates;
}

function clientGetInitials(person) {
  if (!person) {
    return "--";
  }
  return String(person.firstName).charAt(0).toUpperCase() + String(person.lastName).charAt(0).toUpperCase();
}

function clientGetToday() {
  var today = new Date();
  var month = String(today.getMonth() + 1).padStart(2, "0");
  var day = String(today.getDate()).padStart(2, "0");
  return today.getFullYear() + "-" + month + "-" + day;
}

function clientFormatDateTime(dateValue) {
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

function clientDetailItem(label, value) {
  return '<li><span class="detail-label">' + escapeHtml(label) +
    '</span><span class="detail-value">' + escapeHtml(value) + "</span></li>";
}

function clientDetailHtmlItem(label, safeHtml) {
  return '<li><span class="detail-label">' + escapeHtml(label) +
    '</span><span class="detail-value">' + safeHtml + "</span></li>";
}

function clientEmptyState(mark, heading, message) {
  return '<div class="empty-state"><span class="empty-state-mark">' + escapeHtml(mark) +
    "</span><h3>" + escapeHtml(heading) + "</h3><p>" + escapeHtml(message) + "</p></div>";
}

function clientProgressBar(progress) {
  var safeProgress = Math.max(0, Math.min(100, Number(progress) || 0));
  return '<div class="progress progress-thin mt-2" role="progressbar" aria-label="Project progress" aria-valuenow="' +
    safeProgress + '" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width: ' +
    safeProgress + '%"></div></div>';
}

function clientShowModal(modalId) {
  var modalElement = document.getElementById(modalId);
  if (modalElement && window.bootstrap && window.bootstrap.Modal) {
    window.bootstrap.Modal.getOrCreateInstance(modalElement).show();
  }
}

function clientHideModal(modalId) {
  var modalElement = document.getElementById(modalId);
  if (modalElement && window.bootstrap && window.bootstrap.Modal) {
    window.bootstrap.Modal.getOrCreateInstance(modalElement).hide();
  }
}

function clientIdExists(list, propertyName, value) {
  var normalizedValue = String(value).toLowerCase();
  for (var index = 0; index < list.length; index += 1) {
    if (String(list[index][propertyName]).toLowerCase() === normalizedValue) {
      return true;
    }
  }
  return false;
}

function clientIsValidId(value) {
  return Boolean(value && value.length <= 20 && /^[A-Za-z0-9-]+$/.test(value));
}

function clientIsValidDate(value) {
  return Boolean(value && !Number.isNaN(new Date(value + "0:00:00").getTime()));
}

function clientGetQueryValue(name) {
  return new URLSearchParams(window.location.search).get(name) || "";
}

function clientRenderSharedIdentity() {
  var client = clientGetCurrentClient();
  var person = clientGetCurrentPerson();
  var name = person ? person.firstName + " " + person.lastName : "Unknown client";
  var initials = clientGetInitials(person);
  var nameElements = document.querySelectorAll("[data-client-name]");
  var idElements = document.querySelectorAll("[data-client-id]");
  var initialElements = document.querySelectorAll("[data-client-initials]");
  var index;
  for (index = 0; index < nameElements.length; index += 1) {
    nameElements[index].textContent = name;
  }
  for (index = 0; index < idElements.length; index += 1) {
    idElements[index].textContent = client ? client.clientId : "Unavailable";
  }
  for (index = 0; index < initialElements.length; index += 1) {
    initialElements[index].textContent = initials;
  }
}

function clientApplyTableFilter(tableId) {
  var table = document.getElementById(tableId);
  var group = document.querySelector('.client-filter-group[data-client-table="' + tableId + '"]');
  var countElement = document.querySelector('[data-client-count="' + tableId + '"]');
  if (!table || !group) {
    return;
  }
  var search = group.querySelector(".client-search");
  var status = group.querySelector(".client-status");
  var query = search ? search.value.toLowerCase().trim() : "";
  var selectedStatus = status ? status.value.toLowerCase() : "all";
  var rows = table.querySelectorAll("tbody tr:not(.no-results-row)");
  var visibleCount = 0;
  for (var index = 0; index < rows.length; index += 1) {
    var rowStatus = String(rows[index].getAttribute("data-status") || "").toLowerCase();
    var extraSearchText = rows[index].getAttribute("data-search-text") || "";
    var matchesSearch = (rows[index].textContent + " " + extraSearchText).toLowerCase().indexOf(query) >= 0;
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

function clientInitializeTableFilters() {
  var groups = document.querySelectorAll(".client-filter-group");
  for (var index = 0; index < groups.length; index += 1) {
    var tableId = groups[index].getAttribute("data-client-table");
    var search = groups[index].querySelector(".client-search");
    var status = groups[index].querySelector(".client-status");
    if (search) {
      search.addEventListener("input", function () {
        clientApplyTableFilter(this.closest(".client-filter-group").getAttribute("data-client-table"));
      });
    }
    if (status) {
      status.addEventListener("change", function () {
        clientApplyTableFilter(this.closest(".client-filter-group").getAttribute("data-client-table"));
      });
    }
    clientApplyTableFilter(tableId);
  }
}

function clientRenderDashboard() {
  var bookings = clientGetOwnBookings();
  var payments = clientGetOwnPayments();
  var installments = clientGetOwnInstallments();
  var complaints = clientGetOwnComplaints();
  var confirmedCount = 0;
  var pendingPaymentCount = 0;
  var openComplaintCount = 0;
  var index;
  for (index = 0; index < bookings.length; index += 1) {
    if (findRecord(nirmanData.allocationConfirmations, "bookingId", bookings[index].bookingId)) {
      confirmedCount += 1;
    }
  }
  for (index = 0; index < payments.length; index += 1) {
    if (payments[index].paymentStatus === "Pending") {
      pendingPaymentCount += 1;
    }
  }
  for (index = 0; index < complaints.length; index += 1) {
    if (complaints[index].status !== "Resolved") {
      openComplaintCount += 1;
    }
  }
  clientSetText("dashboardBookingCount", bookings.length);
  clientSetText("dashboardPaymentCount", payments.length);
  clientSetText("dashboardInstallmentCount", installments.length);
  clientSetText("dashboardComplaintCount", openComplaintCount);
  clientSetText("dashboardAllocationNote", confirmedCount + " confirmed, " + (bookings.length - confirmedCount) + " awaiting confirmation");
  clientSetText("dashboardPaymentNote", pendingPaymentCount + " awaiting Employee verification");
  clientSetText("dashboardInstallmentNote", installments.length ? "Check upcoming due dates" : "No installment schedule");

  var bookingHolder = document.getElementById("dashboardBookingSummary");
  if (bookingHolder) {
    var bookingHtml = '<div class="activity-list">';
    for (index = 0; index < bookings.length; index += 1) {
      var booking = bookings[index];
      var unit = clientGetUnit(booking.unitId);
      var project = clientGetProject(booking.projectId);
      var confirmation = findRecord(nirmanData.allocationConfirmations, "bookingId", booking.bookingId);
      bookingHtml += '<div class="activity-item"><span class="activity-marker">BK</span><div><h3>' +
        escapeHtml(booking.bookingId + " - " + (unit ? unit.unitNo : booking.unitId)) + " " + createStatusBadge(booking.bookingStatus) +
        '</h3><p>' + escapeHtml(project ? project.projectName : booking.projectId) + " · " +
        escapeHtml(formatCurrency(booking.dueAmount)) + " · " + createStatusBadge(confirmation ? "Allocation confirmed" : "Pending confirmation") +
        "</p></div></div>";
    }
    bookingHtml += "</div>";
    bookingHolder.innerHTML = bookings.length ? bookingHtml : clientEmptyState("BK", "No bookings yet", "Browse global Units to begin a Booking.");
  }

  var actionHolder = document.getElementById("dashboardNextActions");
  if (actionHolder) {
    var actions = [];
    if (!bookings.length) {
      actions.push(["UN", "Browse available Units", "Start with the available Units page.", "properties.html"]);
    }
    if (bookings.length > confirmedCount) {
      actions.push(["AL", "Check allocation status", "An Employee has not confirmed every Booking.", "bookings.html#allocationStatus"]);
    }
    if (pendingPaymentCount || bookings.length) {
      actions.push(["PY", "Check payments", pendingPaymentCount + " Payment(s) are Pending.", "payments.html"]);
    }
    if (openComplaintCount) {
      actions.push(["CP", "Follow support requests", openComplaintCount + " Complaint(s) await resolution.", "complaints.html"]);
    }
    if (!actions.length) {
      actions.push(["PR", "View projects", "Check project progress and areas.", "projects.html"]);
    }
    var actionHtml = "";
    for (index = 0; index < actions.length; index += 1) {
      actionHtml += '<li class="activity-item"><span class="activity-marker">' + escapeHtml(actions[index][0]) +
        '</span><div><h3><a href="' + escapeHtml(actions[index][3]) + '">' + escapeHtml(actions[index][1]) +
        "</a></h3><p>" + escapeHtml(actions[index][2]) + "</p></div></li>";
    }
    actionHolder.innerHTML = actionHtml;
  }

  var financeHolder = document.getElementById("dashboardFinanceSummary");
  if (financeHolder) {
    var financeHtml = '<div class="activity-list">';
    for (index = 0; index < payments.length; index += 1) {
      financeHtml += '<div class="activity-item"><span class="activity-marker">PY</span><div><h3>' +
        escapeHtml(currentClientId + " / " + payments[index].paymentId) + " " + createStatusBadge(payments[index].paymentStatus) +
        '</h3><p>' + escapeHtml(payments[index].bookingId + " · " + formatCurrency(payments[index].amount) +
          " · due " + formatDate(payments[index].paymentDue)) + "</p></div></div>";
    }
    financeHtml += "</div>";
    financeHolder.innerHTML = payments.length ? financeHtml : clientEmptyState("PY", "No payments recorded", "Payments submitted against your Bookings appear here.");
  }

  var complaintHolder = document.getElementById("dashboardComplaintSummary");
  if (complaintHolder) {
    var complaintHtml = '<div class="activity-list">';
    complaints.sort(function (first, second) { return new Date(second.filedDate) - new Date(first.filedDate); });
    for (index = 0; index < complaints.length && index < 4; index += 1) {
      complaintHtml += '<div class="activity-item"><span class="activity-marker">CP</span><div><h3>' +
        escapeHtml(complaints[index].complaintId) + " " + createStatusBadge(complaints[index].status) +
        '</h3><p>' + escapeHtml(complaints[index].note) + "</p></div></div>";
    }
    complaintHtml += "</div>";
    complaintHolder.innerHTML = complaints.length ? complaintHtml : clientEmptyState("CP", "No complaints filed", "Your support requests will appear here.");
  }
}

function clientRenderProfile() {
  var client = clientGetCurrentClient();
  var person = clientGetCurrentPerson();
  if (!client || !person) {
    showPageAlert("The fixed 1 Client profile could not be found.", "danger");
    return;
  }
  var fullName = person.firstName + " " + person.lastName;
  var header = document.getElementById("profileHeader");
  if (header) {
    header.innerHTML = '<span class="profile-avatar">' + escapeHtml(clientGetInitials(person)) +
      "</span><div><h2>" + escapeHtml(fullName) + "</h2><p>" + escapeHtml(client.clientId + " · Client account") + "</p></div>";
  }
  var personDetails = document.getElementById("profilePersonDetails");
  if (personDetails) {
    personDetails.innerHTML = clientDetailItem("Person ID", person.personId) +
      clientDetailItem("First name", person.firstName) + clientDetailItem("Last name", person.lastName) +
      clientDetailItem("Primary contact", person.contactNo) + clientDetailItem("Email", person.email);
  }
  var clientDetails = document.getElementById("profileClientDetails");
  if (clientDetails) {
    clientDetails.innerHTML = clientDetailItem("Client ID", client.clientId) +
      clientDetailItem("Person ID", client.personId) + clientDetailItem("NID", client.nid);
  }
  var contacts = [];
  for (var index = 0; index < nirmanData.clientContacts.length; index += 1) {
    if (nirmanData.clientContacts[index].clientId === currentClientId) {
      contacts.push(nirmanData.clientContacts[index].contactNo);
    }
  }
  var contactHolder = document.getElementById("profileContacts");
  if (contactHolder) {
    var html = '<ul class="detail-list">';
    for (index = 0; index < contacts.length; index += 1) {
      html += clientDetailItem("Client contact " + (index + 1), contacts[index]);
    }
    html += "</ul>";
    contactHolder.innerHTML = contacts.length ? html : clientEmptyState("CN", "No Client contacts", "No multivalued contact numbers are recorded.");
  }
}

function clientRenderProjects() {
  var body = document.getElementById("projectTableBody");
  if (!body) {
    return;
  }
  var html = "";
  for (var index = 0; index < nirmanData.projects.length; index += 1) {
    var project = nirmanData.projects[index];
    var area = findRecord(nirmanData.areas, "areaId", project.areaId);
    var updates = clientGetProjectUpdates(project.projectId);
    var latest = updates.length ? updates[0] : null;
    var overdue = isProjectOverdue(project);
    var updateSearchText = "";
    for (var updateIndex = 0; updateIndex < updates.length; updateIndex += 1) {
      updateSearchText += " " + updates[updateIndex].updateId + " " + updates[updateIndex].updateDate +
        " " + updates[updateIndex].workNote + " " + getRepresentativeName(updates[updateIndex].repId);
    }
    html += '<tr data-status="' + escapeHtml(project.status) + '" data-search-text="' +
      escapeHtml(updateSearchText) + '"><td><span class="table-primary-text">' +
      escapeHtml(project.projectName) + '</span><span class="table-secondary-text">' + escapeHtml(project.projectId) +
      "</span></td><td>" + escapeHtml(area ? "House " + area.houseNo + ", " + area.roadSector : "Area unavailable") +
      "</td><td>" + escapeHtml(formatDate(project.deadline)) + '<span class="table-secondary-text">' +
      createStatusBadge(overdue ? "Overdue" : "On schedule") + "</span></td><td>" + createStatusBadge(project.status) +
      "</td><td><strong>" + escapeHtml((latest ? latest.progressPercent : 0) + "%") + "</strong>" +
      clientProgressBar(latest ? latest.progressPercent : 0) + "</td><td>" +
      escapeHtml(latest ? formatDate(latest.updateDate) + " · " + latest.workNote : "No updates recorded") +
      '</td><td><button class="mini-action" type="button" data-client-project="' + escapeHtml(project.projectId) +
      '">Details</button></td></tr>';
  }
  body.innerHTML = html || '<tr class="no-results-row"><td colspan="7">' + clientEmptyState("PR", "No projects", "No Construction Project records are available.") + "</td></tr>";
}

function clientOpenProject(projectId) {
  var project = clientGetProject(projectId);
  if (!project) {
    showPageAlert("The selected Project could not be found.", "danger");
    return;
  }
  var area = findRecord(nirmanData.areas, "areaId", project.areaId);
  var updates = clientGetProjectUpdates(project.projectId);
  clientSetText("projectDetailTitle", project.projectId + " · " + project.projectName);
  var body = document.getElementById("projectDetailBody");
  if (body) {
    var html = '<div class="row g-4"><div class="col-lg-6"><h3 class="h6">Construction Project</h3><ul class="detail-list">' +
      clientDetailItem("Project ID", project.projectId) + clientDetailItem("Project name", project.projectName) +
      clientDetailItem("Budget", formatCurrency(project.projectBudget)) + clientDetailItem("Deadline", formatDate(project.deadline)) +
      clientDetailHtmlItem("Status", createStatusBadge(project.status)) +
      clientDetailHtmlItem("Deadline status", createStatusBadge(isProjectOverdue(project) ? "Overdue" : "On schedule")) +
      "</ul></div><div class=\"col-lg-6\"><h3 class=\"h6\">Area</h3>";
    if (area) {
      html += '<ul class="detail-list">' + clientDetailItem("Area ID", area.areaId) +
        clientDetailItem("Address", "House " + area.houseNo + ", " + area.roadSector) +
        clientDetailItem("Boundary", area.boundaryInfo) + clientDetailItem("Centre latitude", area.latitude) +
        clientDetailItem("Centre longitude", area.longitude) + "</ul>";
    } else {
      html += clientEmptyState("AR", "Area unavailable", "No Area record matches this Project.");
    }
    html += '</div></div><hr class="my-4"><h3 class="h6">Complete Project Update history</h3>';
    if (updates.length) {
      html += '<div class="timeline-list mt-3">';
      for (var index = 0; index < updates.length; index += 1) {
        html += '<div class="timeline-item"><span class="timeline-dot"></span><div class="timeline-content"><h3>' +
          escapeHtml(updates[index].projectId + " / " + updates[index].updateId + " · " + updates[index].progressPercent + "%") +
          "</h3><p>" + escapeHtml(updates[index].workNote) + '</p><span class="timeline-date">' +
          escapeHtml(formatDate(updates[index].updateDate) + " · " + getRepresentativeName(updates[index].repId)) + "</span></div></div>";
      }
      html += "</div>";
    } else {
      html += clientEmptyState("UP", "No progress history", "No Project Updates have been recorded.");
    }
    body.innerHTML = html;
  }
  clientShowModal("projectDetailModal");
}

function clientInitializeProjects() {
  clientRenderProjects();
  clientInitializeTableFilters();
  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-client-project]");
    if (button) {
      clientOpenProject(button.getAttribute("data-client-project"));
    }
  });
  var projectId = clientGetQueryValue("project");
  if (projectId) {
    clientOpenProject(projectId);
  }
}

function clientPopulatePropertyFilters() {
  var typeSelect = document.getElementById("propertyTypeFilter");
  var statusSelect = document.getElementById("propertyStatusFilter");
  var types = [];
  var statuses = [];
  for (var index = 0; index < nirmanData.units.length; index += 1) {
    if (types.indexOf(nirmanData.units[index].unitType) === -1) {
      types.push(nirmanData.units[index].unitType);
    }
    if (statuses.indexOf(nirmanData.units[index].status) === -1) {
      statuses.push(nirmanData.units[index].status);
    }
  }
  types.sort();
  statuses.sort();
  if (typeSelect) {
    for (index = 0; index < types.length; index += 1) {
      var typeOption = document.createElement("option");
      typeOption.value = types[index];
      typeOption.textContent = types[index];
      typeSelect.appendChild(typeOption);
    }
  }
  if (statusSelect) {
    for (index = 0; index < statuses.length; index += 1) {
      var statusOption = document.createElement("option");
      statusOption.value = statuses[index];
      statusOption.textContent = statuses[index];
      statusSelect.appendChild(statusOption);
    }
  }
}

function clientRenderProperties() {
  var grid = document.getElementById("propertyCardGrid");
  if (!grid) {
    return;
  }
  var search = document.getElementById("propertySearch");
  var typeFilter = document.getElementById("propertyTypeFilter");
  var statusFilter = document.getElementById("propertyStatusFilter");
  var query = search ? search.value.toLowerCase().trim() : "";
  var selectedType = typeFilter ? typeFilter.value : "all";
  var selectedStatus = statusFilter ? statusFilter.value : "all";
  var availableCount = 0;
  var visibleCount = 0;
  var html = "";
  for (var index = 0; index < nirmanData.units.length; index += 1) {
    var unit = nirmanData.units[index];
    var bookable = isUnitAvailableForBooking(unit);
    if (bookable) {
      availableCount += 1;
    }
    var searchableText = (unit.unitId + " " + unit.unitNo + " " + unit.unitType + " " + unit.status).toLowerCase();
    if (searchableText.indexOf(query) < 0 || (selectedType !== "all" && unit.unitType !== selectedType) ||
        (selectedStatus !== "all" && unit.status !== selectedStatus)) {
      continue;
    }
    visibleCount += 1;
    html += '<div class="col-md-6 col-xl-4"><article class="unit-card"><span class="unit-code">' +
      escapeHtml(unit.unitNo) + "</span><h3>" + escapeHtml(unit.unitType) + '</h3><p class="text-muted-custom">' +
      escapeHtml(unit.unitId) + " · Unit list</p><div class=\"d-flex gap-2 flex-wrap align-items-center mt-3\">" +
      createStatusBadge(unit.status) + (bookable ? createStatusBadge("Bookable") : createStatusBadge("Not bookable")) +
      '</div><div class="d-flex gap-2 flex-wrap mt-4"><button class="mini-action" type="button" data-client-unit="' +
      escapeHtml(unit.unitId) + '">Details</button>' + (bookable ? '<a class="mini-action" href="bookings.html?unit=' +
        encodeURIComponent(unit.unitId) + '">Book this Unit</a>' : "") + "</div></article></div>";
  }
  grid.innerHTML = html || '<div class="col-12">' + clientEmptyState("UN", "No matching Units", "Adjust the search, Unit type, or status filters.") + "</div>";
  clientSetText("propertyTotalCount", nirmanData.units.length);
  clientSetText("propertyAvailableCount", availableCount);
  clientSetText("propertyResultCount", visibleCount + (visibleCount === 1 ? " record" : " records"));
}

function clientOpenUnit(unitId) {
  var unit = clientGetUnit(unitId);
  if (!unit) {
    showPageAlert("The selected Unit could not be found.", "danger");
    return;
  }
  var bookable = isUnitAvailableForBooking(unit);
  clientSetText("unitDetailTitle", unit.unitId + " · " + unit.unitNo);
  var body = document.getElementById("unitDetailBody");
  if (body) {
    body.innerHTML = '<ul class="detail-list">' + clientDetailItem("Unit ID", unit.unitId) +
      clientDetailItem("Unit number", unit.unitNo) + clientDetailItem("Unit type", unit.unitType) +
      clientDetailHtmlItem("Stored status", createStatusBadge(unit.status)) +
      clientDetailHtmlItem("Booking eligibility", createStatusBadge(bookable ? "Bookable" : "Not bookable")) +
      "</ul><div class=\"info-callout mt-3\">This Unit is shown without Project context. Project selection is separate in the Booking form.</div>";
  }
  var action = document.getElementById("unitDetailAction");
  if (action) {
    action.innerHTML = bookable ? '<a class="btn btn-nirman" href="bookings.html?unit=' +
      encodeURIComponent(unit.unitId) + '">Book this Unit</a>' : '<span class="text-muted-custom">This Unit cannot be booked</span>';
  }
  clientShowModal("unitDetailModal");
}

function clientInitializeProperties() {
  clientPopulatePropertyFilters();
  clientRenderProperties();
  var filterIds = ["propertySearch", "propertyTypeFilter", "propertyStatusFilter"];
  for (var index = 0; index < filterIds.length; index += 1) {
    var filter = document.getElementById(filterIds[index]);
    if (filter) {
      filter.addEventListener(filter.tagName === "INPUT" ? "input" : "change", clientRenderProperties);
    }
  }
  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-client-unit]");
    if (button) {
      clientOpenUnit(button.getAttribute("data-client-unit"));
    }
  });
  var unitId = clientGetQueryValue("unit");
  if (unitId) {
    clientOpenUnit(unitId);
  }
}

function clientPopulateBookingChoices(preselectedUnitId) {
  var projectSelect = document.getElementById("bookingProject");
  var unitSelect = document.getElementById("bookingUnit");
  if (projectSelect) {
    projectSelect.innerHTML = '<option value="">Choose an existing Project</option>';
    for (var projectIndex = 0; projectIndex < nirmanData.projects.length; projectIndex += 1) {
      var project = nirmanData.projects[projectIndex];
      projectSelect.innerHTML += '<option value="' + escapeHtml(project.projectId) + '">' +
        escapeHtml(project.projectId + " · " + project.projectName) + "</option>";
    }
  }
  if (unitSelect) {
    var unitHtml = '<option value="">Choose an available Unit</option>';
    var availableCount = 0;
    for (var unitIndex = 0; unitIndex < nirmanData.units.length; unitIndex += 1) {
      var unit = nirmanData.units[unitIndex];
      if (isUnitAvailableForBooking(unit)) {
        availableCount += 1;
        unitHtml += '<option value="' + escapeHtml(unit.unitId) + '">' +
          escapeHtml(unit.unitId + " · " + unit.unitNo + " · " + unit.unitType) + "</option>";
      }
    }
    unitSelect.innerHTML = unitHtml;
    unitSelect.disabled = availableCount === 0;
    clientSetText("bookingUnitHelp", availableCount ? availableCount + " truly available Unit(s); existing Bookings are excluded." : "No Unit currently passes the availability rule.");
    if (preselectedUnitId) {
      var preselectedUnit = clientGetUnit(preselectedUnitId);
      if (preselectedUnit && isUnitAvailableForBooking(preselectedUnit)) {
        unitSelect.value = preselectedUnitId;
      } else {
        showPageAlert("The requested Unit is missing or no longer truly available. Choose another Unit.", "warning");
      }
    }
  }
}

function clientRenderBookings() {
  var bookings = clientGetOwnBookings();
  var body = document.getElementById("bookingTableBody");
  var allocationHolder = document.getElementById("allocationStatusList");
  var html = "";
  var allocationHtml = '<div class="activity-list">';
  for (var index = 0; index < bookings.length; index += 1) {
    var booking = bookings[index];
    var project = clientGetProject(booking.projectId);
    var unit = clientGetUnit(booking.unitId);
    var confirmation = findRecord(nirmanData.allocationConfirmations, "bookingId", booking.bookingId);
    html += '<tr data-status="' + escapeHtml(booking.bookingStatus) + '"><td><span class="table-primary-text">' +
      escapeHtml(booking.bookingId) + '</span><span class="table-secondary-text">' + escapeHtml(formatDate(booking.bookingDate)) +
      "</span></td><td>" + escapeHtml(project ? project.projectName : booking.projectId) + '<span class="table-secondary-text">' +
      escapeHtml(booking.projectId) + "</span></td><td>" + escapeHtml(unit ? unit.unitNo + " / " + unit.unitType : booking.unitId) +
      '<span class="table-secondary-text">' + escapeHtml(booking.unitId) + "</span></td><td>" +
      escapeHtml(formatCurrency(booking.dueAmount)) + "</td><td>" + createStatusBadge(booking.bookingStatus) +
      '</td><td><button class="mini-action" type="button" data-client-booking="' + escapeHtml(booking.bookingId) +
      '">Details</button></td></tr>';
    allocationHtml += '<div class="activity-item"><span class="activity-marker">AL</span><div><h3>' +
      escapeHtml(booking.bookingId + " · " + booking.unitId) + " " +
      createStatusBadge(confirmation ? "Confirmed" : "Pending confirmation") + "</h3><p>" +
      escapeHtml(confirmation ? "Confirmed by " + getEmployeeName(confirmation.employeeId) + " (" + confirmation.employeeId + ")" :
        "Awaiting confirmation by an Employee") + "</p></div></div>";
  }
  allocationHtml += "</div>";
  if (body) {
    body.innerHTML = html || '<tr><td colspan="6">' + clientEmptyState("BK", "No bookings", "Choose a truly available global Unit to create a Booking.") + "</td></tr>";
  }
  if (allocationHolder) {
    allocationHolder.innerHTML = bookings.length ? allocationHtml : clientEmptyState("AL", "No allocation processes", "Allocation begins after a Booking reserves a Unit.");
  }
  clientSetText("bookingCountBadge", bookings.length + (bookings.length === 1 ? " record" : " records"));
}

function clientOpenBooking(bookingId) {
  var booking = clientGetBooking(bookingId);
  if (!booking || booking.clientId !== currentClientId) {
    showPageAlert("The selected 1 Booking could not be found.", "danger");
    return;
  }
  var project = clientGetProject(booking.projectId);
  var unit = clientGetUnit(booking.unitId);
  var confirmation = findRecord(nirmanData.allocationConfirmations, "bookingId", booking.bookingId);
  clientSetText("bookingDetailTitle", "Booking " + booking.bookingId);
  var body = document.getElementById("bookingDetailBody");
  if (body) {
    body.innerHTML = '<ul class="detail-list">' + clientDetailItem("Booking ID", booking.bookingId) +
      clientDetailItem("Client", getClientName(booking.clientId) + " (" + booking.clientId + ")") +
      clientDetailItem("Project", project ? project.projectName + " (" + project.projectId + ")" : booking.projectId) +
      clientDetailItem("Reserved Unit", unit ? unit.unitNo + " / " + unit.unitType + " (" + unit.unitId + ")" : booking.unitId) +
      clientDetailItem("Booking date", formatDate(booking.bookingDate)) + clientDetailItem("Due amount", formatCurrency(booking.dueAmount)) +
      clientDetailHtmlItem("Booking status", createStatusBadge(booking.bookingStatus)) +
      clientDetailHtmlItem("Allocation", createStatusBadge(confirmation ? "Confirmed" : "Pending confirmation")) +
      clientDetailItem("Confirming Employee", confirmation ? getEmployeeName(confirmation.employeeId) + " (" + confirmation.employeeId + ")" : "Not yet confirmed") +
      "</ul>";
  }
  clientShowModal("bookingDetailModal");
}

function clientSubmitBooking(event) {
  event.preventDefault();
  var form = event.currentTarget;
  var bookingId = document.getElementById("bookingId").value.trim();
  var projectId = document.getElementById("bookingProject").value;
  var unitId = document.getElementById("bookingUnit").value;
  var bookingDate = document.getElementById("bookingDate").value;
  var amountText = document.getElementById("bookingDueAmount").value;
  var dueAmount = Number(amountText);
  var project = clientGetProject(projectId);
  var unit = clientGetUnit(unitId);
  if (!clientIsValidId(bookingId)) {
    showPageAlert("Enter a Booking ID using only letters, numbers, and hyphens.", "danger");
    return;
  }
  if (clientIdExists(nirmanData.bookings, "bookingId", bookingId)) {
    showPageAlert("That Booking ID already exists.", "danger");
    return;
  }
  if (!project) {
    showPageAlert("Choose an existing Project.", "danger");
    return;
  }
  
  if (!unit || !isUnitAvailableForBooking(unit)) {
    clientPopulateBookingChoices("");
    showPageAlert("That Unit is no longer truly available. The choices were refreshed.", "danger");
    return;
  }
  if (!clientIsValidDate(bookingDate)) {
    showPageAlert("Choose a valid Booking date.", "danger");
    return;
  }
  if (!amountText || !Number.isFinite(dueAmount) || dueAmount <= 0) {
    showPageAlert("Enter a valid Due amount greater than zero.", "danger");
    return;
  }
  if (!window.confirm("Create Booking " + bookingId + " for Unit " + unit.unitNo + " and Project " + project.projectName + "?")) {
    return;
  }
  nirmanData.bookings.push({
    bookingId: bookingId,
    clientId: currentClientId,
    unitId: unit.unitId,
    projectId: project.projectId,
    bookingStatus: "Pending",
    bookingDate: bookingDate,
    dueAmount: dueAmount
  });
  unit.status = "Reserved";
  form.reset();
  document.getElementById("bookingStatus").value = "Pending";
  document.getElementById("bookingDate").value = clientGetToday();
  clientPopulateBookingChoices("");
  clientRenderBookings();
  showPageAlert("Booking " + bookingId + " was created. The unit is reserved for this session.", "success");
}

function clientInitializeBookings() {
  var preselectedUnit = clientGetQueryValue("unit");
  clientPopulateBookingChoices(preselectedUnit);
  clientRenderBookings();
  var dateInput = document.getElementById("bookingDate");
  if (dateInput && !dateInput.value) {
    dateInput.value = clientGetToday();
  }
  var form = document.getElementById("bookingForm");
  if (form) {
    form.addEventListener("submit", clientSubmitBooking);
  }
  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-client-booking]");
    if (button) {
      clientOpenBooking(button.getAttribute("data-client-booking"));
    }
  });
}

function clientPopulatePaymentBookings() {
  var select = document.getElementById("paymentBooking");
  if (!select) {
    return;
  }
  var bookings = clientGetOwnBookings();
  var html = '<option value="">Choose one of my Bookings</option>';
  for (var index = 0; index < bookings.length; index += 1) {
    var unit = clientGetUnit(bookings[index].unitId);
    html += '<option value="' + escapeHtml(bookings[index].bookingId) + '">' +
      escapeHtml(bookings[index].bookingId + " · " + (unit ? unit.unitNo : bookings[index].unitId) +
        " · due " + formatCurrency(bookings[index].dueAmount)) + "</option>";
  }
  select.innerHTML = html;
  select.disabled = bookings.length === 0;
}

function clientRenderPayments() {
  var payments = clientGetOwnPayments();
  var installments = clientGetOwnInstallments();
  var paymentBody = document.getElementById("paymentTableBody");
  var installmentBody = document.getElementById("installmentTableBody");
  var paymentHtml = "";
  var installmentHtml = "";
  var totalAmount = 0;
  var pendingCount = 0;
  var index;
  for (index = 0; index < payments.length; index += 1) {
    var payment = payments[index];
    var paymentInstallments = clientGetPaymentInstallments(payment.paymentId);
    totalAmount += Number(payment.amount) || 0;
    if (payment.paymentStatus === "Pending") {
      pendingCount += 1;
    }
    paymentHtml += '<tr data-status="' + escapeHtml(payment.paymentStatus) + '"><td><span class="table-primary-text">' +
      escapeHtml(payment.clientId + " / " + payment.paymentId) + '</span><span class="table-secondary-text">Client / Payment ID</span></td><td>' +
      escapeHtml(payment.bookingId) + "</td><td>" + escapeHtml(payment.paymentMethod) + '<span class="table-secondary-text">' +
      escapeHtml(formatCurrency(payment.amount)) + "</span></td><td>" + escapeHtml(formatDate(payment.paymentDue)) +
      "</td><td>" + createStatusBadge(payment.paymentStatus) + "</td><td>" +
      escapeHtml(payment.verifiedAt ? getEmployeeName(payment.verifiedByEmployeeId) + " · " + clientFormatDateTime(payment.verifiedAt) : "Not yet verified") +
      '</td><td><button class="mini-action" type="button" data-client-payment="' + escapeHtml(payment.paymentId) +
      '">Details (' + paymentInstallments.length + ")</button></td></tr>";
  }
  for (index = 0; index < installments.length; index += 1) {
    var installment = installments[index];
    installmentHtml += '<tr data-status="' + escapeHtml(installment.status) + '"><td><span class="table-primary-text">' +
      escapeHtml(installment.clientId + " / " + installment.paymentId + " / " + installment.installmentId) +
      '</span><span class="table-secondary-text">Client / Payment / Installment ID</span></td><td>' +
      escapeHtml(installment.clientId + " / " + installment.paymentId) + "</td><td>" + escapeHtml(formatCurrency(installment.amount)) +
      "</td><td>" + escapeHtml(formatDate(installment.dueDate)) + "</td><td>" + createStatusBadge(installment.status) +
      "</td><td>" + escapeHtml(installment.expiredAt ? clientFormatDateTime(installment.expiredAt) : "Not expired") + "</td></tr>";
  }
  if (paymentBody) {
    paymentBody.innerHTML = paymentHtml || '<tr class="no-results-row"><td colspan="7">' + clientEmptyState("PY", "No payments", "Use Make Payment after creating a Booking.") + "</td></tr>";
  }
  if (installmentBody) {
    installmentBody.innerHTML = installmentHtml || '<tr class="no-results-row"><td colspan="6">' + clientEmptyState("IN", "No installments", "Installments appear only under their owning Payment.") + "</td></tr>";
  }
  clientSetText("paymentTotalCount", payments.length);
  clientSetText("paymentTotalAmount", formatCurrency(totalAmount));
  clientSetText("paymentPendingCount", pendingCount);
  clientSetText("installmentTotalCount", installments.length);
}

function clientOpenPayment(paymentId) {
  var payment = clientFindPayment(paymentId);
  if (!payment) {
    showPageAlert("The selected 1 Payment could not be found.", "danger");
    return;
  }
  var installments = clientGetPaymentInstallments(payment.paymentId);
  clientSetText("paymentDetailTitle", currentClientId + " / " + payment.paymentId);
  var body = document.getElementById("paymentDetailBody");
  if (body) {
    var html = '<ul class="detail-list">' + clientDetailItem("Payment ID", payment.clientId + " / " + payment.paymentId) +
      clientDetailItem("Booking", payment.bookingId) + clientDetailItem("Method", payment.paymentMethod) +
      clientDetailItem("Amount", formatCurrency(payment.amount)) + clientDetailItem("Payment due", formatDate(payment.paymentDue)) +
      clientDetailHtmlItem("Status", createStatusBadge(payment.paymentStatus)) +
      clientDetailItem("Future / actual verifier", getEmployeeName(payment.verifiedByEmployeeId) + " (" + payment.verifiedByEmployeeId + ")") +
      clientDetailItem("Verified at", clientFormatDateTime(payment.verifiedAt)) + "</ul>";
    if (installments.length) {
      html += '<h3 class="h6 mt-4">Owned Installments</h3><div class="table-responsive"><table class="table"><thead><tr><th>ID</th><th>Amount</th><th>Due</th><th>Status</th></tr></thead><tbody>';
      for (var index = 0; index < installments.length; index += 1) {
        html += "<tr><td>" + escapeHtml(installments[index].clientId + " / " + installments[index].paymentId + " / " + installments[index].installmentId) +
          "</td><td>" + escapeHtml(formatCurrency(installments[index].amount)) + "</td><td>" +
          escapeHtml(formatDate(installments[index].dueDate)) + "</td><td>" + createStatusBadge(installments[index].status) + "</td></tr>";
      }
      html += "</tbody></table></div>";
    } else {
      html += clientEmptyState("IN", "No Installments", "This Payment has no owned Installment records.");
    }
    body.innerHTML = html;
  }
  clientShowModal("paymentDetailModal");
}

function clientSubmitPayment(event) {
  event.preventDefault();
  var form = event.currentTarget;
  var paymentId = document.getElementById("paymentId").value.trim();
  var bookingId = document.getElementById("paymentBooking").value;
  var method = document.getElementById("paymentMethod").value;
  var amountText = document.getElementById("paymentAmount").value;
  var amount = Number(amountText);
  var paymentDue = document.getElementById("paymentDue").value;
  var booking = clientGetBooking(bookingId);
  var verifier = findRecord(nirmanData.employees, "employeeId", "2");
  if (!clientIsValidId(paymentId)) {
    showPageAlert("Enter a Payment ID using only letters, numbers, and hyphens.", "danger");
    return;
  }
  var ownPayments = clientGetOwnPayments();
  if (clientIdExists(ownPayments, "paymentId", paymentId)) {
    showPageAlert("That Payment ID already exists within Client 1.", "danger");
    return;
  }
  if (!booking || booking.clientId !== currentClientId) {
    showPageAlert("Choose one of 1's existing Bookings.", "danger");
    return;
  }
  if (["Bank Transfer", "Card", "Cash", "Installment Plan"].indexOf(method) === -1) {
    showPageAlert("Choose a listed Payment method.", "danger");
    return;
  }
  if (!amountText || !Number.isFinite(amount) || amount <= 0) {
    showPageAlert("Enter a valid Payment amount greater than zero.", "danger");
    return;
  }
  if (!clientIsValidDate(paymentDue)) {
    showPageAlert("Choose a valid Payment due date.", "danger");
    return;
  }
  if (!verifier) {
    showPageAlert("The configured finance Employee 2 is unavailable, so this Payment cannot be associated safely.", "danger");
    return;
  }
  if (!window.confirm("Submit Payment " + currentClientId + " / " + paymentId + " for " + formatCurrency(amount) + "?")) {
    return;
  }
  nirmanData.payments.push({
    clientId: currentClientId,
    paymentId: paymentId,
    bookingId: booking.bookingId,
    verifiedByEmployeeId: verifier.employeeId,
    paymentStatus: "Pending",
    verifiedAt: "",
    paymentMethod: method,
    amount: amount,
    paymentDue: paymentDue
  });
  form.reset();
  clientHideModal("makePaymentModal");
  clientRenderPayments();
  clientApplyTableFilter("paymentTable");
  clientApplyTableFilter("installmentTable");
  showPageAlert("Pending Payment " + currentClientId + " / " + paymentId + " was added for this session.", "success");
}

function clientInitializePayments() {
  clientPopulatePaymentBookings();
  clientRenderPayments();
  clientInitializeTableFilters();
  var form = document.getElementById("paymentForm");
  if (form) {
    form.addEventListener("submit", clientSubmitPayment);
  }
  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-client-payment]");
    if (button) {
      clientOpenPayment(button.getAttribute("data-client-payment"));
    }
  });
}

function clientRenderComplaints() {
  var complaints = clientGetOwnComplaints();
  var body = document.getElementById("complaintTableBody");
  var pendingCount = 0;
  var resolvedCount = 0;
  var html = "";
  complaints.sort(function (first, second) { return new Date(second.filedDate) - new Date(first.filedDate); });
  for (var index = 0; index < complaints.length; index += 1) {
    var complaint = complaints[index];
    if (complaint.status === "Resolved") {
      resolvedCount += 1;
    } else {
      pendingCount += 1;
    }
    html += '<tr data-status="' + escapeHtml(complaint.status) + '"><td><span class="table-primary-text">' +
      escapeHtml(complaint.complaintId) + "</span></td><td>" + escapeHtml(formatDate(complaint.filedDate)) +
      "</td><td>" + escapeHtml(complaint.note) + "</td><td>" + escapeHtml(getEmployeeName(complaint.resolvedByEmployeeId)) +
      '<span class="table-secondary-text">' + escapeHtml(complaint.resolvedByEmployeeId) + "</span></td><td>" +
      createStatusBadge(complaint.status) + "</td><td>" + escapeHtml(complaint.resolution || "Not yet resolved") +
      '</td><td><button class="mini-action" type="button" data-client-complaint="' + escapeHtml(complaint.complaintId) +
      '">Details</button></td></tr>';
  }
  if (body) {
    body.innerHTML = html || '<tr class="no-results-row"><td colspan="7">' + clientEmptyState("CP", "No complaints", "File a support request using the form.") + "</td></tr>";
  }
  clientSetText("complaintTotalCount", complaints.length);
  clientSetText("complaintPendingCount", pendingCount);
  clientSetText("complaintResolvedCount", resolvedCount);
}

function clientOpenComplaint(complaintId) {
  var complaint = findRecord(nirmanData.complaints, "complaintId", complaintId);
  if (!complaint || complaint.clientId !== currentClientId) {
    showPageAlert("The selected 1 Complaint could not be found.", "danger");
    return;
  }
  clientSetText("complaintDetailTitle", "Complaint " + complaint.complaintId);
  var body = document.getElementById("complaintDetailBody");
  if (body) {
    body.innerHTML = '<ul class="detail-list">' + clientDetailItem("Complaint ID", complaint.complaintId) +
      clientDetailItem("Client", getClientName(complaint.clientId) + " (" + complaint.clientId + ")") +
      clientDetailItem("Filed date", formatDate(complaint.filedDate)) + clientDetailItem("Complaint note", complaint.note) +
      clientDetailItem("Assigned Employee", getEmployeeName(complaint.resolvedByEmployeeId) + " (" + complaint.resolvedByEmployeeId + ")") +
      clientDetailHtmlItem("Status", createStatusBadge(complaint.status)) +
      clientDetailItem("Resolution", complaint.resolution || "Not yet resolved") + "</ul>";
  }
  clientShowModal("complaintDetailModal");
}

function clientSubmitComplaint(event) {
  event.preventDefault();
  var form = event.currentTarget;
  var complaintId = document.getElementById("complaintId").value.trim();
  var filedDate = document.getElementById("complaintDate").value;
  var note = document.getElementById("complaintNote").value.trim();
  var assignedEmployee = findRecord(nirmanData.employees, "employeeId", "4");
  if (!clientIsValidId(complaintId)) {
    showPageAlert("Enter a Complaint ID using only letters, numbers, and hyphens.", "danger");
    return;
  }
  if (clientIdExists(nirmanData.complaints, "complaintId", complaintId)) {
    showPageAlert("That Complaint ID already exists.", "danger");
    return;
  }
  if (!clientIsValidDate(filedDate)) {
    showPageAlert("Choose a valid Filed date.", "danger");
    return;
  }
  if (note.length < 10 || note.length > 500) {
    showPageAlert("Enter a Complaint note between 10 and 500 characters.", "danger");
    return;
  }
  if (!assignedEmployee) {
    showPageAlert("The configured Client Services Employee 4 is unavailable.", "danger");
    return;
  }
  if (!window.confirm("Submit Complaint " + complaintId + " and assign it to " + getEmployeeName(assignedEmployee.employeeId) + "?")) {
    return;
  }
  nirmanData.complaints.push({
    complaintId: complaintId,
    clientId: currentClientId,
    resolvedByEmployeeId: assignedEmployee.employeeId,
    status: "Pending",
    filedDate: filedDate,
    note: note,
    resolution: ""
  });
  form.reset();
  document.getElementById("complaintDate").value = clientGetToday();
  clientRenderComplaints();
  clientApplyTableFilter("complaintTable");
  showPageAlert("Complaint " + complaintId + " was submitted for this session.", "success");
}

function clientInitializeComplaints() {
  clientRenderComplaints();
  clientInitializeTableFilters();
  var dateInput = document.getElementById("complaintDate");
  if (dateInput && !dateInput.value) {
    dateInput.value = clientGetToday();
  }
  var form = document.getElementById("complaintForm");
  if (form) {
    form.addEventListener("submit", clientSubmitComplaint);
  }
  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-client-complaint]");
    if (button) {
      clientOpenComplaint(button.getAttribute("data-client-complaint"));
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var page = document.body.getAttribute("data-client-page");
  if (!page || typeof nirmanData === "undefined") {
    return;
  }
  clientRenderSharedIdentity();
  if (!clientGetCurrentClient() || !clientGetCurrentPerson()) {
    showPageAlert("The fixed current Client 1 and its Person record are required.", "danger");
    return;
  }
  if (page === "dashboard") {
    clientRenderDashboard();
  } else if (page === "profile") {
    clientRenderProfile();
  } else if (page === "projects") {
    clientInitializeProjects();
  } else if (page === "properties") {
    clientInitializeProperties();
  } else if (page === "bookings") {
    clientInitializeBookings();
  } else if (page === "payments") {
    clientInitializePayments();
  } else if (page === "complaints") {
    clientInitializeComplaints();
  }
});
