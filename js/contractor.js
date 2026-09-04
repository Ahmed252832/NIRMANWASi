
var currentRepresentativeId = null;
var currentRepresentativeProfile = null;
var contractorPublishedTendersCache = [];
var contractorOwnBidsCache = [];
var contractorProjectsCache = [];
var contractorProjectUpdateHistoryCache = {};

function contractorSetText(elementId, value) {
  var element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

function contractorGetCurrentRepresentative() {
  return currentRepresentativeProfile;
}

function contractorGetCurrentPerson() {
  if (!currentRepresentativeProfile) {
    return null;
  }
  return {
    firstName: currentRepresentativeProfile.firstName,
    lastName: currentRepresentativeProfile.lastName,
    email: currentRepresentativeProfile.email,
    contactNo: currentRepresentativeProfile.contactNo
  };
}

function contractorGetCurrentRepresentativeName() {
  var person = contractorGetCurrentPerson();
  return person ? person.firstName + " " + person.lastName : "Unknown representative";
}

function contractorGetUpdateAuthorName(update) {
  if (!update || (!update.firstName && !update.lastName)) {
    return "Unknown representative";
  }
  return ((update.firstName || "") + " " + (update.lastName || "")).trim();
}

function contractorFetchPublishedTenders(callback) {
  return fetch("../../backend/api/public/get_published_tenders.php")
    .then(function (r) { return r.json(); })
    .then(function (tenders) {
      contractorPublishedTendersCache = tenders.map(function (t) {
        return {
          tenderId: t.TENDER_ID,
          employeeId: t.EMP_ID,
          deadline: t.DEADLINE,
          title: t.TITLE,
          task: t.TASK,
          bidDetails: t.BID_DETAILS,
          status: t.STATUS,
          publisherName: t.FIRST_NAME + " " + t.LAST_NAME
        };
      });
      if (callback) {
        callback();
      }
      return contractorPublishedTendersCache;
    });
}

function contractorGetPublishedTenders() {
  return contractorPublishedTendersCache;
}

function contractorGetTender(tenderId) {
  return findRecord(contractorPublishedTendersCache, "tenderId", tenderId);
}

function contractorFetchOwnBids(callback) {
  return fetch("../../backend/api/contractor/get_my_bids.php")
    .then(function (r) { return r.json(); })
    .then(function (bids) {
      contractorOwnBidsCache = bids.map(function (b) {
        return {
          tenderId: b.TENDER_ID,
          bidId: b.BID_ID,
          bidStatus: b.BID_STATUS,
          bidAmount: b.BID_AMOUNT,
          tenderTitle: b.TITLE,
          awardId: b.AWARD_ID,
          awardAmount: b.AWARD_AMOUNT,
          awardDate: b.AWARD_DATE
        };
      });
      if (callback) {
        callback();
      }
      return contractorOwnBidsCache;
    });
}

function contractorGetOwnBids() {
  return contractorOwnBidsCache;
}

function contractorGetAward(tenderId, bidId) {
  var bid = findRecord(contractorOwnBidsCache.filter(function (b) { return b.tenderId === tenderId; }), "bidId", bidId);
  if (bid && bid.awardId) {
    return { awardId: bid.awardId, awardAmount: bid.awardAmount, awardDate: bid.awardDate, tenderId: tenderId, bidId: bidId };
  }
  return null;
}

function contractorFetchMyProjects(callback) {
  return fetch("../../backend/api/contractor/get_my_projects.php")
    .then(function (r) { return r.json(); })
    .then(function (rows) {
      contractorProjectsCache = rows.map(function (project) {
        return {
          projectId: project.PROJECT_ID,
          projectName: project.PROJECT_NAME,
          projectBudget: project.PROJECT_BUDGET,
          deadline: project.DEADLINE,
          status: project.STATUS,
          awardId: project.AWARD_ID,
          awardAmount: project.AWARD_AMOUNT,
          awardDate: project.AWARD_DATE,
          tenderId: project.TENDER_ID,
          bidId: project.BID_ID,
          areaId: project.AREA_ID,
          houseNo: project.HOUSE_NO,
          roadSector: project.ROAD_SECTOR,
          boundaryInfo: project.BOUNDARY_INFO,
          latitude: project.LATITUDE,
          longitude: project.LONGITUDE,
          latestUpdate: project.LATEST_UPDATE ? {
            updateId: project.LATEST_UPDATE.UPDATE_ID,
            updateDate: project.LATEST_UPDATE.UPDATE_DATE,
            workNote: project.LATEST_UPDATE.WORK_NOTE,
            progressPercent: project.LATEST_UPDATE.PROGRESS_PERCENT
          } : null
        };
      });
      if (callback) {
        callback();
      }
      return contractorProjectsCache;
    });
}

function contractorGetProjectForAward(awardId) {
  return findRecord(contractorProjectsCache, "awardId", awardId);
}

function contractorGetArea(areaId) {
  var project = contractorProjectsCache.find(function (p) { return p.areaId === areaId; });
  if (!project) {
    return null;
  }
  return {
    areaId: project.areaId,
    houseNo: project.houseNo,
    roadSector: project.roadSector,
    boundaryInfo: project.boundaryInfo,
    latitude: project.latitude,
    longitude: project.longitude
  };
}

function contractorGetOwnBidsForTender(tenderId) {
  var ownBids = contractorGetOwnBids();
  var tenderBids = [];
  for (var index = 0; index < ownBids.length; index += 1) {
    if (ownBids[index].tenderId === tenderId) {
      tenderBids.push(ownBids[index]);
    }
  }
  return tenderBids;
}

function contractorGetRelevantAwards() {
  var ownBids = contractorGetOwnBids();
  var awards = [];
  for (var index = 0; index < ownBids.length; index += 1) {
    var award = contractorGetAward(ownBids[index].tenderId, ownBids[index].bidId);
    if (award) {
      awards.push(award);
    }
  }
  return awards;
}

function contractorGetRelevantProjects() {
  return contractorProjectsCache;
}

function contractorGetProjectPath(project) {
  if (!project) {
    return null;
  }
  return {
    bid: { tenderId: project.tenderId, bidId: project.bidId },
    award: { awardId: project.awardId, awardAmount: project.awardAmount, awardDate: project.awardDate },
    tender: null
  };
}

function contractorIsRelevantProject(projectId) {
  return Boolean(findRecord(contractorProjectsCache, "projectId", projectId));
}

function contractorFetchProjectUpdateHistory(projectId, callback) {
  return fetch("../../backend/api/contractor/get_project_update_history.php?projectId=" + encodeURIComponent(projectId))
    .then(function (r) { return r.json(); })
    .then(function (updates) {
      contractorProjectUpdateHistoryCache[projectId] = updates.map(function (update) {
        return {
          projectId: projectId,
          updateId: update.UPDATE_ID,
          updateDate: update.UPDATE_DATE,
          workNote: update.WORK_NOTE,
          progressPercent: update.PROGRESS_PERCENT,
          repId: update.REP_ID,
          firstName: update.FIRST_NAME,
          lastName: update.LAST_NAME
        };
      });
      contractorSortUpdatesNewestFirst(contractorProjectUpdateHistoryCache[projectId]);
      if (callback) {
        callback(contractorProjectUpdateHistoryCache[projectId]);
      }
      return contractorProjectUpdateHistoryCache[projectId];
    });
}

function contractorFetchAllProjectUpdateHistories(callback) {
  var projects = contractorGetRelevantProjects();
  contractorProjectUpdateHistoryCache = {};
  return Promise.all(projects.map(function (project) {
    return contractorFetchProjectUpdateHistory(project.projectId);
  })).then(function () {
    if (callback) {
      callback();
    }
    return contractorGetRelevantUpdates();
  });
}

function contractorGetUpdatesForProject(projectId) {
  return contractorProjectUpdateHistoryCache[projectId] || [];
}

function contractorGetRelevantUpdates() {
  var updates = [];
  var projects = contractorGetRelevantProjects();
  for (var projectIndex = 0; projectIndex < projects.length; projectIndex += 1) {
    var projectUpdates = contractorGetUpdatesForProject(projects[projectIndex].projectId);
    for (var updateIndex = 0; updateIndex < projectUpdates.length; updateIndex += 1) {
      updates.push(projectUpdates[updateIndex]);
    }
  }
  contractorSortUpdatesNewestFirst(updates);
  return updates;
}

function contractorSortUpdatesNewestFirst(updates) {
  updates.sort(function (firstUpdate, secondUpdate) {
    var dateDifference = new Date(secondUpdate.updateDate) - new Date(firstUpdate.updateDate);
    if (dateDifference !== 0) {
      return dateDifference;
    }
    return String(secondUpdate.updateId).localeCompare(String(firstUpdate.updateId));
  });
}

function contractorGetLatestUpdate(projectId) {
  var project = findRecord(contractorProjectsCache, "projectId", projectId);
  return project ? project.latestUpdate : null;
}

function contractorTenderDeadlinePassed(tender) {
  return new Date(tender.deadline + "T23:59:59") < new Date();
}

function contractorCanBid(tender) {
  var representative = contractorGetCurrentRepresentative();
  return Boolean(
    representative &&
    representative.approvalStatus === "Approved" &&
    tender &&
    tender.status === "Published" &&
    !contractorTenderDeadlinePassed(tender)
  );
}

function contractorGetInitials(person) {
  if (!person) {
    return "--";
  }
  return String(person.firstName).charAt(0).toUpperCase() + String(person.lastName).charAt(0).toUpperCase();
}

function contractorFormatProgress(progress) {
  var number = Number(progress);
  if (Number.isInteger(number)) {
    return number + "%";
  }
  return number.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") + "%";
}

function contractorFormatArea(area) {
  if (!area) {
    return "Area not available";
  }
  return "House " + area.houseNo + ", " + area.roadSector;
}

function contractorGetTodayValue() {
  var today = new Date();
  var month = String(today.getMonth() + 1).padStart(2, "0");
  var day = String(today.getDate()).padStart(2, "0");
  return today.getFullYear() + "-" + month + "-" + day;
}

function contractorDetailItem(label, value) {
  return '<li><span class="detail-label">' + escapeHtml(label) +
    '</span><span class="detail-value">' + escapeHtml(value) + "</span></li>";
}

function contractorDetailHtmlItem(label, safeHtml) {
  return '<li><span class="detail-label">' + escapeHtml(label) +
    '</span><span class="detail-value">' + safeHtml + "</span></li>";
}

function contractorEmptyState(mark, heading, message) {
  return '<div class="empty-state"><span class="empty-state-mark">' + escapeHtml(mark) +
    "</span><h3>" + escapeHtml(heading) + "</h3><p>" + escapeHtml(message) + "</p></div>";
}

function contractorProgressBar(progress) {
  var safeProgress = Math.max(0, Math.min(100, Number(progress) || 0));
  return '<div class="progress progress-thin mt-2" role="progressbar" aria-label="Project progress" aria-valuenow="' +
    safeProgress + '" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width: ' +
    safeProgress + '%"></div></div>';
}

function contractorShowModal(modalId) {
  var modalElement = document.getElementById(modalId);
  if (modalElement && window.bootstrap && bootstrap.Modal) {
    bootstrap.Modal.getOrCreateInstance(modalElement).show();
  }
}

function contractorHideModal(modalId) {
  var modalElement = document.getElementById(modalId);
  if (modalElement && window.bootstrap && bootstrap.Modal) {
    bootstrap.Modal.getOrCreateInstance(modalElement).hide();
  }
}

function contractorRenderSharedIdentity() {
  var representative = contractorGetCurrentRepresentative();
  var person = contractorGetCurrentPerson();
  var name = person ? person.firstName + " " + person.lastName : "Unknown representative";
  var title = representative ? representative.title + " - " + representative.approvalStatus : "Account unavailable";
  var nameElements = document.querySelectorAll("[data-current-rep-name]");
  var titleElements = document.querySelectorAll("[data-current-rep-title]");
  var initialElements = document.querySelectorAll("[data-current-rep-initials]");
  var index;

  for (index = 0; index < nameElements.length; index += 1) {
    nameElements[index].textContent = name;
  }
  for (index = 0; index < titleElements.length; index += 1) {
    titleElements[index].textContent = title;
  }
  for (index = 0; index < initialElements.length; index += 1) {
    initialElements[index].textContent = contractorGetInitials(person);
  }
}

function contractorRenderDashboard() {
  Promise.all([
    fetch("../../backend/api/contractor/get_dashboard_summary.php").then(function (response) {
      if (!response.ok) {
        throw new Error("Representative dashboard request failed");
      }
      return response.json();
    }),
    fetch("../../backend/api/contractor/get_representative_profile.php").then(function (response) {
      if (!response.ok) {
        throw new Error("Representative profile request failed");
      }
      return response.json();
    }),
    contractorFetchOwnBids(),
    contractorFetchPublishedTenders()
  ])
    .then(function (results) {
      var data = results[0];
      var profile = results[1].rep;
      var counts = data.counts || {};
      var publishedTenders = contractorGetPublishedTenders();
      var projects = Array.isArray(data.projects) ? data.projects : [];
      var index;

      contractorSetText("dashboardPublishedCount", Number(counts.openTenders) || 0);
      contractorSetText("dashboardBidCount", Number(counts.bids) || 0);
      contractorSetText("dashboardAwardCount", Number(counts.awards) || 0);
      contractorSetText("dashboardProjectCount", Number(counts.projects) || 0);

      var representativeSummary = document.getElementById("dashboardRepresentativeSummary");
      if (representativeSummary && profile) {
        representativeSummary.innerHTML = '<ul class="detail-list">' +
          contractorDetailItem("Representative", profile.FIRST_NAME + " " + profile.LAST_NAME) +
          contractorDetailItem("Title", profile.TITLE) +
          contractorDetailHtmlItem("Approval", createStatusBadge(profile.APPROVAL_STATUS)) +
          "</ul>";
      }

      var contractorSummary = document.getElementById("dashboardContractorSummary");
      if (contractorSummary && profile) {
        contractorSummary.innerHTML = '<ul class="detail-list">' +
          contractorDetailItem("Contractor", profile.COMPANY_NAME) +
          contractorDetailItem("License", profile.LICENSE_NO) +
          contractorDetailItem("License due", formatDate(profile.LICENSE_DUE)) +
          "</ul>";
      }

      var tenderBody = document.getElementById("dashboardTenderBody");
      if (tenderBody) {
        var tenderRows = "";
        for (index = 0; index < publishedTenders.length; index += 1) {
          var tender = publishedTenders[index];
          tenderRows += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(tender.tenderId) +
            '</span><span class="table-secondary-text">' + escapeHtml(tender.title) + "</span></td><td>" +
            escapeHtml(tender.task) + "</td><td>" + escapeHtml(formatDate(tender.deadline)) + "</td><td>" +
            contractorGetOwnBidsForTender(tender.tenderId).length + '</td><td><a class="mini-action" href="tenders.html">Open</a></td></tr>';
        }
        tenderBody.innerHTML = tenderRows || '<tr><td colspan="5">' +
          contractorEmptyState("TN", "No published tenders", "There are no published opportunities right now.") + "</td></tr>";
      }

      var bidStatusList = document.getElementById("dashboardBidStatusList");
      if (bidStatusList) {
        var bidHtml = '<div class="activity-list">';
        for (index = 0; index < contractorOwnBidsCache.length; index += 1) {
          var bid = contractorOwnBidsCache[index];
          bidHtml += '<div class="activity-item"><span class="activity-marker">BD</span><div><h3>' +
            escapeHtml((bid.tenderTitle || bid.tenderId) + " - Bid " + bid.bidId) + " " +
            createStatusBadge(bid.bidStatus) + "</h3><p>" + escapeHtml(formatCurrency(bid.bidAmount)) +
            (bid.awardId ? " · " + escapeHtml("Award " + bid.awardId) : "") + "</p></div></div>";
        }
        bidHtml += "</div>";
        bidStatusList.innerHTML = contractorOwnBidsCache.length ? bidHtml :
          contractorEmptyState("BD", "No bids submitted", "Your submitted bids will appear here.");
      }

      var projectList = document.getElementById("dashboardProjectList");
      if (projectList) {
        var projectHtml = '<div class="activity-list">';
        for (index = 0; index < projects.length; index += 1) {
          projectHtml += '<div class="activity-item"><span class="activity-marker">PR</span><div><h3>' +
            escapeHtml(projects[index].PROJECT_NAME) + " " + createStatusBadge(projects[index].STATUS) +
            "</h3><p>Latest progress " + escapeHtml(contractorFormatProgress(projects[index].CURRENT_PROGRESS)) +
            " · deadline " + escapeHtml(formatDate(projects[index].DEADLINE)) + "</p></div></div>";
        }
        projectHtml += "</div>";
        projectList.innerHTML = projects.length ? projectHtml :
          contractorEmptyState("PR", "No awarded projects", "A project appears after your bid matches an award and project.");
      }

      var recentUpdates = document.getElementById("dashboardRecentUpdates");
      if (recentUpdates) {
        var recentHtml = '<div class="timeline-list">';
        var updateCount = 0;
        for (index = 0; index < projects.length && updateCount < 5; index += 1) {
          if (!projects[index].LAST_UPDATE_DATE) {
            continue;
          }
          updateCount += 1;
          recentHtml += '<div class="timeline-item"><span class="timeline-dot"></span><div class="timeline-content"><h3>' +
            escapeHtml(projects[index].PROJECT_NAME + " · " + contractorFormatProgress(projects[index].CURRENT_PROGRESS)) +
            '</h3><p>' + escapeHtml(projects[index].STATUS) + '</p><span class="timeline-date">' +
            escapeHtml(formatDate(projects[index].LAST_UPDATE_DATE)) + "</span></div></div>";
        }
        recentHtml += "</div>";
        recentUpdates.innerHTML = updateCount ? recentHtml :
          contractorEmptyState("UP", "No progress updates", "Latest awarded-project status will appear here.");
      }
    })
    .catch(function (error) {
      console.error("Representative dashboard load failed:", error);
      showPageAlert("Could not load the Representative dashboard summary.", "danger");
    });
}

function contractorRenderProfile() {
  fetch("../../backend/api/contractor/get_representative_profile.php")
    .then(function (r) { return r.json(); })
    .then(function (result) {
      if (!result.found) {
        showPageAlert("The current representative profile could not be found.", "danger");
        return;
      }
      var rep = result.rep;
      var fullName = rep.FIRST_NAME + " " + rep.LAST_NAME;
      var initials = (rep.FIRST_NAME.charAt(0) + rep.LAST_NAME.charAt(0)).toUpperCase();
      var profileHeader = document.getElementById("profileHeader");
      if (profileHeader) {
        profileHeader.innerHTML = '<span class="profile-avatar">' + escapeHtml(initials) +
          '</span><div><h2 id="profileHeaderName">' + escapeHtml(fullName) + "</h2><p>" + escapeHtml(rep.TITLE) +
          " · " + createStatusBadge(rep.APPROVAL_STATUS) + "</p></div>";
      }
      var personDetails = document.getElementById("profilePersonDetails");
      if (personDetails) {
        personDetails.innerHTML = contractorDetailItem("First name", rep.FIRST_NAME) +
          contractorDetailItem("Last name", rep.LAST_NAME) +
          contractorDetailItem("Contact number", rep.CONTACT_NO) +
          contractorDetailItem("Email", rep.EMAIL);
      }
      var representativeDetails = document.getElementById("profileRepresentativeDetails");
      if (representativeDetails) {
        representativeDetails.innerHTML = contractorDetailItem("Title", rep.TITLE) +
          contractorDetailHtmlItem("Approval status", createStatusBadge(rep.APPROVAL_STATUS));
      }
      var contractorDetails = document.getElementById("profileContractorDetails");
      var licenseBadge = document.getElementById("profileLicenseBadge");
      var licenseState = new Date(rep.LICENSE_DUE + "T23:59:59") < new Date() ? "Expired" : "Active";
      if (licenseBadge) {
        licenseBadge.innerHTML = createStatusBadge(licenseState);
      }
      if (contractorDetails) {
        contractorDetails.innerHTML = contractorDetailItem("Company name", rep.COMPANY_NAME) +
          contractorDetailItem("License number", rep.LICENSE_NO) +
          contractorDetailItem("License due", formatDate(rep.LICENSE_DUE)) +
          contractorDetailHtmlItem("License state", createStatusBadge(licenseState));
      }
      var otherHolder = document.getElementById("profileOtherRepresentatives");
      if (otherHolder) {
        var html = '<div class="activity-list">';
        for (var index = 0; index < result.others.length; index += 1) {
          var other = result.others[index];
          html += '<div class="activity-item"><span class="activity-marker">RP</span><div><h3>' +
            escapeHtml(other.FIRST_NAME + " " + other.LAST_NAME) + " " + createStatusBadge(other.APPROVAL_STATUS) +
            "</h3><p>" + escapeHtml(other.TITLE) + "</p></div></div>";
        }
        html += "</div>";
        otherHolder.innerHTML = result.others.length ? html : contractorEmptyState("RP", "No other representatives", "No additional representative is recorded for this Contractor.");
      }
    });
}

function contractorTenderMatchesFilters(tender) {
  var search = document.getElementById("tenderSearch");
  var bidFilter = document.getElementById("tenderBidFilter");
  var query = search ? search.value.toLowerCase().trim() : "";
  var selectedBidState = bidFilter ? bidFilter.value : "all";
  var ownBidCount = contractorGetOwnBidsForTender(tender.tenderId).length;
  var searchableText = (tender.tenderId + " " + tender.title + " " + tender.task).toLowerCase();
  var matchesSearch = searchableText.indexOf(query) >= 0;
  var matchesBidState = selectedBidState === "all" ||
    (selectedBidState === "submitted" && ownBidCount > 0) ||
    (selectedBidState === "not-submitted" && ownBidCount === 0);
  return matchesSearch && matchesBidState;
}

function contractorRenderTenders() {
  var publishedTenders = contractorGetPublishedTenders();
  var ownPublishedBidCount = 0;
  var upcomingCount = 0;
  var index;
  for (index = 0; index < publishedTenders.length; index += 1) {
    ownPublishedBidCount += contractorGetOwnBidsForTender(publishedTenders[index].tenderId).length;
    if (!contractorTenderDeadlinePassed(publishedTenders[index])) {
      upcomingCount += 1;
    }
  }
  contractorSetText("tenderPublishedCount", publishedTenders.length);
  contractorSetText("tenderOwnBidCount", ownPublishedBidCount);
  contractorSetText("tenderUpcomingCount", upcomingCount);

  var representative = contractorGetCurrentRepresentative();
  var eligibility = document.getElementById("tenderEligibilityCallout");
  if (eligibility && representative) {
    eligibility.classList.toggle("warning-callout", representative.approvalStatus !== "Approved");
    eligibility.textContent = representative.approvalStatus === "Approved"
      ? contractorGetCurrentRepresentativeName() + " is Approved. Bids may be submitted on Published tenders until their deadline."
      : "Bid submission is unavailable because the current representative is not Approved.";
  }

  var rows = "";
  var visibleCount = 0;
  for (index = 0; index < publishedTenders.length; index += 1) {
    var tender = publishedTenders[index];
    if (!contractorTenderMatchesFilters(tender)) {
      continue;
    }
    visibleCount += 1;
    var ownBidCount = contractorGetOwnBidsForTender(tender.tenderId).length;
    var canBid = contractorCanBid(tender);
    rows += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(tender.tenderId) +
      '</span><span class="table-secondary-text">' + escapeHtml(tender.title) + "</span></td><td>" + escapeHtml(tender.task) +
      "</td><td>" + formatDate(tender.deadline) +
      (contractorTenderDeadlinePassed(tender) ? '<span class="table-secondary-text">Deadline passed</span>' : "") +
      "</td><td>" + ownBidCount + '</td><td><div class="d-flex gap-2 flex-wrap"><button class="mini-action" type="button" data-tender-detail="' +
      escapeHtml(tender.tenderId) + '">Details</button><button class="mini-action" type="button" data-tender-bid="' +
      escapeHtml(tender.tenderId) + '"' + (canBid ? "" : " disabled") + ">Submit bid</button></div></td></tr>";
  }
  var body = document.getElementById("tenderTableBody");
  if (body) {
    body.innerHTML = rows || '<tr><td colspan="6">' + contractorEmptyState("TN", "No matching tenders", "Adjust the search or bid-state filter.") + "</td></tr>";
  }
  contractorSetText("tenderResultCount", visibleCount + (visibleCount === 1 ? " record" : " records"));
}

function contractorOpenTenderDetail(tenderId) {
  var tender = contractorGetTender(tenderId);
  if (!tender || tender.status !== "Published") {
    showPageAlert("Only Published tender details are available here.", "danger");
    return;
  }
  var ownBids = contractorGetOwnBidsForTender(tender.tenderId);
  var body = document.getElementById("tenderDetailBody");
  var title = document.getElementById("tenderDetailTitle");
  var bidButton = document.getElementById("tenderDetailBidButton");
  if (title) {
    title.textContent = tender.tenderId + " · " + tender.title;
  }
  if (body) {
    var ownBidHtml = "";
    for (var index = 0; index < ownBids.length; index += 1) {
      ownBidHtml += "<li>Bid " + escapeHtml(ownBids[index].bidId) + " · " +
        escapeHtml(formatCurrency(ownBids[index].bidAmount)) + " · " + createStatusBadge(ownBids[index].bidStatus) + "</li>";
    }
    body.innerHTML = '<ul class="detail-list">' +
      contractorDetailItem("Tender ID", tender.tenderId) +
      contractorDetailItem("Title", tender.title) +
      contractorDetailItem("Task", tender.task) +
      contractorDetailItem("Bid instructions", tender.bidDetails) +
      contractorDetailHtmlItem("Status", createStatusBadge(tender.status)) +
      contractorDetailItem("Published by", tender.publisherName) +
      contractorDetailItem("Deadline", formatDate(tender.deadline)) +
      '</ul><h3 class="h6 mt-4">My bids on this tender</h3>' +
      (ownBidHtml ? '<ul class="mt-3">' + ownBidHtml + "</ul>" : contractorEmptyState("BD", "No bid submitted", "You have not submitted a bid for this tender."));
  }
  if (bidButton) {
    bidButton.setAttribute("data-tender-bid", tender.tenderId);
    bidButton.disabled = !contractorCanBid(tender);
  }
  contractorShowModal("tenderDetailModal");
}

function contractorOpenBidForm(tenderId) {
  var tender = contractorGetTender(tenderId);
  if (!contractorCanBid(tender)) {
    showPageAlert("This bid cannot be submitted. Check representative approval, tender status, and deadline.", "danger");
    return;
  }
  var form = document.getElementById("bidSubmissionForm");
  if (form) {
    form.reset();
  }
  contractorSetText("bidFormFeedback", "");
  var tenderInput = document.getElementById("bidTenderId");
  var tenderDisplay = document.getElementById("bidTenderDisplay");
  if (tenderInput) {
    tenderInput.value = tender.tenderId;
  }
  if (tenderDisplay) {
    tenderDisplay.value = tender.tenderId + " · " + tender.title;
  }
  var automaticDetails = document.getElementById("bidAutomaticDetails");
  if (automaticDetails) {
    automaticDetails.innerHTML = contractorDetailItem("Representative", contractorGetCurrentRepresentativeName() + " (" + currentRepresentativeId + ")") +
      contractorDetailItem("Initial status", "Under Review") +
      contractorDetailItem("Deadline", formatDate(tender.deadline));
  }
  contractorHideModal("tenderDetailModal");
  contractorShowModal("bidSubmissionModal");
}

function contractorShowBidFormError(message) {
  var feedback = document.getElementById("bidFormFeedback");
  if (feedback) {
    feedback.innerHTML = '<div class="alert alert-danger" role="alert">' + escapeHtml(message) + "</div>";
  }
}

function contractorSubmitBid(event) {
  event.preventDefault();
  var tenderId = document.getElementById("bidTenderId").value;
  var amount = document.getElementById("bidAmount").value;

  var formData = new FormData();
  formData.append("tenderId", tenderId);
  formData.append("amount", amount);

  nirmanFetch("../../backend/actions/contractor/submit_bid.php", { method: "POST", body: formData })
    .then(function (r) { return r.json(); })
    .then(function (result) {
      if (result.success) {
        contractorHideModal("bidSubmissionModal");
        contractorFetchOwnBids(function () {
          contractorRenderTenders();
          showPageAlert(result.message, "success");
        });
      } else {
        contractorShowBidFormError(result.message);
      }
    })
    .catch(function (error) {
      contractorShowBidFormError("Something went wrong. Please try again.");
      console.error(error);
    });
}

function contractorInitializeTenders() {
  Promise.all([
    contractorFetchPublishedTenders(),
    contractorFetchOwnBids()
  ]).then(function () {
    contractorRenderTenders();
  }).catch(function (error) {
    console.error("Published tender load failed:", error);
    showPageAlert("Could not load published tenders and your bids.", "danger");
  });
  var search = document.getElementById("tenderSearch");
  var filter = document.getElementById("tenderBidFilter");
  var form = document.getElementById("bidSubmissionForm");
  if (search) {
    search.addEventListener("input", contractorRenderTenders);
  }
  if (filter) {
    filter.addEventListener("change", contractorRenderTenders);
  }
  if (form) {
    form.addEventListener("submit", contractorSubmitBid);
  }
  document.addEventListener("click", function (event) {
    var detailButton = event.target.closest("[data-tender-detail]");
    var bidButton = event.target.closest("[data-tender-bid]");
    if (detailButton) {
      contractorOpenTenderDetail(detailButton.getAttribute("data-tender-detail"));
    }
    if (bidButton && !bidButton.disabled) {
      contractorOpenBidForm(bidButton.getAttribute("data-tender-bid"));
    }
  });
}

function contractorPopulateSelectWithStatuses(selectId, records, propertyName) {
  var select = document.getElementById(selectId);
  if (!select) {
    return;
  }
  var statuses = [];
  for (var index = 0; index < records.length; index += 1) {
    var status = records[index][propertyName];
    if (statuses.indexOf(status) === -1) {
      statuses.push(status);
    }
  }
  statuses.sort();
  for (index = 0; index < statuses.length; index += 1) {
    var option = document.createElement("option");
    option.value = statuses[index];
    option.textContent = statuses[index];
    select.appendChild(option);
  }
}

function contractorBidMatchesFilters(bid) {
  var search = document.getElementById("bidSearch");
  var statusFilter = document.getElementById("bidStatusFilter");
  var awardFilter = document.getElementById("bidAwardFilter");
  var query = search ? search.value.toLowerCase().trim() : "";
  var selectedStatus = statusFilter ? statusFilter.value : "all";
  var selectedAward = awardFilter ? awardFilter.value : "all";
  var tender = contractorGetTender(bid.tenderId);
  var award = contractorGetAward(bid.tenderId, bid.bidId);
  var project = award ? contractorGetProjectForAward(award.awardId) : null;
  var searchableText = (bid.tenderId + " " + bid.bidId + " " + bid.bidStatus + " " +
    (tender ? tender.title + " " + tender.task : "") + " " + (award ? award.awardId : "") + " " +
    (project ? project.projectId + " " + project.projectName : "")).toLowerCase();
  var matchesStatus = selectedStatus === "all" || bid.bidStatus === selectedStatus;
  var matchesAward = selectedAward === "all" || (selectedAward === "awarded" && award) || (selectedAward === "not-awarded" && !award);
  return searchableText.indexOf(query) >= 0 && matchesStatus && matchesAward;
}

function contractorRenderBids() {
  var ownBids = contractorGetOwnBids();
  var selectedCount = 0;
  var awardCount = 0;
  var rows = "";
  var visibleCount = 0;
  for (var index = 0; index < ownBids.length; index += 1) {
    var bid = ownBids[index];
    var award = contractorGetAward(bid.tenderId, bid.bidId);
    if (bid.bidStatus === "Selected") {
      selectedCount += 1;
    }
    if (award) {
      awardCount += 1;
    }
    if (!contractorBidMatchesFilters(bid)) {
      continue;
    }
    visibleCount += 1;
    rows += "<tr><td><span class=\"table-primary-text\">" + escapeHtml("Bid " + bid.bidId) +
      '</span></td><td><span class="table-primary-text">' +
      escapeHtml(bid.tenderTitle || "Tender unavailable") + '</span><span class="table-secondary-text">' +
      escapeHtml(bid.tenderId) + "</span></td><td>" + escapeHtml(formatCurrency(bid.bidAmount)) +
      "</td><td>" + createStatusBadge(bid.bidStatus) + "</td><td>" +
      (award ? createStatusBadge("Awarded") + '<span class="table-secondary-text">' + escapeHtml(award.awardId) + "</span>" : createStatusBadge("No award")) +
      '</td><td><button class="mini-action" type="button" data-bid-detail="' + escapeHtml(bid.tenderId) + '|' +
      escapeHtml(bid.bidId) + '">Details</button></td></tr>';
  }
  contractorSetText("bidTotalCount", ownBids.length);
  contractorSetText("bidSelectedCount", selectedCount);
  contractorSetText("bidAwardCount", awardCount);
  contractorSetText("bidResultCount", visibleCount + (visibleCount === 1 ? " record" : " records"));
  var body = document.getElementById("bidTableBody");
  if (body) {
    body.innerHTML = rows || '<tr><td colspan="6">' + contractorEmptyState("BD", "No matching bids", "Adjust the search, status, or award filter.") + "</td></tr>";
  }
}

function contractorOpenBidDetail(compositeId) {
  var parts = compositeId.split("|");
  var ownBids = contractorGetOwnBids();
  var bid = null;
  for (var index = 0; index < ownBids.length; index += 1) {
    if (ownBids[index].tenderId === parts[0] && ownBids[index].bidId === parts[1]) {
      bid = ownBids[index];
      break;
    }
  }
  if (!bid) {
    showPageAlert("The selected representative bid could not be found.", "danger");
    return;
  }
  var award = contractorGetAward(bid.tenderId, bid.bidId);
  var project = award ? contractorGetProjectForAward(award.awardId) : null;
  contractorSetText("bidDetailTitle", "Bid " + bid.bidId + (bid.tenderTitle ? " - " + bid.tenderTitle : ""));
  var body = document.getElementById("bidDetailBody");
  if (body) {
    var html = '<h3 class="h6">Tender Bid</h3><ul class="detail-list">' +
      contractorDetailItem("Bid", "Bid " + bid.bidId) +
      contractorDetailItem("Representative", contractorGetCurrentRepresentativeName()) +
      contractorDetailItem("Bid amount", formatCurrency(bid.bidAmount)) +
      contractorDetailHtmlItem("Bid status", createStatusBadge(bid.bidStatus)) + "</ul>";
    html += '<h3 class="h6 mt-4">Tender context</h3><ul class="detail-list">' +
      contractorDetailItem("Tender", bid.tenderId + " · " + (bid.tenderTitle || "Tender unavailable")) +
      '</ul>';
    if (award) {
      html += '<h3 class="h6 mt-4">Matching Award</h3><ul class="detail-list">' +
        contractorDetailItem("Award ID", award.awardId) +
        contractorDetailItem("Award amount", formatCurrency(award.awardAmount)) +
        contractorDetailItem("Award date", formatDate(award.awardDate)) + "</ul>";
    } else {
      html += contractorEmptyState("AW", "No matching Award", "No Award currently matches this Tender ID / Bid ID.");
    }
    if (project) {
      html += '<div class="info-callout mt-4">Resulting project: <strong>' +
        escapeHtml(project.projectName) + "</strong></div>";
    }
    body.innerHTML = html;
  }
  contractorShowModal("bidDetailModal");
}

function contractorInitializeBids() {
  Promise.all([
    contractorFetchPublishedTenders(),
    contractorFetchOwnBids(),
    contractorFetchMyProjects()
  ]).then(function () {
    contractorPopulateSelectWithStatuses("bidStatusFilter", contractorOwnBidsCache, "bidStatus");
    contractorRenderBids();
  }).catch(function (error) {
    console.error("Representative bid load failed:", error);
    showPageAlert("Could not load your bids.", "danger");
  });
  var filterIds = ["bidSearch", "bidStatusFilter", "bidAwardFilter"];
  for (var index = 0; index < filterIds.length; index += 1) {
    var filter = document.getElementById(filterIds[index]);
    if (filter) {
      filter.addEventListener(filter.tagName === "INPUT" ? "input" : "change", contractorRenderBids);
    }
  }
  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-bid-detail]");
    if (button) {
      contractorOpenBidDetail(button.getAttribute("data-bid-detail"));
    }
  });
}

