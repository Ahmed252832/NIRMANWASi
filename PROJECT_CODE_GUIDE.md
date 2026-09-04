# NIRMAN Project Code Guide

This guide explains the programming topics that are currently used in the
NIRMAN frontend. It is written for beginner programmers preparing to review or
explain the project. It must be updated whenever a meaningful new concept is
introduced.

---

## Topic: Semantic HTML Pages

**Simple meaning:**
Semantic HTML uses meaningful elements such as `nav`, `main`, `section`,
`article`, `header`, `footer`, and `form` to describe the purpose of page
content.

**Used in:**
The landing page, authentication pages, and every Admin, Employee, Client, and
Contractor Representative page.

**Files:**
`index.html`, `login.html`, `admin-login.html`, `register.html`, and all HTML
files under `pages/`.

**Location:**
The main page structure in each HTML file.

**Why it was used:**
It makes the page easier to read, improves accessibility, and helps students
understand each section's purpose.

---

## Topic: HTML Links and Multi-Page Navigation

**Simple meaning:**
An anchor element (`a`) opens another HTML page or moves to a section of the
current page.

**Used in:**
Public navigation, dashboard sidebars, calls to action, sign-out links, and role
journeys.

**Files:**
All current HTML files.

**Location:**
Public navbar/footer links and authenticated sidebar links.

**Why it was used:**
NIRMAN uses simple separate HTML pages instead of a routing framework, which is
easier for beginners and future PHP integration.

---

## Topic: HTML Forms and Input Types

**Simple meaning:**
A form groups input controls so a user can enter and submit information. Input
types such as `email`, `password`, `tel`, `date`, and `number` provide suitable
browser behavior.

**Used in:**
Login, Admin login, registration, Tender/Bid/Award operations, allocation
confirmation, supervision, payment submission/verification, complaint filing
and resolution, booking, and Project Update submission.

**Files:**
`login.html`, `admin-login.html`, `register.html`, and the operation pages under
`pages/admin/`, `pages/employee/`, `pages/client/`, and `pages/contractor/`.

**Location:**
Elements with IDs such as `loginForm`, `registrationForm`, `publishTenderForm`,
`bookingForm`, `paymentForm`, `complaintForm`, and `projectUpdateForm`.

**Why it was used:**
Forms provide understandable data entry that can later submit to PHP without
redesigning the pages.

---

## Topic: HTML Tables

**Simple meaning:**
A table displays related records in rows and columns using `table`, `thead`,
`tbody`, `tr`, `th`, and `td`.

**Used in:**
Role directories, Projects, allocations, Payments, Installments, Complaints,
Tenders, Bids, Awards, Bookings, and Project Updates.

**Files:**
HTML files under every role directory in `pages/`.

**Location:**
Table sections with body IDs such as `employeeTableBody`,
`allocationTableBody`, and `tenderTableBody`.

**Why it was used:**
Database-style records are easiest to compare and review in a clear table.

---

## Topic: Bootstrap Grid and Utilities

**Simple meaning:**
Bootstrap classes such as `container`, `row`, `col-*`, `d-flex`, `mb-4`, and
`gap-3` provide responsive layout and spacing without complicated CSS.

**Used in:**
Landing sections, authentication layouts, dashboard statistics, forms, and
modal layouts.

**Files:**
All current HTML files.

**Location:**
Classes on containers, rows, columns, buttons, and spacing elements.

**Why it was used:**
Bootstrap is approved for the project and provides a beginner-friendly way to
support desktop, tablet, and mobile screens.

---

## Topic: Bootstrap Navbar and Modal

**Simple meaning:**
The Bootstrap navbar can collapse on smaller screens. A Bootstrap modal is a
dialog that appears above the page for focused details or forms.

**Used in:**
Public mobile navigation and role-specific details, forms, and confirmation
workflows.

**Files:**
`index.html`, role HTML files, `js/admin.js`, `js/employee.js`, `js/client.js`,
`js/contractor.js`, and `js/common.js`.

**Location:**
`publicNavigation`, modal elements near the end of role pages, and guarded modal
helpers such as `showAdminModal()`, `employeeShowModal()`, and
`clientShowModal()`.

**Why it was used:**
These components improve usability while remaining basic Bootstrap features.

---

## Topic: CSS Variables and Classes

**Simple meaning:**
CSS variables store reusable values such as colors. CSS classes apply visual
rules to many matching elements.

**Used in:**
The NIRMAN navy/gold identity, cards, tables, forms, buttons, statuses, public
sections, and dashboard shell.

**Files:**
`css/style.css` and `css/responsive.css`.

**Location:**
The `:root` section and class rules throughout both stylesheets.

**Why it was used:**
Shared values keep the design consistent and make visual changes easy to
explain and edit.

---

## Topic: CSS Flexbox and Grid

**Simple meaning:**
Flexbox arranges items in a row or column. CSS Grid arranges items in rows and
columns with controlled sizes.

**Used in:**
Navigation, hero actions, authentication layout, statistics, profile headers,
details, and dashboard structure.

