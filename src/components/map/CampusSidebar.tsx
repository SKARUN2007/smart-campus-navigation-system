'use client';

import React, { useState } from 'react';
import {
  Search,
  X,
  MapPin,
  Building2,
  Filter,
  Sparkles,
  ChevronRight,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import {
  CAMPUS_CATEGORIES,
  CAMPUS_LOCATIONS,
  CAMPUS_BUILDINGS,
} from '@/data/campusLocations';
import {
  BuildingData,
  CampusCategoryType,
  CampusLocationItem,
} from '@/types/campus';

export interface CampusSidebarProps {
  selectedLocation: CampusLocationItem | null;
  selectedBuilding: BuildingData | null;
  activeCategories: Set<CampusCategoryType>;
  onToggleCategory: (category: CampusCategoryType) => void;
  onSelectLocation: (location: CampusLocationItem) => void;
  onSelectBuilding: (building: BuildingData) => void;
  onClearFilters: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const CampusSidebar: React.FC<CampusSidebarProps> = ({
  selectedLocation,
  selectedBuilding,
  activeCategories,
  onToggleCategory,
  onSelectLocation,
  onSelectBuilding,
  onClearFilters,
  isMobileOpen,
  onCloseMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'categories' | 'popular'>('all');

  // Filter locations by search query and active categories
  const filteredLocations = CAMPUS_LOCATIONS.filter((loc) => {
    const matchesCategory =
      activeCategories.size === 0 || activeCategories.has(loc.category);
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.buildingName.toLowerCase().includes(q) ||
      loc.code.toLowerCase().includes(q) ||
      loc.categoryLabel.toLowerCase().includes(q) ||
      loc.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const popularLocations = CAMPUS_LOCATIONS.filter((l) => l.isPopular);

  return (
    <aside
      className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-80 sm:w-96 bg-white border-r border-slate-200/90 shadow-xl lg:shadow-none flex flex-col transition-transform duration-300 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Sidebar Header & Brand Return Link */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
            Phase 3 Active
          </span>
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-4 border-b border-slate-100">
        <div className="relative flex items-center bg-slate-100/90 hover:bg-slate-100 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campus buildings, labs, gates..."
            className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Places ({filteredLocations.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              activeTab === 'categories'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Filter By Type
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('popular')}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              activeTab === 'popular'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Popular
          </button>
        </div>
      </div>

      {/* Active Category Filters Bar */}
      {activeCategories.size > 0 && (
        <div className="px-4 py-2 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between text-xs">
          <span className="font-semibold text-blue-800">
            Filtering {activeCategories.size} categor{activeCategories.size === 1 ? 'y' : 'ies'}
          </span>
          <button
            type="button"
            onClick={onClearFilters}
            className="text-[11px] font-bold text-blue-600 hover:underline"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Content Area based on Tab */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {/* TAB 1: ALL LOCATIONS LIST */}
        {activeTab === 'all' && (
          <div>
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc) => {
                const isSelected = selectedLocation?.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => {
                      onSelectLocation(loc);
                      onCloseMobile();
                    }}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                      isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {loc.name}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                          {loc.code}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {loc.buildingName} • {loc.floor}
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-2" />
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-500">
                <MapPin className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-700">No matching campus places</p>
                <p className="text-xs text-slate-400 mt-1">
                  Try clearing the category filters or searching another keyword.
                </p>
                {activeCategories.size > 0 && (
                  <button
                    type="button"
                    onClick={onClearFilters}
                    className="mt-3 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-600 rounded-lg"
                  >
                    Reset Active Filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CATEGORY FILTERS */}
        {activeTab === 'categories' && (
          <div className="p-4 space-y-2">
            <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center justify-between">
              <span>Toggle Campus Categories:</span>
              <button
                type="button"
                onClick={onClearFilters}
                className="text-[11px] text-blue-600 font-bold hover:underline"
              >
                Show All
              </button>
            </div>

            {CAMPUS_CATEGORIES.map((cat) => {
              const isActive = activeCategories.has(cat.id);
              const count = CAMPUS_LOCATIONS.filter((l) => l.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onToggleCategory(cat.id)}
                  className={`w-full px-3 py-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full border shrink-0"
                      style={{
                        backgroundColor: cat.color,
                        borderColor: cat.borderColor,
                      }}
                    />
                    <span>{cat.label}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count} places
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* TAB 3: POPULAR DESTINATIONS */}
        {activeTab === 'popular' && (
          <div className="p-2 space-y-1">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Most Visited Campus Landmarks
            </div>
            {popularLocations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => {
                  onSelectLocation(loc);
                  onCloseMobile();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50/70 flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                      {loc.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {loc.categoryLabel}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70 text-xs text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <span>{CAMPUS_BUILDINGS.length} Buildings</span>
        </span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-cyan-600" />
          <span>{CAMPUS_LOCATIONS.length} Waypoints</span>
        </span>
      </div>
    </aside>
  );
};
