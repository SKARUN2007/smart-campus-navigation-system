import React from 'react';
import Link from 'next/link';
import { SectionHeading } from '../ui/SectionHeading';
import {
  Compass,
  MapPin,
  Maximize2,
  Layers,
  ZoomIn,
  ZoomOut,
  Navigation,
  ArrowRight,
  Sparkles,
  Footprints,
  Accessibility,
} from 'lucide-react';

export const CampusMapPreview: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CAMPUS DIGITAL TWIN</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            High-Resolution Interactive Campus Map
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-300">
            A comprehensive bird&apos;s-eye visualization of the entire 65-acre university grounds, interconnecting pedestrian corridors, and multi-floor building interiors.
          </p>
        </div>

        {/* Map Preview Graphic Frame */}
        <div className="relative rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden p-2 sm:p-4">
          {/* Mock Browser/Map Header */}
          <div className="px-4 py-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-xs font-semibold text-slate-300">
                Apex Institute of Technology • Campus Geonav Map
              </span>
            </div>

            {/* Map Layers & Legend Indicators */}
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                <span className="text-slate-300">Academic</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
                <span className="text-slate-300">Library & Facilities</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                <span className="text-slate-300">Dining</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span className="text-slate-300">Sports & Grounds</span>
              </span>
            </div>
          </div>

          {/* SVG Map Canvas Preview */}
          <div className="relative aspect-[16/9] w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800/80">
            {/* Blueprint Grid Lines */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            <svg
              viewBox="0 0 1000 560"
              className="w-full h-full relative z-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Perimeter Boundary */}
              <rect x="50" y="40" width="900" height="480" rx="24" fill="#0b132b" stroke="#1e293b" strokeWidth="3" />

              {/* Greenery Lawns & Landscaping */}
              <rect x="80" y="70" width="160" height="110" rx="12" fill="#064e3b" opacity="0.4" stroke="#059669" strokeWidth="1" />
              <rect x="760" y="70" width="160" height="110" rx="12" fill="#064e3b" opacity="0.4" stroke="#059669" strokeWidth="1" />
              <rect x="80" y="380" width="160" height="110" rx="12" fill="#064e3b" opacity="0.4" stroke="#059669" strokeWidth="1" />

              {/* Central Palm Circle Lawn */}
              <circle cx="500" cy="270" r="60" fill="#022c22" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="500" cy="270" r="30" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              <text x="500" y="274" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                CENTRAL PLAZA
              </text>

              {/* Pedestrian Walkway Network */}
              {/* Central Spine */}
              <line x1="500" y1="500" x2="500" y2="70" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
              {/* East & West Avenues */}
              <line x1="280" y1="120" x2="280" y2="430" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
              <line x1="720" y1="120" x2="720" y2="430" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
              {/* Cross Connections */}
              <line x1="280" y1="270" x2="720" y2="270" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
              <line x1="280" y1="120" x2="500" y2="70" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
              <line x1="720" y1="120" x2="500" y2="70" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
              <line x1="280" y1="430" x2="500" y2="500" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
              <line x1="720" y1="430" x2="500" y2="500" stroke="#334155" strokeWidth="8" strokeLinecap="round" />

              {/* ACTIVE HIGHLIGHTED SAMPLE ROUTE */}
              {/* Route: Main Gate (500, 500) -> Admin Entrance (500, 370) -> Central Library (500, 190) */}
              <path
                d="M 500 500 L 500 190"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="8"
                strokeLinecap="round"
                className="drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              />
              <path
                d="M 500 500 L 500 190"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="8 8"
                className="animate-[dash_2s_linear_infinite]"
              />

              {/* CAMPUS BUILDINGS */}
              {/* 1. Main Entrance Gate */}
              <g transform="translate(420, 480)">
                <rect width="160" height="35" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                <text x="80" y="22" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  MAIN CAMPUS GATE
                </text>
              </g>

              {/* 2. Administrative Block */}
              <g transform="translate(420, 340)">
                <rect width="160" height="65" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <text x="80" y="32" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  ADMINISTRATIVE BLOCK
                </text>
                <text x="80" y="48" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="sans-serif">
                  Principal • Admissions • Exam Cell
                </text>
              </g>

              {/* 3. Central Library (Destination in this preview) */}
              <g transform="translate(420, 130)">
                <rect width="160" height="70" rx="8" fill="#0f766e" stroke="#14b8a6" strokeWidth="2" />
                <text x="80" y="34" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  CENTRAL LIBRARY
                </text>
                <text x="80" y="50" fill="#a7f3d0" fontSize="9" textAnchor="middle" fontFamily="sans-serif">
                  3 Floors • 100k Books • Digital Lab
                </text>
              </g>

              {/* 4. Grand Auditorium */}
              <g transform="translate(420, 45)">
                <rect width="160" height="50" rx="8" fill="#312e81" stroke="#6366f1" strokeWidth="1.5" />
                <text x="80" y="30" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  GRAND AUDITORIUM
                </text>
              </g>

              {/* 5. Turing Computer Science Block */}
              <g transform="translate(190, 230)">
                <rect width="150" height="85" rx="8" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
                <text x="75" y="42" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  COMPUTER SCIENCE
                </text>
                <text x="75" y="58" fill="#93c5fd" fontSize="9" textAnchor="middle" fontFamily="sans-serif">
                  AI Labs & Software Suites
                </text>
              </g>

              {/* 6. Electronics Department */}
              <g transform="translate(190, 100)">
                <rect width="150" height="75" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                <text x="75" y="38" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  ELECTRONICS (ECE)
                </text>
                <text x="75" y="54" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="sans-serif">
                  VLSI & Robotics Labs
                </text>
              </g>

              {/* 7. Dining Hall & Cafeteria */}
              <g transform="translate(190, 360)">
                <rect width="150" height="75" rx="8" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="75" y="38" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  CANTEEN & CAFÉ
                </text>
                <text x="75" y="54" fill="#fde68a" fontSize="8" textAnchor="middle" fontFamily="sans-serif">
                  Multi-Cuisine Dining
                </text>
              </g>

              {/* 8. Mechanical & Civil Engineering */}
              <g transform="translate(660, 230)">
                <rect width="160" height="85" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                <text x="80" y="42" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  MECHANICAL & CIVIL
                </text>
                <text x="80" y="58" fill="#cbd5e1" fontSize="9" textAnchor="middle" fontFamily="sans-serif">
                  Heavy Workshops & Testing Labs
                </text>
              </g>

              {/* 9. Sports Complex & Pavilion */}
              <g transform="translate(660, 360)">
                <rect width="160" height="75" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                <text x="80" y="38" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  SPORTS COMPLEX
                </text>
                <text x="80" y="54" fill="#a7f3d0" fontSize="8" textAnchor="middle" fontFamily="sans-serif">
                  Athletic Turf & Gym
                </text>
              </g>

              {/* START & END PINS */}
              {/* Start Pin at Gate */}
              <g transform="translate(500, 500)">
                <circle r="16" fill="#3b82f6" opacity="0.3" className="animate-ping" />
                <circle r="9" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
              </g>

              {/* Destination Pin at Central Library */}
              <g transform="translate(500, 190)">
                <circle r="20" fill="#06b6d4" opacity="0.4" className="animate-ping" />
                <circle r="10" fill="#06b6d4" stroke="#ffffff" strokeWidth="2.5" />
                <circle r="4" fill="#ffffff" />
              </g>
            </svg>

            {/* Visual Controls Placeholder Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <button
                type="button"
                className="w-9 h-9 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center transition-colors shadow-md"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-9 h-9 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center transition-colors shadow-md"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-9 h-9 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center transition-colors shadow-md"
                title="Layers"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-9 h-9 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center transition-colors shadow-md"
                title="Center"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            {/* Interactive Preview Overlay Card */}
            <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-700/80 shadow-2xl z-10">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                    Simulated Route Calculation
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Main Entrance → Central Library
                  </h4>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  Optimal Path
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-300 py-2 border-y border-slate-800 my-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Footprints className="w-3.5 h-3.5 text-cyan-400" />
                  310 meters (3 min walk)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <Accessibility className="w-3.5 h-3.5" />
                  Wheelchair Ramp Ready
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Walk straight past the South Plaza along the Palm Boulevard. Turn slightly right at Central Garden portico to reach the Library front lobby.
              </p>

              <Link
                href="/explore"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
              >
                <span>Explore Interactive Map</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

