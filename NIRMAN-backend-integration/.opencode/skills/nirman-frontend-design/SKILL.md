---
name: nirman-frontend-design
description: Design and improve the NIRMAN frontend as a modern, advanced, visually rich real-estate and construction management system while strictly preserving the existing technology stack and project architecture.
---

# NIRMAN Frontend Design Skill

You are working on the NIRMAN academic DBMS project.

Your job is to improve the frontend design, data representation, dashboard quality, usability, and visual sophistication without changing the established technology stack or database meaning.

## 1. STRICT TECHNOLOGY CONSTRAINT

The existing frontend stack MUST remain:

- HTML5
- CSS3
- Bootstrap
- Vanilla JavaScript

The future backend architecture MUST remain:

- PHP 7.4
- OCI8
- Oracle Database 11g

DO NOT introduce or migrate to:

- React
- Next.js
- Vue
- Angular
- Svelte
- TypeScript
- Tailwind CSS
- Node.js
- npm
- frontend bundlers
- frontend build systems
- component frameworks
- SPA frameworks

Do not rewrite the project into a different architecture.

Modern visual quality must be achieved within the existing HTML/CSS/Bootstrap/JavaScript stack.

---

## 2. PRIMARY DESIGN GOAL

The NIRMAN frontend must look like a modern enterprise SaaS / property-tech / construction-management application.

The design should feel:

- modern
- premium
- visually rich
- polished
- professional
- responsive
- cohesive
- attractive
- data-driven
- interactive
- trustworthy

Avoid the appearance of a basic student Bootstrap project.

Do not make the UI primarily dependent on:

- plain text
- raw tables
- large text blocks
- default Bootstrap styling
- repeated generic cards

---

## 3. DATA REPRESENTATION RULE

Do NOT treat a raw database query result as the final user interface.

Database data should first be interpreted according to what the user needs to understand.

Prefer meaningful representations such as:

- KPI cards
- summary metrics
- line charts
- bar charts
- donut charts
- pie charts where appropriate
- progress bars
- progress rings
- status distributions
- timelines
- activity feeds
- project cards
- property/unit cards
- comparison views
- trend indicators
- warning indicators
- filters
- search
- visual status badges
- drill-down views

Tables are allowed and important, but tables should usually be used for detailed records rather than as the only or primary representation.

Use this mental model:

Database data
→ Meaning
→ Visualization
→ User action
→ Detailed records

---

## 4. ROLE-AWARE UI AND DATA VISIBILITY

NIRMAN has four application roles:

- Admin
- Employee
- Client
- Contractor Representative

Do not assume that every role should see the same information.

Design each dashboard and page according to the role's responsibilities.

Examples:

Admin:
- system-wide summaries
- projects
- clients
- employees
- payments
- tenders
- complaints
- operational analytics

Employee:
- assigned tasks
- payments requiring verification
- complaints requiring resolution
- booking allocation confirmations
- tender responsibilities
- supervised contractors
- relevant project information

Client:
- own bookings
- own payments
- own installments
- own complaints
- available projects and units
- allocation status

Contractor Representative:
- relevant published tenders
- own submitted bids
- relevant tender awards
- assigned/relevant projects
- own project updates

Never visually expose data to a role merely because the information exists in the database.

Frontend hiding alone is not considered security.

When backend integration is implemented, unauthorized data must not be sent to the client in the first place.

---

## 5. MODERN DASHBOARD PRINCIPLE

Dashboards should prioritize:

1. What needs attention?
2. What changed?
3. What is the current status?
4. What action should the user take?
5. What trend or pattern matters?

Do not start dashboards with large raw tables.

Preferred dashboard structure:

- page header
- key metrics
- alerts or pending actions
- charts / visual summaries
- recent activity
- role-specific operational cards
- detailed tables as lower-level drill-down

---

## 6. VISUAL DESIGN DIRECTION

Preserve NIRMAN branding.

Preferred palette:

- Deep Navy: #0F2747
- Warm Gold: #D6A84B
- Main Background: #F7F8FA
- Main Text: #1F2937
- Surface/Card: #FFFFFF

