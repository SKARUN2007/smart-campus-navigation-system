'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Navigation,
  Compass,
  MapPin,
  Sparkles,
  GitFork,
  Cpu,
  Info,
  Layers,
  ListOrdered,
  Map as MapIcon,
  RotateCcw,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CAMPUS_LOCATIONS } from '@/data/campusLocations';
import { CampusLocationItem } from '@/types/campus';
import { RouteService, RouteSearchResponse, CalculatedRoute } from '@/services/routing/routeService';
import { RouteFinderForm } from '@/components/routing/RouteFinderForm';
import { RouteCard } from '@/components/routing/RouteCard';
import { RouteInstructionsList } from '@/components/routing/RouteInstructionsList';
import { RouteMapViewer } from '@/components/routing/RouteMapViewer';

const routeService = new RouteService();

function DirectionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [startLocation, setStartLocation] = useState<CampusLocationItem | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<CampusLocationItem | null>(null);
  const [preferAccessible, setPreferAccessible] = useState<boolean>(false);
  const [routeResponse, setRouteResponse] = useState<RouteSearchResponse | null>(null);
  const [activeRouteIndex, setActiveRouteIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'map' | 'directions'>('map');

  // Resolve query parameters on initial mount
  useEffect(() => {
    const startParam = searchParams.get('start');
    const destParam = searchParams.get('destination');
    const codeParam = searchParams.get('code');
    const accessibleParam = searchParams.get('accessible');

    let initialStart: CampusLocationItem | null = null;
    let initialDest: CampusLocationItem | null = null;

    if (startParam) {
      initialStart =
        CAMPUS_LOCATIONS.find(
          (l) =>
            l.id === startParam ||
            l.code.toLowerCase() === startParam.toLowerCase() ||
            l.name.toLowerCase() === startParam.toLowerCase()
        ) || null;
    } else {
      // Default convenience start: Main Campus Gate
      initialStart = CAMPUS_LOCATIONS.find((l) => l.code === 'GATE_MAIN') || null;
    }

    if (destParam || codeParam) {
      const q = (destParam || codeParam)!.toLowerCase();
      initialDest =
        CAMPUS_LOCATIONS.find(
          (l) =>
            l.id.toLowerCase() === q ||
            l.code.toLowerCase() === q ||
            l.name.toLowerCase() === q
        ) || null;
    }

    if (initialStart) setStartLocation(initialStart);
    if (initialDest) setDestinationLocation(initialDest);
    if (accessibleParam === 'true') setPreferAccessible(true);

    // If both start and destination are found, automatically calculate route
    if (initialStart && initialDest && initialStart.id !== initialDest.id) {
      const resp = routeService.findRoutes({
        startQuery: initialStart.id,
        destinationQuery: initialDest.id,
        preferAccessible: accessibleParam === 'true',
      });
      if (resp.success) {
        setRouteResponse(resp);
        setActiveRouteIndex(0);
        setErrorMessage(null);
      } else {
        setErrorMessage(resp.error || 'Failed to calculate route.');
      }
    }
  }, [searchParams]);

  const handleCalculateRoute = useCallback(() => {
    if (!startLocation) {
      setErrorMessage('Please select a starting location.');
      return;
    }
    if (!destinationLocation) {
      setErrorMessage('Please select a destination.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // Calculate synchronously with microtask delay for smooth UI feedback
    setTimeout(() => {
      const resp = routeService.findRoutes({
        startQuery: startLocation.id,
        destinationQuery: destinationLocation.id,
        preferAccessible,
      });

      setIsLoading(false);

      if (resp.success && resp.routes.length > 0) {
        setRouteResponse(resp);
        setActiveRouteIndex(0);
        setErrorMessage(null);
      } else {
        setRouteResponse(null);
        setErrorMessage(
          resp.error || 'No walking route could be found between these locations.'
        );
      }
    }, 150);
  }, [startLocation, destinationLocation, preferAccessible]);

  const handleSwapLocations = () => {
    const prevStart = startLocation;
    const prevDest = destinationLocation;
    setStartLocation(prevDest);
    setDestinationLocation(prevStart);

    if (prevDest && prevStart && prevDest.id !== prevStart.id) {
      const resp = routeService.findRoutes({
        startQuery: prevDest.id,
        destinationQuery: prevStart.id,
        preferAccessible,
      });
      if (resp.success) {
        setRouteResponse(resp);
        setActiveRouteIndex(0);
        setErrorMessage(null);
      }
    }
  };

  const handleToggleAccessible = () => {
    const nextVal = !preferAccessible;
    setPreferAccessible(nextVal);

    if (startLocation && destinationLocation && startLocation.id !== destinationLocation.id) {
      const resp = routeService.findRoutes({
        startQuery: startLocation.id,
        destinationQuery: destinationLocation.id,
        preferAccessible: nextVal,
      });
      if (resp.success) {
        setRouteResponse(resp);
        setActiveRouteIndex(0);
        setErrorMessage(null);
      }
    }
  };

  const activeRoute = routeResponse?.routes[activeRouteIndex] || null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 mb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/explore"
                className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Campus Map</span>
              </Link>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                <Sparkles className="w-3 h-3 text-blue-500" />
                Live Graph Routing Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Find Your Campus Route
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Choose your starting point and destination to discover the best way across campus.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-2">
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs transition-colors"
            >
              <MapIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>Full Map View</span>
            </Link>
            <Link
              href="/facilities"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Facilities Directory</span>
            </Link>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="lg:hidden flex items-center justify-center p-1 bg-slate-200 rounded-xl mb-4">
          <button
            onClick={() => setMobileTab('map')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
              mobileTab === 'map'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Interactive Map</span>
          </button>
          <button
            onClick={() => setMobileTab('directions')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
              mobileTab === 'directions'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Directions {activeRoute ? `(${activeRoute.instructions.length})` : ''}</span>
          </button>
        </div>

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
          {/* Left Column: Form + Route Cards + Turn Directions */}
          <div
            className={`lg:col-span-5 xl:col-span-5 flex flex-col gap-5 ${
              mobileTab === 'map' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* 1. Route Finder Form Card */}
            <RouteFinderForm
              startLocation={startLocation}
              destinationLocation={destinationLocation}
              onSelectStart={setStartLocation}
              onSelectDestination={setDestinationLocation}
              onSwapLocations={handleSwapLocations}
              preferAccessible={preferAccessible}
              onToggleAccessible={handleToggleAccessible}
              onSubmit={handleCalculateRoute}
              isLoading={isLoading}
              errorMessage={errorMessage}
            />

            {/* 2. Calculated Route Options */}
            {routeResponse && routeResponse.routes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Available Routes ({routeResponse.routes.length})
                  </h2>
                  <span className="text-[11px] text-slate-400">
                    Click to switch active route
                  </span>
                </div>

                <div className="space-y-2.5">
                  {routeResponse.routes.map((route, idx) => (
                    <RouteCard
                      key={route.id}
                      route={route}
                      index={idx}
                      isActive={idx === activeRouteIndex}
                      onSelect={() => setActiveRouteIndex(idx)}
                    />
                  ))}
                </div>

                {/* Algorithm Benchmarking Details Box */}
                {routeResponse.comparison && (
                  <div className="p-3.5 rounded-xl bg-slate-900 text-slate-300 text-xs border border-slate-800 shadow-xs">
                    <div className="flex items-center gap-2 font-semibold text-white mb-2">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Graph Engine Benchmark</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-slate-800/80 p-2 rounded-lg">
                        <span className="text-slate-400 block font-mono">Dijkstra:</span>
                        <span className="font-semibold text-white">
                          {routeResponse.comparison.dijkstraVisitedNodes} nodes visited
                        </span>
                        <span className="text-slate-400 block mt-0.5">
                          {routeResponse.comparison.dijkstraTimeMs.toFixed(2)} ms
                        </span>
                      </div>
                      <div className="bg-slate-800/80 p-2 rounded-lg">
                        <span className="text-cyan-400 block font-mono">A* Algorithm:</span>
                        <span className="font-semibold text-white">
                          {routeResponse.comparison.astarVisitedNodes} nodes visited
                        </span>
                        <span className="text-slate-400 block mt-0.5">
                          {routeResponse.comparison.astarTimeMs.toFixed(2)} ms
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. Turn-by-Turn Instructions List */}
            {activeRoute && destinationLocation && (
              <RouteInstructionsList
                route={activeRoute}
                destinationName={destinationLocation.name}
              />
            )}
          </div>

          {/* Right Column: Interactive Route Map Viewer */}
          <div
            className={`lg:col-span-7 xl:col-span-7 h-[580px] lg:h-[720px] sticky top-24 ${
              mobileTab === 'directions' ? 'hidden lg:block' : 'block'
            }`}
          >
            <RouteMapViewer
              startLocation={startLocation}
              destinationLocation={destinationLocation}
              routes={routeResponse ? routeResponse.routes : []}
              activeRouteIndex={activeRouteIndex}
              onSelectRouteIndex={setActiveRouteIndex}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function DirectionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-slate-600">Loading Campus Navigation Engine...</span>
          </div>
        </div>
      }
    >
      <DirectionsContent />
    </Suspense>
  );
}

