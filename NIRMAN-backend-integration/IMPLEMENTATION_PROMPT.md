You are now implementing the APPROVED FINAL NIRMAN MODERNIZATION PLAN.

MODE: BUILD.

MODEL EXPECTATION:
This is an implementation task, not another planning exercise.

Do NOT restart the project audit from zero.
Do NOT spend large amounts of time re-planning.
Do NOT launch unnecessary exploratory subagents.

The previous planning phase has already inspected the workspace and established the approved architecture, security model, visual system, navigation model, analytics approach, and implementation phases.

Your task now is to IMPLEMENT IT carefully in the CURRENT REAL WORKSPACE.

============================================================
0. FIRST PERSIST THIS ENTIRE IMPLEMENTATION SPECIFICATION
============================================================

BEFORE modifying application code, persist these instructions inside the workspace.

At the project root, create:

IMPLEMENTATION_PROMPT.md

Store the COMPLETE implementation specification from this message inside IMPLEMENTATION_PROMPT.md.

Do not summarize it.
Do not shorten it.
Do not omit requirements.
Do not rewrite it into a materially different specification.

This file is intended to let future OpenCode sessions continue this modernization without requiring this giant prompt to be pasted again.

After creating IMPLEMENTATION_PROMPT.md:

Inspect AGENTS.md.

If AGENTS.md exists:
- preserve all useful existing instructions
- update it minimally so future agents are instructed to read:
  1. PROJECT_SPEC.md
  2. UI_SECURITY_REVAMP_SPEC.md
  3. IMPLEMENTATION_PROMPT.md

If AGENTS.md does not exist:
create a concise root-level AGENTS.md stating that:

- PROJECT_SPEC.md is authoritative for ER/database/business meaning.
- UI_SECURITY_REVAMP_SPEC.md is authoritative for the current frontend/security modernization direction.
- IMPLEMENTATION_PROMPT.md contains the detailed approved implementation contract.
- The existing technology stack must be preserved.
- React, Next.js, Vue, Angular, Svelte, Tailwind, TypeScript, Node.js, npm-based frontend architecture and framework migration are forbidden.

Also inspect UI_SECURITY_REVAMP_SPEC.md.

If it does not exist:
create it.

If it exists:
preserve useful content and update it only as necessary.

UI_SECURITY_REVAMP_SPEC.md should be a concise permanent specification covering:

- Surveyed Structure visual direction
- approved brand palette
- typography direction
- multi-page public website
- authenticated/public navigation
- backend-enforced role-based access
- database-driven analytics
- meaningful data visualization
- no unnecessary UI content
- technology constraints

Do NOT duplicate this entire implementation prompt into UI_SECURITY_REVAMP_SPEC.md.

The roles are:

IMPLEMENTATION_PROMPT.md
= detailed implementation contract

UI_SECURITY_REVAMP_SPEC.md
= concise permanent modernization specification

AGENTS.md
= tells future AI agents what sources to read and what rules are non-negotiable

Before continuing, verify that:

- IMPLEMENTATION_PROMPT.md exists
- AGENTS.md references the relevant modernization files
- UI_SECURITY_REVAMP_SPEC.md exists
- the files accurately preserve the current approved direction

Then immediately begin implementation.

Do NOT stop and ask me to create these files manually.

============================================================
1. APPROVED PLAN IS THE DESIGN CONTRACT
============================================================

The approved modernization plan defines the implementation direction.

The core design concept is:

SURVEYED STRUCTURE

NIRMAN should combine:

PUBLIC WEBSITE
→ architectural editorial design
→ spacious composition
→ strong property/project presentation
→ concise content

AUTHENTICATED APPLICATION
→ structured enterprise workbench
→ information hierarchy
→ real operational data
→ decisions, exceptions, actions and drill-downs

Do not reinterpret this into a generic SaaS dashboard.

Do not replace the approved direction merely because another design style is easier.

============================================================
2. ABSOLUTE TECHNOLOGY CONSTRAINT
============================================================

The existing stack MUST remain:

FRONTEND
- HTML5
- CSS3
- Bootstrap
- Vanilla JavaScript

BACKEND
- PHP 7.4
- OCI8

DATABASE
- Oracle Database 11g

DO NOT introduce:

- React
- Next.js
- Vue
- Angular
- Svelte
- TypeScript
- Tailwind CSS
- Node.js
- npm-based frontend architecture
- frontend bundlers
- SPA migration
- frontend framework replacement
- PHP frameworks
- ORMs

Do not rewrite the application architecture.

Modern visual quality must be achieved inside the current stack.

============================================================
3. APPROVED VISUAL IDENTITY
============================================================

Use the approved visual direction as the starting design system:

Primary / Site Green:
#173E38

Deep Structural Green:
#0E2D29

Fired Clay Accent:
#B55338

Clay Tint:
#F3DED6

Limestone:
#F3F0E8

Paper:
#FFFEFA

Structural Ink:
#202927

Secondary Ink:
#5A6863

Boundary:
#D3D8D2

Strong Boundary:
#96A39E

Semantic colors:

Success:
#276847

Warning:
#8A5B08

Danger:
#A23B45

Information:
#2E6674

Brand colors must NEVER replace semantic status meaning.

Fired Clay is an accent, not a warning/error color.

IMPORTANT:

Fired Clay must be used with restraint.

Do NOT overuse terracotta/clay.

The expected visual balance should generally feel like:

- mostly Paper/Limestone surfaces
- structural green for identity/navigation/major controls
- charcoal/ink typography
- Fired Clay only as selected emphasis/accent
- semantic colors only for real status

