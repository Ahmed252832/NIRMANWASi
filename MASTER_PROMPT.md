================================================================
NIRMAN — FRONTEND MASTER IMPLEMENTATION PROMPT
================================================================

You are the frontend development agent for my academic DBMS project.

PROJECT NAME:
NIRMAN

PROJECT TYPE:
Real Estate and Construction Management System

You are working directly inside the VS Code workspace for this project.

Your task is to design and implement the COMPLETE FRONTEND PROTOTYPE
of NIRMAN while strictly following all instructions in this file.


================================================================
0. FILES YOU MUST READ FIRST
================================================================

Before writing, creating, deleting, or modifying frontend code,
read the following file completely:

PROJECT_SPEC.md

PROJECT_SPEC.md contains the authoritative project specification,
including:

- System description
- Entities and attributes
- Specialization / ISA relationships
- Other ER relationships
- Cardinalities
- Weak entities
- Multivalued attributes
- Composite attributes
- Recursive relationships
- Aggregation
- ER-aligned DBML schema

Also inspect ALL four ER diagram reference images located inside
the references folder:

references/er-diagram-part-1.png
references/er-diagram-part-2.png
references/er-diagram-part-3.png
references/er-diagram-part-4.png

IMPORTANT:

These four images are NOT four different database designs.

They are four different visual sections of ONE large complete
ER diagram.

The original ER diagram was divided into multiple images so that
its entities, attributes, relationships and cardinalities remain
clearly visible.

Study all four images together when using the visual ER reference.

If your current environment cannot inspect one or more image files,
do NOT stop implementation merely because of that.

PROJECT_SPEC.md remains the authoritative textual specification.


================================================================
1. SOURCE-OF-TRUTH PRIORITY
================================================================

Use the following priority when interpreting the project:

1. Textual ER entity and relationship specification in PROJECT_SPEC.md
2. Explicit cardinalities and aggregation descriptions
3. Corrected ER-aligned DBML in PROJECT_SPEC.md
4. The four ER diagram images as supporting visual references

PROJECT_SPEC.md is authoritative.

The ER diagram images are provided mainly for visual cross-checking.

If an image is:

- ambiguous
- crowded
- difficult to read
- partially cropped
- visually confusing

do NOT invent an interpretation.

Follow the textual project specification instead.

Do NOT redesign the ER model.

Do NOT create new database entities or relationships merely because
they make frontend implementation easier.

Do NOT modify established cardinalities or business meaning.


================================================================
2. PROJECT IDENTITY
================================================================

The application name is:

NIRMAN

Use NIRMAN consistently throughout the frontend.

The system is an independent fictional/general-purpose Real Estate
and Construction Management System.

It must NOT be presented as the software system of any existing
real-world company or organization.

Do NOT mention Jalshree Abashon or any other real organization in:

- UI text
- mock data
- HTML
- CSS comments
- JavaScript comments
- documentation
- sample content
- headings
- branding
- footer
- README

The application must appear completely independent.


================================================================
3. USER INTERFACE LANGUAGE
================================================================

The entire application UI must be in English.

This includes:

- Navigation
- Buttons
- Forms
- Labels
- Tables
- Messages
- Dashboard content
- Login and registration pages
- Status text
- Validation messages
- Headings
- Footer


================================================================
4. APPROVED TECHNOLOGY STACK
================================================================

FRONTEND:

- HTML5
- CSS3
- Bootstrap
- Vanilla JavaScript

FUTURE BACKEND:

- PHP 7.4

DATABASE CONNECTION:

- OCI8 extension
- Oracle Instant Client

DATABASE:

- Oracle Database 11g

WEB SERVER:

- Apache HTTP Server

DATABASE DEVELOPMENT TOOL:

- Oracle SQL Developer


================================================================
5. HIGHEST-PRIORITY IMPLEMENTATION RULE
================================================================

THIS IS A BEGINNER-LEVEL ACADEMIC PROGRAMMING PROJECT.

This requirement has extremely high priority.

The frontend code MUST be understandable, reviewable, editable and
explainable by beginner programmers.

At the same time, the frontend must NOT look like a poorly designed
beginner project.

The required philosophy is:

VISUAL SOPHISTICATION IS ENCOURAGED.
CODE SOPHISTICATION IS NOT.

Or more simply:

MODERN-LOOKING UI
+
BEGINNER-FRIENDLY CODE

