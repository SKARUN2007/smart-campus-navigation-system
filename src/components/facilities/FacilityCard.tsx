'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Navigation,
  Heart,
  Clock,
  Building2,
  ArrowRight,
  Sparkles,
  Info,
  Accessibility,
  LucideIcon,
  GraduationCap,
  FlaskConical,
  BookOpen,
  Utensils,
  Trophy,
  HeartPulse,
  Car,
  Home,
  DoorOpen,
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

export interface FacilityCardProps {
  location: CampusLocationItem;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => void;
  onOpenDetails: (location: CampusLocationItem) => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  location,
  isFavourite,
  onToggleFavourite,
  onOpenDetails,
}) => {
  const IconComponent = categoryIconMap[location.category] || MapPin;

  return (
    <div className="group relative bg-white rounded-2xl p-6 border border-slate-200/90 shadow-subtle hover:shadow-elevation transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      <div>
        {/* Top Header: Category Pill & Favourite Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs">
              <IconComponent className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {location.categoryLabel}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavourite(location.id);
            }}
            className={`p-2 rounded-xl border transition-colors ${
              isFavourite
                ? 'bg-rose-50 border-rose-200 text-rose-500'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
            title={isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
            aria-label="Toggle favourite"
          >
            <Heart className={`w-4 h-4 ${isFavourite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Location Title & Building Code */}
        <div className="cursor-pointer" onClick={() => onOpenDetails(location)}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {location.name}
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0 font-semibold">
              {location.buildingCode}
            </span>
          </div>

          {/* Description */}
          <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-2">
            {location.description}
          </p>
        </div>

        {/* Building & Operational Details */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
          <div className="flex items-start gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span className="truncate">
              {location.buildingName} • {location.floor}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="text-[11px] truncate">{location.hours}</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <Accessibility className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
            <span className="text-[11px]">Ramp & Elevator Accessible</span>
          </div>
        </div>

        {/* Quick Facility Tags */}
        {location.facilities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {location.facilities.slice(0, 3).map((fac, i) => (
              <span
                key={i}
                className="text-[10px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200/60"
              >
                {fac}
              </span>
            ))}
            {location.facilities.length > 3 && (
              <span className="text-[10px] text-slate-400 font-medium px-1">
                +{location.facilities.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
        <Link
          href={`/explore?location=${encodeURIComponent(location.name)}`}
          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all active:scale-[0.98]"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>View on Map</span>
        </Link>

        <button
          type="button"
          onClick={() => onOpenDetails(location)}
          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>Details</span>
        </button>
      </div>
    </div>
  );
};

