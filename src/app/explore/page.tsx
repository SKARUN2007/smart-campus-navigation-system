'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { CampusSidebar } from '@/components/map/CampusSidebar';
import { CampusMap } from '@/components/map/CampusMap';
import {
  BuildingData,
  CampusCategoryType,
  CampusLocationItem,
} from '@/types/campus';
import {
  CAMPUS_BUILDINGS,
  CAMPUS_LOCATIONS,
} from '@/data/campusLocations';
import { Menu, MapPin, Sparkles, Navigation } from 'lucide-react';

function ExploreMapContent() {
  const searchParams = useSearchParams();
  const [selectedLocation, setSelectedLocation] = useState<CampusLocationItem | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingData | null>(null);
  const [activeCategories, setActiveCategories] = useState<Set<CampusCategoryType>>(new Set());
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Read initial query params from URL
  useEffect(() => {
    const locParam = searchParams.get('location') || searchParams.get('destination') || searchParams.get('query');
    const catParam = searchParams.get('category');

    if (locParam) {
      const match = CAMPUS_LOCATIONS.find(
        (l) =>
          l.name.toLowerCase() === locParam.toLowerCase() ||
          l.id.toLowerCase() === locParam.toLowerCase() ||
          l.code.toLowerCase() === locParam.toLowerCase()
      );
      if (match) {
        setSelectedLocation(match);
        const parentBldg = CAMPUS_BUILDINGS.find((b) => b.id === match.buildingId);
        if (parentBldg) setSelectedBuilding(parentBldg);
      }
    }

    if (catParam) {
      setActiveCategories(new Set([catParam as CampusCategoryType]));
    }
  }, [searchParams]);

  const handleToggleCategory = (cat: CampusCategoryType) => {
    setActiveCategories((prev) => {
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
    setActiveCategories(new Set());
  };

  return (
    <div className="flex-1 flex flex-col pt-16 sm:pt-20 overflow-hidden relative">
      {/* Top Mobile Bar */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between z-20 shadow-xs">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors"
        >
          <Menu className="w-4 h-4 text-blue-600" />
          <span>Search & Filters</span>
        </button>

        <div className="flex items-center gap-2">
          {selectedLocation ? (
            <span className="text-xs font-bold text-blue-600 truncate max-w-[180px]">
              {selectedLocation.name}
            </span>
          ) : (
            <span className="text-xs text-slate-500">Tap any building on map</span>
          )}
        </div>
      </div>

      {/* Main Map + Sidebar Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <CampusSidebar
          selectedLocation={selectedLocation}
          selectedBuilding={selectedBuilding}
          activeCategories={activeCategories}
          onToggleCategory={handleToggleCategory}
          onSelectLocation={(loc) => {
            setSelectedLocation(loc);
            const parent = CAMPUS_BUILDINGS.find((b) => b.id === loc.buildingId);
            setSelectedBuilding(parent || null);
          }}
          onSelectBuilding={(bldg) => {
            setSelectedBuilding(bldg);
            const primaryLoc = CAMPUS_LOCATIONS.find((l) => l.buildingId === bldg.id);
            setSelectedLocation(primaryLoc || null);
          }}
          onClearFilters={handleClearFilters}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Center Interactive SVG Map Engine */}
        <div className="flex-1 relative h-full">
          <CampusMap
            selectedLocation={selectedLocation}
            selectedBuilding={selectedBuilding}
            activeCategories={activeCategories}
            onSelectLocation={setSelectedLocation}
            onSelectBuilding={setSelectedBuilding}
            onGetDirections={(target) => {
              console.log('Navigate to:', target);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 overflow-hidden">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
            Loading interactive campus map...
          </div>
        }
      >
        <ExploreMapContent />
      </Suspense>
    </div>
  );
}