If visual implementation makes the palette feel:

- rustic
- muddy
- overly earthy
- restaurant-like
- interior-design-brand-like
- insufficiently enterprise

you may refine saturation/lightness slightly while preserving the same distinctive brand direction.

DO NOT fall back to:

- navy + gold
- generic SaaS blue
- purple gradients
- excessive blue gradients
- neon cyan
- excessive glassmorphism
- generic ChatGPT/AI-style palettes

The final identity must feel custom to NIRMAN.

============================================================
4. TYPOGRAPHY
============================================================

Approved typography direction:

Public editorial / major headings:
Source Serif 4

UI / application / body:
Source Sans 3

Use approximately:

- Source Serif 4 weights 600 and 700
- Source Sans 3 weights 400, 500, 600 and 700

Dashboard headings should remain mostly sans-serif.

Serif should be used strategically on:

- public hero
- major public section headings
- selective architectural/editorial moments

Use tabular numerals where useful for:

- money
- percentages
- dates
- IDs
- KPIs

Body text should generally remain around 15–16px.

Metadata should not become unreadably small.

Do not make typography ornamental or difficult to scan.

No remote runtime font dependency should be introduced unnecessarily.

If locally hosted fonts are practical, use them.

If local font availability creates a technical problem, preserve the visual intent using appropriate robust fallbacks rather than introducing new infrastructure.

============================================================
5. NO GENERIC AI DESIGN
============================================================

The final application must NOT look like:

- default Bootstrap
- generic admin template
- generic AI-generated SaaS
- excessive cards everywhere
- excessive rounded pills
- gradient-heavy startup UI
- glassmorphism
- decorative dashboard clutter
- copied ChatGPT-style design language

Use:

- architectural structure
- low-radius surfaces
- fine boundaries
- restrained elevation
- strong whitespace
- asymmetric editorial composition on public pages
- measured grid structure
- survey/structural line motifs where useful
- purposeful icons
- sophisticated responsive behavior
- subtle interactions around 120–180ms where appropriate

Avoid:

- excessive shadows
- excessive gradients
- huge pill buttons everywhere
- random badges
- fake status indicators
- decorative charts
- useless animation
- large filler paragraphs

Do not add visual elements merely because they look fashionable.

============================================================
6. NO UNNECESSARY CONTENT
============================================================

This requirement is STRICT.

Do NOT add unnecessary:

- English sentences
- marketing filler
- subtitles
- helper paragraphs
- generic motivational copy
- fake statistics
- fake notifications
- badges
- decorative labels
- filler cards
- placeholder sections
- TODO text
- fake achievements
- fake awards
- fake “Live” indicators
- fake “Featured” labels
- excessive explanatory text
- unnecessary source-code comments

Avoid generic AI copy such as:

"Manage smarter."
"Unlock the future."
"Everything you need in one place."
"Welcome to your powerful dashboard."
"Build better."
"Transform your future."
"Experience seamless management."

Every visible element must represent a real:

- piece of information
- state
- action
- navigation route
- business function
- brand element

Badges should appear only when representing genuine state such as:

Pending
Approved
Active
Completed
Rejected
Overdue
Verified
Resolved
Confirmed

Code comments should explain only:

- genuinely non-obvious logic
- security-sensitive behavior
- important logical sections
- unusual path/compatibility decisions

Do not comment obvious HTML/CSS/JS.

============================================================
7. SECURITY IS BACKEND-ENFORCED
============================================================

Frontend hiding is NOT security.

Use:

authenticated session
→ identity / role
→ PHP authorization
→ scoped Oracle query
→ authorized data
→ frontend

Do NOT send unauthorized organizational data to the browser and then hide/filter it with JavaScript.

Implement the approved access model.

ADMIN

Admin is an application/access-control role.

Admin receives broad legitimate system-level oversight and management access.

Admin must NOT replace Employee in ER-defined operational relationships merely for convenience.

EMPLOYEE

Employees retain ER-defined operational responsibilities, including where applicable:

- publishing tenders
- reviewing relevant bids
- issuing tender awards
- verifying payments
- resolving complaints
- confirming booking-allocation processes
- supervising contractors
- viewing relevant construction projects
- viewing relevant project progress

BUT Employee data must be scoped to:

- owned
- assigned
- responsibility-relevant
- supervision-relevant
- legitimate shared queues where the schema provides no pre-assignment

Do NOT give every Employee unrestricted organizational data.

CLIENT

Private data must be limited to the logged-in Client:

- profile
- own bookings
- own allocation information
- own payments
- own installments
- own complaints

plus appropriate public project/property information.

CONTRACTOR REPRESENTATIVE

Private data must be limited to the logged-in Representative's:

- own profile
- represented contractor
- eligible/relevant published tenders
- own submitted bids
- awards derived from those bids
- resulting projects
- authorized project updates

Never trust caller-supplied actor IDs when session identity can determine the actor.

============================================================
8. EMPLOYEE SCOPING
============================================================

Follow the approved ownership model where supported by the actual schema.

Examples:

Tenders:
Tenders.Emp_id = session emp_id

Bids:
reach through tenders legitimately owned/published by the Employee.

Awards:
reach through the Employee's legitimate tender/bid workflow where appropriate.

Payments:
Verified_by_Emp_id = session emp_id for relevant completed/assigned records where supported.

Complaints:
Resolved_by_Emp_id = session emp_id for relevant records.

Contractors:
through Supervises.Emp_id.

