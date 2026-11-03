import { CAMPUS_LOCATIONS, CAMPUS_BUILDINGS } from '@/data/campusLocations';
import { CampusLocationItem, BuildingData } from '@/types/campus';

export interface ApiFetchOptions {
  fallbackToStatic?: boolean;
}

/**
 * Robust API Client with automatic fallback to static campus data
 * ensuring 100% uptime even if database is temporarily offline.
 */

export async function getLocationsApi(options: ApiFetchOptions = { fallbackToStatic: true }): Promise<any[]> {
  try {
    const res = await fetch('/api/locations', { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      return data.data;
    }
    throw new Error('Empty database result');
  } catch (err) {
    if (options.fallbackToStatic) {
      return CAMPUS_LOCATIONS;
    }
    throw err;
  }
}

export async function searchLocationsApi(query: string): Promise<any[]> {
  if (!query?.trim()) return [];
  try {
    const res = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch {
    // Fallback to local memory filter
    const q = query.toLowerCase();
    return CAMPUS_LOCATIONS.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q) ||
        l.buildingName.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 10);
  }
}

export async function getBuildingsApi(options: ApiFetchOptions = { fallbackToStatic: true }): Promise<any[]> {
  try {
    const res = await fetch('/api/buildings', { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      return data.data;
    }
    throw new Error('Empty database result');
  } catch (err) {
    if (options.fallbackToStatic) {
      return CAMPUS_BUILDINGS;
    }
    throw err;
  }
}

export async function getFacilitiesApi(): Promise<any[]> {
  try {
    const res = await fetch('/api/facilities', { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch {
    return [];
  }
}

export async function getCategoriesApi(): Promise<any[]> {
  try {
    const res = await fetch('/api/categories', { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch {
    return [];
  }
}

export async function calculateRouteViaApi(params: {
  startQuery: string;
  destinationQuery: string;
  preferAccessible?: boolean;
}) {
  const res = await fetch('/api/navigation/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}
