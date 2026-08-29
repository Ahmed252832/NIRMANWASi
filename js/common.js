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


var NIRMAN_SESSION_KEY = "nirmanCurrentUser";

function getNirmanSession() {
  try {
    var rawSession = window.sessionStorage.getItem(NIRMAN_SESSION_KEY);
    return rawSession ? JSON.parse(rawSession) : null;
  } catch (error) {
    return null;
  }
}

function clearNirmanSession() {
  try {
    window.sessionStorage.removeItem(NIRMAN_SESSION_KEY);
  } catch (error) {
    // Session storage may be unavailable in restrictive browser modes.
  }
}

function getNirmanRoleForPerson(personId) {
  if (findRecord(nirmanData.employees, "personId", personId)) {
    return "employee";
  }
  if (findRecord(nirmanData.clients, "personId", personId)) {
    return "client";
  }
  if (findRecord(nirmanData.contractorReps, "personId", personId)) {
    return "contractor";
  }
  return "";
}

function saveNirmanSession(person, role) {
  if (!person || !role) {
    clearNirmanSession();
    return;
  }

  var roleId = "";
  if (role === "client") {
    var client = findRecord(nirmanData.clients, "personId", person.personId);
    roleId = client ? client.clientId : "";
  } else if (role === "employee" || role === "admin") {
    var employee = findRecord(nirmanData.employees, "personId", person.personId);
    roleId = employee ? employee.employeeId : "";
  } else if (role === "contractor") {
    var representative = findRecord(nirmanData.contractorReps, "personId", person.personId);
    roleId = representative ? representative.repId : "";
  }

  try {
    window.sessionStorage.setItem(NIRMAN_SESSION_KEY, JSON.stringify({
      personId: String(person.personId),
      role: role,
      roleId: String(roleId)
    }));
  } catch (error) {
    // Login still works even if browser storage is unavailable.
  }
}

function findNirmanPersonByEmail(email) {
  var normalizedEmail = String(email || "").toLowerCase().trim();
  for (var index = 0; index < nirmanData.people.length; index += 1) {
    if (String(nirmanData.people[index].email).toLowerCase() === normalizedEmail) {
      return nirmanData.people[index];
    }
  }
  return null;
}

function initializeNirmanLoginSession() {
  var loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function () {
      var selectedRole = loginForm.querySelector('input[name="loginRole"]:checked');
      var emailInput = document.getElementById("loginEmail");
      var passwordInput = document.getElementById("loginPassword");
      var person = emailInput ? findNirmanPersonByEmail(emailInput.value) : null;
      var requestedRole = selectedRole ? selectedRole.value : "";

      clearNirmanSession();
      if (!person || !passwordInput || person.password !== passwordInput.value) {
        return;
      }

      var actualRole = getNirmanRoleForPerson(person.personId);
      if (actualRole !== requestedRole) {
        return;
      }

      if (actualRole === "contractor") {
        var representative = findRecord(nirmanData.contractorReps, "personId", person.personId);
        if (!representative || representative.approvalStatus !== "Approved") {
          return;
        }
      }

      saveNirmanSession(person, actualRole);
    }, true);
  }

  var adminLoginForm = document.getElementById("adminLoginForm");
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", function () {
      var emailInput = document.getElementById("adminEmail");
      var passwordInput = document.getElementById("adminPassword");
      var person = emailInput ? findNirmanPersonByEmail(emailInput.value) : null;

      clearNirmanSession();
      if (!person || !passwordInput || person.password !== passwordInput.value) {
        return;
      }

      var employee = findRecord(nirmanData.employees, "personId", person.personId);
      if (!employee || employee.designation !== "System Administrator") {
        return;
      }

      saveNirmanSession(person, "admin");
    }, true);
  }
}

function applyNirmanSessionToCurrentRole() {
  if (typeof nirmanData === "undefined") {
    return;
  }

  var session = getNirmanSession();
  if (!session || !session.personId) {
    return;
  }

  if (session.role === "client") {
    var client = findRecord(nirmanData.clients, "personId", session.personId);
    if (client) {
      window.currentClientId = client.clientId;
    }
  } else if (session.role === "employee") {
    var employee = findRecord(nirmanData.employees, "personId", session.personId);
    if (employee) {
      window.currentEmployeeId = employee.employeeId;
    }
  } else if (session.role === "contractor") {
    var representative = findRecord(nirmanData.contractorReps, "personId", session.personId);
    if (representative) {
      window.currentRepresentativeId = representative.repId;
    }
  }
}

