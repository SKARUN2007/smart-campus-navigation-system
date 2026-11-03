'use client';

import React from 'react';
import {
  Clock,
  Footprints,
  Flame,
  Accessibility,
  CornerUpRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { CalculatedRoute } from '@/services/routing/routeService';

export interface RouteCardProps {
  route: CalculatedRoute;
  isActive: boolean;
  onSelect: () => void;
  index: number;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  isActive,
  onSelect,
  index,
}) => {
  const isAccessible = route.isAccessible;

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
        isActive
          ? 'bg-gradient-to-br from-blue-50/90 via-cyan-50/50 to-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* Top Header Badge & Selection */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          {route.type === 'SHORTEST' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-xs">
              <Sparkles className="w-3 h-3" />
              Fastest Route
            </span>
          )}

          {route.type === 'ALTERNATIVE' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              Alternative {index > 1 ? `#${index}` : ''}
            </span>
          )}

          {route.type === 'ACCESSIBLE' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-xs">
              <Accessibility className="w-3 h-3" />
              Step-Free Route
            </span>
          )}

          {isAccessible ? (
            <span
              title="Wheelchair accessible pathway"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Accessible
            </span>
          ) : (
            <span
              title="Contains stairs or steps"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200"
            >
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              Has Stairs
            </span>
          )}
        </div>

        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
            isActive
              ? 'bg-blue-600 text-white'
              : 'border-2 border-slate-300 text-transparent group-hover:border-slate-400'
          }`}
        >
          {isActive ? (
            <CheckCircle2 className="w-4 h-4 fill-white text-blue-600" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-transparent" />
          )}
        </div>
      </div>

      {/* Route Name / Description */}
      <div className="mb-3">
        <h3 className="font-semibold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
          {route.name}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
          {route.summary}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
        <div className="bg-slate-50/80 rounded-lg py-1.5 px-1">
          <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] uppercase font-medium">
            <Footprints className="w-3 h-3" />
            Dist
          </div>
          <div className="text-xs font-bold text-slate-900 mt-0.5">
            {route.formattedDistance}
          </div>
        </div>

        <div className="bg-slate-50/80 rounded-lg py-1.5 px-1">
          <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] uppercase font-medium">
            <Clock className="w-3 h-3" />
            Time
          </div>
          <div className="text-xs font-bold text-slate-900 mt-0.5">
            {route.formattedDuration}
          </div>
        </div>

        <div className="bg-slate-50/80 rounded-lg py-1.5 px-1">
          <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] uppercase font-medium">
            <CornerUpRight className="w-3 h-3" />
            Turns
          </div>
          <div className="text-xs font-bold text-slate-900 mt-0.5">
            {route.turnsCount}
          </div>
        </div>

        <div className="bg-slate-50/80 rounded-lg py-1.5 px-1">
          <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] uppercase font-medium">
            <Flame className="w-3 h-3 text-orange-500" />
            Cal
          </div>
          <div className="text-xs font-bold text-slate-900 mt-0.5">
            {route.caloriesBurned} kcal
          </div>
        </div>
      </div>
    </div>
  );
};

