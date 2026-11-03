import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Compass, ArrowLeft, Lock, Sparkles, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-28 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-card text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 stroke-[2]" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Phase 7 Auth Portal</span>
            </span>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Sign In to Campus Navigator
            </h1>
            <p className="mt-2 text-xs text-slate-600">
              Sign-in and Role-Based Access Control (Admin, Faculty, Student) is scheduled for activation in <strong>Phase 7</strong>.
            </p>

            <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-left text-xs text-slate-600 space-y-2">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Pre-configured Demo Accounts:</span>
              </div>
              <div>• <strong>Admin:</strong> admin@campus.edu</div>
              <div>• <strong>Staff:</strong> staff@campus.edu</div>
              <div>• <strong>Student:</strong> student@campus.edu</div>
            </div>

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