function contractorProjectMatchesFilters(project) {
  var search = document.getElementById("projectSearch");
  var statusFilter = document.getElementById("projectStatusFilter");
  var overdueFilter = document.getElementById("projectOverdueFilter");
  var query = search ? search.value.toLowerCase().trim() : "";
  var selectedStatus = statusFilter ? statusFilter.value : "all";
  var selectedOverdue = overdueFilter ? overdueFilter.value : "all";
  var path = contractorGetProjectPath(project);
  var area = contractorGetArea(project.areaId);
  var overdue = isProjectOverdue(project);
  var searchableText = (project.projectId + " " + project.projectName + " " + project.status + " " +
    (path ? path.award.awardId + " " + path.bid.tenderId + " " + path.bid.bidId : "") + " " +
    (area ? area.areaId + " " + area.houseNo + " " + area.roadSector + " " + area.boundaryInfo : "")).toLowerCase();
  var matchesStatus = selectedStatus === "all" || project.status === selectedStatus;
  var matchesOverdue = selectedOverdue === "all" || (selectedOverdue === "overdue" && overdue) ||
    (selectedOverdue === "on-schedule" && !overdue);
  return searchableText.indexOf(query) >= 0 && matchesStatus && matchesOverdue;
}

function contractorRenderProjects() {
  var projects = contractorGetRelevantProjects();
  var activeCount = 0;
  var overdueCount = 0;
  var totalProgress = 0;
  var rows = "";
  var visibleCount = 0;
  for (var index = 0; index < projects.length; index += 1) {
    var project = projects[index];
    var overdue = isProjectOverdue(project);
    var latest = contractorGetLatestUpdate(project.projectId);
    if (project.status === "In Progress") {
      activeCount += 1;
    }
    if (overdue) {
      overdueCount += 1;
    }
    totalProgress += latest ? Number(latest.progressPercent) : 0;
    if (!contractorProjectMatchesFilters(project)) {
      continue;
    }
    visibleCount += 1;
    var path = contractorGetProjectPath(project);
    var area = contractorGetArea(project.areaId);
    var progress = latest ? latest.progressPercent : 0;
    rows += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(project.projectId + " · " + project.projectName) +
      '</span><span class="table-secondary-text">' + createStatusBadge(project.status) + (overdue ? " " + createStatusBadge("Overdue") : "") +
      "</span></td><td>" + escapeHtml(path ? path.bid.tenderId + " / " + path.bid.bidId + " -> " + path.award.awardId : "Path unavailable") +
      "</td><td><span class=\"table-primary-text\">" + escapeHtml(area ? area.areaId : "Not available") +
      '</span><span class="table-secondary-text">' + escapeHtml(contractorFormatArea(area)) + "</span></td><td>" +
      formatDate(project.deadline) + "</td><td><strong>" + escapeHtml(contractorFormatProgress(progress)) + "</strong>" +
      contractorProgressBar(progress) + '</td><td><button class="mini-action" type="button" data-project-detail="' +
      escapeHtml(project.projectId) + '">Details</button></td></tr>';
  }
  contractorSetText("projectRelevantCount", projects.length);
  contractorSetText("projectActiveCount", activeCount);
  contractorSetText("projectOverdueCount", overdueCount);
  contractorSetText("projectAverageProgress", contractorFormatProgress(projects.length ? totalProgress / projects.length : 0));
  contractorSetText("projectResultCount", visibleCount + (visibleCount === 1 ? " record" : " records"));
  var body = document.getElementById("projectTableBody");
  if (body) {
    body.innerHTML = rows || '<tr><td colspan="6">' + contractorEmptyState("PR", "No matching projects", "Adjust the search, status, or deadline filter.") + "</td></tr>";
  }
}

