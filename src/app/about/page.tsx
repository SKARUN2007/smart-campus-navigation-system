import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Compass, ArrowLeft, Shield, Accessibility, MapPin, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Compass className="w-7 h-7 stroke-[2.2]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              About Campus Navigator
            </h1>
            <p className="mt-3 text-base text-slate-600">
              The next-generation digital wayfinding and accessible navigation system for Apex Institute of Technology & Science.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-card space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-600" />
                <span>Our Mission</span>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Campus Navigator simplifies mobility across our 65-acre university campus. By fusing mathematical graph theory with modern web ergonomics, we ensure that every student, educator, parent, and distinguished guest can pinpoint departments, labs, seminar halls, and dining facilities with complete peace of mind.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <Accessibility className="w-6 h-6 text-emerald-600 mb-2" />
                <h3 className="font-bold text-slate-900 text-base mb-1">Universal Accessibility</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every walking route is evaluated for step-free ramps and elevator availability, ensuring effortless mobility for wheelchair users.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <Shield className="w-6 h-6 text-blue-600 mb-2" />
                <h3 className="font-bold text-slate-900 text-base mb-1">Safety & Emergency Priority</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct one-tap navigation to the 24/7 Campus Medical Centre, security checkpoints, and emergency gathering zones.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-600"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
              >
                <span>Launch Map</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
