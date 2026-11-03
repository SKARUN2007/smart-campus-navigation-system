import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const buildings = await prisma.building.findMany({
      include: {
        category: true,
        _count: {
          select: {
            locations: true,
            facilities: true,
            navigationNodes: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return successResponse(buildings);
  } catch (err: any) {
    console.error('List buildings error:', err);
    return errorResponse('Failed to retrieve buildings', 500, err?.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      code,
      name,
      description,
      floors = 1,
      svgX = 0,
      svgY = 0,
      svgWidth = 120,
      svgHeight = 90,
      latitude,
      longitude,
      openingHours,
      contactPhone,
      contactEmail,
      wheelchairAccessible = true,
      categoryId,
    } = body;

    if (!name?.trim()) {
      return errorResponse('Building name is required', 400);
    }
    if (!code?.trim()) {
      return errorResponse('Building code is required', 400);
    }

    const cleanCode = code.trim().toUpperCase();

    const existing = await prisma.building.findUnique({
      where: { code: cleanCode },
    });
    if (existing) {
      return errorResponse(`Building code "${cleanCode}" already exists`, 409);
    }

    const created = await prisma.building.create({
      data: {
        code: cleanCode,
        buildingCode: cleanCode,
        name: name.trim(),
        description: description?.trim() || null,
        floors: Number(floors) || 1,
        svgX: Number(svgX) || 0,
        svgY: Number(svgY) || 0,
        svgWidth: Number(svgWidth) || 120,
        svgHeight: Number(svgHeight) || 90,
        latitude: latitude !== undefined ? Number(latitude) : null,
        longitude: longitude !== undefined ? Number(longitude) : null,
        openingHours: openingHours?.trim() || null,
        contactPhone: contactPhone?.trim() || null,
        contactEmail: contactEmail?.trim() || null,
        wheelchairAccessible: Boolean(wheelchairAccessible),
        categoryId: categoryId || null,
      },
      include: {
        category: true,
      },
    });

    return successResponse(created, 'Building created successfully', 201);
  } catch (err: any) {
    console.error('Create building error:', err);
    return errorResponse('Failed to create building', 500, err?.message);
  }
}

