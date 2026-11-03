export interface SampleLocation {
  id: string;
  name: string;
  category: string;
  buildingName: string;
  buildingCode: string;
  floor: string;
  roomNumber?: string;
  description: string;
  tags: string[];
  isPopular: boolean;
  estimatedWalkingMinutes: number;
  accessible: boolean;
}

export const SAMPLE_LOCATIONS: SampleLocation[] = [
  {
    id: 'loc-1',
    name: 'Main Entrance',
    category: 'Student Facilities',
    buildingName: 'Campus Perimeter',
    buildingCode: 'GATE',
    floor: 'Ground Level',
    description: 'Primary vehicular and pedestrian access with 24/7 security and visitor reception.',
    tags: ['entrance', 'gate', 'security', 'entry', 'welcome'],
    isPopular: true,
    estimatedWalkingMinutes: 1,
    accessible: true,
  },
  {
    id: 'loc-2',
    name: 'Central Library',
    category: 'Library',
    buildingName: 'Library Complex',
    buildingCode: 'LIB',
    floor: 'Floor 1, 2 & 3',
    description: 'Three-story knowledge hub with 100k+ volumes, silent study rooms, and digital archives.',
    tags: ['library', 'books', 'study', 'quiet', 'reading', 'journals'],
    isPopular: true,
    estimatedWalkingMinutes: 3,
    accessible: true,
  },
  {
    id: 'loc-3',
    name: 'Computer Science Department',
    category: 'Academic Buildings',
    buildingName: 'Turing Computer Science Block',
    buildingCode: 'CSB',
    floor: 'Floor 1',
    roomNumber: 'CS-101',
    description: 'Academic home of Computer Science, Software Engineering, and AI research labs.',
    tags: ['cs', 'cse', 'computer science', 'coding', 'software', 'programming'],
    isPopular: true,
    estimatedWalkingMinutes: 4,
    accessible: true,
  },
  {
    id: 'loc-4',
    name: 'Advanced Computer Laboratories',
    category: 'Laboratories',
    buildingName: 'Turing Computer Science Block',
    buildingCode: 'CSB',
    floor: 'Floor 2',
    roomNumber: 'CS-204',
    description: 'GPU cluster workstations for machine learning, algorithms, and systems engineering.',
    tags: ['lab', 'computers', 'gpu', 'workstations', 'programming lab'],
    isPopular: true,
    estimatedWalkingMinutes: 5,
    accessible: true,
  },
  {
    id: 'loc-5',
    name: 'Administrative Block',
    category: 'Administrative Offices',
    buildingName: 'Central Admin Building',
    buildingCode: 'ADM',
    floor: 'Floor 1',
    roomNumber: 'AD-100',
    description: 'Campus administration headquarters, admissions, student services, and registrar.',
    tags: ['admin', 'office', 'principal', 'admissions', 'fee', 'certificates'],
    isPopular: true,
    estimatedWalkingMinutes: 2,
    accessible: true,
  },
  {
    id: 'loc-6',
    name: 'Principal Office',
    category: 'Administrative Offices',
    buildingName: 'Central Admin Building',
    buildingCode: 'ADM',
    floor: 'Floor 2',
    roomNumber: 'AD-201',
    description: 'Executive office of the College Principal and Academic Dean.',
    tags: ['principal', 'director', 'dean', 'administration', 'head'],
    isPopular: true,
    estimatedWalkingMinutes: 3,
    accessible: true,
  },
  {
    id: 'loc-7',
    name: 'Grand Auditorium',
    category: 'Academic Buildings',
    buildingName: 'Auditorium & Arts Complex',
    buildingCode: 'AUD',
    floor: 'Ground & Mezzanine',
    description: '1,500-seat acoustic auditorium for convocations, symposiums, and cultural festivals.',
    tags: ['auditorium', 'events', 'hall', 'ceremony', 'annual day'],
    isPopular: true,
    estimatedWalkingMinutes: 4,
    accessible: true,
  },
  {
    id: 'loc-8',
    name: 'Campus Canteen & Dining',
    category: 'Food & Cafeteria',
    buildingName: 'Dining Hall Complex',
    buildingCode: 'CAN',
    floor: 'Floor 1',
    description: 'Multi-cuisine campus food court offering breakfast, lunch thalis, and quick snacks.',
    tags: ['canteen', 'food', 'lunch', 'breakfast', 'tea', 'coffee', 'meals'],
    isPopular: true,
    estimatedWalkingMinutes: 3,
    accessible: true,
  },
  {
    id: 'loc-9',
    name: 'Garden Cafeteria',
    category: 'Food & Cafeteria',
    buildingName: 'Dining Hall Complex',
    buildingCode: 'CAN',
    floor: 'Floor 2 (Terrace)',
    description: 'Open-air espresso café, fresh sandwiches, smoothies, and study terrace.',
    tags: ['cafe', 'coffee', 'espresso', 'snacks', 'wifi', 'terrace'],
    isPopular: true,
    estimatedWalkingMinutes: 4,
    accessible: true,
  },
  {
    id: 'loc-10',
    name: 'Electronics Department',
    category: 'Academic Buildings',
    buildingName: 'Faraday Electronics Block',
    buildingCode: 'ECE',
    floor: 'Floor 1',
    roomNumber: 'EC-101',
    description: 'VLSI, embedded systems, robotics, and communication engineering wing.',
    tags: ['ece', 'electronics', 'hardware', 'circuits', 'robotics'],
    isPopular: false,
    estimatedWalkingMinutes: 5,
    accessible: true,
  },
  {
    id: 'loc-11',
    name: 'Mechanical Engineering Department',
    category: 'Academic Buildings',
    buildingName: 'Watt Mechanical Block',
    buildingCode: 'MEC',
    floor: 'Floor 1',
    roomNumber: 'ME-102',
    description: 'Thermal dynamics, CAD labs, machine shops, and automotive prototyping.',
    tags: ['mech', 'mechanical', 'workshop', 'automobile', 'cad'],
    isPopular: false,
    estimatedWalkingMinutes: 5,
    accessible: true,
  },
  {
    id: 'loc-12',
    name: 'Civil Engineering Department',
    category: 'Academic Buildings',
    buildingName: 'Smeaton Civil Block',
    buildingCode: 'CIV',
    floor: 'Floor 1',
    roomNumber: 'CV-101',
    description: 'Surveying labs, materials testing, structural analysis, and GIS workstations.',
    tags: ['civil', 'surveying', 'structures', 'concrete', 'gis'],
    isPopular: false,
    estimatedWalkingMinutes: 6,
    accessible: true,
  },
  {
    id: 'loc-13',
    name: 'Sports Ground & Pavilion',
    category: 'Sports Facilities',
    buildingName: 'Olympic Sports Arena',
    buildingCode: 'SPX',
    floor: 'Ground Level',
    description: '400m synthetic running track, football turf, cricket pitch, and spectator pavilion.',
    tags: ['sports', 'ground', 'football', 'cricket', 'track', 'athletics', 'fitness'],
    isPopular: true,
    estimatedWalkingMinutes: 4,
    accessible: true,
  },
  {
    id: 'loc-14',
    name: 'Campus Medical Centre',
    category: 'Administrative Offices',
    buildingName: 'Central Admin Building',
    buildingCode: 'ADM',
    floor: 'Floor 1 (West Wing)',
    roomNumber: 'AD-101',
    description: '24/7 First Aid and health clinic staffed with registered doctor and emergency nurses.',
    tags: ['medical', 'clinic', 'first aid', 'doctor', 'emergency', 'health', 'ambulance'],
    isPopular: true,
    estimatedWalkingMinutes: 2,
    accessible: true,
  },
  {
    id: 'loc-15',
    name: 'North-East Parking Area',
    category: 'Sports Facilities',
    buildingName: 'Campus Perimeter',
    buildingCode: 'PRK',
    floor: 'Ground Level',
    description: 'Two-wheeler and four-wheeler covered parking with 12 EV rapid charging stalls.',
    tags: ['parking', 'car', 'bike', 'ev', 'vehicle', 'scooter'],
    isPopular: false,
    estimatedWalkingMinutes: 2,
    accessible: true,
  },
  {
    id: 'loc-16',
    name: 'Student Hostel Complex',
    category: 'Student Facilities',
    buildingName: 'Residences Tower',
    buildingCode: 'HST',
    floor: 'Floors 1-5',
    description: 'Undergraduate student residence with recreation hall, reading room, and mess.',
    tags: ['hostel', 'dorm', 'residence', 'room', 'living'],
    isPopular: true,
    estimatedWalkingMinutes: 6,
    accessible: true,
  },
];

