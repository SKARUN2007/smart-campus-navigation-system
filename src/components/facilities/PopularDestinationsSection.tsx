'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MapPin,
  ArrowRight,
  GraduationCap,
  Building2,
  FlaskConical,
  BookOpen,
  Utensils,
  Trophy,
  HeartPulse,
  Car,
  Home,
  DoorOpen,
  LucideIcon,
} from 'lucide-react';
import { CampusLocationItem } from '@/types/campus';

const categoryIconMap: Record<string, LucideIcon> = {
  academic: GraduationCap,
  administrative: Building2,
  laboratories: FlaskConical,
  library: BookOpen,
  food: Utensils,
  sports: Trophy,
  medical: HeartPulse,
  parking: Car,
  hostel: Home,
  restrooms: DoorOpen,
  entrance: DoorOpen,
};

export interface PopularDestinationsSectionProps {
  locations: CampusLocationItem[];
  onOpenDetails: (location: CampusLocationItem) => void;
}

export const PopularDestinationsSection: React.FC<PopularDestinationsSectionProps> = ({
  locations,
  onOpenDetails,
}) => {
  // Top 6 popular locations sorted by popularity
  const topPopular = [...locations]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 6);

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">
              CAMPUS HIGHLIGHTS
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Popular Campus Destinations
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
          Frequently visited by students and faculty
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topPopular.map((loc) => {
          const IconComponent = categoryIconMap[loc.category] || MapPin;

          return (
            <div
              key={loc.id}
              className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-subtle hover:shadow-elevation transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div className="flex items-start gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-xs">
                  <IconComponent className="w-5 h-5 stroke-[2]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {loc.categoryLabel}
                    </span>
                    <span className="text-[10px] text-cyan-600 font-semibold flex items-center gap-0.5 ml-auto">
                      <Sparkles className="w-3 h-3" />
                      {loc.popularity}%
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {loc.name}
                  </h3>

                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {loc.buildingName} • {loc.floor}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onOpenDetails(loc)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Quick Info
                </button>

                <Link
                  href={`/explore?location=${encodeURIComponent(loc.name)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 group/link"
                >
                  <span>View Location</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
