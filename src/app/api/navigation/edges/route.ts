import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const edges = await prisma.navigationEdge.findMany({
      include: {
        fromNode: true,
        toNode: true,
      },
      orderBy: { distance: 'asc' },
    });

    return successResponse(edges);
  } catch (err: any) {
    console.error('List navigation edges error:', err);
    return errorResponse('Failed to retrieve navigation edges', 500, err?.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fromNodeId,
      toNodeId,
      distance,
      walkingTime,
      accessible = true,
      available = true,
      pathwayType = 'WALKWAY',
      instruction,
      bidirectional = true,
    } = body;

    if (!fromNodeId || !toNodeId) {
      return errorResponse('fromNodeId and toNodeId are required', 400);
    }
    if (fromNodeId === toNodeId) {
      return errorResponse('fromNodeId and toNodeId cannot be the same', 400);
    }
    if (distance === undefined || Number(distance) <= 0) {
      return errorResponse('Distance must be a positive number greater than 0', 400);
    }

    const distNum = Number(distance);
    const durNum = walkingTime !== undefined ? Number(walkingTime) : Math.ceil(distNum / 1.2);

    // Verify both nodes exist
    const [fromNode, toNode] = await Promise.all([
      prisma.navigationNode.findUnique({ where: { id: fromNodeId } }),
      prisma.navigationNode.findUnique({ where: { id: toNodeId } }),
    ]);

    if (!fromNode || !toNode) {
      return errorResponse('One or both navigation nodes do not exist', 404);
    }

    // Create forward edge
    const edge = await prisma.navigationEdge.upsert({
      where: {
        fromNodeId_toNodeId: {
          fromNodeId,
          toNodeId,
        },
      },
      create: {
        fromNodeId,
        toNodeId,
        distance: distNum,
        walkingTime: durNum,
        accessible: Boolean(accessible),
        available: Boolean(available),
        isAccessible: Boolean(accessible),
        isPathAvailable: Boolean(available),
        pathType: pathwayType,
        pathwayType,
        instruction: instruction || `Walk along ${pathwayType.toLowerCase()} to ${toNode.name}`,
      },
      update: {
        distance: distNum,
        walkingTime: durNum,
        accessible: Boolean(accessible),
        available: Boolean(available),
        isAccessible: Boolean(accessible),
        isPathAvailable: Boolean(available),
        pathType: pathwayType,
        pathwayType,
        instruction: instruction || undefined,
      },
      include: {
        fromNode: true,
        toNode: true,
      },
    });

    // If bidirectional, ensure reverse edge also exists
    if (bidirectional) {
      await prisma.navigationEdge.upsert({
        where: {
          fromNodeId_toNodeId: {
            fromNodeId: toNodeId,
            toNodeId: fromNodeId,
          },
        },
        create: {
          fromNodeId: toNodeId,
          toNodeId: fromNodeId,
          distance: distNum,
          walkingTime: durNum,
          accessible: Boolean(accessible),
          available: Boolean(available),
          isAccessible: Boolean(accessible),
          isPathAvailable: Boolean(available),
          pathType: pathwayType,
          pathwayType,
          instruction: `Walk along ${pathwayType.toLowerCase()} to ${fromNode.name}`,
        },
        update: {
          distance: distNum,
          walkingTime: durNum,
          accessible: Boolean(accessible),
          available: Boolean(available),
          isAccessible: Boolean(accessible),
          isPathAvailable: Boolean(available),
          pathType: pathwayType,
          pathwayType,
        },
      });
    }

    return successResponse(edge, 'Navigation edge created successfully', 201);
  } catch (err: any) {
    console.error('Create navigation edge error:', err);
    return errorResponse('Failed to create navigation edge', 500, err?.message);
  }
}
