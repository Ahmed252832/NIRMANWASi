# NIRMAN Frontend Plan

## Scope and Sources

This plan follows `MASTER_PROMPT.md`, the authoritative text and DBML in
`PROJECT_SPEC.md`, and all four overlapping ER diagram reference images. The
current stage is a frontend-only prototype built with HTML5, CSS3, basic
Bootstrap, and beginner-friendly vanilla JavaScript. It will not use a backend,
database connection, fake database, browser storage, package manager, or build
step.

## 1. Planned Public Pages

- `index.html`: public landing page with navigation, hero, NIRMAN introduction,
  featured projects, available-unit preview, capabilities, mock-data statistics,
  reasons to choose NIRMAN, call-to-action, and footer. Projects, Properties,
  and About will be landing-page sections.
- `login.html`: general mock login for Employee, Client, and Contractor
  Representative accounts, with clear sample-account guidance.
- `admin-login.html`: separate, clearly branded mock Admin login.
- `register.html`: public registration for Client and Contractor Representative
  only, using the relevant Person and subtype fields.

## 2. Admin Pages

- `pages/admin/dashboard.html`: summaries, pending work, deadlines, and recent
  activity.
- `pages/admin/people.html`: Employee, Department, Client, and employee
  manager/subordinate views.
- `pages/admin/contractors.html`: Contractors, representatives, representative
  approvals, and employee supervision assignments.
- `pages/admin/portfolio.html`: Areas, Construction Projects, Flats & Units, and
  project progress summaries.
- `pages/admin/allocations.html`: Bookings and employee allocation
  confirmations.
- `pages/admin/finance.html`: Payments, payment verification, and Installments.
- `pages/admin/complaints.html`: filed complaints, assignees, statuses, and
  resolutions.
- `pages/admin/tenders.html`: Tenders, submitted Tender Bids, bid selection,
  Tender Awards, and resulting projects.

## 3. Employee Pages

- `pages/employee/dashboard.html`: assigned operational summaries and deadlines.
- `pages/employee/profile.html`: Person details, Employee details, Department,
  manager, and subordinates.
- `pages/employee/tenders.html`: publish/view tenders, review bids, and issue an
  award from a selected bid.
- `pages/employee/allocations.html`: review and confirm Booking-Allocation
  Processes.
- `pages/employee/payments.html`: review and verify client payments and inspect
  installments.
- `pages/employee/complaints.html`: review complaints and record resolutions.
- `pages/employee/projects.html`: projects, contractor supervision, overdue
  indicators, and progress updates.

## 4. Client Pages

- `pages/client/dashboard.html`: booking, allocation, payment, installment, and
  complaint summaries.
- `pages/client/profile.html`: Person and Client details, including multiple
  client contact numbers.
- `pages/client/projects.html`: browse construction projects and their areas.
- `pages/client/properties.html`: browse/filter the available Flats & Units
  inventory and open unit details. A unit is bookable only when its status is
  Available and no existing mock Booking already reserves it.
- `pages/client/bookings.html`: create a booking, view the reserved unit, and
  follow allocation confirmation status.
- `pages/client/payments.html`: view booking-related payments and installments,
  and provide a simple frontend-only Make Payment / payment-submission
  demonstration.
- `pages/client/complaints.html`: file complaints and view status/resolution.

The client journey will be visibly linked as Projects -> Units -> Unit Details
-> Booking -> Allocation Status -> Payments / Installments.

## 5. Contractor Representative Pages

- `pages/contractor/dashboard.html`: tender, bid, award, project, and update
  summaries.
- `pages/contractor/profile.html`: Person and Contractor Representative details,
  approval status, and represented Contractor information.
- `pages/contractor/tenders.html`: published tenders, details, and bid
  submission.
- `pages/contractor/bids.html`: submitted bids and bid/award statuses.
- `pages/contractor/projects.html`: projects relevant to the representative and
  their progress history.
- `pages/contractor/updates.html`: create temporary progress updates and review
  previous Project Updates.

## 6. Navigation Structure

- Public top navigation: Home, Projects, Properties, About, Login, Register.
- Admin sidebar groups: Overview; People; Contractors; Portfolio; Operations;
  Finance; Complaints; Tenders; Sign Out.
- Employee sidebar groups: Overview; My Profile; Tenders; Allocations; Payments;
  Complaints; Projects; Sign Out.
- Client sidebar groups: Overview; My Profile; Projects; Properties; Bookings;
  Payments; Complaints; Sign Out.
- Contractor Representative sidebar groups: Overview; My Profile; Tenders;
  My Bids; Projects; Progress Updates; Sign Out.
- Desktop dashboards use a fixed sidebar and top bar. On small screens the same
  links appear in a simple collapsible navigation panel.
- Sign-out links return to the public site; public and authenticated pages use
  ordinary relative HTML links with no routing framework.

## 7. Core ER-Derived Functionality

- Present Person as the shared profile data for Employee, Client, and
  Contractor Representative without creating a separate Admin entity.
- Show Department membership, multivalued department phone numbers, and the
  one-manager-to-many-subordinates recursive Employee relationship.
