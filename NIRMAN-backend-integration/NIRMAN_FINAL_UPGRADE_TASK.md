# NIRMAN Final Authenticated UI, Visualization, Profile Photo and Authorization Upgrade

## Nature of the task

This is a FULL IMPLEMENTATION TASK, not a review, plan, or token-saving exercise.

The CURRENT workspace is the source of truth.

Inspect as much of the current project as necessary.

Preserve currently working functionality including:

- login/authentication
- bcrypt/password security
- sessions
- CSRF
- booking flow
- payment flow
- tender award flow
- REJECT_COMPETING_BIDS_PROC
- VERIFY_PAYMENT_PROC
- booking triggers/sequence
- database relationships
- working APIs/actions
- manual changes already present in the workspace

Do not redesign the ER model unnecessarily.

---

# PRIMARY GOAL

The authenticated NIRMAN application currently looks too much like:

DATABASE
→ FETCH
→ LARGE TABLE
→ SCREEN

The instructor explicitly rejected this approach.

The logged-in application must become a:

PROFESSIONAL
+
GRAPHICAL
+
DATABASE-DRIVEN
+
SECURE
MANAGEMENT SYSTEM.

There are THREE mandatory areas:

1. Professional post-login UI with database-driven graphical/statistical visualization
2. Real profile/entity photos instead of initials/placeholders
3. Real department/designation-based authorization enforced by the backend

ALL THREE MUST be fully implemented.

---

# MANDATORY TEACHER REQUIREMENT 1
# GRAPHICAL / STATISTICAL DATA PRESENTATION

This is one of the most important instructor requirements.

Authenticated pages must NOT primarily appear as collections of large database tables.

Where Oracle data can meaningfully be summarized or analyzed visually, use suitable graphical/statistical presentation such as:

- Pie charts
- Doughnut charts
- Bar graphs
- Line graphs
- Statistical KPI cards
- Progress bars
- Progress charts
- Status distribution charts
- Trend graphs
- Timeline visualizations
- Activity visualizations
- Summary cards
- Entity cards
- Tender cards
- Project cards
- Payment cards
- Complaint cards
- Allocation/property cards

This applies to authenticated:

- Admin
- Employee
- Client
- Contractor Representative

Tables may remain where exact row-by-row/detail comparison is genuinely useful.

However, tables must NOT dominate every authenticated page.

Do NOT simply make the existing giant tables prettier.

The information architecture itself must improve.

---

# NO HARDCODED GRAPH OR STATISTICAL DATA

This is NON-NEGOTIABLE.

Do NOT hardcode:

- chart numbers
- dashboard totals
- graph values
- percentages
- payment totals
- tender counts
- complaint totals
- bid counts
- project progress
- allocation statistics
- fake trends
- fake dashboard statistics

Forbidden examples:

const data = [5, 8, 2];

const totalProjects = 12;

const pendingPayments = 7;

Required architecture:

Oracle Database
→ PHP SQL/API
→ COUNT / SUM / AVG / GROUP BY / actual records
→ JSON
→ JavaScript
→ Chart.js / cards / progress visualization

If Oracle data changes, the displayed graph/statistic must change automatically.

Chart.js via CDN is allowed.

Do not introduce React, Vue, Angular, Node, npm or frontend build systems.

---

# GRAPH DATA MUST ALSO RESPECT AUTHORIZATION

Graphical information is still information.

Users must not receive unauthorized information just because it is displayed as a chart or aggregate.

For example:

Finance employee:
may receive permitted payment/financial statistics.

Operations employee:
must not receive restricted financial statistics.

Authorization applies to:

- tables
- charts
- KPI cards
- aggregate APIs
- dashboards
- detail records

---

# PROFESSIONAL POST-LOGIN UI

Audit and improve authenticated interfaces for:

ADMIN
EMPLOYEE
CLIENT
CONTRACTOR REPRESENTATIVE

including current modules such as:

- Dashboard
- My Profile
- Tenders
- Allocations
- Payments
- Complaints
- Projects
- other existing role-specific modules

Use suitable:

- KPI cards
- graphs
- charts
- progress indicators
- visual summaries
- timelines
- recent activity
- cards
- responsive layouts
- secondary compact tables
- detail panels/modals

Professional quality is mandatory:

- clean hierarchy
- good spacing
- professional typography
- responsive layout
- polished cards
- consistent icons
- badges
- charts
- hover states
- empty states
- loading states where appropriate
- professional management-system feel

