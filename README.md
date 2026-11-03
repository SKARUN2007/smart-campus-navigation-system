# Smart Campus Navigation System

A modern, full-stack, scalable web application for university wayfinding, interactive architectural exploration, shortest-path pedestrian routing (Dijkstra & A*), and comprehensive campus facilities management.

---

## Live Demo & Repository

- **Live Website:** [https://smart-campus-navigation-system.vercel.app](https://smart-campus-navigation-system.vercel.app) *(or your deployed Vercel URL)*
- **Source Code Repository:** [https://github.com/skarunamuthan/smart-campus-navigation-system](https://github.com/skarunamuthan/smart-campus-navigation-system)
- **Deployment Platform:** Vercel (Next.js 15)
- **Production Database:** PostgreSQL 16 (Neon / Supabase)

---

## 1. Project Overview

Finding classrooms, academic departments, laboratories, administrative offices, and public amenities on a sprawling university campus can be challenging for new students, faculty members, staff, and visitors. 

The **Smart Campus Navigation System** provides an interactive, vector-accurate, and algorithmic navigation experience:
- **Interactive SVG Campus Map:** Full-screen vector map with smooth zoom (0.6x–3.0x), pan, architectural 3D building blocks, and pulsing location pins.
- **Shortest-Path Navigation Engine:** Live Dijkstra & $A^*$ shortest-path calculations across 24 waypoints and 29 bidirectional paths.
- **Turn-by-Turn Landmark Guidance:** Vector cross and dot product angle geometry ($\theta$) determining precise directional instructions (straight, turn left/right, slight left/right, ramp, stairs).
- **Wheelchair-Friendly (Step-Free) Routing:** Filters out stairs and stone steps (such as the Central Garden Grand Stairway) and prefers ADA-compliant ramps.
- **Advanced Location Search:** Real-time autocomplete, keyword searching across departments, codes, tags, and buildings.
- **Campus Facilities Directory:** Filterable catalog across Academic, Dining, Administrative, Sports, Hostels, and Medical amenities.
- **Role-Based Access Control (RBAC):** Dedicated permissions for `ADMIN`, `FACULTY`, `STAFF`, `STUDENT`, and `VISITOR`.
- **Student Dashboard (`/dashboard`):** Personalized portal with saved favourite bookmarks, quick search, and recent walking history.
- **Campus Administration Portal (`/admin`):** Complete management dashboard with real-time telemetry, building CRUD, location CRUD, facility CRUD, walking path graph controls, and user role management.
- **Production-Ready Architecture:** PostgreSQL persistence via Prisma ORM, JWT authentication, automated CI/CD pipeline, and Docker container support.

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

### Routing Algorithms & Mathematics
- **Routing Engine:** Pure Dijkstra's Shortest Path & $A^*$ Search Algorithm
- **Turn Angle Geometry:** 2D Vector Cross Product & Dot Product ($\theta$)
- **Walking Velocity Model:** $v = 1.2\text{ m/s}$ (approx. $72\text{ m/min}$)

---

## 3. Project Architecture

```
                                  [Client: Desktop / Tablet / Mobile]
                                                  │
                                                  ▼
                                      [Next.js 15 App Router]
                                                  │
               ┌──────────────────────────────────┼──────────────────────────────────┐
               ▼                                  ▼                                  ▼
      [Landing Page (/)]               [Campus Map (/explore)]          [Route Finder (/directions)]
      - Hero vector blueprint           - Interactive SVG Map            - Start & Dest Autocomplete
      - Quick destinations              - Waypoint pins & filters        - Shortest path (Dijkstra)
      - Dynamic search                  - Building details sheet         - Alternative & Step-Free (A*)
               │                                  │                                  │
               └──────────────────────────────────┼──────────────────────────────────┘
                                                  ▼
                                     [Global AuthProvider Context]
                                     - JWT Session Management
                                     - Role-Based Access Control
                                                  │
               ┌──────────────────────────────────┴──────────────────────────────────┐
               ▼                                                                     ▼
      [User Dashboard (/dashboard)]                                         [Admin Portal (/admin)]
      - Personalized welcome                                                - System KPI telemetry
      - Saved favourite bookmarks                                           - Building CRUD & boundaries
      - Navigation trip history                                             - Location & room management
      - Quick shortcuts                                                     - Walking path graph controls
                                                  │                         - User role & status controls
                                                  ▼
                                      [Backend REST API Layer]
                 ┌────────────────────────────────┼────────────────────────────────┐
                 ▼                                ▼                                ▼
         [/api/locations]                 [/api/navigation]                [/api/auth & /api/users]
         - List, search, details          - Node & Edge management         - Login, logout, session
         - Real-time search query         - Live Dijkstra route solver     - Register, profile, roles
         - CRUD mutations                 - Navigation history log         - Password hashing (Bcrypt)
                                                  │
                                                  ▼
                                     [Prisma ORM Database Client]
                                                  │
                                                  ▼
                                      [PostgreSQL 16 Database]
```

---

## 4. Key Application Pages

| Page Route | Description |
|---|---|
| [`/`](file:///Users/skarunamuthan/DS-1/src/app/page.tsx) | Landing page with animated campus blueprint hero, quick destination cards, and search. |
| [`/explore`](file:///Users/skarunamuthan/DS-1/src/app/explore/page.tsx) | Full-screen interactive SVG campus map with building overlays, zooming, panning, and pins. |
| [`/directions`](file:///Users/skarunamuthan/DS-1/src/app/directions/page.tsx) | Shortest path route finder with Dijkstra/A* solver, alternative paths, and step-by-step guidance. |
| [`/facilities`](file:///Users/skarunamuthan/DS-1/src/app/facilities/page.tsx) | Comprehensive campus facilities directory with modal details, hours, and contacts. |
| [`/login`](file:///Users/skarunamuthan/DS-1/src/app/login/page.tsx) | Sign-in portal with validation, error handling, and one-click demo account autofill. |
| [`/register`](file:///Users/skarunamuthan/DS-1/src/app/register/page.tsx) | Account creation with role selection (Student, Faculty, Visitor) and password strength meter. |
| [`/dashboard`](file:///Users/skarunamuthan/DS-1/src/app/dashboard/page.tsx) | Student & faculty dashboard for managing saved favourites and recent trip history. |
| [`/admin`](file:///Users/skarunamuthan/DS-1/src/app/admin/page.tsx) | Administration dashboard with telemetry counters, building/location/facility CRUD, and graph controls. |

---

## 5. Folder Structure

```
.
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI pipeline
├── docs/                      # Technical Documentation
│   ├── API_DOCUMENTATION.md   # REST endpoint specifications
│   ├── DATABASE_SCHEMA.md     # Models, relations, and data dictionary
│   ├── ROUTING_ALGORITHM.md   # Dijkstra, A*, and turn angle math
│   ├── ADMIN_USER_GUIDE.md    # Guide for campus administrators
│   └── DEPLOYMENT_GUIDE.md    # Vercel, Docker, and Neon guides
├── prisma/
│   ├── schema.prisma          # PostgreSQL models and relations
│   └── seed.js                # Database seed script for campus data
├── public/                    # Static assets and icons
├── scripts/
│   ├── run-all-tests.ts       # Master test runner (npm test)
│   ├── test-routing.ts        # 15 Routing Algorithm unit tests
│   ├── test-api.ts            # Backend REST API integration tests
│   └── test-auth-security.ts  # Authentication & RBAC security tests
├── src/
│   ├── app/                   # Next.js App Router pages and API routes
│   ├── components/            # Modular React components
│   ├── context/               # Global AuthContext & state providers
│   ├── data/                  # Coordinate definitions & graph topology
│   ├── lib/                   # Prisma singleton, auth utils, API client
│   ├── services/routing/      # Dijkstra, A*, vector geometry, metrics
│   └── types/                 # TypeScript interfaces
├── Dockerfile                 # Multi-stage production container
├── docker-compose.yml         # Containerized Next.js + PostgreSQL 16
├── package.json               # Scripts and dependencies
├── vercel.json                # Vercel production deployment settings
└── README.md                  # Main project documentation
```

---

## 6. Installation & Local Development

### Prerequisites
- **Node.js:** v18.17.0 or higher (v20+ recommended)
- **PostgreSQL:** v14+ (Local instance, Docker, or Neon/Supabase)

### Setup Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/skarunamuthan/smart-campus-navigation-system.git
   cd smart-campus-navigation-system
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

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Automated Testing Suite

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

## 8. Pre-Configured Demo Accounts

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@campus.edu` | `admin123` | Full access to `/admin`, CRUD operations, analytics |
| **Faculty** | `staff@campus.edu` | `student123` | Faculty access, route planning, facilities, bookmarks |
| **Student** | `student@campus.edu` | `student123` | Student dashboard, history, bookmarks, route finder |

---

## 9. Production Deployment Guide

### Deploying to Vercel + Neon PostgreSQL

1. **Database Setup (Neon / Supabase):**
   - Create a free PostgreSQL database on [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
   - Copy the connection string.
   - Run migrations and seed from your local machine:
     ```bash
     DATABASE_URL="<your_neon_url>" npx prisma db push
     DATABASE_URL="<your_neon_url>" node prisma/seed.js
     ```

2. **Deploy to Vercel:**
   - Push your code to GitHub.
   - Import the repository on [Vercel](https://vercel.com).
   - Add Environment Variables:
     - `DATABASE_URL`: Your pooled PostgreSQL connection URL.
     - `JWT_SECRET`: A secure 32+ character random secret.
     - `NEXTAUTH_URL`: `https://your-app.vercel.app`.
   - Click **Deploy**. Vercel will automatically build the Next.js application and publish the live site.

### Deploying with Docker:
```bash
docker compose up -d --build
```

---

## 10. Dedicated Documentation

For in-depth technical details, consult the dedicated guides in the `docs/` directory:
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Database Schema & Data Dictionary](docs/DATABASE_SCHEMA.md)
- [Routing Algorithm & Mathematical Geometry](docs/ROUTING_ALGORITHM.md)
- [Campus Administrator User Guide](docs/ADMIN_USER_GUIDE.md)
- [Production Deployment Guide](docs/DEPLOYMENT_GUIDE.md)

---

## 11. License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