function renderNirmanSessionIdentity() {
  if (typeof nirmanData === "undefined") {
    return;
  }

  var session = getNirmanSession();
  if (!session || !session.personId) {
    return;
  }

  var person = findRecord(nirmanData.people, "personId", session.personId);
  if (!person) {
    return;
  }

  var fullName = person.firstName + " " + person.lastName;
  var initials = String(person.firstName).charAt(0).toUpperCase() +
    String(person.lastName).charAt(0).toUpperCase();

  function setAll(selector, value) {
    var elements = document.querySelectorAll(selector);
    for (var index = 0; index < elements.length; index += 1) {
      elements[index].textContent = value;
    }
  }

  if (session.role === "client") {
    var client = findRecord(nirmanData.clients, "personId", session.personId);
    setAll("[data-client-name]", fullName);
    setAll("[data-client-initials]", initials);
    if (client) {
      setAll("[data-client-id]", client.clientId);
    }
    if (document.body.getAttribute("data-client-page") === "dashboard") {
      var clientHeading = document.querySelector(".page-heading h1");
      if (clientHeading) {
        clientHeading.textContent = "Welcome, " + person.firstName;
      }
    }
  } else if (session.role === "employee") {
    var employee = findRecord(nirmanData.employees, "personId", session.personId);
    setAll("[data-employee-name]", fullName);
    setAll("[data-employee-initials]", initials);
    if (employee) {
      setAll("[data-employee-role]", employee.designation || employee.deptName || "Employee");
    }
  } else if (session.role === "contractor") {
    var representative = findRecord(nirmanData.contractorReps, "personId", session.personId);
    setAll("[data-current-rep-name]", fullName);
    setAll("[data-current-rep-initials]", initials);
    if (representative) {
      setAll("[data-current-rep-title]", representative.title || "Representative");
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
    links[index].addEventListener("click", clearNirmanSession);
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


/* --------------------------------------------------------------------------
   Backend adapter
   --------------------------------------------------------------------------
   The existing UI keeps using `nirmanData`, but when a backend is available
   this adapter hydrates `nirmanData` from the API before the role pages use
   their cached data on the next load.

   API selection:
   1. window.NIRMAN_API_BASE_URL
   2. ?api=https://your-backend.example/api (saved for this browser)
   3. localStorage["nirmanApiBaseUrl"]
   4. Same-origin /api when the app is not running on github.io

   GitHub Pages therefore stays in demo mode until an API URL is configured.
--------------------------------------------------------------------------- */

var NIRMAN_API_BASE_KEY = "nirmanApiBaseUrl";
var NIRMAN_API_TOKEN_KEY = "nirmanApiToken";
var NIRMAN_API_DATA_KEY = "nirmanApiData";
var NIRMAN_API_DATA_VERSION_KEY = "nirmanApiDataVersion";

var NIRMAN_DATA_COLLECTIONS = [
  "people",
  "employees",
  "departments",
  "departmentPhones",
  "workRelations",
  "clients",
  "clientContacts",
  "contractors",
  "contractorReps",
  "supervisions",
  "tenders",
  "tenderBids",
  "tenderAwards",
  "areas",
  "projects",
  "units",
  "bookings",
  "allocationConfirmations",
  "payments",
  "installments",
  "complaints",
  "projectUpdates"
];

function nirmanSafeStorageGet(storage, key) {
  try {
    return storage.getItem(key) || "";
  } catch (error) {
    return "";
  }
}

function nirmanSafeStorageSet(storage, key, value) {
  try {
    storage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
}

function nirmanSafeStorageRemove(storage, key) {
  try {
    storage.removeItem(key);
  } catch (error) {
    // Ignore storage restrictions.
  }
}

function normalizeNirmanApiBaseUrl(value) {
  var normalized = String(value || "").trim();
  while (normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

function persistNirmanApiBaseFromQuery() {
  try {
    var queryValue = new URLSearchParams(window.location.search).get("api");
    if (queryValue) {
      var normalized = normalizeNirmanApiBaseUrl(queryValue);
      if (/^https?:\/\//i.test(normalized)) {
        nirmanSafeStorageSet(window.localStorage, NIRMAN_API_BASE_KEY, normalized);
        return normalized;
      }
    }
  } catch (error) {
    // URLSearchParams or storage may be unavailable in very old/restricted browsers.
  }
  return "";
}

function getNirmanApiBaseUrl() {
  var queryBase = persistNirmanApiBaseFromQuery();
  if (queryBase) {
    return queryBase;
  }

  var explicitBase = normalizeNirmanApiBaseUrl(window.NIRMAN_API_BASE_URL);
  if (explicitBase) {
    return explicitBase;
  }

  var storedBase = normalizeNirmanApiBaseUrl(
    nirmanSafeStorageGet(window.localStorage, NIRMAN_API_BASE_KEY)
  );
  if (storedBase) {
    return storedBase;
  }

  var locationObject = window.location;
  if (
    locationObject &&
    /^https?:$/.test(locationObject.protocol) &&
    !/(^|\.)github\.io$/i.test(locationObject.hostname)
  ) {
    return normalizeNirmanApiBaseUrl(locationObject.origin + "/api");
  }

  return "";
}

function setNirmanApiBaseUrl(value) {
  var normalized = normalizeNirmanApiBaseUrl(value);
  if (normalized) {
    nirmanSafeStorageSet(window.localStorage, NIRMAN_API_BASE_KEY, normalized);
  } else {
    nirmanSafeStorageRemove(window.localStorage, NIRMAN_API_BASE_KEY);
  }
  return normalized;
}

function isNirmanBackendEnabled() {
  return Boolean(getNirmanApiBaseUrl());
}

function getNirmanApiToken() {
  return nirmanSafeStorageGet(window.sessionStorage, NIRMAN_API_TOKEN_KEY);
}

function setNirmanApiToken(token) {
  if (token) {
    nirmanSafeStorageSet(window.sessionStorage, NIRMAN_API_TOKEN_KEY, String(token));
  } else {
    nirmanSafeStorageRemove(window.sessionStorage, NIRMAN_API_TOKEN_KEY);
  }
}

function clearNirmanApiCache() {
  nirmanSafeStorageRemove(window.sessionStorage, NIRMAN_API_DATA_KEY);
  nirmanSafeStorageRemove(window.sessionStorage, NIRMAN_API_DATA_VERSION_KEY);
}

function clearNirmanSession() {
  nirmanSafeStorageRemove(window.sessionStorage, NIRMAN_SESSION_KEY);
  nirmanSafeStorageRemove(window.sessionStorage, NIRMAN_API_TOKEN_KEY);
  clearNirmanApiCache();
}

function nirmanApiErrorMessage(payload, fallback) {
  if (payload && typeof payload === "object") {
    return payload.message || payload.error || payload.detail || fallback;
  }
  return fallback;
}

function nirmanApiRequest(path, options) {
  var baseUrl = getNirmanApiBaseUrl();
  if (!baseUrl) {
    return Promise.reject(new Error("Backend API is not configured."));
  }

  var requestOptions = options || {};
  var headers = Object.assign(
    { "Accept": "application/json" },
    requestOptions.headers || {}
  );
  var token = getNirmanApiToken();

  if (token && !headers.Authorization) {
    headers.Authorization = "Bearer " + token;
  }

  if (
    requestOptions.body &&
    typeof requestOptions.body === "object" &&
    !(requestOptions.body instanceof FormData)
  ) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  requestOptions.headers = headers;
  requestOptions.credentials = requestOptions.credentials || "include";

  return window.fetch(baseUrl + path, requestOptions).then(function (response) {
    var contentType = response.headers.get("content-type") || "";
    var parseBody = response.status === 204
      ? Promise.resolve(null)
      : (contentType.indexOf("application/json") >= 0
          ? response.json()
          : response.text().then(function (text) {
              return text ? { message: text } : null;
            }));

    return parseBody.then(function (payload) {
      if (!response.ok) {
        var error = new Error(
          nirmanApiErrorMessage(payload, "Request failed with status " + response.status + ".")
        );
        error.status = response.status;
        error.payload = payload;
        throw error;
      }
      return payload;
    });
  });
}

function extractNirmanDataSnapshot(payload) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  var candidate = payload.nirmanData ||
    payload.data ||
    payload.snapshot ||
    payload.bootstrap ||
    payload;

  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  var hasKnownCollection = false;
  for (var index = 0; index < NIRMAN_DATA_COLLECTIONS.length; index += 1) {
    if (Array.isArray(candidate[NIRMAN_DATA_COLLECTIONS[index]])) {
      hasKnownCollection = true;
      break;
    }
  }

  return hasKnownCollection ? candidate : null;
}

function normalizeNirmanDataSnapshot(snapshot) {
  var normalized = {};
  for (var index = 0; index < NIRMAN_DATA_COLLECTIONS.length; index += 1) {
    var key = NIRMAN_DATA_COLLECTIONS[index];
    normalized[key] = snapshot && Array.isArray(snapshot[key]) ? snapshot[key] : [];
  }
  return normalized;
}

function applyNirmanDataSnapshot(snapshot) {
  if (!snapshot) {
    return false;
  }

  var normalized = normalizeNirmanDataSnapshot(snapshot);
  window.nirmanData = normalized;

  try {
    nirmanData = normalized;
  } catch (error) {
    // `window.nirmanData` is enough for classic scripts in normal browsers.
  }

  return true;
}

function cacheNirmanDataSnapshot(snapshot, version) {
  if (!snapshot) {
    return false;
  }

  var normalized = normalizeNirmanDataSnapshot(snapshot);
  var serialized = JSON.stringify(normalized);
  var previous = nirmanSafeStorageGet(window.sessionStorage, NIRMAN_API_DATA_KEY);

  nirmanSafeStorageSet(window.sessionStorage, NIRMAN_API_DATA_KEY, serialized);
  if (version !== undefined && version !== null) {
    nirmanSafeStorageSet(
      window.sessionStorage,
      NIRMAN_API_DATA_VERSION_KEY,
      String(version)
    );
  }

  return serialized !== previous;
}

function hydrateNirmanDataFromBackendCache() {
  var raw = nirmanSafeStorageGet(window.sessionStorage, NIRMAN_API_DATA_KEY);
  if (!raw) {
    return false;
  }

  try {
    var snapshot = JSON.parse(raw);
    return applyNirmanDataSnapshot(snapshot);
  } catch (error) {
    clearNirmanApiCache();
    return false;
  }
}

function extractNirmanApiUser(payload, requestedRole) {
  var user = payload && (
    payload.user ||
    payload.currentUser ||
    payload.session ||
    payload.account
  );

  if (!user || typeof user !== "object") {
    user = payload || {};
  }

  var role = String(user.role || payload.role || requestedRole || "").toLowerCase();
  var personId = user.personId || user.person_id || payload.personId || payload.person_id || "";
  var roleId = user.roleId || user.role_id || payload.roleId || payload.role_id || "";

  if (!roleId) {
    if (role === "client") {
      roleId = user.clientId || user.client_id || payload.clientId || payload.client_id || "";
    } else if (role === "employee" || role === "admin") {
      roleId = user.employeeId || user.employee_id || payload.employeeId || payload.employee_id || "";
    } else if (role === "contractor") {
      roleId = user.repId || user.rep_id || user.representativeId ||
        user.representative_id || payload.repId || payload.rep_id || "";
    }
  }

  return {
    personId: String(personId || ""),
    role: role,
    roleId: String(roleId || "")
  };
}

function saveNirmanApiSession(apiUser) {
  if (!apiUser || !apiUser.personId || !apiUser.role) {
    throw new Error("Backend login response is missing personId or role.");
  }

  nirmanSafeStorageSet(
    window.sessionStorage,
    NIRMAN_SESSION_KEY,
    JSON.stringify({
      personId: apiUser.personId,
      role: apiUser.role,
      roleId: apiUser.roleId || ""
    })
  );
}

function showNirmanAuthFeedback(elementId, message, type) {
  if (typeof window.showAuthFeedback === "function") {
    window.showAuthFeedback(elementId, message, type);
    return;
  }

  var holder = document.getElementById(elementId);
  if (holder) {
    holder.innerHTML =
      '<div class="alert alert-' + escapeHtml(type || "danger") +
      ' py-2" role="alert">' + escapeHtml(message) + "</div>";
  }
}

function setNirmanLoginBusy(form, busy) {
  var submit = form ? form.querySelector('[type="submit"]') : null;
  if (!submit) {
    return;
  }

  if (!submit.dataset.originalText) {
    submit.dataset.originalText = submit.textContent;
  }
  submit.disabled = Boolean(busy);
  submit.textContent = busy ? "Signing in..." : submit.dataset.originalText;
}

function handleNirmanBackendLogin(event, form, isAdmin) {
  if (!isNirmanBackendEnabled()) {
    return false;
  }

  event.preventDefault();
  event.stopImmediatePropagation();

  var emailInput = document.getElementById(isAdmin ? "adminEmail" : "loginEmail");
  var passwordInput = document.getElementById(isAdmin ? "adminPassword" : "loginPassword");
  var selectedRole = isAdmin ? null : form.querySelector('input[name="loginRole"]:checked');
  var role = isAdmin ? "admin" : (selectedRole ? selectedRole.value : "");
  var feedbackId = isAdmin ? "adminFeedback" : "loginFeedback";

  if (!emailInput || !passwordInput || !role) {
    showNirmanAuthFeedback(feedbackId, "Complete the login form.", "warning");
    return true;
  }

  clearNirmanSession();
  setNirmanLoginBusy(form, true);

  nirmanApiRequest("/auth/login", {
    method: "POST",
    body: {
      email: emailInput.value.trim(),
      password: passwordInput.value,
      role: role
    }
  }).then(function (payload) {
    var apiUser = extractNirmanApiUser(payload || {}, role);
    var responseRole = apiUser.role;

    if (isAdmin && responseRole === "employee") {
      responseRole = "admin";
      apiUser.role = "admin";
    }

    if (responseRole !== role) {
      throw new Error("This account does not match the selected role.");
    }

    var token = payload && (
      payload.token ||
      payload.accessToken ||
      payload.access_token ||
      (payload.auth && payload.auth.token)
    );

    setNirmanApiToken(token || "");
    saveNirmanApiSession(apiUser);

    var snapshot = extractNirmanDataSnapshot(payload);
    if (snapshot) {
      cacheNirmanDataSnapshot(
        snapshot,
        payload.version || payload.updatedAt || payload.updated_at || ""
      );
    }

    showNirmanAuthFeedback(feedbackId, "Login successful.", "success");

    var destination = isAdmin
      ? "pages/admin/dashboard.html"
      : "pages/" + role + "/dashboard.html";

    window.setTimeout(function () {
      window.location.href = destination;
    }, 200);
  }).catch(function (error) {
    clearNirmanSession();
    showNirmanAuthFeedback(
      feedbackId,
      error && error.message ? error.message : "Could not sign in.",
      "danger"
    );
    setNirmanLoginBusy(form, false);
  });

  return true;
}

function initializeNirmanDemoLoginSession() {
  var loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function () {
      var selectedRole = loginForm.querySelector('input[name="loginRole"]:checked');
      var emailInput = document.getElementById("loginEmail");
      var passwordInput = document.getElementById("loginPassword");
      var person = emailInput ? findNirmanPersonByEmail(emailInput.value) : null;
      var requestedRole = selectedRole ? selectedRole.value : "";

      clearNirmanSession();
      if (!person || !passwordInput || person.password !== passwordInput.value) {
        return;
      }

      var actualRole = getNirmanRoleForPerson(person.personId);
      if (actualRole !== requestedRole) {
        return;
      }

      if (actualRole === "contractor") {
        var representative = findRecord(nirmanData.contractorReps, "personId", person.personId);
        if (!representative || representative.approvalStatus !== "Approved") {
          return;
        }
      }

      saveNirmanSession(person, actualRole);
    }, true);
  }

  var adminLoginForm = document.getElementById("adminLoginForm");
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", function () {
      var emailInput = document.getElementById("adminEmail");
      var passwordInput = document.getElementById("adminPassword");
      var person = emailInput ? findNirmanPersonByEmail(emailInput.value) : null;

      clearNirmanSession();
      if (!person || !passwordInput || person.password !== passwordInput.value) {
        return;
      }

      var employee = findRecord(nirmanData.employees, "personId", person.personId);
      if (!employee || employee.designation !== "System Administrator") {
        return;
      }

      saveNirmanSession(person, "admin");
    }, true);
  }
}

