'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  History,
  Trash2,
  Sparkles,
  Filter,
  Check,
  MapPin,
  Building2,
  ArrowRight,
} from 'lucide-react';
import {
  CAMPUS_CATEGORIES,
  CAMPUS_LOCATIONS,
} from '@/data/campusLocations';
import { CampusCategoryType, CampusLocationItem } from '@/types/campus';
import {
  getRecentSearches,
  saveRecentSearch,
  clearRecentSearches,
} from '@/lib/storage';

export interface AdvancedSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: Set<CampusCategoryType>;
  onToggleCategory: (category: CampusCategoryType) => void;
  onClearFilters: () => void;
  totalResultsCount: number;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onToggleCategory,
  onClearFilters,
  totalResultsCount,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Close recent searches dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      const updated = saveRecentSearch(searchQuery.trim());
      setRecentSearches(updated);
      setIsFocused(false);
    }
  };

  const handleSelectRecent = (term: string) => {
    onSearchChange(term);
    const updated = saveRecentSearch(term);
    setRecentSearches(updated);
    setIsFocused(false);
  };

  const handleClearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearRecentSearches();
    setRecentSearches([]);
  };

  // Quick Autocomplete items based on current search query
  const autocompleteSuggestions = searchQuery.trim()
    ? CAMPUS_LOCATIONS.filter((loc) => {
        const q = searchQuery.toLowerCase();
        return (
          loc.name.toLowerCase().includes(q) ||
          loc.tags.some((t) => t.toLowerCase().includes(q))
        );
      }).slice(0, 4)
    : [];

  return (
    <div ref={containerRef} className="w-full space-y-4 mb-8">
      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="relative z-30">
        <div className="relative flex items-center bg-white rounded-2xl shadow-card border border-slate-200/90 hover:border-blue-400 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all p-2 sm:p-2.5">
          <div className="pl-3 pr-2 text-blue-600 flex items-center justify-center">
            <Search className="w-5 h-5 stroke-[2.2]" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setIsFocused(true);
            }}
            onFocus={() => setIsFocused(true)}
            placeholder="Search buildings, departments, classrooms and facilities…"
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-800 placeholder-slate-400 px-2 py-1.5 focus:outline-none"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors mr-1"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-1.5 active:scale-[0.98]"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4 hidden sm:inline-block" />
          </button>
        </div>

        {/* Dropdown: Recent Searches & Instant Autocomplete */}
        {isFocused && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-40 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {/* 1. Live Autocomplete results if typing */}
            {searchQuery.trim() && autocompleteSuggestions.length > 0 && (
              <div className="p-2">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Suggested Matches</span>
                </div>
                {autocompleteSuggestions.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectRecent(loc.name)}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50/80 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-600">
                        {loc.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {loc.categoryLabel}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* 2. Recent Search History */}
            {recentSearches.length > 0 && (
              <div className="p-2">
                <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-slate-400" />
                    <span>Recent Searches</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="text-[10px] font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 hover:underline"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear History</span>
                  </button>
                </div>
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectRecent(term)}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center justify-between text-xs text-slate-700 group transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <History className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                      <span>{term}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-600">
                      Search again →
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Quick Keyword Tips */}
            <div className="px-4 py-2.5 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Tip: Try searching &ldquo;Computer&rdquo;, &ldquo;Library&rdquo;, &ldquo;Food&rdquo;, or &ldquo;Exam&rdquo;</span>
              <span className="font-mono text-[11px] text-slate-400">ESC to close</span>
            </div>
          </div>
        )}
      </form>

      {/* Multi-Category Filters Scroll / Wrap Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>

          {/* "All Locations" pill */}
          <button
            type="button"
            onClick={onClearFilters}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
              selectedCategories.size === 0
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            All Locations
          </button>

          {/* Category Pills */}
          {CAMPUS_CATEGORIES.map((cat) => {
            const isSelected = selectedCategories.has(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onToggleCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: isSelected ? '#ffffff' : cat.color,
                  }}
                />
                <span>{cat.label}</span>
                {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>

        {/* Clear Filters & Count Indicator */}
        <div className="flex items-center gap-3 shrink-0 text-xs">
          {selectedCategories.size > 0 && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Reset Filters ({selectedCategories.size})
            </button>
          )}

          <span className="font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            {totalResultsCount} {totalResultsCount === 1 ? 'place' : 'places'} found
          </span>
        </div>
      </div>
    </div>
  );
};

