# Admin Dashboard Setup

## Super Admin (top-level)

The **super admin** is a single account whose credentials are read from environment variables. This user can create, edit, and delete other admin users and set their limits.

### Environment variables

Add to `.env.local` (or your deployment env):

```env
# Super admin (single account for the app administrator)
SUPER_ADMIN_EMAIL=your-admin@example.com
SUPER_ADMIN_PASSWORD=your-secure-password
```

- **SUPER_ADMIN_EMAIL** – Email used to sign in to the super admin area.
- **SUPER_ADMIN_PASSWORD** – Plain-text password (compared as-is; keep this secret and use a strong password).

### Routes

- **`/admin`** – Admin home; redirects to the right dashboard or shows Super Admin / Admin Login links.
- **`/admin/super`** – Super admin login (email + password from env).
- **`/admin/super/dashboard`** – Super admin dashboard: list admin users, create/edit/delete, set profile and pass limits.

---

## Admin Users (created by super admin)

Admin users are stored in MongoDB in the **`adminusers`** collection. The super admin creates them by entering **email**, **username**, and **initial password**. Each admin user has:

- **Limits** – `profiles` (max employee profiles) and `passes` (max event/access passes). Set by super admin and editable later.
- **First login** – They must change their initial password on first login (handled by `/admin/change-password`).

### MongoDB collection: `adminusers`

Documents have this shape:

- `email` (string, unique)
- `username` (string)
- `password` (string, bcrypt hash)
- `firstLoginDone` (boolean, default false)
- `limits` – `{ profiles: number, passes: number }`
- `createdAt`, `updatedAt` (Date)

### Routes

- **`/admin/login`** – Admin user login (email + password from `adminusers`). If `firstLoginDone` is false, redirects to change-password.
- **`/admin/change-password`** – Set new password (required on first login); then redirects to dashboard.
- **`/admin/dashboard`** – Admin user dashboard with:
  1. **Employee profiles** – Create profiles manually (Excel upload placeholder for later). Count is limited by `limits.profiles`.
  2. **Event / access passes** – Create passes (name, description, type). Count is limited by `limits.passes`. Opt-in for end users (location, interest) is planned for later.

---

## MongoDB collections used by admin

| Collection                  | Purpose |
|----------------------------|--------|
| `adminusers`               | Admin users created by super admin (email, username, hashed password, limits, firstLoginDone). |
| `admin_employee_profiles`  | Employee profiles created by admin users (createdByAdminId, name, title, company, contact fields). |
| `admin_passes`             | Event/access passes created by admin users (createdByAdminId, name, description, type, status). |

---

## API (for reference)

- `POST /api/admin/super/login` – Super admin login (body: email, password). Sets cookie.
- `POST /api/admin/login` – Admin user login (body: email, password). Sets cookie. Response includes `firstLoginDone`.
- `POST /api/admin/logout` – Clears admin session cookie.
- `GET /api/admin/me` – Returns current session (super or admin user) from cookie.
- `POST /api/admin/change-password` – Admin user only. Body: `newPassword`. Sets `firstLoginDone` and updates password.
- `GET /api/admin/super/users` – List admin users (super only).
- `POST /api/admin/super/users` – Create admin user (super only). Body: email, username, password, limits (optional).
- `PATCH /api/admin/super/users/[id]` – Update admin user limits/username (super only).
- `DELETE /api/admin/super/users/[id]` – Delete admin user (super only).
- `GET /api/admin/employee-profiles` – List employee profiles for logged-in admin (with limit/used).
- `POST /api/admin/employee-profiles` – Create employee profile (enforces limit).
- `GET /api/admin/passes` – List passes for logged-in admin (with limit/used).
- `POST /api/admin/passes` – Create pass (enforces limit). Body: name, description?, type (event|access).
