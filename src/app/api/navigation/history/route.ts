import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { getAuthUser } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    const url = new URL(req.url);
    const limit = Math.min(Number(url.searchParams.get('limit')) || 20, 100);

    const history = await prisma.navigationHistory.findMany({
      where: user ? { userId: user.id } : {},
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        startLocation: {
          include: { building: true, category: true },
        },
        destinationLocation: {
          include: { building: true, category: true },
        },
      },
    });

    return successResponse(history);
  } catch (err: any) {
    console.error('Get navigation history error:', err);
    return errorResponse('Failed to retrieve navigation history', 500, err?.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    const body = await req.json();
    const {
      startLocationId,
      destinationLocationId,
      totalDistance,
      estimatedTime,
      routeNodes = '',
    } = body;

    const distNum = Number(totalDistance) || 0;
    const durNum = Number(estimatedTime) || Math.ceil(distNum / 1.2);

    const record = await prisma.navigationHistory.create({
      data: {
        userId: user?.id || null,
        startLocationId: startLocationId || null,
        destinationLocationId: destinationLocationId || null,
        distanceMeters: distNum,
        durationSeconds: durNum,
        totalDistance: distNum,
        estimatedTime: durNum,
        routeNodes: String(routeNodes),
      },
      include: {
        startLocation: true,
        destinationLocation: true,
      },
    });

    return successResponse(record, 'Navigation history logged', 201);
  } catch (err: any) {
    console.error('Log navigation history error:', err);
    return errorResponse('Failed to log navigation history', 500, err?.message);
  }
}
