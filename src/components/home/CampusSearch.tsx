'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  ArrowRight,
  X,
  Compass,
  Footprints,
  Sparkles,
  Building2,
} from 'lucide-react';
import { SAMPLE_LOCATIONS, SampleLocation } from '@/data/sampleCampusData';

export interface CampusSearchProps {
  className?: string;
}

export const CampusSearch: React.FC<CampusSearchProps> = ({ className = '' }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter locations based on query
  const filteredLocations = query.trim()
    ? SAMPLE_LOCATIONS.filter((loc) => {
        const q = query.toLowerCase();
        return (
          loc.name.toLowerCase().includes(q) ||
          loc.buildingName.toLowerCase().includes(q) ||
          loc.category.toLowerCase().includes(q) ||
          loc.buildingCode.toLowerCase().includes(q) ||
          loc.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      }).slice(0, 5)
    : [];

  // Popular quick suggestions
  const quickSuggestions = [
    'Main Entrance',
    'Central Library',
    'Computer Science Department',
    'Administrative Block',
    'Grand Auditorium',
    'Campus Canteen',
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (loc: SampleLocation) => {
    setQuery(loc.name);
    setIsOpen(false);
    router.push(`/map?destination=${encodeURIComponent(loc.name)}&id=${loc.id}`);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    if (filteredLocations.length > 0 && selectedIdx >= 0) {
      handleSelectLocation(filteredLocations[selectedIdx]);
    } else if (filteredLocations.length > 0) {
      handleSelectLocation(filteredLocations[0]);
    } else {
      router.push(`/map?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredLocations.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((prev) => (prev < filteredLocations.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((prev) => (prev > 0 ? prev - 1 : filteredLocations.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Bar Input Container */}
      <form onSubmit={handleSearchSubmit} className="relative z-30">
        <div className="relative flex items-center bg-white rounded-2xl shadow-elevation border border-slate-200/90 hover:border-blue-400 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all p-1.5 sm:p-2">
          <div className="pl-3.5 pr-2 text-slate-600 flex items-center justify-center">
            <Search className="w-5 h-5 text-blue-600" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIdx(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Where would you like to go? (e.g. Library, CS Lab, Principal Office)"
            className="w-full bg-transparent text-slate-800 placeholder-slate-600 text-sm sm:text-base font-medium px-2 py-2 focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-600 hover:bg-slate-100 transition-colors mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 active:scale-[0.98]"
          >
            <span>Find Route</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim() !== '' && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-40 divide-y divide-slate-100 animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="px-4 py-2.5 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Locations matching &ldquo;{query}&rdquo;</span>
            <span className="text-[11px] text-slate-600">Use ↑↓ keys to navigate</span>
          </div>

          {filteredLocations.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {filteredLocations.map((loc, idx) => {
                const isSelected = idx === selectedIdx;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectLocation(loc)}
                    onMouseEnter={() => setSelectedIdx(idx)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                      isSelected ? 'bg-blue-50/80 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 truncate">
                          {loc.name}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                          {loc.category}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {loc.buildingName} ({loc.floor})
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md">
                        <Footprints className="w-3 h-3" />
                        ~{loc.estimatedWalkingMinutes} min
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center">
              <Compass className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No exact matches found</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching by department name, building code, or facility type.
              </p>
            </div>
          )}

          <div className="p-3 bg-slate-50 text-center">
            <button
              type="button"
              onClick={() => router.push(`/map?query=${encodeURIComponent(query)}`)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <span>Explore all search results on Campus Map</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Suggested Quick Destination Chips */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> Popular:
        </span>
        {quickSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => {
              setQuery(suggestion);
              setIsOpen(true);
            }}
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-300 shadow-2xs transition-all active:scale-95"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
