# NIRMAN Implementation Status

Checkpoint created: 8 August 2026

Current modernization checkpoint: 4 September 2026

This file records the original interrupted frontend checkpoint and the current
backend integration. Completed work must be continued in place, not restarted or
regenerated.

## Current Modernization Progress

- Phases 1-4 of `IMPLEMENTATION_PROMPT.md` are complete in the canonical
  workspace. The XAMPP-served copy remains intentionally unsynchronized until
  the implementation is fully verified.
- Oracle connectivity, all four role logins, session regeneration, role
  routing, bcrypt-only authentication, and the live password migration were
  verified.
- `backend/lib/api.php` now provides shared method, session, role, CSRF, JSON,
  safe-error, and logout behavior. `backend/lib/policy.php` provides ownership
  checks, and `backend/lib/award_project.php` provides the atomic shared
  award/project operation.
- All private APIs require their server-side role. Admin endpoints remain
  Admin-only; Employee pages now use separate Employee endpoints scoped to
  owned tenders, assigned payments and complaints, shared pending allocations,
  owned projects, and supervised-contractor projects.
- Every mutation endpoint is POST-only and CSRF-protected. Acting Client,
  Employee, Admin-Employee, and Representative identities come from the
  session. Employee award/review operations verify tender ownership, Client
  operations verify ownership, and Representative updates verify the full
  Representative-to-Bid-to-Award-to-Project path.
- Public catalogue endpoints are GET-only, return safe JSON failures, exclude
  booked units from availability, exclude awarded/expired tenders from open
  tender results, and derive progress from the latest dated update rather than
  the highest historical percentage.
- Public registration remains intentionally unauthenticated, but now enforces
  POST, validates field/database limits, stores bcrypt hashes, uses atomic
  transactions, and does not disclose Oracle errors.
- Development diagnostics require an authenticated Admin session.
- PHP lint passes across every backend PHP file. Role/ownership, CSRF, method,
  public-read, and scoped-read tests pass through the workspace PHP server.
- Phase 5 is next: add purpose-built public catalogue and aggregate summary
  endpoints using only relationships supported by `PROJECT_SPEC.md`.

## Current Backend Integration

- All 54 root-level PHP files are now organized under `backend/api/`,
  `backend/actions/`, and `backend/diagnostics/`.
- `config/db.example.php` is now `backend/config/db.example.php`.
- All database-backed PHP files load the configuration through a location-aware
  `__DIR__` path.
- Endpoint calls in `js/auth.js`, `js/public.js`, `js/admin.js`, `js/employee.js`,
  `js/client.js`, and `js/contractor.js` now target `backend/`.
- `backend/config/db.php` is a local ignored runtime file and must never be
  committed or copied into documentation.
- `NIRMAN_DEMO_PACKAGE/`, database scripts, ER references, frontend pages, CSS,
  Bootstrap assets, and fixture data were retained.
- The original authorization and session inconsistencies were resolved during
  modernization Phases 2-4.

## Original Frontend Completed Files

### Preserved Source and Reference Files

- `MASTER_PROMPT.md` - read completely and preserved unchanged.
- `PROJECT_SPEC.md` - read completely and preserved unchanged.
- `references/er-diagram-part-1.png` - inspected as part of the single ER diagram.
- `references/er-diagram-part-2.png` - inspected as part of the single ER diagram.
- `references/er-diagram-part-3.png` - inspected as part of the single ER diagram.
- `references/er-diagram-part-4.png` - inspected as part of the single ER diagram.

### Planning and Shared Foundation

- `FRONTEND_PLAN.md` - complete and updated at this checkpoint with the Client
  Make Payment demonstration and double-booking prevention requirements.
- `css/style.css` - complete shared public, authentication, and dashboard visual
  system; inspected through its closing rule.
- `css/responsive.css` - complete responsive adjustments; inspected through its
  closing rule.
- `js/data.js` - current centralized frontend fixture dataset.
- `js/common.js` - complete current shared helper and navigation behavior.
- `js/auth.js` - complete original mock authentication and public-registration
  behavior; it now also calls the live authentication endpoints.

### Public Frontend

- `index.html` - complete landing-page markup and data-rendering containers.
- `login.html` - complete general mock-login interface.
- `admin-login.html` - complete separate Admin mock-login interface.
- `register.html` - complete Client and Contractor Representative registration
  interface.

## Original Frontend Partially Completed Files

