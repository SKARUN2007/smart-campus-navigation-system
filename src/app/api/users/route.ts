import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { getAuthUser } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    // Optional check: in Phase 7 we enforce ADMIN, but in Phase 6 we return users safely without hashes
    const url = new URL(req.url);
    const search = url.searchParams.get('q') || '';
    const role = url.searchParams.get('role');

    const users = await prisma.user.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { email: { contains: search, mode: 'insensitive' } },
                  { department: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          role ? { role: role as any } : {},
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        studentId: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            favourites: true,
            navigationHistory: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(users);
  } catch (err: any) {
    console.error('List users error:', err);
    return errorResponse('Failed to retrieve users', 500, err?.message);
  }
}
