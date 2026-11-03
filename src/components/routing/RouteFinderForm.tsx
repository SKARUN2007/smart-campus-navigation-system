'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  ArrowUpDown,
  Search,
  X,
  Crosshair,
  Accessibility,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { CAMPUS_LOCATIONS } from '@/data/campusLocations';
import { CampusLocationItem } from '@/types/campus';

export interface RouteFinderFormProps {
  startLocation: CampusLocationItem | null;
  destinationLocation: CampusLocationItem | null;
  onSelectStart: (location: CampusLocationItem | null) => void;
  onSelectDestination: (location: CampusLocationItem | null) => void;
  onSwapLocations: () => void;
  preferAccessible: boolean;
  onToggleAccessible: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export const RouteFinderForm: React.FC<RouteFinderFormProps> = ({
  startLocation,
  destinationLocation,
  onSelectStart,
  onSelectDestination,
  onSwapLocations,
  preferAccessible,
  onToggleAccessible,
  onSubmit,
  isLoading = false,
  errorMessage,
}) => {
  const [startQuery, setStartQuery] = useState(startLocation?.name || '');
  const [destQuery, setDestQuery] = useState(destinationLocation?.name || '');
  const [activeDropdown, setActiveDropdown] = useState<'start' | 'dest' | null>(null);
  const [geoLocating, setGeoLocating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state if props change externally
  useEffect(() => {
    setStartQuery(startLocation?.name || '');
  }, [startLocation]);

  useEffect(() => {
    setDestQuery(destinationLocation?.name || '');
  }, [destinationLocation]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter locations for start
  const filteredStarts = CAMPUS_LOCATIONS.filter((l) => {
    if (!startQuery.trim()) return true;
    const q = startQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q) ||
      l.buildingName.toLowerCase().includes(q) ||
      l.tags.some((t) => t.toLowerCase().includes(q))
    );
  }).slice(0, 5);

  // Filter locations for destination
  const filteredDests = CAMPUS_LOCATIONS.filter((l) => {
    if (!destQuery.trim()) return true;
    const q = destQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q) ||
      l.buildingName.toLowerCase().includes(q) ||
      l.tags.some((t) => t.toLowerCase().includes(q))
    );
  }).slice(0, 5);

  const handleUseCurrentLocation = () => {
    setGeoLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Default browser location simulates closest campus entrance
          const gate = CAMPUS_LOCATIONS.find((l) => l.code === 'LOC-GATE') || CAMPUS_LOCATIONS[0];
          onSelectStart(gate);
          setStartQuery(gate.name);
          setGeoLocating(false);
          setActiveDropdown(null);
        },
        () => {
          // If denied, fallback to Main Entrance gracefully
          const gate = CAMPUS_LOCATIONS.find((l) => l.code === 'LOC-GATE') || CAMPUS_LOCATIONS[0];
          onSelectStart(gate);
          setStartQuery(gate.name);
          setGeoLocating(false);
          setActiveDropdown(null);
        },
        { timeout: 5000 }
      );
    } else {
      const gate = CAMPUS_LOCATIONS.find((l) => l.code === 'LOC-GATE') || CAMPUS_LOCATIONS[0];
      onSelectStart(gate);
      setStartQuery(gate.name);
      setGeoLocating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveDropdown(null);
    onSubmit();
  };

  return (
    <div ref={containerRef} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form Inputs Container */}
        <div className="relative space-y-3">
          {/* 1. STARTING LOCATION INPUT */}
          <div className="relative">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                <span>Starting Point</span>
              </span>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={geoLocating}
                className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 normal-case tracking-normal"
              >
                <Crosshair className="w-3 h-3 text-blue-500 animate-spin-slow" />
                <span>{geoLocating ? 'Locating...' : 'Use Main Gate'}</span>
              </button>
            </label>

            <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all p-1.5">
              <MapPin className="w-4 h-4 text-emerald-600 ml-2.5 shrink-0" />
              <input
                type="text"
                value={startQuery}
                onChange={(e) => {
                  setStartQuery(e.target.value);
                  setActiveDropdown('start');
                }}
                onFocus={() => setActiveDropdown('start')}
                placeholder="Choose starting location (e.g. Main Entrance)"
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 px-2.5 py-1.5 focus:outline-none"
              />
              {startQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setStartQuery('');
                    onSelectStart(null);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 mr-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Start Autocomplete Suggestions */}
            {activeDropdown === 'start' && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Starting Point
                </div>
                {filteredStarts.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => {
                      onSelectStart(loc);
                      setStartQuery(loc.name);
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/60 flex items-center justify-between text-xs group transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-800 group-hover:text-emerald-700">
                        {loc.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {loc.buildingName} • {loc.floor}
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {loc.buildingCode}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Swap Locations Button (Floating between the two fields) */}
          <div className="flex justify-center -my-1 relative z-10">
            <button
              type="button"
              onClick={onSwapLocations}
              className="p-1.5 rounded-full bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 shadow-xs hover:scale-105 transition-all"
              title="Swap Starting Location & Destination"
              aria-label="Swap locations"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. DESTINATION INPUT */}
          <div className="relative">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200" />
                <span>Destination</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Where to?</span>
            </label>

            <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 focus-within:bg-white focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/10 transition-all p-1.5">
              <Navigation className="w-4 h-4 text-rose-600 ml-2.5 shrink-0" />
              <input
                type="text"
                value={destQuery}
                onChange={(e) => {
                  setDestQuery(e.target.value);
                  setActiveDropdown('dest');
                }}
                onFocus={() => setActiveDropdown('dest')}
                placeholder="Where do you want to go? (e.g. Turing CS Block)"
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 px-2.5 py-1.5 focus:outline-none"
              />
              {destQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setDestQuery('');
                    onSelectDestination(null);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 mr-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Destination Autocomplete Suggestions */}
            {activeDropdown === 'dest' && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Destination
                </div>
                {filteredDests.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => {
                      onSelectDestination(loc);
                      setDestQuery(loc.name);
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-rose-50/60 flex items-center justify-between text-xs group transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-800 group-hover:text-rose-700">
                        {loc.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {loc.buildingName} • {loc.floor}
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {loc.buildingCode}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Wheelchair Accessible Preference Toggle */}
        <div className="pt-1 flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
          <label
            htmlFor="accessible-toggle"
            className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Accessibility className="w-4 h-4" />
            </div>
            <div>
              <span className="block leading-tight">Prefer Wheelchair Accessible</span>
              <span className="text-[10px] font-normal text-slate-500">
                Prioritize step-free ramps & elevators
              </span>
            </div>
          </label>

          <input
            id="accessible-toggle"
            type="checkbox"
            checked={preferAccessible}
            onChange={onToggleAccessible}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
          />
        </div>

        {/* Inline Error Message */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Button: Find Route */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
        >
          <Navigation className="w-4 h-4 fill-white" />
          <span>{isLoading ? 'Calculating Shortest Path...' : 'Find Route'}</span>
        </button>
      </form>
    </div>
  );
};

