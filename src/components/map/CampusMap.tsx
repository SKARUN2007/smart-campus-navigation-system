'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  BuildingData,
  CampusCategoryType,
  CampusLocationItem,
  CampusNode,
  MapViewport,
} from '@/types/campus';
import {
  CAMPUS_BUILDINGS,
  CAMPUS_LOCATIONS,
} from '@/data/campusLocations';
import { CAMPUS_EDGES, CAMPUS_NODES } from '@/data/campusPaths';
import { CampusBuilding } from './CampusBuilding';
import { CampusMarker } from './CampusMarker';
import { CampusPath } from './CampusPath';
import { MapControls } from './MapControls';
import { MapLegend } from './MapLegend';
import { LocationPanel } from './LocationPanel';

export interface CampusMapProps {
  selectedLocation: CampusLocationItem | null;
  selectedBuilding: BuildingData | null;
  activeCategories: Set<CampusCategoryType>;
  onSelectLocation: (location: CampusLocationItem | null) => void;
  onSelectBuilding: (building: BuildingData | null) => void;
  onGetDirections?: (target: { name: string; id: string }) => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  selectedLocation,
  selectedBuilding,
  activeCategories,
  onSelectLocation,
  onSelectBuilding,
  onGetDirections,
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
  const [hoveredLocation, setHoveredLocation] = useState<CampusLocationItem | null>(null);
  const [showPaths, setShowPaths] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Nodes Map lookup for edge rendering
  const nodesMap = React.useMemo(() => {
    const map = new Map<string, CampusNode>();
    CAMPUS_NODES.forEach((node) => map.set(node.id, node));
    return map;
  }, []);

  // Filtered Locations & Buildings by Category
  const visibleBuildings = React.useMemo(() => {
    if (activeCategories.size === 0) return CAMPUS_BUILDINGS;
    return CAMPUS_BUILDINGS.filter((b) => activeCategories.has(b.category));
  }, [activeCategories]);

  const visibleLocations = React.useMemo(() => {
    if (activeCategories.size === 0) return CAMPUS_LOCATIONS;
    return CAMPUS_LOCATIONS.filter((l) => activeCategories.has(l.category));
  }, [activeCategories]);