Suitable status colors may be used where appropriate.

Use:

- strong visual hierarchy
- modern typography
- large clear headings
- consistent spacing
- layered surfaces
- subtle shadows
- refined border radii
- hover states
- active states
- smooth transitions
- responsive layouts
- icons
- charts
- progress indicators
- high-quality project/property imagery where appropriate

Avoid:

- excessive gradients
- excessive glassmorphism
- flashing effects
- gimmicky animation
- clutter
- overly futuristic cyberpunk styling
- inconsistent page designs

---

## 7. COMPONENT QUALITY

Improve the following consistently across the project:

### Sidebar
- grouped navigation
- active state
- icons
- clear hierarchy
- proper spacing
- responsive behaviour
- user/profile section

### Topbar
- page context
- user area
- relevant quick actions
- notifications if appropriate

### Cards
- meaningful information hierarchy
- compact but visually rich
- not repeated generic boxes

### Tables
- better headers
- row spacing
- hover states
- search
- filters
- status badges
- action controls
- pagination where useful

### Forms
- logical grouping
- clear labels
- helper text
- validation states
- proper spacing
- clear primary and secondary actions

### Detail Pages
- summary header
- status
- key metrics
- related data
- activity/history
- clear actions

### Empty States
- clear explanation
- appropriate icon/illustration
- recommended next action

---

## 8. CHARTING AND VISUALIZATION

When meaningful, use a lightweight charting library compatible with the existing stack.

Chart.js is acceptable.

Do not introduce a frontend framework merely for charts.

Charts should represent meaningful business information.

Possible examples:

- Project status distribution
- Project progress comparison
- Payment trends
- Paid vs due amounts
- Booking status distribution
- Tender bid comparison
- Complaint filed vs resolved trend
- Project update progress over time
- Installment status breakdown

Do not add decorative charts with no useful interpretation.

---

## 9. RESPONSIVENESS

The UI must work properly on:

- desktop
- laptop
- tablet
- mobile

Use Bootstrap responsiveness where useful.

Complex desktop dashboards should gracefully simplify on smaller screens.

Do not create a separate framework or complicated responsive architecture.

---

## 10. EXISTING PROJECT PROTECTION

Before making changes:

- inspect the current workspace
- understand existing pages
- understand navigation
- understand current JavaScript behaviour
- understand mock-data structure
- understand role flows
- read PROJECT_SPEC.md
- read MASTER_PROMPT.md

Do not remove working functionality without a clear reason.

Do not change ER entities, relationships, cardinalities, or business meaning.

Do not create frontend features that require changing the established database model unless explicitly instructed.

---

## 11. PLANNING BEFORE LARGE CHANGES

For large redesign tasks:

DO NOT immediately modify the entire workspace.

First:

1. audit the existing frontend
2. identify visual problems
3. identify data-visibility/security concerns
4. identify table-heavy pages
5. propose meaningful visualizations
6. define the updated design system
7. define role-specific dashboard changes
8. define a page-by-page migration plan

Only implement after the plan has been reviewed or the user explicitly asks to proceed.

---

## 12. IMPLEMENTATION STRATEGY

Prefer phased implementation.

Recommended order:

1. Global design system
2. Shared navigation/sidebar/topbar
3. Landing page
4. Login / registration
5. Admin dashboard
6. Employee dashboard
7. Client dashboard
8. Contractor Representative dashboard
9. Projects
10. Flats / Units
11. Bookings
12. Payments / Installments
13. Tenders / Bids / Awards
14. Complaints
15. Project updates
16. Remaining management pages
17. Responsive and consistency audit

Do not redesign the entire project blindly in one uncontrolled pass.

---

## 13. FINAL QUALITY STANDARD

The frontend should no longer look like:

"SQL data displayed in Bootstrap tables."

It should look like:

"a modern data-driven real-estate and construction management product."

The user should be able to understand the state of the system quickly through visual summaries, trends, status indicators, and role-specific information.

Maintain the existing stack.

Improve the design aggressively.