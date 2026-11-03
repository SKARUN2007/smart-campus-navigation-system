import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { getAuthUser } from '@/lib/auth-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
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
    });

    if (!user) return errorResponse('User not found', 404);
    return successResponse(user);
  } catch (err: any) {
    return errorResponse('Failed to retrieve user', 500, err?.message);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const currentUser = await getAuthUser(req);

    const { role, isActive, name, department, studentId } = body;

    // Safety: Prevent admin from removing their own admin role or deactivating themselves
    if (currentUser && currentUser.id === id) {
      if (role && role !== 'ADMIN' && currentUser.role === 'ADMIN') {
        return errorResponse('You cannot remove your own administrative access.', 400);
      }
      if (isActive === false) {
        return errorResponse('You cannot deactivate your own administrative account.', 400);
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        role: role ? (role as any) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        name: name !== undefined ? name.trim() : undefined,
        department: department !== undefined ? department.trim() : undefined,
        studentId: studentId !== undefined ? studentId.trim() : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        studentId: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return successResponse(updated, 'User updated successfully');
  } catch (err: any) {
    console.error('Update user error:', err);
    return errorResponse('Failed to update user', 500, err?.message);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getAuthUser(req);

    if (currentUser && currentUser.id === id) {
      return errorResponse('You cannot delete your own account.', 400);
    }

    await prisma.user.delete({
      where: { id },
    });

    return successResponse({ deletedId: id }, 'User deleted successfully');
  } catch (err: any) {
    console.error('Delete user error:', err);
    return errorResponse('Failed to delete user', 500, err?.message);
  }
}