| File | Current State |
| --- | --- |
| `js/public.js` | Landing statistics, projects, and unit previews are implemented. The new booking-based availability cross-check is not yet added; current mock data is safe because booked units already have Reserved/Allocated statuses. |
| `pages/admin/dashboard.html` | Structurally complete markup; dynamic data is empty because `js/admin.js` does not exist. |
| `pages/admin/people.html` | Structurally complete markup; rendering, search, and detail actions are not wired. |
| `pages/admin/contractors.html` | Structurally complete markup; approval and supervision actions are not wired. |
| `pages/admin/portfolio.html` | Structurally complete markup; Area, Project, Unit, and Update rendering is not wired. |
| `pages/admin/allocations.html` | Structurally complete markup; allocation rendering and confirmation are not wired. |
| `pages/admin/finance.html` | Structurally complete markup; Payment/Installment rendering and verification are not wired. |
| `pages/contractor/dashboard.html` | Structurally complete markup; all role data containers await `js/contractor.js`. |
| `pages/contractor/profile.html` | Structurally complete markup; Person, Representative, and Contractor rendering is not wired. |
| `pages/contractor/tenders.html` | Structurally complete markup and bid modal; tender rendering and bid submission are not wired. |
| `pages/contractor/bids.html` | Structurally complete markup; bid filtering, details, and award context are not wired. |
| `pages/contractor/projects.html` | Structurally complete markup; representative-to-bid-to-award-to-project derivation is not wired. |
| `pages/contractor/updates.html` | Structurally complete markup and form; update validation, rendering, and submission are not wired. |

## Original Files Not Started At Frontend Checkpoint

| Area | Files |
| --- | --- |
| Admin | `pages/admin/complaints.html`, `pages/admin/tenders.html`, `js/admin.js` |
| Employee | `pages/employee/dashboard.html`, `profile.html`, `tenders.html`, `allocations.html`, `payments.html`, `complaints.html`, `projects.html`, and `js/employee.js` |
| Client | `pages/client/dashboard.html`, `profile.html`, `projects.html`, `properties.html`, `bookings.html`, `payments.html`, `complaints.html`, and `js/client.js` |
| Contractor Representative | `js/contractor.js` |
| Documentation | `PROJECT_CODE_GUIDE.md`, `README.md` |
| Assets | No separate asset file is planned or started; the current logo is CSS-based. |

The `pages/employee/` and `pages/client/` directories were empty at the original
checkpoint; they now contain the implemented page shells.

## Original Frontend Completed Features

- Concise implementation plan aligned to the authoritative specification and all
  four ER diagram sections.
- Consistent NIRMAN identity with deep navy, warm gold, white surfaces, and a
  building-inspired CSS brand mark.
- Responsive public, authentication, and authenticated-dashboard layout styles.
- Public landing page with hero, introduction, featured Project rendering,
  global available-Unit preview, mock-data statistics, capabilities, call to
  action, and footer.
- General mock login with role matching for Employee, Client, and approved
  Contractor Representative accounts.
- Separate mock Admin login without creating an Admin ER entity.
- Public registration limited to Client and Contractor Representative.
- Registration field switching, validation, duplicate-email check, temporary
  in-memory Person/subtype creation, and Pending representative approval.
- Centralized ER-aligned mock data and shared lookup, date, currency, status,
  escaping, project-overdue, project-progress, alert, tab, table-filter, and
  responsive-sidebar helpers.
- Structurally complete Admin shells for six of eight planned Admin pages.
- Structurally complete Contractor Representative shells for all six planned
  pages.

## Original Pending Frontend Features

- Add the booking-based availability guard wherever units are advertised or
  offered in a booking form. A unit must have status Available and must not occur
  in any existing Booking.
- Add a simple Client Make Payment / payment-submission demonstration that creates
  a temporary Pending Payment against the Client's Booking and never claims
  persistence or verification.
- Implement all Admin data rendering and interactions, then add the missing Admin
  Complaints and Tenders/Awards pages.
- Implement all Employee pages and role interactions.
- Implement all Client pages, including Project-to-global-Unit journey, booking,
  payment submission, installments, and complaints.
- Implement all Contractor Representative rendering, filtering, tender bid,
  awarded-project derivation, and progress-update behavior.
- Create and continuously align `PROJECT_CODE_GUIDE.md` with concepts actually
  used.
- Create `README.md`.
- Perform link, browser, console, validation, responsive, accessibility, and
  beginner-simplicity audits.

The statements in this historical section describe the original frontend
checkpoint and are not a current implementation status.

## JavaScript At Original Frontend Checkpoint

### `js/data.js`

- Declares the single global `nirmanData` object.
- Contains no browser storage, network requests, backend calls, or fake database.

### `js/common.js`

- `findRecord()` for simple ID lookups.
- `getPersonName()`, `getEmployeeName()`, `getClientName()`, and
  `getRepresentativeName()` for Person/subtype display joins.
