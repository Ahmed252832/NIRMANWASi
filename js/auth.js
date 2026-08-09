"use strict";

function showAuthFeedback(elementId, message, type) {
  var feedbackElement = document.getElementById(elementId);
  if (!feedbackElement) {
    return;
  }

  feedbackElement.innerHTML =
    '<div class="alert alert-' + type + ' py-2" role="alert">' + escapeHtml(message) + "</div>";
}

function getRoleForPerson(personId) {
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

function findPersonByEmail(email) {
  var normalizedEmail = email.toLowerCase();
  for (var index = 0; index < nirmanData.people.length; index += 1) {
    if (nirmanData.people[index].email.toLowerCase() === normalizedEmail) {
      return nirmanData.people[index];
    }
  }
  return null;
}

function handleGeneralLogin(event) {
  event.preventDefault();

  var form = event.currentTarget;
  var selectedRole = form.querySelector('input[name="loginRole"]:checked').value;
  var email = document.getElementById("loginEmail").value.trim();
  var password = document.getElementById("loginPassword").value;
  var person = findPersonByEmail(email);

  if (!person || person.password !== password) {
    showAuthFeedback("loginFeedback", "The email or password does not match a mock account.", "danger");
    return;
  }

  var actualRole = getRoleForPerson(person.personId);
  if (actualRole !== selectedRole) {
    showAuthFeedback("loginFeedback", "This mock account does not belong to the selected role.", "warning");
    return;
  }

  if (actualRole === "contractor") {
    var representative = findRecord(nirmanData.contractorReps, "personId", person.personId);
    if (representative.approvalStatus !== "Approved") {
      showAuthFeedback("loginFeedback", "This representative account is awaiting Admin approval.", "warning");
      return;
    }
  }

  var destination = "pages/" + actualRole + "/dashboard.html";
  showAuthFeedback("loginFeedback", "Mock login successful. Opening your dashboard...", "success");
  window.setTimeout(function () {
    window.location.href = destination;
  }, 450);
}

function handleAdminLogin(event) {
  event.preventDefault();

  var email = document.getElementById("adminEmail").value.trim().toLowerCase();
  var password = document.getElementById("adminPassword").value;
  var matchingAdmin = null;

  for (var index = 0; index < nirmanData.adminAccounts.length; index += 1) {
    var account = nirmanData.adminAccounts[index];
    if (account.email.toLowerCase() === email && account.password === password) {
      matchingAdmin = account;
      break;
    }
  }

  if (!matchingAdmin) {
    showAuthFeedback("adminFeedback", "The Admin email or password is incorrect.", "danger");
    return;
  }

  showAuthFeedback("adminFeedback", "Mock Admin login successful. Opening the dashboard...", "success");
  window.setTimeout(function () {
    window.location.href = "pages/admin/dashboard.html";
  }, 450);
}

function updateRegistrationFields() {
  var selectedRole = document.querySelector('input[name="registerRole"]:checked');
  var clientFields = document.getElementById("clientRegistrationFields");
  var representativeFields = document.getElementById("representativeRegistrationFields");
  if (!selectedRole || !clientFields || !representativeFields) {
    return;
  }

  var isClient = selectedRole.value === "client";
  clientFields.hidden = !isClient;
  representativeFields.hidden = isClient;

  document.getElementById("clientNid").required = isClient;
  document.getElementById("representativeTitle").required = !isClient;
  document.getElementById("representativeContractor").required = !isClient;
}

function populateContractorOptions() {
  var contractorSelect = document.getElementById("representativeContractor");
  if (!contractorSelect) {
    return;
  }

  var options = '<option value="">Select contractor</option>';
  for (var index = 0; index < nirmanData.contractors.length; index += 1) {
    var contractor = nirmanData.contractors[index];
    options += '<option value="' + escapeHtml(contractor.contractorId) + '">' +
      escapeHtml(contractor.companyName) + "</option>";
  }
  contractorSelect.innerHTML = options;
}

function handleRegistration(event) {
  event.preventDefault();

  var selectedRole = document.querySelector('input[name="registerRole"]:checked').value;
  var password = document.getElementById("registerPassword").value;
  var confirmPassword = document.getElementById("confirmPassword").value;
  var email = document.getElementById("registerEmail").value.trim();

  if (password.length < 6) {
    showAuthFeedback("registerFeedback", "Password must contain at least 6 characters.", "danger");
    return;
  }

  if (password !== confirmPassword) {
    showAuthFeedback("registerFeedback", "Password and confirmation do not match.", "danger");
    return;
  }

  if (findPersonByEmail(email)) {
    showAuthFeedback("registerFeedback", "That email is already used by a mock account.", "warning");
    return;
  }

  var personNumber = nirmanData.people.length + 1;
  var newPersonId = "P" + String(personNumber).padStart(3, "0");
  var newPerson = {
    personId: newPersonId,
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    contactNo: document.getElementById("registerContact").value.trim(),
    email: email,
    password: password
  };

  nirmanData.people.push(newPerson);

  if (selectedRole === "client") {
    var newClientId = "C" + String(nirmanData.clients.length + 1).padStart(3, "0");
    nirmanData.clients.push({
      clientId: newClientId,
      personId: newPersonId,
      nid: document.getElementById("clientNid").value.trim()
    });
    nirmanData.clientContacts.push({
      clientId: newClientId,
      contactNo: newPerson.contactNo
    });

    var extraContact = document.getElementById("additionalContact").value.trim();
    if (extraContact) {
      nirmanData.clientContacts.push({ clientId: newClientId, contactNo: extraContact });
    }
  } else {
    var newRepId = "R" + String(nirmanData.contractorReps.length + 1).padStart(3, "0");
    nirmanData.contractorReps.push({
      repId: newRepId,
      personId: newPersonId,
      contractorId: document.getElementById("representativeContractor").value,
      approvalStatus: "Pending",
      title: document.getElementById("representativeTitle").value.trim()
    });
  }

  showAuthFeedback(
    "registerFeedback",
    "Prototype registration created for this page session. No database record was saved.",
    "success"
  );
  event.currentTarget.reset();
  updateRegistrationFields();
}

function fillDemoLogin(button) {
  var emailInput = document.getElementById("loginEmail") || document.getElementById("adminEmail");
  var passwordInput = document.getElementById("loginPassword") || document.getElementById("adminPassword");

  emailInput.value = button.getAttribute("data-demo-email");
  passwordInput.value = button.getAttribute("data-demo-password");

  var role = button.getAttribute("data-demo-role");
  if (role) {
    var roleInput = document.querySelector('input[name="loginRole"][value="' + role + '"]');
    if (roleInput) {
      roleInput.checked = true;
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var loginForm = document.getElementById("loginForm");
  var adminLoginForm = document.getElementById("adminLoginForm");
  var registrationForm = document.getElementById("registrationForm");
  var demoButtons = document.querySelectorAll("[data-demo-email]");
  var roleInputs = document.querySelectorAll('input[name="registerRole"]');

  if (loginForm) {
    loginForm.addEventListener("submit", handleGeneralLogin);
  }
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", handleAdminLogin);
  }
  if (registrationForm) {
    populateContractorOptions();
    updateRegistrationFields();
    registrationForm.addEventListener("submit", handleRegistration);
  }

  for (var roleIndex = 0; roleIndex < roleInputs.length; roleIndex += 1) {
    roleInputs[roleIndex].addEventListener("change", updateRegistrationFields);
  }

  for (var demoIndex = 0; demoIndex < demoButtons.length; demoIndex += 1) {
    demoButtons[demoIndex].addEventListener("click", function () {
      fillDemoLogin(this);
    });
  }
});
