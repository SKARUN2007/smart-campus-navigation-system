import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { getAuthUser } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    const url = new URL(req.url);
    const queryUserId = url.searchParams.get('userId') || user?.id;

    if (!queryUserId) {
      // If unauthenticated and no userId specified, return empty array gracefully
      return successResponse([]);
    }

    const favourites = await prisma.favourite.findMany({
      where: { userId: queryUserId },
      include: {
        location: {
          include: {
            building: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(favourites);
  } catch (err: any) {
    console.error('Get favourites error:', err);
    return errorResponse('Failed to retrieve favourites', 500, err?.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    const body = await req.json();
    const { locationId, userId } = body;

    const targetUserId = userId || user?.id;
    if (!targetUserId) {
      return errorResponse('User ID or active sign-in session is required to save favourites', 401);
    }
    if (!locationId) {
      return errorResponse('locationId is required', 400);
    }

    // Verify location exists
    const location = await prisma.location.findUnique({
      where: { id: locationId },
    });
    if (!location) {
      return errorResponse('Location not found', 404);
    }

    // Upsert favourite
    const fav = await prisma.favourite.upsert({
      where: {
        userId_locationId: {
          userId: targetUserId,
          locationId,
        },
      },
      create: {
        userId: targetUserId,
        locationId,
      },
      update: {},
      include: {
        location: {
          include: {
            building: true,
            category: true,
          },
        },
      },
    });

    return successResponse(fav, 'Location added to favourites', 201);
  } catch (err: any) {
    console.error('Add favourite error:', err);
    return errorResponse('Failed to add favourite', 500, err?.message);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    const url = new URL(req.url);
    const locationId = url.searchParams.get('locationId');
    const favouriteId = url.searchParams.get('id');
    const queryUserId = url.searchParams.get('userId') || user?.id;

    if (favouriteId) {
      await prisma.favourite.delete({
        where: { id: favouriteId },
      });
      return successResponse({ deletedId: favouriteId }, 'Favourite removed');
    }

    if (locationId && queryUserId) {
      await prisma.favourite.deleteMany({
        where: {
          userId: queryUserId,
          locationId,
        },
      });
      return successResponse({ locationId }, 'Favourite removed');
    }

    return errorResponse('Either favourite id or locationId with userId must be provided', 400);
  } catch (err: any) {
    console.error('Delete favourite error:', err);
    return errorResponse('Failed to remove favourite', 500, err?.message);
  }
}

