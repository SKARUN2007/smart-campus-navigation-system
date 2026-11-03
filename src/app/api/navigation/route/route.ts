import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { defaultRouteService } from '@/services/routing/routeService';
import { getAuthUser } from '@/lib/auth-utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { startQuery, destinationQuery, preferAccessible = false, recordHistory = true } = body;

    if (!startQuery || !destinationQuery) {
      return errorResponse('Both startQuery and destinationQuery are required', 400);
    }

    const routeResult = defaultRouteService.findRoutes({
      startQuery,
      destinationQuery,
      preferAccessible: Boolean(preferAccessible),
    });

    if (!routeResult.success) {
      return errorResponse(routeResult.error || 'Failed to calculate campus route', 400, {
        startLocation: routeResult.startLocation,
        destinationLocation: routeResult.destinationLocation,
      });
    }

    // Optional history recording
    if (recordHistory && routeResult.routes.length > 0) {
      try {
        const user = await getAuthUser(req);
        const primaryRoute = routeResult.routes[0];

        // Resolve matching database location IDs if available
        let dbStartId: string | null = null;
        let dbDestId: string | null = null;

        if (routeResult.startLocation) {
          const dbStart = await prisma.location.findFirst({
            where: {
              OR: [
                { name: { equals: routeResult.startLocation.name, mode: 'insensitive' } },
                { code: routeResult.startLocation.code },
              ],
            },
            select: { id: true },
          });
          if (dbStart) dbStartId = dbStart.id;
        }

        if (routeResult.destinationLocation) {
          const dbDest = await prisma.location.findFirst({
            where: {
              OR: [
                { name: { equals: routeResult.destinationLocation.name, mode: 'insensitive' } },
                { code: routeResult.destinationLocation.code },
              ],
            },
            select: { id: true },
          });
          if (dbDest) dbDestId = dbDest.id;
        }

        await prisma.navigationHistory.create({
          data: {
            userId: user?.id || null,
            startLocationId: dbStartId,
            destinationLocationId: dbDestId,
            distanceMeters: primaryRoute.totalDistanceMeters,
            durationSeconds: primaryRoute.totalDurationSeconds,
            totalDistance: primaryRoute.totalDistanceMeters,
            estimatedTime: primaryRoute.totalDurationSeconds,
            routeNodes: primaryRoute.nodes.map((n) => n.id).join(' -> '),
          },
        });
      } catch (historyErr) {
        // Non-blocking: If recording history encounters an issue, don't fail the route response
        console.warn('Navigation history record notice:', historyErr);
      }
    }

    return successResponse(routeResult);
  } catch (err: any) {
    console.error('Calculate route API error:', err);
    return errorResponse('Internal error during route calculation', 500, err?.message);
  }
}

