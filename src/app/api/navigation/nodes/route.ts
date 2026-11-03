import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const nodes = await prisma.navigationNode.findMany({
      include: {
        building: true,
        locations: true,
        outgoingEdges: {
          include: { toNode: true },
        },
      },
      orderBy: { label: 'asc' },
    });

    return successResponse(nodes);
  } catch (err: any) {
    console.error('List navigation nodes error:', err);
    return errorResponse('Failed to retrieve navigation nodes', 500, err?.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { label, name, x, y, latitude, longitude, floor = 0, isOutdoor = true, buildingId } = body;

    if (!name?.trim()) {
      return errorResponse('Node name is required', 400);
    }
    if (x === undefined || y === undefined) {
      return errorResponse('Node map coordinates (x, y) are required', 400);
    }

    const cleanLabel = (label || `node_${Date.now()}`).toUpperCase().trim().replace(/[^A-Z0-9_]/g, '_');

    const existing = await prisma.navigationNode.findUnique({
      where: { label: cleanLabel },
    });
    if (existing) {
      return errorResponse(`Node with label "${cleanLabel}" already exists`, 409);
    }

    const created = await prisma.navigationNode.create({
      data: {
        label: cleanLabel,
        name: name.trim(),
        x: Number(x),
        y: Number(y),
        latitude: latitude !== undefined ? Number(latitude) : null,
        longitude: longitude !== undefined ? Number(longitude) : null,
        floor: Number(floor) || 0,
        isOutdoor: Boolean(isOutdoor),
        buildingId: buildingId || null,
      },
      include: {
        building: true,
      },
    });

    return successResponse(created, 'Navigation node created successfully', 201);
  } catch (err: any) {
    console.error('Create navigation node error:', err);
    return errorResponse('Failed to create navigation node', 500, err?.message);
  }
}