- Show Contractor-to-Representative as 1:N and Employee-to-Contractor
  supervision as M:N.
- Represent the tender chain: Employee publishes Tender -> Representative
  submits Tender Bid -> selected Bid receives Tender Award -> Award results in
  one Construction Project.
- Show each Construction Project in one Area, calculate the overdue display from
  deadline/status, and list its Contractor Representative Project Updates.
- Represent Booking + Reserves + Flat/Unit as one Booking-Allocation Process.
  Each booking belongs to one Client, reserves one Unit, records one Project,
  and may be confirmed by an Employee.
- Prevent double booking in the frontend by excluding every Unit already used by
  an existing mock Booking from available-unit and booking-form choices, even if
  its display status were accidentally left as Available.
- Relate Payments to the Client and Booking-Allocation Process, allow Employee
  verification, show each Payment's Installments, and allow a Client to submit a
  temporary Pending payment demonstration against one of their bookings.
- Relate Complaints to the filing Client and resolving Employee, including status
  and resolution.
- Preserve weak-entity context in displays for Department, Payments, Tender
  Bids, Installments, and Project Updates rather than inventing independent
  business objects.
- Display composite Person names and Area address/centre-location fields, plus
  multivalued Client contacts and Department phones.

## 8. Additional UI Convenience Functionality

- Search, small status/type filters, and simple sorting on useful tables/cards.
- Dashboard summary cards and counts calculated from centralized mock data.
- Status badges, deadline/overdue indicators, detail panels, empty states, and
  recent-activity lists.
- Basic HTML and JavaScript validation for login, registration, booking, bid,
  payment, complaint, tender, award, and progress-update forms.
- Confirmation prompts for approvals, allocation confirmation, payment
  verification, complaint resolution, and tender awards.
- Success/error alerts and simple in-memory table/card updates. Temporary changes
  will disappear after refresh and will never claim database persistence.
- Responsive tables, card layouts, navigation, and forms for desktop, tablet,
  and mobile screens.

## 9. Main Mock-Data Groups

Centralized `js/mock-data.js` arrays will cover:

- people, employees, clients, and client contact numbers;
- departments, department phone numbers, and employee work relations;
- contractors, contractor representatives, and supervision assignments;
- tenders, tender bids, and tender awards;
- areas, construction projects, and project updates;
- flats and units;
- bookings and allocation confirmations;
- payments and installments;
- complaints; and
- one small application-only mock Admin account.

IDs and foreign-key-style values in the mock objects will mirror the DBML so
role scripts can join related records with simple loops and helper functions.

## 10. Basic Design Direction

- Identity: a simple building-inspired inline SVG mark and consistent NIRMAN
  wordmark.
- Palette: deep navy `#0F2747`, warm gold `#D6A84B`, background `#F7F8FA`, text
  `#1F2937`, and white surfaces, with standard status colors.
- Style: professional property/construction visual language, strong typography,
  generous spacing, blueprint/grid details used sparingly, subtle shadows,
  rounded cards, clear tables, and restrained hover transitions.
- Implementation: Bootstrap CDN for grid, navigation, forms, tables, cards,
  badges, alerts, and modal behavior; a small shared custom stylesheet for the
  visual identity; simple inline SVG icons where useful.
- Accessibility: semantic headings, labels, visible focus states, meaningful
  button text, adequate contrast, and reduced-motion-friendly transitions.

## 11. Minor Frontend Assumptions

- Admin is only a mock access-control role and is not added to the ER model.
- Mock statuses are demonstration labels, not new database constraints.
- General login routes each supplied mock account to its matching role; no real
  authentication or security is implied.
- Registration and create/update actions alter only page-memory arrays/DOM and
  reset on refresh.
- Client Make Payment creates only a temporary Pending mock Payment in page
  memory; it does not claim verification or database persistence.
- Pending payments and unresolved complaints may display "Not yet verified" or
  "Not yet resolved" until the relevant Employee action, without changing the
  ER relationship definitions.
- Unit detail is shown in a simple modal/panel rather than adding a new entity.

## Recorded ER/Schema Limitation

The specification requires a Projects -> Units browsing journey and says a
project contains flats/units, but `Flats_Units` has no `Project_id` and the
explicit model links a Unit to a Project only through `Booking` inside the
Booking-Allocation Process. The prototype will therefore show available units
as a global inventory, then record the chosen Project and Unit together in a
mock Booking. It will not add a direct Project-to-Unit relationship or claim
that an unbooked unit belongs to a specific project. Project-scoped unit
filtering should be added only if the ER/database model is clarified later.

## Implementation and Verification Order

1. Create shared design files, centralized mock data, and common JavaScript.
2. Build and verify public pages and mock authentication/registration.
3. Build each role layout, dashboard, and role-specific pages.
4. Add simple rendering, filtering, validation, and mock actions.
5. Create and maintain `PROJECT_CODE_GUIDE.md` as concepts are introduced.
6. Create `README.md`, audit links/content/responsiveness, and check for console
   errors and prohibited technologies.
