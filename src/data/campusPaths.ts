import { CampusEdge, CampusNode } from '@/types/campus';

export const CAMPUS_NODES: CampusNode[] = [
  // Central Boulevard & Spine
  { id: 'node_gate', name: 'Main Campus Gate', x: 600, y: 780, category: 'entrance', buildingId: 'bldg-gate', locationId: 'loc-29' },
  { id: 'node_south_plaza', name: 'South Plaza Junction', x: 600, y: 700 },
  { id: 'node_adm', name: 'Administrative Block Entrance', x: 600, y: 600, category: 'administrative', buildingId: 'bldg-adm', locationId: 'loc-8' },
  { id: 'node_clinic', name: 'Medical Centre Foyer', x: 470, y: 600, category: 'medical', buildingId: 'bldg-adm', locationId: 'loc-25' },
  { id: 'node_central_circle', name: 'Central Garden Roundabout', x: 600, y: 480 },
  { id: 'node_lib', name: 'Central Library Portico', x: 600, y: 375, category: 'library', buildingId: 'bldg-lib', locationId: 'loc-13' },
  { id: 'node_north_plaza', name: 'North Academic Junction', x: 600, y: 260 },
  { id: 'node_aud', name: 'Auditorium Main Foyer', x: 600, y: 175, category: 'academic', buildingId: 'bldg-aud', locationId: 'loc-15' },

  // West Wing Nodes (Dining & Computing)
  { id: 'node_sw_junction', name: 'Southwest Dining Crossroad', x: 380, y: 700 },
  { id: 'node_canteen', name: 'Main Canteen & Café Entrance', x: 290, y: 620, category: 'food', buildingId: 'bldg-canteen', locationId: 'loc-17' },
  { id: 'node_west_crossroad', name: 'West Academic Crossroad', x: 380, y: 420 },
  { id: 'node_cs', name: 'Computer Science Department Atrium', x: 290, y: 415, category: 'academic', buildingId: 'bldg-cs', locationId: 'loc-1' },
  { id: 'node_nw_crossroad', name: 'Northwest Walkway Junction', x: 380, y: 240 },
  { id: 'node_ece', name: 'Electronics Department Entrance', x: 290, y: 240, category: 'academic', buildingId: 'bldg-ece', locationId: 'loc-2' },

  // East Wing Nodes (Sports, Engineering & Hostels)
  { id: 'node_se_junction', name: 'Southeast Avenue Junction', x: 820, y: 700 },
  { id: 'node_parking', name: 'Campus Parking Zone Entrance', x: 880, y: 760, category: 'parking', buildingId: 'bldg-parking', locationId: 'loc-26' },
  { id: 'node_sports', name: 'Sports Complex & Turf Entrance', x: 920, y: 625, category: 'sports', buildingId: 'bldg-sports', locationId: 'loc-22' },
  { id: 'node_east_crossroad', name: 'East Academic Crossroad', x: 820, y: 420 },
  { id: 'node_mech', name: 'Mechanical Department Entrance', x: 910, y: 415, category: 'academic', buildingId: 'bldg-mech', locationId: 'loc-3' },
  { id: 'node_ne_crossroad', name: 'Northeast Walkway Junction', x: 820, y: 240 },
  { id: 'node_civil', name: 'Civil Department Entrance', x: 910, y: 240, category: 'academic', buildingId: 'bldg-civil', locationId: 'loc-4' },

  // Hostel Enclave Nodes
  { id: 'node_hostel_quad', name: 'Student Hostel Quadrangle', x: 990, y: 350 },
  { id: 'node_boys_hostel', name: 'Boys Hostel Main Portico', x: 1050, y: 250, category: 'hostel', buildingId: 'bldg-boys-hostel', locationId: 'loc-19' },
  { id: 'node_girls_hostel', name: 'Girls Hostel Main Portico', x: 1050, y: 420, category: 'hostel', buildingId: 'bldg-girls-hostel', locationId: 'loc-20' },
];

