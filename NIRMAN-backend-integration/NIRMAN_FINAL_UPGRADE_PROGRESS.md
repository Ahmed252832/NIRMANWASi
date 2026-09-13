# NIRMAN Final Upgrade Progress

## Status
COMPLETE - Progressive Disclosure / Card-First UI Pass Verified

## Master task
See: NIRMAN_FINAL_UPGRADE_TASK.md

## Rules for every future OpenCode session

1. Read NIRMAN_FINAL_UPGRADE_TASK.md first.
2. Read this progress file second.
3. Inspect current git diff/current workspace before continuing.
4. Do NOT redo completed work unless verification proves it is broken.
5. Continue from the first incomplete checklist item.
6. After every meaningful implementation run, UPDATE THIS FILE.
7. Record:
   - completed requirements
   - files changed
   - database changes
   - tests already passed
   - known issues
   - next exact work item
8. Never mark an item complete without implementing and testing it.
9. If context/token limit approaches, STOP cleanly and update this file before ending.

## Completed

- Audited the current authenticated Admin, Employee, Client, and Contractor Representative implementation against the master checklist.
- Preserved the role dashboards, Oracle-backed data, activity feeds, timelines, responsive application shell, and detail workflows while removing automatic insight-panel injection from normal authenticated page loads.
- Existing `Person.Profile_photo`, seeded local fictional images, current-user/profile propagation, authenticated self-service upload, and initials-on-null/error fallback are present.
- Existing centralized Employee department/designation permission intersection in `backend/lib/api.php` is applied to all referenced protected Employee read APIs and mutation actions.
- Existing Admin people API masks raw Employee/Client NID server-side and no Admin API returns passwords.
- Employee allocation aggregate now matches the detail API scope: own confirmations plus the legitimate unconfirmed shared queue.
- Contractor module aggregates now require an approved representative.
- Employee dashboard backend now runs only queries for permitted features; the frontend hides irrelevant KPI/section/CTA content and suppresses feature navigation until permissions resolve.
- Added reusable Oracle-response-driven bar and SVG line graph renderers, dynamic metric cards, loading/error states, progress visuals, and mutation-triggered insight refresh in `js/common.js`.
- Extended module insight architecture for meaningful role/module series including bids per tender, payment amounts/trends, complaint trends, allocation/project comparisons, and recorded project progress.
- Replaced Employee and Contractor tender registers with primary tender-card workspaces while retaining Employee bid comparison and award/review behavior.
- Added card-first visual workspaces for Employee allocations/payments/complaints/projects, Client bookings/payments/complaints, Contractor bids/projects/updates, and Admin projects/allocations/payments/complaints/tenders.
- Removed invented `0%` fallback from changed project APIs/renderers and added explicit null-safe latest-update ordering.
- Added per-project progress-over-time line graphs to Employee and Contractor project details using actual `Project_Update` records.
- Hardened profile uploads with genuine-image/dimension validation, strict random upload-path deletion containment, a 2 MB limit, and an Apache non-executable/no-index upload directory policy.
- Added profile-photo entity cards with initials/image-error fallback to Admin Employee, Client, and Contractor Representative management.
- Added card-first Admin workspaces for every dashboard, people, contractor, portfolio, allocation, finance, complaint, tender, bid, and award view while preserving exact registers behind explicit disclosures.
- Completed the Client, Employee, Contractor Representative, and Admin entity/task -> selected detail -> related records/register progression.
- Verified the final desktop, laptop, and mobile responsive DOM in headless Chrome without runtime exceptions, initial table exposure, automatic insight panels, or horizontal page overflow.

## In progress

None.

## Remaining

None from the applicable master checklist.

## Files changed

- Task/checkpoint: `NIRMAN_FINAL_UPGRADE_TASK.md`, `NIRMAN_FINAL_UPGRADE_PROGRESS.md`.
- Shared backend/security: `backend/lib/api.php`, `backend/lib/profile_photo.php`, `backend/api/insights/get_module_summary.php`, `uploads/profile-photos/.htaccess`.
- Employee backend: permission-guarded APIs/actions, `backend/api/employee/get_employee_dashboard.php`, and `backend/api/employee/get_project_workspace.php`.
- Contractor backend: `backend/api/contractor/get_dashboard_summary.php` and `backend/api/contractor/get_my_projects.php`.
- Admin backend: `backend/api/admin/get_dashboard_summary.php`, `backend/api/admin/get_portfolio_projects.php`, `backend/api/admin/get_people_directory.php`, and `backend/api/admin/get_representatives_admin.php`.
- Frontend behavior: `js/common.js`, `js/admin.js`, `js/employee.js`, `js/client.js`, `js/contractor.js`.
- Frontend presentation: `css/style.css`, `css/responsive.css`, authenticated Client/Employee/Contractor/Admin pages, including the Admin Dashboard and Tender tab labels.
- Profile/database source: `database/schema.sql`, `database/sample_data.sql`, `images/profiles/*.svg`.

## Database changes

- `Person.Profile_photo VARCHAR2(255)` is present in live Oracle and repository schema source.
- Demo people have local fictional profile paths in source/live data.
- No table, key, ER semantic, trigger, view, sequence, or unrelated procedure change was introduced by this completion run.
- The progressive-disclosure pass introduced no backend, SQL, schema, or live-data changes.
- Reversible test changes to `Project_Update.Progress_percent`, representative approval status, and profile paths were restored exactly; temporary upload files were deleted.
- The preserved five-parameter `VERIFY_PAYMENT_PROC` remains valid.

## Tests passed

