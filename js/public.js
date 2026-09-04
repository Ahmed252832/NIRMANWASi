var publicProjects = [];
var publicUnits = [];

function publicFetchJson(url) {
  return fetch(url).then(function (response) {
    return response.json().then(function (data) {
      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }
      return data;
    });
  });
}

function publicEmptyState(mark, title, message) {
  return '<div class="col-12"><div class="empty-state architectural-panel">' +
    '<div class="empty-state-mark" aria-hidden="true">' + escapeHtml(mark) + "</div>" +
    "<h3>" + escapeHtml(title) + "</h3><p>" + escapeHtml(message) + "</p></div></div>";
}

function publicErrorState(message) {
  return publicEmptyState("!", "Data unavailable", message);
}

function publicProjectStatus(project) {
  var deadline = new Date(project.DEADLINE + "T23:59:59");
  return deadline < new Date() && project.STATUS !== "Completed" ? "Overdue" : project.STATUS;
}

function publicProgress(value) {
  var progress = Number(value);
  if (!Number.isFinite(progress)) {
    return 0;
  }
  return Math.max(0, Math.min(100, progress));
}

function publicProjectCard(project, compact) {
  var progress = publicProgress(project.CURRENT_PROGRESS !== undefined ? project.CURRENT_PROGRESS : project.PROGRESS);
  var location = project.ROAD_SECTOR || "Area details unavailable";
  var lastUpdate = project.LAST_UPDATE_DATE ? "Updated " + formatDate(project.LAST_UPDATE_DATE) : "No progress update recorded";
  return '<div class="' + (compact ? "col-lg-4" : "col-md-6 col-xl-4") + '" data-project-card data-status="' +
      escapeHtml(project.STATUS) + '" data-search="' + escapeHtml((project.PROJECT_ID + " " + project.PROJECT_NAME + " " + location).toLowerCase()) + '">' +
    '<article class="project-card public-project-card">' +
      '<div class="project-card-top"><span class="project-number">Project register / ' + escapeHtml(project.PROJECT_ID) + "</span>" +
        '<span class="project-coordinate" aria-hidden="true">' + escapeHtml(project.AREA_ID || "NIRMAN") + "</span></div>" +
      '<div class="project-card-body"><div class="d-flex justify-content-between gap-3 align-items-start mb-4"><div>' +
        "<h3>" + escapeHtml(project.PROJECT_NAME) + '</h3><div class="meta-row"><span>' + escapeHtml(location) +
        "</span><span>Due " + escapeHtml(formatDate(project.DEADLINE)) + "</span></div></div>" +
        createStatusBadge(publicProjectStatus(project)) + "</div>" +
        '<div class="progress-meter mb-2"><div class="progress-meter-track"><div class="progress-meter-fill" style="width:' + progress +
        '%"></div></div><span class="progress-meter-value">' + escapeHtml(progress) + "%</span></div>" +
        '<p class="project-update-note mb-0">' + escapeHtml(lastUpdate) + "</p></div></article></div>";
}

function publicUnitCard(unit) {
  return '<div class="col-sm-6 col-xl-3" data-unit-card data-type="' + escapeHtml(unit.UNIT_TYPE) + '" data-search="' +
      escapeHtml((unit.UNIT_ID + " " + unit.UNIT_NO + " " + unit.UNIT_TYPE).toLowerCase()) + '">' +
    '<article class="unit-card public-unit-card"><div class="unit-card-plan survey-grid" aria-hidden="true"><span></span><span></span></div>' +
      '<div class="d-flex justify-content-between align-items-start gap-3"><div><span class="unit-code">' + escapeHtml(unit.UNIT_NO) + "</span>" +
      "<h3>" + escapeHtml(unit.UNIT_TYPE) + '</h3><p class="text-muted-custom small mb-0">Inventory reference ' +
      escapeHtml(unit.UNIT_ID) + "</p></div>" + createStatusBadge(unit.STATUS) + "</div></article></div>";
}

function renderPublicSummary() {
  var summaryTargets = document.querySelectorAll("[data-public-summary]");
  if (!summaryTargets.length) {
    return;
  }
  publicFetchJson("backend/api/public/get_summary.php")
    .then(function (summary) {
      var values = {
        projects: summary.projectCount,
        activeProjects: summary.activeProjectCount,
        availableUnits: summary.availableUnitCount,
        openTenders: summary.openTenderCount,
        contractors: summary.contractorCount
      };
      for (var index = 0; index < summaryTargets.length; index += 1) {
        var key = summaryTargets[index].getAttribute("data-public-summary");
        summaryTargets[index].textContent = values[key] === undefined ? "0" : values[key];
      }
    })
    .catch(function () {
      for (var index = 0; index < summaryTargets.length; index += 1) {
        summaryTargets[index].textContent = "N/A";
        summaryTargets[index].setAttribute("aria-label", "Data unavailable");
      }
    });
}

function renderPublicProjects() {
  var container = document.getElementById("publicProjects");
  var featured = document.getElementById("featuredProjects");
  if (!container && !featured) {
    return;
  }
  publicFetchJson("backend/api/public/get_project_catalogue.php")
    .then(function (projects) {
      publicProjects = projects;
      if (featured) {
        var featuredHtml = "";
        for (var featureIndex = 0; featureIndex < Math.min(projects.length, 3); featureIndex += 1) {
          featuredHtml += publicProjectCard(projects[featureIndex], true);
        }
        featured.innerHTML = featuredHtml || publicEmptyState("PR", "No projects recorded", "Published project records will appear here.");
        renderHeroProject(projects[0]);
      }
      if (container) {
        renderProjectCatalogue();
        initializeProjectFilters();
      }
    })
    .catch(function (error) {
      if (featured) {
        featured.innerHTML = publicErrorState("Project records could not be loaded.");
      }
      if (container) {
        container.innerHTML = publicErrorState("Project records could not be loaded.");
      }
      console.error(error);
    });
}

