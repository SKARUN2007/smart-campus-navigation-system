# Smart Campus Navigation System

A modern, full-stack, scalable web application for university wayfinding, interactive architectural exploration, shortest-path pedestrian routing (Dijkstra & A*), and comprehensive campus facilities management.

---

## 1. Project Overview

Finding classrooms, academic departments, laboratories, administrative offices, and public amenities on a large university campus can be challenging for new students, faculty members, staff, and visitors. 

The **Smart Campus Navigation System** provides an interactive, vector-accurate, and algorithmic navigation experience:
- Interactive full-screen SVG campus map with zooming, panning, building overlays, and pins.
- Dijkstra & $A^*$ shortest-path calculation across 24 waypoints and 29 bidirectional paths.
- Step-by-step landmark turn directions with vector cross/dot product angle calculations.
- Wheelchair-accessible (step-free) route planning excluding staircases.
- Real-time location search with autocomplete and filtering.
- Facilities directory covering academics, dining, sports, medical, and administrative services.
- Role-Based Access Control (Admin, Faculty, Staff, Student, Visitor).
- Persistent PostgreSQL database via Prisma ORM with comprehensive REST APIs.
- User Dashboard for bookmarks and route history.
- Administrative Management Portal for full CRUD operations on buildings, locations, facilities, and walking paths.

---

## 2. Technology Stack

### Frontend
- **Framework:** Next.js 15 (App Router, Server & Client Components)
- **Library:** React 19
- **Language:** TypeScript 5.8
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React Icons
- **Mapping:** Scalable Vector Graphics (SVG) with mathematical viewport transforms

### Backend & Database
- **API Runtime:** Next.js Route Handlers (Node.js)
- **Database:** PostgreSQL 16
- **ORM:** Prisma ORM 6.4
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt password hashing
- **Session Management:** Secure HTTP-only cookies

### Algorithms & Mathematics
- **Routing Engine:** Pure Dijkstra's Shortest Path & $A^*$ Search Algorithm
- **Turn Angle Geometry:** 2D Vector Cross Product & Dot Product ($\theta$)
- **Walking Metrics:** $v = 1.2\text{ m/s}$ walking velocity model

---

## 3. Project Architecture

```
                                  [Next.js 15 Frontend]
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               ▼                            ▼                            ▼
      [Landing Page (/)]          [Campus Map (/explore)]     [Route Finder (/directions)]
               │                            │                            │
               └────────────────────────────┼────────────────────────────┘
                                            ▼
                               [AuthContext / Client API]
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               ▼                            ▼                            ▼
      [/api/locations]             [/api/navigation/route]       [/api/admin/stats]
      [/api/buildings]                      │                    [/api/auth/login]
      [/api/facilities]                     ▼                            │
               │               [Graph Engine (Dijkstra/A*)]              │
               │                            │                            │
               └────────────────────────────┴────────────────────────────┘
                                            │
                                            ▼
                                    [Prisma ORM Client]
                                            │
                                            ▼
                                [PostgreSQL 16 Database]
```

---

## 4. Folder Structure

