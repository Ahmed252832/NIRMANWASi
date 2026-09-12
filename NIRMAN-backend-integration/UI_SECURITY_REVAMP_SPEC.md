# NIRMAN UI And Security Revamp Specification

Status: approved permanent modernization direction. The detailed implementation
contract is in `IMPLEMENTATION_PROMPT.md`.

## Product Direction

NIRMAN uses the **Surveyed Structure** visual language: architectural editorial
public pages and a structured enterprise workbench for authenticated users. The
interface must feel custom, restrained, data-driven, and appropriate for
property technology and construction management, not like a generic Bootstrap
or SaaS template.

The brand system uses Site Green `#173E38`, Deep Structural Green `#0E2D29`,
Fired Clay `#B55338` as a restrained accent, Limestone `#F3F0E8`, Paper
`#FFFEFA`, Structural Ink `#202927`, Secondary Ink `#5A6863`, and neutral
boundaries. Success, warning, danger, and information colors remain semantic and
must not be replaced by brand colors.

Use Source Serif 4 strategically for public editorial headings and Source Sans 3
for application UI and body text, with robust local fallbacks when local font
assets are unavailable.

## Public Experience

The public site is multi-page: `index.html`, `projects.html`, `properties.html`,
and `about.html`. Home may contain previews, but primary navigation must use the
dedicated pages. Public project and property information must come from
intentionally public, database-backed endpoints.

Authenticated users retain access to every public page. Public navigation adapts
from Login/Register controls to Dashboard/Profile/Sign Out controls without
destroying the session. Dashboard navigation includes a Public Site route. Sign
out uses a real POST-only endpoint that destroys the session and cookie.

## Data And Interface

Oracle data must be interpreted into meaningful KPIs, progress views, timelines,
status distributions, action queues, and drill-downs before detailed tables.
Visualizations must answer genuine business questions and use real scoped data.
Current project progress is the latest Project Update by update date and ID, not
the maximum percentage. Effective unit availability requires an Available status
and no existing Booking.

Visible text, badges, charts, cards, empty states, and comments must be
purposeful. Do not add filler copy, fake statistics, fake notifications,
decorative badges, placeholder content, unsupported analytics, or unnecessary
comments.

## Runtime Boundary

The frontend is served from the project root and calls same-origin PHP endpoints
under `backend/`. PHP 7.4 uses OCI8 to connect to Oracle 11g. `backend/config/db.php`
is a local ignored file and must never be committed.

## Roles

| Role | Primary responsibility | Session identity |
| --- | --- | --- |
| Admin | Organization-wide administration | Admin role and authenticated employee identity |
| Employee | Operational review and assigned work | Employee ID and role |
| Client | Own profile, bookings, payments, and complaints | Client ID and role |
| Contractor Representative | Own bids, awarded projects, and updates | Representative ID and role |

The server must derive the acting identity from the session. Submitted IDs may
select a resource, but must not establish caller authority.

## Authentication Requirements

- Start the session before reading identity state.
- Set one consistent identity contract for `role`, `role_id`, `person_id`, and
  `emp_id`; remove the current `login.php` versus `get_current_employee.php`
  mismatch.
- Use one password hashing policy. Do not retain plaintext fallback behavior.
- Keep fixture credentials in `js/data.js` and `NIRMAN_DEMO_PACKAGE/` limited to
  demonstration use; never use them as production authentication data.
- Add a real logout endpoint that destroys the session and clears its cookie.
- Return consistent JSON for unauthenticated and unauthorized requests.
- Regenerate session IDs after login, normalize identity fields, enforce request
  methods, add CSRF protection to authenticated mutations, and return safe HTTP
  errors without Oracle or filesystem details.
- Expand `Person.Password` to hold bcrypt hashes, migrate demo credentials, test
  every role and registration flow, and only then remove plaintext fallback.

## Authorization Matrix

- Public reads: `backend/api/public/` may be unauthenticated only for data that
  is intentionally public.
- Admin reads and management actions require an authenticated Admin session.
- ER-defined Employee operations remain Employee operations, including tender
  publication and awards, payment verification, complaint resolution, allocation
  confirmation, and contractor supervision. They require an authenticated
  Employee identity and ownership, assignment, supervision relevance, or a
  legitimate shared queue where the schema has no pre-assignment.
- Client reads and actions: require an authenticated Client session and constrain
  every query and mutation to that Client's records.
- Contractor reads and actions: require an authenticated Contractor
  Representative session and constrain bids, projects, and updates to that
  representative's permitted records.
- `get_current_user.php` and role-specific current-profile endpoints must return
  only the current session identity.

## Known Items Requiring Resolution

- Admin read endpoints currently lack consistent server-side role checks.
- `publish_tender.php`, `review_bid.php`, and `create_award_project.php` need an
  explicit ownership and role policy.
- Employee JavaScript currently calls Admin-protected allocation, complaint, and
  supervision actions. Do not fix this by weakening Admin checks.
- Employee dashboard/profile endpoints accept caller-supplied employee IDs.
- Project update history accepts a project ID without an apparent ownership
  check.
- Diagnostic endpoints must be protected or excluded from production deployment.
- State-changing actions need CSRF protection when cookie sessions are used.
- Responses must not reveal credentials, connection details, stack traces, or
  unrelated role data.

## UI Security Requirements

- Keep authorization server-side; hidden buttons and role-specific pages are not
  access control.
- Show safe, generic authentication errors in the UI.
- Render server-provided text through existing escaping helpers.
- Preserve keyboard access, visible focus, labels, and meaningful error states.
- Keep same-origin requests credentialed by default; explicitly test cookie
  behavior after deployment changes.

## Technology Boundary

Keep HTML5, CSS3, Bootstrap, vanilla JavaScript, PHP 7.4, OCI8, and Oracle 11g.
Do not introduce React, Next.js, Vue, Angular, Svelte, TypeScript, Tailwind,
Node.js, npm-based frontend architecture, bundlers, an SPA migration, a PHP
framework, or an ORM.

## Rollout Order

1. Normalize session identity fields and add logout.
2. Add shared PHP authorization helpers without changing database meaning.
3. Apply role and ownership checks to every API and state-changing action.
4. Resolve the Employee/Admin business-role mismatches.
5. Add CSRF, secure cookie settings, input validation, and safe error handling.
6. Test authorized, unauthorized, cross-role, and cross-record requests.

Security hardening must remain separate from the completed path reorganization so
that authorization regressions can be isolated and rolled back.