function contractorOpenProjectDetail(projectId) {
  var project = findRecord(contractorProjectsCache, "projectId", projectId);
  if (!project || !contractorIsRelevantProject(projectId)) {
    showPageAlert("That project is not relevant to the current representative's awarded bids.", "danger");
    return;
  }

  var renderDetail = function (updates) {
    var path = contractorGetProjectPath(project);
    var area = contractorGetArea(project.areaId);
    var latest = updates.length ? updates[0] : project.latestUpdate;
    var overdue = isProjectOverdue(project);
    contractorSetText("projectDetailTitle", project.projectId + " · " + project.projectName);
    var body = document.getElementById("projectDetailBody");
    if (body) {
      var html = '<div class="row g-4"><div class="col-lg-6"><h3 class="h6">Project and Award</h3><ul class="detail-list">' +
        contractorDetailItem("Project ID", project.projectId) +
        contractorDetailItem("Project name", project.projectName) +
        contractorDetailItem("Budget", formatCurrency(project.projectBudget)) +
        contractorDetailHtmlItem("Status", createStatusBadge(project.status)) +
        contractorDetailItem("Deadline", formatDate(project.deadline)) +
        contractorDetailHtmlItem("Derived overdue", createStatusBadge(overdue ? "Overdue" : "On schedule")) +
        contractorDetailItem("Latest progress", contractorFormatProgress(latest ? latest.progressPercent : 0));
      if (path) {
        html += contractorDetailItem("Tender / Bid", path.bid.tenderId + " / " + path.bid.bidId) +
          contractorDetailItem("Award", path.award.awardId + " · " + formatCurrency(path.award.awardAmount)) +
          contractorDetailItem("Award date", formatDate(path.award.awardDate));
      }
      html += '</ul></div><div class="col-lg-6"><h3 class="h6">Area</h3>';
      if (area) {
        html += '<ul class="detail-list">' + contractorDetailItem("Area ID", area.areaId) +
          contractorDetailItem("Address", contractorFormatArea(area)) +
          contractorDetailItem("Boundary", area.boundaryInfo) +
          contractorDetailItem("Centre latitude", area.latitude) +
          contractorDetailItem("Centre longitude", area.longitude) + "</ul>";
      } else {
        html += contractorEmptyState("AR", "Area unavailable", "No Area record matches this Project.");
      }
      html += '</div></div><hr class="my-4"><h3 class="h6">Full progress history</h3>';
      if (updates.length) {
        html += '<div class="timeline-list mt-3">';
        for (var index = 0; index < updates.length; index += 1) {
          var update = updates[index];
          html += '<div class="timeline-item"><span class="timeline-dot"></span><div class="timeline-content"><h3>' +
            escapeHtml(update.projectId + " / " + update.updateId + " · " + contractorFormatProgress(update.progressPercent)) +
            '</h3><p>' + escapeHtml(update.workNote) + '</p><span class="timeline-date">' + escapeHtml(formatDate(update.updateDate)) +
            " · " + escapeHtml(contractorGetUpdateAuthorName(update)) + "</span></div></div>";
        }
        html += "</div>";
      } else {
        html += contractorEmptyState("UP", "No progress history", "No Project Update has been recorded yet.");
      }
      body.innerHTML = html;
    }
    var updateLink = document.getElementById("projectUpdateLink");
    if (updateLink) {
      updateLink.href = "updates.html?project=" + encodeURIComponent(project.projectId);
    }
    contractorShowModal("projectDetailModal");
  };

  var updates = contractorGetUpdatesForProject(projectId);
  if (updates.length) {
    renderDetail(updates);
    return;
  }

  contractorFetchProjectUpdateHistory(projectId, renderDetail);
}

