import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const category = await prisma.category.findFirst({
      where: {
        OR: [{ id }, { slug: id.toLowerCase() }],
      },
      include: {
        locations: true,
        facilities: true,
      },
    });

    if (!category) {
      return errorResponse('Category not found', 404);
    }

    return successResponse(category);
  } catch (err: any) {
    console.error('Get category error:', err);
    return errorResponse('Failed to retrieve category details', 500, err?.message);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.category.findUnique({
      where: { id },
    });
    if (!existing) {
      return errorResponse('Category not found', 404);
    }

    const { name, slug, description, icon, color } = body;

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        slug: slug !== undefined ? slug.trim().toLowerCase() : undefined,
        description: description !== undefined ? description?.trim() : undefined,
        icon: icon !== undefined ? icon?.trim() : undefined,
        color: color !== undefined ? color?.trim() : undefined,
      },
    });

    return successResponse(updated, 'Category updated successfully');
  } catch (err: any) {
    console.error('Update category error:', err);
    return errorResponse('Failed to update category', 500, err?.message);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            locations: true,
            facilities: true,
          },
        },
      },
    });

    if (!existing) {
      return errorResponse('Category not found', 404);
    }

    if (existing._count.locations > 0 || existing._count.facilities > 0) {
      return errorResponse(
        `Cannot delete category because it contains ${existing._count.locations} locations and ${existing._count.facilities} facilities. Reassign them first.`,
        400
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return successResponse({ deletedId: id }, 'Category deleted successfully');
  } catch (err: any) {
    console.error('Delete category error:', err);
    return errorResponse('Failed to delete category', 500, err?.message);
  }
}

