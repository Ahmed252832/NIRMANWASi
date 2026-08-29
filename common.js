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

function parseLocalDate(dateValue, endOfDay) {
  if (!dateValue) {
    return new Date(NaN);
  }

  var value = String(dateValue);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(value + (endOfDay ? "T23:59:59" : "T00:00:00"));
  }

  return new Date(value);
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not available";
  }

  var date = parseLocalDate(dateValue, false);
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
  var deadline = parseLocalDate(project.deadline, true);

  return completedStatuses.indexOf(project.status) === -1 &&
    !Number.isNaN(deadline.getTime()) &&
    deadline < new Date();
}

function getLatestProjectProgress(projectId) {
  var latestUpdate = null;

  for (var index = 0; index < nirmanData.projectUpdates.length; index += 1) {
    var update = nirmanData.projectUpdates[index];
    if (update.projectId === projectId) {
      if (
        !latestUpdate ||
        parseLocalDate(update.updateDate, false) > parseLocalDate(latestUpdate.updateDate, false)
      ) {
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

function cleanFrontendText(value) {
  var text = String(value === null || value === undefined ? "" : value);
  var replacements = [
    ["Weak records owned by 1", "Client-owned payment records"],
    ["Published by 1", "Published by current employee"],
    ["Available to 1", "Available to current employee"],
    ["1 can verify", "Current employee can verify"],
    ["Filed by 1", "Filed by current client"],
    ["1 confirmation", "Employee confirmation"],
    ["Weak bids", "Bids"],
    ["The selected 1 Booking", "The selected booking"],
    ["The selected 1 Payment", "The selected payment"],
    ["The selected 1 Complaint", "The selected complaint"],
    ["within Client 1", "for this client"],
    ["Choose one of 1's existing Bookings.", "Choose one of this client's existing bookings."],
    ["The fixed current Client 1 and its Person record are required.", "The current client and linked person record are required."],
    ["1 does not supervise a Contractor yet.", "The current employee does not supervise a contractor yet."],
    ["not already supervised by 1", "not already supervised by the current employee"],
    ["1 already supervises this Contractor.", "The current employee already supervises this contractor."],
    ["Assign 1 to supervise ", "Assign the current employee to supervise "],
    ["1 was assigned to ", "The current employee was assigned to "],
    [" as 1?", " as the current employee?"],
    ["Global units", "All units"],
    ["global Units", "units"],
    ["global Unit", "unit"],
    ["global Properties", "properties"],
    ["pview", "preview"],
    ["Sign Out", "Sign out"]
  ];

  for (var index = 0; index < replacements.length; index += 1) {
    text = text.split(replacements[index][0]).join(replacements[index][1]);
  }

  return text;
}

function showPageAlert(message, alertType) {
  var holder = document.getElementById("pageAlert");
  if (!holder) {
    return;
  }

  holder.innerHTML =
    '<div class="alert alert-' + (alertType || "success") +
    ' alert-dismissible fade show" role="alert">' +
    escapeHtml(cleanFrontendText(message)) +
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
    "</div>";
  holder.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

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

function cleanVisibleText(root) {
  if (!root) {
    return;
  }

  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  var textNodes = [];
  var node;

  while ((node = walker.nextNode())) {
    var parentTag = node.parentElement ? node.parentElement.tagName : "";
    if (["SCRIPT", "STYLE", "TEXTAREA"].indexOf(parentTag) === -1) {
      textNodes.push(node);
    }
  }

  for (var index = 0; index < textNodes.length; index += 1) {
    var cleaned = cleanFrontendText(textNodes[index].nodeValue);
    if (cleaned !== textNodes[index].nodeValue) {
      textNodes[index].nodeValue = cleaned;
    }
  }
}

function configureSignOutLinks() {
  var links = document.querySelectorAll(".sidebar-footer a");
  if (!links.length) {
    return;
  }

  var destination = document.body.hasAttribute("data-admin-page") ?
    "../../admin-login.html" : "../../login.html";

  for (var index = 0; index < links.length; index += 1) {
    links[index].setAttribute("href", destination);
  }
}

function patchFrontendDateHelpers() {
  if (typeof window.clientIsValidDate === "function") {
    window.clientIsValidDate = function (value) {
      var date = parseLocalDate(value, false);
      return Boolean(value && !Number.isNaN(date.getTime()));
    };
  }

  if (typeof window.contractorTenderDeadlinePassed === "function") {
    window.contractorTenderDeadlinePassed = function (tender) {
      if (!tender) {
        return true;
      }
      var deadline = parseLocalDate(tender.deadline, true);
      return Number.isNaN(deadline.getTime()) || deadline < new Date();
    };
  }

  if (typeof window.getDateState === "function") {
    window.getDateState = function (dateValue) {
      var today = new Date();
      var date = parseLocalDate(dateValue, true);
      today.setHours(0, 0, 0, 0);

      if (Number.isNaN(date.getTime())) {
        return "Unknown";
      }

      var dayDifference = Math.ceil((date.getTime() - today.getTime()) / 86400000);
      if (dayDifference < 0) {
        return "Overdue";
      }
      if (dayDifference <= 30) {
        return "Due soon";
      }
      return "Upcoming";
    };
  }

  if (typeof window.getLicenseState === "function") {
    window.getLicenseState = function (dateValue) {
      var today = new Date();
      var dueDate = parseLocalDate(dateValue, true);
      today.setHours(0, 0, 0, 0);

      if (Number.isNaN(dueDate.getTime())) {
        return "Unknown";
      }

      var dayDifference = Math.ceil((dueDate.getTime() - today.getTime()) / 86400000);
      if (dayDifference < 0) {
        return "Expired";
      }
      if (dayDifference <= 90) {
        return "Due soon";
      }
      return "Valid";
    };
  }
}

function configureRelatedDateInputs() {
  var pairs = [
    [document.getElementById("newTenderDay"), document.getElementById("newTenderDeadline")],
    [document.getElementById("awardDate"), document.getElementById("projectDeadline")],
    [document.getElementById("awardDate"), document.getElementById("awardProjectDeadline")]
  ];

  for (var index = 0; index < pairs.length; index += 1) {
    (function (source, target) {
      if (!source || !target) {
        return;
      }

      function syncMinimum() {
        if (source.value) {
          target.min = source.value;
        }
      }

      syncMinimum();
      source.addEventListener("change", syncMinimum);
    })(pairs[index][0], pairs[index][1]);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  patchFrontendDateHelpers();

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

  configureSignOutLinks();
  initializeSimpleTabs();
  cleanVisibleText(document.body);

  var originalConfirm = window.confirm;
  window.confirm = function (message) {
    return originalConfirm.call(window, cleanFrontendText(message));
  };

  if (window.MutationObserver) {
    var observer = new MutationObserver(function (mutations) {
      for (var mutationIndex = 0; mutationIndex < mutations.length; mutationIndex += 1) {
        var mutation = mutations[mutationIndex];
        for (var nodeIndex = 0; nodeIndex < mutation.addedNodes.length; nodeIndex += 1) {
          var addedNode = mutation.addedNodes[nodeIndex];
          if (addedNode.nodeType === Node.TEXT_NODE) {
            var cleanedText = cleanFrontendText(addedNode.nodeValue);
            if (cleanedText !== addedNode.nodeValue) {
              addedNode.nodeValue = cleanedText;
            }
          } else if (addedNode.nodeType === Node.ELEMENT_NODE) {
            cleanVisibleText(addedNode);
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.setTimeout(configureRelatedDateInputs, 0);
});