function contractorInitializeProjects() {
  contractorFetchMyProjects(function () {
    contractorPopulateSelectWithStatuses("projectStatusFilter", contractorProjectsCache, "status");
    contractorRenderProjects();
  });
  var filterIds = ["projectSearch", "projectStatusFilter", "projectOverdueFilter"];
  for (var index = 0; index < filterIds.length; index += 1) {
    var filter = document.getElementById(filterIds[index]);
    if (filter) {
      filter.addEventListener(filter.tagName === "INPUT" ? "input" : "change", contractorRenderProjects);
    }
  }
  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-project-detail]");
    if (button) {
      contractorOpenProjectDetail(button.getAttribute("data-project-detail"));
    }
  });
  var projectFromUrl = new URLSearchParams(window.location.search).get("project");
  if (projectFromUrl) {
    contractorOpenProjectDetail(projectFromUrl);
  }
}

function contractorPopulateProjectChoices() {
  var projects = contractorGetRelevantProjects();
  var formSelect = document.getElementById("updateProjectId");
  var filterSelect = document.getElementById("updateProjectFilter");
  var previousFormValue = formSelect ? formSelect.value : "";
  var previousFilterValue = filterSelect ? filterSelect.value : "all";
  if (formSelect) {
    formSelect.innerHTML = projects.length ? '<option value="">Choose a relevant project</option>' : '<option value="">No relevant projects</option>';
  }
  if (filterSelect) {
    filterSelect.innerHTML = '<option value="all">All relevant projects</option>';
  }
  for (var index = 0; index < projects.length; index += 1) {
    var project = projects[index];
    var optionText = project.projectId + " · " + project.projectName;
    if (formSelect) {
      var formOption = document.createElement("option");
      formOption.value = project.projectId;
      formOption.textContent = optionText;
      formSelect.appendChild(formOption);
    }
    if (filterSelect) {
      var filterOption = document.createElement("option");
      filterOption.value = project.projectId;
      filterOption.textContent = optionText;
      filterSelect.appendChild(filterOption);
    }
  }
  if (formSelect && contractorIsRelevantProject(previousFormValue)) {
    formSelect.value = previousFormValue;
  }
  if (filterSelect && (previousFilterValue === "all" || contractorIsRelevantProject(previousFilterValue))) {
    filterSelect.value = previousFilterValue;
  }
}

