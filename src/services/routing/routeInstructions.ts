import { CampusEdge, CampusNode, CampusLocationItem } from '@/types/campus';
import { formatDistance, calculateWalkingTimeSeconds, formatWalkingTime } from './routeMetrics';

export type StepActionType =
  | 'START'
  | 'STRAIGHT'
  | 'TURN_LEFT'
  | 'TURN_RIGHT'
  | 'SLIGHT_LEFT'
  | 'SLIGHT_RIGHT'
  | 'RAMP'
  | 'STAIRS'
  | 'ARRIVE';

export interface StepInstruction {
  stepNumber: number;
  action: StepActionType;
  instruction: string;
  fromNodeName: string;
  toNodeName: string;
  distanceMeters: number;
  durationSeconds: number;
  formattedDistance: string;
  formattedDuration: string;
  isAccessible: boolean;
  pathwayType: string;
}

export function generateRouteInstructions(
  pathNodes: CampusNode[],
  pathEdges: CampusEdge[],
  startLocationName: string,
  destinationLocationName: string
): StepInstruction[] {
  if (pathNodes.length === 0) return [];

  // Trivial same node
  if (pathNodes.length === 1) {
    return [
      {
        stepNumber: 1,
        action: 'ARRIVE',
        instruction: `You are already at ${destinationLocationName}.`,
        fromNodeName: startLocationName,
        toNodeName: destinationLocationName,
        distanceMeters: 0,
        durationSeconds: 0,
        formattedDistance: '0 m',
        formattedDuration: '0 sec',
        isAccessible: true,
        pathwayType: 'WALKWAY',
      },
    ];
  }

  const instructions: StepInstruction[] = [];

  for (let i = 0; i < pathEdges.length; i++) {
    const currentEdge = pathEdges[i];
    const fromNode = pathNodes[i];
    const toNode = pathNodes[i + 1];

    const dist = currentEdge.distance;
    const dur = calculateWalkingTimeSeconds(dist);
    const edgeLabel = currentEdge.label || 'campus walkway';

    let action: StepActionType = 'STRAIGHT';
    let text = '';

    if (i === 0) {
      // Starting step
      action = 'START';
      text = `Start from ${startLocationName} and proceed along ${edgeLabel} towards ${toNode.name}.`;
    } else {
      // Determine turn angle between previous segment and current segment
      const prevNode = pathNodes[i - 1];
      const v1x = fromNode.x - prevNode.x;
      const v1y = fromNode.y - prevNode.y;
      const v2x = toNode.x - fromNode.x;
      const v2y = toNode.y - fromNode.y;

      const crossProduct = v1x * v2y - v1y * v2x;
      const dotProduct = v1x * v2x + v1y * v2y;
      const angleRad = Math.atan2(crossProduct, dotProduct);
      const angleDeg = (angleRad * 180) / Math.PI;

      if (currentEdge.pathwayType === 'RAMP') {
        action = 'RAMP';
        text = `Take the accessible ramp along ${edgeLabel} towards ${toNode.name}.`;
      } else if (currentEdge.pathwayType === 'STAIRS') {
        action = 'STAIRS';
        text = `Take the staircase along ${edgeLabel} towards ${toNode.name}.`;
      } else if (angleDeg > 35 && angleDeg <= 115) {
        action = 'TURN_RIGHT';
        text = `Turn right onto ${edgeLabel} and continue towards ${toNode.name}.`;
      } else if (angleDeg > 15 && angleDeg <= 35) {
        action = 'SLIGHT_RIGHT';
        text = `Bear slightly right along ${edgeLabel} towards ${toNode.name}.`;
      } else if (angleDeg < -35 && angleDeg >= -115) {
        action = 'TURN_LEFT';
        text = `Turn left onto ${edgeLabel} and continue towards ${toNode.name}.`;
      } else if (angleDeg < -15 && angleDeg >= -35) {
        action = 'SLIGHT_LEFT';
        text = `Bear slightly left along ${edgeLabel} towards ${toNode.name}.`;
      } else {
        action = 'STRAIGHT';
        text = `Continue straight along ${edgeLabel} towards ${toNode.name}.`;
      }
    }

    instructions.push({
      stepNumber: i + 1,
      action,
      instruction: text,
      fromNodeName: fromNode.name,
      toNodeName: toNode.name,
      distanceMeters: dist,
      durationSeconds: dur,
      formattedDistance: formatDistance(dist),
      formattedDuration: formatWalkingTime(dur),
      isAccessible: currentEdge.accessible,
      pathwayType: currentEdge.pathwayType,
    });
  }

  // Final destination arrival step
  instructions.push({
    stepNumber: instructions.length + 1,
    action: 'ARRIVE',
    instruction: `Arrive at your destination: ${destinationLocationName}.`,
    fromNodeName: pathNodes[pathNodes.length - 1].name,
    toNodeName: destinationLocationName,
    distanceMeters: 0,
    durationSeconds: 0,
    formattedDistance: '0 m',
    formattedDuration: '0 sec',
    isAccessible: true,
    pathwayType: 'WALKWAY',
  });

  return instructions;
}