export interface DestinationCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  buildingCount: number;
  colorScheme: {
    bg: string;
    border: string;
    iconBg: string;
    iconColor: string;
    tagBg: string;
    tagText: string;
  };
}

export const DESTINATION_CATEGORIES: DestinationCategory[] = [
  {
    id: 'cat-1',
    name: 'Academic Buildings',
    slug: 'academic',
    iconName: 'GraduationCap',
    description: 'Classrooms, lecture halls, departmental offices, and faculty chambers.',
    buildingCount: 4,
    colorScheme: {
      bg: 'hover:bg-blue-50/60',
      border: 'hover:border-blue-300',
      iconBg: 'bg-blue-100 text-blue-600',
      iconColor: 'text-blue-600',
      tagBg: 'bg-blue-50',
      tagText: 'text-blue-700',
    },
  },
  {
    id: 'cat-2',
    name: 'Central Library',
    slug: 'library',
    iconName: 'BookOpen',
    description: 'Multi-floor study zones, digital media lab, journals, and quiet reading areas.',
    buildingCount: 1,
    colorScheme: {
      bg: 'hover:bg-cyan-50/60',
      border: 'hover:border-cyan-300',
      iconBg: 'bg-cyan-100 text-cyan-600',
      iconColor: 'text-cyan-600',
      tagBg: 'bg-cyan-50',
      tagText: 'text-cyan-700',
    },
  },
  {
    id: 'cat-3',
    name: 'Laboratories',
    slug: 'laboratories',
    iconName: 'FlaskConical',
    description: 'Computing clusters, robotics setups, physics, chemistry, and hardware testbenches.',
    buildingCount: 6,
    colorScheme: {
      bg: 'hover:bg-emerald-50/60',
      border: 'hover:border-emerald-300',
      iconBg: 'bg-emerald-100 text-emerald-600',
      iconColor: 'text-emerald-600',
      tagBg: 'bg-emerald-50',
      tagText: 'text-emerald-700',
    },
  },
  {
    id: 'cat-4',
    name: 'Administrative Offices',
    slug: 'administrative',
    iconName: 'Building2',
    description: 'Principal office, admissions desk, student welfare, exam cell, and accounts.',
    buildingCount: 1,
    colorScheme: {
      bg: 'hover:bg-slate-100/70',
      border: 'hover:border-slate-300',
      iconBg: 'bg-slate-100 text-slate-700',
      iconColor: 'text-slate-700',
      tagBg: 'bg-slate-100',
      tagText: 'text-slate-700',
    },
  },
  {
    id: 'cat-5',
    name: 'Food & Cafeteria',
    slug: 'food-cafeteria',
    iconName: 'Utensils',
    description: 'Main food pavilion, artisanal terrace coffee bar, bakery, and juice points.',
    buildingCount: 2,
    colorScheme: {
      bg: 'hover:bg-amber-50/60',
      border: 'hover:border-amber-300',
      iconBg: 'bg-amber-100 text-amber-600',
      iconColor: 'text-amber-600',
      tagBg: 'bg-amber-50',
      tagText: 'text-amber-700',
    },
  },
  {
    id: 'cat-6',
    name: 'Sports Facilities',
    slug: 'sports',
    iconName: 'Trophy',
    description: 'Athletic turf, synthetic sprint track, indoor badminton courts, gym, and arena.',
    buildingCount: 2,
    colorScheme: {
      bg: 'hover:bg-rose-50/60',
      border: 'hover:border-rose-300',
      iconBg: 'bg-rose-100 text-rose-600',
      iconColor: 'text-rose-600',
      tagBg: 'bg-rose-50',
      tagText: 'text-rose-700',
    },
  },
];

