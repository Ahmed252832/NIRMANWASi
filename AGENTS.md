# NIRMAN Project Guidance

## Project Scope

NIRMAN is a static HTML/CSS/Bootstrap/vanilla JavaScript frontend with PHP 7.4
and OCI8 integration for Oracle 11g. Do not add a framework, bundler, package
manager, or database schema change without an explicit requirement.

## Source Of Truth

- Read `PROJECT_SPEC.md`, `UI_SECURITY_REVAMP_SPEC.md`, and
  `IMPLEMENTATION_PROMPT.md` before modernization work.
- `PROJECT_SPEC.md` is authoritative for business rules and ER/database meaning.
- `DATABASE_SQL_GUIDE.md` defines SQL and Oracle constraints.
- `MASTER_PROMPT.md` records the original project constraints and history.
- `IMPLEMENTATION_STATUS.md` records the current implementation checkpoint.
- `UI_SECURITY_REVAMP_SPEC.md` is the concise permanent frontend and security
  modernization direction.
- `IMPLEMENTATION_PROMPT.md` is the detailed approved implementation contract.

## Directory Ownership

- Root HTML files are public entry pages.
- `pages/` contains role-specific HTML pages.
- `css/`, `js/`, and `bootstrap/` contain frontend assets.
- `backend/api/` contains read and identity endpoints grouped by role.
- `backend/actions/` contains state-changing endpoints grouped by role.
- `backend/config/` contains the database example and local ignored runtime file.
- `backend/diagnostics/` contains development diagnostics and must not be exposed
  in production without protection.
- `database/` and `references/` are preserved database and ER references.
- `NIRMAN_DEMO_PACKAGE/` is a retained self-contained demo package and must not
  be deleted or mixed with live backend code.

## Backend Rules

- Keep PHP compatible with PHP 7.4 and OCI8.
- Database-backed files must load the configuration with a location-aware path:
  `require_once __DIR__ . '/../../config/db.php';`
- Never commit `backend/config/db.php` or real credentials.
- Keep frontend and backend same-origin unless CORS and session-cookie behavior
  are explicitly designed and tested.
- Preserve JSON response shapes and database identifiers when changing paths.
- Derive the acting user and role from the server session for authorization work.

## Frontend Rules

- Keep public entry pages at the project root.
- Keep role pages under their current `pages/<role>/` directories.
- Fetch URLs are resolved relative to the HTML document, not the JavaScript file.
- Preserve existing CSS, Bootstrap, responsive behavior, and page links unless a
  requested feature requires a targeted change.
- `js/data.js` is fixture data for incomplete or demonstration views; it is not a
  security boundary or a replacement for the backend.

## Validation

- Run `php -l` against every backend PHP file after PHP changes.
- Search for stale root-level PHP endpoint strings after endpoint moves.
- Test public, Admin, Employee, Client, and Contractor flows through a PHP-capable
  same-origin web server.
- Check browser Network responses for 404s, invalid JSON, and missing cookies.
- Do not claim Oracle runtime validation when `backend/config/db.php` or OCI8 is
  unavailable.

## Change Boundaries

- Do not modify ER semantics, table names, key meaning, or SQL scripts during
  frontend/backend organization work.
- Do not silently loosen authorization to repair a role mismatch; resolve the
  business ownership rule explicitly.
- Keep restructuring, security hardening, and UI redesign in separate changes.