If visual quality can be improved using ordinary HTML, CSS,
Bootstrap and simple JavaScript, do so.

Never make the programming architecture more complicated simply to
make the site look professional.


================================================================
6. BEGINNER-FRIENDLY CODING STYLE
================================================================

Prefer:

- clear HTML structure
- normal CSS classes
- basic Bootstrap classes
- variables
- arrays
- simple JavaScript objects
- if / else
- for loops
- simple functions
- getElementById()
- querySelector() where useful
- addEventListener()
- simple DOM manipulation
- basic form validation
- basic show/hide operations
- straightforward table rendering
- straightforward search/filter logic

Break complicated functionality into multiple small steps.

Prefer:

several simple understandable statements

over:

one clever compact statement.

Avoid unnecessary nesting.

Avoid excessive abstraction.

Avoid complex reusable-component architectures.

Avoid JavaScript classes unless there is a genuine simple need.

Avoid advanced design patterns.

Avoid advanced functional-programming techniques.

Avoid complicated promise chains.

Avoid unnecessary asynchronous architecture.

Avoid advanced CSS tricks if basic CSS can achieve the same visual
result.

Some simple repetition is acceptable when removing that repetition
would require an abstraction that makes the project harder for
students to understand.

Use meaningful names such as:

bookingForm
paymentTable
filterProjects()
showSuccessMessage()

instead of vague names such as:

x
data2
tempFunction

Use comments before meaningful logical sections.

Do not comment every obvious line.


================================================================
7. STRICTLY FORBIDDEN TECHNOLOGIES
================================================================

Do NOT use:

- React
- Next.js
- Vue
- Angular
- Svelte
- TypeScript
- Tailwind CSS
- Sass / SCSS
- Node.js
- npm frontend packages
- frontend bundlers
- frontend build systems
- component libraries
- state-management libraries
- Firebase
- IndexedDB
- JSON Server
- LocalStorage as a fake database
- frontend frameworks
- design-system frameworks
- advanced JavaScript libraries
- external UI frameworks other than Bootstrap

Do not install an additional frontend-design skill or framework.

Bootstrap is permitted.

However, Bootstrap must be used at a basic understandable level.


================================================================
8. BASIC BOOTSTRAP USAGE
================================================================

Bootstrap may be used for simple things such as:

- containers
- rows
- columns
- responsive grid
- navbar
- cards
- tables
- forms
- buttons
- alerts
- badges
- simple modal dialogs
- spacing utilities

Do not build a complicated Bootstrap customization architecture.

The students must still be able to understand the application mainly
as:

HTML + CSS + JavaScript.


================================================================
9. VISUAL DESIGN STANDARD
================================================================

The website must look:

- clean
- modern
- polished
- professional
- organized
- spacious
- cohesive
- trustworthy
- appropriate for real-estate and construction management

Do NOT confuse simple programming with simplistic visual design.

Use professional:

- visual hierarchy
- typography
- spacing
- alignment
- cards
- tables
- forms
- navigation
- icons where simple
- status badges
- subtle shadows
- border radius
- hover feedback
- responsive layout

Suggested NIRMAN design palette:

Primary:
Deep Navy
#0F2747

Accent:
Warm Gold
#D6A84B

Main page background:
#F7F8FA

Primary text:
#1F2937

Card/surface:
#FFFFFF

Suitable Bootstrap success, warning and danger colors may be used
for system statuses.

Keep the palette consistent throughout the project.

Use subtle transitions if useful.

Avoid:

- excessive animations
- animation libraries
- flashing effects
- excessive gradients
- overly futuristic interfaces
- excessive glassmorphism
- visual clutter

The goal is a modern real-world web application appearance using
simple implementation techniques.


================================================================
10. NIRMAN BRANDING AND LOGO
================================================================

There is currently no official NIRMAN logo.

Create a simple professional NIRMAN visual identity.

Prefer:

- clean NIRMAN wordmark
- simple construction/building-inspired mark
- simple geometric icon
- very simple SVG if appropriate

Do NOT make logo implementation technically complicated.

If a clean text-based wordmark looks better, use it.

The branding should work on:

- public navigation
- landing page
- login
- registration
- admin login
- dashboards
- sidebar
- footer

Keep it consistent.


================================================================
11. PUBLIC LANDING WEBSITE
================================================================

NIRMAN must have a public landing website.