Do not add meaningless decorative graphs.

---

# ROLE-SPECIFIC DATABASE-DRIVEN DASHBOARDS

Do NOT use one generic dashboard for everyone.

## Admin

Use appropriate high-level Oracle-backed data such as where supported:

- project status
- tender status
- bookings/allocations
- unit availability
- complaints
- permitted high-level statistics
- recent system activity

Do not expose restricted sensitive raw data.

## Employee

Dashboard content must depend on:

- department
- designation
- permissions

Finance-related employee:
finance/payment KPIs and visualizations.

Operations/project-related employee:
tenders, projects, allocations and operational statistics.

Other departments:
only suitable permitted information.

## Client

Only that client's own information.

Possible examples where supported:

- bookings
- payment information
- installment/payment progress
- complaints
- property/project information

## Contractor Representative

Only related representative/contractor information.

Possible examples:

- submitted bids
- bid statuses
- awarded work
- project updates

Use actual database relationships.

---

# TENDER PAGE REDESIGN

Employee Tenders is a major example of the current table-heavy problem.

Do NOT leave it primarily as one giant table.

Use a professional primary presentation such as tender cards/panels.

Useful card information may include:

- tender title
- tender ID
- deadline
- status
- bid count
- task summary
- actions

Add database-driven summary visualization where meaningful, such as:

- tender status distribution
- bid status distribution
- bids per tender

Detailed bid comparison may remain tabular where useful.

Do NOT break:

- Issue Award
- selected bid behavior
- tender details
- award/project creation
- REJECT_COMPETING_BIDS_PROC

---

# PROJECT VISUALIZATION

Use:

Construction_Project
+
Project_Update

Where Project_Update.Progress_percent exists:

show actual progress bars/cards.

Where multiple dated updates exist:

show progress-over-time line visualization where meaningful.

Never invent project progress.

---

# PAYMENT VISUALIZATION

Use actual Payments data for meaningful presentation such as:

- payment status distribution
- verified/pending summary
- meaningful amounts
- date-based trends only when supported
- payment cards
- secondary transaction tables

---

# COMPLAINT VISUALIZATION

Use actual Complaints data for:

- complaint status distribution
- pending/resolved counts
- recent complaint summaries
- complaint/status cards

Keep detailed records secondary.

---

# ALLOCATION / UNIT VISUALIZATION

Use:

Booking
Flats_Units
related project/allocation data

for meaningful visuals such as:

- available/booked unit distribution
- allocation summaries
- unit/property cards
- project allocation information

All values must come from Oracle.

---

# PROFILE PHOTOS

The application currently uses initials such as AR.

This must no longer be the normal experience.

Inspect Person.

If no photo field exists, add a simple field such as:

Profile_photo VARCHAR2(255)

Prefer Person because:

Employee ISA Person
Client ISA Person
Contractor_Rep ISA Person

Do not duplicate the same photo field unnecessarily across subtype tables.

Store a relative local image path.

Architecture:

Person.Profile_photo
→ PHP
→ JSON
→ <img>

Do not hardcode user-specific images in HTML or JavaScript.

Do not use base64.

Do not use Oracle BLOB unless truly necessary.

---

# SEEDED PROFILE IMAGES

Existing demo users should have professional fictional profile images.

Cover:

- Employees
- Clients
- Contractor Representatives

Use local fictional/AI-generated portraits where possible.

Do not use identifiable real people.

Store image paths in:

database/sample_data.sql

so fresh teammate setup gets the same data.

Initials should only be fallback when:

Profile_photo IS NULL
or
image fails.

---

# PROFILE PHOTO UPLOAD

Support image upload where appropriate.

At minimum:

Client:
registration/profile photo and profile update where available.

Contractor Representative:
registration/profile photo and update where available.

Employee:
appropriate internal/profile photo mechanism.

Use a simple local uploads directory.

Validate:

- MIME/type
- extension
- reasonable file size
- generated safe filename
- reject executable uploads

Store only the relative path in Person.Profile_photo.

---

# DYNAMIC LOGGED-IN HEADER

Top-right identity must use actual database-backed information.

Instead of:

[AR]
Arif Rahman
Operations Manager

show:

[actual profile image]
Arif Rahman
Operations Manager

Name/designation/photo must come from authenticated user data.

---

# MANDATORY TEACHER REQUIREMENT 2
# DEPARTMENT / DESIGNATION BASED AUTHORIZATION

