'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Route, Navigation } from 'lucide-react';

function RoutesRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const paramsStr = searchParams.toString();
    const targetUrl = paramsStr ? `/directions?${paramsStr}` : '/directions';
    router.replace(targetUrl);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto">
        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Route className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          Redirecting to Campus Route Finder...
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Connecting to the intelligent shortest path navigation engine.
        </p>
        <Link
          href="/directions"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Click here if not redirected</span>
        </Link>
      </div>
    </div>
  );
}

export default function RoutesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RoutesRedirectContent />
    </Suspense>
  );
}
