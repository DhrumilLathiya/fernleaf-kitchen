# Fernleaf Kitchen – Kitchen Operations Admin Panel

> **⚠️ IMPORTANT NOTE FOR EVALUATORS:** 
> The backend API is hosted on a free tier instance via Render. If the service has not been accessed recently, the very first request (e.g., attempting to log in) may take **45–60 seconds** while the server wakes up from sleep mode. Subsequent requests will execute at normal, lightning-fast speeds.


## 1. Project Overview
**Project Name:** Fernleaf Kitchen
**Project Type:** B2B Corporate Meal Management and Kitchen Operations Management System.
**Business Domain:** Commercial Kitchen Operations, Corporate Meal Programs, Delivery Logistics.
**Main Objective:** To provide a centralized platform for managing corporate food orders, streamlining kitchen preparation, optimizing driver dispatch, and automating corporate billing.
**Technology Stack:** Next.js (React), NestJS, PostgreSQL, Prisma ORM.
**Project Status:** Functional prototype developed within a 48-hour assignment window. Core workflows (Order -> Kitchen -> Dispatch -> Driver -> Billing) are implemented, with some secondary features de-prioritized for speed.

---

## 2. Problem Statement & Business Context
Fernleaf Kitchen runs a corporate meal program where corporate employees can order meals to their offices. Managing this at scale creates massive operational complexity. 

The kitchen needs to know exactly how much of each ingredient to prepare across hundreds of individual orders (grouped by dish or station). Dispatch teams need to group completed meals into delivery "drops" (by company, location, and time) and assign them to drivers. Finally, the administration must bill the companies (not the individual employees) for the delivered orders.

This platform digitizes this lifecycle, offering dedicated context-aware dashboards for Admins, Kitchen Staff, Dispatchers, and Drivers, ensuring tight coordination across all departments.

---

## 3. Key Features
- **Authentication and RBAC:** Fully implemented (JWT-based). Strict segregation for Admin, Kitchen, Dispatch, and Driver roles.
- **Admin Dashboard:** Implemented. High-level financial and operational metrics.
- **Catalogue & Menu Management:** Partially implemented. Dishes and options can be created and priced, but advanced derived pricing (e.g., Cost * 2.5) is skipped.
- **Pricing Management:** Implemented. Tier-based pricing (e.g., Standard vs. Premium) mapped to companies.
- **Company & Employee Management:** Implemented. Realistic data seeding provided.
- **Order Management:** Implemented. Full order state machine (Draft -> Placed -> Confirmed -> Delivered -> Cancelled).
- **Kitchen Preparation Board:** Implemented. Real-time board grouping items by station and tracking completion.
- **Dispatch Management:** Implemented. Groups orders into drops (same company, address, time) for driver assignment.
- **Driver Dashboard:** Implemented. Mobile-optimized daily manifest for route tracking.
- **Company Billing:** Partially implemented. Invoices can be generated from Confirmed/Delivered orders, but PDF generation is out of scope.
- **Platform Settings:** Not implemented. Cut-off times and holidays are handled via API/database defaults rather than a UI panel.

---

## 4. Technology Stack

| Technology | Purpose | Where It Is Used |
|------------|---------|------------------|
| **Next.js 14 (App Router)** | Frontend Framework | `frontend/` - UI, Routing, Client-side fetching |
| **TailwindCSS** | Styling | `frontend/` - UI components and layout |
| **NestJS** | Backend Framework | `backend/` - API, Business Logic, RBAC |
| **Prisma** | ORM | `backend/` - Database access and typing |
| **PostgreSQL** | Relational Database | Data persistence |
| **JWT** | Authentication | Backend auth guards & Frontend session |

---

## 5. Application Screenshots

### Admin Dashboard
![Admin Dashboard](docs/screenshots/admin_dashboard.png)

### Kitchen Board
![Kitchen Board](docs/screenshots/kitchen_board.png)

### Dispatch Board
![Dispatch Board](docs/screenshots/dispatch_board.png)

### Catalogue Management
![Catalogue](docs/screenshots/catalogue.png)

### Secure Authentication
![Login](docs/screenshots/login.png)

---

## 6. Live Demo and Test Credentials

