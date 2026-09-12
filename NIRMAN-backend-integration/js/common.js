var nirmanCsrfToken = "";

function setNirmanCsrfToken(token) {
  nirmanCsrfToken = token || "";
}

function nirmanFetch(url, options) {
  var requestOptions = options || {};
  var method = String(requestOptions.method || "GET").toUpperCase();

  if (method !== "GET" && method !== "HEAD" && nirmanCsrfToken) {
    var headers = new Headers(requestOptions.headers || {});
    headers.set("X-CSRF-Token", nirmanCsrfToken);
    requestOptions.headers = headers;
  }

  return fetch(url, requestOptions).then(function (response) {
    if (method !== "GET" && method !== "HEAD" && response.ok) {
      window.setTimeout(function () {
        var module = document.body.getAttribute("data-admin-page") ||
          document.body.getAttribute("data-employee-page") ||
          document.body.getAttribute("data-client-page") ||
          document.body.getAttribute("data-contractor-page");
        nirmanLoadModuleInsights("", module);
      }, 0);
    }
    return response;
  });
}

function nirmanProfileImageUrl(path) {
  if (!path) return "";
  return document.body.hasAttribute("data-public-page") ? path : "../../" + path.replace(/^\/+/, "");
}

function nirmanApplyProfilePhoto(selector, path, initials) {
  var elements = document.querySelectorAll(selector);
  for (var index = 0; index < elements.length; index += 1) {
    var element = elements[index];
    element.textContent = initials || "--";
    if (!path) continue;
    var image = document.createElement("img");
    image.className = "profile-photo-image";
    image.alt = "";
    image.src = nirmanProfileImageUrl(path);
    image.addEventListener("error", function () {
      var parent = this.parentNode;
      if (parent) parent.textContent = initials || "--";
    });
    element.textContent = "";
    element.appendChild(image);
  }
}

function nirmanMountPhotoUpload(container, initials) {
  if (!container || container.querySelector("[data-profile-photo-form]")) return;
  var form = document.createElement("form");
  form.className = "profile-photo-form";
  form.setAttribute("data-profile-photo-form", "");
  form.innerHTML = '<label class="btn btn-outline-navy btn-sm" for="profilePhotoUpload">Choose photo</label>' +
    '<input class="visually-hidden" id="profilePhotoUpload" name="profilePhoto" type="file" accept="image/jpeg,image/png,image/webp" required>' +
    '<button class="btn btn-nirman btn-sm" type="submit">Upload</button>' +
    '<span class="form-help">JPG, PNG or WebP, max 2 MB</span>';
  container.appendChild(form);
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var input = form.querySelector("input[type=file]");
    if (!input.files.length) {
      showPageAlert("Choose a profile photo first.", "warning");
      return;
    }
    var body = new FormData();
    body.append("profilePhoto", input.files[0]);
    nirmanFetch("../../backend/actions/profile/upload_photo.php", { method: "POST", body: body })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok) throw new Error(data.message || "Upload failed.");
          return data;
        });
      })
      .then(function (data) {
        nirmanApplyProfilePhoto(".user-avatar, .profile-avatar, [data-profile-avatar]", data.profilePhoto, initials);
        input.value = "";
        showPageAlert(data.message, "success");
      })
      .catch(function (error) { showPageAlert(error.message, "danger"); });
  });
}

function nirmanInsightItems(rows) {
  var items = [];
  rows = Array.isArray(rows) ? rows : [];
  for (var index = 0; index < rows.length; index += 1) {
    items.push({
      label: rows[index].label || rows[index].LABEL || rows[index].STATUS || "Unspecified",
      count: Number(rows[index].count || rows[index].RECORD_COUNT) || 0
    });
  }
  return items;
}

