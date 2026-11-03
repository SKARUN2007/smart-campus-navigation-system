'use client';

import React from 'react';
import { CampusEdge, CampusNode } from '@/types/campus';

export interface CampusPathProps {
  edge: CampusEdge;
  nodesMap: Map<string, CampusNode>;
  isHighlighted?: boolean;
}

export const CampusPath: React.FC<CampusPathProps> = ({
  edge,
  nodesMap,
  isHighlighted = false,
}) => {
  const fromNode = nodesMap.get(edge.from);
  const toNode = nodesMap.get(edge.to);

  if (!fromNode || !toNode) return null;

  const isRoad = edge.pathwayType === 'ROAD';
  const isRamp = edge.pathwayType === 'RAMP';

  const strokeWidth = isHighlighted ? (isRoad ? 14 : 10) : isRoad ? 10 : isRamp ? 7 : 6;
  const strokeColor = isHighlighted
    ? '#06b6d4'
    : isRoad
    ? '#94a3b8'
    : isRamp
    ? '#38bdf8'
    : '#cbd5e1';

  return (
    <g id={`path-${edge.id}`} className="transition-all duration-300">
      {/* Glow for highlighted paths */}
      {isHighlighted && (
        <line
          x1={fromNode.x}
          y1={fromNode.y}
          x2={toNode.x}
          y2={toNode.y}
          stroke="#06b6d4"
          strokeWidth={strokeWidth + 8}
          strokeLinecap="round"
          opacity="0.3"
          className="animate-pulse"
        />
      )}

      {/* Base Path Line */}
      <line
        x1={fromNode.x}
        y1={fromNode.y}
        x2={toNode.x}
        y2={toNode.y}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={isRamp ? '4 3' : undefined}
      />

      {/* Inner Center Dash for Roads or Walkways */}
      {isRoad && (
        <line
          x1={fromNode.x}
          y1={fromNode.y}
          x2={toNode.x}
          y2={toNode.y}
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="6 6"
        />
      )}

      {/* Animated Dash overlay when path is selected/active */}
      {isHighlighted && (
        <line
          x1={fromNode.x}
          y1={fromNode.y}
          x2={toNode.x}
          y2={toNode.y}
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="6 6"
          className="animate-[dash_1.5s_linear_infinite]"
        />
      )}
    </g>
  );
};