function contractorUpdateProjectContext() {
  var select = document.getElementById("updateProjectId");
  var context = document.getElementById("updateProjectContext");
  if (!select || !context) {
    return;
  }
  var project = findRecord(contractorProjectsCache, "projectId", select.value);
  if (!project || !contractorIsRelevantProject(project.projectId)) {
    context.textContent = "Only projects reached through your bid and award chain are available.";
    return;
  }
  var path = contractorGetProjectPath(project);
  var latest = contractorGetLatestUpdate(project.projectId);
  context.textContent = (path ? path.bid.tenderId + " / " + path.bid.bidId + " -> " + path.award.awardId : "Award path unavailable") +
    " · Latest progress " + contractorFormatProgress(latest ? latest.progressPercent : 0);
}

function contractorUpdateMatchesFilters(update) {
  var search = document.getElementById("updateSearch");
  var projectFilter = document.getElementById("updateProjectFilter");
  var query = search ? search.value.toLowerCase().trim() : "";
  var selectedProject = projectFilter ? projectFilter.value : "all";
  var project = findRecord(contractorProjectsCache, "projectId", update.projectId);
  var searchableText = (update.projectId + " " + update.updateId + " " + update.workNote + " " +
    contractorGetUpdateAuthorName(update) + " " + (project ? project.projectName : "")).toLowerCase();
  return searchableText.indexOf(query) >= 0 && (selectedProject === "all" || update.projectId === selectedProject);
}

