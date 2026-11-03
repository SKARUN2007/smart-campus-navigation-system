export const DEFAULT_WALKING_SPEED_MPS = 1.2; // 1.2 metres per second

export function calculateWalkingTimeSeconds(
  distanceMeters: number,
  speedMps: number = DEFAULT_WALKING_SPEED_MPS
): number {
  if (distanceMeters <= 0 || speedMps <= 0) return 0;
  return Math.round(distanceMeters / speedMps);
}

export function formatWalkingTime(seconds: number): string {
  if (seconds <= 0) return '0 sec';
  if (seconds < 60) return `${seconds} sec`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${remainingSeconds} sec`;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
}

export function estimateCaloriesBurned(distanceMeters: number): number {
  // Approximate standard 0.05 kcal burned per meter of moderate walking
  return Math.round(distanceMeters * 0.048);
}