Projects:
through legitimate tender/award involvement or supervised-contractor relationships.

Pending allocations:
a shared Employee queue may exist because the current schema does not provide a pre-confirmation Employee assignment.

Completed allocation records must retain the confirming Employee identity.

Do not invent new ER relationships merely for access control.

============================================================
9. CLIENT OWNERSHIP
============================================================

Client private data should follow legitimate ownership chains such as:

session Client
→ Booking
→ Payment
→ Installment

and:

session Client
→ Complaint

Do not trust client-supplied Cl_id when session identity already identifies the logged-in Client.

Cross-record ID manipulation must not expose another Client's data.

============================================================
10. CONTRACTOR REPRESENTATIVE OWNERSHIP
============================================================

Representative private data should follow legitimate ownership chains such as:

session Representative
→ Tender Bid
→ Tender Award
→ Construction Project
→ Project Update

and:

session Representative
→ represented Contractor

Do not expose another Representative's bids, awards, projects or updates through manipulated IDs.

============================================================
11. AUTHENTICATION / SESSION HARDENING
============================================================

Implement carefully:

- shared session/API helper where appropriate
- consistent JSON responses
- HTTP method enforcement
- role checks
- 400 / 401 / 403 / 404 / 409 / 500 behavior where appropriate
- session_regenerate_id(true) after successful login
- stale identity cleanup
- normalized session identity
- CSRF protection for authenticated mutations
- POST-only logout
- session destruction
- session-cookie invalidation
- generic browser-safe errors
- no Oracle/internal-path leakage

Normalize session identity where appropriate around:

- person_id
- role
- role_id
- emp_id where applicable
- csrf_token

Do not break the currently working OCI8/Oracle connection.

Do NOT modify backend/config/db.php credentials.

============================================================
12. PASSWORD MIGRATION
============================================================

Person.Password currently needs enough space for complete bcrypt hashes.

Perform migration safely in this exact logical order:

1. Expand Person.Password appropriately, preferably VARCHAR2(255), without changing ER meaning.
2. Update the canonical database/schema.sql.
3. Provide/apply a controlled migration for the currently running database.
4. Replace plaintext demo/seed passwords with valid bcrypt hashes.
5. Preserve known test credentials so team members can still log in using documented passwords.
6. Migrate all known demo accounts, including Admin where applicable.
7. Verify Employee login.
8. Verify Client login.
9. Verify Contractor Representative login.
10. Verify Admin login.
11. Verify Client registration.
12. Verify Contractor Representative registration.
13. Confirm new registration stores complete bcrypt hashes without truncation.
14. Only AFTER successful verification remove plaintext authentication fallback.
15. Normalize or retire duplicate Employee login logic if the project currently has duplicate implementations.

Do not create a state where nobody can log in.

============================================================
13. REAL LOGOUT
============================================================

Add a genuine logout endpoint.

Logout must:

- use POST
- apply appropriate CSRF protection for authenticated requests
- destroy the server session
- clear/expire the session cookie
- return or redirect safely to the public site

Connect all role interfaces to the real logout flow.

============================================================
14. SERVER-SIDE MUTATION SECURITY
============================================================

Authenticated mutation endpoints must:

- verify session
- verify correct role
- verify ownership/relevance
- verify method
- verify CSRF
- validate data
- reject caller-supplied actor identity where the session should determine the actor
- return safe JSON errors

Where multi-statement database operations must succeed together:

use controlled OCI transactions.

Prefer:

OCI_NO_AUTO_COMMIT
→ execute all required statements
→ final commit
→ rollback on failure

Do this only where genuinely necessary.

Do not overengineer ordinary single-statement operations.

============================================================
15. SERVER-SIDE BUSINESS VALIDATION
============================================================

Where relevant and supported by project meaning, enforce real business validation server-side.

Examples:

- bid deadline must not be passed
- monetary values must be positive when required
- progress percentage must be within valid range
- state transitions must be legitimate
- Representative approval should be revalidated for sensitive requests
- effective availability must be checked before booking

Do not invent arbitrary business rules not supported by the specification.

============================================================
16. PUBLIC WEBSITE MUST BECOME MULTI-PAGE
============================================================

Create the approved public architecture:

index.html
→ Home

projects.html
→ Public project catalogue

properties.html
→ Public property/unit catalogue

about.html
→ About NIRMAN

login.html
→ Employee / Client / Contractor Representative login

admin-login.html
→ Admin login

register.html
→ Client / Contractor Representative registration

Home may contain previews.

BUT:

Projects
Properties
About

must be real destination pages rather than only scrolling to sections of index.html.

Do not create unnecessary public pages.

============================================================
17. AUTHENTICATED USERS MUST STILL USE THE PUBLIC SITE
============================================================

This is NON-NEGOTIABLE.

A logged-in user must NOT have to sign out to visit:

Home
Projects
Properties
About

Preserve authentication while using the public website.

Public navigation must adapt to session state.

GUEST:

Home
Projects
Properties
About
Login
Register

AUTHENTICATED ORDINARY USER:

Home
Projects
Properties
About
Dashboard
Profile
Sign Out

ADMIN:

Home
Projects
Properties
About
Dashboard
Sign Out

unless a genuine Admin profile route already exists.

Dashboard sidebars should include:

Public Site

which returns to index.html without destroying the session.

============================================================
18. PUBLIC SESSION DETECTION
============================================================

Use the existing/current-user mechanism or improve it cleanly.

Public pages should query something equivalent to:

get_current_user.php

to determine whether the user is authenticated.

