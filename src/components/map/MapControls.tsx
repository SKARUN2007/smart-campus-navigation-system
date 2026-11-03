'use client';

import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Compass,
  Layers,
  HelpCircle,
} from 'lucide-react';

export interface MapControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onFitScreen: () => void;
  showPaths: boolean;
  onTogglePaths: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenLegend?: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  onFitScreen,
  showPaths,
  onTogglePaths,
  showLabels,
  onToggleLabels,
  isFullscreen,
  onToggleFullscreen,
  onOpenLegend,
}) => {
  return (
    <div className="flex flex-col gap-2 select-none">
      {/* Zoom & Reset Button Group */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-card border border-slate-200/90 p-1 flex flex-col gap-1">
        <button
          type="button"
          onClick={onZoomIn}
          disabled={zoom >= 3.0}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-700 transition-colors focus:outline-none"
          title="Zoom In (or Scroll Wheel Up)"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-4 h-4 stroke-[2.2]" />
        </button>

        <div className="px-1 py-0.5 text-[10px] font-bold text-center text-slate-500 border-y border-slate-100 font-mono">
          {Math.round(zoom * 100)}%
        </div>

        <button
          type="button"
          onClick={onZoomOut}
          disabled={zoom <= 0.6}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-700 transition-colors focus:outline-none"
          title="Zoom Out (or Scroll Wheel Down)"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 stroke-[2.2]" />
        </button>

        <button
          type="button"
          onClick={onResetView}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none"
          title="Reset to 100% Zoom"
          aria-label="Reset Zoom"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onFitScreen}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none"
          title="Fit Whole Campus to Screen"
          aria-label="Fit Campus"
        >
          <Compass className="w-4 h-4 text-cyan-600" />
        </button>
      </div>

      {/* Layer Toggles & Fullscreen */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-card border border-slate-200/90 p-1 flex flex-col gap-1">
        <button
          type="button"
          onClick={onTogglePaths}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors focus:outline-none ${
            showPaths
              ? 'bg-blue-50 text-blue-600 font-bold'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          title={showPaths ? 'Hide Walking Paths' : 'Show Walking Paths'}
          aria-label="Toggle Walking Paths"
        >
          <Layers className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onToggleFullscreen}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none"
          title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {onOpenLegend && (
          <button
            type="button"
            onClick={onOpenLegend}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none"
            title="Open Map Legend"
            aria-label="Open Map Legend"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
