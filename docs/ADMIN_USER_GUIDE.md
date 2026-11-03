# Campus Administrator User Guide

The **Campus Administration Portal** (`/admin`) provides full lifecycle management of the university's physical buildings, locations, facilities, and walking paths.

---

## 1. Accessing the Admin Portal

1. Navigate to `/login`.
2. Sign in with administrative credentials:
   - **Email:** `admin@campus.edu`
   - **Password:** `admin123`
3. Click **"Admin Panel"** in the navigation bar or access `/admin`.

---

## 2. Admin Dashboard Sections

### A. Dashboard Overview
- Real-time counters: Total Buildings, Locations, Facilities, Registered Users, and Navigation Requests.
- **Top Navigated Destinations:** Table showing the most visited campus buildings and departments.
- **User Roles Distribution:** Visual breakdown of Students, Faculty, Staff, and Administrators.

---

### B. Building Management
- **List Buildings:** View code, name, number of floors, operational hours, and associated locations.
- **Add / Edit Building:** Manage architectural boundaries, SVG coordinates, and contact details.
- **Delete Building:** Cascades deletion to child locations and facilities.

---

### C. Location Management
- **Search & Filter:** Find locations by keyword, building, or category.
- **Create Location:** Specify name, room number, floor, category, building, and entrance waypoint node.
- **Coordinates & Pins:** Assign SVG map pins `(markerX, markerY)` for interactive pinpointing.

---

### D. Category Management
- Categorize campus entities: Academic, Administrative, Food & Dining, Sports, Hostels, Medical, Restrooms, Parking.
- Assign icons and color codes.

---

### E. Facility Management
- Manage public amenities: Water Dispensers, ATMs, Accessible Restrooms, Cafeterias, First Aid Booths.
- Toggle wheelchair accessibility flags.

---

### F. Navigation Path Management (Graph Editor)
- View all 24 waypoints and 29 bidirectional walking edges.
- **Connect Nodes:** Create walking paths between two points with measured meter distance.
- **Path Availability:** Temporarily disable walking edges undergoing construction or lawn maintenance. The routing engine automatically routes around closed paths in real time.
- **Accessibility Status:** Designate step-free walkways vs stone stairways.

---

### G. User Management
- View registered users and roles.
- Promote or change roles (`ADMIN`, `FACULTY`, `STAFF`, `STUDENT`, `VISITOR`).
- Activate or deactivate accounts.
- **Protection:** Prevents an administrator from accidentally demoting or locking their own administrative account.