- `formatCurrency()` and `formatDate()` for presentation.
- `escapeHtml()` for safe user/mock text insertion.
- `getStatusClass()` and `createStatusBadge()` for status presentation.
- `isProjectOverdue()` for the derived Project overdue state.
- `getLatestProjectProgress()` for latest Project Update progress.
- `showPageAlert()` for temporary page feedback.
- Generic table search/status helpers.
- Simple tab switching.
- Responsive sidebar/backdrop controls and current-year rendering.

### `js/public.js`

- Calculates landing statistics from mock arrays.
- Renders featured Projects with Area, deadline, status/overdue state, and latest
  progress.
- Renders up to four Units whose current mock status is Available.
- Still needs the new defensive check that excludes every Unit found in an
  existing Booking, regardless of its status value.

### `js/auth.js`

- Validates mock general and Admin credentials.
- Matches general accounts to the selected role.
- Blocks a Contractor Representative whose approval is not Approved.
- Routes successful mock logins to role dashboard paths.
- Switches Client and Contractor Representative registration fields.
- Populates represented-Contractor options from centralized data.
- Validates password confirmation and duplicate emails.
- Creates temporary Person plus Client or Contractor Representative records.
- Fills demonstration credentials from account buttons.

No Admin, Employee, Client, or Contractor Representative role JavaScript file
exists yet.

## Mock Data Already Implemented

- One application-only Admin account.
- Nine Person records.
- Four Employee records and four Department records.
- Multivalued Department phone records.
- Three recursive Employee manager/subordinate work relations.
- Three Client records and multivalued Client contact records.
- Two Contractors and two Contractor Representatives with Approved/Pending states.
- Three Employee-Contractor supervision pairs representing the M:N relationship.
- Three Tenders, three weak Tender Bids, and two Tender Awards.
- Two Areas with composite address and centre-location values.
- Two award-backed Construction Projects.
- Six global Flats & Units.
- Two Bookings and one allocation confirmation.
- Three weak Payments and three Installments.
- Two Complaints.
- Three weak Project Updates.

Current booking consistency is correct: `U002` is booked and marked Reserved;
`U004` is booked and marked Allocated. Neither is rendered by the current public
Available-unit preview. The pending correction adds a second booking-array check
so this remains safe even if a future status value is inconsistent.

## Original Frontend Design Decisions

- Technology remains HTML5, CSS3, local Bootstrap 5.3.3 assets, vanilla
  JavaScript, and the PHP/OCI8 backend integration.
- No Node.js, package manager, bundler, framework, LocalStorage, or IndexedDB was
  introduced. PHP, OCI8, and Oracle integration was added later under `backend/`.
- Public pages use a polished architectural/blueprint visual language.
- Authenticated pages use a fixed desktop sidebar, sticky top bar, and mobile
  off-canvas-style sidebar controlled by simple JavaScript.
- NIRMAN branding is text plus a CSS building mark; no image logo is required.
- Mock data is separate from rendering and interaction logic.
- Separate static HTML pages are preferred over routing or templating.
- Status values are UI demonstration values, not new database constraints.
- Units remain a global inventory because the schema contains no direct
  Project-to-Unit key.
- A Project and Unit are connected in the UI only through a Booking-Allocation
  Process.
- Contractor-relevant Projects must be derived through Representative -> Bid ->
  Award -> Project, not through an invented direct relationship.
- Currency is presented as BDT in the current mock UI without adding a database
  field.

## Original Frontend Assumptions

- Admin is an access-control role only and is never added as an entity.
- Current demonstration identities are Arif Rahman (`E001`), Samira Khan
  (`C001`), Tanvir Hasan (`R001`), and System Administrator.
- All create/update operations are page-memory demonstrations and reset after a
  refresh.
- A Pending payment or unresolved complaint may have an existing Employee
  association while the UI clearly states that verification/resolution is not
  complete.
- Derived overdue status uses the browser's current date plus Project deadline
  and completion state.
- Unbooked Units are not assigned to Projects in mock data or UI claims.
- A Client payment submission will be Pending, have no verification timestamp,
  and will not be described as permanently saved.
- Effective unit availability requires both an Available status and no existing
  Booking for that Unit.

## Original Interrupted-Write Check

No truncated file was found. Every current HTML file has a doctype, closed body
and html elements, and complete script-reference block. Both CSS files and all
four existing JavaScript files also end with closed syntax.

The six Admin HTML files and six Contractor Representative HTML files were
created during the interrupted implementation attempt. Their markup is complete,
but they are partial features because `js/admin.js` and `js/contractor.js` were
never created. Two Admin HTML pages were never created. No repair edit was
required, and these completed shells must not be regenerated.

## Exact Next Implementation Step

Create `js/admin.js` in place and wire the six existing Admin HTML shells,
starting with `pages/admin/dashboard.html`; do not recreate or replace those
pages. After that script works across the existing shells, add the two missing
Admin pages as a separate step.