**Live Application:**
- **Frontend (Vercel):** [https://fernleaf-kitchen-55q5.vercel.app](https://fernleaf-kitchen-55q5.vercel.app)
- **Backend API (Render):** `https://fernleaf-kitchen-eo4g.onrender.com/api`

**Test Accounts (Passwords are exactly `Test@1234`):**
- **Admin**: `admin@test.com` / `Test@1234`
- **Kitchen**: `kitchen@test.com` / `Test@1234`
- **Dispatch**: `dispatch@test.com` / `Test@1234`
- **Driver**: `driver@test.com` / `Test@1234`

---

## 7. System Architecture

```mermaid
graph TD
    Client[Next.js Frontend] -->|REST API + JWT| API[NestJS Backend]
    API --> Auth[AuthGuard & RolesGuard]
    Auth --> Controllers[Domain Controllers]
    Controllers --> Services[Business Logic Services]
    Services --> Prisma[Prisma ORM]
    Prisma --> DB[(PostgreSQL)]
```
**Responsibilities:**
- **Frontend:** Purely presentational. Handles UI state, routing, and token storage.
- **Backend:** The absolute source of truth. All business logic, price resolution, and role validation happens here.

---

## 8. Database Design and ER Diagram

```mermaid
erDiagram
    Company ||--o{ Employee : "has"
    Company ||--o{ Order : "pays for"
    Company ||--o{ Invoice : "billed via"
    
    Employee ||--o{ Order : "places"
    
    Dish ||--o{ DishPrice : "has prices in"
    PriceTier ||--o{ DishPrice : "determines"
    PriceTier ||--o{ Company : "assigned to"

    Order ||--o{ OrderLine : "contains"
    Order {
        string status
        datetime deliveryDate
        float totalAmount
        string driverId
    }

    OrderLine ||--o{ Combination : "broken into prep units"
    Combination {
        boolean isDone
        string kitchenStation
    }
```
**Important Decisions:**
- **Combinations over simple lines:** A single order line (e.g., 5 Burgers) is broken into `Combination` records (prep units) so the kitchen can mark individual configurations as completed.
- **Invoice Relation:** An `Order` has an optional `invoiceId`. Once billed, it is permanently locked to that invoice.

---

## 9. Role-Based Access Control
Enforced server-side using NestJS `@Roles()` decorators.

| Role | View Access | Modify Access |
|------|------------|---------------|
| **ADMIN** | Everything | Full CRUD on Companies, Catalogue, Billing |
| **KITCHEN** | Kitchen Board only | Can mark prep units as started/done |
| **DISPATCH**| Dispatch Board only | Can assign drivers to drops |
| **DRIVER** | Only own deliveries | Can mark assigned orders as delivered |

---

## 10. Core Business Logic and Workflows

**A. Order Lifecycle**
`DRAFT` -> `PLACED` -> `CONFIRMED` -> `DELIVERED`. 
Orders are `PLACED` by employees. When the cut-off time passes, they become `CONFIRMED` and appear in the Kitchen. Once dropped off, they are `DELIVERED`.

**B. Pricing Resolution**
Companies are assigned a `PriceTier`. When an order is created, the system locks the current price for that tier into the `OrderLine` to prevent historical data mutation if catalog prices change later.

**C. Order Cut-off Logic**
Order confirmation happens via an explicit API endpoint (intended to be hit by a cron job or Admin trigger). 

**D. Kitchen Preparation**
The kitchen doesn't see "Orders". They see "Combinations" grouped by `kitchenStation` (e.g., Hot, Cold, Grill). When all combinations for an order are marked `isDone`, the parent Order `kitchenReadyAt` timestamp is populated.

**E. Dispatch and Delivery**
Dispatchers see orders grouped by `deliveryAddress` and `companyId`. They assign a `driverId`.

**F. Company Billing**
The system looks for all `CONFIRMED` or `DELIVERED` orders where `invoiceId == null` and allows Admins to group them into an `Invoice` tied to the `Company`.

---

## 11. Dashboard Definitions and Calculations

### Admin Dashboard
- **Total Revenue:** Sum of `totalAmount` for `CONFIRMED` or `DELIVERED` orders for today. Excludes Draft/Cancelled.
- **Active Orders:** Count of `PLACED` or `CONFIRMED` orders for today.

### Kitchen Dashboard
- **What is shown:** Prep units (`Combinations`) filtered for `deliveryDate == today` AND `status == CONFIRMED`.
- **Excluded:** Pricing, Draft orders, Delivered orders. Kitchen only sees what needs to be cooked *right now*.

### Dispatch Dashboard
- **What is shown:** Orders grouped by exact Company, Address, and Date.
- **Excluded:** Orders that are already delivered.

### Driver Dashboard
- **What is shown:** Orders where `driverId == currentUser.id` AND `deliveryDate == today`.
- **Excluded:** Tomorrow's deliveries (to prevent accidental early completion).

---

## 12. Installation and Local Setup

**Prerequisites:** Node 18+, PostgreSQL.

```bash
# 1. Backend Setup
cd backend
npm install
# Set DATABASE_URL in .env
npx prisma db push --force-reset
npx prisma db seed
npm run dev

# 2. Frontend Setup (in a new terminal)
cd frontend
npm install
npm run dev
```

---

## 13. Environment Variables
| Variable | Required | Description | Example Format |
|----------|----------|-------------|----------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Yes | Secret for signing auth tokens | `super-secret-key-123` |

*(Create a `.env` file in the backend directory with these variables)*

---

## 14. API Documentation (Key Routes)
| Module | Method | Endpoint | Description | Auth |
|--------|--------|----------|-------------|------|
| Auth | POST | `/auth/login` | Returns JWT token | Public |
| Kitchen| GET | `/kitchen/board`| Gets station prep units | KITCHEN |
| Dispatch| GET| `/dispatch/drops`| Groups orders for drivers| DISPATCH |
| Orders | POST | `/orders/cutoff`| Confirms pending orders | ADMIN |

---

## 15. Key Technical Decisions and Trade-offs
1. **NestJS Backend:** Chosen for strict module boundaries, dependency injection, and out-of-the-box role guards.
2. **Prisma ORM:** Chosen for rapid type-safe database querying.
3. **Monetary Precision:** Stored as floats for speed, though real-world production would use integer cents to prevent floating-point math errors.
4. **Timezone Handling:** All dates converted to UTC midnight before storing. (Bug previously encountered and fixed in seeding logic).

---

## 16. Prioritisation and Implementation Status

| Feature | Priority | Implementation Status | Reason |
|---------|----------|-----------------------|--------|
| Auth & RBAC | High | Completed | Foundational security requirement. |
| Order Flow | High | Completed | Core business requirement. |
| Derived Pricing | Medium | Not Implemented | UI complexity too high for 48h limit. |
| Settings UI | Low | Not Implemented | Defaulted to database fallbacks. |
| CSV Imports | Low | Not Implemented | Solved problem; UI heavy to build cleanly. |

---

## 17. Assumptions and Ambiguous Requirements
- **Drop Grouping:** Assumed exact string matches on `companyId` and `deliveryAddress` are sufficient for a "Drop".
- **Kitchen Stations:** Assumed stations are fluid string tags on a Dish rather than rigid database tables.
- **Invoicing:** Assumed invoices are simple logical groupings of orders in the DB, without generating physical PDF files.

---

## 18. Testing Strategy
- **Manual Testing:** Heavy emphasis on manual E2E testing via the Prisma Seed script (which generates 30 complex scenarios, edge cases, varied statuses, and timezones).
- **Unit/Integration Tests:** *Not implemented* due to the 48-hour time constraint. If time permitted, `Jest` would be used for API endpoint integration tests.

---

## 19. Future Improvements
- Build out the automated Chron jobs for cut-offs.
- Implement WebSockets for real-time Kitchen board updates without refreshing.
- Implement proper integer-based monetary calculations.

---

## 20. Out of Scope
- Customer-facing ordering portals (strictly an admin tool).
- Payment gateway integration (Stripe, etc.).
- Delivery GPS tracking.

---

## 21. Project Directory Structure
```text
fernleaf-kitchen/
├── backend/                  # NestJS API
│   ├── prisma/               # Schema and Seed Scripts
│   └── src/
│       ├── auth/             # JWT Logic and Role Guards
│       ├── kitchen/          # Kitchen Board Logic
│       └── dispatch/         # Drop Grouping Logic
├── frontend/                 # Next.js App
│   ├── src/
│   │   ├── app/              # Routes (admin, kitchen, dispatch)
│   │   ├── components/       # Reusable UI (Sidebar, Metrics)
│   │   └── lib/              # API Client (Axios)
└── README.md
```

---

## 22. Author and Project Information
**Project:** Fernleaf Kitchen
**Target Audience:** Evaluators looking for architectural soundness, pragmatic prioritization, and clean, role-based separation of concerns.
