import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { getAuthUser } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return errorResponse('Unauthorized. Please sign in.', 401);
    }

    const fullProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        studentId: true,
        avatar: true,
        createdAt: true,
        favourites: {
          include: {
            location: {
              include: {
                building: true,
                category: true,
              },
            },
          },
        },
        navigationHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            startLocation: true,
            destinationLocation: true,
          },
        },
      },
    });

    return successResponse(fullProfile);
  } catch (err: any) {
    console.error('Get profile error:', err);
    return errorResponse('Failed to retrieve user profile', 500, err?.message);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return errorResponse('Unauthorized. Please sign in.', 401);
    }

    const body = await req.json();
    const { name, department, studentId, avatar } = body;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        department: department !== undefined ? department.trim() : undefined,
        studentId: studentId !== undefined ? studentId.trim() : undefined,
        avatar: avatar !== undefined ? avatar.trim() : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        studentId: true,
        avatar: true,
        updatedAt: true,
      },
    });

    return successResponse(updated, 'Profile updated successfully');
  } catch (err: any) {
    console.error('Update profile error:', err);
    return errorResponse('Failed to update profile', 500, err?.message);
  }
}

