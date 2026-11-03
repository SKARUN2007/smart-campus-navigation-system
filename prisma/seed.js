const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Clean existing records in reverse dependency order
  await prisma.navigationHistory.deleteMany();
  await prisma.favourite.deleteMany();
  await prisma.navigationEdge.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.location.deleteMany();
  await prisma.navigationNode.deleteMany();
  await prisma.building.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users
  const passwordHash = await bcrypt.hash('admin123', 10);
  const studentHash = await bcrypt.hash('student123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@campus.edu',
      name: 'System Administrator',
      passwordHash: passwordHash,
      role: 'ADMIN',
      department: 'Campus Administration & IT',
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      email: 'student@campus.edu',
      name: 'Alex Johnson',
      passwordHash: studentHash,
      role: 'STUDENT',
      department: 'Computer Science & Engineering',
      studentId: 'CS2024-089',
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@campus.edu',
      name: 'Dr. Sarah Williams',
      passwordHash: studentHash,
      role: 'STAFF',
      department: 'Electronics & Communication',
    },
  });

  console.log('✅ Users created: admin, student, staff');

  // 3. Seed Categories
  const categoriesData = [
    { name: 'Academic Buildings', slug: 'academic', icon: 'GraduationCap', color: '#2563eb', description: 'Classrooms, lecture halls, and academic departments' },
    { name: 'Administrative Offices', slug: 'administrative', icon: 'Building2', color: '#0f172a', description: 'Offices for admissions, examinations, and management' },
    { name: 'Laboratories', slug: 'laboratories', icon: 'FlaskConical', color: '#0891b2', description: 'Specialized computing, hardware, and engineering laboratories' },
    { name: 'Student Facilities', slug: 'student-facilities', icon: 'Users', color: '#7c3aed', description: 'Hostels, recreation zones, and student services' },
    { name: 'Food and Refreshments', slug: 'food-refreshments', icon: 'Utensils', color: '#ea580c', description: 'Canteen, cafeterias, and food courts' },
    { name: 'Sports Facilities', slug: 'sports', icon: 'Trophy', color: '#16a34a', description: 'Sports fields, indoor complex, and fitness centres' },
    { name: 'Medical Facilities', slug: 'medical', icon: 'Cross', color: '#dc2626', description: 'Health clinic, emergency room, and first aid' },
    { name: 'Parking Facilities', slug: 'parking', icon: 'Car', color: '#475569', description: 'Designated vehicle and bicycle parking zones' },
    { name: 'Restrooms', slug: 'restrooms', icon: 'DoorOpen', color: '#0284c7', description: 'Accessible restrooms across all campus blocks' },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.slug] = created;
  }
  console.log('✅ Categories created');

  // 4. Seed Buildings with SVG coordinates (map canvas: 1000 x 750)
  const buildingsData = [
    {
      code: 'ADM',
      name: 'Administrative Block',
      description: 'Central administrative headquarters housing the Principal Office, Admissions, and Examination Cell.',
      floors: 3,
      svgX: 420,
      svgY: 480,
      svgWidth: 160,
      svgHeight: 110,
      latitude: 12.9716,
      longitude: 77.5946,
      openingHours: '08:30 AM - 05:30 PM (Mon-Fri)',
      contactPhone: '+91 80 2345 6701',
      contactEmail: 'admin@campus.edu',
      wheelchairAccessible: true,
    },
    {
      code: 'CSB',
      name: 'Computer Science Department',
      description: 'Modern 4-story facility with smart classrooms, AI & Robotics labs, and faculty offices.',
      floors: 4,
      svgX: 180,
      svgY: 340,
      svgWidth: 150,
      svgHeight: 120,
      latitude: 12.9721,
      longitude: 77.5938,
      openingHours: '08:00 AM - 08:00 PM (Mon-Sat)',
      contactPhone: '+91 80 2345 6710',
      contactEmail: 'cs@campus.edu',
      wheelchairAccessible: true,
    },
    {
      code: 'ECE',
      name: 'Electronics Department',
      description: 'Department of Electronics & Communication Engineering with VLSI and IoT research labs.',
      floors: 3,
      svgX: 180,
      svgY: 180,
      svgWidth: 150,
      svgHeight: 110,
      latitude: 12.9728,
      longitude: 77.5937,
      openingHours: '08:30 AM - 06:00 PM',
      contactPhone: '+91 80 2345 6715',
      contactEmail: 'ece@campus.edu',
      wheelchairAccessible: true,
    },
    {
      code: 'MEC',
      name: 'Mechanical Department',
      description: 'Engineering workshops, fluid mechanics, CAD labs, and automotive research bays.',
      floors: 2,
      svgX: 670,
      svgY: 340,
      svgWidth: 160,
      svgHeight: 120,
      latitude: 12.9722,
      longitude: 77.5958,
      openingHours: '08:30 AM - 05:30 PM',
      contactPhone: '+91 80 2345 6720',
      contactEmail: 'mech@campus.edu',
      wheelchairAccessible: true,
    },
    {
      code: 'CIV',
      name: 'Civil Department',
      description: 'Structural engineering, surveying facilities, soil testing labs, and lecture halls.',
      floors: 2,
      svgX: 670,
      svgY: 180,
      svgWidth: 160,
      svgHeight: 110,
      latitude: 12.973,
      longitude: 77.5959,
      openingHours: '08:30 AM - 05:30 PM',
      contactPhone: '+91 80 2345 6725',
      contactEmail: 'civil@campus.edu',
      wheelchairAccessible: true,
    },
    {
      code: 'LIB',
      name: 'Central Library',
      description: 'State-of-the-art knowledge hub with over 100,000 volumes, e-resource portals, and quiet study pods.',
      floors: 3,
      svgX: 420,
      svgY: 300,
      svgWidth: 160,
      svgHeight: 120,
      latitude: 12.9724,
      longitude: 77.5947,
      openingHours: '08:00 AM - 10:00 PM (Daily)',
      contactPhone: '+91 80 2345 6730',
      contactEmail: 'library@campus.edu',
      wheelchairAccessible: true,
    },
    {
      code: 'AUD',
      name: 'Grand Auditorium & Seminar Halls',
      description: 'Air-conditioned 1,500-seat main auditorium and dual 200-seat multimedia seminar halls.',
      floors: 2,
      svgX: 420,
      svgY: 140,
      svgWidth: 160,
      svgHeight: 110,
      latitude: 12.9733,
      longitude: 77.5948,
      openingHours: '09:00 AM - 09:00 PM (Event based)',
      contactPhone: '+91 80 2345 6735',
      contactEmail: 'events@campus.edu',
      wheelchairAccessible: true,
    },
    {
      code: 'CAN',
      name: 'Campus Dining & Canteen',
      description: 'Multi-cuisine food court, bakery, juice bar, and open-air terrace seating.',
      floors: 2,
      svgX: 180,
      svgY: 510,
      svgWidth: 140,
      svgHeight: 100,
      latitude: 12.9712,
      longitude: 77.5936,
      openingHours: '07:30 AM - 09:00 PM (Daily)',
      contactPhone: '+91 80 2345 6740',
      contactEmail: 'dining@campus.edu',
      wheelchairAccessible: true,
    },
    {
      code: 'SPX',
      name: 'Sports Complex & Grounds',
      description: 'Olympic track, football pitch, indoor basketball court, badminton courts, and gym.',
      floors: 1,
      svgX: 670,
      svgY: 500,
      svgWidth: 170,
      svgHeight: 140,
      latitude: 12.971,
      longitude: 77.5962,
      openingHours: '06:00 AM - 08:30 PM (Daily)',
      contactPhone: '+91 80 2345 6750',
      contactEmail: 'sports@campus.edu',
      wheelchairAccessible: true,
    },
    {
      code: 'HST',
      name: 'Student Hostels & Residences',
      description: 'Residential quarters for undergraduate and postgraduate students with 24/7 security.',
      floors: 5,
      svgX: 870,
      svgY: 220,
      svgWidth: 100,
      svgHeight: 280,
      latitude: 12.9725,
      longitude: 77.5975,
      openingHours: '24 Hours (Curfew 09:30 PM)',
      contactPhone: '+91 80 2345 6760',
      contactEmail: 'hostel@campus.edu',
      wheelchairAccessible: true,
    },
  ];

  const buildings = {};
  for (const b of buildingsData) {
    const created = await prisma.building.create({ data: b });
    buildings[b.code] = created;
  }
  console.log('✅ Buildings created');

  // 5. Seed Navigation Nodes (Waypoints across campus walkways and entrances)
  const nodesData = [
    { label: 'NODE_MAIN_GATE', name: 'Main Campus Entrance', x: 500, y: 700, latitude: 12.9702, longitude: 12.9702, isOutdoor: true },
    { label: 'NODE_SOUTH_PLAZA', name: 'South Plaza Junction', x: 500, y: 620, isOutdoor: true },
    { label: 'NODE_ADMIN_ENTRANCE', name: 'Administrative Block Entrance', x: 500, y: 535, buildingId: buildings['ADM'].id, isOutdoor: true },
    { label: 'NODE_CENTRAL_CIRCLE', name: 'Central Garden Circle', x: 500, y: 440, isOutdoor: true },
    { label: 'NODE_LIBRARY_ENTRANCE', name: 'Central Library Entrance', x: 500, y: 360, buildingId: buildings['LIB'].id, isOutdoor: true },
    { label: 'NODE_NORTH_JUNCTION', name: 'North Academic Junction', x: 500, y: 260, isOutdoor: true },
    { label: 'NODE_AUDITORIUM_ENTRANCE', name: 'Auditorium Foyer', x: 500, y: 195, buildingId: buildings['AUD'].id, isOutdoor: true },

    // West Wing Nodes
    { label: 'NODE_WEST_AVENUE_SOUTH', name: 'Dining Plaza Junction', x: 340, y: 560, isOutdoor: true },
    { label: 'NODE_CANTEEN_ENTRANCE', name: 'Canteen & Cafeteria Entrance', x: 250, y: 560, buildingId: buildings['CAN'].id, isOutdoor: true },
    { label: 'NODE_CS_ENTRANCE', name: 'Computer Science Department Entry', x: 255, y: 400, buildingId: buildings['CSB'].id, isOutdoor: true },
    { label: 'NODE_WEST_AVENUE_MID', name: 'West Academic Crossroad', x: 340, y: 400, isOutdoor: true },
    { label: 'NODE_ECE_ENTRANCE', name: 'Electronics Department Entry', x: 255, y: 235, buildingId: buildings['ECE'].id, isOutdoor: true },
    { label: 'NODE_WEST_AVENUE_NORTH', name: 'Northwest Walkway', x: 340, y: 235, isOutdoor: true },

    // East Wing Nodes
    { label: 'NODE_EAST_AVENUE_SOUTH', name: 'Sports Complex Junction', x: 650, y: 570, isOutdoor: true },
    { label: 'NODE_SPORTS_ENTRANCE', name: 'Sports Ground & Pavilion', x: 755, y: 570, buildingId: buildings['SPX'].id, isOutdoor: true },
    { label: 'NODE_PARKING_ZONE', name: 'North-East Main Parking Area', x: 700, y: 690, isOutdoor: true },
    { label: 'NODE_MECH_ENTRANCE', name: 'Mechanical Department Entry', x: 750, y: 400, buildingId: buildings['MEC'].id, isOutdoor: true },
    { label: 'NODE_EAST_AVENUE_MID', name: 'East Academic Crossroad', x: 650, y: 400, isOutdoor: true },
    { label: 'NODE_CIVIL_ENTRANCE', name: 'Civil Department Entry', x: 750, y: 235, buildingId: buildings['CIV'].id, isOutdoor: true },
    { label: 'NODE_EAST_AVENUE_NORTH', name: 'Northeast Walkway', x: 650, y: 235, isOutdoor: true },
    { label: 'NODE_HOSTEL_ENTRANCE', name: 'Hostel Gate & Quad', x: 870, y: 360, buildingId: buildings['HST'].id, isOutdoor: true },
  ];

  const nodes = {};
  for (const n of nodesData) {
    const created = await prisma.navigationNode.create({ data: n });
    nodes[n.label] = created;
  }
  console.log('✅ Navigation Nodes created:', Object.keys(nodes).length);

  // 6. Helper function to create bidirectional edges
  async function connectNodes(nodeA, nodeB, distance, walkingTime, options = {}) {
    const defaultOpts = {
      isAccessible: true,
      isCovered: false,
      isPathAvailable: true,
      pathwayType: 'WALKWAY',
      instructionAtoB: `Walk straight towards ${nodeB.name}`,
      instructionBtoA: `Walk straight towards ${nodeA.name}`,
    };
    const opts = { ...defaultOpts, ...options };

    await prisma.navigationEdge.create({
      data: {
        fromNodeId: nodeA.id,
        toNodeId: nodeB.id,
        distance,
        walkingTime,
        isAccessible: opts.isAccessible,
        isCovered: opts.isCovered,
        isPathAvailable: opts.isPathAvailable,
        pathwayType: opts.pathwayType,
        instruction: opts.instructionAtoB,
      },
    });

    await prisma.navigationEdge.create({
      data: {
        fromNodeId: nodeB.id,
        toNodeId: nodeA.id,
        distance,
        walkingTime,
        isAccessible: opts.isAccessible,
        isCovered: opts.isCovered,
        isPathAvailable: opts.isPathAvailable,
        pathwayType: opts.pathwayType,
        instruction: opts.instructionBtoA,
      },
    });
  }

  // Connect Central Spine
  await connectNodes(nodes['NODE_MAIN_GATE'], nodes['NODE_SOUTH_PLAZA'], 80, 60, {
    instructionAtoB: 'Enter through the Main Campus Entrance and continue straight along the Palm Boulevard.',
    instructionBtoA: 'Proceed towards the South Plaza and exit via the Main Campus Entrance.',
  });
  await connectNodes(nodes['NODE_SOUTH_PLAZA'], nodes['NODE_ADMIN_ENTRANCE'], 85, 65, {
    instructionAtoB: 'Walk north from South Plaza towards the Administrative Block foyer.',
    instructionBtoA: 'Head south from Administrative Block towards South Plaza.',
  });
  await connectNodes(nodes['NODE_ADMIN_ENTRANCE'], nodes['NODE_CENTRAL_CIRCLE'], 95, 75, {
    instructionAtoB: 'Pass the Administrative Block and walk to the Central Garden Circle.',
    instructionBtoA: 'Proceed south from the Central Circle towards the Administrative Block.',
  });
  await connectNodes(nodes['NODE_CENTRAL_CIRCLE'], nodes['NODE_LIBRARY_ENTRANCE'], 80, 60, {
    instructionAtoB: 'Walk north past the floral garden directly to the Central Library portico.',
    instructionBtoA: 'Head south from Central Library entrance towards the Central Circle.',
  });
  await connectNodes(nodes['NODE_LIBRARY_ENTRANCE'], nodes['NODE_NORTH_JUNCTION'], 100, 75, {
    instructionAtoB: 'Continue past the Library along the central path toward the North Academic Junction.',
    instructionBtoA: 'Walk south toward Central Library entrance.',
  });
  await connectNodes(nodes['NODE_NORTH_JUNCTION'], nodes['NODE_AUDITORIUM_ENTRANCE'], 65, 50, {
    instructionAtoB: 'Proceed north to the Grand Auditorium and Seminar Hall main foyer.',
    instructionBtoA: 'Walk south from Auditorium towards the North Junction.',
  });

  // Connect West Spine
  await connectNodes(nodes['NODE_SOUTH_PLAZA'], nodes['NODE_WEST_AVENUE_SOUTH'], 160, 120, {
    instructionAtoB: 'Turn left from South Plaza and head west toward the Dining Plaza.',
    instructionBtoA: 'Walk east along the promenade toward South Plaza.',
  });
  await connectNodes(nodes['NODE_WEST_AVENUE_SOUTH'], nodes['NODE_CANTEEN_ENTRANCE'], 90, 70, {
    instructionAtoB: 'Turn slightly left into the Canteen & Cafeteria entrance walkway.',
    instructionBtoA: 'Exit the Canteen towards the Dining Plaza Junction.',
  });
  await connectNodes(nodes['NODE_WEST_AVENUE_SOUTH'], nodes['NODE_WEST_AVENUE_MID'], 160, 120, {
    instructionAtoB: 'Head north along West Avenue toward the Computer Science building.',
    instructionBtoA: 'Head south along West Avenue toward the Dining Plaza.',
  });
  await connectNodes(nodes['NODE_WEST_AVENUE_MID'], nodes['NODE_CS_ENTRANCE'], 85, 65, {
    instructionAtoB: 'Turn left to enter the Computer Science Department atrium.',
    instructionBtoA: 'Exit the Computer Science Department to the West Avenue crossroad.',
  });
  await connectNodes(nodes['NODE_CENTRAL_CIRCLE'], nodes['NODE_WEST_AVENUE_MID'], 160, 120, {
    instructionAtoB: 'Take the West walkway from Central Circle towards Computer Science Block.',
    instructionBtoA: 'Walk east towards Central Circle.',
  });
  await connectNodes(nodes['NODE_WEST_AVENUE_MID'], nodes['NODE_WEST_AVENUE_NORTH'], 165, 125, {
    instructionAtoB: 'Continue north along West Avenue toward Electronics Department.',
    instructionBtoA: 'Proceed south towards Computer Science intersection.',
  });
  await connectNodes(nodes['NODE_WEST_AVENUE_NORTH'], nodes['NODE_ECE_ENTRANCE'], 85, 65, {
    instructionAtoB: 'Turn left into the Electronics Department entrance.',
    instructionBtoA: 'Exit the Electronics Department to the walkway.',
  });
  await connectNodes(nodes['NODE_WEST_AVENUE_NORTH'], nodes['NODE_NORTH_JUNCTION'], 160, 120, {
    instructionAtoB: 'Turn right and proceed east toward North Academic Junction and Auditorium.',
    instructionBtoA: 'Turn left towards West Academic area (Electronics / CS).',
  });

  // Connect East Spine
  await connectNodes(nodes['NODE_SOUTH_PLAZA'], nodes['NODE_EAST_AVENUE_SOUTH'], 150, 110, {
    instructionAtoB: 'Turn right from South Plaza towards the Sports Complex and Parking.',
    instructionBtoA: 'Walk west from Sports Avenue towards South Plaza.',
  });
  await connectNodes(nodes['NODE_EAST_AVENUE_SOUTH'], nodes['NODE_PARKING_ZONE'], 130, 95, {
    instructionAtoB: 'Head southeast into the designated Campus Parking Area.',
    instructionBtoA: 'Walk north out of the parking zone towards East Avenue.',
  });
  await connectNodes(nodes['NODE_EAST_AVENUE_SOUTH'], nodes['NODE_SPORTS_ENTRANCE'], 105, 80, {
    instructionAtoB: 'Proceed straight to the Sports Ground pavilion and indoor stadium.',
    instructionBtoA: 'Exit the Sports Ground towards the crossroad.',
  });
  await connectNodes(nodes['NODE_EAST_AVENUE_SOUTH'], nodes['NODE_EAST_AVENUE_MID'], 170, 130, {
    instructionAtoB: 'Proceed north along East Avenue toward the Mechanical Block.',
    instructionBtoA: 'Walk south toward Sports Complex and Parking.',
  });
  await connectNodes(nodes['NODE_EAST_AVENUE_MID'], nodes['NODE_MECH_ENTRANCE'], 100, 75, {
    instructionAtoB: 'Turn right to enter the Mechanical Department workshops and foyer.',
    instructionBtoA: 'Exit Mechanical Block to the East Avenue walkway.',
  });
  await connectNodes(nodes['NODE_CENTRAL_CIRCLE'], nodes['NODE_EAST_AVENUE_MID'], 150, 115, {
    instructionAtoB: 'Take the East walkway from Central Circle towards Mechanical & Civil Blocks.',
    instructionBtoA: 'Walk west towards Central Circle.',
  });
  await connectNodes(nodes['NODE_EAST_AVENUE_MID'], nodes['NODE_EAST_AVENUE_NORTH'], 165, 125, {
    instructionAtoB: 'Continue north along East Avenue toward the Civil Department.',
    instructionBtoA: 'Walk south toward Mechanical Department.',
  });
  await connectNodes(nodes['NODE_EAST_AVENUE_NORTH'], nodes['NODE_CIVIL_ENTRANCE'], 100, 75, {
    instructionAtoB: 'Turn right into the Civil Department entrance.',
    instructionBtoA: 'Exit Civil Department into East Avenue.',
  });
  await connectNodes(nodes['NODE_EAST_AVENUE_NORTH'], nodes['NODE_NORTH_JUNCTION'], 150, 115, {
    instructionAtoB: 'Turn left and walk west toward North Academic Junction and Auditorium.',
    instructionBtoA: 'Proceed east towards Civil Department and Hostels.',
  });
  await connectNodes(nodes['NODE_EAST_AVENUE_MID'], nodes['NODE_HOSTEL_ENTRANCE'], 220, 170, {
    instructionAtoB: 'Take the eastern pathway past Mechanical block straight to the Student Hostels.',
    instructionBtoA: 'Leave Student Hostels and walk west towards East Academic Avenue.',
  });

  console.log('✅ Navigation Edges seeded successfully');

  // 7. Seed Locations (All locations requested in user specification)
  const locationsData = [
    {
      name: 'Main Entrance',
      code: 'LOC-GATE',
      description: 'Primary vehicular and pedestrian access point with 24/7 security booth and visitor reception.',
      categorySlug: 'student-facilities',
      nodeLabel: 'NODE_MAIN_GATE',
      floorNumber: 0,
      isPopular: true,
      tags: ['gate', 'entry', 'security', 'entrance', 'welcome'],
    },
    {
      name: 'Administrative Block',
      code: 'LOC-ADM',
      description: 'Central campus management building including admissions, student welfare, and bursar office.',
      buildingCode: 'ADM',
      categorySlug: 'administrative',
      nodeLabel: 'NODE_ADMIN_ENTRANCE',
      floorNumber: 1,
      isPopular: true,
      tags: ['admin', 'office', 'principal', 'admissions', 'management'],
    },
    {
      name: 'Computer Science Department',
      code: 'LOC-CS',
      description: 'Home of Computer Science & Engineering, Artificial Intelligence, and Software Engineering.',
      buildingCode: 'CSB',
      categorySlug: 'academic',
      nodeLabel: 'NODE_CS_ENTRANCE',
      floorNumber: 1,
      isPopular: true,
      tags: ['cs', 'cse', 'computer science', 'it', 'ai', 'coding', 'software'],
    },
    {
      name: 'Electronics Department',
      code: 'LOC-ECE',
      description: 'Department of Electronics & Communication Engineering featuring embedded systems and signal processing.',
      buildingCode: 'ECE',
      categorySlug: 'academic',
      nodeLabel: 'NODE_ECE_ENTRANCE',
      floorNumber: 1,
      isPopular: true,
      tags: ['ece', 'electronics', 'hardware', 'circuits', 'communication'],
    },
    {
      name: 'Mechanical Department',
      code: 'LOC-MECH',
      description: 'Mechanical Engineering laboratories, thermal sciences, and manufacturing workshops.',
      buildingCode: 'MEC',
      categorySlug: 'academic',
      nodeLabel: 'NODE_MECH_ENTRANCE',
      floorNumber: 1,
      isPopular: false,
      tags: ['mech', 'mechanical', 'workshop', 'automobile', 'cad'],
    },
    {
      name: 'Civil Department',
      code: 'LOC-CIVIL',
      description: 'Civil Engineering department, environmental testing labs, and surveying research center.',
      buildingCode: 'CIV',
      categorySlug: 'academic',
      nodeLabel: 'NODE_CIVIL_ENTRANCE',
      floorNumber: 1,
      isPopular: false,
      tags: ['civil', 'surveying', 'construction', 'structures'],
    },
    {
      name: 'Central Library',
      code: 'LOC-LIB',
      description: 'Three-story library with silent reading zones, digital thesis repository, and collaboration rooms.',
      buildingCode: 'LIB',
      categorySlug: 'student-facilities',
      nodeLabel: 'NODE_LIBRARY_ENTRANCE',
      floorNumber: 1,
      isPopular: true,
      tags: ['library', 'books', 'study', 'reading', 'journals', 'e-books'],
    },
    {
      name: 'Advanced Computer Laboratories',
      code: 'LOC-LAB-CS',
      description: 'High-performance GPU cluster lab, Cloud computing lab, and general student programming labs.',
      buildingCode: 'CSB',
      categorySlug: 'laboratories',
      nodeLabel: 'NODE_CS_ENTRANCE',
      floorNumber: 2,
      roomNumber: 'CS-204',
      isPopular: true,
      tags: ['lab', 'computers', 'coding lab', 'gpu', 'workstations'],
    },
    {
      name: 'Grand Auditorium',
      code: 'LOC-AUD',
      description: '1,500-seat acoustic auditorium for convocations, cultural festivals, and technical symposiums.',
      buildingCode: 'AUD',
      categorySlug: 'student-facilities',
      nodeLabel: 'NODE_AUDITORIUM_ENTRANCE',
      floorNumber: 1,
      isPopular: true,
      tags: ['auditorium', 'events', 'cultural', 'hall', 'ceremony'],
    },
    {
      name: 'Seminar Hall Alpha',
      code: 'LOC-SEM-A',
      description: '200-seat tiered presentation hall equipped with high-definition video conferencing and smart lectern.',
      buildingCode: 'AUD',
      categorySlug: 'academic',
      nodeLabel: 'NODE_AUDITORIUM_ENTRANCE',
      floorNumber: 2,
      roomNumber: 'SH-201',
      isPopular: false,
      tags: ['seminar', 'conference', 'talks', 'guest lecture'],
    },
    {
      name: 'Campus Canteen',
      code: 'LOC-CANTEEN',
      description: 'Main food pavilion serving breakfast, wholesome lunch thalis, quick bites, and hot beverages.',
      buildingCode: 'CAN',
      categorySlug: 'food-refreshments',
      nodeLabel: 'NODE_CANTEEN_ENTRANCE',
      floorNumber: 1,
      isPopular: true,
      tags: ['food', 'lunch', 'canteen', 'meals', 'coffee', 'tea'],
    },
    {
      name: 'Garden Cafeteria',
      code: 'LOC-CAFE',
      description: 'Artisanal espresso bar, snacks, wraps, and open-air seating amidst lush campus landscaping.',
      buildingCode: 'CAN',
      categorySlug: 'food-refreshments',
      nodeLabel: 'NODE_CANTEEN_ENTRANCE',
      floorNumber: 2,
      isPopular: true,
      tags: ['cafe', 'coffee', 'snacks', 'bistro', 'wifi'],
    },
    {
      name: 'Sports Ground & Pavilion',
      code: 'LOC-SPORTS',
      description: 'Full-size football pitch, 400m synthetic running track, basketball pavilion, and spectator stands.',
      buildingCode: 'SPX',
      categorySlug: 'sports',
      nodeLabel: 'NODE_SPORTS_ENTRANCE',
      floorNumber: 1,
      isPopular: true,
      tags: ['sports', 'ground', 'football', 'cricket', 'track', 'fitness'],
    },
    {
      name: 'North-East Parking Area',
      code: 'LOC-PARKING',
      description: 'Covered and open parking with EV charging stations for two-wheelers and four-wheelers.',
      categorySlug: 'parking',
      nodeLabel: 'NODE_PARKING_ZONE',
      floorNumber: 0,
      isPopular: false,
      tags: ['parking', 'car', 'bike', 'ev', 'vehicle'],
    },
    {
      name: 'Student Hostel Complex',
      code: 'LOC-HOSTEL',
      description: 'Modern residential hostel blocks with dining mess, study rooms, gym, and laundromat.',
      buildingCode: 'HST',
      categorySlug: 'student-facilities',
      nodeLabel: 'NODE_HOSTEL_ENTRANCE',
      floorNumber: 1,
      isPopular: true,
      tags: ['hostel', 'dorm', 'residence', 'room', 'living'],
    },
    {
      name: 'Principal Office',
      code: 'LOC-PRINCIPAL',
      description: 'Office of the College Principal and Academic Dean, Executive conference room.',
      buildingCode: 'ADM',
      categorySlug: 'administrative',
      nodeLabel: 'NODE_ADMIN_ENTRANCE',
      floorNumber: 2,
      roomNumber: 'AD-201',
      isPopular: true,
      tags: ['principal', 'director', 'dean', 'administration', 'head'],
    },
    {
      name: 'Examination Cell',
      code: 'LOC-EXAM',
      description: 'Controller of Examinations office handling timetable issuance, grades, hall tickets, and transcripts.',
      buildingCode: 'ADM',
      categorySlug: 'administrative',
      nodeLabel: 'NODE_ADMIN_ENTRANCE',
      floorNumber: 1,
      roomNumber: 'AD-105',
      isPopular: true,
      tags: ['exam', 'marks', 'transcripts', 'results', 'hall ticket', 'evaluation'],
    },
    {
      name: 'Placement & Career Cell',
      code: 'LOC-PLACEMENT',
      description: 'Corporate relations and placement training center, interview suites, and recruitment halls.',
      buildingCode: 'ADM',
      categorySlug: 'administrative',
      nodeLabel: 'NODE_ADMIN_ENTRANCE',
      floorNumber: 3,
      roomNumber: 'AD-302',
      isPopular: true,
      tags: ['placement', 'jobs', 'careers', 'internships', 'interviews', 'companies'],
    },
    {
      name: 'Campus Medical Centre',
      code: 'LOC-MED',
      description: '24/7 First Aid and Health Clinic staffed with registered physicians, nurses, and ambulance standby.',
      buildingCode: 'ADM',
      categorySlug: 'medical',
      nodeLabel: 'NODE_ADMIN_ENTRANCE',
      floorNumber: 1,
      roomNumber: 'AD-101',
      isPopular: true,
      tags: ['medical', 'health', 'clinic', 'first aid', 'doctor', 'emergency'],
    },
    {
      name: 'Central Restrooms (Universal Accessible)',
      code: 'LOC-REST-CENTRAL',
      description: 'Clean, accessible restrooms with touchless amenities, infant care room, and water dispensers.',
      buildingCode: 'ADM',
      categorySlug: 'restrooms',
      nodeLabel: 'NODE_ADMIN_ENTRANCE',
      floorNumber: 1,
      isPopular: false,
      tags: ['restroom', 'toilet', 'washroom', 'accessible', 'water'],
    },
  ];

  for (const loc of locationsData) {
    await prisma.location.create({
      data: {
        name: loc.name,
        code: loc.code,
        description: loc.description,
        floorNumber: loc.floorNumber,
        roomNumber: loc.roomNumber,
        isPopular: loc.isPopular,
        tags: loc.tags,
        categoryId: categories[loc.categorySlug].id,
        buildingId: loc.buildingCode ? buildings[loc.buildingCode].id : null,
        navigationNodeId: nodes[loc.nodeLabel].id,
      },
    });
  }
  console.log('✅ Campus Locations created:', locationsData.length);

  // 8. Seed Detailed Facilities
  const facilitiesData = [
    {
      name: 'Main Computer Science Lab 1',
      description: '60 high-performance workstations with Ubuntu Linux and Python/C++ development tools.',
      buildingCode: 'CSB',
      categorySlug: 'laboratories',
      floorNumber: 2,
      openingHours: '08:00 AM - 07:00 PM',
      nodeLabel: 'NODE_CS_ENTRANCE',
    },
    {
      name: 'AI & Machine Learning Research Center',
      description: 'Equipped with NVIDIA A100 GPU servers for deep learning and computer vision research.',
      buildingCode: 'CSB',
      categorySlug: 'laboratories',
      floorNumber: 3,
      openingHours: '24 Hours (Authorized access)',
      nodeLabel: 'NODE_CS_ENTRANCE',
    },
    {
      name: 'Microprocessors & Embedded Systems Lab',
      description: 'ARM Cortex boards, oscilloscopes, FPGA development kits, and sensor prototyping benches.',
      buildingCode: 'ECE',
      categorySlug: 'laboratories',
      floorNumber: 2,
      openingHours: '09:00 AM - 05:00 PM',
      nodeLabel: 'NODE_ECE_ENTRANCE',
    },
    {
      name: 'Fluid Mechanics & Thermal Engineering Lab',
      description: 'Wind tunnels, refrigeration test rigs, and pelton wheel turbines.',
      buildingCode: 'MEC',
      categorySlug: 'laboratories',
      floorNumber: 1,
      openingHours: '09:00 AM - 05:00 PM',
      nodeLabel: 'NODE_MECH_ENTRANCE',
    },
    {
      name: 'Student Welfare & Grievance Desk',
      description: 'Helpdesk for student scholarships, bus passes, and general university inquiries.',
      buildingCode: 'ADM',
      categorySlug: 'administrative',
      floorNumber: 1,
      openingHours: '09:30 AM - 04:30 PM',
      contactPhone: '+91 80 2345 6705',
      nodeLabel: 'NODE_ADMIN_ENTRANCE',
    },
    {
      name: '24/7 Campus Health Clinic',
      description: 'Doctor on duty, emergency triage, pharmacy, and patient observation beds.',
      buildingCode: 'ADM',
      categorySlug: 'medical',
      floorNumber: 1,
      openingHours: 'Open 24/7',
      contactPhone: '+91 80 2345 6799',
      nodeLabel: 'NODE_ADMIN_ENTRANCE',
    },
    {
      name: 'Campus Gym & Fitness Hub',
      description: 'Cardio equipment, free weights, crossfit station, and qualified fitness instructors.',
      buildingCode: 'SPX',
      categorySlug: 'sports',
      floorNumber: 1,
      openingHours: '06:00 AM - 09:00 AM & 04:30 PM - 08:30 PM',
      nodeLabel: 'NODE_SPORTS_ENTRANCE',
    },
    {
      name: 'Central Food Court',
      description: 'South Indian, North Indian, Chinese, Sandwiches, and Fresh Juices counters.',
      buildingCode: 'CAN',
      categorySlug: 'food-refreshments',
      floorNumber: 1,
      openingHours: '07:30 AM - 09:00 PM',
      nodeLabel: 'NODE_CANTEEN_ENTRANCE',
    },
  ];

  for (const fac of facilitiesData) {
    await prisma.facility.create({
      data: {
        name: fac.name,
        description: fac.description,
        floorNumber: fac.floorNumber,
        openingHours: fac.openingHours,
        contactPhone: fac.contactPhone,
        buildingId: buildings[fac.buildingCode].id,
        categoryId: categories[fac.categorySlug].id,
        navigationNodeId: nodes[fac.nodeLabel].id,
      },
    });
  }
  console.log('✅ Facilities created:', facilitiesData.length);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

