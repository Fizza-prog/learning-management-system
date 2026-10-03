# Learning Management System

A multi-school administration platform built with **React, Vite, Node.js, Express, Sequelize, and PostgreSQL**.

The system is designed to centralize school administration workflows including user management, school management, fees, announcements, audit logging, authentication, and administrative dashboards.

> **Project scope:** This project currently focuses on school administration and operations. Academic modules such as classes, attendance, timetables, examinations, grading, and reports are currently represented as frontend demo interfaces and are not yet backed by persistent database workflows.

---

## Features

### Authentication & Account Management

* Login and logout
* JWT-based authentication
* Short-lived access tokens
* HTTP-only refresh-token cookie
* Refresh-token revocation
* Email verification
* Verification email resend with cooldown
* Forgot-password and reset-password flow
* Authenticated password change
* Email change with verification
* Role-based access control

### School Management

* Create, view, update, and deactivate schools
* School status management
* Multi-school architecture
* School-scoped administrative operations

### User Management

Supports four roles:

* Super Admin
* School Admin
* Teacher
* Student

Super Admins can manage users across schools, while School Admins are restricted to their own school.

### Student & Teacher Management

* Student directory
* Teacher directory
* Search and filtering
* Verification-status filtering
* Pagination
* User editing and deletion

Students and teachers currently use the shared `User` model rather than separate domain entities.

### Fees

* Fee creation
* Fee updates
* Fee status management
* Fee deletion
* Search and filtering
* Pagination
* School/student validation
* Fee collection dashboard statistics

> Online payment processing is not currently implemented.

### Announcements

* Create announcements
* Edit announcements
* Delete announcements
* Search and pagination
* School-scoped administration
* Super Admin cross-school management

### Audit Logs

* Authentication and administrative activity logging
* Paginated audit-log viewer
* School-scoped logs for School Admins
* Cross-school visibility for Super Admins

### Dashboards

#### Super Admin Dashboard

* Total schools
* Active students
* Monthly fee collection
* Recent schools
* Tenant growth visualization

#### School Admin Dashboard

* Student count
* Teacher count
* Fee collection
* Recent activity

Some School Admin dashboard values, including attendance and upcoming events, are currently static demonstration data.

### Support

* Authenticated support contact form
* Email-based support requests
* Static FAQ section

Support requests are currently sent by email and are not stored as support tickets.

---

## Frontend

Built with:

* React 19
* Vite
* React Router
* Axios
* React Toastify
* Recharts
* React Icons
* Custom CSS

The frontend follows a feature-oriented structure with reusable layouts, components, API helpers, forms, tables, modals, and dashboard components.

### Frontend Architecture

```text
React Page
   ↓
API Helper
   ↓
Axios
   ↓
Express API
   ↓
Controller
   ↓
Service
   ↓
Sequelize Model
   ↓
PostgreSQL
```

---

## Backend

Built with:

* Node.js
* Express 5
* Sequelize
* PostgreSQL
* JWT
* bcryptjs
* Nodemailer
* CORS
* cookie-parser
* validator

The backend follows a layered architecture:

```text
Routes
  ↓
Middleware
  ↓
Controllers
  ↓
Services
  ↓
Models
  ↓
PostgreSQL
```

Controllers handle HTTP concerns while services contain business and persistence logic.

---

## Database

Current persistent entities:

* `User`
* `School`
* `Fee`
* `Announcement`
* `AuditLog`

### Multi-Tenancy

Schools act as tenants.

Core administrative data is scoped using `schoolId`, with backend authorization and service-level filtering used to prevent School Admins from operating on another school's data.

### Database Features

* UUID primary keys
* Unique constraints
* PostgreSQL enums
* Foreign-key relationships
* JSONB audit metadata
* Database indexes
* Server-side pagination
* Aggregated dashboard queries

---

## Role-Based Access Control

