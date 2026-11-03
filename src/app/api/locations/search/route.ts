import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q')?.trim() || '';
    const limit = Math.min(Number(url.searchParams.get('limit')) || 10, 50);

    if (!query) {
      // If no query, return top popular locations
      const popular = await prisma.location.findMany({
        where: { isPopular: true },
        take: limit,
        include: {
          category: true,
          building: true,
        },
      });
      return successResponse(popular);
    }

    const locations = await prisma.location.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
          { building: { name: { contains: query, mode: 'insensitive' } } },
          { category: { name: { contains: query, mode: 'insensitive' } } },
          { tags: { has: query.toLowerCase() } },
        ],
      },
      take: limit,
      include: {
        category: true,
        building: true,
      },
      orderBy: [{ isPopular: 'desc' }, { name: 'asc' }],
    });

    return successResponse(locations);
  } catch (err: any) {
    console.error('Search locations error:', err);
    return errorResponse('Search failed', 500, err?.message);
  }
}