export interface CampusFeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
}

export const CAMPUS_FEATURES: CampusFeatureItem[] = [
  {
    id: 'feat-1',
    title: 'Interactive Campus Map',
    description: 'Explore high-resolution vector layout of every block, walking pathway, garden, and landmark.',
    iconName: 'Map',
    badge: 'Vector SVG',
  },
  {
    id: 'feat-2',
    title: 'Smart Location Search',
    description: 'Instant autocomplete across buildings, lecture halls, faculty offices, labs, and amenities.',
    iconName: 'Search',
    badge: 'Instant',
  },
  {
    id: 'feat-3',
    title: 'Shortest Path Navigation',
    description: 'Graph-theoretic Dijkstra & A* routing algorithms ensure the optimal route across walkways.',
    iconName: 'Route',
    badge: 'Dijkstra Engine',
  },
  {
    id: 'feat-4',
    title: 'Step-by-Step Directions',
    description: 'Turn-by-turn walking guidance with visual landmark cues and estimated arrival times.',
    iconName: 'Navigation',
    badge: 'Turn-by-Turn',
  },
  {
    id: 'feat-5',
    title: 'Nearby Facilities Discovery',
    description: 'Quickly locate restrooms, drinking water points, ATMs, cafeterias, and medical aid stations.',
    iconName: 'Compass',
    badge: 'Proximity',
  },
  {
    id: 'feat-6',
    title: 'Mobile-Friendly Navigation',
    description: 'Full touch-optimized interface tailored for fast on-the-go wayfinding on smartphones.',
    iconName: 'Smartphone',
    badge: 'Responsive',
  },
  {
    id: 'feat-7',
    title: 'Accessible Route Planning',
    description: 'Dedicated ramp-friendly and elevator-accessible routes for wheelchair users and visitors.',
    iconName: 'Accessibility',
    badge: 'Universal',
  },
  {
    id: 'feat-8',
    title: 'Favourite Destinations',
    description: 'Bookmark your daily lecture halls, favorite café, or lab for instant 1-tap route calculation.',
    iconName: 'Bookmark',
    badge: 'Personalized',
  },
];