```
.
├── prisma/
│   ├── schema.prisma          # PostgreSQL models, enums, and relations
│   └── seed.js                # Database seed script for campus data
├── public/                    # Static assets and icons
├── scripts/
│   ├── run-all-tests.ts       # Master test runner executing all suites
│   ├── test-routing.ts        # 15 Phase 5 Routing Algorithm unit tests
│   ├── test-api.ts            # Phase 6 Backend REST API integration tests
│   └── test-auth-security.ts  # Phase 7 & 8 Authentication & Security tests
├── src/
│   ├── app/
│   │   ├── admin/             # Campus Administration Dashboard (/admin)
│   │   ├── api/               # Backend REST API Route Handlers
│   │   │   ├── admin/stats/   # System counters & telemetry
│   │   │   ├── auth/          # Login, logout, session verification
│   │   │   ├── buildings/     # Building CRUD endpoints
│   │   │   ├── categories/    # Category CRUD endpoints
│   │   │   ├── facilities/    # Facilities directory & search
│   │   │   ├── favourites/    # User bookmark endpoints
│   │   │   ├── locations/     # Location CRUD & search
│   │   │   ├── navigation/    # Nodes, edges, routing & history
│   │   │   └── users/         # User profile, registration, roles
│   │   ├── dashboard/         # Student & Faculty User Dashboard (/dashboard)
│   │   ├── directions/        # Route Finder & Shortest Path page (/directions)
│   │   ├── explore/           # Interactive Campus Map (/explore)
│   │   ├── facilities/        # Facilities Directory (/facilities)
│   │   ├── login/             # Authentication Portal (/login)
│   │   ├── register/          # Account Creation (/register)
│   │   └── routes/            # Canonical forwarder to /directions
│   ├── components/            # Reusable UI components
│   │   ├── facilities/        # Facility cards and modal dialogues
│   │   ├── home/              # Landing page sections & vector hero
│   │   ├── layout/            # Responsive Navbar and Footer
│   │   ├── map/               # SVG Map, Building, Marker, Controls
│   │   ├── routing/           # RouteFinderForm, RouteCard, RouteMapViewer
│   │   └── search/            # Advanced autocomplete search
│   ├── context/               # Global AuthContext & state providers
│   ├── data/                  # Coordinate definitions & graph topology
│   ├── lib/                   # Prisma singleton, auth utils, API client
│   ├── services/routing/      # Dijkstra, A*, vector geometry, metrics
│   └── types/                 # TypeScript interfaces
├── docs/                      # Dedicated technical documentation
│   ├── API_DOCUMENTATION.md   # Complete REST endpoint specifications
│   ├── DATABASE_SCHEMA.md     # Models, relations, and data dictionary
│   ├── ROUTING_ALGORITHM.md   # Mathematical graph & turn geometry logic
│   ├── ADMIN_USER_GUIDE.md    # Guide for campus administrators
│   └── DEPLOYMENT_GUIDE.md    # Cloud and container deployment
├── Dockerfile                 # Multi-stage production container
├── docker-compose.yml         # Containerized Next.js + PostgreSQL 16
├── package.json               # Scripts and dependencies
└── README.md                  # Main project documentation
```

---

## 5. Prerequisites

- **Node.js:** v18.17.0 or higher (v20+ recommended)
- **Package Manager:** npm v9+ or pnpm
- **Database:** PostgreSQL 14+ (Local instance, Docker, or Neon/Supabase)

---

## 6. Installation Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/smart-campus-nav.git
   cd smart-campus-nav
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Configure your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/smart_campus?schema=public"
   JWT_SECRET="your-secure-jwt-secret-key-32-chars-minimum"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize Database:**
   Push Prisma schema and seed campus waypoints:
   ```bash
   npm run db:push
   npm run db:seed
   ```

---

## 7. Running the Application

### Development Mode:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Execution:
```bash
npm run build
npm start
```

---

## 8. Automated Testing Suite

The application includes **91 automated test assertions** verifying routing algorithms, backend REST APIs, authentication security, and RBAC constraints.

Run the entire test suite:
```bash
npm test
```

Individual test suites:
- **Routing Engine Tests (15 Scenarios):** `npm run test:routing`
- **Backend REST API Tests:** `npm run test:api`
- **Security & RBAC Boundary Tests:** `npm run test:security`

---

## 9. Pre-Configured Demo Accounts

For evaluation, use the following seeded accounts:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@campus.edu` | `admin123` | Full access to `/admin`, CRUD operations, analytics |
| **Faculty** | `staff@campus.edu` | `student123` | Faculty access, route planning, facilities, bookmarks |
| **Student** | `student@campus.edu` | `student123` | Student dashboard, history, bookmarks, route finder |

---

## 10. Dedicated Documentation

For in-depth technical details, consult the dedicated guides in the `docs/` directory:
- [API Documentation](file:///Users/skarunamuthan/DS-1/docs/API_DOCUMENTATION.md)
- [Database Schema & Data Dictionary](file:///Users/skarunamuthan/DS-1/docs/DATABASE_SCHEMA.md)
- [Routing Algorithm & Mathematical Geometry](file:///Users/skarunamuthan/DS-1/docs/ROUTING_ALGORITHM.md)
- [Campus Administrator User Guide](file:///Users/skarunamuthan/DS-1/docs/ADMIN_USER_GUIDE.md)
- [Production Deployment Guide](file:///Users/skarunamuthan/DS-1/docs/DEPLOYMENT_GUIDE.md)

---

## 11. License

This project is licensed under the MIT License.
