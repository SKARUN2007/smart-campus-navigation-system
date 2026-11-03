import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q')?.trim() || '';
    const limit = Math.min(Number(url.searchParams.get('limit')) || 10, 50);

    if (!query) {
      const all = await prisma.facility.findMany({
        take: limit,
        include: {
          category: true,
          building: true,
        },
      });
      return successResponse(all);
    }

    const facilities = await prisma.facility.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { building: { name: { contains: query, mode: 'insensitive' } } },
          { category: { name: { contains: query, mode: 'insensitive' } } },
        ],
      },
      take: limit,
      include: {
        category: true,
        building: true,
      },
      orderBy: { name: 'asc' },
    });

    return successResponse(facilities);
  } catch (err: any) {
    console.error('Search facilities error:', err);
    return errorResponse('Facility search failed', 500, err?.message);
  }
}
