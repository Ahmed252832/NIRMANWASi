# 1. Actual Backend Architecture

The current request path is:

`HTML form/page` -> `js/auth.js`, `js/client.js`, or `js/contractor.js` -> `fetch()` POST/GET -> a PHP endpoint -> `require_once 'config/db.php'` -> `getConnection()` -> PHP OCI8 functions -> Oracle database -> JSON response -> JavaScript updates the page or redirects.

Most PHP endpoints are small procedural API files rather than controllers in a framework. They read request/session values, run SQL, and return JSON.

# 2. Important Backend Files

| File | Purpose | Called by | Main database table(s) |
|---|---|---|---|
| `config/db.php` | Expected connection file providing `getConnection()` | Almost every database PHP endpoint | All tables indirectly |
| `login.php` | Checks password and role, then creates the session | `js/auth.js` from `login.html` and `admin-login.html` | `Person`, `Employee`, `Client`, `Contractor_Rep` |
| `book_unit.php` | Creates a client booking and marks its unit booked | `js/client.js`, `pages/client/bookings.html` | `Booking`, `Flats_Units` |
| `make_payment.php` | Creates a pending payment for the logged-in client | `js/client.js`, `pages/client/payments.html` | `Payments`, `Booking`, `Employee` |
| `submit_bid.php` | Submits an approved representative's bid | `js/contractor.js`, `pages/contractor/tenders.html` | `Tender_Bids`, `Tenders`, `Contractor_Rep` |
| `file_complaint.php` | Creates a pending client complaint | `js/client.js`, `pages/client/complaints.html` | `Complaints`, `Employee` |
| `submit_progress_update.php` | Adds progress to a project linked to the representative | `js/contractor.js`, `pages/contractor/updates.html` | `Project_Update`, `Construction_Project`, `Tender_Award`, `Tender_Bids` |

# 3. Database Connection

Endpoints use exactly `require_once 'config/db.php';`, then `$conn = getConnection();`. However, this folder currently has only `config/db.example.php`; the required `config/db.php` is absent. The example connects as `SYSTEM` to `localhost/XE` and contains a placeholder password.

| OCI8 function | Meaning |
|---|---|
| `oci_connect()` | Opens an Oracle connection. |
| `oci_parse()` | Prepares an SQL statement. |
| `oci_bind_by_name()` | Safely supplies a PHP value to an SQL placeholder such as `:email`. |
| `oci_execute()` | Runs the prepared SQL; `OCI_NO_AUTO_COMMIT` keeps a transaction open. |
| `oci_fetch_assoc()` | Reads one result row as an associative array. |
| `oci_commit()` | Permanently saves a transaction. |
| `oci_rollback()` | Cancels the current transaction after failure. |
| `oci_error()` | Gets Oracle error information. |

# 4. Login and Session Flow

`login.html` form `#loginForm` (employee/client/representative) or `admin-login.html` form `#adminLoginForm` -> `js/auth.js` (`handleGeneralLogin()` or `handleAdminLogin()`) -> POST `email`, `password`, and `role` to `login.php` -> query `Person` by email -> `password_verify()` -> query `Employee`, then `Client`, then `Contractor_Rep` to determine the real role. A representative must have `Approval_status = 'Approved'`; designation `System Administrator` becomes role `admin`.

On success, `login.php` calls `session_start()` and sets:

- `$_SESSION['person_id']`
- `$_SESSION['role']`
- `$_SESSION['role_id']` (`Emp_id`, `Cl_id`, or `Rep_id`)
- `$_SESSION['first_name']`

It returns JSON containing `success`, `message`, `role`, and `destination`. `js/auth.js` redirects to `pages/{role}/dashboard.html`. Failure returns JSON and the page shows the message; PHP does not issue a redirect header.

# 5. Five Important End-to-End Flows

## Login
`login.html` or `admin-login.html` -> `js/auth.js` -> `login.php` -> SELECT person and role, verify password, create session -> `Person`, `Employee`, `Client`, `Contractor_Rep` -> JSON result and JavaScript redirect.

## Client Booking
`pages/client/bookings.html` form `#bookingForm` -> `js/client.js` -> `book_unit.php` -> SELECT unit status, INSERT booking, UPDATE unit to `Booked`, commit -> `Flats_Units`, `Booking` -> JSON success with generated `bookingId`.

