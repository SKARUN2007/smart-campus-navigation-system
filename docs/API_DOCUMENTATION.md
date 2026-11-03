# Smart Campus Navigation System — REST API Documentation

This document provides complete technical specifications for all backend endpoints in the Smart Campus Navigation platform.

---

## Base URL
- Local Development: `http://localhost:3000`
- Production: `https://your-domain.com`

---

## Authentication & Headers
Protected endpoints require either:
- HTTP-Only Cookie: `campus_token=<JWT>`
- Authorization Header: `Authorization: Bearer <JWT>`

Standard response format:
```json
{
  "success": true,
  "message": "Optional feedback message",
  "data": { ... }
}
```

Error format:
```json
{
  "success": false,
  "error": "Error description",
  "details": null
}
```

---

## 1. Authentication APIs

### `POST /api/auth/login`
Signs in a registered user. Sets a 7-day secure HTTP-only cookie and returns user session + JWT.
- **Request Body:**
  ```json
  {
    "email": "student@campus.edu",
    "password": "student123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Signed in successfully",
    "data": {
      "user": {
        "id": "cmw...",
        "name": "Alex Johnson",
        "email": "student@campus.edu",
        "role": "STUDENT",
        "department": "Computer Science & Engineering",
        "studentId": "CS2024-089"
      },
      "token": "eyJhbGciOi..."
    }
  }
  ```

### `POST /api/auth/logout`
Clears the `campus_token` cookie and terminates session.

### `GET /api/auth/me`
Retrieves current session user from cookie or `Authorization: Bearer <token>`.

---

## 2. User Management APIs

### `POST /api/users/register`
Creates a new user account.
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@campus.edu",
    "password": "securepassword",
    "role": "STUDENT",
    "department": "Mechanical Engineering",
    "studentId": "ME-2025-01"
  }
  ```
- **Rules:** Public registration cannot create `ADMIN` accounts (defaults to `STUDENT`).

### `GET /api/users/profile`
*(Authenticated)* Returns user profile with saved favourites and recent navigation history.

### `PUT /api/users/profile`
*(Authenticated)* Updates user profile details (`name`, `department`, `studentId`, `avatar`).

### `POST /api/users/change-password`
*(Authenticated)* Validates current password and securely updates `passwordHash`.

### `GET /api/users`
*(Admin)* Lists all registered users. Supports `?q=<search>&role=<role>`.

### `PUT /api/users/[id]`
*(Admin)* Updates user role or activates/deactivates account. Prevents admin self-demotion or self-deactivation.

---

## 3. Location APIs

### `GET /api/locations`
Returns list of campus locations.
- **Query Params:**
  - `category` (slug): Filter by category (e.g. `academic`, `food-refreshments`)
  - `building` (code): Filter by building (e.g. `CSB`, `ADM`)
  - `popular=true`: Filter popular destinations
  - `q`: Search keyword

### `GET /api/locations/[id]`
Returns single location details including associated building, category, and navigation waypoint.

### `GET /api/locations/search?q=<keyword>`
Fast real-time autocomplete search across name, code, description, building, category, and tags.

### `POST /api/locations`
*(Admin)* Creates a new location point.
- **Body:** `{ name, code, categoryId, buildingId, description, floorNumber, roomNumber, isPopular, tags }`

### `PUT /api/locations/[id]`
*(Admin)* Updates existing location.

### `DELETE /api/locations/[id]`
*(Admin)* Deletes location safely, cascading favourites and nullifying history references.

---

## 4. Building APIs

### `GET /api/buildings`
Returns all campus buildings with location counts and category metadata.

### `GET /api/buildings/[id]`
Returns building details with floor count, opening hours, facilities list, and locations.

### `POST /api/buildings`
*(Admin)* Creates building with code, name, SVG canvas coordinates `(svgX, svgY, svgWidth, svgHeight)` and geographic coordinates.

### `PUT /api/buildings/[id]`
*(Admin)* Updates building attributes.

### `DELETE /api/buildings/[id]`
*(Admin)* Deletes building record.

---

## 5. Category APIs

### `GET /api/categories`
Returns all categories with counts of buildings, locations, and facilities.

### `POST /api/categories`
*(Admin)* Creates category with `name`, `slug`, `icon`, and `color`.

---

## 6. Facility APIs

### `GET /api/facilities`
Returns all campus facilities (e.g. ATMs, Water Dispensers, Restrooms, Cafeterias).

### `GET /api/facilities/search?q=<keyword>`
Searches facilities by name or building.

### `POST /api/facilities`
*(Admin)* Adds a facility.

---

## 7. Navigation Engine APIs

### `POST /api/navigation/route`
Computes the shortest walking route, alternative route, and wheelchair accessible route using graph algorithms.
- **Request Body:**
  ```json
  {
    "startQuery": "Main Entrance",
    "destinationQuery": "Computer Science Department",
    "preferAccessible": false,
    "recordHistory": true
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "success": true,
      "startLocation": { "name": "Main Entrance", ... },
      "destinationLocation": { "name": "Computer Science Department", ... },
      "routes": [
        {
          "id": "route-shortest",
          "name": "Shortest Route",
          "type": "SHORTEST",
          "totalDistanceMeters": 605,
          "totalDurationSeconds": 504,
          "formattedDistance": "605 m",
          "formattedDuration": "8 min 24 sec",
          "turnsCount": 3,
          "isAccessible": true,
          "instructions": [ ... ]
        }
      ],
      "comparison": {
        "dijkstraDistance": 605,
        "dijkstraVisitedNodes": 12,
        "astarDistance": 605,
        "astarVisitedNodes": 8
      }
    }
  }
  ```

### `GET /api/navigation/nodes`
Returns all 24 campus navigation waypoints with coordinates `(x, y)` and connections.

### `GET /api/navigation/edges`
Returns all walking paths with distance (meters), walking time (seconds), and accessibility flags.

### `POST /api/navigation/edges`
*(Admin)* Creates or connects an edge between two waypoints.

---

## 8. Favourites & History APIs

### `GET /api/favourites`
Returns user's saved favourite locations.

### `POST /api/favourites`
Adds a location to favourites: `{ locationId }`.

### `DELETE /api/favourites?locationId=<id>`
Removes a location from favourites.

### `GET /api/navigation/history`
Returns recent user navigation trips.