function renderHeroProject(project) {
  if (!project) {
    return;
  }
  var name = document.getElementById("heroProjectName");
  var status = document.getElementById("heroProjectStatus");
  var progress = document.getElementById("heroProjectProgress");
  if (name) name.textContent = project.PROJECT_NAME;
  if (status) status.textContent = publicProjectStatus(project);
  if (progress) progress.textContent = publicProgress(project.CURRENT_PROGRESS) + "%";
}

function renderProjectCatalogue() {
  var container = document.getElementById("publicProjects");
  var search = document.getElementById("projectCatalogueSearch");
  var status = document.getElementById("projectCatalogueStatus");
  var query = search ? search.value.toLowerCase().trim() : "";
  var selectedStatus = status ? status.value : "all";
  var html = "";
  var count = 0;
  for (var index = 0; index < publicProjects.length; index += 1) {
    var project = publicProjects[index];
    var haystack = (project.PROJECT_ID + " " + project.PROJECT_NAME + " " + (project.ROAD_SECTOR || "")).toLowerCase();
    if (haystack.indexOf(query) === -1 || (selectedStatus !== "all" && project.STATUS !== selectedStatus)) {
      continue;
    }
    html += publicProjectCard(project, false);
    count += 1;
  }
  container.innerHTML = html || publicEmptyState("0", "No matching projects", "Adjust the search or status filter.");
  var countElement = document.getElementById("projectCatalogueCount");
  if (countElement) countElement.textContent = count + (count === 1 ? " project" : " projects");
}

function initializeProjectFilters() {
  var search = document.getElementById("projectCatalogueSearch");
  var status = document.getElementById("projectCatalogueStatus");
  if (search) search.addEventListener("input", renderProjectCatalogue);
  if (status) status.addEventListener("change", renderProjectCatalogue);
}

function renderPublicProperties() {
  var preview = document.getElementById("availableUnits");
  var catalogue = document.getElementById("publicUnits");
  if (!preview && !catalogue) {
    return;
  }
  publicFetchJson("backend/api/public/get_property_availability.php")
    .then(function (data) {
      publicUnits = data.units || [];
      var scope = document.getElementById("propertyScopeNote");
      if (scope) scope.textContent = data.scope;
      if (preview) {
        var previewHtml = "";
        for (var previewIndex = 0; previewIndex < Math.min(publicUnits.length, 4); previewIndex += 1) {
          previewHtml += publicUnitCard(publicUnits[previewIndex]);
        }
        preview.innerHTML = previewHtml || publicEmptyState("UN", "No units currently available", "Availability updates when booking records change.");
      }
      if (catalogue) {
        populateUnitTypes();
        renderPropertyCatalogue();
        initializePropertyFilters();
      }
    })
    .catch(function (error) {
      if (preview) preview.innerHTML = publicErrorState("Property availability could not be loaded.");
      if (catalogue) catalogue.innerHTML = publicErrorState("Property availability could not be loaded.");
      console.error(error);
    });
}

function populateUnitTypes() {
  var select = document.getElementById("propertyTypeFilter");
  if (!select) return;
  var types = [];
  for (var index = 0; index < publicUnits.length; index += 1) {
    if (types.indexOf(publicUnits[index].UNIT_TYPE) === -1) types.push(publicUnits[index].UNIT_TYPE);
  }
  types.sort();
  var html = '<option value="all">All unit types</option>';
  for (index = 0; index < types.length; index += 1) {
    html += '<option value="' + escapeHtml(types[index]) + '">' + escapeHtml(types[index]) + "</option>";
  }
  select.innerHTML = html;
}

function renderPropertyCatalogue() {
  var container = document.getElementById("publicUnits");
  var search = document.getElementById("propertySearch");
  var type = document.getElementById("propertyTypeFilter");
  var query = search ? search.value.toLowerCase().trim() : "";
  var selectedType = type ? type.value : "all";
  var html = "";
  var count = 0;
  for (var index = 0; index < publicUnits.length; index += 1) {
    var unit = publicUnits[index];
    var haystack = (unit.UNIT_ID + " " + unit.UNIT_NO + " " + unit.UNIT_TYPE).toLowerCase();
    if (haystack.indexOf(query) === -1 || (selectedType !== "all" && unit.UNIT_TYPE !== selectedType)) continue;
    html += publicUnitCard(unit);
    count += 1;
  }
  container.innerHTML = html || publicEmptyState("0", "No matching units", "Adjust the search or unit-type filter.");
  var countElement = document.getElementById("propertyCount");
  if (countElement) countElement.textContent = count + (count === 1 ? " available unit" : " available units");
}

function initializePropertyFilters() {
  var search = document.getElementById("propertySearch");
  var type = document.getElementById("propertyTypeFilter");
  if (search) search.addEventListener("input", renderPropertyCatalogue);
  if (type) type.addEventListener("change", renderPropertyCatalogue);
}

document.addEventListener("DOMContentLoaded", function () {
  renderPublicSummary();
  renderPublicProjects();
  renderPublicProperties();
});
