# Fernleaf Kitchen - Operations Admin Panel

This is the internal admin panel for **Fernleaf Kitchen**, a commercial kitchen running corporate meal programs. It handles the full operational lifecycle from catalogue management and corporate pricing to kitchen prep, order dispatching, driver delivery tracking, and billing.

## 1. Local Setup Instructions

**Prerequisites:**
- Node.js (v18+)
- PostgreSQL database running locally

**Backend Setup:**
\`\`\`bash
cd backend
npm install
# Set your DATABASE_URL in .env (e.g., DATABASE_URL="postgresql://user:pass@localhost:5432/fernleaf_kitchen")
npx prisma db push
npx prisma db seed
npm run dev
\`\`\`

**Frontend Setup:**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

The frontend will be available at `http://localhost:3000`.

**Test Accounts (Password for all is exactly as mandated in PDF):**
- **Admin**: `admin@test.com` (`Test@1234`)
- **Kitchen**: `kitchen@test.com` (`Test@1234`)
- **Dispatch**: `dispatch@test.com` (`Test@1234`)
- **Driver**: `driver@test.com` (`Test@1234`)

*(Note: The database is pre-seeded with 16 realistic companies (including Heizen), 19 employees, and a full menu with high-quality images and varying order states).*

---

## 2. Architecture Overview & Data Model

The application uses a standard decoupled architecture:
- **Frontend**: Next.js 14 (App Router) using TailwindCSS for styling and basic context for state. 
- **Backend**: NestJS for rigorous modular boundaries and strict role-based access control.
- **Database**: PostgreSQL interfaced via Prisma ORM.