function initializeNirmanLoginSession() {
  if (!isNirmanBackendEnabled()) {
    initializeNirmanDemoLoginSession();
    return;
  }

  var loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      handleNirmanBackendLogin(event, loginForm, false);
    }, true);
  }

  var adminLoginForm = document.getElementById("adminLoginForm");
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", function (event) {
      handleNirmanBackendLogin(event, adminLoginForm, true);
    }, true);
  }
}

function applyNirmanSessionToCurrentRole() {
  if (typeof nirmanData === "undefined") {
    return;
  }

  var session = getNirmanSession();
  if (!session || !session.personId) {
    return;
  }

  if (session.role === "client") {
    var client = findRecord(nirmanData.clients, "personId", session.personId);
    window.currentClientId = session.roleId || (client ? client.clientId : window.currentClientId);
  } else if (session.role === "employee") {
    var employee = findRecord(nirmanData.employees, "personId", session.personId);
    window.currentEmployeeId = session.roleId || (employee ? employee.employeeId : window.currentEmployeeId);
  } else if (session.role === "contractor") {
    var representative = findRecord(nirmanData.contractorReps, "personId", session.personId);
    window.currentRepresentativeId = session.roleId ||
      (representative ? representative.repId : window.currentRepresentativeId);
  }
}

function getNirmanLoginPageForCurrentScreen() {
  return document.body && document.body.hasAttribute("data-admin-page")
    ? "../../admin-login.html"
    : "../../login.html";
}

