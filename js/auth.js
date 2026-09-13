
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

  var formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  formData.append("role", selectedRole);

  fetch("login.php", { method: "POST", body: formData })
    .then(function (response) { return response.json(); })
    .then(function (result) {
      if (result.success) {
        showAuthFeedback("loginFeedback", result.message, "success");
        window.setTimeout(function () {
          window.location.href = result.destination;
        }, 450);
      } else {
        showAuthFeedback("loginFeedback", result.message, "danger");
      }
    })
    .catch(function (error) {
      showAuthFeedback("loginFeedback", "Something went wrong. Please try again.", "danger");
      console.error(error);
    });
}

function handleAdminLogin(event) {
  event.preventDefault();
  var email = document.getElementById("adminEmail").value.trim();
  var password = document.getElementById("adminPassword").value;

  var formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  formData.append("role", "admin");

  fetch("login.php", { method: "POST", body: formData })
    .then(function (response) { return response.json(); })
    .then(function (result) {
      if (result.success) {
        showAuthFeedback("adminFeedback", result.message, "success");
        window.setTimeout(function () {
          window.location.href = result.destination;
        }, 450);
      } else {
        showAuthFeedback("adminFeedback", result.message, "danger");
      }
    })
    .catch(function (error) {
      showAuthFeedback("adminFeedback", "Something went wrong. Please try again.", "danger");
      console.error(error);
    });
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
  fetch("get_contractors_list.php")
    .then(function (r) { return r.json(); })
    .then(function (contractors) {
      var options = '<option value="">Select contractor</option>';
      for (var index = 0; index < contractors.length; index += 1) {
        options += '<option value="' + escapeHtml(contractors[index].CONTRACTOR_ID) + '">' +
          escapeHtml(contractors[index].COMPANY_NAME) + "</option>";
      }
      contractorSelect.innerHTML = options;
    });
}

function handleRegistration(event) {
  event.preventDefault();
  var formElement = event.currentTarget;
  var selectedRole = document.querySelector('input[name="registerRole"]:checked').value;
  var password = document.getElementById("registerPassword").value;
  var confirmPassword = document.getElementById("confirmPassword").value;
  var email = document.getElementById("registerEmail").value.trim();

  // if (password.length < 6) {
  //   showAuthFeedback("registerFeedback", "Password must contain at least 6 characters.", "danger");
  //   return;
  // }

  if (password !== confirmPassword) {
    showAuthFeedback("registerFeedback", "Password and confirmation do not match.", "danger");
    return;
  }

  if (selectedRole === "client") {
    var formData = new FormData();
    formData.append("firstName", document.getElementById("firstName").value.trim());
    formData.append("lastName", document.getElementById("lastName").value.trim());
    formData.append("contactNo", document.getElementById("registerContact").value.trim());
    formData.append("email", email);
    formData.append("password", password);
    formData.append("nid", document.getElementById("clientNid").value.trim());
    formData.append("additionalContact", document.getElementById("additionalContact").value.trim());

    fetch("register_client.php", {
      method: "POST",
      body: formData
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if (result.success) {
       showAuthFeedback("registerFeedback", result.message, "success");
      formElement.reset();
       updateRegistrationFields();
      } else {
       showAuthFeedback("registerFeedback", result.message, "warning");
}
      })
      .catch(function (error) {
        showAuthFeedback("registerFeedback", "Something went wrong. Please try again.", "danger");
        console.error(error);
      });
    return; // stop here for client — the fetch above handles everything
  }

  // Contractor Representative registration
  var formData2 = new FormData();
  formData2.append("firstName", document.getElementById("firstName").value.trim());
  formData2.append("lastName", document.getElementById("lastName").value.trim());
  formData2.append("contactNo", document.getElementById("registerContact").value.trim());
  formData2.append("email", email);
  formData2.append("password", password);
  formData2.append("title", document.getElementById("representativeTitle").value.trim());
  formData2.append("contractorId", document.getElementById("representativeContractor").value);

  fetch("registration_contractor.php", {
    method: "POST",
    body: formData2
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      if (result.success) {
        showAuthFeedback("registerFeedback", result.message, "success");
        formElement.reset();
        updateRegistrationFields();
      } else {
        showAuthFeedback("registerFeedback", result.message, "warning");
      }
    })
    .catch(function (error) {
      showAuthFeedback("registerFeedback", "Something went wrong. Please try again.", "danger");
      console.error(error);
    });
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
