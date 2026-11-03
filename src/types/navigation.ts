export type Role = 'ADMIN' | 'STAFF' | 'STUDENT' | 'VISITOR';

export interface CampusUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  department?: string | null;
  studentId?: string | null;
}

export interface CampusCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
}

export interface CampusBuilding {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  floors: number;
  svgX: number;
  svgY: number;
  svgWidth: number;
  svgHeight: number;
  latitude?: number | null;
  longitude?: number | null;
  openingHours?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  wheelchairAccessible: boolean;
}

export interface CampusLocation {
  id: string;
  code?: string | null;
  name: string;
  description?: string | null;
  floorNumber: number;
  roomNumber?: string | null;
  categoryId: string;
  category?: CampusCategory;
  buildingId?: string | null;
  building?: CampusBuilding | null;
  navigationNodeId?: string | null;
  navigationNode?: CampusNavigationNode | null;
  isPopular: boolean;
  tags: string[];
}

export interface CampusFacility {
  id: string;
  name: string;
  description?: string | null;
  buildingId?: string | null;
  building?: CampusBuilding | null;
  categoryId: string;
  category?: CampusCategory;
  floorNumber: number;
  openingHours?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  isWheelchairAccessible: boolean;
  navigationNodeId?: string | null;
}

export interface CampusNavigationNode {
  id: string;
  label: string;
  name: string;
  x: number;
  y: number;
  latitude?: number | null;
  longitude?: number | null;
  floor: number;
  isOutdoor: boolean;
  buildingId?: string | null;
}

export interface CampusNavigationEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  distance: number; // meters
  walkingTime: number; // seconds
  isAccessible: boolean;
  isCovered: boolean;
  isPathAvailable: boolean;
  pathwayType: string;
  instruction?: string | null;
}

export interface RouteInstruction {
  step: number;
  instruction: string;
  distanceMeters: number;
  timeSeconds: number;
  fromNodeName: string;
  toNodeName: string;
  pathwayType: string;
  isAccessible: boolean;
}

export interface RouteCalculationResult {
  success: boolean;
  message?: string;
  nodes: CampusNavigationNode[];
  edges: CampusNavigationEdge[];
  totalDistanceMeters: number;
  totalTimeSeconds: number;
  instructions: RouteInstruction[];
  isAccessibleRoute: boolean;
}

