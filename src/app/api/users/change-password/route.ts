import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { getAuthUser, verifyPassword, hashPassword } from '@/lib/auth-utils';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return errorResponse('Unauthorized. Please sign in.', 401);
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return errorResponse('Current password and new password are required', 400);
    }

    if (newPassword.length < 6) {
      return errorResponse('New password must be at least 6 characters long', 400);
    }

    // Fetch user with passwordHash
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return errorResponse('User not found', 404);
    }

    const isValid = await verifyPassword(currentPassword, dbUser.passwordHash);
    if (!isValid) {
      return errorResponse('Current password is incorrect', 400);
    }

    const newHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    return successResponse({ success: true }, 'Password changed successfully');
  } catch (err: any) {
    console.error('Change password error:', err);
    return errorResponse('Failed to change password', 500, err?.message);
  }
}

