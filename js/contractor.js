
var currentRepresentativeId = "1";

function contractorSetText(elementId, value) {
  var element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

function contractorGetCurrentRepresentative() {
  return findRecord(nirmanData.contractorReps, "repId", currentRepresentativeId);
}

function contractorGetCurrentPerson() {
  var representative = contractorGetCurrentRepresentative();
  return representative ? findRecord(nirmanData.people, "personId", representative.personId) : null;
}

function contractorGetTender(tenderId) {
  return findRecord(nirmanData.tenders, "tenderId", tenderId);
}

function contractorGetAward(tenderId, bidId) {
  for (var index = 0; index < nirmanData.tenderAwards.length; index += 1) {
    var award = nirmanData.tenderAwards[index];
    if (award.tenderId === tenderId && award.bidId === bidId) {
      return award;
    }
  }
  return null;
}

function contractorGetProjectForAward(awardId) {
  return findRecord(nirmanData.projects, "awardId", awardId);
}

function contractorGetArea(areaId) {
  return findRecord(nirmanData.areas, "areaId", areaId);
}

function contractorGetPublishedTenders() {
  var publishedTenders = [];
  for (var index = 0; index < nirmanData.tenders.length; index += 1) {
    if (nirmanData.tenders[index].status === "Published") {
      publishedTenders.push(nirmanData.tenders[index]);
    }
  }
  return publishedTenders;
}

function contractorGetOwnBids() {
  var ownBids = [];
  for (var index = 0; index < nirmanData.tenderBids.length; index += 1) {
    if (nirmanData.tenderBids[index].repId === currentRepresentativeId) {
      ownBids.push(nirmanData.tenderBids[index]);
    }
  }
  return ownBids;
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
  var awards = contractorGetRelevantAwards();
  var projects = [];
  for (var index = 0; index < awards.length; index += 1) {
    var project = contractorGetProjectForAward(awards[index].awardId);
    if (project) {
      projects.push(project);
    }
  }
  return projects;
}

function contractorGetProjectPath(project) {
  if (!project) {
    return null;
  }
  var award = findRecord(nirmanData.tenderAwards, "awardId", project.awardId);
  if (!award) {
    return null;
  }
  var ownBids = contractorGetOwnBids();
  for (var index = 0; index < ownBids.length; index += 1) {
    var bid = ownBids[index];
    if (bid.tenderId === award.tenderId && bid.bidId === award.bidId) {
      return {
        bid: bid,
        award: award,
        tender: contractorGetTender(bid.tenderId)
      };
    }
  }
  return null;
}

function contractorIsRelevantProject(projectId) {
  var projects = contractorGetRelevantProjects();
  for (var index = 0; index < projects.length; index += 1) {
    if (projects[index].projectId === projectId) {
      return true;
    }
  }
  return false;
}

function contractorGetUpdatesForProject(projectId) {
  var updates = [];
  for (var index = 0; index < nirmanData.projectUpdates.length; index += 1) {
    if (nirmanData.projectUpdates[index].projectId === projectId) {
      updates.push(nirmanData.projectUpdates[index]);
    }
  }
  contractorSortUpdatesNewestFirst(updates);
  return updates;
}

function contractorGetRelevantUpdates() {
  var updates = [];
  for (var index = 0; index < nirmanData.projectUpdates.length; index += 1) {
    var update = nirmanData.projectUpdates[index];
    if (contractorIsRelevantProject(update.projectId)) {
      updates.push(update);
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
  var updates = contractorGetUpdatesForProject(projectId);
  return updates.length > 0 ? updates[0] : null;
}

function contractorTenderDeadlinePassed(tender) {
  return new Date(tender.deadline + "23:59:59") < new Date();
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
  var title = representative ? representative.title + " / " + representative.approvalStatus : "Account unavailable";
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
  var representative = contractorGetCurrentRepresentative();
  var contractor = representative ? findRecord(nirmanData.contractors, "contractorId", representative.contractorId) : null;
  var publishedTenders = contractorGetPublishedTenders();
  var ownBids = contractorGetOwnBids();
  var relevantAwards = contractorGetRelevantAwards();
  var relevantProjects = contractorGetRelevantProjects();
  var index;

  contractorSetText("dashboardPublishedCount", publishedTenders.length);
  contractorSetText("dashboardBidCount", ownBids.length);
  contractorSetText("dashboardAwardCount", relevantAwards.length);
  contractorSetText("dashboardProjectCount", relevantProjects.length);

  var representativeSummary = document.getElementById("dashboardRepresentativeSummary");
  if (representativeSummary && representative) {
    representativeSummary.innerHTML = '<ul class="detail-list">' +
      contractorDetailItem("Representative", getRepresentativeName(representative.repId)) +
      contractorDetailItem("Representative ID", representative.repId) +
      contractorDetailItem("Title", representative.title) +
      contractorDetailHtmlItem("Approval", createStatusBadge(representative.approvalStatus)) +
      "</ul>";
  }

  var contractorSummary = document.getElementById("dashboardContractorSummary");
  if (contractorSummary && contractor) {
    contractorSummary.innerHTML = '<ul class="detail-list">' +
      contractorDetailItem("Contractor", contractor.companyName) +
      contractorDetailItem("Contractor ID", contractor.contractorId) +
      contractorDetailItem("License", contractor.licenseNo) +
      "</ul>";
  }

  var tenderBody = document.getElementById("dashboardTenderBody");
  if (tenderBody) {
    var tenderRows = "";
    for (index = 0; index < publishedTenders.length; index += 1) {
      var tender = publishedTenders[index];
      tenderRows += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(tender.tenderId) +
        '</span><span class="table-secondary-text">' + escapeHtml(tender.title) + "</span></td><td>" +
        escapeHtml(tender.task) + "</td><td>" + formatDate(tender.deadline) + "</td><td>" +
        contractorGetOwnBidsForTender(tender.tenderId).length + '</td><td><a class="mini-action" href="tenders.html">Open</a></td></tr>';
    }
    tenderBody.innerHTML = tenderRows || '<tr><td colspan="5">' + contractorEmptyState("TN", "No published tenders", "There are no published opportunities right now.") + "</td></tr>";
  }

  var bidStatusList = document.getElementById("dashboardBidStatusList");
  if (bidStatusList) {
    var bidHtml = '<div class="activity-list">';
    for (index = 0; index < ownBids.length; index += 1) {
      var bid = ownBids[index];
      var bidTender = contractorGetTender(bid.tenderId);
      bidHtml += '<div class="activity-item"><span class="activity-marker">BD</span><div><h3>' +
        escapeHtml(bid.tenderId + " / " + bid.bidId) + " " + createStatusBadge(bid.bidStatus) + "</h3><p>" +
        escapeHtml(bidTender ? bidTender.title : "Tender unavailable") + " · " + escapeHtml(formatCurrency(bid.bidAmount)) + "</p></div></div>";
    }
    bidHtml += "</div>";
    bidStatusList.innerHTML = ownBids.length ? bidHtml : contractorEmptyState("BD", "No bids submitted", "Your submitted bids will appear here.");
  }

  var projectList = document.getElementById("dashboardProjectList");
  if (projectList) {
    var projectHtml = '<div class="activity-list">';
    for (index = 0; index < relevantProjects.length; index += 1) {
      var project = relevantProjects[index];
      var path = contractorGetProjectPath(project);
      var latest = contractorGetLatestUpdate(project.projectId);
      projectHtml += '<div class="activity-item"><span class="activity-marker">PR</span><div><h3><a href="projects.html?project=' +
        encodeURIComponent(project.projectId) + '">' + escapeHtml(project.projectName) + "</a> " + createStatusBadge(project.status) +
        "</h3><p>" + escapeHtml(path ? path.tender.tenderId + " / " + path.bid.bidId + " -> " + path.award.awardId : "Award path unavailable") +
        " · Latest progress " + escapeHtml(contractorFormatProgress(latest ? latest.progressPercent : 0)) + "</p></div></div>";
    }
    projectHtml += "</div>";
    projectList.innerHTML = relevantProjects.length ? projectHtml : contractorEmptyState("PR", "No awarded projects", "A project appears after your bid matches an award and project.");
  }

  var recentUpdates = document.getElementById("dashboardRecentUpdates");
  if (recentUpdates) {
    var updates = contractorGetRelevantUpdates();
    var recentHtml = '<div class="timeline-list">';
    var recentLimit = Math.min(updates.length, 5);
    for (index = 0; index < recentLimit; index += 1) {
      var update = updates[index];
      var updateProject = findRecord(nirmanData.projects, "projectId", update.projectId);
      recentHtml += '<div class="timeline-item"><span class="timeline-dot"></span><div class="timeline-content"><h3>' +
        escapeHtml(updateProject ? updateProject.projectName : update.projectId) + " · " + escapeHtml(contractorFormatProgress(update.progressPercent)) +
        '</h3><p>' + escapeHtml(update.workNote) + '</p><span class="timeline-date">' + escapeHtml(formatDate(update.updateDate)) +
        " · " + escapeHtml(update.projectId + " / " + update.updateId) + "</span></div></div>";
    }
    recentHtml += "</div>";
    recentUpdates.innerHTML = updates.length ? recentHtml : contractorEmptyState("UP", "No progress updates", "Relevant project updates will appear here.");
  }
}

function contractorRenderProfile() {
  var representative = contractorGetCurrentRepresentative();
  var person = contractorGetCurrentPerson();
  if (!representative || !person) {
    showPageAlert("The current representative profile could not be found.", "danger");
    return;
  }
  var contractor = findRecord(nirmanData.contractors, "contractorId", representative.contractorId);
  var fullName = person.firstName + " " + person.lastName;
  var profileHeader = document.getElementById("profileHeader");
  if (profileHeader) {
    profileHeader.innerHTML = '<span class="profile-avatar">' + escapeHtml(contractorGetInitials(person)) +
      '</span><div><h2 id="profileHeaderName">' + escapeHtml(fullName) + "</h2><p>" + escapeHtml(representative.title) +
      " · " + escapeHtml(representative.repId) + " · " + createStatusBadge(representative.approvalStatus) + "</p></div>";
  }

  var personDetails = document.getElementById("profilePersonDetails");
  if (personDetails) {
    personDetails.innerHTML = contractorDetailItem("Person ID", person.personId) +
      contractorDetailItem("First name", person.firstName) +
      contractorDetailItem("Last name", person.lastName) +
      contractorDetailItem("Contact number", person.contactNo) +
      contractorDetailItem("Email", person.email);
  }

  var representativeDetails = document.getElementById("profileRepresentativeDetails");
  if (representativeDetails) {
    representativeDetails.innerHTML = contractorDetailItem("Representative ID", representative.repId) +
      contractorDetailItem("Person ID", representative.personId) +
      contractorDetailItem("Title", representative.title) +
      contractorDetailHtmlItem("Approval status", createStatusBadge(representative.approvalStatus)) +
      contractorDetailItem("Contractor ID", representative.contractorId);
  }

  var contractorDetails = document.getElementById("profileContractorDetails");
  var licenseBadge = document.getElementById("profileLicenseBadge");
  if (contractor) {
    var licenseState = new Date(contractor.licenseDue + "23:59:59") < new Date() ? "Expired" : "Active";
    if (licenseBadge) {
      licenseBadge.innerHTML = createStatusBadge(licenseState);
    }
    if (contractorDetails) {
      contractorDetails.innerHTML = contractorDetailItem("Contractor ID", contractor.contractorId) +
        contractorDetailItem("Company name", contractor.companyName) +
        contractorDetailItem("License number", contractor.licenseNo) +
        contractorDetailItem("License due", formatDate(contractor.licenseDue)) +
        contractorDetailHtmlItem("License state", createStatusBadge(licenseState));
    }
  }

  var otherHolder = document.getElementById("profileOtherRepresentatives");
  if (otherHolder) {
    var otherHtml = '<div class="activity-list">';
    var otherCount = 0;
    for (var index = 0; index < nirmanData.contractorReps.length; index += 1) {
      var other = nirmanData.contractorReps[index];
      if (other.contractorId === representative.contractorId && other.repId !== representative.repId) {
        otherCount += 1;
        otherHtml += '<div class="activity-item"><span class="activity-marker">RP</span><div><h3>' +
          escapeHtml(getRepresentativeName(other.repId)) + " " + createStatusBadge(other.approvalStatus) + "</h3><p>" +
          escapeHtml(other.repId + " · " + other.title) + "</p></div></div>";
      }
    }
    otherHtml += "</div>";
    otherHolder.innerHTML = otherCount ? otherHtml : contractorEmptyState("RP", "No other representatives", "No additional representative is recorded for this Contractor.");
  }
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
      ? "Tanvir Hasan is Approved. Bids may be submitted on Published tenders until their deadline."
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
      "</td><td>" + formatDate(tender.day) + "</td><td>" + formatDate(tender.deadline) +
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
      ownBidHtml += "<li>" + escapeHtml(ownBids[index].tenderId + " / " + ownBids[index].bidId) + " · " +
        escapeHtml(formatCurrency(ownBids[index].bidAmount)) + " · " + createStatusBadge(ownBids[index].bidStatus) + "</li>";
    }
    body.innerHTML = '<ul class="detail-list">' +
      contractorDetailItem("Tender ID", tender.tenderId) +
      contractorDetailItem("Title", tender.title) +
      contractorDetailItem("Task", tender.task) +
      contractorDetailItem("Bid instructions", tender.bidDetails) +
      contractorDetailHtmlItem("Status", createStatusBadge(tender.status)) +
      contractorDetailItem("Published by", getEmployeeName(tender.employeeId) + " (" + tender.employeeId + ")") +
      contractorDetailItem("Published date", formatDate(tender.day)) +
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
    automaticDetails.innerHTML = contractorDetailItem("Representative", getRepresentativeName(currentRepresentativeId) + " (" + currentRepresentativeId + ")") +
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
  var representative = contractorGetCurrentRepresentative();
  var tenderId = document.getElementById("bidTenderId").value;
  var bidId = document.getElementById("bidId").value.trim();
  var amountText = document.getElementById("bidAmount").value;
  var amount = Number(amountText);
  var tender = contractorGetTender(tenderId);

  if (!representative || representative.approvalStatus !== "Approved") {
    contractorShowBidFormError("Only an Approved representative can submit a bid.");
    return;
  }
  if (!tender || tender.status !== "Published") {
    contractorShowBidFormError("The selected tender is not Published.");
    return;
  }
  if (contractorTenderDeadlinePassed(tender)) {
    contractorShowBidFormError("The tender deadline has passed.");
    return;
  }
  if (!bidId || !/^[A-Za-z0-9-]+$/.test(bidId)) {
    contractorShowBidFormError("Enter a Bid ID using only letters, numbers, and hyphens.");
    return;
  }
  if (!amountText || !Number.isFinite(amount) || amount <= 0) {
    contractorShowBidFormError("Enter a valid bid amount greater than zero.");
    return;
  }
  for (var index = 0; index < nirmanData.tenderBids.length; index += 1) {
    var existingBid = nirmanData.tenderBids[index];
    if (existingBid.tenderId === tenderId && existingBid.bidId.toLowerCase() === bidId.toLowerCase()) {
      contractorShowBidFormError("That Tender ID and Bid ID already exist.");
      return;
    }
  }
  if (!window.confirm("Submit bid " + tenderId + " / " + bidId + " for " + formatCurrency(amount) + "?")) {
    return;
  }
  nirmanData.tenderBids.push({
    tenderId: tenderId,
    bidId: bidId,
    repId: currentRepresentativeId,
    bidStatus: "Under Review",
    bidAmount: amount
  });
  contractorHideModal("bidSubmissionModal");
  contractorRenderTenders();
  showPageAlert("bid " + tenderId + " / " + bidId + " was added for this session.", "success");
}

function contractorInitializeTenders() {
  contractorRenderTenders();
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
    var tender = contractorGetTender(bid.tenderId);
    rows += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(bid.tenderId + " / " + bid.bidId) +
      '</span><span class="table-secondary-text">Tender / Bid ID</span></td><td><span class="table-primary-text">' +
      escapeHtml(tender ? tender.title : "Tender unavailable") + '</span><span class="table-secondary-text">' +
      escapeHtml(tender ? tender.task : bid.tenderId) + "</span></td><td>" + escapeHtml(formatCurrency(bid.bidAmount)) +
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
  var tender = contractorGetTender(bid.tenderId);
  var award = contractorGetAward(bid.tenderId, bid.bidId);
  var project = award ? contractorGetProjectForAward(award.awardId) : null;
  contractorSetText("bidDetailTitle", bid.tenderId + " / " + bid.bidId + " details");
  var body = document.getElementById("bidDetailBody");
  if (body) {
    var html = '<h3 class="h6">Tender Bid</h3><ul class="detail-list">' +
      contractorDetailItem("ID", bid.tenderId + " / " + bid.bidId) +
      contractorDetailItem("Representative", getRepresentativeName(bid.repId) + " (" + bid.repId + ")") +
      contractorDetailItem("Bid amount", formatCurrency(bid.bidAmount)) +
      contractorDetailHtmlItem("Bid status", createStatusBadge(bid.bidStatus)) + "</ul>";
    if (tender) {
      html += '<h3 class="h6 mt-4">Tender context</h3><ul class="detail-list">' +
        contractorDetailItem("Tender", tender.tenderId + " · " + tender.title) +
        contractorDetailItem("Task", tender.task) +
        contractorDetailHtmlItem("Tender status", createStatusBadge(tender.status)) +
        contractorDetailItem("Deadline", formatDate(tender.deadline)) + "</ul>";
    }
    if (award) {
      html += '<h3 class="h6 mt-4">Matching Award</h3><ul class="detail-list">' +
        contractorDetailItem("Award ID", award.awardId) +
        contractorDetailItem("Tender / Bid ID", award.tenderId + " / " + award.bidId) +
        contractorDetailItem("Award amount", formatCurrency(award.awardAmount)) +
        contractorDetailItem("Award date", formatDate(award.awardDate)) +
        contractorDetailItem("Issued by", getEmployeeName(award.employeeId) + " (" + award.employeeId + ")") + "</ul>";
    } else {
      html += contractorEmptyState("AW", "No matching Award", "No Award currently matches this Tender ID / Bid ID.");
    }
    if (project) {
      html += '<div class="info-callout mt-4">Resulting Project: <a href="projects.html?project=' + encodeURIComponent(project.projectId) + '"><strong>' +
        escapeHtml(project.projectId + " · " + project.projectName) + "</strong></a></div>";
    }
    body.innerHTML = html;
  }
  contractorShowModal("bidDetailModal");
}

function contractorInitializeBids() {
  var ownBids = contractorGetOwnBids();
  contractorPopulateSelectWithStatuses("bidStatusFilter", ownBids, "bidStatus");
  contractorRenderBids();
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
  var project = findRecord(nirmanData.projects, "projectId", projectId);
  if (!project || !contractorIsRelevantProject(projectId)) {
    showPageAlert("That project is not relevant to the current representative's awarded bids.", "danger");
    return;
  }
  var path = contractorGetProjectPath(project);
  var area = contractorGetArea(project.areaId);
  var updates = contractorGetUpdatesForProject(project.projectId);
  var latest = updates.length ? updates[0] : null;
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
          " · " + escapeHtml(getRepresentativeName(update.repId)) + "</span></div></div>";
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
}

function contractorInitializeProjects() {
  var projects = contractorGetRelevantProjects();
  contractorPopulateSelectWithStatuses("projectStatusFilter", projects, "status");
  contractorRenderProjects();
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
  var project = findRecord(nirmanData.projects, "projectId", select.value);
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
  var project = findRecord(nirmanData.projects, "projectId", update.projectId);
  var searchableText = (update.projectId + " " + update.updateId + " " + update.workNote + " " +
    getRepresentativeName(update.repId) + " " + (project ? project.projectName : "")).toLowerCase();
  return searchableText.indexOf(query) >= 0 && (selectedProject === "all" || update.projectId === selectedProject);
}

function contractorRenderUpdates() {
  var projects = contractorGetRelevantProjects();
  var updates = contractorGetRelevantUpdates();
  var ownUpdateCount = 0;
  var overdueCount = 0;
  var index;
  for (index = 0; index < updates.length; index += 1) {
    if (updates[index].repId === currentRepresentativeId) {
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
    var updateProject = findRecord(nirmanData.projects, "projectId", update.projectId);
    rows += "<tr><td><span class=\"table-primary-text\">" + escapeHtml(update.projectId + " / " + update.updateId) +
      '</span><span class="table-secondary-text">Project / Update ID</span></td><td>' +
      escapeHtml(updateProject ? updateProject.projectName : update.projectId) + "</td><td>" + escapeHtml(formatDate(update.updateDate)) +
      "</td><td><strong>" + escapeHtml(contractorFormatProgress(update.progressPercent)) + "</strong>" + contractorProgressBar(update.progressPercent) +
      "</td><td>" + escapeHtml(getRepresentativeName(update.repId)) + '<span class="table-secondary-text">' + escapeHtml(update.repId) +
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
  var project = findRecord(nirmanData.projects, "projectId", update.projectId);
  var path = contractorGetProjectPath(project);
  contractorSetText("updateDetailTitle", update.projectId + " / " + update.updateId);
  var body = document.getElementById("updateDetailBody");
  if (body) {
    body.innerHTML = '<ul class="detail-list">' +
      contractorDetailItem("ID", update.projectId + " / " + update.updateId) +
      contractorDetailItem("Project", project ? project.projectName : update.projectId) +
      contractorDetailItem("Award path", path ? path.bid.tenderId + " / " + path.bid.bidId + " -> " + path.award.awardId : "Unavailable") +
      contractorDetailItem("Created by", getRepresentativeName(update.repId) + " (" + update.repId + ")") +
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
  var updateId = document.getElementById("updateId").value.trim();
  var updateDate = document.getElementById("updateDate").value;
  var progressText = document.getElementById("updateProgress").value;
  var progress = Number(progressText);
  var workNote = document.getElementById("updateWorkNote").value.trim();
  var project = findRecord(nirmanData.projects, "projectId", projectId);

  if (!project || !contractorIsRelevantProject(projectId)) {
    showPageAlert("Choose a valid project reached through your Bid and matching Award.", "danger");
    return;
  }
  if (!updateId || !/^[A-Za-z0-9-]+$/.test(updateId)) {
    showPageAlert("Enter an Update ID using only letters, numbers, and hyphens.", "danger");
    return;
  }
  if (!updateDate || !workNote) {
    showPageAlert("Enter an update date and work note.", "danger");
    return;
  }
  if (progressText === "" || !Number.isFinite(progress) || progress < 0 || progress > 100) {
    showPageAlert("Progress must be a number from 0 to 100.", "danger");
    return;
  }
  for (var index = 0; index < nirmanData.projectUpdates.length; index += 1) {
    var existingUpdate = nirmanData.projectUpdates[index];
    if (existingUpdate.projectId === projectId && existingUpdate.updateId.toLowerCase() === updateId.toLowerCase()) {
      showPageAlert("That Project ID and Update ID already exist.", "danger");
      return;
    }
  }
  if (!window.confirm("Add update " + projectId + " / " + updateId + " at " + contractorFormatProgress(progress) + "?")) {
    return;
  }
  nirmanData.projectUpdates.push({
    projectId: projectId,
    updateId: updateId,
    repId: currentRepresentativeId,
    updateDate: updateDate,
    workNote: workNote,
    progressPercent: progress
  });
  document.getElementById("projectUpdateForm").reset();
  document.getElementById("updateRepresentativeDisplay").value = getRepresentativeName(currentRepresentativeId) + " (" + currentRepresentativeId + ")";
  document.getElementById("updateDate").value = contractorGetTodayValue();
  contractorPopulateProjectChoices();
  contractorUpdateProjectContext();
  contractorRenderUpdates();
  showPageAlert("update " + projectId + " / " + updateId + " was added for this session.", "success");
}

function contractorInitializeUpdates() {
  contractorPopulateProjectChoices();
  contractorRenderUpdates();
  var representativeDisplay = document.getElementById("updateRepresentativeDisplay");
  var updateDate = document.getElementById("updateDate");
  var projectSelect = document.getElementById("updateProjectId");
  var submitButton = document.getElementById("submitUpdateButton");
  var projects = contractorGetRelevantProjects();
  if (representativeDisplay) {
    representativeDisplay.value = getRepresentativeName(currentRepresentativeId) + " (" + currentRepresentativeId + ")";
  }
  if (updateDate) {
    updateDate.value = contractorGetTodayValue();
  }
  if (submitButton) {
    submitButton.disabled = projects.length === 0;
  }
  var projectFromUrl = new URLSearchParams(window.location.search).get("project");
  if (projectSelect && projectFromUrl && contractorIsRelevantProject(projectFromUrl)) {
    projectSelect.value = projectFromUrl;
  } else if (projectFromUrl) {
    showPageAlert("The requested project is not relevant to the current representative.", "danger");
  }
  contractorUpdateProjectContext();
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
  if (!page || typeof nirmanData === "undefined") {
    return;
  }
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
});