export const CAMPUS_EDGES: CampusEdge[] = [
  // Central Spine
  { id: 'e1', from: 'node_gate', to: 'node_south_plaza', distance: 80, accessible: true, available: true, pathwayType: 'ROAD', label: 'Palm Boulevard' },
  { id: 'e2', from: 'node_south_plaza', to: 'node_adm', distance: 95, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Admin Promenade' },
  { id: 'e3', from: 'node_adm', to: 'node_clinic', distance: 130, accessible: true, available: true, pathwayType: 'RAMP', label: 'West Clinic Ramp' },
  { id: 'e4', from: 'node_adm', to: 'node_central_circle', distance: 110, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Central Garden Walkway' },
  { id: 'e5', from: 'node_central_circle', to: 'node_lib', distance: 105, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Library Floral Walkway' },
  { id: 'e6', from: 'node_lib', to: 'node_north_plaza', distance: 115, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Academic North Spine' },
  { id: 'e_stairs', from: 'node_central_circle', to: 'node_north_plaza', distance: 160, accessible: false, available: true, pathwayType: 'STAIRS', label: 'Central Garden Grand Stairway' },
  { id: 'e7', from: 'node_north_plaza', to: 'node_aud', distance: 85, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Auditorium Approach' },

  // West Wing Spine
  { id: 'e8', from: 'node_south_plaza', to: 'node_sw_junction', distance: 220, accessible: true, available: true, pathwayType: 'ROAD', label: 'West Avenue South' },
  { id: 'e9', from: 'node_sw_junction', to: 'node_canteen', distance: 120, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Dining Plaza Walkway' },
  { id: 'e10', from: 'node_sw_junction', to: 'node_west_crossroad', distance: 280, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'West Computing Avenue' },
  { id: 'e11', from: 'node_west_crossroad', to: 'node_cs', distance: 90, accessible: true, available: true, pathwayType: 'RAMP', label: 'Turing Block Access' },
  { id: 'e12', from: 'node_west_crossroad', to: 'node_nw_crossroad', distance: 180, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Faraday Walk' },
  { id: 'e13', from: 'node_nw_crossroad', to: 'node_ece', distance: 90, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Electronics Block Access' },
  { id: 'e14', from: 'node_nw_crossroad', to: 'node_north_plaza', distance: 220, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Northwest Diagonal' },

  // Cross Connections
  { id: 'e15', from: 'node_central_circle', to: 'node_west_crossroad', distance: 230, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Central West Corridor' },
  { id: 'e16', from: 'node_central_circle', to: 'node_east_crossroad', distance: 230, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Central East Corridor' },

  // East Wing Spine
  { id: 'e17', from: 'node_south_plaza', to: 'node_se_junction', distance: 220, accessible: true, available: true, pathwayType: 'ROAD', label: 'East Avenue South' },
  { id: 'e18', from: 'node_se_junction', to: 'node_parking', distance: 90, accessible: true, available: true, pathwayType: 'ROAD', label: 'Parking Entrance Road' },
  { id: 'e19', from: 'node_se_junction', to: 'node_sports', distance: 130, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Sports Complex Promenade' },
  { id: 'e20', from: 'node_se_junction', to: 'node_east_crossroad', distance: 280, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'East Engineering Avenue' },
  { id: 'e21', from: 'node_east_crossroad', to: 'node_mech', distance: 90, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Mechanical Block Access' },
  { id: 'e22', from: 'node_east_crossroad', to: 'node_ne_crossroad', distance: 180, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Smeaton Walk' },
  { id: 'e23', from: 'node_ne_crossroad', to: 'node_civil', distance: 90, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Civil Block Access' },
  { id: 'e24', from: 'node_ne_crossroad', to: 'node_north_plaza', distance: 220, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Northeast Diagonal' },

  // Hostel Enclave Connections
  { id: 'e25', from: 'node_east_crossroad', to: 'node_hostel_quad', distance: 190, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Hostel Boulevard' },
  { id: 'e26', from: 'node_hostel_quad', to: 'node_boys_hostel', distance: 110, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Boys Hostel Pathway' },
  { id: 'e27', from: 'node_hostel_quad', to: 'node_girls_hostel', distance: 110, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Girls Hostel Pathway' },

  // Sports to Engineering Walkway
  { id: 'e28', from: 'node_sports', to: 'node_east_crossroad', distance: 225, accessible: true, available: true, pathwayType: 'WALKWAY', label: 'Sports-Engineering Promenade' },
];

