import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CAMPUS_FACILITIES_LIST } from '@/data/sampleCampusData';
import {
  BookOpen,
  ArrowLeft,
  Clock,
  Phone,
  MapPin,
  Navigation,
  Sparkles,
  Building2,
} from 'lucide-react';

export default function FacilitiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Campus Directory Preview (Phase 4 Focus)</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Campus Facilities & Services Directory
            </h1>
            <p className="mt-3 text-base text-slate-600">
              Browse all academic halls, specialized research laboratories, student recreation hubs, medical aid clinics, and dining options.
            </p>
          </div>

          {/* Facilities Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAMPUS_FACILITIES_LIST.map((fac) => (
              <div
                key={fac.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-subtle hover:shadow-elevation transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                      {fac.category}
                    </span>
                    <span className="text-xs text-slate-600 font-medium">
                      Verified
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {fac.name}
                  </h3>
                  <p className="text-xs text-slate-600 mb-4">
                    {fac.highlight}
                  </p>

                  <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{fac.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <span>{fac.hours}</span>
                    </div>
                    {fac.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        <span className="font-mono">{fac.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/map?destination=${encodeURIComponent(fac.name)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>View Location on Map</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
