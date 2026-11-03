import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const building = await prisma.building.findFirst({
      where: {
        OR: [{ id }, { code: id.toUpperCase() }],
      },
      include: {
        category: true,
        locations: {
          include: { category: true },
        },
        facilities: {
          include: { category: true },
        },
        navigationNodes: true,
      },
    });

    if (!building) {
      return errorResponse('Building not found', 404);
    }

    return successResponse(building);
  } catch (err: any) {
    console.error('Get building error:', err);
    return errorResponse('Failed to retrieve building details', 500, err?.message);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.building.findUnique({
      where: { id },
    });
    if (!existing) {
      return errorResponse('Building not found', 404);
    }

    const {
      code,
      name,
      description,
      floors,
      svgX,
      svgY,
      svgWidth,
      svgHeight,
      latitude,
      longitude,
      openingHours,
      contactPhone,
      contactEmail,
      wheelchairAccessible,
      categoryId,
    } = body;

    const updated = await prisma.building.update({
      where: { id },
      data: {
        code: code !== undefined ? code.trim().toUpperCase() : undefined,
        buildingCode: code !== undefined ? code.trim().toUpperCase() : undefined,
        name: name !== undefined ? name.trim() : undefined,
        description: description !== undefined ? description?.trim() : undefined,
        floors: floors !== undefined ? Number(floors) : undefined,
        svgX: svgX !== undefined ? Number(svgX) : undefined,
        svgY: svgY !== undefined ? Number(svgY) : undefined,
        svgWidth: svgWidth !== undefined ? Number(svgWidth) : undefined,
        svgHeight: svgHeight !== undefined ? Number(svgHeight) : undefined,
        latitude: latitude !== undefined ? Number(latitude) : undefined,
        longitude: longitude !== undefined ? Number(longitude) : undefined,
        openingHours: openingHours !== undefined ? openingHours : undefined,
        contactPhone: contactPhone !== undefined ? contactPhone : undefined,
        contactEmail: contactEmail !== undefined ? contactEmail : undefined,
        wheelchairAccessible:
          wheelchairAccessible !== undefined ? Boolean(wheelchairAccessible) : undefined,
        categoryId: categoryId !== undefined ? categoryId : undefined,
      },
      include: {
        category: true,
      },
    });

    return successResponse(updated, 'Building updated successfully');
  } catch (err: any) {
    console.error('Update building error:', err);
    return errorResponse('Failed to update building', 500, err?.message);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.building.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            locations: true,
          },
        },
      },
    });

    if (!existing) {
      return errorResponse('Building not found', 404);
    }

    await prisma.building.delete({
      where: { id },
    });

    return successResponse({ deletedId: id }, 'Building deleted successfully');
  } catch (err: any) {
    console.error('Delete building error:', err);
    return errorResponse('Failed to delete building', 500, err?.message);
  }
}