function nirmanInsightCard(title, sourceRows) {
  var items = nirmanInsightItems(sourceRows);
  var colors = ["#173e38", "#d16a43", "#d7a84b", "#52796f", "#6d7d8b", "#9b6a6c"];
  var total = 0;
  var stops = [];
  var legend = "";
  for (var index = 0; index < items.length; index += 1) total += items[index].count;
  var angle = 0;
  for (index = 0; index < items.length; index += 1) {
    var end = total ? angle + (items[index].count / total) * 360 : angle;
    stops.push(colors[index % colors.length] + " " + angle + "deg " + end + "deg");
    var width = total ? Math.round((items[index].count / total) * 100) : 0;
    legend += '<li><span class="insight-swatch" style="background:' + colors[index % colors.length] + '"></span>' +
      '<span>' + escapeHtml(items[index].label) + '</span><strong>' + escapeHtml(items[index].count) + '</strong>' +
      '<span class="insight-mini-track"><span style="width:' + width + '%;background:' + colors[index % colors.length] + '"></span></span></li>';
    angle = end;
  }
  var background = stops.length ? "conic-gradient(" + stops.join(",") + ")" : "#e5e9e5";
  return '<article class="insight-card"><div class="insight-card-heading"><div><span class="section-kicker">Live Oracle summary</span><h2>' +
    escapeHtml(title) + '</h2></div><strong class="insight-total">' + escapeHtml(total) + '</strong></div><div class="insight-visual"><div class="donut-chart" style="background:' +
    background + '"><span><strong>' + escapeHtml(total) + '</strong><small>records</small></span></div><ul class="insight-legend">' +
    (legend || '<li class="text-muted-custom">No records in this scope.</li>') + "</ul></div></article>";
}

function nirmanModuleInsightPanel(title, sourceRows) {
  var items = nirmanInsightItems(sourceRows);
  var total = 0;
  var cards = "";
  for (var index = 0; index < items.length; index += 1) total += items[index].count;
  cards += '<article class="module-stat-card module-stat-total"><span>Scoped records</span><strong>' +
    escapeHtml(total) + '</strong><small>Live Oracle total</small></article>';
  for (index = 0; index < items.length; index += 1) {
    var share = total ? Math.round((items[index].count / total) * 100) : 0;
    cards += '<article class="module-stat-card"><span>' + escapeHtml(items[index].label) + '</span><strong>' +
      escapeHtml(items[index].count) + '</strong><small>' + escapeHtml(share) + '% of this scope</small></article>';
  }
  return '<div class="module-stat-strip">' + cards + '</div>' + nirmanInsightCard(title, items);
}

function nirmanMetricItems(rows) {
  var items = [];
  rows = Array.isArray(rows) ? rows : [];
  for (var index = 0; index < rows.length; index += 1) {
    var value = Number(rows[index].value !== undefined ? rows[index].value : rows[index].METRIC_VALUE);
    if (!isFinite(value)) continue;
    items.push({
      label: rows[index].label || rows[index].LABEL || "Unspecified",
      value: value
    });
  }
  return items;
}

function nirmanMetricValue(value, unit) {
  if (unit === "currency") return formatCurrency(value);
  if (unit === "percent") return Math.round(value) + "%";
  return String(Math.round(value * 100) / 100);
}

function nirmanBarChart(title, sourceRows, unit) {
  var items = nirmanMetricItems(sourceRows);
  var maximum = 0;
  var rows = "";
  for (var index = 0; index < items.length; index += 1) maximum = Math.max(maximum, items[index].value);
  for (index = 0; index < items.length; index += 1) {
    var width = maximum ? Math.max(3, Math.round((items[index].value / maximum) * 100)) : 0;
    rows += '<div class="metric-bar-row"><div class="metric-bar-label"><span title="' + escapeHtml(items[index].label) + '">' +
      escapeHtml(items[index].label) + '</span><strong>' + escapeHtml(nirmanMetricValue(items[index].value, unit)) +
      '</strong></div><div class="metric-bar-track"><span style="width:' + width + '%"></span></div></div>';
  }
  return '<article class="insight-card metric-chart-card"><div class="insight-card-heading"><div><span class="section-kicker">Oracle comparison</span><h2>' +
    escapeHtml(title) + '</h2></div></div><div class="metric-bar-chart">' +
    (rows || '<p class="text-muted-custom mb-0">No records in this scope.</p>') + '</div></article>';
}