  // Center on a specific point in SVG coordinates
  const centerOnPoint = useCallback((svgX: number, svgY: number, targetZoom = 1.35) => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;

    // SVG canvas is 1200 x 850
    // Center point in SVG coords should map to (clientWidth/2, clientHeight/2)
    const panX = clientWidth / 2 - svgX * targetZoom;
    const panY = clientHeight / 2 - svgY * targetZoom;

    setViewport({
      zoom: targetZoom,
      panX,
      panY,
    });
  }, []);

  // When selectedLocation changes, smoothly center on it
  useEffect(() => {
    if (selectedLocation) {
      centerOnPoint(selectedLocation.markerX, selectedLocation.markerY, 1.45);
    }
  }, [selectedLocation, centerOnPoint]);

  // When selectedBuilding changes (and no selectedLocation), center on building center
  useEffect(() => {
    if (selectedBuilding && !selectedLocation) {
      centerOnPoint(
        selectedBuilding.x + selectedBuilding.width / 2,
        selectedBuilding.y + selectedBuilding.height / 2,
        1.3
      );
    }
  }, [selectedBuilding, selectedLocation, centerOnPoint]);

  // Zoom helpers
  const handleZoomIn = () => {
    setViewport((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom + 0.25, 3.0),
    }));
  };

  const handleZoomOut = () => {
    setViewport((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom - 0.25, 0.6),
    }));
  };

  const handleResetView = () => {
    setViewport({
      zoom: 1.0,
      panX: 0,
      panY: 0,
    });
  };

  const handleFitScreen = () => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const scaleX = clientWidth / 1250;
    const scaleY = clientHeight / 900;
    const fitZoom = Math.min(scaleX, scaleY, 1.1);

    setViewport({
      zoom: fitZoom,
      panX: (clientWidth - 1200 * fitZoom) / 2,
      panY: (clientHeight - 850 * fitZoom) / 2,
    });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setViewport((prev) => {
      const newZoom = Math.max(0.6, Math.min(3.0, prev.zoom * zoomFactor));
      return {
        ...prev,
        zoom: newZoom,
      };
    });
  };

  // Mouse drag panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag for mobile
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX - viewport.panX,
        y: e.touches[0].clientY - viewport.panY,
      };
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      setViewport((prev) => ({
        ...prev,
        panX: e.touches[0].clientX - touchStartRef.current.x,
        panY: e.touches[0].clientY - touchStartRef.current.y,
      }));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Building selection
  const handleBuildingClick = (building: BuildingData) => {
    onSelectBuilding(building);
    // Find matching primary location if available
    const primaryLoc = CAMPUS_LOCATIONS.find((l) => l.buildingId === building.id);
    onSelectLocation(primaryLoc || null);
  };

  // Marker selection
  const handleMarkerClick = (location: CampusLocationItem) => {
    onSelectLocation(location);
    const parentBuilding = CAMPUS_BUILDINGS.find((b) => b.id === location.buildingId);
    if (parentBuilding) {
      onSelectBuilding(parentBuilding);
    }
  };

  const handleCanvasClick = () => {
    // deselect when clicking background
    onSelectLocation(null);
    onSelectBuilding(null);
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleCanvasClick}
      className={`relative w-full h-full bg-[#f1f5f9] overflow-hidden select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Background Blueprint Grid */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#94a3b8 1px, #f8fafc 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Main Scalable SVG Canvas */}
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
          {/* Subtle drop shadows for buildings */}
          <filter id="building-shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.12" floodColor="#0f172a" />
          </filter>
        </defs>

        {/* 1. CAMPUS PERIMETER BOUNDARY & GROUNDS */}
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

        {/* 2. CAMPUS GARDENS & GREEN LAWNS */}
        {/* Northwest Lawn */}
        <rect x="70" y="60" width="160" height="90" rx="16" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />
        {/* Central North Lawn */}
        <rect x="750" y="60" width="230" height="90" rx="16" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />
        {/* Southwest Garden */}
        <rect x="70" y="710" width="200" height="80" rx="16" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />

        {/* CENTRAL BOTANICAL CIRCLE & FOUNTAIN */}
        <circle cx="600" cy="480" r="75" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="3" />
        <circle cx="600" cy="480" r="58" fill="#dcfce7" stroke="#86efac" strokeWidth="2" strokeDasharray="5 4" />
        <circle cx="600" cy="480" r="28" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" />
        <circle cx="600" cy="480" r="12" fill="#0284c7" />
        <text x="600" y="484" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          GARDEN
        </text>

        {/* 3. SPORTS GROUND TURF & TRACK GRAPHIC */}
        <g id="sports-turf-overlay">
          {/* 400m Running Track Oval */}
          <rect x="825" y="565" width="190" height="120" rx="60" fill="#fed7aa" stroke="#f97316" strokeWidth="2" opacity="0.6" />
          {/* Soccer Turf Green */}
          <rect x="855" y="580" width="130" height="90" rx="12" fill="#15803d" stroke="#22c55e" strokeWidth="1.5" />
          {/* Field Markings */}
          <line x1="920" y1="580" x2="920" y2="670" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
          <circle cx="920" cy="625" r="18" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
        </g>

        {/* 4. PARKING AREA MARKINGS */}
        <g id="parking-grid-overlay" opacity="0.5">
          <line x1="790" y1="760" x2="970" y2="760" stroke="#ffffff" strokeWidth="1" strokeDasharray="6 6" />
          <line x1="790" y1="785" x2="970" y2="785" stroke="#ffffff" strokeWidth="1" strokeDasharray="6 6" />
        </g>

        {/* 5. WALKING PATHS & ROADS NETWORK */}
        {showPaths && (
          <g id="campus-walkways-layer">
            {CAMPUS_EDGES.map((edge) => (
              <CampusPath
                key={edge.id}
                edge={edge}
                nodesMap={nodesMap}
                isHighlighted={
                  selectedLocation
                    ? edge.from === selectedLocation.code || edge.to === selectedLocation.code
                    : false
                }
              />
            ))}
          </g>
        )}

        {/* 6. CAMPUS BUILDINGS */}
        <g id="campus-buildings-layer" filter="url(#building-shadow)">
          {visibleBuildings.map((building) => {
            const isSelected = selectedBuilding?.id === building.id;
            const isHovered = hoveredBuilding?.id === building.id;

            return (
              <CampusBuilding
                key={building.id}
                building={building}
                isSelected={isSelected}
                isHovered={isHovered}
                onSelect={handleBuildingClick}
                onHover={setHoveredBuilding}
              />
            );
          })}
        </g>

        {/* 7. LOCATION MARKERS */}
        <g id="campus-markers-layer">
          {visibleLocations.map((loc) => {
            const isSelected = selectedLocation?.id === loc.id;
            const isHovered = hoveredLocation?.id === loc.id;

            return (
              <CampusMarker
                key={loc.id}
                location={loc}
                isSelected={isSelected}
                isHovered={isHovered}
                onSelect={handleMarkerClick}
                onHover={setHoveredLocation}
              />
            );
          })}
        </g>

        {/* 8. CAMPUS LABELS & COMPASS ROSE ON MAP */}
        <g id="campus-compass-rose" transform="translate(1090, 80)">
          <circle r="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" className="drop-shadow-sm" />
          <polygon points="0,-16 5,0 0,6 -5,0" fill="#ef4444" />
          <polygon points="0,16 5,0 0,-6 -5,0" fill="#94a3b8" />
          <text x="0" y="-19" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            N
          </text>
        </g>
      </svg>

      {/* Floating Controls: Zoom, Pan, Fit, Fullscreen */}
      <div className="absolute top-4 right-4 z-20">
        <MapControls
          zoom={viewport.zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
          onFitScreen={handleFitScreen}
          showPaths={showPaths}
          onTogglePaths={() => setShowPaths(!showPaths)}
          showLabels={showLabels}
          onToggleLabels={() => setShowLabels(!showLabels)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          onOpenLegend={() => setIsLegendOpen(!isLegendOpen)}
        />
      </div>

      {/* Floating Legend Card (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-20">
        <MapLegend
          isOpen={isLegendOpen}
          onClose={() => setIsLegendOpen(false)}
        />
      </div>

      {/* Right Location Information Panel (When a building or marker is selected) */}
      {(selectedLocation || selectedBuilding) && (
        <div className="absolute top-4 right-16 bottom-4 z-30 pointer-events-auto">
          <LocationPanel
            selectedLocation={selectedLocation}
            selectedBuilding={selectedBuilding}
            onClose={() => {
              onSelectLocation(null);
              onSelectBuilding(null);
            }}
            onGetDirections={onGetDirections}
          />
        </div>
      )}

      {/* Floating Status / Instructions Pill */}
      <div className="absolute top-4 left-4 z-10 hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-sm text-xs text-slate-600 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Click any building or marker to view details • Drag to move</span>
      </div>
    </div>
  );
};
