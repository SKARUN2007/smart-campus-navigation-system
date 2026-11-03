import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.navigationNode.findUnique({
      where: { id },
    });
    if (!existing) {
      return errorResponse('Navigation node not found', 404);
    }

    const { label, name, x, y, latitude, longitude, floor, isOutdoor, buildingId } = body;

    const updated = await prisma.navigationNode.update({
      where: { id },
      data: {
        label: label !== undefined ? label.trim().toUpperCase() : undefined,
        name: name !== undefined ? name.trim() : undefined,
        x: x !== undefined ? Number(x) : undefined,
        y: y !== undefined ? Number(y) : undefined,
        latitude: latitude !== undefined ? Number(latitude) : undefined,
        longitude: longitude !== undefined ? Number(longitude) : undefined,
        floor: floor !== undefined ? Number(floor) : undefined,
        isOutdoor: isOutdoor !== undefined ? Boolean(isOutdoor) : undefined,
        buildingId: buildingId !== undefined ? buildingId : undefined,
      },
    });

    return successResponse(updated, 'Navigation node updated successfully');
  } catch (err: any) {
    console.error('Update navigation node error:', err);
    return errorResponse('Failed to update navigation node', 500, err?.message);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.navigationNode.findUnique({
      where: { id },
    });
    if (!existing) {
      return errorResponse('Navigation node not found', 404);
    }

    // Prisma schema cascades deletion of edges attached to this node
    await prisma.navigationNode.delete({
      where: { id },
    });

    return successResponse({ deletedId: id }, 'Navigation node deleted successfully');
  } catch (err: any) {
    console.error('Delete navigation node error:', err);
    return errorResponse('Failed to delete navigation node', 500, err?.message);
  }
}