function contractorRenderUpdates() {
  var projects = contractorGetRelevantProjects();
  var updates = contractorGetRelevantUpdates();
  var ownUpdateCount = 0;
  var overdueCount = 0;
  var index;
  for (index = 0; index < updates.length; index += 1) {
    if (String(updates[index].repId) === String(currentRepresentativeId)) {
      ownUpdateCount += 1;
    }
  }
  for (index = 0; index < projects.length; index += 1) {
    if (isProjectOverdue(projects[index])) {
      overdueCount += 1;
    }
  }
  contractorSetText("updateProjectCount", projects.length);
  contractorSetText("updateRelevantCount", updates.length);
  contractorSetText("updateOwnCount", ownUpdateCount);
  contractorSetText("updateOverdueCount", overdueCount);

  var latestHolder = document.getElementById("updateLatestProjectList");
  if (latestHolder) {
    var latestHtml = '<div class="activity-list">';
    for (index = 0; index < projects.length; index += 1) {
      var project = projects[index];
      var latest = contractorGetLatestUpdate(project.projectId);
      latestHtml += '<div class="activity-item"><span class="activity-marker">' + escapeHtml(latest ? contractorFormatProgress(latest.progressPercent) : "0%") +
        "</span><div><h3>" + escapeHtml(project.projectId + " · " + project.projectName) + " " + createStatusBadge(project.status) +
        "</h3><p>" + escapeHtml(latest ? formatDate(latest.updateDate) + " · " + latest.workNote : "No progress update recorded") +
        "</p>" + contractorProgressBar(latest ? latest.progressPercent : 0) + "</div></div>";
    }
    latestHtml += "</div>";
    latestHolder.innerHTML = projects.length ? latestHtml : contractorEmptyState("PR", "No relevant projects", "A project must be reached through your Bid and Award before it can be updated.");
  }

  var rows = "";
  var visibleCount = 0;
  for (index = 0; index < updates.length; index += 1) {
    var update = updates[index];
    if (!contractorUpdateMatchesFilters(update)) {
      continue;
    }
    visibleCount += 1;
    var updateProject = findRecord(contractorProjectsCache, "projectId", update.projectId);
    rows += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(update.projectId + " / " + update.updateId) +
      '</span><span class="table-secondary-text">Project / Update ID</span></td><td>' +
      escapeHtml(updateProject ? updateProject.projectName : update.projectId) + "</td><td>" + escapeHtml(formatDate(update.updateDate)) +
      "</td><td><strong>" + escapeHtml(contractorFormatProgress(update.progressPercent)) + "</strong>" + contractorProgressBar(update.progressPercent) +
      "</td><td>" + escapeHtml(contractorGetUpdateAuthorName(update)) + '<span class="table-secondary-text">' + escapeHtml(update.repId) +
      "</span></td><td>" + escapeHtml(update.workNote) + '</td><td><button class="mini-action" type="button" data-update-detail="' +
      escapeHtml(update.projectId) + "|" + escapeHtml(update.updateId) + '">Details</button></td></tr>';
  }
  contractorSetText("updateResultCount", visibleCount + (visibleCount === 1 ? " record" : " records"));
  var body = document.getElementById("updateTableBody");
  if (body) {
    body.innerHTML = rows || '<tr><td colspan="7">' + contractorEmptyState("UP", "No matching updates", "Adjust the search or project filter.") + "</td></tr>";
  }
}

