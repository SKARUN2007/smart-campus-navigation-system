'use client';

import React from 'react';
import { BuildingData } from '@/types/campus';

export interface CampusBuildingProps {
  building: BuildingData;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (building: BuildingData) => void;
  onHover: (building: BuildingData | null) => void;
}

export const CampusBuilding: React.FC<CampusBuildingProps> = ({
  building,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}) => {
  const { x, y, width, height, name, code, color, strokeColor, category } = building;

  return (
    <g
      id={`bldg-${building.id}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(building);
      }}
      onMouseEnter={() => onHover(building)}
      onMouseLeave={() => onHover(null)}
      className="cursor-pointer transition-all duration-200 select-none"
    >
      {/* Selection Glow Filter / Outline */}
      {isSelected && (
        <rect
          x={x - 6}
          y={y - 6}
          width={width + 12}
          height={height + 12}
          rx="16"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="4"
          className="animate-pulse"
          strokeDasharray="6 4"
        />
      )}

      {/* Building Base 3D Shadow Plate */}
      <rect
        x={x + 3}
        y={y + 6}
        width={width}
        height={height}
        rx="12"
        fill="#0f172a"
        opacity={isSelected ? '0.35' : isHovered ? '0.28' : '0.18'}
      />

      {/* Main Building Body */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="12"
        fill={isSelected ? '#0284c7' : isHovered ? strokeColor : color}
        stroke={isSelected ? '#ffffff' : '#cbd5e1'}
        strokeWidth={isSelected ? '3' : '1.5'}
        className="transition-colors duration-200"
      />

      {/* Architectural Roof / Inset Highlights */}
      <rect
        x={x + 8}
        y={y + 8}
        width={width - 16}
        height={height - 16}
        rx="8"
        fill="#ffffff"
        opacity={isSelected ? '0.18' : isHovered ? '0.12' : '0.08'}
      />

      {/* Architectural Windows or Skylights Grid */}
      <g opacity="0.25">
        <line x1={x + 14} y1={y + height / 2} x2={x + width - 14} y2={y + height / 2} stroke="#ffffff" strokeWidth="1" strokeDasharray="4 6" />
      </g>

      {/* Building Code Badge */}
      <rect
        x={x + 12}
        y={y + 12}
        width="38"
        height="18"
        rx="5"
        fill="#ffffff"
        opacity="0.9"
      />
      <text
        x={x + 31}
        y={y + 25}
        fill="#0f172a"
        fontSize="9"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        {code}
      </text>

      {/* Building Name Label */}
      <text
        x={x + width / 2}
        y={y + height / 2 + 5}
        fill="#ffffff"
        fontSize={width > 180 ? '11' : '10'}
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="sans-serif"
        className="pointer-events-none drop-shadow-sm"
      >
        {name.length > 24 ? name.substring(0, 22) + '...' : name}
      </text>

      {/* Subtitle / Category Label */}
      <text
        x={x + width / 2}
        y={y + height / 2 + 20}
        fill={isSelected ? '#cffafe' : '#e2e8f0'}
        fontSize="8"
        fontWeight="500"
        textAnchor="middle"
        fontFamily="sans-serif"
        className="pointer-events-none opacity-90"
      >
        {building.categoryLabel}
      </text>
    </g>
  );
};