## Payment
`pages/client/payments.html` form `#paymentForm` -> `js/client.js` -> `make_payment.php` -> verify booking ownership, select a temporary employee verifier, INSERT `Pending` payment, commit -> `Booking`, `Employee`, `Payments` -> JSON success with generated `paymentId`.

## Tender Bid
`pages/contractor/tenders.html` form `#bidSubmissionForm` -> `js/contractor.js` -> `submit_bid.php` -> confirm approved representative and published tender, INSERT bid as `Under Review` -> `Contractor_Rep`, `Tenders`, `Tender_Bids` -> JSON success with generated `bidId`.

## Complaint
`pages/client/complaints.html` form `#complaintForm` -> `js/client.js` -> `file_complaint.php` -> choose a temporary employee, INSERT complaint as `Pending`, commit -> `Employee`, `Complaints` -> JSON success with generated `complaintId`.

# 6. PHP Concepts Actually Used

| Concept | Simple meaning | Example file |
|---|---|---|
| `$_POST` | Reads form data sent by JavaScript. | `book_unit.php` |
| `$_GET` | Reads a value from the URL query string. | `get_project_update_history.php` |
| `$_SESSION` | Stores and reads the logged-in user's identity and role. | `login.php`, `make_payment.php` |
| `session_start()` | Opens or resumes the PHP session. | `login.php` |
| `require_once` | Loads the connection file once. | `submit_bid.php` |
| `header()` | Sets responses to JSON content type. | `login.php` |
| `json_encode()` | Converts a PHP array into JSON for JavaScript. | `file_complaint.php` |
| `oci_connect()` | Connects PHP to Oracle. | `config/db.example.php` |
| `oci_parse()` | Prepares SQL. | `submit_progress_update.php` |
| `oci_bind_by_name()` | Binds input to named SQL parameters. | `login.php` |
| `oci_execute()` | Executes SQL. | `book_unit.php` |
| `oci_fetch_assoc()` | Fetches a database row by column name. | `login.php` |

# 7. Current Backend Status

Login, registration, profiles/lists, booking/allocation, payments, complaints, tenders/bids/awards, and project updates have PHP/Oracle endpoints called by frontend JavaScript. Some page rendering still reads mock `nirmanData` from `js/data.js`, even where form submission is backend-integrated, so newly submitted data may not immediately replace all mock displays.

Major blocker: `config/db.php` is missing, so endpoints requiring it cannot run until a real local connection file is provided. Payment and complaint creation also auto-assign the first employee as a temporary placeholder.

# 8. One-Page Viva Cheat Sheet

- Architecture: HTML -> JavaScript `fetch()` -> PHP -> OCI8 -> Oracle -> JSON.
- Connection expected in `config/db.php`; only `config/db.example.php` is present.
- PHP calls `getConnection()` after `require_once 'config/db.php'`.
- OCI8 is PHP's Oracle database extension.
- `oci_parse()` prepares SQL; `oci_bind_by_name()` binds values; `oci_execute()` runs it.
- Login starts at `login.html` or `admin-login.html` and uses `js/auth.js` plus `login.php`.
- Passwords are checked with `password_verify()` against `Person.Password`.
- Session keys are `person_id`, `role`, `role_id`, and `first_name`.
- Booking inserts `Booking` and changes `Flats_Units.Status` to `Booked`.
- Payment inserts a `Pending` row into `Payments` for an owned booking.
- Bid submission inserts `Under Review` into `Tender_Bids`.
- Complaint submission inserts `Pending` into `Complaints`.
- Project updates are inserted into `Project_Update` by `submit_progress_update.php`.
- Important identity tables: `Person`, `Employee`, `Client`, `Contractor_Rep`.
- Important business tables: `Booking`, `Payments`, `Tenders`, `Tender_Bids`, `Complaints`, `Project_Update`.
- Q: Why bind SQL values? A: It separates user input from SQL and reduces injection risk.
- Q: Why call `session_start()`? A: To access the logged-in user's server-side session.
- Q: How is a role found? A: `login.php` checks `Employee`, then `Client`, then `Contractor_Rep`.
- Q: What does PHP return to the frontend? A: JSON containing success/failure data and messages.
- Q: What is the main current blocker? A: The required real `config/db.php` connection file is absent.
