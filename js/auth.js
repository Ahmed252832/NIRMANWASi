
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
    showAuthFeedback("loginFeedback", "Email or password is incorrect.", "danger");
    return;
  }

  var actualRole = getRoleForPerson(person.personId);
  if (actualRole !== selectedRole) {
    showAuthFeedback("loginFeedback", "This account does not match the selected role.", "warning");
    return;
  }

  if (actualRole === "contractor") {
    var representative = findRecord(nirmanData.contractorReps, "personId", person.personId);
    if (representative.approvalStatus !== "Approved") {
      showAuthFeedback("loginFeedback", "This representative account is waiting for admin approval.", "warning");
      return;
    }
  }

  var destination = "pages/" + actualRole + "/dashboard.html";
  showAuthFeedback("loginFeedback", "Login successful.", "success");
  window.setTimeout(function () {
    window.location.href = destination;
  }, 450);
}

function handleAdminLogin(event) {
  event.preventDefault();

  var email = document.getElementById("adminEmail").value.trim();
  var password = document.getElementById("adminPassword").value;
  var person = findPersonByEmail(email);

  if (!person || person.password !== password) {
    showAuthFeedback("adminFeedback", "Email or password is incorrect.", "danger");
    return;
  }

  var employee = findRecord(nirmanData.employees, "personId", person.personId);
  if (!employee || employee.designation !== "System Administrator") {
    showAuthFeedback("adminFeedback", "This employee does not have administrator access.", "warning");
    return;
  }

  showAuthFeedback("adminFeedback", "Login successful.", "success");
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
    showAuthFeedback("registerFeedback", "This email is already in use.", "warning");
    return;
  }

  var personNumber = nirmanData.people.length + 1;
  var newPersonId = String(personNumber);
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
    var newClientId = String(nirmanData.clients.length + 1);
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
    var newRepId = String(nirmanData.contractorReps.length + 1);
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
    "Account created for this session.",
    "success"
  );
  event.currentTarget.reset();
  updateRegistrationFields();
}

document.addEventListener("DOMContentLoaded", function () {
  var loginForm = document.getElementById("loginForm");
  var adminLoginForm = document.getElementById("adminLoginForm");
  var registrationForm = document.getElementById("registrationForm");
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

});
