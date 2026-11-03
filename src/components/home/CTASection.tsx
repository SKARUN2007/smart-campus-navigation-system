import React from 'react';
import Link from 'next/link';
import { Compass, ArrowRight, MapPin, Footprints, Sparkles } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-8 sm:p-14 lg:p-16 text-white overflow-hidden shadow-2xl border border-slate-800">
          {/* Decorative glowing gradient orbs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-blue-500/20 text-cyan-300 border border-blue-400/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>DIGITAL WAYFINDING SYSTEM</span>
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Your Campus. Your Destination.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                One Smart Guide.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Explore your campus with confidence. Find the places you need and discover the easiest way to reach them.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/map"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold text-base shadow-xl shadow-cyan-500/25 transition-all active:scale-[0.98] group"
              >
                <Compass className="w-5 h-5 text-slate-950 stroke-[2.2] group-hover:rotate-45 transition-transform" />
                <span>Start Exploring</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/facilities"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700 hover:border-slate-600 transition-all active:scale-[0.98]"
              >
                <span>Browse Directory</span>
              </Link>
            </div>

            {/* Micro badges below CTA */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Live 20+ Campus Nodes
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-cyan-400" />
                Sub-Second Pathfinding
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Zero Setup Needed
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
