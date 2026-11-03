import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const categorySlug = url.searchParams.get('category');
    const buildingCode = url.searchParams.get('building');
    const isPopular = url.searchParams.get('popular');
    const search = url.searchParams.get('q');

    const locations = await prisma.location.findMany({
      where: {
        AND: [
          categorySlug
            ? {
                category: {
                  slug: categorySlug,
                },
              }
            : {},
          buildingCode
            ? {
                building: {
                  code: buildingCode,
                },
              }
            : {},
          isPopular === 'true' ? { isPopular: true } : {},
          search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                  { code: { contains: search, mode: 'insensitive' } },
                  { tags: { has: search.toLowerCase() } },
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

    return successResponse(locations);
  } catch (err: any) {
    console.error('List locations error:', err);
    return errorResponse('Failed to retrieve locations', 500, err?.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      code,
      description,
      locationType = 'Department',
      mapX,
      mapY,
      openingHours,
      accessibility = true,
      floorNumber = 0,
      roomNumber,
      categoryId,
      buildingId,
      navigationNodeId,
      isPopular = false,
      tags = [],
    } = body;

    if (!name?.trim()) {
      return errorResponse('Location name is required', 400);
    }
    if (!categoryId) {
      return errorResponse('Category ID is required', 400);
    }

    // Verify category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExists) {
      return errorResponse('Specified category does not exist', 400);
    }

    // Check code uniqueness if provided
    if (code) {
      const codeExists = await prisma.location.findUnique({
        where: { code: code.trim().toUpperCase() },
      });
      if (codeExists) {
        return errorResponse(`Location code "${code}" already exists`, 409);
      }
    }

    const created = await prisma.location.create({
      data: {
        name: name.trim(),
        code: code ? code.trim().toUpperCase() : null,
        description: description?.trim() || null,
        locationType,
        mapX: mapX !== undefined ? Number(mapX) : null,
        mapY: mapY !== undefined ? Number(mapY) : null,
        openingHours: openingHours?.trim() || null,
        accessibility: Boolean(accessibility),
        floorNumber: Number(floorNumber) || 0,
        roomNumber: roomNumber?.trim() || null,
        categoryId,
        buildingId: buildingId || null,
        navigationNodeId: navigationNodeId || null,
        isPopular: Boolean(isPopular),
        tags: Array.isArray(tags) ? tags : [],
      },
      include: {
        category: true,
        building: true,
        navigationNode: true,
      },
    });

    return successResponse(created, 'Location created successfully', 201);
  } catch (err: any) {
    console.error('Create location error:', err);
    return errorResponse('Failed to create location', 500, err?.message);
  }
}
