'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Navigation,
  MapPin,
  Flag,
  Accessibility,
  Footprints,
  Compass,
} from 'lucide-react';
import { CampusLocationItem, CampusNode, MapViewport, BuildingData } from '@/types/campus';
import { CAMPUS_BUILDINGS, CAMPUS_LOCATIONS } from '@/data/campusLocations';
import { CAMPUS_EDGES, CAMPUS_NODES } from '@/data/campusPaths';
import { CalculatedRoute } from '@/services/routing/routeService';
import { CampusBuilding } from '@/components/map/CampusBuilding';
import { CampusPath } from '@/components/map/CampusPath';

export interface RouteMapViewerProps {
  startLocation: CampusLocationItem | null;
  destinationLocation: CampusLocationItem | null;
  routes: CalculatedRoute[];
  activeRouteIndex: number;
  onSelectRouteIndex: (index: number) => void;
}

export const RouteMapViewer: React.FC<RouteMapViewerProps> = ({
  startLocation,
  destinationLocation,
  routes,
  activeRouteIndex,
  onSelectRouteIndex,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<MapViewport>({
    zoom: 1.0,
    panX: 0,
    panY: 0,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredBuilding, setHoveredBuilding] = useState<BuildingData | null>(null);

  const activeRoute = routes[activeRouteIndex] || null;

  // Nodes map lookup for normal background paths
  const nodesMap = React.useMemo(() => {
    const map = new Map<string, CampusNode>();
    CAMPUS_NODES.forEach((n) => map.set(n.id, n));
    return map;
  }, []);

  // Fit viewport automatically to the active route's bounding box
  const fitRouteInView = useCallback(
    (targetRoute: CalculatedRoute | null) => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;

      if (!targetRoute || targetRoute.nodes.length === 0) {
        // Default campus view
        setViewport({
          zoom: Math.min(clientWidth / 1200, clientHeight / 850) * 0.95 || 1.0,
          panX: (clientWidth - 1200) / 2,
          panY: (clientHeight - 850) / 2,
        });
        return;
      }

      // Calculate bounding box of route nodes
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      targetRoute.nodes.forEach((n) => {
        if (n.x < minX) minX = n.x;
        if (n.x > maxX) maxX = n.x;
        if (n.y < minY) minY = n.y;
        if (n.y > maxY) maxY = n.y;
      });

      // Add padding around bounding box
      const padX = 140;
      const padY = 140;
      const boxWidth = Math.max(maxX - minX + padX * 2, 260);
      const boxHeight = Math.max(maxY - minY + padY * 2, 260);

      const zoomX = clientWidth / boxWidth;
      const zoomY = clientHeight / boxHeight;
      const targetZoom = Math.min(Math.max(Math.min(zoomX, zoomY), 0.7), 2.2);

      const routeCenterX = (minX + maxX) / 2;
      const routeCenterY = (minY + maxY) / 2;

      const panX = clientWidth / 2 - routeCenterX * targetZoom;
      const panY = clientHeight / 2 - routeCenterY * targetZoom;

      setViewport({
        zoom: targetZoom,
        panX,
        panY,
      });
    },
    []
  );

  // Auto-fit when active route changes
  useEffect(() => {
    if (activeRoute) {
      fitRouteInView(activeRoute);
    }
  }, [activeRoute, fitRouteInView]);

  // Handle Mouse / Touch drag & zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - viewport.panX, y: e.clientY - viewport.panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setViewport((prev) => ({
      ...prev,
      panX: e.clientX - dragStart.x,
      panY: e.clientY - dragStart.y,
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    const newZoom = Math.min(Math.max(viewport.zoom * zoomFactor, 0.5), 3.0);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      const newPanX = cursorX - (cursorX - viewport.panX) * (newZoom / viewport.zoom);
      const newPanY = cursorY - (cursorY - viewport.panY) * (newZoom / viewport.zoom);

      setViewport({ zoom: newZoom, panX: newPanX, panY: newPanY });
    }
  };

  const handleZoomIn = () => {
    setViewport((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.25, 3.0),
    }));
  };

  const handleZoomOut = () => {
    setViewport((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom * 0.8, 0.5),
    }));
  };

  const handleReset = () => {
    if (activeRoute) {
      fitRouteInView(activeRoute);
    } else {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      setViewport({
        zoom: 1.0,
        panX: (clientWidth - 1200) / 2,
        panY: (clientHeight - 850) / 2,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-full bg-[#f1f5f9] overflow-hidden select-none rounded-2xl border border-slate-200 shadow-inner ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Blueprint Grid pattern */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#94a3b8 1px, #f8fafc 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* SVG Map Canvas */}
      <svg
        viewBox="0 0 1200 850"
        className="w-full h-full pointer-events-auto"
        style={{
          transform: `translate(${viewport.panX}px, ${viewport.panY}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        <defs>
          <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="marker-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.25" floodColor="#0f172a" />
          </filter>

          {/* Animated marching dash for active route */}
          <style>
            {`
              @keyframes dash-flow {
                to {
                  stroke-dashoffset: -32;
                }
              }
              .route-flow-line {
                animation: dash-flow 1.2s linear infinite;
              }
            `}
          </style>
        </defs>

        {/* 1. CAMPUS PERIMETER GROUNDS */}
        <rect
          x="30"
          y="30"
          width="1140"
          height="790"
          rx="24"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="3"
        />

        {/* 2. CAMPUS GARDENS */}
        <rect x="70" y="60" width="160" height="90" rx="16" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />
        <rect x="750" y="60" width="230" height="90" rx="16" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />
        <rect x="70" y="710" width="200" height="80" rx="16" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />

        {/* CENTRAL FOUNTAIN */}
        <circle cx="600" cy="480" r="75" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="3" />
        <circle cx="600" cy="480" r="58" fill="#dcfce7" stroke="#86efac" strokeWidth="2" strokeDasharray="5 4" />
        <circle cx="600" cy="480" r="28" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" />
        <circle cx="600" cy="480" r="12" fill="#0284c7" />

        {/* 3. SPORTS GROUND */}
        <g id="sports-ground" opacity="0.65">
          <rect x="825" y="565" width="190" height="120" rx="60" fill="#fed7aa" stroke="#f97316" strokeWidth="2" opacity="0.6" />
          <rect x="855" y="580" width="130" height="90" rx="12" fill="#15803d" stroke="#22c55e" strokeWidth="1.5" />
        </g>

        {/* 4. BASE WALKING PATH NETWORK (Muted) */}
        <g id="base-paths" opacity="0.45">
          {CAMPUS_EDGES.map((edge) => (
            <CampusPath
              key={edge.id}
              edge={edge}
              nodesMap={nodesMap}
              isHighlighted={false}
            />
          ))}
        </g>

        {/* 5. CAMPUS BUILDINGS (Subtle/Light style) */}
        <g id="buildings" opacity="0.85">
          {CAMPUS_BUILDINGS.map((building) => (
            <CampusBuilding
              key={building.id}
              building={building}
              isSelected={false}
              isHovered={hoveredBuilding?.id === building.id}
              onSelect={() => {}}
              onHover={setHoveredBuilding}
            />
          ))}
        </g>

        {/* 6. INACTIVE / ALTERNATIVE ROUTES (Rendered below active route) */}
        {routes.map((route, rIndex) => {
          if (rIndex === activeRouteIndex) return null;
          if (route.nodes.length < 2) return null;

          const points = route.nodes.map((n) => `${n.x},${n.y}`).join(' ');

          return (
            <g
              key={route.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectRouteIndex(rIndex);
              }}
              className="cursor-pointer group"
            >
              {/* Hit area */}
              <polyline
                points={points}
                fill="none"
                stroke="transparent"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Visual dashed line */}
              <polyline
                points={points}
                fill="none"
                stroke="#64748b"
                strokeWidth="5"
                strokeDasharray="8 6"
                strokeOpacity="0.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-150 group-hover:stroke-blue-500 group-hover:stroke-opacity-90"
              />
            </g>
          );
        })}

        {/* 7. ACTIVE ROUTE (Glowing High-Contrast Highlight) */}
        {activeRoute && activeRoute.nodes.length >= 2 && (
          <g id="active-route" filter="url(#route-glow)">
            {/* Outer Glow Halo */}
            <polyline
              points={activeRoute.nodes.map((n) => `${n.x},${n.y}`).join(' ')}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="12"
              strokeOpacity="0.45"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Core Route Line */}
            <polyline
              points={activeRoute.nodes.map((n) => `${n.x},${n.y}`).join(' ')}
              fill="none"
              stroke="#2563eb"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Animated Flow Pulse */}
            <polyline
              points={activeRoute.nodes.map((n) => `${n.x},${n.y}`).join(' ')}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeDasharray="10 10"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="route-flow-line"
              opacity="0.95"
            />

            {/* Route Waypoints / Turning Points */}
            {activeRoute.nodes.slice(1, -1).map((node, wIdx) => (
              <g key={`wpt-${node.id}-${wIdx}`}>
                <circle cx={node.x} cy={node.y} r="5" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                <circle cx={node.x} cy={node.y} r="2" fill="#2563eb" />
              </g>
            ))}
          </g>
        )}

        {/* 8. START PIN MARKER (Green) */}
        {activeRoute && activeRoute.nodes.length > 0 && (
          <g
            id="start-pin"
            transform={`translate(${activeRoute.nodes[0].x}, ${activeRoute.nodes[0].y})`}
            filter="url(#marker-shadow)"
          >
            {/* Pulsing radar circle */}
            <circle r="18" fill="#10b981" opacity="0.25" className="animate-ping" />
            <circle r="14" fill="#10b981" opacity="0.35" />
            <circle r="8" fill="#059669" stroke="#ffffff" strokeWidth="2.5" />

            {/* Floating Label */}
            <g transform="translate(0, -22)">
              <rect
                x="-45"
                y="-18"
                width="90"
                height="20"
                rx="10"
                fill="#0f172a"
                stroke="#10b981"
                strokeWidth="1.5"
              />
              <text
                x="0"
                y="-4"
                fill="#ffffff"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                START POINT
              </text>
            </g>
          </g>
        )}

        {/* 9. DESTINATION PIN MARKER (Red / Rose) */}
        {activeRoute && activeRoute.nodes.length > 1 && (
          <g
            id="dest-pin"
            transform={`translate(${activeRoute.nodes[activeRoute.nodes.length - 1].x}, ${
              activeRoute.nodes[activeRoute.nodes.length - 1].y
            })`}
            filter="url(#marker-shadow)"
          >
            {/* Pulsing radar circle */}
            <circle r="20" fill="#ef4444" opacity="0.25" className="animate-ping" />
            <circle r="15" fill="#ef4444" opacity="0.35" />
            <circle r="9" fill="#dc2626" stroke="#ffffff" strokeWidth="2.5" />

            {/* Floating Label */}
            <g transform="translate(0, -24)">
              <rect
                x="-50"
                y="-18"
                width="100"
                height="20"
                rx="10"
                fill="#0f172a"
                stroke="#ef4444"
                strokeWidth="1.5"
              />
              <text
                x="0"
                y="-4"
                fill="#ffffff"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                DESTINATION
              </text>
            </g>
          </g>
        )}

        {/* Compass Rose */}
        <g id="compass" transform="translate(1100, 80)">
          <circle r="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <polygon points="0,-16 5,0 0,6 -5,0" fill="#ef4444" />
          <polygon points="0,16 5,0 0,-6 -5,0" fill="#94a3b8" />
          <text x="0" y="-19" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            N
          </text>
        </g>
      </svg>

      {/* Floating Map Navigation Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 bg-white/95 backdrop-blur-sm p-1.5 rounded-xl border border-slate-200 shadow-md">
        <button
          onClick={handleZoomIn}
          title="Zoom In (+)"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out (-)"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => fitRouteInView(activeRoute)}
          title="Fit Route to View"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-cyan-600 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          title="Reset Campus View"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Legend / Status pill at bottom right */}
      {activeRoute && (
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-slate-200 shadow-md flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-700 font-medium">Start</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-1 bg-blue-600 rounded-full" />
            <span className="text-slate-700 font-medium">Active Path</span>
          </div>
          {routes.length > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-1 border-t-2 border-dashed border-slate-500" />
              <span className="text-slate-700 font-medium">Alternative</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-slate-700 font-medium">Destination</span>
          </div>
        </div>
      )}
    </div>
  );
};