function nirmanLineChart(title, sourceRows, unit) {
  var items = nirmanMetricItems(sourceRows);
  if (!items.length) return "";
  var width = 640;
  var height = 220;
  var paddingX = 34;
  var paddingY = 26;
  var plotWidth = width - paddingX * 2;
  var plotHeight = height - paddingY * 2;
  var maximum = 0;
  var points = [];
  var circles = "";
  var grid = "";
  for (var index = 0; index < items.length; index += 1) maximum = Math.max(maximum, items[index].value);
  maximum = maximum || 1;
  for (var gridIndex = 0; gridIndex <= 4; gridIndex += 1) {
    var gridY = paddingY + (plotHeight / 4) * gridIndex;
    grid += '<line x1="' + paddingX + '" y1="' + gridY + '" x2="' + (width - paddingX) + '" y2="' + gridY + '"></line>';
  }
  for (index = 0; index < items.length; index += 1) {
    var x = items.length === 1 ? width / 2 : paddingX + (plotWidth / (items.length - 1)) * index;
    var y = paddingY + plotHeight - (items[index].value / maximum) * plotHeight;
    points.push(x + "," + y);
    circles += '<circle cx="' + x + '" cy="' + y + '" r="5"><title>' + escapeHtml(items[index].label + ": " +
      nirmanMetricValue(items[index].value, unit)) + '</title></circle>';
  }
  var firstLabel = items[0].label;
  var lastLabel = items[items.length - 1].label;
  return '<article class="insight-card metric-chart-card"><div class="insight-card-heading"><div><span class="section-kicker">Recorded over time</span><h2>' +
    escapeHtml(title) + '</h2></div><strong class="chart-peak">Peak ' + escapeHtml(nirmanMetricValue(maximum, unit)) +
    '</strong></div><div class="metric-line-chart"><svg viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' +
    escapeHtml(title) + '"><g class="line-chart-grid">' + grid + '</g><polyline points="' + points.join(" ") +
    '"></polyline>' + circles + '</svg><div class="line-chart-axis"><span>' + escapeHtml(firstLabel) + '</span><span>' +
    escapeHtml(lastLabel) + '</span></div></div></article>';
}

function nirmanProgressVisual(value, label) {
  if (value === null || value === undefined || value === "" || !isFinite(Number(value))) {
    return '<span class="progress-not-recorded">No progress update recorded</span>';
  }
  var progress = Math.max(0, Math.min(100, Number(value)));
  return '<div class="entity-progress"><div><span>' + escapeHtml(label || "Recorded progress") + '</span><strong>' +
    escapeHtml(Math.round(progress) + "%") + '</strong></div><div class="progress-track" role="progressbar" aria-valuenow="' +
    escapeHtml(progress) + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + progress + '%"></span></div></div>';
}

