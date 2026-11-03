'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Navigation,
  Heart,
  Share2,
  Clock,
  Phone,
  Mail,
  MapPin,
  Building2,
  Check,
  Sparkles,
  Accessibility,
  Layers,
} from 'lucide-react';
import { BuildingData, CampusLocationItem } from '@/types/campus';

export interface LocationPanelProps {
  selectedLocation: CampusLocationItem | null;
  selectedBuilding: BuildingData | null;
  onClose: () => void;
  onGetDirections?: (target: { name: string; id: string }) => void;
}

export const LocationPanel: React.FC<LocationPanelProps> = ({
  selectedLocation,
  selectedBuilding,
  onClose,
  onGetDirections,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!selectedLocation && !selectedBuilding) return null;

  // Resolve active entity data
  const name = selectedLocation?.name || selectedBuilding?.name || '';
  const categoryLabel = selectedLocation?.categoryLabel || selectedBuilding?.categoryLabel || '';
  const description = selectedLocation?.description || selectedBuilding?.description || '';
  const buildingName = selectedLocation?.buildingName || selectedBuilding?.name || '';
  const floor = selectedLocation?.floor || (selectedBuilding ? `${selectedBuilding.floors} Floors` : '');
  const room = selectedLocation?.roomNumber;
  const hours = selectedLocation?.hours || selectedBuilding?.openingHours || '08:30 AM – 06:00 PM';
  const phone = selectedLocation?.phone || selectedBuilding?.contactPhone;
  const email = selectedBuilding?.contactEmail;
  const facilities = selectedLocation?.facilities || selectedBuilding?.facilities || [];
  const accessible = selectedLocation ? selectedLocation.accessible : selectedBuilding?.accessible ?? true;
  const code = selectedLocation?.code || selectedBuilding?.code || '';

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/explore?location=${encodeURIComponent(name)}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-3xl shadow-elevation border border-slate-200/90 overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          aria-label="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-cyan-300 border border-blue-400/30 mb-2">
          <span>{categoryLabel}</span>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-white leading-snug">
          {name}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-xs text-slate-300">
          <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-[11px] text-cyan-300 border border-slate-700">
            {code}
          </span>
          {room && (
            <span className="bg-slate-800/80 px-2 py-0.5 rounded text-[11px] text-slate-300">
              Room {room}
            </span>
          )}
          <span>•</span>
          <span>{floor}</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
        {/* Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            About This Location
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Location & Building Details */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Building: </span>
              <span>{buildingName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800">Hours: </span>
              <span>{hours}</span>
            </div>
          </div>

          {phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800">Desk: </span>
                <span className="font-mono">{phone}</span>
              </div>
            </div>
          )}

          {email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-600 shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-slate-800">Email: </span>
                <span>{email}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 text-emerald-700 font-medium">
            <Accessibility className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{accessible ? 'Step-free Wheelchair Ramp Available' : 'Elevator Access Required'}</span>
          </div>
        </div>

        {/* Available Facilities inside this building / location */}
        {facilities.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Available Facilities ({facilities.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {facilities.map((fac, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-cyan-500" />
                  {fac}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200/80 space-y-2">
        <Link
          href={`/routes?destination=${encodeURIComponent(name)}&code=${code}`}
          onClick={() => {
            if (onGetDirections) {
              onGetDirections({ name, id: selectedLocation?.id || selectedBuilding?.id || '' });
            }
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Navigation className="w-4 h-4 fill-white" />
          <span>Get Directions</span>
        </Link>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              isFavorite
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isFavorite ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
