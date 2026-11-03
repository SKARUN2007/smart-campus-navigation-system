import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import { getAuthUser } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return errorResponse('Not authenticated', 401);
    }
    return successResponse({ user });
  } catch (err: any) {
    return errorResponse('Failed to verify session', 500, err?.message);
  }
}