function nirmanEntityCard(options) {
  options = options || {};
  var metrics = Array.isArray(options.metrics) ? options.metrics : [];
  var metricHtml = "";
  for (var index = 0; index < metrics.length && index < 3; index += 1) {
    metricHtml += '<div><dt>' + escapeHtml(metrics[index][0]) + '</dt><dd title="' + escapeHtml(metrics[index][1]) + '">' +
      escapeHtml(metrics[index][1]) + '</dd></div>';
  }
  var headingHtml = '<h3>' + escapeHtml(options.title || options.id || "Record") + '</h3>';
  if (options.photo !== undefined || options.initials) {
    var photoHtml = options.photo ? '<img data-entity-photo src="' + escapeHtml(nirmanProfileImageUrl(options.photo)) + '" alt="">' : "";
    headingHtml = '<div class="entity-person-heading"><span class="entity-person-avatar"><span>' +
      escapeHtml(options.initials || "--") + '</span>' + photoHtml + '</span><div>' + headingHtml +
      (options.personMeta ? '<small>' + escapeHtml(options.personMeta) + '</small>' : "") + '</div></div>';
  }
  var filterStatus = options.filterStatus || options.status || "";
  var summaryHtml = options.summary ? '<p>' + escapeHtml(options.summary) + '</p>' : "";
  var footerHtml = "";
  if (options.footer || options.actions) {
    footerHtml = '<div class="entity-card-footer">' + (options.footer ? '<span>' + escapeHtml(options.footer) + '</span>' : '<span></span>') +
      '<div class="d-flex gap-2 flex-wrap">' + (options.actions || "") + '</div></div>';
  }
  return '<article class="entity-card" data-filter-row data-status="' + escapeHtml(filterStatus) + '"' +
    (options.searchText ? ' data-search-text="' + escapeHtml(options.searchText) + '"' : "") +
    '><div class="entity-card-top"><span class="entity-id">' + escapeHtml(options.id || "Record") + '</span>' +
    (options.status ? createStatusBadge(options.status) : "") + '</div><div class="entity-card-body">' + headingHtml +
    summaryHtml +
    (metricHtml ? '<dl class="entity-metrics">' + metricHtml + '</dl>' : "") +
    (Object.prototype.hasOwnProperty.call(options, "progress") ? nirmanProgressVisual(options.progress, options.progressLabel) : "") +
    '</div>' + footerHtml + '</article>';
}

function nirmanMountEntitySpotlight(anchorId, sectionId, title, subtitle, cardsHtml, emptyMessage) {
  var anchor = document.getElementById(anchorId);
  if (!anchor) return;
  var tableSection = anchor.closest(".data-card");
  if (!tableSection) return;
  var tableWrapper = anchor.closest(".table-responsive");
  var registerDisclosure = tableWrapper ? tableWrapper.closest(".register-disclosure") : null;
  var insertionPoint = registerDisclosure || tableWrapper;
  var insertionParent = insertionPoint ? insertionPoint.parentNode : tableSection;
  var section = document.getElementById(sectionId);
  if (!section) {
    section = document.createElement("section");
    section.id = sectionId;
    section.className = "entity-workspace";
    if (insertionPoint && insertionParent) {
      insertionParent.insertBefore(section, insertionPoint);
    } else {
      tableSection.appendChild(section);
    }
  }
  var hasTabs = Boolean(tableSection.querySelector(":scope > .panel-tabs"));
  var workspaceHeading = "";
  if (hasTabs) {
    workspaceHeading = '<div class="entity-workspace-heading"><div><span class="section-kicker">Primary workspace</span><h2>' +
      escapeHtml(title) + '</h2><p>' + escapeHtml(subtitle) + '</p></div></div>';
  } else {
    var cardHeading = tableSection.querySelector(":scope > .data-card-header h2");
    var cardDescription = tableSection.querySelector(":scope > .data-card-header p");
    if (cardHeading) cardHeading.textContent = title;
    if (cardDescription) cardDescription.textContent = subtitle;
  }
  section.innerHTML = workspaceHeading + '<div class="entity-card-grid">' +
    (cardsHtml || '<div class="entity-empty-state"><div class="empty-state"><span class="empty-state-mark">--</span><h3>No records</h3><p>' +
      escapeHtml(emptyMessage || "No records are available in this scope.") + '</p></div></div>') +
    '</div><p class="entity-filter-empty" hidden>No records match the current filters.</p>';
  var images = section.querySelectorAll("[data-entity-photo]");
  for (var index = 0; index < images.length; index += 1) {
    images[index].addEventListener("error", function () { this.remove(); });
  }
  var filterGroup = section.parentNode ? section.parentNode.querySelector(".filter-bar") : null;
  if (filterGroup) nirmanApplyEntityFilter(filterGroup);
}

function nirmanRenderDashboardInsights(series) {
  var holder = document.getElementById("dashboardInsightGrid");
  if (holder) holder.remove();
}

function nirmanLoadModuleInsights(role, module) {
  var holder = document.getElementById("moduleInsightGrid");
  if (holder) holder.remove();
}

