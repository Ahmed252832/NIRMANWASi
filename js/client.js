
var currentClientId = null;
var currentClientName = "";
var clientBookingsCache = [];
var clientPaymentsCache = [];
var clientInstallmentsCache = [];
var clientComplaintsCache = [];
var clientProjectsCache = [];
var clientAvailableUnitsCache = [];

function clientSetText(elementId, value) {
  var element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

function clientFetchJson(url, options) {
  return nirmanFetch(url, options).then(function (response) {
    return response.json().then(function (data) {
      if (!response.ok) {
        throw new Error(data && data.message ? data.message : "The request could not be completed.");
      }
      return data;
    });
  });
}

function clientEmployeeName(employeeId, firstName, lastName) {
  var name = ((firstName || "") + " " + (lastName || "")).trim();
  if (name) {
    return name;
  }
  return employeeId ? "Employee " + employeeId : "Not assigned";
}

function clientGetBooking(bookingId) {
  return findRecord(clientBookingsCache, "bookingId", bookingId);
}

function clientFindPayment(paymentId) {
  return findRecord(clientPaymentsCache, "paymentId", paymentId);
}

function clientFindComplaint(complaintId) {
  return findRecord(clientComplaintsCache, "complaintId", complaintId);
}

function clientGetPaymentInstallments(paymentId) {
  var installments = [];
  for (var index = 0; index < clientInstallmentsCache.length; index += 1) {
    if (String(clientInstallmentsCache[index].paymentId) === String(paymentId)) {
      installments.push(clientInstallmentsCache[index]);
    }
  }
  return installments;
}

function clientFetchBookings() {
  return clientFetchJson("../../backend/api/client/get_my_bookings.php").then(function (rows) {
    if (!Array.isArray(rows)) {
      throw new Error("The booking response was invalid.");
    }
    clientBookingsCache = rows.map(function (booking) {
      return {
        bookingId: booking.BOOKING_ID,
        clientId: booking.CL_ID,
        unitId: booking.UNIT_ID,
        projectId: booking.PROJECT_ID,
        bookingStatus: booking.BOOKING_STATUS,
        bookingDate: booking.BOOKING_DATE,
        dueAmount: booking.DUE_AMOUNT,
        unitNo: booking.UNIT_NO,
        unitType: booking.UNIT_TYPE,
        projectName: booking.PROJECT_NAME,
        allocationStatus: booking.ALLOCATION_STATUS,
        confirmedByEmployeeId: booking.CONFIRMED_BY_EMP_ID,
        confirmerName: clientEmployeeName(
          booking.CONFIRMED_BY_EMP_ID,
          booking.CONFIRMER_FIRST_NAME,
          booking.CONFIRMER_LAST_NAME
        )
      };
    });
    return clientBookingsCache;
  });
}

function clientFetchPayments() {
  return clientFetchJson("../../backend/api/client/get_my_payments.php").then(function (result) {
    if (!result || !Array.isArray(result.payments) || !Array.isArray(result.installments)) {
      throw new Error("The payment response was invalid.");
    }
    clientPaymentsCache = result.payments.map(function (payment) {
      return {
        clientId: payment.CL_ID,
        paymentId: payment.PAYMENT_ID,
        bookingId: payment.BOOKING_ID,
        verifiedByEmployeeId: payment.VERIFIED_BY_EMP_ID,
        paymentStatus: payment.PAYMENT_STATUS,
        verifiedAt: payment.VERIFIED_AT || "",
        paymentMethod: payment.PAYMENT_METHOD,
        amount: payment.AMOUNT,
        paymentDue: payment.PAYMENT_DUE,
        verifierName: clientEmployeeName(
          payment.VERIFIED_BY_EMP_ID,
          payment.VERIFIER_FIRST_NAME,
          payment.VERIFIER_LAST_NAME
        )
      };
    });
    clientInstallmentsCache = result.installments.map(function (installment) {
      return {
        clientId: installment.CL_ID,
        paymentId: installment.PAYMENT_ID,
        installmentId: installment.INSTALLMENT_ID,
        amount: installment.AMOUNT,
        dueDate: installment.DUE_DATE,
        status: installment.STATUS,
        expiredAt: installment.EXPIRED_AT || ""
      };
    });
    return result;
  });
}

function clientFetchComplaints() {
  return clientFetchJson("../../backend/api/client/get_my_complaints.php").then(function (rows) {
    if (!Array.isArray(rows)) {
      throw new Error("The complaint response was invalid.");
    }
    clientComplaintsCache = rows.map(function (complaint) {
      return {
        complaintId: complaint.COMPLAINT_ID,
        clientId: complaint.CL_ID,
        resolvedByEmployeeId: complaint.RESOLVED_BY_EMP_ID,
        status: complaint.STATUS,
        filedDate: complaint.FILED_DATE,
        note: complaint.NOTE,
        resolution: complaint.RESOLUTION,
        employeeName: clientEmployeeName(
          complaint.RESOLVED_BY_EMP_ID,
          complaint.EMPLOYEE_FIRST_NAME,
          complaint.EMPLOYEE_LAST_NAME
        )
      };
    });
    return clientComplaintsCache;
  });
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

function clientIsValidDate(value) {
  return Boolean(value && !Number.isNaN(new Date(value + "T00:00:00").getTime()));
}

function clientGetQueryValue(name) {
  return new URLSearchParams(window.location.search).get(name) || "";
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
  clientFetchJson("../../backend/api/client/get_dashboard_summary.php")
    .then(function (data) {
      var counts = data.counts || {};
      var bookings = Array.isArray(data.recentBookings) ? data.recentBookings : [];
      var payments = Array.isArray(data.recentPayments) ? data.recentPayments : [];
      var installments = Array.isArray(data.upcomingInstallments) ? data.upcomingInstallments : [];
      var complaints = Array.isArray(data.recentComplaints) ? data.recentComplaints : [];
      var bookingCount = Number(counts.bookings) || 0;
      var confirmedCount = Number(counts.confirmedAllocations) || 0;
      var pendingPaymentCount = Number(counts.pendingPayments) || 0;
      var openComplaintCount = Number(counts.openComplaints) || 0;
      var installmentCount = Number(counts.installments) || 0;
      var index;

      clientSetText("dashboardBookingCount", bookingCount);
      clientSetText("dashboardPaymentCount", Number(counts.payments) || 0);
      clientSetText("dashboardInstallmentCount", installmentCount);
      clientSetText("dashboardComplaintCount", openComplaintCount);
      clientSetText("dashboardAllocationNote", confirmedCount + " confirmed, " +
        Math.max(0, bookingCount - confirmedCount) + " awaiting confirmation");
      clientSetText("dashboardPaymentNote", pendingPaymentCount + " awaiting Employee verification");
      clientSetText("dashboardInstallmentNote", installmentCount ? "Across your recorded payments" : "No installment schedule");

      var bookingHolder = document.getElementById("dashboardBookingSummary");
      if (bookingHolder) {
        var bookingHtml = '<div class="activity-list">';
        for (index = 0; index < bookings.length; index += 1) {
          var booking = bookings[index];
          bookingHtml += '<div class="activity-item"><span class="activity-marker">BK</span><div><h3>' +
            escapeHtml("Booking " + booking.BOOKING_ID + " - " + booking.UNIT_NO) + " " +
            createStatusBadge(booking.BOOKING_STATUS) + '</h3><p>' + escapeHtml(booking.PROJECT_NAME + " · " +
              formatCurrency(booking.DUE_AMOUNT) + " · " + formatDate(booking.BOOKING_DATE)) + " · " +
            createStatusBadge(booking.ALLOCATION_STATUS) + "</p></div></div>";
        }
        bookingHtml += "</div>";
        bookingHolder.innerHTML = bookings.length ? bookingHtml :
          clientEmptyState("BK", "No bookings yet", "Browse available Units to begin a Booking.");
      }

      var actionHolder = document.getElementById("dashboardNextActions");
      if (actionHolder) {
        var pendingAllocationCount = Math.max(0, bookingCount - confirmedCount);
        var actions = [];
        if (!bookingCount) {
          actions.push(["UN", "Browse available units", (Number(counts.availableUnits) || 0) + " unit(s) are available.", "../../properties.html"]);
        }
        if (pendingAllocationCount) {
          actions.push(["AL", "Check allocation status", pendingAllocationCount + " booking(s) await confirmation.", "bookings.html#allocationStatus"]);
        }
        if (pendingPaymentCount) {
          actions.push(["PY", "Review payments", pendingPaymentCount + " payment(s) await verification.", "payments.html"]);
        }
        if (openComplaintCount) {
          actions.push(["CP", "Review support requests", openComplaintCount + " complaint(s) await resolution.", "complaints.html"]);
        }
        if (!actions.length) {
          actions.push(["OK", "Account up to date", "No immediate account action is required.", ""]);
        }
        var actionHtml = "";
        for (index = 0; index < actions.length; index += 1) {
          var actionTitle = escapeHtml(actions[index][1]);
          if (actions[index][3]) {
            actionTitle = '<a href="' + escapeHtml(actions[index][3]) + '">' + actionTitle + "</a>";
          }
          actionHtml += '<li class="activity-item"><span class="activity-marker">' + escapeHtml(actions[index][0]) +
            "</span><div><h3>" + actionTitle + "</h3><p>" + escapeHtml(actions[index][2]) + "</p></div></li>";
        }
        actionHolder.innerHTML = actionHtml;
      }

      var financeHolder = document.getElementById("dashboardFinanceSummary");
      if (financeHolder) {
        var financeHtml = '<div class="info-callout mb-3">Verified payment total: <strong>' +
          escapeHtml(formatCurrency(data.verifiedPaymentTotal)) + '</strong></div><div class="activity-list">';
        for (index = 0; index < payments.length; index += 1) {
          financeHtml += '<div class="activity-item"><span class="activity-marker">PY</span><div><h3>' +
            escapeHtml("Payment " + payments[index].PAYMENT_ID) + " " + createStatusBadge(payments[index].PAYMENT_STATUS) +
            '</h3><p>' + escapeHtml(payments[index].BOOKING_ID + " · " + formatCurrency(payments[index].AMOUNT) +
              " · due " + formatDate(payments[index].PAYMENT_DUE)) + "</p></div></div>";
        }
        for (index = 0; index < installments.length; index += 1) {
          financeHtml += '<div class="activity-item"><span class="activity-marker">IN</span><div><h3>' +
            escapeHtml("Installment " + installments[index].INSTALLMENT_ID) + " " + createStatusBadge(installments[index].STATUS) +
            '</h3><p>' + escapeHtml(installments[index].PAYMENT_ID + " · " + formatCurrency(installments[index].AMOUNT) +
              " · due " + formatDate(installments[index].DUE_DATE)) + "</p></div></div>";
        }
        financeHtml += "</div>";
        financeHolder.innerHTML = payments.length || installments.length ? financeHtml :
          clientEmptyState("PY", "No finance records", "Payments and installment schedules appear here.");
      }

      var complaintHolder = document.getElementById("dashboardComplaintSummary");
      if (complaintHolder) {
        var complaintHtml = '<div class="activity-list">';
        for (index = 0; index < complaints.length; index += 1) {
          complaintHtml += '<div class="activity-item"><span class="activity-marker">CP</span><div><h3>' +
            escapeHtml(complaints[index].COMPLAINT_ID) + " " + createStatusBadge(complaints[index].STATUS) +
            '</h3><p>' + escapeHtml(complaints[index].NOTE) + " · " + escapeHtml(formatDate(complaints[index].FILED_DATE)) +
            "</p></div></div>";
        }
        complaintHtml += "</div>";
        complaintHolder.innerHTML = complaints.length ? complaintHtml :
          clientEmptyState("CP", "No complaints filed", "Your support requests will appear here.");
      }
    })
    .catch(function (error) {
      console.error("Client dashboard load failed:", error);
      showPageAlert("Could not load your dashboard summary.", "danger");
    });
}

function clientRenderProfile() {
  clientFetchJson("../../backend/api/client/get_client_profile.php")
    .then(function (result) {
      if (!result.found) {
        showPageAlert("The Client profile could not be found.", "danger");
        return;
      }
      var c = result.client;
      var fullName = c.FIRST_NAME + " " + c.LAST_NAME;
      var initials = (c.FIRST_NAME.charAt(0) + c.LAST_NAME.charAt(0)).toUpperCase();
      var header = document.getElementById("profileHeader");
      if (header) {
        header.innerHTML = '<span class="profile-avatar">' + escapeHtml(initials) +
          "</span><div><h2>" + escapeHtml(fullName) + "</h2><p>Client account</p></div>";
      }
      var personDetails = document.getElementById("profilePersonDetails");
      if (personDetails) {
        personDetails.innerHTML = clientDetailItem("First name", c.FIRST_NAME) + clientDetailItem("Last name", c.LAST_NAME) +
          clientDetailItem("Primary contact", c.CONTACT_NO) + clientDetailItem("Email", c.EMAIL);
      }
      var clientDetails = document.getElementById("profileClientDetails");
      if (clientDetails) {
        clientDetails.innerHTML = clientDetailItem("NID", c.NID);
      }
      var contactHolder = document.getElementById("profileContacts");
      if (contactHolder) {
        var html = '<ul class="detail-list">';
        for (var index = 0; index < result.contacts.length; index += 1) {
          html += clientDetailItem("Client contact " + (index + 1), result.contacts[index]);
        }
        html += "</ul>";
        contactHolder.innerHTML = result.contacts.length ? html : clientEmptyState("CN", "No Client contacts", "No multivalued contact numbers are recorded.");
      }
    })
    .catch(function (error) {
      console.error("Client profile load failed:", error);
      showPageAlert(error.message || "The Client profile could not be loaded.", "danger");
    });
}

function clientPopulateBookingChoices(preselectedUnitId) {
  var projectSelect = document.getElementById("bookingProject");
  var unitSelect = document.getElementById("bookingUnit");
  return Promise.all([
    clientFetchJson("../../backend/api/public/get_projects_list.php"),
    clientFetchJson("../../backend/api/public/get_available_units.php")
  ]).then(function (results) {
    if (!Array.isArray(results[0]) || !Array.isArray(results[1])) {
      throw new Error("The booking choices response was invalid.");
    }
    clientProjectsCache = results[0];
    clientAvailableUnitsCache = results[1];

    if (projectSelect) {
      var projectHtml = '<option value="">Choose an existing Project</option>';
      for (var projectIndex = 0; projectIndex < clientProjectsCache.length; projectIndex += 1) {
        projectHtml += '<option value="' + escapeHtml(clientProjectsCache[projectIndex].PROJECT_ID) + '">' +
          escapeHtml(clientProjectsCache[projectIndex].PROJECT_ID + " · " + clientProjectsCache[projectIndex].PROJECT_NAME) + "</option>";
      }
      projectSelect.innerHTML = projectHtml;
    }

    if (unitSelect) {
      var unitHtml = '<option value="">Choose an available Unit</option>';
      for (var unitIndex = 0; unitIndex < clientAvailableUnitsCache.length; unitIndex += 1) {
        unitHtml += '<option value="' + escapeHtml(clientAvailableUnitsCache[unitIndex].UNIT_ID) + '">' +
          escapeHtml(clientAvailableUnitsCache[unitIndex].UNIT_ID + " · " + clientAvailableUnitsCache[unitIndex].UNIT_NO +
            " · " + clientAvailableUnitsCache[unitIndex].UNIT_TYPE) + "</option>";
      }
      unitSelect.innerHTML = unitHtml;
      unitSelect.disabled = clientAvailableUnitsCache.length === 0;
      clientSetText("bookingUnitHelp", clientAvailableUnitsCache.length ?
        clientAvailableUnitsCache.length + " available unit(s)." : "No unit currently available.");
      if (preselectedUnitId) {
        unitSelect.value = preselectedUnitId;
      }
    }
  });
}

function clientRenderBookings() {
  var bookings = clientBookingsCache;
  var body = document.getElementById("bookingTableBody");
  var allocationHolder = document.getElementById("allocationStatusList");
  var html = "";
  var allocationHtml = '<div class="activity-list">';
  for (var index = 0; index < bookings.length; index += 1) {
    var booking = bookings[index];
    var allocationStatus = booking.allocationStatus || "Pending confirmation";
    html += '<tr data-status="' + escapeHtml(booking.bookingStatus) + '"><td><span class="table-primary-text">' +
      escapeHtml("Booking " + booking.bookingId) + '</span><span class="table-secondary-text">' + escapeHtml(formatDate(booking.bookingDate)) +
      "</span></td><td>" + escapeHtml(booking.projectName || "Project unavailable") + "</td><td>" +
      escapeHtml(booking.unitNo ? booking.unitNo + " - " + booking.unitType : "Unit unavailable") + "</td><td>" +
      escapeHtml(formatCurrency(booking.dueAmount)) + "</td><td>" + createStatusBadge(booking.bookingStatus) +
      '</td><td><button class="mini-action" type="button" data-client-booking="' + escapeHtml(booking.bookingId) +
      '">Details</button></td></tr>';
    allocationHtml += '<div class="activity-item"><span class="activity-marker">AL</span><div><h3>' +
      escapeHtml("Booking " + booking.bookingId + " · " + (booking.unitNo || "Unit unavailable")) + " " +
      createStatusBadge(allocationStatus) + "</h3><p>" +
      escapeHtml(booking.confirmedByEmployeeId ? "Confirmed by " + booking.confirmerName :
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
  if (!booking) {
    showPageAlert("The selected Booking could not be found.", "danger");
    return;
  }
  clientSetText("bookingDetailTitle", "Booking " + booking.bookingId);
  var body = document.getElementById("bookingDetailBody");
  if (body) {
    body.innerHTML = '<ul class="detail-list">' + clientDetailItem("Booking ID", booking.bookingId) +
      clientDetailItem("Client", currentClientName) +
      clientDetailItem("Project", booking.projectName || "Project unavailable") +
      clientDetailItem("Reserved unit", booking.unitNo ? booking.unitNo + " - " + booking.unitType : "Unit unavailable") +
      clientDetailItem("Booking date", formatDate(booking.bookingDate)) + clientDetailItem("Due amount", formatCurrency(booking.dueAmount)) +
      clientDetailHtmlItem("Booking status", createStatusBadge(booking.bookingStatus)) +
      clientDetailHtmlItem("Allocation", createStatusBadge(booking.allocationStatus || "Pending confirmation")) +
      clientDetailItem("Confirming employee", booking.confirmedByEmployeeId ? booking.confirmerName : "Not yet confirmed") +
      "</ul>";
  }
  clientShowModal("bookingDetailModal");
}

function clientSubmitBooking(event) {
  event.preventDefault();
  var form = event.currentTarget;
  var projectId = document.getElementById("bookingProject").value;
  var unitId = document.getElementById("bookingUnit").value;
  var bookingDate = document.getElementById("bookingDate").value;
  var dueAmount = document.getElementById("bookingDueAmount").value;

  if (!projectId || !unitId || !clientIsValidDate(bookingDate) || !dueAmount || Number(dueAmount) <= 0) {
    showPageAlert("Please fill in all booking fields with valid values.", "danger");
    return;
  }

  var formData = new FormData();
  formData.append("projectId", projectId);
  formData.append("unitId", unitId);
  formData.append("bookingDate", bookingDate);
  formData.append("dueAmount", dueAmount);

  var mutationSucceeded = false;
  clientFetchJson("../../backend/actions/client/book_unit.php", { method: "POST", body: formData })
    .then(function (result) {
      mutationSucceeded = true;
      form.reset();
      document.getElementById("bookingDate").value = clientGetToday();
      return Promise.all([clientFetchBookings(), clientPopulateBookingChoices("")]).then(function () {
        clientRenderBookings();
        showPageAlert(result.message, "success");
      });
    })
    .catch(function (error) {
      showPageAlert(mutationSucceeded ? "Booking created, but the updated records could not be loaded." :
        (error.message || "The booking could not be created."), "danger");
      console.error(error);
    });
}

function clientInitializeBookings() {
  var preselectedUnit = clientGetQueryValue("unit");
  clientPopulateBookingChoices(preselectedUnit).catch(function (error) {
    console.error("Booking choices load failed:", error);
    showPageAlert(error.message || "Could not load booking choices.", "danger");
  });
  clientFetchBookings()
    .then(clientRenderBookings)
    .catch(function (error) {
      console.error("Booking list load failed:", error);
      showPageAlert(error.message || "Could not load your bookings.", "danger");
    });
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
    return Promise.resolve();
  }
  return clientFetchBookings()
    .then(function () {
      var html = '<option value="">Choose one of my Bookings</option>';
      for (var i = 0; i < clientBookingsCache.length; i += 1) {
        html += '<option value="' + escapeHtml(clientBookingsCache[i].bookingId) + '">' +
          escapeHtml(clientBookingsCache[i].bookingId + " · " + clientBookingsCache[i].unitNo + " · due " +
            formatCurrency(clientBookingsCache[i].dueAmount)) + "</option>";
      }
      select.innerHTML = html;
      select.disabled = clientBookingsCache.length === 0;
    });
}

function clientRenderPayments() {
  var payments = clientPaymentsCache;
  var installments = clientInstallmentsCache;
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
      escapeHtml(payment.verifiedAt ? payment.verifierName + " · " + clientFormatDateTime(payment.verifiedAt) :
        "Assigned to " + payment.verifierName) +
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
    showPageAlert("The selected Payment could not be found.", "danger");
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
      clientDetailItem("Assigned verifier", payment.verifierName + " (" + payment.verifiedByEmployeeId + ")") +
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
  var bookingId = document.getElementById("paymentBooking").value;
  var method = document.getElementById("paymentMethod").value;
  var amount = document.getElementById("paymentAmount").value;
  var paymentDue = document.getElementById("paymentDue").value;

  if (!bookingId || !method || !amount || Number(amount) <= 0 || !clientIsValidDate(paymentDue)) {
    showPageAlert("Please fill in all payment fields with valid values.", "danger");
    return;
  }

  var formData = new FormData();
  formData.append("bookingId", bookingId);
  formData.append("method", method);
  formData.append("amount", amount);
  formData.append("paymentDue", paymentDue);

  var mutationSucceeded = false;
  clientFetchJson("../../backend/actions/client/make_payment.php", { method: "POST", body: formData })
    .then(function (result) {
      mutationSucceeded = true;
      form.reset();
      clientHideModal("makePaymentModal");
      return clientFetchPayments().then(function () {
        clientRenderPayments();
        clientApplyTableFilter("paymentTable");
        clientApplyTableFilter("installmentTable");
        showPageAlert(result.message, "success");
      });
    })
    .catch(function (error) {
      showPageAlert(mutationSucceeded ? "Payment submitted, but the updated records could not be loaded." :
        (error.message || "The payment could not be submitted."), "danger");
      console.error(error);
    });
}

function clientInitializePayments() {
  clientInitializeTableFilters();
  clientPopulatePaymentBookings().catch(function (error) {
    console.error("Payment booking choices load failed:", error);
    showPageAlert(error.message || "Could not load your bookings.", "danger");
  });
  clientFetchPayments()
    .then(function () {
      clientRenderPayments();
      clientApplyTableFilter("paymentTable");
      clientApplyTableFilter("installmentTable");
    })
    .catch(function (error) {
      console.error("Payment list load failed:", error);
      showPageAlert(error.message || "Could not load your finance records.", "danger");
    });
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
  var complaints = clientComplaintsCache;
  var body = document.getElementById("complaintTableBody");
  var pendingCount = 0;
  var resolvedCount = 0;
  var html = "";
  for (var index = 0; index < complaints.length; index += 1) {
    var complaint = complaints[index];
    if (complaint.status === "Resolved") {
      resolvedCount += 1;
    } else {
      pendingCount += 1;
    }
    html += '<tr data-status="' + escapeHtml(complaint.status) + '"><td><span class="table-primary-text">' +
      escapeHtml(complaint.complaintId) + "</span></td><td>" + escapeHtml(formatDate(complaint.filedDate)) +
      "</td><td>" + escapeHtml(complaint.note) + "</td><td>" + escapeHtml(complaint.employeeName) +
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
  var complaint = clientFindComplaint(complaintId);
  if (!complaint) {
    showPageAlert("The selected Complaint could not be found.", "danger");
    return;
  }
  clientSetText("complaintDetailTitle", "Complaint " + complaint.complaintId);
  var body = document.getElementById("complaintDetailBody");
  if (body) {
    body.innerHTML = '<ul class="detail-list">' + clientDetailItem("Complaint ID", complaint.complaintId) +
      clientDetailItem("Client", currentClientName + " (" + complaint.clientId + ")") +
      clientDetailItem("Filed date", formatDate(complaint.filedDate)) + clientDetailItem("Complaint note", complaint.note) +
      clientDetailItem("Assigned Employee", complaint.employeeName + " (" + complaint.resolvedByEmployeeId + ")") +
      clientDetailHtmlItem("Status", createStatusBadge(complaint.status)) +
      clientDetailItem("Resolution", complaint.resolution || "Not yet resolved") + "</ul>";
  }
  clientShowModal("complaintDetailModal");
}

function clientSubmitComplaint(event) {
  event.preventDefault();
  var form = event.currentTarget;
  var filedDate = document.getElementById("complaintDate").value;
  var note = document.getElementById("complaintNote").value.trim();

  if (!clientIsValidDate(filedDate) || note.length < 10 || note.length > 500) {
    showPageAlert("Enter a valid filed date and a note between 10 and 500 characters.", "danger");
    return;
  }

  var formData = new FormData();
  formData.append("filedDate", filedDate);
  formData.append("note", note);

  var mutationSucceeded = false;
  clientFetchJson("../../backend/actions/client/file_complaint.php", { method: "POST", body: formData })
    .then(function (result) {
      mutationSucceeded = true;
      form.reset();
      document.getElementById("complaintDate").value = clientGetToday();
      return clientFetchComplaints().then(function () {
        clientRenderComplaints();
        clientApplyTableFilter("complaintTable");
        showPageAlert(result.message, "success");
      });
    })
    .catch(function (error) {
      showPageAlert(mutationSucceeded ? "Complaint submitted, but the updated records could not be loaded." :
        (error.message || "The complaint could not be submitted."), "danger");
      console.error(error);
    });
}

function clientInitializeComplaints() {
  clientInitializeTableFilters();
  clientFetchComplaints()
    .then(function () {
      clientRenderComplaints();
      clientApplyTableFilter("complaintTable");
    })
    .catch(function (error) {
      console.error("Complaint list load failed:", error);
      showPageAlert(error.message || "Could not load your complaints.", "danger");
    });
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
  if (!page) {
    return;
  }
  clientFetchJson("../../backend/api/auth/get_current_user.php")
    .then(function (result) {
      if (!result.loggedIn || result.role !== "client") {
        window.location.href = "../../login.html";
        return;
      }
      currentClientId = result.roleId;
      setNirmanCsrfToken(result.csrfToken);
      var fullName = result.firstName + " " + result.lastName;
      currentClientName = fullName;
      var initials = (result.firstName.charAt(0) + result.lastName.charAt(0)).toUpperCase();
      var nameElements = document.querySelectorAll("[data-client-name]");
      var idElements = document.querySelectorAll("[data-client-id]");
      var initialElements = document.querySelectorAll("[data-client-initials]");
      var i;
      for (i = 0; i < nameElements.length; i += 1) nameElements[i].textContent = fullName;
      for (i = 0; i < idElements.length; i += 1) idElements[i].textContent = "Client account";
      for (i = 0; i < initialElements.length; i += 1) initialElements[i].textContent = initials;
      clientSetText("dashboardWelcome", "Welcome, " + result.firstName);

      if (page === "dashboard") {
        clientRenderDashboard();
      } else if (page === "profile") {
        clientRenderProfile();
      } else if (page === "bookings") {
        clientInitializeBookings();
      } else if (page === "payments") {
        clientInitializePayments();
      } else if (page === "complaints") {
        clientInitializeComplaints();
      }
    })
    .catch(function () {
      window.location.href = "../../login.html";
    });
});
