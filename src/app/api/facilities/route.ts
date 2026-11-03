import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const categoryId = url.searchParams.get('categoryId');
    const buildingId = url.searchParams.get('buildingId');
    const search = url.searchParams.get('q');

    const facilities = await prisma.facility.findMany({
      where: {
        AND: [
          categoryId ? { categoryId } : {},
          buildingId ? { buildingId } : {},
          search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
        ],
      },
      include: {
        category: true,
        building: true,
        navigationNode: true,
      },
      orderBy: { name: 'asc' },
    });

    return successResponse(facilities);
  } catch (err: any) {
    console.error('List facilities error:', err);
    return errorResponse('Failed to retrieve facilities', 500, err?.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      buildingId,
      categoryId,
      floorNumber = 0,
      openingHours,
      contactPhone,
      contactEmail,
      isWheelchairAccessible = true,
      navigationNodeId,
    } = body;

    if (!name?.trim()) {
      return errorResponse('Facility name is required', 400);
    }
    if (!categoryId) {
      return errorResponse('Category ID is required', 400);
    }

    const created = await prisma.facility.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        buildingId: buildingId || null,
        categoryId,
        floorNumber: Number(floorNumber) || 0,
        openingHours: openingHours?.trim() || null,
        contactPhone: contactPhone?.trim() || null,
        contactEmail: contactEmail?.trim() || null,
        isWheelchairAccessible: Boolean(isWheelchairAccessible),
        navigationNodeId: navigationNodeId || null,
      },
      include: {
        category: true,
        building: true,
      },
    });

    return successResponse(created, 'Facility created successfully', 201);
  } catch (err: any) {
    console.error('Create facility error:', err);
    return errorResponse('Failed to create facility', 500, err?.message);
  }
}