| Role             | Scope                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| **Super Admin**  | System-wide administration                                            |
| **School Admin** | Own school administration                                             |
| **Teacher**      | Account/support functionality; academic workflows not yet implemented |
| **Student**      | Account/support functionality; learning workflows not yet implemented |

Backend authorization is enforced through JWT authentication, role middleware, and school-level service checks.

---

## Academic Modules

The following interfaces currently exist as frontend demonstrations:

* Classes & Sections
* Attendance
* Timetable
* Exams & Reports

These pages currently use local sample data and **do not have corresponding database models or backend APIs**.

Planned persistence includes:

```text
Classes
Sections
Attendance
Timetable
Examinations
Grades
Reports
```

---

## Search, Filtering & Pagination

Database-backed lists support server-side operations including:

* Search
* Filtering
* Sorting
* Pagination
* Role filtering
* School filtering
* Verification-status filtering
* Fee-status filtering

This keeps large datasets from being loaded entirely into the frontend.

---

## Performance Considerations

The project includes several database and API-level optimizations:

* Server-side pagination
* PostgreSQL indexes
* Concurrent dashboard queries using `Promise.all()`
* Aggregate database queries
* PostgreSQL `DATE_TRUNC` for tenant-growth aggregation
* Scalar subqueries for dashboard summaries
* Sequelize connection pooling

The project does not currently include a formal performance benchmark suite.

---

## Security

Implemented security mechanisms include:

* bcrypt password hashing
* JWT expiration
* HTTP-only refresh-token cookies
* Refresh-token revocation
* Role-based authorization
* School-level authorization
* Email verification
* Password verification for sensitive account changes
* Input validation
* UUID validation
* Database uniqueness constraints
* Audit logging

### Current Security Considerations

This project is not presented as production-ready. Known areas requiring further hardening include:

* Rate limiting
* Secure production cookie configuration
* Token storage strategy
* Password-reset session invalidation
* Email token protection
* Deployment configuration
* Centralized security monitoring

---

## Project Structure

```text
learning-management-system/
│
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── features/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       └── ...
│
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── ...
│
└── README.md
```

---

## Environment Variables

The application uses environment variables for database, authentication, email, and frontend configuration.

Example variable names:

```env
DB_NAME=
DB_USER=
DB_PASSWORD=

JWT_SECRET=
JWT_REFRESH_SECRET=

CLIENT_URL=

EMAIL_USER=
EMAIL_PASSWORD=
SUPPORT_EMAIL=

PORT=
```

> Do not commit `.env` or expose credentials publicly.

---

## Running the Project

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The current development configuration uses:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

The PostgreSQL database must be configured through the backend environment variables.

---

## Current Project Status

### Implemented

* Authentication
* Email verification
* Password recovery
* Email change verification
* Role-based access control
* School management
* User management
* Student/teacher directories
* Fees
* Announcements
* Audit logs
* Super Admin dashboard
* School Admin dashboard
* Server-side search/filtering/pagination
* Multi-school data scoping

### In Progress / Partial

* School Admin dashboard
* Teacher/Student dashboards
* Account/profile hydration
* Support workflow
* Academic modules

### Not Yet Implemented

* Persistent classes and sections
* Attendance management
* Timetable management
* Examination management
* Grading
* Report-card generation
* Self-service registration
* Online fee payments
* Persistent support tickets
* Automated test suite
* Database migrations
* CI/CD and deployment configuration

---

## Engineering Focus

This project was built to practice and demonstrate:

* Full-stack application architecture
* REST API design
* Authentication and authorization
* Multi-tenancy
* PostgreSQL database design
* Sequelize ORM
* Service-layer architecture
* API validation
* Transactional operations
* Audit logging
* Server-side pagination/filtering
* Dashboard aggregation
* Query optimization
* React state management
* Frontend/backend integration

---

## Project Status

**Current stage:** Functional administrative MVP / academic platform foundation.

The application has several fully integrated database-backed workflows, while academic management modules remain planned extensions rather than completed LMS functionality.
