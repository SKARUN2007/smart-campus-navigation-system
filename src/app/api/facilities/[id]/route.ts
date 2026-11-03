import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const facility = await prisma.facility.findUnique({
      where: { id },
      include: {
        category: true,
        building: true,
        navigationNode: true,
      },
    });

    if (!facility) {
      return errorResponse('Facility not found', 404);
    }

    return successResponse(facility);
  } catch (err: any) {
    console.error('Get facility error:', err);
    return errorResponse('Failed to retrieve facility details', 500, err?.message);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.facility.findUnique({
      where: { id },
    });
    if (!existing) {
      return errorResponse('Facility not found', 404);
    }

    const {
      name,
      description,
      buildingId,
      categoryId,
      floorNumber,
      openingHours,
      contactPhone,
      contactEmail,
      isWheelchairAccessible,
      navigationNodeId,
    } = body;

    const updated = await prisma.facility.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        description: description !== undefined ? description?.trim() : undefined,
        buildingId: buildingId !== undefined ? buildingId : undefined,
        categoryId: categoryId !== undefined ? categoryId : undefined,
        floorNumber: floorNumber !== undefined ? Number(floorNumber) : undefined,
        openingHours: openingHours !== undefined ? openingHours : undefined,
        contactPhone: contactPhone !== undefined ? contactPhone : undefined,
        contactEmail: contactEmail !== undefined ? contactEmail : undefined,
        isWheelchairAccessible:
          isWheelchairAccessible !== undefined ? Boolean(isWheelchairAccessible) : undefined,
        navigationNodeId: navigationNodeId !== undefined ? navigationNodeId : undefined,
      },
      include: {
        category: true,
        building: true,
      },
    });

    return successResponse(updated, 'Facility updated successfully');
  } catch (err: any) {
    console.error('Update facility error:', err);
    return errorResponse('Failed to update facility', 500, err?.message);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.facility.findUnique({
      where: { id },
    });
    if (!existing) {
      return errorResponse('Facility not found', 404);
    }

    await prisma.facility.delete({
      where: { id },
    });

    return successResponse({ deletedId: id }, 'Facility deleted successfully');
  } catch (err: any) {
    console.error('Delete facility error:', err);
    return errorResponse('Failed to delete facility', 500, err?.message);
  }
}

