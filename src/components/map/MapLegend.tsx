'use client';

import React, { useState } from 'react';
import { CAMPUS_CATEGORIES } from '@/data/campusLocations';
import { ChevronDown, ChevronUp, Layers, HelpCircle, X } from 'lucide-react';

export interface MapLegendProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const MapLegend: React.FC<MapLegendProps> = ({ isOpen: controlledIsOpen, onClose }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isExpanded = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-card border border-slate-200/90 overflow-hidden max-w-xs w-full transition-all duration-200">
      {/* Header */}
      <div
        onClick={() => {
          if (onClose && controlledIsOpen !== undefined) {
            onClose();
          } else {
            setInternalIsOpen(!internalIsOpen);
          }
        }}
        className="px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-100"
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-800">Map Legend & Keys</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-3 text-xs space-y-3 max-h-72 overflow-y-auto">
          {/* Categories Grid */}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
              Building Categories
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CAMPUS_CATEGORIES.map((cat) => (
                <div key={cat.id} className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 border"
                    style={{ backgroundColor: cat.color, borderColor: cat.borderColor }}
                  />
                  <span className="text-[11px] text-slate-700 truncate font-medium">
                    {cat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pathways Legend */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
              Pathway Types
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-5 h-1.5 bg-slate-400 rounded-full inline-block" />
                <span>Primary Campus Road (Vehicular / Walk)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-1 bg-slate-300 rounded-full inline-block" />
                <span>Pedestrian Walkway</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-1 bg-sky-400 rounded-full inline-block border-b border-dashed border-sky-600" />
                <span>Accessible Wheelchair Ramp</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-1.5 bg-cyan-400 rounded-full inline-block shadow-xs" />
                <span>Selected Navigation Route</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

