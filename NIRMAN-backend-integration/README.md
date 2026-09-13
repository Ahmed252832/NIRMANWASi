# NIRMAN Frontend Prototype

NIRMAN is a frontend-only construction and property management prototype. It
demonstrates the supplied ER model through public pages and separate Admin,
Employee, Client, and Contractor Representative workspaces.

## Run the Project

No installation, package manager, build step, or database is required.

1. Open `index.html` in a modern browser.
2. Use `login.html` for Employee, Client, or Contractor Representative access.
3. Use `admin-login.html` for Admin access.

Bootstrap 5.3.3 is loaded from jsDelivr, so an internet connection is needed for
the Bootstrap stylesheet and components. The project's own HTML, CSS,
JavaScript, and mock data are local.

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
|   |-- mock-data.js
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
`-- references/
```

`js/mock-data.js` is the single demonstration data source. `js/common.js`
contains shared lookup, formatting, status, navigation, and availability
helpers. Each role script renders and operates only its matching pages.

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

## Prototype Limitations

- There is no backend, Oracle connection, API, real authentication, or database
  persistence.
- Registration and role actions update JavaScript arrays in the current page
  only. Refreshing or navigating reloads the original mock data.
- Client Make Payment creates a temporary `Pending` Payment; Employee
  verification is a separate temporary action.
- No LocalStorage, SessionStorage, IndexedDB, or fake persistent database is
  used.

See `PROJECT_CODE_GUIDE.md` for beginner-oriented explanations of the HTML, CSS,
JavaScript, ER joins, filtering, validation, query parameters, and temporary
operations used by the prototype.