export interface DetailedFacility {
  id: string;
  name: string;
  category: string;
  building: string;
  location: string;
  hours: string;
  phone?: string;
  iconName: string;
  highlight: string;
}

export const CAMPUS_FACILITIES_LIST: DetailedFacility[] = [
  {
    id: 'fac-1',
    name: 'Central Library & E-Resource Hub',
    category: 'Study & Research',
    building: 'Central Library (LIB)',
    location: 'Central Campus Lawn, Ground to 3rd Floor',
    hours: '08:00 AM – 10:00 PM (Daily)',
    phone: '+91 80 2345 6730',
    iconName: 'BookOpen',
    highlight: '100,000+ volumes, 24/7 Wi-Fi, quiet study pods',
  },
  {
    id: 'fac-2',
    name: 'Advanced Computing & GPU Labs',
    category: 'Laboratories',
    building: 'Computer Science Block (CSB)',
    location: '2nd Floor, Room CS-204 & CS-208',
    hours: '08:00 AM – 08:00 PM (Mon-Sat)',
    phone: '+91 80 2345 6710',
    iconName: 'Cpu',
    highlight: 'NVIDIA A100 workstation cluster, Ubuntu Linux',
  },
  {
    id: 'fac-3',
    name: 'Grand Auditorium & Arts Center',
    category: 'Events & Culture',
    building: 'Auditorium Complex (AUD)',
    location: 'North Campus Promenade',
    hours: '09:00 AM – 09:00 PM (Event Days)',
    phone: '+91 80 2345 6735',
    iconName: 'Sparkles',
    highlight: '1,500 seats, Dolby acoustics, dual seminar halls',
  },
  {
    id: 'fac-4',
    name: 'Campus Dining Pavilion & Canteen',
    category: 'Food & Dining',
    building: 'Dining Block (CAN)',
    location: 'West Campus Avenue, 1st Floor',
    hours: '07:30 AM – 09:00 PM (Daily)',
    phone: '+91 80 2345 6740',
    iconName: 'Utensils',
    highlight: 'Freshly prepared vegetarian & non-vegetarian meals',
  },
  {
    id: 'fac-5',
    name: 'Executive Seminar Hall Alpha',
    category: 'Conferences',
    building: 'Auditorium Complex (AUD)',
    location: '2nd Floor, Room SH-201',
    hours: '08:30 AM – 06:00 PM',
    phone: '+91 80 2345 6736',
    iconName: 'Presentation',
    highlight: 'Tiered 200-seat hall with 4K projection setup',
  },
  {
    id: 'fac-6',
    name: 'Olympic Sports Pavilion & Gym',
    category: 'Sports & Wellness',
    building: 'Sports Complex (SPX)',
    location: 'East Campus Avenue',
    hours: '06:00 AM – 08:30 PM (Daily)',
    phone: '+91 80 2345 6750',
    iconName: 'Trophy',
    highlight: '400m synthetic track, football pitch, fitness center',
  },
  {
    id: 'fac-7',
    name: '24/7 Campus Medical Clinic',
    category: 'Health & Safety',
    building: 'Administrative Block (ADM)',
    location: 'Ground Floor, Room AD-101',
    hours: '24 Hours Open (Emergency Care)',
    phone: '+91 80 2345 6799',
    iconName: 'HeartPulse',
    highlight: 'Resident physician, observation beds, ambulance on-site',
  },
  {
    id: 'fac-8',
    name: 'Main Parking Zone & EV Stalls',
    category: 'Mobility & Vehicles',
    building: 'North-East Perimeter (PRK)',
    location: 'Adjacent to Main Gate & East Avenue',
    hours: '24 Hours Access',
    phone: '+91 80 2345 6701',
    iconName: 'Car',
    highlight: '250+ spaces, 12 Level-2 EV charging points, CCTV',
  },
];