function nirmanRegisterLabel(table) {
  var explicitLabel = table.getAttribute("aria-label");
  if (explicitLabel) return explicitLabel;
  var card = table.closest(".data-card");
  var heading = card ? card.querySelector(".data-card-header h2") : null;
  return heading ? heading.textContent.trim() : "Detailed register";
}

function nirmanWrapRegister(wrapper) {
  if (!wrapper || wrapper.closest(".modal") || wrapper.closest(".register-disclosure")) return;
  var table = wrapper.querySelector("table");
  if (!table || table.hasAttribute("data-always-visible")) return;
  var details = document.createElement("details");
  details.className = "register-disclosure";
  details.innerHTML = '<summary><span><strong>Open full register</strong><small>' +
    escapeHtml(nirmanRegisterLabel(table)) + ' with exact stored fields</small></span><span class="disclosure-action">View</span></summary>';
  wrapper.parentNode.insertBefore(details, wrapper);
  details.appendChild(wrapper);
}

function nirmanInitializeRegisters() {
  var wrappers = document.querySelectorAll("#mainContent .table-responsive");
  for (var index = 0; index < wrappers.length; index += 1) nirmanWrapRegister(wrappers[index]);
}

function nirmanFilterGroupTarget(group) {
  return group.getAttribute("data-admin-table") || group.getAttribute("data-employee-table") ||
    group.getAttribute("data-client-table") || group.getAttribute("data-contractor-table") || "";
}

function nirmanApplyEntityFilter(group) {
  if (!group) return;
  var search = group.querySelector(".admin-search, .employee-search, .client-search, .contractor-search, [data-table-search]");
  var status = group.querySelector(".admin-status, .employee-status, .client-status, .contractor-status, [data-status-filter]");
  var query = search ? search.value.toLowerCase().trim() : "";
  var selectedStatus = status ? status.value.toLowerCase() : "all";
  var scope = group.closest(".tab-panel") || group.closest(".data-card") || document.getElementById("mainContent");
  var target = document.getElementById(nirmanFilterGroupTarget(group));
  var cards = target && target.classList.contains("entity-card-grid") ? target.querySelectorAll(".entity-card") :
    scope.querySelectorAll(".entity-workspace .entity-card");
  var visibleCount = 0;
  for (var index = 0; index < cards.length; index += 1) {
    var cardStatus = String(cards[index].getAttribute("data-status") || "").toLowerCase();
    var searchText = (cards[index].textContent + " " + (cards[index].getAttribute("data-search-text") || "")).toLowerCase();
    var isVisible = searchText.indexOf(query) >= 0 && (selectedStatus === "all" || cardStatus === selectedStatus);
    cards[index].hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  }
  var workspace = cards.length ? cards[0].closest(".entity-workspace") : null;
  var empty = workspace ? workspace.querySelector(".entity-filter-empty") : null;
  if (empty) empty.hidden = visibleCount !== 0;
}

function nirmanInitializeDetailDrawers() {
  var modals = document.querySelectorAll(".app-body .modal[id]");
  for (var index = 0; index < modals.length; index += 1) {
    if (/detail/i.test(modals[index].id)) modals[index].classList.add("detail-drawer-modal");
  }
}

function nirmanOpenDetailDrawer(title, html, footerHtml) {
  var modal = document.getElementById("nirmanDetailDrawer");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "nirmanDetailDrawer";
    modal.className = "modal fade detail-drawer-modal";
    modal.tabIndex = -1;
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-labelledby", "nirmanDetailDrawerTitle");
    modal.innerHTML = '<div class="modal-dialog"><div class="modal-content"><div class="modal-header">' +
      '<h2 class="modal-title" id="nirmanDetailDrawerTitle">Record details</h2>' +
      '<button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
      '<div class="modal-body" id="nirmanDetailDrawerBody"></div><div class="modal-footer" id="nirmanDetailDrawerFooter"></div></div></div>';
    document.body.appendChild(modal);
  }
  var titleElement = document.getElementById("nirmanDetailDrawerTitle");
  var body = document.getElementById("nirmanDetailDrawerBody");
  var footer = document.getElementById("nirmanDetailDrawerFooter");
  if (titleElement) titleElement.textContent = title || "Record details";
  if (body) body.innerHTML = html || "";
  if (footer) {
    footer.innerHTML = footerHtml || '<button class="btn btn-outline-navy" type="button" data-bs-dismiss="modal">Close</button>';
  }
  if (window.bootstrap && window.bootstrap.Modal) window.bootstrap.Modal.getOrCreateInstance(modal).show();
}

