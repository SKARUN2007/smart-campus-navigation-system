import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            locations: true,
            facilities: true,
            buildings: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return successResponse(categories);
  } catch (err: any) {
    console.error('List categories error:', err);
    return errorResponse('Failed to retrieve categories', 500, err?.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, description, icon, color } = body;

    if (!name?.trim()) {
      return errorResponse('Category name is required', 400);
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name: name.trim() }, { slug: cleanSlug }],
      },
    });

    if (existing) {
      return errorResponse('A category with this name or slug already exists', 409);
    }

    const created = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
        description: description?.trim() || null,
        icon: icon?.trim() || 'MapPin',
        color: color?.trim() || '#2563eb',
      },
    });

    return successResponse(created, 'Category created successfully', 201);
  } catch (err: any) {
    console.error('Create category error:', err);
    return errorResponse('Failed to create category', 500, err?.message);
  }
}

