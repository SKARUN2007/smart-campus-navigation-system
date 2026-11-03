import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { hashPassword, signToken } from '@/lib/auth-utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role = 'STUDENT', department, studentId } = body;

    if (!name?.trim()) {
      return errorResponse('Name is required', 400);
    }
    if (!email?.trim() || !email.includes('@')) {
      return errorResponse('Valid email address is required', 400);
    }
    if (!password || password.length < 6) {
      return errorResponse('Password must be at least 6 characters long', 400);
    }

    // Check duplicate email
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return errorResponse('An account with this email address already exists', 409);
    }

    // Role safety check: Public registration cannot create ADMIN role
    const allowedPublicRoles = ['STUDENT', 'FACULTY', 'STAFF', 'VISITOR'];
    const assignedRole = allowedPublicRoles.includes(role.toUpperCase())
      ? (role.toUpperCase() as any)
      : 'STUDENT';

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role: assignedRole,
        department: department?.trim() || null,
        studentId: studentId?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        studentId: true,
        createdAt: true,
      },
    });

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return successResponse(
      {
        user: newUser,
        token,
      },
      'User registered successfully',
      201
    );
  } catch (err: any) {
    console.error('Registration API error:', err);
    return errorResponse('Internal server error during registration', 500, err?.message);
  }
}