function nirmanMoveFormCardToModal(formId, modalId, title, actionLabel) {
  var form = document.getElementById(formId);
  if (!form || document.getElementById(modalId)) return;
  var sourceColumn = form.closest('[class*="col-"]');
  var sourceRow = sourceColumn ? sourceColumn.parentNode : null;
  var modal = document.createElement("div");
  modal.className = "modal fade";
  modal.id = modalId;
  modal.tabIndex = -1;
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("aria-label", title);
  modal.innerHTML = '<div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header">' +
    '<div><span class="section-kicker">New record</span><h2 class="modal-title">' + escapeHtml(title) + '</h2></div>' +
    '<button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
    '<div class="modal-body"></div></div></div>';
  modal.querySelector(".modal-body").appendChild(form);
  document.body.appendChild(modal);
  if (sourceColumn) sourceColumn.remove();
  if (sourceRow && sourceRow.children.length === 1) sourceRow.children[0].className = "col-12";

  var heading = document.querySelector("#mainContent > .page-heading");
  if (!heading) return;
  var action = document.createElement("button");
  action.className = "btn btn-nirman";
  action.type = "button";
  action.textContent = actionLabel;
  action.setAttribute("data-bs-toggle", "modal");
  action.setAttribute("data-bs-target", "#" + modalId);
  var existingAction = heading.querySelector(":scope > a, :scope > button, :scope > .page-heading-actions");
  var actions = existingAction && existingAction.classList.contains("page-heading-actions") ? existingAction : document.createElement("div");
  if (!actions.parentNode) {
    actions.className = "page-heading-actions";
    if (existingAction) actions.appendChild(existingAction);
    heading.appendChild(actions);
  }
  actions.insertBefore(action, actions.firstChild);
}

function nirmanCollapseCardToDisclosure(holderId, title, description) {
  var holder = document.getElementById(holderId);
  var card = holder ? holder.closest(".data-card") : null;
  if (!card || card.closest(".related-disclosure")) return;
  var details = document.createElement("details");
  details.className = "related-disclosure";
  details.innerHTML = '<summary><span><strong>' + escapeHtml(title) + '</strong><small>' +
    escapeHtml(description) + '</small></span><span class="disclosure-action">Open</span></summary>';
  var body = card.querySelector(".data-card-body");
  details.appendChild(body);
  card.parentNode.replaceChild(details, card);
}

function nirmanShowAccessDenied() {
  var main = document.getElementById("mainContent");
  if (!main) return;
  main.innerHTML = '<section class="access-denied-card"><span class="access-denied-mark">403</span><div><span class="section-kicker">Access boundary</span><h1>Access denied</h1><p>Your department and designation are not authorized for this module. Use the available navigation to continue.</p><a class="btn btn-navy" href="dashboard.html">Return to dashboard</a></div></section>';
}

function signOutOfNirman() {
  var authPath = document.body.hasAttribute("data-admin-page") ||
      document.body.hasAttribute("data-employee-page") ||
      document.body.hasAttribute("data-client-page") ||
      document.body.hasAttribute("data-contractor-page")
    ? "../../backend/api/auth/"
    : "backend/api/auth/";
  var homePath = authPath.indexOf("../../") === 0 ? "../../index.html" : "index.html";

  function submitLogout() {
    return nirmanFetch(authPath + "logout.php", { method: "POST" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Logout failed");
        }
        window.location.href = homePath;
      });
  }

  if (nirmanCsrfToken) {
    submitLogout().catch(function () {
      window.location.href = homePath;
    });
    return;
  }

  fetch(authPath + "get_current_user.php")
    .then(function (response) { return response.json(); })
    .then(function (result) {
      setNirmanCsrfToken(result.csrfToken);
      return submitLogout();
    })
    .catch(function () {
      window.location.href = homePath;
    });
}

