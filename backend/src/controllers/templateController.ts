import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { templateSchema } from '../middleware/validate';
import { AuthenticatedRequest } from '../types';

// POST /api/templates
export async function createTemplate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, content } = templateSchema.parse(req.body);

    const template = await prisma.packingList.create({
      data: {
        userId: req.user!.id,
        name,
        content,
        isTemplate: true,
      },
    });

    res.status(201).json({ success: true, data: template });
  } catch (err) {
    next(err);
  }
}

// GET /api/templates
export async function getTemplates(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const templates = await prisma.packingList.findMany({
      where: { userId: req.user!.id, isTemplate: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: templates });
  } catch (err) {
    next(err);
  }
}

// GET /api/templates/:id
export async function getTemplateById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params.id as string;
    const template = await prisma.packingList.findFirst({
      where: { id, userId: req.user!.id, isTemplate: true },
    });
    if (!template) throw new AppError('Template not found.', 404);
    res.json({ success: true, data: template });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/templates/:id
export async function deleteTemplate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params.id as string;
    const template = await prisma.packingList.findFirst({
      where: { id, userId: req.user!.id, isTemplate: true },
    });
    if (!template) throw new AppError('Template not found.', 404);

    await prisma.packingList.delete({ where: { id } });
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