- Pre-existing runtime checks recorded before this continuation: Operations allocations 200/complaints 403; Finance payments 200/projects 403; Client Services complaints 200/allocations 403.
- Pre-existing Oracle/API comparisons: Finance payment status 3 Pending/3 Verified; Client Services complaints 1 Pending/3 Resolved.
- Pre-existing profile path check: P001 `images/profiles/employee-a.svg` matched current Employee API and image returned HTTP 200.
- Pre-existing Admin restriction check: 12 directory NID values masked as `Restricted`, zero raw values.
- Static audit found no hardcoded numeric business/chart arrays in authenticated JavaScript.
- Repository-wide syntax: all 82 backend PHP files passed XAMPP `php -l`; all 8 JavaScript files passed `node --check`.
- All 19 permitted role/module insight combinations returned HTTP 200 with valid Oracle-backed doughnut/bar/line payloads.
- Read API suites returned valid HTTP 200 JSON: Admin 18/18, Client 5/5, Contractor 6/6, Public 7/7, Operations 8/8, Finance 4/4, and Client Services 4/4.
- Security denials passed: 7 cross-department Employee APIs returned 403; 4 unauthenticated role APIs returned 401; 4 cross-role APIs returned 403; 5 mutation requests without CSRF returned 403.
- Upload tests passed for Employee, Client, and approved Contractor Representative: valid PNG returned 200 and propagated DB -> API -> HTTP image; spoofed/non-image and executable uploads returned 400; direct `.php` access in the upload directory returned 403; oversized input returned `invalid_profile_photo`.
- Missing-photo test returned a null API path and `SK` fallback initials; the original Client image path was restored.
- Admin people tests returned 7 Employees and 5 Clients with profile paths, 12 restricted NIDs, and zero raw NIDs; all 5 representatives include profile paths.
- Reversible chart test changed PR001/UP002 progress 38 -> 39 and observed 39 in Employee, Contractor, and Admin line/bar responses, then restored and re-observed 38.
- Reversible representative test changed R002 Approved -> Pending, confirmed contractor login returned 403, approved through the Admin action with CSRF, confirmed login returned 200, and verified final Approved state.
- Oracle integrity: zero invalid objects, zero `USER_ERRORS`, one correct `PROFILE_PHOTO` column, and valid `VERIFY_PAYMENT_PROC`.
- HTTP delivery: all 26 authenticated pages, all 7 public pages, and 9 core CSS/JS/Bootstrap assets returned 200.
- Final non-mutating HTTP regression passed 82 assertions across Public, Admin, Operations, Finance, Client Services, Client, and Contractor reads; NID masking; permission intersections; unauthenticated/cross-role denials; and CSRF rejection.
- Progressive-disclosure captures cover all authenticated Client, Employee, Contractor, and Admin pages at 1440x900, 1180x820, and 390x844. Admin verification additionally exercised every tab and confirmed one primary workspace, closed registers, focused actions, zero visible initial tables, and no horizontal page overflow.
- Detail interactions verified 620 px right-side drawers on desktop/laptop and 390 px full-screen panels on mobile. Tender and payment details retained related-record disclosures.

## Known issues

- The workspace is not a Git repository, so `git diff`/`git status` cannot provide a change baseline.
- Seed portraits are safe local fictional SVG identity visuals and are intentionally reused by demo role type.
- Historical records outside the Employee permission matrix were not reassigned; access remains denied rather than silently loosening authorization.

## Next action
No implementation item remains in the final upgrade task. Preserve this interaction model and rerun role/security regressions for future changes.

## Progressive Disclosure / Card-First UI Pass

### Completed

- Automatic module and dashboard insight rendering has been removed from ordinary authenticated page loads while preserving the scoped insight APIs and chart helpers.
- Static authenticated registers are now retained behind explicit `Open full register` disclosures; detail-modal tables and action flows are unchanged.
- Generated entity workspaces now render inside the owning card/tab, synchronize with nearby search/status controls, and precede the disclosed register instead of duplicating content in a separate top-level card.
- Existing detail modals are presented as right-side drawers on desktop and full-screen panels on mobile.
- Shared cards are limited to three decision-relevant metrics and no longer invent a `Live Oracle record` footer.
- Client pages are property/payment/support-first, with booking and complaint creation opened through explicit modal actions and allocation, installment, reference, and resolution history disclosed on demand.
- Employee pages are permission-aware and task-first for tenders, allocations, payments, complaints, and projects; same-tender comparison is retained and progress history is project-specific.
- Contractor pages are opportunity/bid/project/update-first; the update form is action-triggered, cross-project average progress is removed, and missing progress remains explicitly unrecorded.
- Admin pages are management-console directories, portfolios, and queues. Every tab has primary entity cards, selected detail access, and a disclosed exact register; same-tender bid comparison and separate installment semantics are retained.
- Mobile authenticated KPI groups use compact horizontal rails where appropriate, while entity cards stack and detail drawers become full-screen.

### In progress

- None.

### Remaining

- None.

### Visual verification

- The pre-redesign baseline remains at `C:\Users\User\AppData\Local\Temp\opencode\nirman-visual-baseline`.
- Final Client renders: `C:\Users\User\AppData\Local\Temp\opencode\nirman-progressive-client`.
- Final Employee/Finance/Client Services renders: `C:\Users\User\AppData\Local\Temp\opencode\nirman-progressive-employee`.
- Final Contractor renders: `C:\Users\User\AppData\Local\Temp\opencode\nirman-progressive-contractor`.
- Final Admin renders: `C:\Users\User\AppData\Local\Temp\opencode\nirman-progressive-admin`.