function initializePublicSessionNavigation() {
  if (!document.body.hasAttribute("data-public-page")) {
    return;
  }

  var guestItems = document.querySelectorAll("[data-public-guest]");
  var sessionItems = document.querySelectorAll("[data-public-session]");

  fetch("backend/api/auth/get_current_user.php")
    .then(function (response) { return response.json(); })
    .then(function (result) {
      var loggedIn = Boolean(result.loggedIn);
      for (var guestIndex = 0; guestIndex < guestItems.length; guestIndex += 1) {
        guestItems[guestIndex].hidden = loggedIn;
      }
      for (var sessionIndex = 0; sessionIndex < sessionItems.length; sessionIndex += 1) {
        sessionItems[sessionIndex].hidden = !loggedIn;
      }
      if (!loggedIn) {
        return;
      }

      setNirmanCsrfToken(result.csrfToken);
      var dashboardLinks = document.querySelectorAll("[data-public-dashboard]");
      var dashboardPath = "pages/" + result.role + "/dashboard.html";
      for (var dashboardIndex = 0; dashboardIndex < dashboardLinks.length; dashboardIndex += 1) {
        dashboardLinks[dashboardIndex].href = dashboardPath;
      }
      var names = document.querySelectorAll("[data-public-name]");
      for (var nameIndex = 0; nameIndex < names.length; nameIndex += 1) {
        names[nameIndex].textContent = result.firstName;
      }
    })
    .catch(function () {
      for (var guestIndex = 0; guestIndex < guestItems.length; guestIndex += 1) {
        guestItems[guestIndex].hidden = false;
      }
    });
}

function findRecord(list, propertyName, value) {
  for (var index = 0; index < list.length; index += 1) {
    if (String(list[index][propertyName]) === String(value)) {
      return list[index];
    }
  }
  return null;
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
    if (sidebarToggle) {
      sidebarToggle.setAttribute("aria-expanded", "false");
    }
  }

  if (sidebarToggle && sidebar) {
    sidebarToggle.setAttribute("aria-controls", "appSidebar");
    sidebarToggle.setAttribute("aria-expanded", "false");
    sidebarToggle.addEventListener("click", function () {
      var isOpen = sidebar.classList.toggle("open");
      if (sidebarBackdrop) {
        sidebarBackdrop.classList.toggle("show", isOpen);
      }
      sidebarToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener("click", closeSidebar);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeSidebar();
    }
  });

  var sidebarLinks = document.querySelectorAll(".sidebar-nav a");
  for (var linkIndex = 0; linkIndex < sidebarLinks.length; linkIndex += 1) {
    sidebarLinks[linkIndex].addEventListener("click", closeSidebar);
  }

  document.addEventListener("click", function (event) {
    var logoutLink = event.target.closest("[data-logout], .sidebar-footer a");
    if (!logoutLink || logoutLink.textContent.toLowerCase().indexOf("sign out") < 0) {
      return;
    }
    event.preventDefault();
    signOutOfNirman();
  });

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

  document.addEventListener("input", function (event) {
    var group = event.target.closest(".filter-bar");
    if (group) nirmanApplyEntityFilter(group);
  });

  document.addEventListener("change", function (event) {
    var group = event.target.closest(".filter-bar");
    if (group) nirmanApplyEntityFilter(group);
  });

  var yearElements = document.querySelectorAll("[data-current-year]");
  for (var yearIndex = 0; yearIndex < yearElements.length; yearIndex += 1) {
    yearElements[yearIndex].textContent = new Date().getFullYear();
  }

  initializeSimpleTabs();
  nirmanInitializeRegisters();
  nirmanInitializeDetailDrawers();
  initializePublicSessionNavigation();
});