function contractorOpenUpdateDetail(compositeId) {
  var parts = compositeId.split("|");
  var update = null;
  var relevantUpdates = contractorGetRelevantUpdates();
  for (var index = 0; index < relevantUpdates.length; index += 1) {
    if (relevantUpdates[index].projectId === parts[0] && relevantUpdates[index].updateId === parts[1]) {
      update = relevantUpdates[index];
      break;
    }
  }
  if (!update) {
    showPageAlert("The selected relevant Project Update could not be found.", "danger");
    return;
  }
  var project = findRecord(contractorProjectsCache, "projectId", update.projectId);
  var path = contractorGetProjectPath(project);
  contractorSetText("updateDetailTitle", update.projectId + " / " + update.updateId);
  var body = document.getElementById("updateDetailBody");
  if (body) {
    body.innerHTML = '<ul class="detail-list">' +
      contractorDetailItem("ID", update.projectId + " / " + update.updateId) +
      contractorDetailItem("Project", project ? project.projectName : update.projectId) +
      contractorDetailItem("Award path", path ? path.bid.tenderId + " / " + path.bid.bidId + " -> " + path.award.awardId : "Unavailable") +
      contractorDetailItem("Created by", contractorGetUpdateAuthorName(update) + " (" + update.repId + ")") +
      contractorDetailItem("Update date", formatDate(update.updateDate)) +
      contractorDetailItem("Progress", contractorFormatProgress(update.progressPercent)) +
      contractorDetailItem("Work note", update.workNote) +
      "</ul>" + contractorProgressBar(update.progressPercent);
  }
  contractorShowModal("updateDetailModal");
}

