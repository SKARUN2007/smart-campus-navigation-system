'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Layers,
  Users,
  GitFork,
  BarChart3,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  AlertCircle,
  Shield,
  ArrowRight,
  TrendingUp,
  Activity,
  Footprints,
  Compass,
  X,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAdmin, isLoading: authLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'buildings' | 'locations' | 'categories' | 'facilities' | 'paths' | 'users' | 'analytics'
  >('overview');

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search & Filter state for sub-tables
  const [filterQuery, setFilterQuery] = useState('');

  // Modal State
  const [modalType, setModalType] = useState<string | null>(null);
  const [modalItem, setModalItem] = useState<any | null>(null);

  // Load all system data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        statsRes,
        bldgRes,
        locRes,
        catRes,
        facRes,
        nodesRes,
        edgesRes,
        usersRes,
      ] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/buildings'),
        fetch('/api/locations'),
        fetch('/api/categories'),
        fetch('/api/facilities'),
        fetch('/api/navigation/nodes'),
        fetch('/api/navigation/edges'),
        fetch('/api/users'),
      ]);

      if (statsRes.ok) setStats((await statsRes.json()).data);
      if (bldgRes.ok) setBuildings((await bldgRes.json()).data || []);
      if (locRes.ok) setLocations((await locRes.json()).data || []);
      if (catRes.ok) setCategories((await catRes.json()).data || []);
      if (facRes.ok) setFacilities((await facRes.json()).data || []);
      if (nodesRes.ok) setNodes((await nodesRes.json()).data || []);
      if (edgesRes.ok) setEdges((await edgesRes.json()).data || []);
      if (usersRes.ok) setUsersList((await usersRes.json()).data || []);
    } catch (err) {
      console.error('Admin load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Delete Items
  const handleDelete = async (endpoint: string, id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/${endpoint}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: `"${name}" was deleted successfully.` });
        loadData();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to delete.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  // Toggle user active status
  const handleToggleUserActive = async (targetUser: any) => {
    try {
      const res = await fetch(`/api/users/${targetUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !targetUser.isActive }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: `User status updated.` });
        loadData();
      } else {
        setFeedback({ type: 'error', message: data.error });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  // Change user role
  const handleChangeUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: 'User role updated.' });
        loadData();
      } else {
        setFeedback({ type: 'error', message: data.error });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* 1. SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">
                Campus<span className="text-cyan-400">Admin</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Administration Portal</span>
            </div>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {[
            { id: 'overview', name: 'Dashboard', icon: LayoutDashboard },
            { id: 'buildings', name: 'Buildings', icon: Building2, count: buildings.length },
            { id: 'locations', name: 'Locations', icon: MapPin, count: locations.length },
            { id: 'categories', name: 'Categories', icon: Layers, count: categories.length },
            { id: 'facilities', name: 'Facilities', icon: Activity, count: facilities.length },
            { id: 'paths', name: 'Navigation Paths', icon: GitFork, count: edges.length },
            { id: 'users', name: 'Users', icon: Users, count: usersList.length },
            { id: 'analytics', name: 'Navigation Analytics', icon: BarChart3 },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setFilterQuery('');
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin User Footer Profile & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                A
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">
                  {user?.name || 'Administrator'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {user?.email || 'admin@campus.edu'}
                </div>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <Link
            href="/"
            className="mt-3 block text-center py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-semibold text-cyan-400 border border-slate-800 transition-colors"
          >
            ← View Public Campus Portal
          </Link>
        </div>
      </aside>

      {/* 2. MAIN CONTENT VIEWPORT */}
      <main className="flex-1 flex flex-col overflow-y-auto min-h-screen">
        {/* Top Bar */}
        <header className="p-4 sm:px-8 border-b border-slate-800 bg-slate-950/40 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-bold text-white capitalize">
              {activeTab === 'overview'
                ? 'Campus Administration & Telemetry'
                : `${activeTab} Management`}
            </h1>
            <p className="text-xs text-slate-400">
              Live PostgreSQL database management and wayfinding graph controls.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-2">
            <Link
              href="/directions"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Test Route Finder</span>
            </Link>
            <button
              onClick={() => loadData()}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs"
            >
              Refresh
            </button>
          </div>
        </header>

        {/* Feedback Alert Banner */}
        {feedback && (
          <div
            className={`mx-4 sm:mx-8 mt-4 p-3.5 rounded-xl text-xs flex items-center justify-between ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-200'
                : 'bg-rose-950/80 border border-rose-800 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="p-4 sm:p-8 flex-1">
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Counters Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Total Buildings</span>
                    <Building2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    {stats?.counts?.buildings ?? buildings.length}
                  </div>
                  <span className="text-[11px] text-emerald-400 mt-1 block">Active on SVG Map</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Campus Locations</span>
                    <MapPin className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    {stats?.counts?.locations ?? locations.length}
                  </div>
                  <span className="text-[11px] text-cyan-400 mt-1 block">Searchable Points</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Registered Users</span>
                    <Users className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    {stats?.counts?.users ?? usersList.length}
                  </div>
                  <span className="text-[11px] text-indigo-400 mt-1 block">Students & Faculty</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Navigation Requests</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    {stats?.counts?.navigationRequests ?? 1}
                  </div>
                  <span className="text-[11px] text-emerald-400 mt-1 block">Live Dijkstra Queries</span>
                </div>
              </div>

              {/* Top Visited Destinations & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Visited Destinations */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>Most Navigated Campus Destinations</span>
                  </h3>
                  <div className="space-y-3">
                    {stats?.topDestinations && stats.topDestinations.length > 0 ? (
                      stats.topDestinations.map((dest: any, idx: number) => (
                        <div
                          key={`top-${idx}`}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-white">{dest.name}</span>
                          </div>
                          <span className="text-cyan-400 font-mono font-semibold">
                            {dest.requestsCount} trips
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-500 py-6 text-center">
                        Locations are ready to track incoming route navigation queries.
                      </div>
                    )}
                  </div>
                </div>

                {/* User Roles Breakdown */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>User Roles Distribution</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['ADMIN', 'STUDENT', 'FACULTY', 'STAFF'].map((r) => {
                      const count = usersList.filter((u) => u.role === r).length;
                      return (
                        <div key={r} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                            {r}
                          </span>
                          <span className="text-xl font-bold text-white mt-1 block">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BUILDINGS MANAGEMENT */}
          {activeTab === 'buildings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Filter buildings..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 w-64 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase">
                    <tr>
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Building Name</th>
                      <th className="py-3 px-4">Floors</th>
                      <th className="py-3 px-4">Hours</th>
                      <th className="py-3 px-4">Locations</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {buildings
                      .filter((b) => b.name.toLowerCase().includes(filterQuery.toLowerCase()))
                      .map((b) => (
                        <tr key={b.id} className="hover:bg-slate-900/50">
                          <td className="py-3 px-4 font-mono font-bold text-cyan-400">{b.code}</td>
                          <td className="py-3 px-4 font-semibold text-white">{b.name}</td>
                          <td className="py-3 px-4 text-slate-300">{b.floors}</td>
                          <td className="py-3 px-4 text-slate-400">{b.openingHours || '08:30 - 17:30'}</td>
                          <td className="py-3 px-4 text-slate-300">{b._count?.locations ?? 0}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleDelete('buildings', b.id, b.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                              title="Delete building"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: LOCATIONS MANAGEMENT */}
          {activeTab === 'locations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Filter locations..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 w-64 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase">
                    <tr>
                      <th className="py-3 px-4">Location Name</th>
                      <th className="py-3 px-4">Building</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {locations
                      .filter((l) => l.name.toLowerCase().includes(filterQuery.toLowerCase()))
                      .map((l) => (
                        <tr key={l.id} className="hover:bg-slate-900/50">
                          <td className="py-3 px-4 font-semibold text-white">{l.name}</td>
                          <td className="py-3 px-4 text-slate-300">{l.building?.name || 'Main Campus'}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-cyan-300">
                              {l.category?.name || 'General'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400">{l.locationType || 'Department'}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleDelete('locations', l.id, l.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                              title="Delete location"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CATEGORIES MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase">
                    <tr>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Slug</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Locations Count</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {categories.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: c.color || '#2563eb' }}
                          />
                          <span>{c.name}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-cyan-400">{c.slug}</td>
                        <td className="py-3 px-4 text-slate-400 line-clamp-1">{c.description}</td>
                        <td className="py-3 px-4 text-slate-300">{c._count?.locations ?? 0}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDelete('categories', c.id, c.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                            title="Delete category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: FACILITIES MANAGEMENT */}
          {activeTab === 'facilities' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase">
                    <tr>
                      <th className="py-3 px-4">Facility Name</th>
                      <th className="py-3 px-4">Building</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Wheelchair Accessible</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {facilities.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-semibold text-white">{f.name}</td>
                        <td className="py-3 px-4 text-slate-300">{f.building?.name || 'Campus Wide'}</td>
                        <td className="py-3 px-4 text-cyan-300">{f.category?.name}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] ${
                              f.isWheelchairAccessible
                                ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {f.isWheelchairAccessible ? 'Step Free' : 'Has Steps'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDelete('facilities', f.id, f.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                            title="Delete facility"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: NAVIGATION PATHS & EDGES */}
          {activeTab === 'paths' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase">
                    <tr>
                      <th className="py-3 px-4">From Waypoint</th>
                      <th className="py-3 px-4">To Waypoint</th>
                      <th className="py-3 px-4">Distance</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Accessible</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {edges.slice(0, 20).map((edge) => (
                      <tr key={edge.id} className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-semibold text-white">
                          {edge.fromNode?.name || edge.fromNodeId}
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">
                          {edge.toNode?.name || edge.toNodeId}
                        </td>
                        <td className="py-3 px-4 text-cyan-400 font-mono font-bold">
                          {edge.distance} m
                        </td>
                        <td className="py-3 px-4 text-slate-400">{edge.pathwayType || 'WALKWAY'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] ${
                              edge.isAccessible
                                ? 'bg-emerald-950 text-emerald-300'
                                : 'bg-amber-950 text-amber-300'
                            }`}
                          >
                            {edge.isAccessible ? 'Accessible' : 'Has Stairs'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[10px] bg-blue-950 text-blue-300">
                            Available
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-semibold text-white">{u.name}</td>
                        <td className="py-3 px-4 text-slate-400 font-mono">{u.email}</td>
                        <td className="py-3 px-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                            className="bg-slate-900 text-cyan-300 border border-slate-700 rounded-lg px-2 py-1 text-xs focus:outline-none"
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="FACULTY">FACULTY</option>
                            <option value="STAFF">STAFF</option>
                            <option value="STUDENT">STUDENT</option>
                            <option value="VISITOR">VISITOR</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{u.department || '—'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                              u.isActive
                                ? 'bg-emerald-950 text-emerald-300'
                                : 'bg-rose-950 text-rose-300'
                            }`}
                          >
                            {u.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleToggleUserActive(u)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: NAVIGATION ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span>Real-Time Graph Navigation Analytics</span>
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Telemetry sourced directly from PostgreSQL navigation history and shortest-path calculation events.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 block">Total Calculations</span>
                    <span className="text-2xl font-bold text-white mt-1 block">
                      {stats?.counts?.navigationRequests ?? 1}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 block">Total Walkways Modeled</span>
                    <span className="text-2xl font-bold text-cyan-400 mt-1 block">
                      {stats?.counts?.edges ?? edges.length}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 block">Graph Waypoints</span>
                    <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                      {stats?.counts?.nodes ?? nodes.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

