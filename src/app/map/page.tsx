import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Compass, Map, ArrowLeft, Sparkles, Navigation, Layers } from 'lucide-react';

export default function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; destination?: string; category?: string }>;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-28 pb-16 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Map className="w-8 h-8 stroke-[2.2]" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-50 text-cyan-700 border border-cyan-200 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>Scheduled for Phase 3</span>
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Interactive Campus Map Engine
          </h1>

          <p className="mt-3 text-base text-slate-600 leading-relaxed max-w-lg mx-auto">
            The full SVG and OpenStreetMap interactive engine with live zoom, pan, waypoint highlighting, and building details will be activated in <strong>Phase 3</strong>.
          </p>

          <div className="mt-8 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-subtle max-w-md mx-auto text-left text-xs text-slate-600 space-y-2">
            <div className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Phase 3 Interactive Features Ready for Implementation:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-500">
              <li>Configurable SVG Vector Campus Canvas (1000 x 750)</li>
              <li>Dynamic markers for all 20 campus locations</li>
              <li>Zoom in/out, pan gesture controls & smooth reset</li>
              <li>Marker click popup cards with facility details</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Landing Page</span>
            </Link>
            <Link
              href="/routes"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Preview Route Finder</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
