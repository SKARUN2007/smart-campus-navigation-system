import React from 'react';
import Link from 'next/link';
import {
  Compass,
  MapPin,
  Route,
  ArrowRight,
  ShieldCheck,
  Footprints,
  Accessibility,
  Building,
} from 'lucide-react';
import { CampusSearch } from './CampusSearch';
import { CampusMapVectorHero } from './CampusMapVectorHero';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Background Subtle Ambient Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-blue-100/40 via-cyan-100/30 to-indigo-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Description, CTAs, Search */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 sm:space-y-8">
            {/* College Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold tracking-wide w-fit shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Smart Campus Navigation System • Apex Campus</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Navigate Your Campus.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500">
                  Discover Everything.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal">
                Find buildings, departments, classrooms, and campus facilities with intelligent navigation. Get the best walking routes and explore your campus effortlessly.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <Link
                href="/map"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 transition-all active:scale-[0.98] group"
              >
                <Compass className="w-5 h-5 text-cyan-300 stroke-[2.2] group-hover:rotate-45 transition-transform" />
                <span>Explore Campus</span>
                <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/routes"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow transition-all active:scale-[0.98]"
              >
                <Route className="w-5 h-5 text-blue-600" />
                <span>Get Directions</span>
              </Link>
            </div>

            {/* Integrated Search Component */}
            <div className="pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Instant Wayfinding Search</span>
              </div>
              <CampusSearch />
            </div>

            {/* Trust and Feature Micro-Badges */}
            <div className="pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-3 text-slate-600 text-xs font-medium">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Building className="w-3.5 h-3.5" />
                </div>
                <span>10 Campus Blocks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                  <Footprints className="w-3.5 h-3.5" />
                </div>
                <span>Dijkstra Shortest Path</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Accessibility className="w-3.5 h-3.5" />
                </div>
                <span>Wheelchair Friendly</span>
              </div>
            </div>
          </div>

          {/* Right Column: Campus Navigation Illustration */}
          <div className="lg:col-span-5 lg:pl-4">
            <CampusMapVectorHero />
          </div>
        </div>
      </div>
    </section>
  );
};