### Data Model Diagram
\`\`\`mermaid
erDiagram
    Company ||--o{ Employee : "has"
    Company ||--o{ Order : "billed for"
    Company {
        string id
        string name
        string emailDomains
        string deliveryAddresses
    }
    PriceTier ||--o{ Company : "assigned to"
    PriceTier ||--o{ DishPrice : "determines"
    
    Employee ||--o{ Order : "receives"
    Employee {
        string id
        string email
        string companyId
    }

    Dish ||--o{ DishPrice : "has prices in"
    Dish ||--o{ OptionGroup : "has options"
    Dish {
        string id
        string name
        string sku
        string temperature
        float costPrice
    }

    Order ||--o{ OrderLine : "contains"
    Order {
        string id
        string status
        datetime deliveryDate
        datetime kitchenReadyAt
        datetime dispatchReadyAt
    }

    OrderLine ||--o{ OrderLineOption : "includes"
    OrderLine {
        int quantity
        float unitPrice
        string dishId
    }
\`\`\`

---

## 3. Key Decisions and Trade-offs

1. **Monorepo vs Polyrepo:** Opted for a loose monorepo structure (separate `frontend` and `backend` folders) rather than a strict Turborepo. This minimized config overhead given the 48-hour timeline while keeping code conceptually grouped.
2. **Server-side Security over Client-side Hiding:** While the UI dynamically hides buttons based on user roles, **every** endpoint in NestJS is strictly guarded using `@UseGuards(RolesGuard)` and `@Roles()`. You cannot bypass access controls by sending raw HTTP requests.
3. **Database Seeding Strategy:** Wrote a highly robust Prisma seed script that automatically generates consistent test environments. This ensured that UI verification always happened against realistic corporate data (e.g., Acme Corp, Heizen) rather than blank screens.
4. **Rich UI/UX:** Prioritized building a highly polished, "premium" feel on the frontend (using glassmorphism, dynamic CSS animations, and seeded Unsplash imagery) over building complex backend edge-case calculators (like nested option validation).

---

## 4. Prioritisation Notes (What was built, skipped, and why)

**What I Built:**
- ✅ **Domain Modeling & Core Flow:** Full end-to-end traversal from Order Creation -> Kitchen Board -> Dispatch grouping -> Driver Mobile view.
- ✅ **Role-Based Access Control:** Strict server-side and client-side isolation for Admin, Kitchen, Dispatch, and Drivers.
- ✅ **Dynamic Dashboards:** Context-aware landing pages for every role (detailed below).
- ✅ **Catalogue & Pricing:** Core structures for dishes, categories, and multiple price tiers.

**What I Skipped:**
- ❌ **Derived Pricing UI:** The PDF mentioned allowing prices like "cost x 2.4". While the DB can store absolute numbers, I skipped building the UI/engine to parse and recalculate formulas. Flat pricing was prioritized to get the order flow working.
- ❌ **CSV Bulk Import:** Skipped to save time. It's a solved problem (e.g., using Papaparse), but UI-heavy to implement row-level error reporting cleanly.
- ❌ **Complex Calendar Mathematics:** Skipped the logic that counts backwards while skipping company holidays for cut-offs. I implemented manual cut-off processing endpoints instead.
- ❌ **Company Menu Hiding:** The database structure allows for it, but the UI to preview the menu *exactly* as a specific company employee sees it was cut for time.

**What I Would Do Next With More Time:**
- Implement a global Settings UI panel so Admins can tweak cut-off thresholds without touching the database.
- Build the derived pricing engine.
- Enhance the Kitchen Board to actually color-code "late" or "at-risk" prep units based on real-time clock comparisons to the `kitchenReadyAt` timestamp.

**Ambiguous Requirements & Interpretations:**
- *Requirement:* "A unit is routed to its dish's kitchen station, or 'Unassigned' if none." 
  *Interpretation:* We modeled this as a simple string on the Dish model rather than creating a dedicated `Station` database table, assuming stations are fluid and text-based grouping is sufficient for the Kitchen Board.
- *Requirement:* "Drop Grouping."
  *Interpretation:* Grouped by strict exact-matches on `companyId`, `deliveryAddress`, and `deliveryDate`.

---

## 5. Dashboard Definitions

As required by section 4.11, here is how each role's dashboard is structured:

### Admin Dashboard
- **What is shown:** Top-level revenue metrics, total active companies, pending invoices, and recent global order activity.
- **Why they need it:** Admins need a bird's-eye view of business health and bottlenecks.
- **Calculations:** 
  - *Today's Revenue:* Sum of all `CONFIRMED` or `DELIVERED` order totals where `deliveryDate` is today. Cancelled/Draft orders are explicitly excluded.
  - *Active Orders:* Count of orders currently in `PLACED` or `CONFIRMED` states across all dates.
- **What was omitted:** Deep-dive operational metrics (like average kitchen prep time) were omitted to prevent visual clutter.

### Kitchen Dashboard (Board)
- **What is shown:** A split view of Prep Units grouped by Station.
- **Why they need it:** A kitchen lead at 6 AM only cares about what needs to be chopped, cooked, and plated *right now*.
- **Calculations:** Pulls `OrderLine` items joined with `Dish`, filtered where order status is `CONFIRMED`. `Draft` and `Placed` orders are completely invisible to the kitchen.
- **What was omitted:** Financials and pricing. The kitchen staff does not need to know how much a dish costs, only that it needs to be made.

### Dispatch Dashboard
- **What is shown:** Orders grouped into "Drops", driver assignment status, and readiness tracking.
- **Why they need it:** Dispatchers need to quickly identify which orders are stuck in the kitchen and which are ready to be handed to drivers.
- **Calculations:** Groups `CONFIRMED` orders matching exact timestamps and locations. Excludes `DELIVERED` orders so the board only shows pending work.

### Driver Dashboard
- **What is shown:** A mobile-optimized, chronological list of their assigned drops for *today only*.
- **Why they need it:** Drivers are on the road; they need large buttons, clear addresses, and a zero-distraction UI to mark things delivered.
- **Calculations:** strictly filters orders where `assignedDriverId == currentUserId` AND `deliveryDate == today()`.
- **What was omitted:** Future deliveries. Showing tomorrow's routes creates a risk of a driver marking the wrong day's drop as complete.