function contractorSubmitUpdate(event) {
  event.preventDefault();
  var projectId = document.getElementById("updateProjectId").value;
  var updateDate = document.getElementById("updateDate").value;
  var progress = document.getElementById("updateProgress").value;
  var workNote = document.getElementById("updateWorkNote").value.trim();

  if (!projectId) {
    showPageAlert("Choose a valid project.", "danger");
    return;
  }

  var formData = new FormData();
  formData.append("projectId", projectId);
  formData.append("updateDate", updateDate);
  formData.append("progress", progress);
  formData.append("workNote", workNote);

  nirmanFetch("../../backend/actions/contractor/submit_progress_update.php", { method: "POST", body: formData })
    .then(function (r) { return r.json(); })
    .then(function (result) {
      if (result.success) {
        document.getElementById("projectUpdateForm").reset();
        document.getElementById("updateDate").value = contractorGetTodayValue();
        return contractorFetchMyProjects().then(function () {
          return contractorFetchAllProjectUpdateHistories();
        }).then(function () {
          contractorPopulateProjectChoices();
          contractorUpdateProjectContext();
          contractorRenderUpdates();
          showPageAlert(result.message, "success");
        });
      } else {
        showPageAlert(result.message, "danger");
      }
    })
    .catch(function (error) {
      showPageAlert("Something went wrong. Please try again.", "danger");
      console.error(error);
    });
}

function contractorInitializeUpdates() {
  contractorFetchMyProjects().then(function () {
    return contractorFetchAllProjectUpdateHistories();
  }).then(function () {
    contractorPopulateProjectChoices();
    contractorRenderUpdates();
    var projects = contractorGetRelevantProjects();
    var submitButton = document.getElementById("submitUpdateButton");
    if (submitButton) {
      submitButton.disabled = projects.length === 0;
    }
    var projectSelect = document.getElementById("updateProjectId");
    var projectFromUrl = new URLSearchParams(window.location.search).get("project");
    if (projectSelect && projectFromUrl && contractorIsRelevantProject(projectFromUrl)) {
      projectSelect.value = projectFromUrl;
    } else if (projectFromUrl) {
      showPageAlert("The requested project is not relevant to the current representative.", "danger");
    }
    contractorUpdateProjectContext();
  }).catch(function (error) {
    console.error("Representative project update load failed:", error);
    showPageAlert("Could not load project update history.", "danger");
  });

  var representativeDisplay = document.getElementById("updateRepresentativeDisplay");
  var updateDate = document.getElementById("updateDate");
  if (representativeDisplay) {
    representativeDisplay.value = contractorGetCurrentRepresentativeName() + " (" + currentRepresentativeId + ")";
  }
  if (updateDate) {
    updateDate.value = contractorGetTodayValue();
  }
  var projectSelect = document.getElementById("updateProjectId");
  if (projectSelect) {
    projectSelect.addEventListener("change", contractorUpdateProjectContext);
  }
  var form = document.getElementById("projectUpdateForm");
  if (form) {
    form.addEventListener("submit", contractorSubmitUpdate);
  }
  var search = document.getElementById("updateSearch");
  var filter = document.getElementById("updateProjectFilter");
  if (search) {
    search.addEventListener("input", contractorRenderUpdates);
  }
  if (filter) {
    filter.addEventListener("change", contractorRenderUpdates);
  }
  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-update-detail]");
    if (button) {
      contractorOpenUpdateDetail(button.getAttribute("data-update-detail"));
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var page = document.body.getAttribute("data-contractor-page");
  if (!page) {
    return;
  }
  fetch("../../backend/api/auth/get_current_user.php")
    .then(function (r) { return r.json(); })
    .then(function (result) {
      if (!result.loggedIn || result.role !== "contractor") {
        window.location.href = "../../login.html";
        return;
      }
      currentRepresentativeId = result.roleId;
      currentRepresentativeProfile = {
        representativeId: result.roleId,
        firstName: result.firstName,
        lastName: result.lastName,
        title: result.title,
        approvalStatus: result.approvalStatus,
        email: result.email,
        contactNo: result.contactNo
      };
      setNirmanCsrfToken(result.csrfToken);
      contractorRenderSharedIdentity();

      if (page === "dashboard") {
        contractorRenderDashboard();
      } else if (page === "profile") {
        contractorRenderProfile();
      } else if (page === "tenders") {
        contractorInitializeTenders();
      } else if (page === "bids") {
        contractorInitializeBids();
      } else if (page === "projects") {
        contractorInitializeProjects();
      } else if (page === "updates") {
        contractorInitializeUpdates();
      }
    })
    .catch(function () {
      window.location.href = "../../login.html";
    });
});