function redirectNirmanToLogin() {
  clearNirmanSession();
  window.location.href = getNirmanLoginPageForCurrentScreen();
}

function refreshNirmanDataFromBackend() {
  if (!isNirmanBackendEnabled()) {
    return Promise.resolve(false);
  }

  var session = getNirmanSession();
  var isRolePage = document.body && (
    document.body.hasAttribute("data-client-page") ||
    document.body.hasAttribute("data-employee-page") ||
    document.body.hasAttribute("data-contractor-page") ||
    document.body.hasAttribute("data-admin-page")
  );

  if (!session || !isRolePage) {
    return Promise.resolve(false);
  }

  return nirmanApiRequest("/bootstrap", { method: "GET" })
    .then(function (payload) {
      var snapshot = extractNirmanDataSnapshot(payload);
      if (!snapshot) {
        throw new Error("Backend /bootstrap response does not contain NIRMAN data.");
      }

      var changed = cacheNirmanDataSnapshot(
        snapshot,
        payload && (payload.version || payload.updatedAt || payload.updated_at)
      );

      if (changed) {
        window.location.reload();
        return true;
      }

      return false;
    })
    .catch(function (error) {
      if (error && (error.status === 401 || error.status === 403)) {
        redirectNirmanToLogin();
        return false;
      }

      if (window.console && console.warn) {
        console.warn("NIRMAN backend sync failed; keeping the last cached/demo data.", error);
      }
      return false;
    });
}

