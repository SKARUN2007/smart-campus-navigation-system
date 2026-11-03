import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const location = await prisma.location.findFirst({
      where: {
        OR: [{ id }, { code: id.toUpperCase() }],
      },
      include: {
        category: true,
        building: true,
        navigationNode: true,
      },
    });

    if (!location) {
      return errorResponse('Location not found', 404);
    }

    return successResponse(location);
  } catch (err: any) {
    console.error('Get location error:', err);
    return errorResponse('Failed to retrieve location details', 500, err?.message);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.location.findUnique({
      where: { id },
    });
    if (!existing) {
      return errorResponse('Location not found', 404);
    }

    const {
      name,
      code,
      description,
      locationType,
      mapX,
      mapY,
      openingHours,
      accessibility,
      floorNumber,
      roomNumber,
      categoryId,
      buildingId,
      navigationNodeId,
      isPopular,
      tags,
    } = body;

    const updated = await prisma.location.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        code: code !== undefined ? (code ? code.trim().toUpperCase() : null) : undefined,
        description: description !== undefined ? description?.trim() : undefined,
        locationType: locationType !== undefined ? locationType : undefined,
        mapX: mapX !== undefined ? Number(mapX) : undefined,
        mapY: mapY !== undefined ? Number(mapY) : undefined,
        openingHours: openingHours !== undefined ? openingHours : undefined,
        accessibility: accessibility !== undefined ? Boolean(accessibility) : undefined,
        floorNumber: floorNumber !== undefined ? Number(floorNumber) : undefined,
        roomNumber: roomNumber !== undefined ? roomNumber?.trim() : undefined,
        categoryId: categoryId !== undefined ? categoryId : undefined,
        buildingId: buildingId !== undefined ? buildingId : undefined,
        navigationNodeId: navigationNodeId !== undefined ? navigationNodeId : undefined,
        isPopular: isPopular !== undefined ? Boolean(isPopular) : undefined,
        tags: Array.isArray(tags) ? tags : undefined,
      },
      include: {
        category: true,
        building: true,
        navigationNode: true,
      },
    });

    return successResponse(updated, 'Location updated successfully');
  } catch (err: any) {
    console.error('Update location error:', err);
    return errorResponse('Failed to update location', 500, err?.message);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.location.findUnique({
      where: { id },
    });
    if (!existing) {
      return errorResponse('Location not found', 404);
    }

    // Clean up relations that reference this location safely
    await prisma.favourite.deleteMany({
      where: { locationId: id },
    });

    await prisma.navigationHistory.updateMany({
      where: { startLocationId: id },
      data: { startLocationId: null },
    });

    await prisma.navigationHistory.updateMany({
      where: { destinationLocationId: id },
      data: { destinationLocationId: null },
    });

    await prisma.location.delete({
      where: { id },
    });

    return successResponse({ deletedId: id }, 'Location deleted successfully');
  } catch (err: any) {
    console.error('Delete location error:', err);
    return errorResponse('Failed to delete location', 500, err?.message);
  }
}
