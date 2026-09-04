# NIRMAN Prototype

NIRMAN is a construction and property management prototype. It demonstrates the
supplied ER model through public pages and separate Admin, Employee, Client, and
Contractor Representative workspaces, with PHP/OCI8 endpoints under `backend/`.

## Run the Project

The static frontend and backend integration do not use a package manager or build
step. Live backend calls require PHP 7.4, OCI8, Oracle 11g, and a local
`backend/config/db.php` created from `backend/config/db.example.php`.

1. Serve the project root through a PHP-capable web server; do not open the HTML
   files directly when testing live endpoints.
2. Use `login.html` for Employee, Client, or Contractor Representative access.
3. Use `admin-login.html` for Admin access.

Bootstrap 5.3.3 is included locally under `bootstrap/`. The project's HTML, CSS,
JavaScript, and frontend fixture data are local. Live endpoint calls use the
same-origin `backend/` paths.

## Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@nirman.demo` | `admin123` |
| Employee | `arif@nirman.demo` | `employee123` |
| Client | `samira@nirman.demo` | `client123` |
| Contractor Representative | `tanvir@nirman.demo` | `contractor123` |

The login pages also provide buttons that fill these credentials automatically.

## Implemented Workspaces

- Public: landing page, Project and Unit previews, role login, Admin login, and
  temporary Client/Representative registration.
- Admin: dashboard, people and Departments, Contractors and supervision,
  portfolio, allocations, finance, Complaints, and Tender/Award operations.
- Employee: dashboard, profile and reporting structure, Tenders and Awards,
  allocation confirmation, Payment verification, Complaint resolution, and
  Project/supervision review.
- Client: dashboard, profile and contacts, Projects, global Unit inventory,
  Booking and allocation status, Payment/Installment views with Make Payment,
  and Complaint filing.
- Contractor Representative: dashboard, profile, Tenders, Bid submission and
  history, awarded Projects, and Project Update submission.

## Project Structure

```text
NIRMAN/
|-- index.html
|-- login.html
|-- admin-login.html
|-- register.html
|-- css/
|   |-- style.css
|   `-- responsive.css
|-- js/
|   |-- data.js
|   |-- common.js
|   |-- public.js
|   |-- auth.js
|   |-- admin.js
|   |-- employee.js
|   |-- client.js
|   `-- contractor.js
|-- pages/
|   |-- admin/
|   |-- employee/
|   |-- client/
|   `-- contractor/
|-- backend/
|   |-- config/
|   |-- api/
|   |-- actions/
|   `-- diagnostics/
|-- database/
|-- references/
|-- NIRMAN_DEMO_PACKAGE/
|-- AGENTS.md
`-- UI_SECURITY_REVAMP_SPEC.md
```

`js/data.js` is the current frontend fixture data source. `js/common.js`
contains shared lookup, formatting, status, navigation, and availability
helpers. Each role script renders and operates only its matching pages. Backend
endpoints are grouped by authentication, public reads, role reads, actions, and
diagnostics under `backend/`.

## ER-Driven Rules

- Admin is an application access role, not an added ER entity.
- Person supplies shared identity details for Employee, Client, and Contractor
  Representative records.
- Composite owner context is preserved for Tender Bids, Payments, Installments,
  and Project Updates.
- A Tender Award and its resulting Construction Project are created together.
- Project overdue state is calculated from deadline and status rather than
  stored as editable data.
- Units are global inventory because the supplied model has no direct
  Project-to-Unit relationship.
- A Unit is bookable only when its status is `Available` and no existing Booking
  already uses its Unit ID.
- A Booking independently records the selected Project and reserved Unit.

## Current Limitations

- The local Oracle configuration file is intentionally absent and ignored.
- Some role views still render fixture data while backend integration is being
  completed.
- Backend authorization and session inconsistencies remain documented follow-up
  work; the directory move did not silently weaken existing checks.
- Client Make Payment and some other role operations still have frontend fixture
  rendering alongside their live endpoint calls.
- No LocalStorage, SessionStorage, IndexedDB, or fake persistent database is
  used.

See `PROJECT_CODE_GUIDE.md` for beginner-oriented explanations of the HTML, CSS,
JavaScript, ER joins, filtering, validation, query parameters, and temporary
operations used by the prototype.