Do not expose sensitive information in this response.

Return only the minimum identity/navigation information needed by the public UI.

============================================================
19. REAL DATA REPRESENTATION
============================================================

The instructor explicitly rejected:

SQL query
→ rows
→ plain table

as the dominant interface pattern.

Use:

Oracle scoped query
→ PHP authorization
→ aggregate/structured JSON
→ Vanilla JavaScript
→ meaningful visualization
→ drill-down detailed records

Tables remain important for:

- exact records
- detailed administration
- audit/detail workflows

But tables should usually appear AFTER:

- summary
- visualization
- filters
- action queues
- meaningful context

============================================================
20. DATA VISUALIZATION RULES
============================================================

Build meaningful visualizations based ONLY on data the schema genuinely supports.

PUBLIC:

- real project count
- effective available-unit count
- legitimate published opportunity count
- project cards
- latest-progress bars

ADMIN:

- pending-work composition
- project status distribution
- payment status distribution
- payment amount distribution where meaningful
- complaint states
- allocation states
- deadline watch
- recent real dated events

EMPLOYEE:

- assigned/relevant action queue
- owned-tender bid comparison
- relevant project progress comparison
- supervised-contractor overview
- deadline timeline

CLIENT:

- booking/allocation progression
- payment summary
- installment due schedule
- complaint status
- current next real action

CONTRACTOR REPRESENTATIVE:

- bid outcome distribution
- award pipeline
- awarded-project progress
- project-update timeline
- tender deadline watch

============================================================
21. IMPORTANT DATA RULES
============================================================

Current project progress must mean:

the latest Project_Update ordered by:

1. Update_date
2. then Update_id

Do NOT use:

MAX(Progress_percent)

as current progress.

Effective unit availability must mean:

Status = 'Available'

AND

no existing Booking for that unit.

Do NOT fabricate:

- revenue
- profit
- conversion rate
- schedule-performance metrics
- construction-spend metrics
- fake growth percentages
- fake trend percentages

Do NOT create a payment trend chart unless genuine payment transaction-date data exists.

Every visualization must answer a real business question.

============================================================
22. VISUALIZATION IMPLEMENTATION
============================================================

Prefer lightweight solutions compatible with the current stack.

Accessible:

- CSS visualizations
- SVG
- inline SVG where appropriate
- simple Vanilla JavaScript

are acceptable.

If a lightweight charting library is genuinely required, it may be used only if:

- it works directly in the browser
- it requires no React
- it requires no npm-based architecture
- it requires no build pipeline
- it does not replace the current stack

Do not introduce a frontend framework merely to draw charts.

Charts/visualizations should include:

- direct labels where practical
- accessible text equivalents where appropriate
- clear legends only when needed
- drill-down links when useful

============================================================
23. PUBLIC HOMEPAGE
============================================================

Implement the premium Surveyed Structure visual direction.

The homepage should feel:

- architectural
- editorial
- contemporary
- enterprise-level
- property-tech oriented
- distinctive
- professional

Use:

- strong hero composition
- appropriate project/property imagery if legitimate assets exist
- restrained architectural line/grid motifs
- concise public information
- real summary metrics
- selected project previews
- selected property previews
- direct catalogue navigation
- polished footer

Do not fabricate:

- real company history
- awards
- leadership claims
- fake office addresses
- fake customer counts
- market dominance
- fake testimonials
- fake achievements

Do not use random SaaS stock illustrations.

============================================================
24. PROJECTS PAGE
============================================================

Create a professional public project catalogue.

Use where useful:

- search
- filters
- project card/list hybrid
- area
- status
- deadline
- latest recorded progress
- meaningful progress representation
- project details
- update timeline/detail drill-down

Keep public information intentionally scoped.

============================================================
25. PROPERTIES PAGE
============================================================

Create a global public unit/property catalogue.

Use:

- responsive property/unit cards
- type filters
- status filters
- effective availability
- concise unit information
- authenticated booking action where legitimate

IMPORTANT:

The ER model does not establish a direct relationship between every unbooked unit and a Construction Project.

Do NOT invent false project-to-unit relationships.

Do not display unsupported project names on units merely to make cards richer.

============================================================
26. ABOUT PAGE
============================================================

Keep About concise.

Explain only:

- what NIRMAN is
- its operational scope
- key workflows
- legitimate user roles

Do NOT fabricate:

- company history
- awards
- leadership claims
- market statistics
- offices
- fake contact details

============================================================
27. AUTHENTICATION PAGES
============================================================

Redesign:

- login.html
- admin-login.html
- register.html

Use:

- focused layout
- clear hierarchy
- role context
- concise validation
- safe error messages
- session-expired state where useful
- responsive behavior

Registration should expose only legitimate fields.

Client and Contractor Representative registration remain public.

Employee/Admin public registration must not be added.

============================================================
28. ROLE DASHBOARDS
============================================================

Do NOT create four copies of one dashboard.

ADMIN DASHBOARD:

- action queue first
- system-level operational distributions
- deadlines
- project status
- payment status
- complaint/allocation overview
- real recent events
- management drill-down

EMPLOYEE DASHBOARD:

- assigned/relevant work
- pending actions
- deadlines
- relevant projects
- supervised contractors
- direct action routes

CLIENT DASHBOARD:

- next action
- current booking/allocation
- amount genuinely due
- installments
- support/complaint status
- direct route to public projects/properties

CONTRACTOR REPRESENTATIVE DASHBOARD:

- eligibility/approval state
- tender opportunities
- own bid outcomes
- awards
- awarded projects
- project progress
- update actions

============================================================
29. ADMIN PAGE REDESIGN
============================================================

Redesign Admin areas around workflows, not raw entities.

DASHBOARD
→ action queue first, operational summaries, deadlines, events

PEOPLE
→ Employee/Department/Client summaries, directories and contextual details

CONTRACTORS
→ Representative approval queue, contractor/license status, representation and supervision relationships

PORTFOLIO
→ project-first management, progress comparison, area/update drill-down

ALLOCATIONS
→ pending process queue, allocation stage/context, confirmation action

FINANCE
→ payment status/amount summaries, verification context, payment/installment details

COMPLAINTS
→ unresolved-first queue, status distribution, detail/resolution

TENDERS
→ Tender → Bid → Award → Project pipeline

Do not turn every page into a dashboard.

Detailed data tables are still appropriate beneath meaningful summaries and workflow context.

============================================================
30. EMPLOYEE PAGE REDESIGN
============================================================

EMPLOYEE PROFILE

Show legitimate:

- personal information
- Department
- manager
- subordinates where supported

EMPLOYEE TENDERS

Show:

- own/published tenders
- received relevant bids
- publication
- review
- award
- resulting project context

EMPLOYEE ALLOCATIONS

Show:

- pending shared queue where legitimate
- own confirmation history

EMPLOYEE PAYMENTS

Show:

- assigned/relevant verification queue
- payment context
- installment context

EMPLOYEE COMPLAINTS

Show:

- assigned/relevant unresolved complaints
- detail
- resolution action

EMPLOYEE PROJECTS

Show:

- supervised/relevant projects
- progress
- deadlines
- contractors
- update history

Do not expose unrelated organization-wide records.

============================================================
31. CLIENT PAGE REDESIGN
============================================================

CLIENT PROFILE

Show legitimate Person + Client + contact information.

CLIENT BOOKINGS

Show:

- booking creation
- reserved unit
- project only when legitimately linked through the booking
- confirmation/allocation state
- related payments

CLIENT PAYMENTS

Show:

- own payments
- own installments
- booking context
- payment submission receipt/result where implemented

CLIENT COMPLAINTS

Show:

- filing form
- own complaint history
- status
- resolution

CLIENT PROJECTS / PROPERTIES

Reuse the session-aware public:

projects.html
properties.html

Do not maintain unnecessary duplicate client catalogues.

============================================================
32. CONTRACTOR REPRESENTATIVE PAGE REDESIGN
============================================================

PROFILE

Show:

- own identity
- approval status
- represented contractor
- contractor/license context

TENDERS

Show:

- eligible published tenders
- details
- own bid status
- bid submission

BIDS

Show:

- own bids
- bid-status distribution
- award context
- resulting-project context

PROJECTS

Show:

- own awarded/relevant projects
- deadlines
- current progress
- authorized update history

UPDATES

Show:

- relevant project selection
- progress submission
- previous-update timeline

============================================================
33. REMOVE FIXTURE-DEPENDENT PRODUCTION VIEWS
============================================================

Where the real PHP/Oracle backend exists, production-facing pages should no longer pretend fixture data is live data.

Replace obsolete:

- js/data.js production rendering
- mock-data-based dashboard counts
- hardcoded production statistics

where appropriate with actual scoped API data.

Do not remove fixture data if it remains useful for an isolated test/demo purpose.

Do not display fake numbers merely because a real endpoint does not yet exist.

Implement the necessary scoped endpoint where appropriate.

============================================================
34. DATA API DESIGN
============================================================

Where required, create small, focused endpoints for:

- public summaries
- public project catalogue
- public property availability
- Admin dashboard summaries
- Employee dashboard summaries
- Client dashboard summary
- Contractor Representative dashboard summary

Do not create huge "return the entire database" endpoints.

Return only data needed for that experience.

Prefer useful aggregates using course-compatible Oracle SQL concepts such as:

- COUNT
- SUM
- AVG
- MIN
- MAX
- GROUP BY
- HAVING
- straightforward JOINs

Avoid unnecessary advanced Oracle features.

============================================================
35. DATE OUTPUT
============================================================

Format Oracle dates explicitly and consistently for APIs.

Prefer stable, predictable values such as ISO-like formats where practical.

Do not rely on environment-dependent implicit Oracle date formatting.

============================================================
36. ERROR HANDLING
============================================================

API responses should not expose:

- Oracle error internals
- server file paths
- credentials
- raw stack traces

Browser-facing errors should be safe and useful.

Development diagnostics may log deeper details server-side where appropriate.

============================================================
37. DIAGNOSTICS SECURITY
============================================================

Diagnostic endpoints such as:

- phpinfo
- test connection
- environment inspection

must not remain casually public in final production-facing flow.

Preserve useful developer diagnostics if needed, but protect or isolate them appropriately.

============================================================
38. RESPONSIVE DESIGN
============================================================

The complete experience must work on:

- desktop
- laptop
- tablet
- mobile

Public editorial layouts should gracefully recompose.

Authenticated workspaces should remain usable rather than simply squeezing desktop layouts.

Mobile navigation must preserve the same information hierarchy and actions.

Tables should adapt intelligently where necessary.

Do not hide essential actions on small screens.

============================================================
39. ACCESSIBILITY
============================================================

Maintain:

- readable color contrast
- visible focus states
- semantic HTML
- keyboard-usable controls
- sensible labels
- accessible form errors
- accessible status communication
- chart/text equivalents where useful