function initializeNirmanBackendSync() {
  if (!isNirmanBackendEnabled()) {
    return;
  }

  refreshNirmanDataFromBackend();
}

function logoutNirmanBackend() {
  if (!isNirmanBackendEnabled()) {
    clearNirmanSession();
    return Promise.resolve();
  }

  return nirmanApiRequest("/auth/logout", { method: "POST" })
    .catch(function () {
      // Local logout must still complete if the backend is unreachable.
    })
    .then(function () {
      clearNirmanSession();
    });
}

window.NirmanAPI = {
  getBaseUrl: getNirmanApiBaseUrl,
  setBaseUrl: setNirmanApiBaseUrl,
  isEnabled: isNirmanBackendEnabled,
  request: nirmanApiRequest,
  get: function (path) {
    return nirmanApiRequest(path, { method: "GET" });
  },
  post: function (path, body) {
    return nirmanApiRequest(path, { method: "POST", body: body });
  },
  put: function (path, body) {
    return nirmanApiRequest(path, { method: "PUT", body: body });
  },
  patch: function (path, body) {
    return nirmanApiRequest(path, { method: "PATCH", body: body });
  },
  remove: function (path) {
    return nirmanApiRequest(path, { method: "DELETE" });
  },
  refresh: refreshNirmanDataFromBackend,
  logout: logoutNirmanBackend,
  clearSession: clearNirmanSession
};

/*
  This executes immediately, while common.js is being parsed and before
  client.js / employee.js / contractor.js are executed. Therefore a cached
  backend snapshot is available synchronously to the existing role scripts.
*/
hydrateNirmanDataFromBackendCache();

document.addEventListener("DOMContentLoaded", function () {
  initializeNirmanLoginSession();
  initializeNirmanBackendSync();
  applyNirmanSessionToCurrentRole();
  renderNirmanSessionIdentity();
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

  window.setTimeout(function () {
    configureRelatedDateInputs();
    renderNirmanSessionIdentity();
  }, 0);
});
