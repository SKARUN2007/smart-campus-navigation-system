export type CampusCategoryType =
  | 'academic'
  | 'administrative'
  | 'laboratories'
  | 'library'
  | 'food'
  | 'sports'
  | 'medical'
  | 'parking'
  | 'hostel'
  | 'entrance';

export interface CampusCategoryMeta {
  id: CampusCategoryType;
  label: string;
  color: string;
  bgLight: string;
  borderColor: string;
  textColor: string;
  iconName: string;
}

export interface BuildingData {
  id: string;
  code: string;
  name: string;
  category: CampusCategoryType;
  categoryLabel: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  floors: number;
  openingHours: string;
  contactPhone?: string;
  contactEmail?: string;
  facilities: string[];
  accessible: boolean;
  color: string;
  strokeColor: string;
  labelX?: number;
  labelY?: number;
}

export interface CampusLocationItem {
  id: string;
  name: string;
  code: string;
  category: CampusCategoryType;
  categoryLabel: string;
  buildingId: string;
  buildingName: string;
  floor: string;
  roomNumber?: string;
  description: string;
  facilities: string[];
  tags: string[];
  isPopular: boolean;
  markerX: number;
  markerY: number;
  hours: string;
  phone?: string;
  accessible: boolean;
}

export interface CampusNode {
  id: string;
  name: string;
  x: number;
  y: number;
  category?: string;
  buildingId?: string;
  locationId?: string;
}

export interface CampusEdge {
  id: string;
  from: string;
  to: string;
  distance: number; // in meters
  accessible: boolean;
  available: boolean;
  pathwayType: 'WALKWAY' | 'ROAD' | 'RAMP' | 'CORRIDOR';
  label?: string;
}

export interface MapViewport {
  zoom: number;
  panX: number;
  panY: number;
}
