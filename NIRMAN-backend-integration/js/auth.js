
function showAuthFeedback(elementId, message, type) {
  var feedbackElement = document.getElementById(elementId);
  if (!feedbackElement) {
    return;
  }

  feedbackElement.innerHTML =
    '<div class="alert alert-' + type + ' py-2" role="alert">' + escapeHtml(message) + "</div>";
}

function authFetchJson(url, options) {
  return fetch(url, options).then(function (response) {
    return response.json().then(function (data) {
      return { ok: response.ok, data: data };
    });
  });
}

function setAuthSubmitting(form, isSubmitting, pendingLabel) {
  var button = form.querySelector('button[type="submit"]');
  if (!button) return;
  if (!button.getAttribute("data-default-label")) {
    button.setAttribute("data-default-label", button.textContent);
  }
  button.disabled = isSubmitting;
  button.textContent = isSubmitting ? pendingLabel : button.getAttribute("data-default-label");
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

  setAuthSubmitting(form, true, "Checking account...");
  authFetchJson("backend/api/auth/login.php", { method: "POST", body: formData })
    .then(function (response) {
      var result = response.data;
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
    })
    .finally(function () { setAuthSubmitting(form, false, ""); });
}

function handleAdminLogin(event) {
  event.preventDefault();
  var form = event.currentTarget;
  var email = document.getElementById("adminEmail").value.trim();
  var password = document.getElementById("adminPassword").value;

  var formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  formData.append("role", "admin");

  setAuthSubmitting(form, true, "Checking authority...");
  authFetchJson("backend/api/auth/login.php", { method: "POST", body: formData })
    .then(function (response) {
      var result = response.data;
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
    })
    .finally(function () { setAuthSubmitting(form, false, ""); });
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
  authFetchJson("backend/api/public/get_contractors_list.php")
    .then(function (response) {
      var contractors = response.data;
      var options = '<option value="">Select contractor</option>';
      for (var index = 0; index < contractors.length; index += 1) {
        options += '<option value="' + escapeHtml(contractors[index].CONTRACTOR_ID) + '">' +
          escapeHtml(contractors[index].COMPANY_NAME) + "</option>";
      }
      contractorSelect.innerHTML = options;
    })
    .catch(function () {
      contractorSelect.innerHTML = '<option value="">Contractor list unavailable</option>';
      contractorSelect.disabled = true;
    });
}

function handleRegistration(event) {
  event.preventDefault();
  var formElement = event.currentTarget;
  var selectedRole = document.querySelector('input[name="registerRole"]:checked').value;
  var password = document.getElementById("registerPassword").value;
  var confirmPassword = document.getElementById("confirmPassword").value;
  var email = document.getElementById("registerEmail").value.trim();

  if (password.length < 6 || password.length > 72) {
    showAuthFeedback("registerFeedback", "Password must contain 6 to 72 characters.", "danger");
    return;
  }

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
    var clientPhoto = document.getElementById("registerProfilePhoto").files[0];
    if (clientPhoto) formData.append("profilePhoto", clientPhoto);

    setAuthSubmitting(formElement, true, "Creating account...");
    authFetchJson("backend/api/auth/register_client.php", {
      method: "POST",
      body: formData
    })
      .then(function (response) {
        var result = response.data;
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
      })
      .finally(function () { setAuthSubmitting(formElement, false, ""); });
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
  var representativePhoto = document.getElementById("registerProfilePhoto").files[0];
  if (representativePhoto) formData2.append("profilePhoto", representativePhoto);

  setAuthSubmitting(formElement, true, "Submitting for approval...");
  authFetchJson("backend/api/auth/registration_contractor.php", {
    method: "POST",
    body: formData2
  })
    .then(function (response) {
      var result = response.data;
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
    })
    .finally(function () { setAuthSubmitting(formElement, false, ""); });
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
