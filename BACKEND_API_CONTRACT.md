# NIRMAN Frontend ↔ Backend API Contract

This frontend is backend-ready without changing the existing role page render logic.

## How it chooses demo vs backend

The frontend uses the first API base URL it can find:

1. `window.NIRMAN_API_BASE_URL`
2. `?api=https://your-backend.example/api` in the page URL (saved in localStorage)
3. `localStorage["nirmanApiBaseUrl"]`
4. Same-origin `/api` when the site is not running on `github.io`

On GitHub Pages, if no API URL is configured, the current `js/data.js` demo data is used.

### Quick remote-backend setup

Open the login page once like:

```text
https://your-frontend.example/login.html?api=https://your-backend.example/api
```

The API base is remembered by the browser.

You can also configure it from JavaScript:

```js
NirmanAPI.setBaseUrl("https://your-backend.example/api");
```

## Required endpoint 1 — Login

`POST /auth/login`

Request:

```json
{
  "email": "samira@nirman.com",
  "password": "secret",
  "role": "client"
}
```

`role` is one of:

- `client`
- `employee`
- `contractor`
- `admin`

Recommended response:

```json
{
  "token": "OPTIONAL_BEARER_TOKEN",
  "user": {
    "personId": "4",
    "role": "client",
    "roleId": "1"
  }
}
```

`token` is optional. The frontend also sends `credentials: "include"`, so an HttpOnly secure session cookie is supported and is preferred for production.

The login response may optionally include `data` containing the bootstrap snapshot. If included, the dashboard can render real data immediately without the first reload.

Example:

```json
{
  "token": "OPTIONAL",
  "user": {
    "personId": "4",
    "role": "client",
    "roleId": "1"
  },
  "data": {
    "people": [],
    "employees": [],
    "departments": [],
    "departmentPhones": [],
    "workRelations": [],
    "clients": [],
    "clientContacts": [],
    "contractors": [],
    "contractorReps": [],
    "supervisions": [],
    "tenders": [],
    "tenderBids": [],
    "tenderAwards": [],
    "areas": [],
    "projects": [],
    "units": [],
    "bookings": [],
    "allocationConfirmations": [],
    "payments": [],
    "installments": [],
    "complaints": [],
    "projectUpdates": []
  }
}
```

## Required endpoint 2 — Real dashboard data

`GET /bootstrap`

Authentication:

- `Authorization: Bearer <token>` when a token was returned by login.
- Browser cookies are also sent because the request uses `credentials: "include"`.

Response can be either the data object directly:

```json
{
  "people": [],
  "employees": [],
  "departments": [],
  "departmentPhones": [],
  "workRelations": [],
  "clients": [],
  "clientContacts": [],
  "contractors": [],
  "contractorReps": [],
  "supervisions": [],
  "tenders": [],
  "tenderBids": [],
  "tenderAwards": [],
  "areas": [],
  "projects": [],
  "units": [],
  "bookings": [],
  "allocationConfirmations": [],
  "payments": [],
  "installments": [],
  "complaints": [],
  "projectUpdates": []
}
```

or wrapped:

```json
{
  "version": "2026-08-29T14:00:00Z",
  "data": {
    "...": "same collections as above"
  }
}
```

The frontend caches the snapshot in `sessionStorage`. Existing Client / Employee / Contractor scripts then use the logged-in `roleId`, so the current user's name, dashboard counts, bookings, payments, bids, projects, etc. are rendered from backend data instead of fixed ID `1`.

## Optional endpoint — Logout

`POST /auth/logout`

If it is not implemented or the backend is offline, the frontend still clears its local session.

## Important data naming

The frontend currently expects camelCase keys such as:

- `personId`
- `employeeId`
- `clientId`
- `repId`
- `contractorId`
- `tenderId`
- `bidId`
- `awardId`
- `projectId`
- `unitId`
- `bookingId`
- `paymentId`
- `complaintId`

If your SQL/Oracle backend returns snake_case, map rows to this frontend shape in your API layer.

## Security

Do not return plaintext passwords from `/bootstrap`.

The backend must enforce authorization itself. Client-side filtering is only for presentation and must not be treated as a security boundary.

## CRUD / form submissions

This package makes login and all dashboard/read data backend-ready now.

The existing forms (create booking, payment, complaint, tender, bid, project update, etc.) currently mutate the in-browser data model. For permanent database writes, connect those actions to your backend endpoints using the already exposed helper:

```js
NirmanAPI.get("/path");
NirmanAPI.post("/path", body);
NirmanAPI.put("/path", body);
NirmanAPI.patch("/path", body);
NirmanAPI.remove("/path");
```

Once the backend team provides the exact CRUD endpoint names and request/response formats, those form handlers can be wired directly without changing this architecture.