**Files:**
`css/style.css` and `css/responsive.css`.

**Location:**
Rules using `display: flex` or `display: grid`, such as `.auth-shell`,
`.intro-stat-grid`, `.page-heading`, and `.detail-list li`.

**Why it was used:**
These standard CSS tools create polished layouts without a design framework
beyond Bootstrap.

---

## Topic: CSS Media Queries

**Simple meaning:**
A media query changes CSS rules when the screen reaches a selected width.

**Used in:**
Mobile navigation, responsive authentication layouts, stacked forms/cards, and
smaller page spacing.

**Files:**
`css/responsive.css` and the reduced-motion section of `css/style.css`.

**Location:**
Sections beginning with `@media`.

**Why it was used:**
The frontend must remain usable on desktop, laptop, tablet, and mobile screens.

---

## Topic: JavaScript Variables, Arrays, and Objects

**Simple meaning:**
A variable stores a value. An array stores a list. An object groups related
named values describing one record.

**Used in:**
Mock database records, temporary form submissions, counts, filters, and page
rendering.

**Files:**
All files under `js/`.

**Location:**
`nirmanData` in `js/data.js` and local `var` declarations in rendering
functions.

**Why it was used:**
These are basic JavaScript structures that closely resemble records returned by
a future PHP backend.

---

## Topic: JavaScript Functions

**Simple meaning:**
A function is a named block of instructions that performs one task and can be
called when needed.

**Used in:**
Formatting, record lookup, page rendering, form handling, filtering, and mock
actions.

**Files:**
All files under `js/`.

**Location:**
Examples include `findRecord()`, `formatDate()`, `renderFeaturedProjects()`,
`handleRegistration()`, `employeeRenderPayments()`, and
`clientSubmitBooking()`.

**Why it was used:**
Small named functions split complicated workflows into understandable steps.

---

## Topic: For Loops and If/Else Decisions

**Simple meaning:**
A `for` loop repeats instructions for every record. `if` and `else` choose which
instructions run based on a condition.

**Used in:**
Joining related ER records, counting statuses, rendering rows, checking roles,
validating IDs, and preventing duplicate operations.

**Files:**
All current JavaScript files.

**Location:**
Rendering and validation functions throughout the files.

**Why it was used:**
Loops and conditions are direct beginner-level tools for working with mock
record arrays.

---

## Topic: DOM Selection and Manipulation

**Simple meaning:**
The Document Object Model (DOM) is JavaScript's view of the HTML page.
`getElementById()` and `querySelector()` find elements; `textContent` and
`innerHTML` update visible content.

**Used in:**
Landing cards, authentication feedback, dashboard counts, table rows, modal
details, alerts, and form options.

**Files:**
All rendering scripts under `js/`.

**Location:**
Functions beginning with `render`, `show`, `open`, `populate`, or a role name.

**Why it was used:**
Simple DOM manipulation lets static HTML display centralized data without a
frontend framework.

---

## Topic: `addEventListener()` and `preventDefault()`

**Simple meaning:**
`addEventListener()` runs code after an event such as a click, input, change, or
form submission. `preventDefault()` stops a form from reloading the page.

**Used in:**
Login, registration, tabs, mobile sidebar, searches, filters, approvals,
confirmations, verification, resolution, and award creation.

**Files:**
`js/common.js`, `js/auth.js`, `js/admin.js`, `js/employee.js`, `js/client.js`, and
`js/contractor.js`.

**Location:**
`DOMContentLoaded` sections and form initialization functions.

**Why it was used:**
It connects understandable JavaScript actions to user interactions.

---

## Topic: Form Validation

**Simple meaning:**
Validation checks that submitted values are present, correctly formatted,
connected to real mock records, and not duplicates.

**Used in:**
Authentication, registration, Tender/Bid/Award operations, supervision,
Booking, allocation confirmation, Payment submission/verification, Complaint
filing/resolution, and Project Update creation.

**Files:**
HTML form files and the matching scripts under `js/`.

**Location:**
HTML attributes such as `required`, `type`, `min`, and `pattern`, plus submit
handler `if` statements.

**Why it was used:**
Meaningful forms should reject invalid frontend operations before future backend
validation is added.

---

## Topic: Centralized Mock Data

**Simple meaning:**
All demonstration records are stored in one JavaScript object instead of being
copied into many HTML pages.

**Used in:**
Every data-driven public and authenticated view.

**Files:**
`js/data.js` supplies the data; all other JavaScript files read it.

**Location:**
The global `nirmanData` object.

**Why it was used:**
It separates data from layout and makes later replacement with PHP/Oracle data
possible without redesigning the interface.

---

## Topic: ER-Aligned Record Lookup and Joining

**Simple meaning:**
Related records are connected by matching identifier fields, similar to using
foreign keys in a database.

**Used in:**
Person subtype names, Department membership, manager relationships, booking
allocations, Payment ownership, Tender/Bid/Award/Project chains, and Project
Updates.

