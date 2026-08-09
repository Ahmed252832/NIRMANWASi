"use strict";

/* Shared formatting and lookup functions */

function findRecord(list, propertyName, value) {
  for (var index = 0; index < list.length; index += 1) {
    if (String(list[index][propertyName]) === String(value)) {
      return list[index];
    }
  }
  return null;
}

function getPersonName(personId) {
  var person = findRecord(nirmanData.people, "personId", personId);
  if (!person) {
    return "Unknown person";
  }
  return person.firstName + " " + person.lastName;
}

function getEmployeeName(employeeId) {
  var employee = findRecord(nirmanData.employees, "employeeId", employeeId);
  return employee ? getPersonName(employee.personId) : "Not assigned";
}

function getClientName(clientId) {
  var client = findRecord(nirmanData.clients, "clientId", clientId);
  return client ? getPersonName(client.personId) : "Unknown client";
}

function getRepresentativeName(repId) {
  var representative = findRecord(nirmanData.contractorReps, "repId", repId);
  return representative ? getPersonName(representative.personId) : "Unknown representative";
}

function formatCurrency(amount) {
  if (amount === null || amount === undefined || amount === "") {
    return "Not set";
  }
  return "BDT " + Number(amount).toLocaleString("en-US");
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not available";
  }

  var date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function escapeHtml(value) {
  var temporaryElement = document.createElement("div");
  temporaryElement.textContent = value === null || value === undefined ? "" : String(value);
  return temporaryElement.innerHTML
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getStatusClass(status) {
  var normalizedStatus = String(status).toLowerCase();

  if (
    normalizedStatus.indexOf("approved") >= 0 ||
    normalizedStatus.indexOf("confirmed") >= 0 ||
    normalizedStatus.indexOf("verified") >= 0 ||
    normalizedStatus.indexOf("resolved") >= 0 ||
    normalizedStatus.indexOf("completed") >= 0 ||
    normalizedStatus.indexOf("selected") >= 0 ||
    normalizedStatus.indexOf("available") >= 0 ||
    normalizedStatus.indexOf("awarded") >= 0
  ) {
    return "status-success";
  }

  if (
    normalizedStatus.indexOf("pending") >= 0 ||
    normalizedStatus.indexOf("upcoming") >= 0 ||
    normalizedStatus.indexOf("review") >= 0 ||
    normalizedStatus.indexOf("evaluation") >= 0
  ) {
    return "status-warning";
  }

  if (
    normalizedStatus.indexOf("rejected") >= 0 ||
    normalizedStatus.indexOf("expired") >= 0 ||
    normalizedStatus.indexOf("overdue") >= 0
  ) {
    return "status-danger";
  }

  if (
    normalizedStatus.indexOf("published") >= 0 ||
    normalizedStatus.indexOf("progress") >= 0 ||
    normalizedStatus.indexOf("allocated") >= 0 ||
    normalizedStatus.indexOf("reserved") >= 0
  ) {
    return "status-info";
  }

  return "status-neutral";
}

function createStatusBadge(status) {
  return '<span class="status-badge ' + getStatusClass(status) + '">' +
    escapeHtml(status) +
    "</span>";
}

function isProjectOverdue(project) {
  var completedStatuses = ["Completed", "Closed"];
  var deadline = new Date(project.deadline + "T23:59:59");
  return completedStatuses.indexOf(project.status) === -1 && deadline < new Date();
}

function getLatestProjectProgress(projectId) {
  var latestUpdate = null;

  for (var index = 0; index < nirmanData.projectUpdates.length; index += 1) {
    var update = nirmanData.projectUpdates[index];
    if (update.projectId === projectId) {
      if (!latestUpdate || new Date(update.updateDate) > new Date(latestUpdate.updateDate)) {
        latestUpdate = update;
      }
    }
  }

  return latestUpdate ? latestUpdate.progressPercent : 0;
}

function isUnitAvailableForBooking(unit) {
  if (!unit || unit.status !== "Available") {
    return false;
  }

  return !findRecord(nirmanData.bookings, "unitId", unit.unitId);
}

function showPageAlert(message, alertType) {
  var holder = document.getElementById("pageAlert");
  if (!holder) {
    return;
  }

  holder.innerHTML =
    '<div class="alert alert-' + (alertType || "success") +
    ' alert-dismissible fade show" role="alert">' +
    escapeHtml(message) +
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
    "</div>";
  holder.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* Generic table search used by role pages */

function filterTableRows(inputElement) {
  var tableId = inputElement.getAttribute("data-table-search");
  var table = document.getElementById(tableId);
  if (!table) {
    return;
  }

  var query = inputElement.value.toLowerCase().trim();
  var rows = table.querySelectorAll("tbody tr:not(.no-results-row)");
  var visibleCount = 0;

  for (var index = 0; index < rows.length; index += 1) {
    var rowText = rows[index].textContent.toLowerCase();
    var matchesSearch = rowText.indexOf(query) >= 0;
    rows[index].style.display = matchesSearch ? "" : "none";
    if (matchesSearch) {
      visibleCount += 1;
    }
  }

  updateTableResultCount(tableId, visibleCount);
}

function filterTableByStatus(selectElement) {
  var tableId = selectElement.getAttribute("data-status-filter");
  var table = document.getElementById(tableId);
  if (!table) {
    return;
  }

  var selectedStatus = selectElement.value.toLowerCase();
  var rows = table.querySelectorAll("tbody tr:not(.no-results-row)");
  var visibleCount = 0;

  for (var index = 0; index < rows.length; index += 1) {
    var rowStatus = String(rows[index].getAttribute("data-status") || "").toLowerCase();
    var matchesStatus = selectedStatus === "all" || rowStatus === selectedStatus;
    rows[index].style.display = matchesStatus ? "" : "none";
    if (matchesStatus) {
      visibleCount += 1;
    }
  }

  updateTableResultCount(tableId, visibleCount);
}

function updateTableResultCount(tableId, count) {
  var countElement = document.querySelector('[data-result-count="' + tableId + '"]');
  if (countElement) {
    countElement.textContent = count + (count === 1 ? " record" : " records");
  }
}

function initializeSimpleTabs() {
  var tabButtons = document.querySelectorAll("[data-tab-target]");

  for (var index = 0; index < tabButtons.length; index += 1) {
    tabButtons[index].addEventListener("click", function () {
      var tabGroup = this.closest(".data-card");
      var targetId = this.getAttribute("data-tab-target");
      var groupButtons = tabGroup.querySelectorAll("[data-tab-target]");
      var panels = tabGroup.querySelectorAll(".tab-panel");

      for (var buttonIndex = 0; buttonIndex < groupButtons.length; buttonIndex += 1) {
        groupButtons[buttonIndex].classList.remove("active");
      }

      for (var panelIndex = 0; panelIndex < panels.length; panelIndex += 1) {
        panels[panelIndex].hidden = panels[panelIndex].id !== targetId;
      }

      this.classList.add("active");
    });
  }
}

/* Shared page setup */

document.addEventListener("DOMContentLoaded", function () {
  var sidebar = document.getElementById("appSidebar");
  var sidebarToggle = document.getElementById("sidebarToggle");
  var sidebarBackdrop = document.getElementById("sidebarBackdrop");

  function closeSidebar() {
    if (sidebar) {
      sidebar.classList.remove("open");
    }
    if (sidebarBackdrop) {
      sidebarBackdrop.classList.remove("show");
    }
  }

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", function () {
      sidebar.classList.toggle("open");
      if (sidebarBackdrop) {
        sidebarBackdrop.classList.toggle("show");
      }
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener("click", closeSidebar);
  }

  var sidebarLinks = document.querySelectorAll(".sidebar-nav a");
  for (var linkIndex = 0; linkIndex < sidebarLinks.length; linkIndex += 1) {
    sidebarLinks[linkIndex].addEventListener("click", closeSidebar);
  }

  var searchInputs = document.querySelectorAll("[data-table-search]");
  for (var searchIndex = 0; searchIndex < searchInputs.length; searchIndex += 1) {
    searchInputs[searchIndex].addEventListener("input", function () {
      filterTableRows(this);
    });
  }

  var statusFilters = document.querySelectorAll("[data-status-filter]");
  for (var filterIndex = 0; filterIndex < statusFilters.length; filterIndex += 1) {
    statusFilters[filterIndex].addEventListener("change", function () {
      filterTableByStatus(this);
    });
  }

  var yearElements = document.querySelectorAll("[data-current-year]");
  for (var yearIndex = 0; yearIndex < yearElements.length; yearIndex += 1) {
    yearElements[yearIndex].textContent = new Date().getFullYear();
  }

  initializeSimpleTabs();
});