Create a polished landing page appropriate for a modern
property-development organization.

Include suitable sections such as:

1. Navigation bar
2. Hero section
3. Introduction to NIRMAN
4. Featured Projects
5. Available Flats / Units preview
6. Main services / capabilities
7. System/property statistics
8. Why Choose NIRMAN
9. Call-to-action
10. Footer

Suggested public navigation:

Home
Projects
Properties
About
Login
Register

The landing page should prominently display:

NIRMAN

Do not fabricate claims such as:

- years of real-world history
- actual customer counts
- market leadership
- real awards
- real completed-project statistics

If statistics are displayed, derive them from mock frontend data.


================================================================
12. AUTHENTICATED USER ROLES
================================================================

The frontend has four user roles:

1. Admin
2. Employee
3. Client
4. Contractor Representative

IMPORTANT:

Admin is an APPLICATION / ACCESS-CONTROL role.

Admin is not an additional ER entity.

Do NOT modify the ER/database model to create an Admin entity merely
because the frontend contains an Admin interface.


================================================================
13. LOGIN INTERFACES
================================================================

Create:

- General User Login
- Separate Admin Login
- Registration / Sign Up page

The Admin Login must be separate and clearly identifiable.

The general login should support the ordinary application users.

At the frontend prototype stage, authentication is simulated using
mock users.

Do NOT implement real authentication security yet.


================================================================
14. PUBLIC REGISTRATION
================================================================

Allow public registration for:

- Client
- Contractor Representative

Do NOT provide public registration for:

- Employee
- Admin

Employee and Admin accounts are considered internally managed
organizational accounts.

This is an application-level access decision.

It does NOT modify the ER model.

Use forms that reflect relevant information from PROJECT_SPEC.md.

Do not invent unnecessary database fields.


================================================================
15. ADMIN INTERFACE
================================================================

Create a professional Admin Dashboard.

The Admin frontend should provide high-level management access to
the system.

Organize features into sensible sidebar/navigation groups.

Admin should be able to access appropriate frontend management views
for areas such as:

- Dashboard overview
- Employees
- Departments
- Clients
- Contractors
- Contractor Representatives
- Contractor Representative approvals
- Areas
- Construction Projects
- Flats & Units
- Bookings
- Booking allocation confirmations
- Payments
- Installments
- Complaints
- Tenders
- Tender Bids
- Tender Awards
- Contractor supervision
- Project Updates

Do not put every management function on one page.

Use clear categories.


================================================================
16. EMPLOYEE INTERFACE
================================================================

Derive Employee functionality primarily from PROJECT_SPEC.md.

Create suitable Employee frontend pages for activities including:

- Employee dashboard
- Employee profile
- Department information
- Manager/subordinate relationship where appropriate
- View/publish tenders
- View tender bids
- Tender award operations
- Booking-allocation confirmation
- Payment verification
- Complaint resolution
- Contractor supervision
- Construction project viewing
- Project progress/update viewing

Do not give Employees functionality that contradicts the ER model.


================================================================
17. CLIENT INTERFACE
================================================================

Create Client functionality including:

- Client dashboard
- Profile
- Browse construction projects
- Browse available flats/units
- Property/unit details
- Create bookings
- View bookings
- View booking/allocation status
- View payments
- View installments
- File complaints
- View complaint status
- View complaint resolution

Make the following user journey easy to understand:

Projects
   ↓
Units / Properties
   ↓
Unit Details
   ↓
Booking
   ↓
Allocation Status
   ↓
Payments / Installments


================================================================
18. CONTRACTOR REPRESENTATIVE INTERFACE
================================================================

Create Contractor Representative functionality including:

- Dashboard
- Profile
- Contractor information
- View published tenders
- Tender details
- Submit tender bid
- View submitted bids
- View bid statuses
- View relevant tender awards
- View relevant construction projects
- Create project progress updates
- View previous project updates

Respect the ER relationship that a Contractor Representative
represents a Contractor.


================================================================
19. BOOKING-ALLOCATION PROCESS
================================================================

PROJECT_SPEC.md defines an important aggregation:

Booking
   — Reserves —
Flats & Units

Together this forms the:

Booking-Allocation Process

The frontend must represent this concept naturally through its user
flow.

Do NOT create a completely unrelated new database object merely
because the ER uses aggregation.

For frontend purposes, the process may be represented through:

- booking details
- selected unit
- allocation confirmation
- allocation status
- related payment information

Employee confirmation of the allocation must also be represented.


================================================================
20. CORE FUNCTIONALITY VS UI CONVENIENCE
================================================================

There are two categories of frontend functionality.

CATEGORY A:
CORE BUSINESS FUNCTIONALITY

This must follow PROJECT_SPEC.md.

CATEGORY B:
ADDITIONAL UI/UX CONVENIENCE FUNCTIONALITY

You may add simple usability features such as:

- search
- filters
- sorting
- status filters
- dashboard summaries
- summary cards
- confirmation dialogs
- success alerts
- error alerts
- detail views
- simple modals
- simple pagination
- form validation
- empty states
- responsive navigation
- hover feedback

These features must not change the established database design.

When adding convenience functionality, prefer simple implementations.


================================================================
21. FRONTEND-ONLY DEVELOPMENT AT THIS STAGE
================================================================

At this stage:

IMPLEMENT THE FRONTEND ONLY.

Do NOT implement PHP yet.

Do NOT implement OCI8 yet.

Do NOT connect to Oracle yet.

The final backend architecture later will be:

HTML / CSS / Bootstrap / JavaScript
                ↓
             PHP 7.4
                ↓
              OCI8
                ↓
        Oracle Database 11g

Design the frontend so this future integration can be performed
without redesigning the UI.


================================================================
22. MOCK DATA STRATEGY
================================================================

Use realistic sample/mock data for frontend demonstration.

Keep mock data centralized.

Prefer:

js/mock-data.js

Do not put large unrelated sample datasets directly in HTML pages.

Separate:

1. Data
2. Rendering logic
3. Interaction logic

For example:

mock-data.js
contains sample bookings.

client.js
reads the sample bookings and displays them.

booking HTML
contains the page structure.

Later mock-data.js can be replaced by data returned from PHP.

Do NOT create a fake database.

Do NOT use:

- LocalStorage
- IndexedDB
- Firebase
- JSON Server
- Node.js backend

Frontend-added temporary data is allowed to disappear after page
refresh during this prototype stage.


================================================================
23. FORMS AND MOCK OPERATIONS
================================================================

Frontend forms should behave meaningfully.

Examples:

- required-field validation
- email validation where relevant
- basic phone validation
- useful validation messages
- success message after submission
- confirmation before important actions
- reset form where appropriate
- update displayed temporary mock information if simple

Do NOT falsely claim that the information was permanently stored in
Oracle.

Database persistence will be added later.


================================================================
24. MOCK STATUS VALUES
================================================================

Some ER Status attributes do not provide explicit allowed values.

When sample data requires statuses, choose small sensible frontend
demonstration values.

Examples may include concepts such as:

Pending
Approved
Confirmed
Completed
Rejected
Active
Resolved

Only use values that make sense for the relevant entity.

Treat these as mock UI values.

Do NOT declare them to be new database constraints unless specified
in PROJECT_SPEC.md.


================================================================
25. RESPONSIVE DESIGN
================================================================

The application must be usable on:

- Desktop
- Laptop
- Tablet
- Mobile

Use Bootstrap responsive grid where possible.

Authenticated dashboards may use a sidebar on desktop.

On smaller displays, navigation should collapse or simplify.

Avoid unnecessarily complicated custom responsive systems.


================================================================
26. RECOMMENDED PROJECT STRUCTURE
================================================================

Keep the project structure beginner-friendly.

Use a structure similar to:

NIRMAN/
│
├── index.html
├── login.html
├── admin-login.html
├── register.html
│
├── pages/
│   ├── admin/
│   ├── employee/
│   ├── client/
│   └── contractor/
│
├── css/
│   ├── style.css
│   └── responsive.css
│
├── js/
│   ├── mock-data.js
│   ├── common.js
│   ├── auth.js
│   ├── admin.js
│   ├── employee.js
│   ├── client.js
│   └── contractor.js
│
├── assets/
│
├── references/
│   ├── er-diagram-part-1.png
│   ├── er-diagram-part-2.png
│   ├── er-diagram-part-3.png
│   └── er-diagram-part-4.png
│
├── PROJECT_SPEC.md
├── MASTER_PROMPT.md
├── FRONTEND_PLAN.md
├── PROJECT_CODE_GUIDE.md
└── README.md

