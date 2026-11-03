import React from 'react';
import Link from 'next/link';
import { SectionHeading } from '../ui/SectionHeading';
import { CAMPUS_FACILITIES_LIST, DetailedFacility } from '@/data/sampleCampusData';
import {
  BookOpen,
  Cpu,
  Sparkles,
  Utensils,
  Presentation,
  Trophy,
  HeartPulse,
  Car,
  Clock,
  Phone,
  MapPin,
  ArrowRight,
  LucideIcon,
  Navigation,
} from 'lucide-react';

const facilityIconMap: Record<string, LucideIcon> = {
  BookOpen,
  Cpu,
  Sparkles,
  Utensils,
  Presentation,
  Trophy,
  HeartPulse,
  Car,
};

export const FacilitiesSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <SectionHeading
            align="left"
            badge="CAMPUS AMENITIES"
            title="Everything You Need, All in One Place"
            subtitle="Browse official campus facilities, service desks, study hubs, dining, medical care, and fitness centers with real-time operational timings."
          />
          <Link
            href="/facilities"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap group shrink-0"
          >
            <span>Complete Facilities Guide</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAMPUS_FACILITIES_LIST.map((fac) => {
            const IconComponent = facilityIconMap[fac.iconName] || BookOpen;

            return (
              <div
                key={fac.id}
                className="group bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle hover:shadow-elevation transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Category Pill and Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs">
                      <IconComponent className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {fac.category}
                    </span>
                  </div>

                  {/* Name and Highlight */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {fac.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {fac.highlight}
                  </p>

                  {/* Metadata List */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span className="truncate">{fac.building}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <span className="text-[11px] truncate">{fac.hours}</span>
                    </div>

                    {fac.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        <span className="text-[11px] font-mono">{fac.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <Link
                    href={`/map?destination=${encodeURIComponent(fac.name)}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 group-hover:bg-blue-600 text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-blue-600 transition-all active:scale-[0.98]"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate Here</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