Do not sacrifice accessibility for visual polish.

============================================================
40. SHARED FRONTEND SYSTEM
============================================================

Create a coherent shared design system through existing CSS/JS architecture.

Establish consistent:

- design tokens / CSS custom properties where appropriate
- typography
- spacing
- surfaces
- boundaries
- buttons
- inputs
- select controls
- tables
- filters
- status indicators
- navigation
- sidebar
- topbar
- modal styling
- empty states
- loading states
- error states
- timeline styling
- visualization styling
- responsive behavior

Avoid duplicating unrelated styles on every page when a clear shared style belongs in common CSS.

Do not build a component framework.

============================================================
41. NAVIGATION QUALITY
============================================================

The application must not contain dead-end pages.

Users should always understand:

- where they are
- what they can do
- where they can go next

Use where useful:

- breadcrumbs
- page titles
- contextual primary action
- safe back navigation
- dashboard links
- public-site links
- detail drill-down

Do not clutter every page with breadcrumbs if they add no value.

============================================================
42. LOADING / EMPTY / ERROR STATES
============================================================

Where async API data is loaded, provide controlled states.

LOADING
→ minimal, subtle indication

EMPTY
→ concise real explanation + legitimate next action if one exists

ERROR
→ safe message + retry/back action where appropriate

Do not create decorative empty-state illustrations merely to fill space.

============================================================
43. FRONTEND-DESIGN SKILL
============================================================

A project-local professional frontend-design skill exists.

If it is available in the current callable skill registry:
use it.

If it is not callable:
do NOT stop implementation.
do NOT spend a large amount of time debugging skill discovery.
do NOT pretend to have invoked it.

Follow this approved design contract directly.

============================================================
44. PROTECT WORKING INFRASTRUCTURE
============================================================

The following currently work and must remain working:

- XAMPP
- Apache
- PHP
- OCI8
- Oracle Instant Client
- Oracle Database connection
- current endpoint path structure after recent repair
- current login flow after recent repair

Do NOT modify:

- php.ini
- XAMPP configuration
- OCI8 installation
- Oracle Instant Client setup
- Oracle credentials
- backend/config/db.php credentials

unless a genuine defect requires it and the cause is proven.

============================================================
45. CURRENT WORKSPACE ORGANIZATION
============================================================

Respect the currently reorganized workspace.

Do not undo the recent restructuring merely because older documentation references older locations.

When adding files, place them logically according to the current structure.

Do not move working backend files unnecessarily.

Do not modify NIRMAN_DEMO_PACKAGE unless explicitly required.

============================================================
46. PATH SAFETY
============================================================

When modifying PHP includes/require paths or frontend fetch paths:

use the CURRENT filesystem structure.

Do not guess paths from old prompts.

Verify target files exist.

Prefer stable project-root-oriented path strategies for shared backend resources where appropriate.

Do not reintroduce fragile path bugs.

============================================================
47. IMPLEMENTATION PHASES
============================================================

Work PHASE BY PHASE.

Do not blindly modify the entire workspace first and test afterward.

PHASE 1
ESTABLISH BASELINES

Verify currently working:

- database connection
- login
- sessions
- role routing
- major existing endpoint responses
- major current workflows

Record enough baseline context to detect regression.

Do NOT perform another giant whole-workspace audit.

PHASE 2
PASSWORD / AUTHENTICATION MIGRATION

- expand password storage
- synchronize schema
- migrate hashes safely
- verify all role logins
- verify registration
- remove plaintext fallback only after verification

PHASE 3
AUTH / SECURITY FOUNDATION

Implement:

- shared API/session helper
- normalized session identity
- role checks
- JSON error helpers
- method enforcement
- CSRF
- secure logout
- session regeneration
- safe error handling

PHASE 4
ROLE-SCOPED ACCESS

Secure and scope:

- Admin endpoints
- Employee endpoints/actions
- Client reads/actions
- Contractor Representative reads/actions

Remove caller-controlled actor identity where inappropriate.

PHASE 5
REAL DATA ENDPOINTS

Create/fix:

- public catalogue data
- public summary data
- role dashboard aggregate data
- necessary scoped analytics endpoints

PHASE 6
GLOBAL DESIGN SYSTEM

Implement:

- palette
- typography
- spacing
- navigation
- sidebar
- topbar
- buttons
- forms
- panels
- tables
- filters
- timelines
- visualizations
- loading/empty/error states
- responsive rules
- accessibility states

PHASE 7
PUBLIC WEBSITE

Implement/redesign:

- index.html
- projects.html
- properties.html
- about.html
- login.html
- admin-login.html
- register.html
- session-aware public navigation

PHASE 8
ROLE DASHBOARDS

Redesign:

- Admin dashboard
- Employee dashboard
- Client dashboard
- Contractor Representative dashboard

Use real scoped data.

PHASE 9
OPERATIONAL PAGES

Redesign role pages carefully using the established design system.

Do not re-invent the design per page.

PHASE 10
CONTENT CLEANUP

Remove:

- obsolete fixture-driven production UI
- filler text
- meaningless badges
- placeholders
- fake statistics
- dead links
- unnecessary comments
- obsolete mock behavior
- duplicate/unused navigation

PHASE 11
FULL AUDIT

Perform:

- responsive audit
- accessibility audit
- role security audit
- Oracle/API validation
- browser console check
- endpoint JSON check
- navigation/path validation
- workflow regression testing

PHASE 12
DOCUMENTATION UPDATE

Update as appropriate:

- UI_SECURITY_REVAMP_SPEC.md
- FRONTEND_PLAN.md
- IMPLEMENTATION_STATUS.md
- PROJECT_CODE_GUIDE.md
- README.md
- AGENTS.md
- IMPLEMENTATION_PROMPT.md only if a genuinely approved implementation requirement changed during execution

============================================================
48. TEST AFTER EVERY MAJOR PHASE
============================================================

Do not wait until the end.

After each phase:

verify the affected flows before continuing.

Use appropriate checks such as:

- php -l
- direct PHP execution where useful
- browser/API behavior
- endpoint JSON validity
- HTTP status behavior
- role access
- session behavior
- direct Oracle result comparison where necessary
- link/path validation
- console errors
- responsive inspection

If a phase introduces a regression:

FIX IT before moving on.

============================================================
49. SECURITY TESTS
============================================================

Explicitly verify:

- Employee login succeeds
- Client login succeeds
- Contractor Representative login succeeds
- Admin login succeeds
- bcrypt-backed credentials work
- plaintext passwords no longer authenticate after migration
- session ID regenerates after login
- logout invalidates session
- logout invalidates/clears cookie
- public pages remain accessible while logged in
- public navigation shows correct authenticated controls
- direct protected-page access requires correct role
- Admin APIs reject guests
- Admin APIs reject non-Admins
- Employee endpoints do not expose unrelated organization data
- Client cannot retrieve another Client's private records by changing IDs
- Representative cannot retrieve another Representative's bids/projects
- mutation endpoints reject invalid/missing CSRF
- backend does not leak Oracle/internal errors

============================================================
50. DATA VALIDATION TESTS
============================================================

Explicitly verify:

- current project progress uses latest update, not MAX(progress)
- available units exclude already-booked units
- dashboard totals match Oracle data
- visualizations match endpoint values
- no fake analytics remain
- filters produce correct visible data
- status counts match actual database state

============================================================
51. PUBLIC WEBSITE TESTS
============================================================

Verify:

GUEST:
- Home works
- Projects works
- Properties works
- About works
- Login visible
- Register visible

AUTHENTICATED CLIENT:
- public pages remain accessible
- Dashboard visible
- Profile visible
- Sign Out visible
- session remains active

AUTHENTICATED EMPLOYEE:
same expected authenticated public behavior.

AUTHENTICATED CONTRACTOR REPRESENTATIVE:
same expected authenticated public behavior.

ADMIN:
- public pages remain accessible
- Dashboard visible
- Sign Out visible
- no forced logout for homepage access

============================================================
52. USER JOURNEY TESTS
============================================================

CLIENT journey:

Projects
→ Properties
→ Unit Details
→ Booking
→ Allocation
→ Payment
→ Installments

Verify the legitimate supported path works.

EMPLOYEE journey:

Dashboard
→ relevant pending action
→ detail
→ authorized action
→ result

CONTRACTOR REPRESENTATIVE journey:

Tender
→ Bid
→ Bid Status
→ Award
→ Project
→ Project Update

ADMIN journey:

Dashboard
→ management area
→ detail/workflow
→ legitimate management action

============================================================
53. NO ER REDESIGN
============================================================

Do NOT:

- create new database entities merely for frontend convenience
- change ER cardinalities
- invent direct relationships
- change weak-entity meaning
- change specialization meaning
- change aggregation meaning

Access-control/session structures are application-level concerns and must not distort the ER model.

============================================================
54. DO NOT OVERENGINEER
============================================================

Although the visual result must be highly sophisticated:

do not build:

- a frontend framework
- a component engine
- a custom router
- a dependency injection system
- an ORM
- a PHP framework
- a build pipeline
- unnecessary abstraction layers
- unnecessary helper libraries

Use sophistication for the PRODUCT EXPERIENCE, not architecture for architecture's sake.

============================================================
55. VISUAL QUALITY CONTROL
============================================================

During implementation, continuously compare the visual result against the approved design intent.

The website must feel:

- custom
- architectural
- modern
- premium
- restrained
- enterprise-level
- cohesive

If a page starts looking like:

- generic Bootstrap
- generic admin template
- generic AI dashboard
- over-rounded SaaS
- gradient-heavy startup design

correct it.

Do not blindly repeat one component everywhere.

Maintain hierarchy between:

- public editorial pages
- authenticated dashboards
- workflow/detail pages

============================================================
56. COLOR QUALITY CONTROL
============================================================

Evaluate the actual rendered pages.

If Site Green + Fired Clay + Limestone works:
preserve it.

If Fired Clay becomes visually dominant:
reduce its usage.

If backgrounds look muddy:
refine Limestone/Paper balance.

If the result becomes rustic:
reduce saturation and use Structural Ink/Green more strongly.

Do NOT switch to navy/gold or generic blue merely because that is easier.

============================================================
57. INFORMATION DENSITY
============================================================

Authenticated dashboards may be information-dense, but not cluttered.

Prioritize:

1. What needs attention?
2. What changed?
3. What is current state?
4. What action is available?
5. What detail can be drilled into?

Do not place giant raw tables at the top of dashboards.

============================================================
58. TABLE DESIGN
============================================================

Tables remain legitimate for detailed records.

Improve them with:

- concise headers
- filters where useful
- search where useful
- restrained row separators
- status indicators
- clear actions
- responsive treatment
- detail drill-down

Do not turn every table into an oversized decorative card.

============================================================
59. FORM DESIGN
============================================================

Forms should use:

- logical grouping
- clear labels
- visible validation
- concise helper text only when necessary
- strong primary/secondary action hierarchy
- responsive layout
- safe error states