This structure is a recommendation.

Minor changes are allowed if they make the beginner project easier
to understand.

Do not create dozens of tiny unnecessary files.

Do not create a complicated architecture.


================================================================
27. FRONTEND_PLAN.md — CREATE BEFORE IMPLEMENTATION
================================================================

Before major frontend implementation, create:

FRONTEND_PLAN.md

This file must contain:

1. Planned public pages
2. Admin pages
3. Employee pages
4. Client pages
5. Contractor Representative pages
6. Navigation structure
7. Core ER-derived functionality
8. Additional UI convenience functionality
9. Main mock-data groups
10. Basic design direction
11. Any minor frontend assumptions

Keep the plan concise and understandable.

If an ambiguity concerns only a minor UI decision, choose the
simplest sensible option and record it.

If an ambiguity would require changing:

- ER entity
- relationship
- cardinality
- aggregation
- database meaning

do NOT guess.

Report the ambiguity before implementing that specific part.


================================================================
28. PROJECT_CODE_GUIDE.md — MANDATORY
================================================================

Create and continuously maintain:

PROJECT_CODE_GUIDE.md

THIS FILE IS MANDATORY.

The students are beginner programmers and must eventually explain
the project to an instructor.

The purpose of PROJECT_CODE_GUIDE.md is to show exactly what
programming topics the final frontend uses.

For every meaningful topic include:

TOPIC NAME

SIMPLE MEANING:
Explain it in beginner-friendly language.

USED IN:
Which project functionality uses it.

FILES:
Which files contain it.

LOCATION:
Page, function or section where relevant.

WHY IT WAS USED:
Simple reason.

Example:

------------------------------------------------

Topic:
addEventListener()

Simple meaning:
Runs JavaScript code when an event such as a button click or form
submission happens.

Used in:
Login form and complaint submission.

Files:
js/auth.js
js/client.js

Why it was used:
To respond to user actions using simple JavaScript.

------------------------------------------------

Potential topics may include things such as:

- HTML forms
- input types
- tables
- links
- Bootstrap grid
- Bootstrap cards
- CSS classes
- CSS flexbox if used
- media queries if used
- JavaScript variables
- arrays
- objects
- functions
- loops
- if/else
- DOM selection
- addEventListener()
- preventDefault()
- form validation
- array filtering
- table rendering

Only document concepts ACTUALLY USED.

Whenever a meaningful new programming concept is introduced,
update PROJECT_CODE_GUIDE.md.

Do not leave this documentation until the very end.


================================================================
29. README.md
================================================================

Create README.md containing:

- Project name
- Short purpose
- Frontend technology stack
- Current development stage
- How to open/run the frontend
- Folder structure
- Available roles
- Mock-data explanation
- Clear statement that backend integration is not implemented yet
- Future stack:
  PHP 7.4 + OCI8 + Oracle Database 11g


================================================================
30. IMPLEMENTATION ORDER
================================================================

Work in the following order.

PHASE 1
Read MASTER_PROMPT.md completely.

PHASE 2
Read PROJECT_SPEC.md completely.

PHASE 3
Inspect all four ER reference images if supported:

- er-diagram-part-1.png
- er-diagram-part-2.png
- er-diagram-part-3.png
- er-diagram-part-4.png

Remember that all four images together form one ER diagram.

PHASE 4
Inspect the current workspace and existing files.

Do not overwrite useful existing files without reason.

PHASE 5
Create FRONTEND_PLAN.md.

PHASE 6
Establish global frontend design:

- NIRMAN branding
- colors
- typography
- common CSS
- navigation
- buttons
- forms
- cards
- tables
- badges
- responsive behaviour

PHASE 7
Build public pages:

- Landing page
- Login
- Admin Login
- Registration

PHASE 8
Create authenticated role layouts and dashboards:

- Admin
- Employee
- Client
- Contractor Representative

PHASE 9
Implement all required role-specific pages.

PHASE 10
Add centralized realistic mock data.

PHASE 11
Add simple JavaScript interactions.

PHASE 12
Add search/filter/validation and other simple convenience features
where useful.

PHASE 13
Complete and update PROJECT_CODE_GUIDE.md.

PHASE 14
Complete README.md.

PHASE 15
Audit and test the complete frontend.


================================================================
31. QUALITY-CONTROL CHECKLIST
================================================================

