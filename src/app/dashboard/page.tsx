'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass,
  MapPin,
  Heart,
  History,
  Navigation,
  Search,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Building2,
  Trash2,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { searchLocationsApi } from '@/lib/api-client';

export default function UserDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [favourites, setFavourites] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Redirect if not signed in after loading
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Load user data
  useEffect(() => {
    if (!user) return;
    const currentUserId = user.id;

    async function loadData() {
      setIsDataLoading(true);
      try {
        const token = localStorage.getItem('campus_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const [favRes, histRes] = await Promise.all([
          fetch(`/api/favourites?userId=${currentUserId}`, { headers }),
          fetch('/api/navigation/history?limit=6', { headers }),
        ]);

        if (favRes.ok) {
          const favData = await favRes.json();
          if (favData.success) setFavourites(favData.data || []);
        }

        if (histRes.ok) {
          const histData = await histRes.json();
          if (histData.success) setHistory(histData.data || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsDataLoading(false);
      }
    }

    loadData();
  }, [user]);

  // Search input handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await searchLocationsApi(searchQuery);
      setSearchResults(results.slice(0, 5));
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const removeFavourite = async (locId: string) => {
    try {
      const token = localStorage.getItem('campus_token');
      await fetch(`/api/favourites?locationId=${locId}&userId=${user?.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setFavourites((prev) => prev.filter((f) => f.locationId !== locId));
    } catch (err) {
      console.error('Remove favourite error:', err);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-600">Loading user profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-cyan-100 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Navigator Portal</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user.name}!
            </h1>
            <p className="mt-2 text-sm sm:text-base text-blue-100 leading-relaxed">
              Role: <strong className="text-white capitalize">{user.role.toLowerCase()}</strong>
              {user.department && (
                <>
                  {' '}• Department: <strong className="text-white">{user.department}</strong>
                </>
              )}
              {user.studentId && (
                <>
                  {' '}• ID: <strong className="text-white">{user.studentId}</strong>
                </>
              )}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <Link
                href="/directions"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-md transition-all active:scale-[0.98]"
              >
                <Navigation className="w-4 h-4 text-blue-600" />
                <span>Find Route</span>
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-800/60 hover:bg-blue-800/80 text-white font-semibold text-xs border border-white/20 transition-all active:scale-[0.98]"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Map</span>
              </Link>
              <Link
                href="/facilities"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-800/60 hover:bg-blue-800/80 text-white font-semibold text-xs border border-white/20 transition-all active:scale-[0.98]"
              >
                <Layers className="w-4 h-4" />
                <span>Facilities</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Search Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm mb-8">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            <span>Quick Destination Search</span>
          </h2>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search classrooms, laboratories, canteen, auditorium..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Autocomplete Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
              {searchResults.map((loc) => (
                <div
                  key={loc.id}
                  className="p-3 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{loc.name}</div>
                      <div className="text-xs text-slate-500">{loc.buildingName || loc.building?.name || 'Campus Building'}</div>
                    </div>
                  </div>
                  <Link
                    href={`/directions?destination=${encodeURIComponent(loc.name)}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Route</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dual Column: Favourites & Navigation History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Favourites Section */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-rose-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Favourite Locations</h3>
                  <p className="text-xs text-slate-500">Your quick-access saved places</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {favourites.length}
              </span>
            </div>

            {favourites.length === 0 ? (
              <div className="text-center py-10 my-auto">
                <Heart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No favourites saved yet.</p>
                <Link
                  href="/explore"
                  className="mt-3 inline-block text-xs font-semibold text-blue-600 hover:underline"
                >
                  Explore map to add favourites
                </Link>
              </div>
            ) : (
              <div className="space-y-3 flex-1">
                {favourites.map((fav) => (
                  <div
                    key={fav.id}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/70 flex items-center justify-between gap-3 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {fav.location?.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {fav.location?.building?.name || 'Campus Facility'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/directions?destination=${encodeURIComponent(fav.location?.name || '')}`}
                        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        title="Get directions"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => removeFavourite(fav.locationId)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove favourite"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation History Section */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Recent Navigation History</h3>
                  <p className="text-xs text-slate-500">Your campus walking trips</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {history.length}
              </span>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-10 my-auto">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No navigation routes recorded yet.</p>
                <Link
                  href="/directions"
                  className="mt-3 inline-block text-xs font-semibold text-blue-600 hover:underline"
                >
                  Find a route to get started
                </Link>
              </div>
            ) : (
              <div className="space-y-3 flex-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>{item.startLocation?.name || 'Campus Gate'}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="text-blue-600">
                          {item.destinationLocation?.name || 'Destination'}
                        </span>
                      </div>
                      <div className="text-slate-500 mt-1 flex items-center gap-2">
                        <span>{item.distanceMeters || item.totalDistance} m</span>
                        <span>•</span>
                        <span>{Math.ceil((item.durationSeconds || item.estimatedTime || 60) / 60)} min walking</span>
                      </div>
                    </div>

                    <Link
                      href={`/directions?start=${encodeURIComponent(
                        item.startLocation?.name || ''
                      )}&destination=${encodeURIComponent(item.destinationLocation?.name || '')}`}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 font-medium transition-colors"
                    >
                      Repeat
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
