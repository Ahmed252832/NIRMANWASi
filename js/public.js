
function renderLandingStatistics() {
  var projectCount = document.getElementById("projectCount");
  var availableUnitCount = document.getElementById("availableUnitCount");
  var publishedTenderCount = document.getElementById("publishedTenderCount");
  var progressUpdateCount = document.getElementById("progressUpdateCount");
  var availableUnits = 0;
  var publishedTenders = 0;

  for (var unitIndex = 0; unitIndex < nirmanData.units.length; unitIndex += 1) {
    if (isUnitAvailableForBooking(nirmanData.units[unitIndex])) {
      availableUnits += 1;
    }
  }

  for (var tenderIndex = 0; tenderIndex < nirmanData.tenders.length; tenderIndex += 1) {
    if (nirmanData.tenders[tenderIndex].status === "Published") {
      publishedTenders += 1;
    }
  }

  if (projectCount) {
    projectCount.textContent = nirmanData.projects.length;
  }
  if (availableUnitCount) {
    availableUnitCount.textContent = availableUnits;
  }
  if (publishedTenderCount) {
    publishedTenderCount.textContent = publishedTenders;
  }
  if (progressUpdateCount) {
    progressUpdateCount.textContent = nirmanData.projectUpdates.length;
  }
}

function renderFeaturedProjects() {
  var projectContainer = document.getElementById("featuredProjects");
  if (!projectContainer) {
    return;
  }

  var projectHtml = "";

  for (var index = 0; index < nirmanData.projects.length; index += 1) {
    var project = nirmanData.projects[index];
    var area = findRecord(nirmanData.areas, "areaId", project.areaId);
    var progress = getLatestProjectProgress(project.projectId);
    var displayStatus = isProjectOverdue(project) ? "Overdue" : project.status;

    projectHtml +=
      '<div class="col-lg-6">' +
        '<article class="project-card">' +
          '<div class="project-card-top">' +
            '<span class="project-number">Project file / ' + escapeHtml(project.projectId) + "</span>" +
            '<div class="project-silhouette" aria-hidden="true"></div>' +
          "</div>" +
          '<div class="project-card-body">' +
            '<div class="d-flex justify-content-between gap-3 align-items-start mb-3">' +
              "<div>" +
                "<h3>" + escapeHtml(project.projectName) + "</h3>" +
                '<div class="meta-row"><span>' + escapeHtml(area ? area.roadSector : "Area unavailable") + "</span>" +
                "<span>Deadline " + formatDate(project.deadline) + "</span></div>" +
              "</div>" +
              createStatusBadge(displayStatus) +
            "</div>" +
            '<div class="d-flex justify-content-between mb-2 small fw-bold"><span>Recorded progress</span><span>' + progress + "%</span></div>" +
            '<div class="progress progress-thin" role="progressbar" aria-label="Project progress" aria-valuenow="' + progress + '" aria-valuemin="0" aria-valuemax="100">' +
              '<div class="progress-bar" style="width: ' + progress + '%"></div>' +
            "</div>" +
          "</div>" +
        "</article>" +
      "</div>";
  }

  projectContainer.innerHTML = projectHtml;
}

function renderAvailableUnitPreview() {
  var unitContainer = document.getElementById("availableUnits");
  if (!unitContainer) {
    return;
  }

  var unitHtml = "";
  var shownCount = 0;

  for (var index = 0; index < nirmanData.units.length; index += 1) {
    var unit = nirmanData.units[index];
    if (isUnitAvailableForBooking(unit) && shownCount < 4) {
      unitHtml +=
        '<div class="col-sm-6 col-xl-3">' +
          '<article class="unit-card">' +
            '<div class="unit-code">' + escapeHtml(unit.unitNo) + "</div>" +
            "<h3>" + escapeHtml(unit.unitType) + "</h3>" +
            '<p class="text-muted-custom small mb-3">Unit ID ' + escapeHtml(unit.unitId) + "</p>" +
            createStatusBadge(unit.status) +
          "</article>" +
        "</div>";
      shownCount += 1;
    }
  }

  unitContainer.innerHTML = unitHtml;
}



function setupPublicNavigation() {
  var navbar = document.querySelector(".public-navbar");
  var links = Array.prototype.slice.call(document.querySelectorAll('.public-navbar .nav-link[href^="#"]'));
  var items = [];

  for (var i = 0; i < links.length; i += 1) {
    var sectionId = links[i].getAttribute("href").slice(1);
    var section = document.getElementById(sectionId);

    if (section) {
      items.push({ link: links[i], section: section, id: sectionId });
    }
  }

  items.sort(function (a, b) {
    return a.section.offsetTop - b.section.offsetTop;
  });

  function setActiveLink(sectionId) {
    for (var i = 0; i < items.length; i += 1) {
      items[i].link.classList.toggle("active", items[i].id === sectionId);
    }
  }

  function updateActiveLink() {
    if (!items.length) {
      return;
    }

    var navbarHeight = navbar ? navbar.offsetHeight : 0;
    var currentPosition = window.pageYOffset + navbarHeight + 70;
    var currentId = items[0].id;

    for (var i = 0; i < items.length; i += 1) {
      if (items[i].section.offsetTop <= currentPosition) {
        currentId = items[i].id;
      }
    }

    setActiveLink(currentId);
  }

  for (var i = 0; i < items.length; i += 1) {
    (function (item) {
      item.link.addEventListener("click", function (event) {
        event.preventDefault();

        var navbarHeight = navbar ? navbar.offsetHeight : 0;
        var targetTop = item.section.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 12;

        setActiveLink(item.id);
        window.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });

        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, "", "#" + item.id);
        }
      });
    })(items[i]);
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("resize", updateActiveLink);
  updateActiveLink();
}

document.addEventListener("DOMContentLoaded", function () {
  renderLandingStatistics();
  renderFeaturedProjects();
  renderAvailableUnitPreview();
  setupPublicNavigation();
});
