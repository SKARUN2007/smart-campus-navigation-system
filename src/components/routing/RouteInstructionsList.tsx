'use client';

import React from 'react';
import {
  ArrowUp,
  CornerUpLeft,
  CornerUpRight,
  ArrowUpLeft,
  ArrowUpRight,
  MapPin,
  Flag,
  Accessibility,
  Footprints,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { StepInstruction, StepActionType } from '@/services/routing/routeInstructions';
import { CalculatedRoute } from '@/services/routing/routeService';

export interface RouteInstructionsListProps {
  route: CalculatedRoute;
  destinationName: string;
}

export const RouteInstructionsList: React.FC<RouteInstructionsListProps> = ({
  route,
  destinationName,
}) => {
  const getStepIcon = (action: StepActionType) => {
    switch (action) {
      case 'START':
        return <MapPin className="w-4 h-4 text-emerald-600" />;
      case 'STRAIGHT':
        return <ArrowUp className="w-4 h-4 text-blue-600" />;
      case 'TURN_LEFT':
        return <CornerUpLeft className="w-4 h-4 text-indigo-600" />;
      case 'TURN_RIGHT':
        return <CornerUpRight className="w-4 h-4 text-indigo-600" />;
      case 'SLIGHT_LEFT':
        return <ArrowUpLeft className="w-4 h-4 text-cyan-600" />;
      case 'SLIGHT_RIGHT':
        return <ArrowUpRight className="w-4 h-4 text-cyan-600" />;
      case 'RAMP':
        return <Accessibility className="w-4 h-4 text-emerald-600" />;
      case 'STAIRS':
        return <Footprints className="w-4 h-4 text-amber-600" />;
      case 'ARRIVE':
        return <Flag className="w-4 h-4 text-rose-600" />;
      default:
        return <ArrowUp className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStepBadgeColor = (action: StepActionType) => {
    switch (action) {
      case 'START':
        return 'bg-emerald-100 border-emerald-300 ring-4 ring-emerald-50';
      case 'ARRIVE':
        return 'bg-rose-100 border-rose-300 ring-4 ring-rose-50';
      case 'RAMP':
        return 'bg-emerald-50 border-emerald-200';
      case 'STAIRS':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div>
          <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
            Step-by-Step Directions
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {route.instructions.length} steps
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {route.formattedDistance} • Approx {route.formattedDuration} walking
          </p>
        </div>

        {route.isAccessible && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Wheelchair Verified
          </span>
        )}
      </div>

      {/* Steps Timeline */}
      <div className="relative pl-3 space-y-4 before:absolute before:top-4 before:bottom-6 before:left-7 before:w-0.5 before:bg-gradient-to-b before:from-emerald-300 before:via-blue-300 before:to-rose-300">
        {route.instructions.map((step, idx) => {
          const isLast = idx === route.instructions.length - 1;
          const isFirst = idx === 0;

          return (
            <div key={`step-${step.stepNumber}-${idx}`} className="relative flex items-start gap-3 group">
              {/* Step Icon Node */}
              <div
                className={`relative z-10 w-8 h-8 rounded-full border flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105 ${getStepBadgeColor(
                  step.action
                )}`}
              >
                {getStepIcon(step.action)}
              </div>

              {/* Step Content */}
              <div className="flex-1 pt-0.5 pb-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Step {step.stepNumber}
                  </span>
                  {step.distanceMeters > 0 && (
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1 shrink-0">
                      <span>{step.formattedDistance}</span>
                      <span>•</span>
                      <span>{step.formattedDuration}</span>
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-slate-800 mt-0.5 leading-snug">
                  {step.instruction}
                </p>

                {/* Sub details: pathway type, ramp/stairs warning */}
                {step.pathwayType === 'RAMP' && (
                  <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <Accessibility className="w-3 h-3 text-emerald-600" />
                    Accessible gentle grade ramp
                  </span>
                )}
                {step.pathwayType === 'STAIRS' && (
                  <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <Footprints className="w-3 h-3 text-amber-600" />
                    Caution: Exterior stone steps
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Arrival Banner */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Arrive at {destinationName}
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            Follow entrance signs inside the facility. Have a productive visit!
          </p>
        </div>
      </div>
    </div>
  );
};