**Files:**
`js/common.js` and every role script.

**Location:**
`findRecord()`, composite-key lookup helpers, and role page rendering functions.

**Why it was used:**
The frontend must demonstrate the supplied ER relationships without inventing
new entities or direct relationships.

---

## Topic: Derived Values

**Simple meaning:**
A derived value is calculated from other data instead of being entered as an
independent value.

**Used in:**
Project overdue state, latest project progress, deadline state, license state,
and dashboard totals.

**Files:**
`js/common.js`, `js/public.js`, and the role scripts.

**Location:**
`isProjectOverdue()`, `getLatestProjectProgress()`, `getDateState()`, and
`getLicenseState()`.

**Why it was used:**
The ER model marks `Is_overdue` as derived, and summary values should reflect
current mock records rather than hard-coded claims.

---

## Topic: Search and Status Filtering

**Simple meaning:**
Search compares typed text with each row. A status filter compares a selected
status with a row's `data-status` value and shows only matches.

**Used in:**
Admin, Employee, Client, and Contractor table/card views.

**Files:**
Role HTML files, `js/common.js`, `js/admin.js`, `js/employee.js`, `js/client.js`,
and `js/contractor.js`.

**Location:**
`.admin-filter-group`, `.employee-filter-group`, `.client-filter-group`, and the
matching combined-filter functions.

**Why it was used:**
Filters are simple UI convenience features that make larger record tables easier
to review without changing the data model.

---

## Topic: Temporary In-Memory Operations

**Simple meaning:**
JavaScript can change the current page's arrays and display, but those changes
disappear when the page refreshes.

**Used in:**
Public registration, representative approval, Tender and Bid creation,
supervision, Booking, allocation confirmation, Payment submission/verification,
Complaint filing/resolution, Award/Project creation, and Project Updates.

**Files:**
`js/auth.js`, `js/admin.js`, `js/employee.js`, `js/client.js`, and
`js/contractor.js`.

**Location:**
Form handlers and action functions that use array `push()` or update object
properties.

**Why it was used:**
The project is frontend-only at this stage and must not falsely claim Oracle
database persistence.

---

## Topic: Defensive Booking Availability Check

**Simple meaning:**
A Unit is offered for booking only when its status is Available and no existing
Booking already contains its Unit ID.

**Used in:**
Public available-unit statistics/preview, Client Unit cards, URL-linked Unit
selection, and final Booking submission checks.

**Files:**
`js/common.js`, `js/public.js`, and `js/client.js`.

**Location:**
`isUnitAvailableForBooking()` and calls from public and Client rendering/form
functions.

**Why it was used:**
It prevents the frontend from offering an already reserved Unit even if a mock
status is accidentally inconsistent.

---

## Topic: Composite and Weak-Entity Identifiers

**Simple meaning:**
Some records are identified by an owner ID together with their own partial ID.
For example, a Payment uses Client ID plus Payment ID, and a Tender Bid uses
Tender ID plus Bid ID.

**Used in:**
Tender Bids, Payments, Installments, and Project Updates.

**Files:**
`js/admin.js`, `js/employee.js`, `js/client.js`, and `js/contractor.js`.

**Location:**
Lookup helpers and detail buttons that join key parts with a separator such as
`T001|B001` for safe temporary UI lookup.

**Why it was used:**
It preserves the supplied ER model instead of pretending that partial IDs are
globally unique independent records.

---

## Topic: URL Query Parameters

**Simple meaning:**
A query parameter adds a small named value after `?` in a link. JavaScript can
read it with `URLSearchParams`.

**Used in:**
Opening a Project context and carrying a selected global Unit into the Client
Booking form.

**Files:**
`js/client.js`, `js/contractor.js`, and generated links on Client and Contractor
pages.

**Location:**
`clientGetQueryValue()` and Contractor page initialization functions.

**Why it was used:**
It connects separate HTML pages without a router or browser storage. The Unit
is still revalidated before Booking so an old link cannot bypass availability.

---

## Topic: Event Delegation

**Simple meaning:**
One click listener on `document` can respond to buttons added later by checking
the clicked element's `data-*` attribute.

**Used in:**
Table and card detail buttons, approvals, verification, resolution, and other
actions generated from mock data.

**Files:**
`js/admin.js`, `js/employee.js`, `js/client.js`, and `js/contractor.js`.

**Location:**
Click listeners using `event.target.closest()`.

**Why it was used:**
Rendered tables can be replaced after an in-memory operation without attaching
a separate listener to every newly created button.

---

## Topic: Atomic Frontend Operation

**Simple meaning:**
An atomic operation validates every required part first, then performs all
related changes together.

**Used in:**
Issuing a Tender Award and creating its required Construction Project.

**Files:**
`js/admin.js` and `js/employee.js`.

**Location:**
Award form submit handlers immediately before the related `push()` calls.

**Why it was used:**
The ER chain requires an awarded Bid and resulting Project to remain consistent;
the page should not create only half of that operation.