Authentication alone is NOT enough.

Employees must NOT all receive the same privileges.

Authorization must use:

- authenticated role
- employee department
- employee designation where appropriate
- requested feature

Use the CURRENT Oracle Employee/Department data.

Never trust department/designation values supplied by the browser.

Resolve permissions from authenticated server-side identity.

---

# USE ACTUAL DEPARTMENTS

Inspect current Department and Employee data.

Build permission mapping from departments that actually exist.

Do not invent a completely unrelated organization structure.

Expected pattern, adjusted to actual departments:

Finance-related employees:
- Payments
- payment verification
- financial dashboard information

Operations/project employees:
- Tenders
- Allocations
- Projects
- relevant operational data

Complaint/customer-service-related department if present:
- Complaints
- related client-service functionality

HR-type department if present:
- suitable personnel/profile information
- no automatic finance/tender access

Every employee should retain:

- own Dashboard
- own Profile

---

# CENTRALIZED PERMISSION HELPER

Implement a small beginner-friendly centralized authorization mechanism.

Conceptually:

can_access_feature(...)

require_feature_access(...)

Do not scatter unrelated department checks randomly everywhere.

Do not build an enterprise RBAC framework.

Keep it easy to explain in viva.

---

# PERMISSION-AWARE FRONTEND

Sidebar/navigation must reflect permissions.

Example concept:

Finance employee:
Dashboard
My Profile
Payments
other permitted modules

Operations employee:
Dashboard
My Profile
Tenders
Allocations
Projects
other permitted modules

Do not normally show inaccessible links.

If an unauthorized user manually opens a protected frontend URL:

show a professional Access Denied state.

---

# BACKEND AUTHORIZATION IS MANDATORY

Hiding menu items is NOT security.

Protected GET/read APIs and POST/actions must enforce authorization server-side.

Example:

Operations employee directly requests protected payment API:

HTTP 403

Authorized Finance employee requests it:

HTTP 200

Never rely on JavaScript authorization alone.

---

# ADMIN MUST NOT HAVE UNLIMITED SENSITIVE ACCESS

Admin does NOT mean unrestricted access to every raw database field.

Preserve legitimate System Administrator functionality.

But restrict at least one meaningful sensitive data category.

Preferred example:

RAW NID

System Administrator normal UI/API must not expose raw NID unless an actual required operation genuinely needs it.

This must be enforced server-side.

Do not merely hide with CSS.

Passwords must never be exposed.

Apply least privilege without destroying legitimate Admin functionality.

---

# SECURITY MUST BE DEMONSTRABLE IN VIVA

The finished system must allow demonstration of:

Employee A:
can access Feature X
cannot access Feature Y

Employee B:
cannot access Feature X
can access Feature Y

Authorized direct API:
HTTP 200

Unauthorized direct API:
HTTP 403

Admin:
has legitimate administration ability
but cannot retrieve selected restricted raw sensitive data.

Ensure seeded/demo accounts make this demonstration possible.

---

# DATABASE / REPOSITORY CONSISTENCY

Any new schema field must be reflected in:

database/schema.sql

Seed profile image paths and authorization-relevant demo data must be reflected in:

database/sample_data.sql

A teammate cloning/downloading the project and creating a fresh database must receive the same behavior.

Do NOT make permanent fixes only in the current live Oracle database.

Repository SQL and live Oracle must remain consistent.

---

# NO FAKE SECURITY

Unacceptable:

JavaScript hides a Payments link
but direct API access still succeeds.

Required:

authenticated request
→ PHP resolves current user
→ checks permission
→ allowed: continue
→ denied: HTTP 403

---

# NO HARDCODED BUSINESS DATA

Hardcoded labels are fine.

Examples:

Payments
Projects
Resolved

Hardcoded business values are not.

Do NOT use:

const totalProjects = 12;
const paymentChart = [8,4,3];
const arifPhoto = 'arif.jpg';
const pendingComplaints = 6;

Business/user/chart data must come from Oracle-backed APIs.

---

# RESPONSIVE PROFESSIONAL DESIGN

Support:

- Desktop
- Laptop
- Tablet
- Mobile

Maintain NIRMAN visual identity.

Use:

- responsive layouts
- balanced cards
- charts
- good typography
- spacing
- icons
- badges
- empty states
- loading states where useful
- polished profile areas
- clean modals/details
- restrained hover/transition effects

Do not create visual clutter.

---

