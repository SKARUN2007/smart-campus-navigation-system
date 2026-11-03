'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AdvancedSearch } from '@/components/search/AdvancedSearch';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { FacilityDetailModal } from '@/components/facilities/FacilityDetailModal';
import { PopularDestinationsSection } from '@/components/facilities/PopularDestinationsSection';
import {
  CAMPUS_LOCATIONS,
  FACILITY_GROUPS,
  CAMPUS_CATEGORIES,
} from '@/data/campusLocations';
import {
  CampusCategoryType,
  CampusLocationItem,
  FacilityGroupType,
} from '@/types/campus';
import { getFavouriteIds, toggleFavouriteId } from '@/lib/storage';
import {
  Compass,
  Heart,
  Grid,
  Layers,
  Sparkles,
  MapPin,
  ArrowRight,
  FilterX,
} from 'lucide-react';

function FacilitiesContent() {
  const searchParams = useSearchParams();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<CampusCategoryType>>(new Set());
  const [selectedGroup, setSelectedGroup] = useState<FacilityGroupType | 'all' | 'favourites'>('all');
  const [favouriteIds, setFavouriteIds] = useState<string[]>([]);
  const [activeModalLocation, setActiveModalLocation] = useState<CampusLocationItem | null>(null);

  // Load favourites from localStorage on client
  useEffect(() => {
    setFavouriteIds(getFavouriteIds());
  }, []);

  // Handle URL parameters (e.g. ?location=Library or ?category=academic or ?destination=...)
  useEffect(() => {
    const locParam = searchParams.get('location') || searchParams.get('destination');
    const catParam = searchParams.get('category');

    if (locParam) {
      const match = CAMPUS_LOCATIONS.find(
        (l) =>
          l.name.toLowerCase() === locParam.toLowerCase() ||
          l.code.toLowerCase() === locParam.toLowerCase() ||
          l.id === locParam
      );
      if (match) {
        setActiveModalLocation(match);
      } else {
        setSearchQuery(locParam);
      }
    }

    if (catParam) {
      setSelectedCategories(new Set([catParam as CampusCategoryType]));
    }
  }, [searchParams]);

  // Toggle favorite handler
  const handleToggleFavourite = (id: string) => {
    const { list } = toggleFavouriteId(id);
    setFavouriteIds(list);
  };

  // Toggle category in search filter
  const handleToggleCategory = (cat: CampusCategoryType) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const handleClearFilters = () => {
    setSelectedCategories(new Set());
    setSearchQuery('');
    setSelectedGroup('all');
  };

  // Filter logic
  const filteredLocations = useMemo(() => {
    return CAMPUS_LOCATIONS.filter((loc) => {
      // 1. Group / Favourites tab filter
      if (selectedGroup === 'favourites') {
        if (!favouriteIds.includes(loc.id)) return false;
      } else if (selectedGroup !== 'all') {
        if (loc.facilityGroup !== selectedGroup) return false;
      }

      // 2. Category multi-select filter
      if (selectedCategories.size > 0 && !selectedCategories.has(loc.category)) {
        return false;
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = loc.name.toLowerCase().includes(q);
        const matchesCode = loc.code.toLowerCase().includes(q);
        const matchesBuilding = loc.buildingName.toLowerCase().includes(q);
        const matchesCategory = loc.categoryLabel.toLowerCase().includes(q);
        const matchesDesc = loc.description.toLowerCase().includes(q);
        const matchesTags = loc.tags.some((t) => t.toLowerCase().includes(q));
        const matchesFacilities = loc.facilities.some((f) => f.toLowerCase().includes(q));

        if (
          !matchesName &&
          !matchesCode &&
          !matchesBuilding &&
          !matchesCategory &&
          !matchesDesc &&
          !matchesTags &&
          !matchesFacilities
        ) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategories, selectedGroup, favouriteIds]);

  return (
    <div className="flex-1 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Hero Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>CAMPUS FACILITIES & SERVICES</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Explore Campus Facilities
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Discover all the facilities and services available across your campus. Search by department, laboratory, dining space, or administrative office and locate them on the interactive map.
          </p>
        </div>

        {/* Advanced Search & Filtering Bar */}
        <AdvancedSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategories={selectedCategories}
          onToggleCategory={handleToggleCategory}
          onClearFilters={handleClearFilters}
          totalResultsCount={filteredLocations.length}
        />

        {/* Facility Group Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-slate-200 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedGroup('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedGroup === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Facilities ({CAMPUS_LOCATIONS.length})
          </button>

          {FACILITY_GROUPS.map((group) => {
            const count = CAMPUS_LOCATIONS.filter((l) => l.facilityGroup === group.id).length;
            const isSelected = selectedGroup === group.id;

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setSelectedGroup(group.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {group.label} ({count})
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setSelectedGroup('favourites')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ml-auto ${
              selectedGroup === 'favourites'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>My Favourites ({favouriteIds.length})</span>
          </button>
        </div>

        {/* Popular Destinations Showcase (shown when not searching) */}
        {!searchQuery.trim() && selectedGroup === 'all' && selectedCategories.size === 0 && (
          <PopularDestinationsSection
            locations={CAMPUS_LOCATIONS}
            onOpenDetails={setActiveModalLocation}
          />
        )}

        {/* Directory Cards Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {selectedGroup === 'favourites'
              ? 'Your Saved Favourites'
              : selectedGroup !== 'all'
              ? FACILITY_GROUPS.find((g) => g.id === selectedGroup)?.label
              : 'Campus Directory'}
          </h2>

          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredLocations.length} locations
          </span>
        </div>

        {/* Directory Grid */}
        {filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((loc) => (
              <FacilityCard
                key={loc.id}
                location={loc}
                isFavourite={favouriteIds.includes(loc.id)}
                onToggleFavourite={handleToggleFavourite}
                onOpenDetails={setActiveModalLocation}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 sm:p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <FilterX className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-800">
              No matching campus facilities found
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
              We couldn&apos;t find any facility matching &ldquo;{searchQuery}&rdquo; with your active filters. Try searching for &ldquo;Computer&rdquo;, &ldquo;Food&rdquo;, &ldquo;Library&rdquo;, or &ldquo;Exam&rdquo;.
            </p>

            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              <span>Reset All Filters & Search</span>
            </button>
          </div>
        )}
      </div>

      {/* Facility Detail Modal */}
      {activeModalLocation && (
        <FacilityDetailModal
          location={activeModalLocation}
          onClose={() => setActiveModalLocation(null)}
          isFavourite={favouriteIds.includes(activeModalLocation.id)}
          onToggleFavourite={handleToggleFavourite}
        />
      )}
    </div>
  );
}

export default function FacilitiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-cyan-500 selection:text-white">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm pt-28">
            Loading campus directory...
          </div>
        }
      >
        <FacilitiesContent />
      </Suspense>
      <Footer />
    </div>
  );
}
