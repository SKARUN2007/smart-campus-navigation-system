'use client';

import React from 'react';
import { CampusLocationItem } from '@/types/campus';

export interface CampusMarkerProps {
  location: CampusLocationItem;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (location: CampusLocationItem) => void;
  onHover: (location: CampusLocationItem | null) => void;
}

export const CampusMarker: React.FC<CampusMarkerProps> = ({
  location,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}) => {
  const { markerX, markerY, name, category } = location;

  // Category Colors
  const categoryColors: Record<string, { fill: string; stroke: string; iconChar: string }> = {
    academic: { fill: '#2563eb', stroke: '#1d4ed8', iconChar: 'A' },
    administrative: { fill: '#0f172a', stroke: '#334155', iconChar: 'AD' },
    laboratories: { fill: '#0891b2', stroke: '#0e7490', iconChar: 'L' },
    library: { fill: '#0d9488', stroke: '#0f766e', iconChar: 'LIB' },
    food: { fill: '#d97706', stroke: '#b45309', iconChar: 'F' },
    sports: { fill: '#16a34a', stroke: '#15803d', iconChar: 'S' },
    medical: { fill: '#dc2626', stroke: '#b91c1c', iconChar: '+' },
    parking: { fill: '#475569', stroke: '#334155', iconChar: 'P' },
    hostel: { fill: '#7c3aed', stroke: '#6d28d9', iconChar: 'H' },
    entrance: { fill: '#0284c7', stroke: '#0369a1', iconChar: 'G' },
  };

  const style = categoryColors[category] || { fill: '#2563eb', stroke: '#1d4ed8', iconChar: '•' };

  return (
    <g
      id={`marker-${location.id}`}
      transform={`translate(${markerX}, ${markerY})`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(location);
      }}
      onMouseEnter={() => onHover(location)}
      onMouseLeave={() => onHover(null)}
      className="cursor-pointer transition-transform duration-200 select-none group"
    >
      {/* Pulsing Highlight Rings when Selected */}
      {isSelected && (
        <>
          <circle r="22" fill={style.fill} opacity="0.3" className="animate-ping" />
          <circle r="16" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="3 3" />
        </>
      )}

      {/* Pin Shadow */}
      <ellipse cx="0" cy="18" rx="8" ry="3" fill="#0f172a" opacity="0.25" />

      {/* Classic Teardrop Pin Shape */}
      <path
        d="M 0 -22 C -11 -22, -14 -10, 0 16 C 14 -10, 11 -22, 0 -22 Z"
        fill={isSelected ? '#06b6d4' : isHovered ? '#1d4ed8' : style.fill}
        stroke="#ffffff"
        strokeWidth="2"
        className="transition-colors duration-150 drop-shadow-md"
      />

      {/* Inner Pin Circle */}
      <circle cx="0" cy="-10" r="7" fill="#ffffff" />

      {/* Marker Category / Symbol */}
      <text
        x="0"
        y="-7"
        fill={isSelected ? '#0891b2' : style.stroke}
        fontSize="7"
        fontWeight="800"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        {style.iconChar}
      </text>

      {/* Name Label Floating Badge (Always visible if selected/hovered, or compact tag) */}
      {(isSelected || isHovered) && (
        <g transform="translate(0, -32)" className="pointer-events-none">
          {/* Label Background */}
          <rect
            x={-(name.length * 3.5 + 10)}
            y="-14"
            width={name.length * 7 + 20}
            height="18"
            rx="5"
            fill="#0f172a"
            stroke="#ffffff"
            strokeWidth="1"
            className="drop-shadow-lg"
          />
          {/* Label Arrow Tail */}
          <polygon points="-4,4 4,4 0,8" fill="#0f172a" />
          {/* Text */}
          <text
            x="0"
            y="-2"
            fill="#ffffff"
            fontSize="9"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            {name}
          </text>
        </g>
      )}
    </g>
  );
};

