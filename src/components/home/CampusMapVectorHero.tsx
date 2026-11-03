'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Navigation,
  Compass,
  Footprints,
  Accessibility,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';

export const CampusMapVectorHero: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg lg:max-w-none mx-auto">
      {/* Decorative Gradient Glow behind the card */}
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-indigo-500/20 rounded-3xl blur-2xl -z-10 transform -rotate-1" />

      {/* Main Map Container Card */}
      <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-elevation overflow-hidden backdrop-blur-xl">
        {/* Map Header Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-cyan-400">
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Active Route Simulation</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <div className="text-[10px] text-slate-400">
                Shortest Walkway • Dijkstra Alg.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-full text-[11px] font-medium text-cyan-300 border border-slate-700">
            <Footprints className="w-3 h-3 text-cyan-400" />
            <span>2 min (185m)</span>
          </div>
        </div>

        {/* Vector SVG Campus Illustration */}
        <div className="relative aspect-[4/3] w-full bg-slate-50/80 p-4 overflow-hidden select-none">
          {/* Subtle grid pattern background */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(#94a3b8 0.75px, transparent 0.75px), radial-gradient(#94a3b8 0.75px, #f8fafc 0.75px)',
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 12px 12px',
            }}
          />

          <svg
            viewBox="0 0 500 375"
            className="w-full h-full relative z-0"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Campus Lawn / Greenery zones */}
            <rect x="30" y="40" width="100" height="70" rx="12" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />
            <rect x="370" y="40" width="100" height="70" rx="12" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />
            <rect x="30" y="270" width="100" height="65" rx="12" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />
            <rect x="370" y="270" width="100" height="65" rx="12" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5" />

            {/* Central Garden Circle */}
            <circle cx="250" cy="180" r="32" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="250" cy="180" r="22" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="250" cy="180" r="10" fill="#0284c7" />

            {/* Walkway Network (Base paths) */}
            {/* Central Spine */}
            <line x1="250" y1="340" x2="250" y2="40" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
            {/* West Ring */}
            <line x1="100" y1="180" x2="400" y2="180" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
            {/* Cross connectors */}
            <line x1="100" y1="90" x2="100" y2="280" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
            <line x1="400" y1="90" x2="400" y2="280" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="90" x2="250" y2="40" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
            <line x1="400" y1="90" x2="250" y2="40" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="280" x2="250" y2="340" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
            <line x1="400" y1="280" x2="250" y2="340" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />

            {/* HIGHLIGHTED ACTIVE NAVIGATION ROUTE */}
            {/* From Main Entrance (250, 340) -> Central Hub (250, 240) -> Turing CS Block (100, 180) */}
            <path
              d="M 250 340 L 250 220 L 125 220 L 125 180"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_2px_8px_rgba(6,182,212,0.6)]"
            />
            {/* Route Dashes for animated motion effect */}
            <path
              d="M 250 340 L 250 220 L 125 220 L 125 180"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="6 6"
              className="animate-[dash_1.5s_linear_infinite]"
            />

            {/* Campus Buildings (Stylized Isometric Blocks) */}
            {/* 1. Administrative Block */}
            <g transform="translate(205, 245)">
              <rect width="90" height="50" rx="8" fill="#1e293b" />
              <rect x="2" y="2" width="86" height="46" rx="6" fill="#0f172a" />
              <text x="45" y="28" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                ADMIN BLOCK
              </text>
              <text x="45" y="40" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="sans-serif">
                ADM • Floors 1-3
              </text>
            </g>

            {/* 2. Computer Science Department (Destination) */}
            <g transform="translate(60, 140)">
              <rect width="90" height="55" rx="8" fill="#2563eb" className="drop-shadow-lg" />
              <rect x="2" y="2" width="86" height="51" rx="6" fill="#1d4ed8" />
              <text x="45" y="26" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                CS & AI DEPT
              </text>
              <text x="45" y="38" fill="#93c5fd" fontSize="7" textAnchor="middle" fontFamily="sans-serif">
                Turing Block • Labs
              </text>
            </g>

            {/* 3. Central Library */}
            <g transform="translate(205, 100)">
              <rect width="90" height="50" rx="8" fill="#0891b2" />
              <rect x="2" y="2" width="86" height="46" rx="6" fill="#0e7490" />
              <text x="45" y="28" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                CENTRAL LIBRARY
              </text>
              <text x="45" y="40" fill="#a5f3fc" fontSize="7" textAnchor="middle" fontFamily="sans-serif">
                Knowledge Hub
              </text>
            </g>

            {/* 4. Grand Auditorium */}
            <g transform="translate(205, 25)">
              <rect width="90" height="45" rx="8" fill="#334155" />
              <rect x="2" y="2" width="86" height="41" rx="6" fill="#1e293b" />
              <text x="45" y="26" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                AUDITORIUM
              </text>
              <text x="45" y="37" fill="#cbd5e1" fontSize="7" textAnchor="middle" fontFamily="sans-serif">
                Events & Culture
              </text>
            </g>

            {/* 5. Mechanical & Civil Engineering */}
            <g transform="translate(350, 140)">
              <rect width="90" height="55" rx="8" fill="#475569" />
              <rect x="2" y="2" width="86" height="51" rx="6" fill="#334155" />
              <text x="45" y="26" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                ENGINEERING
              </text>
              <text x="45" y="38" fill="#cbd5e1" fontSize="7" textAnchor="middle" fontFamily="sans-serif">
                Mech & Civil Blocks
              </text>
            </g>

            {/* START MARKER (Main Entrance) */}
            <g transform="translate(250, 340)">
              <circle r="12" fill="#2563eb" opacity="0.3" className="animate-ping" />
              <circle r="7" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
              <text x="0" y="20" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Main Entrance (Start)
              </text>
            </g>

            {/* DESTINATION PIN (CS Block Entry) */}
            <g transform="translate(125, 175)">
              <circle r="16" fill="#06b6d4" opacity="0.35" className="animate-ping" />
              <circle r="8" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
              <circle r="4" fill="#ffffff" />
            </g>
          </svg>

          {/* Floating UI Overlay: Step Directions Pill */}
          <div className="absolute top-6 left-6 right-6 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200 shadow-card flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <Navigation className="w-4 h-4 rotate-45" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                Next Instruction
              </div>
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                Turn right at Central Circle towards Turing CS Block
              </div>
              <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-600">
                <span className="flex items-center gap-0.5">
                  <Footprints className="w-3 h-3 text-slate-600" /> 45m ahead
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-emerald-600 font-medium">
                  <Accessibility className="w-3 h-3" /> Ramp available
                </span>
              </div>
            </div>
          </div>

          {/* Floating UI Overlay: Destination Badge */}
          <div className="absolute bottom-5 left-5 bg-slate-900/90 text-white backdrop-blur-md rounded-xl px-3 py-2 border border-slate-700 shadow-md flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <div className="text-[11px]">
              <span className="text-slate-400">Destination: </span>
              <strong className="text-white font-semibold">CS & AI Dept</strong>
            </div>
          </div>

          {/* Floating Controls: Zoom and Compass placeholders */}
          <div className="absolute bottom-5 right-5 flex flex-col gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-white/90 shadow-sm border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs hover:bg-slate-100 cursor-pointer">
              +
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/90 shadow-sm border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs hover:bg-slate-100 cursor-pointer">
              −
            </div>
          </div>

          <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/90 border border-slate-200 shadow-sm flex items-center justify-center text-slate-700">
            <Compass className="w-4 h-4 text-blue-600" />
          </div>
        </div>

        {/* Map Bottom Information Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="font-medium text-slate-700">Apex Main Campus (65 Acres)</span>
          </div>
          <Link
            href="/map"
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 group"
          >
            <span>Open Interactive Map</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
