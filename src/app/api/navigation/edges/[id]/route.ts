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

    const existing = await prisma.navigationEdge.findUnique({
      where: { id },
    });
    if (!existing) {
      return errorResponse('Navigation edge not found', 404);
    }

    const { distance, walkingTime, accessible, available, pathwayType, instruction } = body;

    const distNum = distance !== undefined ? Number(distance) : existing.distance;
    const durNum =
      walkingTime !== undefined
        ? Number(walkingTime)
        : Math.ceil(distNum / 1.2);

    const updated = await prisma.navigationEdge.update({
      where: { id },
      data: {
        distance: distNum,
        walkingTime: durNum,
        accessible: accessible !== undefined ? Boolean(accessible) : undefined,
        available: available !== undefined ? Boolean(available) : undefined,
        isAccessible: accessible !== undefined ? Boolean(accessible) : undefined,
        isPathAvailable: available !== undefined ? Boolean(available) : undefined,
        pathType: pathwayType !== undefined ? pathwayType : undefined,
        pathwayType: pathwayType !== undefined ? pathwayType : undefined,
        instruction: instruction !== undefined ? instruction : undefined,
      },
      include: {
        fromNode: true,
        toNode: true,
      },
    });

    return successResponse(updated, 'Navigation edge updated successfully');
  } catch (err: any) {
    console.error('Update navigation edge error:', err);
    return errorResponse('Failed to update navigation edge', 500, err?.message);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.navigationEdge.findUnique({
      where: { id },
    });
    if (!existing) {
      return errorResponse('Navigation edge not found', 404);
    }

    await prisma.navigationEdge.delete({
      where: { id },
    });

    return successResponse({ deletedId: id }, 'Navigation edge deleted successfully');
  } catch (err: any) {
    console.error('Delete navigation edge error:', err);
    return errorResponse('Failed to delete navigation edge', 500, err?.message);
  }
}