# KEEP IMPLEMENTATION VIVA-FRIENDLY

Prefer:

- simple PHP
- Oracle SQL
- simple JavaScript
- Bootstrap
- Chart.js
- clear functions
- centralized permission helper
- COUNT/SUM/AVG/GROUP BY

Avoid unnecessary architectural complexity.

---

# END-TO-END COMPLETION REQUIREMENT

Do NOT claim completion after only one layer.

The required solution includes:

DATABASE
+
PHP BACKEND
+
AUTHORIZATION
+
JAVASCRIPT
+
FRONTEND
+
TESTING

Do not stop after:

- one dashboard
- a few charts
- schema-only changes
- photo-field-only changes
- sidebar-only security
- permission helper not applied to APIs

---

# REQUIRED TESTING

## Database-driven visualization

Compare representative API/chart values with direct Oracle queries.

Example:

SELECT Status, COUNT(*)
FROM Complaints
GROUP BY Status;

API/chart values must match.

Temporarily change suitable database test data and confirm API/statistic changes.

Clean up afterward.

## Profile photos

Verify for:

- Employee
- Client
- Contractor Representative

Person.Profile_photo
→ PHP/API
→ rendered image

Test fallback.

## Upload

Test:

valid image accepted
invalid/non-image rejected
unsafe upload rejected

## Authorization

Use employees from different departments.

Test:

authorized request → HTTP 200
unauthorized request → HTTP 403

Test direct backend endpoints.

## UI authorization

Unauthorized nav item absent.

Manual unauthorized URL:
professional Access Denied.

## Admin restriction

Verify restricted raw sensitive data is absent from normal Admin backend response/UI.

## Regression

Verify relevant existing flows remain operational, including:

- login
- booking
- payment verification
- tender award
- REJECT_COMPETING_BIDS_PROC
- modified complaint/project operations

Do not silently change established business rules.

---

# COMPLETION CHECKLIST

Do not claim completion until all applicable mandatory items are done:

[ ] Admin authenticated UI improved
[ ] Employee authenticated UI improved
[ ] Client authenticated UI improved
[ ] Contractor authenticated UI improved

[ ] Tables no longer dominate every module
[ ] Pie/doughnut charts used where meaningful
[ ] Bar graphs used where meaningful
[ ] Line graphs used where meaningful
[ ] KPI/stat cards used where meaningful
[ ] Progress visuals used where meaningful

[ ] Every chart/stat is Oracle-driven
[ ] No fake graph numbers
[ ] Database changes are reflected dynamically
[ ] Graph APIs respect authorization

[ ] Profile_photo stored in Oracle
[ ] schema.sql updated
[ ] sample_data.sql contains seeded image paths
[ ] Employee photos work
[ ] Client photos work
[ ] Contractor Representative photos work
[ ] Header displays dynamic photo
[ ] Profile UI displays dynamic photo
[ ] Initials only fallback
[ ] Upload works where required

[ ] Employee permissions differ by department/designation
[ ] Navigation is permission-aware
[ ] Backend READ APIs enforce permission
[ ] Backend mutation actions enforce permission
[ ] Unauthorized direct requests return 403
[ ] Authorized requests return 200

[ ] Admin has meaningful sensitive-data restriction
[ ] Restriction is server-side

[ ] Existing important flows still work
[ ] Repository SQL matches required live DB changes
[ ] Fresh teammate setup gets equivalent behavior

If any mandatory item is incomplete:

DO NOT say the task is complete.

Continue implementation.

---

# FINAL COMPLETION REPORT

When finished, report:

1. Authenticated UI changes by role
2. Every chart/KPI/progress visualization:
   - page
   - type
   - PHP API
   - Oracle source
3. Profile-photo implementation
4. Actual authorization matrix
5. Protected backend endpoints/actions
6. Admin sensitive-data restriction
7. Representative test results
8. Database/schema/sample-data changes
9. Complete changed-file list
10. Explicit incomplete items, if any

Do not hide unfinished requirements.

---

# FINAL RULE

DO THE WORK.

Do not only plan.

Do not stop after cosmetic changes.

Do not stop after a few graphs.

Do not optimize for token usage at the cost of implementation.

The finished NIRMAN application must be:

- professional
- significantly less table-heavy
- visually rich
- database-driven
- dynamically graphed using Oracle data
- profile-photo enabled
- department-aware
- backend-secured
- least-privilege aware
- consistent with the current project
- demonstrable in DBMS viva.
