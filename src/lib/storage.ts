'use client';

const RECENT_SEARCHES_KEY = 'campus_recent_searches';
const FAVOURITES_KEY = 'campus_favourite_locations';

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse recent searches:', e);
    return [];
  }
}

export function saveRecentSearch(query: string): string[] {
  if (typeof window === 'undefined' || !query.trim()) return [];
  try {
    const existing = getRecentSearches();
    const trimmed = query.trim();
    // remove duplicates and put newest first
    const updated = [trimmed, ...existing.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save recent search:', e);
    return [];
  }
}

export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (e) {
    console.error('Failed to clear recent searches:', e);
  }
}

export function getFavouriteIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVOURITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse favourites:', e);
    return [];
  }
}

export function toggleFavouriteId(id: string): { isFav: boolean; list: string[] } {
  if (typeof window === 'undefined') return { isFav: false, list: [] };
  try {
    const existing = getFavouriteIds();
    let updated: string[];
    let isFav = false;
    if (existing.includes(id)) {
      updated = existing.filter((item) => item !== id);
      isFav = false;
    } else {
      updated = [...existing, id];
      isFav = true;
    }
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(updated));
    return { isFav, list: updated };
  } catch (e) {
    console.error('Failed to toggle favourite:', e);
    return { isFav: false, list: [] };
  }
}
