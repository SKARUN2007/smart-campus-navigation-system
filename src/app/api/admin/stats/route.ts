import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { getAuthUser } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    // Optional role verification: check if user is ADMIN or STAFF
    // For convenience in demo, if no user is signed in yet, we still provide stats or check role

    const [
      buildingsCount,
      locationsCount,
      facilitiesCount,
      categoriesCount,
      nodesCount,
      edgesCount,
      usersCount,
      historyCount,
    ] = await Promise.all([
      prisma.building.count(),
      prisma.location.count(),
      prisma.facility.count(),
      prisma.category.count(),
      prisma.navigationNode.count(),
      prisma.navigationEdge.count(),
      prisma.user.count(),
      prisma.navigationHistory.count(),
    ]);

    // Top navigated destinations
    const topDestinationsRaw = await prisma.navigationHistory.groupBy({
      by: ['destinationLocationId'],
      _count: {
        id: true,
      },
      where: {
        destinationLocationId: { not: null },
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 5,
    });

    const topDestinations = await Promise.all(
      topDestinationsRaw.map(async (item) => {
        if (!item.destinationLocationId) return null;
        const loc = await prisma.location.findUnique({
          where: { id: item.destinationLocationId },
          select: { name: true, code: true, category: { select: { name: true } } },
        });
        return {
          locationId: item.destinationLocationId,
          name: loc?.name || 'Unknown Location',
          category: loc?.category?.name || 'General',
          requestsCount: item._count.id,
        };
      })
    );

    // User breakdown by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true,
      },
    });

    // Recent navigation activities
    const recentActivity = await prisma.navigationHistory.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        startLocation: { select: { name: true } },
        destinationLocation: { select: { name: true } },
        user: { select: { name: true, role: true } },
      },
    });

    return successResponse({
      counts: {
        buildings: buildingsCount,
        locations: locationsCount,
        facilities: facilitiesCount,
        categories: categoriesCount,
        nodes: nodesCount,
        edges: edgesCount,
        users: usersCount,
        navigationRequests: historyCount,
      },
      topDestinations: topDestinations.filter(Boolean),
      usersByRole: usersByRole.map((u) => ({ role: u.role, count: u._count.id })),
      recentActivity,
    });
  } catch (err: any) {
    console.error('Admin stats error:', err);
    return errorResponse('Failed to retrieve system statistics', 500, err?.message);
  }
}
