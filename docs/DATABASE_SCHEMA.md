# Smart Campus Navigation System — Database Schema

The database utilizes PostgreSQL 16 managed via Prisma ORM.

---

## Entity Relationship Overview

```
User (1) ──────────< (N) Favourite (N) >────────── (1) Location
  │                                                      │
  │ (1)                                                  │ (1)
  ▼                                                      ▼
NavigationHistory (N)                               Building (N)
                                                         │
                                                         │ (1)
NavigationEdge (N) >─── [from / to] ───< (1) NavigationNode
```

---

## Models & Data Dictionaries

### 1. `User`
Stores campus user credentials, profile information, and role assignments.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | String | `@id @default(cuid())` | Primary key |
| `email` | String | `@unique` | University email |
| `name` | String | | Full name |
| `passwordHash` | String | | Bcrypt hash ($2a$10$) |
| `role` | Role Enum | `@default(STUDENT)` | `ADMIN`, `STAFF`, `FACULTY`, `STUDENT`, `VISITOR` |
| `department` | String? | | Academic or administrative unit |
| `studentId` | String? | | Student or Employee ID |
| `avatar` | String? | | Profile avatar image URL |
| `isActive` | Boolean | `@default(true)` | Active status flag |
| `createdAt` | DateTime | `@default(now())` | Registration timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Last modification |

---

### 2. `Building`
Physical campus facilities and structural boundaries rendered on the SVG map.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | String | `@id @default(cuid())` | Primary key |
| `code` | String | `@unique` | Building acronym (e.g. `CSB`, `ADM`) |
| `name` | String | | Official building name |
| `description` | String? | | Summary of departments and activities |
| `floors` | Int | `@default(1)` | Number of above-ground floors |
| `svgX` | Float | | SVG canvas coordinate X |
| `svgY` | Float | | SVG canvas coordinate Y |
| `svgWidth` | Float | | SVG architectural width |
| `svgHeight` | Float | | SVG architectural height |
| `latitude` | Float? | | Real-world GPS latitude |
| `longitude` | Float? | | Real-world GPS longitude |
| `openingHours` | String? | | Daily operational hours |
| `contactPhone` | String? | | Reception contact number |
| `contactEmail` | String? | | Block inquiry email |
| `wheelchairAccessible` | Boolean | `@default(true)` | Ramp/elevator availability |
| `categoryId` | String? | Foreign Key (`Category`) | Primary category assignment |

---

### 3. `Location`
Rooms, departments, labs, amenities, and points of interest inside or adjacent to buildings.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | String | `@id @default(cuid())` | Primary key |
| `code` | String? | `@unique` | Short code (e.g. `LOC-CS`) |
| `name` | String | | Official title |
| `description` | String? | | Extended details |
| `locationType` | String? | | Department, Laboratory, Canteen, etc. |
| `floorNumber` | Int | `@default(0)` | Floor (0=Ground, 1=First Floor, etc.) |
| `roomNumber` | String? | | Specific room identifier |
| `categoryId` | String | Foreign Key (`Category`) | Categorical classification |
| `buildingId` | String? | Foreign Key (`Building`) | Parent building (`onDelete: Cascade`) |
| `navigationNodeId` | String? | Foreign Key (`NavigationNode`) | Entrance waypoint node |
| `isPopular` | Boolean | `@default(false)` | Quick destination highlight flag |
| `tags` | String[] | | Search keywords and aliases |

---

### 4. `NavigationNode`
Graph vertices representing physical junctions, crossroads, building portals, and landmarks.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | String | `@id @default(cuid())` | Primary key |
| `label` | String | `@unique` | Identifier (e.g. `node_gate`, `node_cs`) |
| `name` | String | | Readable landmark label |
| `x` | Float | | SVG canvas coordinate X |
| `y` | Float | | SVG canvas coordinate Y |
| `isOutdoor` | Boolean | `@default(true)` | Outdoor walkway vs indoor corridor |
| `buildingId` | String? | Foreign Key (`Building`) | Associated building entrance |

---

### 5. `NavigationEdge`
Graph edges representing walkable walkways, roads, ramps, and staircases.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | String | `@id @default(cuid())` | Primary key |
| `fromNodeId` | String | Foreign Key (`NavigationNode`) | Source vertex (`onDelete: Cascade`) |
| `toNodeId` | String | Foreign Key (`NavigationNode`) | Target vertex (`onDelete: Cascade`) |
| `distance` | Float | | Precise distance in meters ($d > 0$) |
| `walkingTime` | Int | | Estimated duration in seconds ($d / 1.2$) |
| `accessible` | Boolean | `@default(true)` | Wheelchair/step-free compatibility |
| `available` | Boolean | `@default(true)` | Operational status (construction bypass) |
| `pathwayType` | String | `@default("WALKWAY")` | `WALKWAY`, `ROAD`, `RAMP`, `CORRIDOR`, `STAIRS` |
| `instruction` | String? | | Directional landmark description |

---

### 6. `Favourite`
User's bookmarked destinations.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | String | `@id @default(cuid())` | Primary key |
| `userId` | String | Foreign Key (`User`) | User owner (`onDelete: Cascade`) |
| `locationId` | String | Foreign Key (`Location`) | Targeted location (`onDelete: Cascade`) |

---

### 7. `NavigationHistory`
Telemetry log of calculated routes and user journeys.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | String | `@id @default(cuid())` | Primary key |
| `userId` | String? | Foreign Key (`User`) | Optional logged-in user (`onDelete: SetNull`) |
| `startLocationId` | String? | Foreign Key (`Location`) | Origin location (`onDelete: SetNull`) |
| `destinationLocationId` | String? | Foreign Key (`Location`) | Destination location (`onDelete: SetNull`) |
| `distanceMeters` | Float | | Total route distance |
| `durationSeconds` | Int | | Total route time |
| `routeNodes` | String | | Node path sequence (e.g. `n1 -> n2 -> n3`) |
| `createdAt` | DateTime | `@default(now())` | Query timestamp |