Avoid unnecessary explanations.

============================================================
60. STATUS DESIGN
============================================================

Status appearance must be semantic and consistent.

Examples:

Pending
Approved
Confirmed
Completed
Rejected
Active
Resolved
Overdue
Verified

Do not create fake status vocabulary solely for visual variety.

============================================================
61. PUBLIC PROJECT/PROPERTY IMAGERY
============================================================

Use project/property imagery only if appropriate assets exist or legitimate project assets can be used.

Do not fabricate real company properties/history.

Do not use obviously irrelevant stock SaaS illustrations.

If imagery is unavailable, use strong architectural composition, diagrams, line motifs and real data rather than fake photos.

============================================================
62. EXISTING FUNCTIONALITY PROTECTION
============================================================

Do NOT silently remove working functionality.

Before removing or replacing a working behavior:

understand its purpose.

If its UI is poor:
redesign the presentation while preserving the legitimate function.

If it is insecure:
secure it while preserving valid authorized functionality.

============================================================
63. FILE MODIFICATION EXPECTATIONS
============================================================

Likely additions include, where genuinely required:

- IMPLEMENTATION_PROMPT.md
- UI_SECURITY_REVAMP_SPEC.md if missing
- AGENTS.md if missing
- projects.html
- properties.html
- about.html
- local font assets if practical
- backend/lib/api.php or equivalent small shared helper
- backend/lib/policy.php or equivalent small ownership helper
- backend/api/auth/logout.php
- role dashboard summary endpoints
- missing scoped Employee endpoints/actions
- controlled password migration file/script where appropriate

Likely modifications include:

- index.html
- login.html
- admin-login.html
- register.html
- css/style.css
- css/responsive.css
- js/common.js
- js/public.js
- js/auth.js
- js/admin.js
- js/employee.js
- js/client.js
- js/contractor.js
- role HTML pages
- authentication/current-user endpoints
- Admin APIs
- Employee APIs/actions
- Client scoped reads/actions
- Contractor Representative reads/actions
- database/schema.sql
- database/sample_data.sql
- FRONTEND_PLAN.md
- IMPLEMENTATION_STATUS.md
- PROJECT_CODE_GUIDE.md
- README.md

Do NOT modify:

- ER meaning
- database relationship structure
- backend/config/db.php credentials
- OCI/XAMPP environment
- Bootstrap source files unless a proven Bootstrap defect genuinely requires it
- NIRMAN_DEMO_PACKAGE unless explicitly necessary

============================================================
64. WORKING STYLE
============================================================

Do not ask for confirmation after every small design decision.

Resolve ordinary implementation choices from:

1. PROJECT_SPEC.md
2. UI_SECURITY_REVAMP_SPEC.md
3. IMPLEMENTATION_PROMPT.md
4. approved modernization plan
5. current working code
6. existing database/schema meaning

Ask only if an ambiguity would require:

- changing ER/database meaning
- destructive data loss
- unsupported schema redesign

Otherwise:

implement
→ test
→ fix
→ continue

============================================================
65. DO NOT RE-PLAN
============================================================

The planning phase is finished.

Do NOT respond with another huge plan.

Do NOT spend the session repeatedly summarizing what you intend to do.

Begin actual implementation.

Read individual files only when needed for the phase currently being implemented.

Do not run another massive whole-workspace exploration unless a concrete implementation blocker genuinely requires it.

============================================================
66. IF CONTEXT OR MODEL LIMIT APPROACHES
============================================================

If you approach a context/token/model limit before finishing:

DO NOT continue consuming tokens with broad analysis.

Instead:

1. finish the current safe unit of work
2. test it
3. update IMPLEMENTATION_STATUS.md with:
   - completed phases
   - partially completed phase
   - exact next step
   - known issues
4. ensure AGENTS.md and IMPLEMENTATION_PROMPT.md remain current
5. provide a concise handoff report

This must allow another OpenCode session/model to continue without repeating the audit.

============================================================
67. FINAL IMPLEMENTATION STANDARD
============================================================

The final NIRMAN must no longer feel like:

"a DBMS project displaying SQL tables."

It should feel like:

"a custom, contemporary, enterprise property-tech and construction-management product powered by a real Oracle database."

The visual interface must be:

- distinctive
- cohesive
- premium
- modern
- purposeful
- responsive
- data-driven

The security model must be:

- session-aware
- backend-enforced
- role-aware
- ownership-scoped

The public website must behave like a real professional website.

The authenticated system must behave like a real application.

Tables remain available for detailed information, but the application should communicate system state through:

- summaries
- KPIs
- progress
- timelines
- distributions
- alerts
- real visual analytics
- actionable workflow panels

============================================================
68. FINAL REPORT
============================================================

When implementation is complete, provide a concise report containing:

1. Phases completed
2. Major files created
3. Major files modified
4. Authentication/security changes
5. Role-access changes
6. Public website/navigation changes
7. Dashboard/data-visualization changes
8. Database/password changes
9. Tests performed
10. Any remaining limitations or unverified flows

Do not claim a test passed unless it was actually verified.

============================================================
69. BEGIN NOW
============================================================

FIRST:

Create/persist:

- IMPLEMENTATION_PROMPT.md
- UI_SECURITY_REVAMP_SPEC.md
- AGENTS.md updates

and verify them.

THEN:

Immediately begin PHASE 1 and continue phase-by-phase.

Do NOT return another planning document.

BEGIN IMPLEMENTATION NOW.