Before declaring the frontend finished, verify ALL of the following:

[ ] NIRMAN branding is consistent.

[ ] Landing page exists and looks professional.

[ ] General login exists.

[ ] Separate Admin Login exists.

[ ] Registration exists.

[ ] Client registration is available.

[ ] Contractor Representative registration is available.

[ ] Employee public registration is not available.

[ ] Admin public registration is not available.

[ ] Admin interface exists.

[ ] Employee interface exists.

[ ] Client interface exists.

[ ] Contractor Representative interface exists.

[ ] Role navigation makes sense.

[ ] ER-defined functionality is represented appropriately.

[ ] Booking-Allocation Process is represented appropriately.

[ ] Tender workflow is represented appropriately.

[ ] Project/update workflow is represented appropriately.

[ ] Payment/installment workflow is represented appropriately.

[ ] Complaint workflow is represented appropriately.

[ ] All major links work.

[ ] Forms have simple validation.

[ ] Buttons perform meaningful frontend actions.

[ ] Important buttons are not merely decorative.

[ ] Mock data is centralized.

[ ] No fake database was created.

[ ] No forbidden framework was installed.

[ ] No forbidden technology was introduced.

[ ] No real organization is mentioned.

[ ] Layout works reasonably on mobile/tablet/desktop.

[ ] There are no obvious JavaScript console errors.

[ ] PROJECT_CODE_GUIDE.md accurately reflects the code.

[ ] FRONTEND_PLAN.md reflects the implemented frontend.

[ ] README.md reflects the current project.

[ ] No PHP backend was implemented at this frontend stage.

[ ] No Oracle connection was implemented at this frontend stage.


================================================================
32. BEGINNER SIMPLICITY AUDIT
================================================================

After each major implementation section, evaluate:

"Could a beginner programmer understand and explain this after
studying the code?"

If not, simplify it.

If two implementations produce similar frontend results, select the
simpler one.

Do NOT reduce visual quality unnecessarily.

Simplify CODE, not DESIGN.


================================================================
33. DO NOT OVERENGINEER
================================================================

Do not turn this academic project into a production-scale software
architecture.

The frontend does not need:

- component engines
- routing frameworks
- frontend state systems
- package managers
- build processes
- complex reusable architecture

Simple separate HTML pages are acceptable.

Simple JavaScript files are acceptable.

Some repeated navbar/sidebar HTML is acceptable if the alternative
requires an advanced templating system.

Clarity is more important than architectural cleverness.


================================================================
34. IMPORTANT RULE ABOUT ADDITIONAL FEATURES
================================================================

You are allowed to make the frontend more useful and realistic.

However:

Additional frontend functionality must remain consistent with the
existing system.

Do NOT change the database model simply to support an extra frontend
feature.

Clearly distinguish mentally between:

CORE BUSINESS FEATURES
derived from PROJECT_SPEC.md

and

FRONTEND CONVENIENCE FEATURES
added only for usability.


================================================================
35. FINAL TARGET
================================================================

The final NIRMAN frontend should achieve all five goals:

1. POLISHED, MODERN VISUAL DESIGN

2. BEGINNER-FRIENDLY HTML/CSS/JAVASCRIPT CODE

3. COMPLETE REPRESENTATION OF THE PROJECT'S CORE FUNCTIONALITY

4. EASY FUTURE INTEGRATION WITH:
   PHP 7.4 + OCI8 + Oracle Database 11g

5. EASY CODE REVIEW AND VIVA PREPARATION FOR BEGINNER STUDENTS


================================================================
36. STARTING INSTRUCTION
================================================================

Now perform the following:

1. Read MASTER_PROMPT.md completely.

2. Read PROJECT_SPEC.md completely.

3. Inspect all four ER diagram reference images if supported:

   references/er-diagram-part-1.png
   references/er-diagram-part-2.png
   references/er-diagram-part-3.png
   references/er-diagram-part-4.png

4. Understand that the four reference images are four visual parts
   of ONE complete ER diagram.

5. Inspect the existing workspace.

6. Create FRONTEND_PLAN.md FIRST.

7. Do not begin major implementation before completing the plan.

8. After the plan is complete, proceed with frontend implementation
   according to the phases above.

Do not ask unnecessary questions.

For small UI/design choices, select the simplest sensible option.

Only stop and ask for clarification if the ambiguity could cause you
to contradict the established ER/database design.