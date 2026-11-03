'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  MapPin,
  Navigation,
  Heart,
  Clock,
  Phone,
  Building2,
  Accessibility,
  CheckCircle2,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';
import { CampusLocationItem } from '@/types/campus';

export interface FacilityDetailModalProps {
  location: CampusLocationItem | null;
  onClose: () => void;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => void;
}

export const FacilityDetailModal: React.FC<FacilityDetailModalProps> = ({
  location,
  onClose,
  isFavourite,
  onToggleFavourite,
}) => {
  const [copied, setCopied] = useState(false);

  if (!location) return null;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/facilities?location=${encodeURIComponent(location.name)}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-400/30">
              {location.categoryLabel}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {location.buildingCode}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            {location.name}
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              {location.buildingName}
            </span>
            <span>•</span>
            <span>{location.floor}</span>
            {location.roomNumber && (
              <>
                <span>•</span>
                <span>Room {location.roomNumber}</span>
              </>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* About / Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Facility Description
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              {location.description}
            </p>
          </div>

          {/* Operational Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">Operational Hours</span>
                <span className="text-slate-600">{location.hours}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">Contact Desk</span>
                <span className="text-slate-600 font-mono">{location.phone || '+91 80 2345 6701'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">Location Coordinates</span>
                <span className="text-slate-600">SVG ({location.markerX}, {location.markerY})</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Accessibility className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">Accessibility</span>
                <span className="text-slate-600">Wheelchair ramps & elevators available</span>
              </div>
            </div>
          </div>

          {/* Available Services */}
          {location.services && location.services.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Available Services & Functions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {location.services.map((srv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-slate-700 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{srv}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facilities List */}
          {location.facilities.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Amenities & Equipment
              </h3>
              <div className="flex flex-wrap gap-2">
                {location.facilities.map((fac, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200/70"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{fac}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mini Campus Location Visual Preview */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Campus Position Map Preview
            </h3>
            <div className="relative aspect-[16/6] w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
              <svg viewBox="0 0 1200 850" className="w-full h-full">
                {/* Campus Perimeter */}
                <rect x="50" y="50" width="1100" height="750" rx="20" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="4" />
                {/* Main Walkway Spine */}
                <line x1="600" y1="780" x2="600" y2="180" stroke="#cbd5e1" strokeWidth="18" strokeLinecap="round" />
                <line x1="300" y1="420" x2="900" y2="420" stroke="#cbd5e1" strokeWidth="14" strokeLinecap="round" />
                <circle cx="600" cy="480" r="60" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="3" />

                {/* Pinpoint Location Marker */}
                <circle cx={location.markerX} cy={location.markerY} r="36" fill="#06b6d4" opacity="0.3" className="animate-ping" />
                <circle cx={location.markerX} cy={location.markerY} r="18" fill="#0284c7" stroke="#ffffff" strokeWidth="4" />
                <circle cx={location.markerX} cy={location.markerY} r="6" fill="#ffffff" />
              </svg>
              <div className="absolute bottom-2 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-semibold">
                Pinpoint: {location.name}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onToggleFavourite(location.id)}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                isFavourite
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavourite ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isFavourite ? 'Saved in Favourites' : 'Add to Favourites'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              title="Share link"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href={`/routes?destination=${encodeURIComponent(location.name)}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs transition-colors"
            >
              <Navigation className="w-4 h-4 text-blue-600" />
              <span>Get Directions</span>
            </Link>

            <Link
              href={`/explore?location=${encodeURIComponent(location.name)}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-[0.98]"
            >
              <MapPin className="w-4 h-4" />
              <span>View on Campus Map</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
