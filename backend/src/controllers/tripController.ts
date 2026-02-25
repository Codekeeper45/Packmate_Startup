import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { tripSchema, updateListSchema } from '../middleware/validate';
import { AuthenticatedRequest } from '../types';

// POST /api/trips
export async function createTrip(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = tripSchema.parse(req.body);
    const userId = req.user!.id;

    const trip = await prisma.trip.create({
      data: {
        userId,
        location: body.location,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        accommodation: body.accommodation,
        activityLevel: body.activityLevel,
      },
      include: { packingList: true },
    });

    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}

// GET /api/trips
export async function getTrips(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      include: { packingList: { select: { id: true, isTemplate: true } } },
    });
    res.json({ success: true, data: trips });
  } catch (err) {
    next(err);
  }
}

// GET /api/trips/:id
export async function getTripById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params.id as string;
    const trip = await prisma.trip.findFirst({
      where: { id, userId: req.user!.id },
      include: { packingList: true },
    });
    if (!trip) throw new AppError('Trip not found.', 404);
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}

// PUT /api/trips/:id/list
export async function updatePackingList(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { content } = updateListSchema.parse(req.body);

    const id = req.params.id as string;

    // Verify ownership
    const trip = await prisma.trip.findFirst({
      where: { id, userId: req.user!.id },
    });
    if (!trip) throw new AppError('Trip not found.', 404);

    // Upsert packing list
    const list = await prisma.packingList.upsert({
      where: { tripId: id },
      update: { content },
      create: { tripId: id, userId: req.user!.id, content },
    });

    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/trips/:id
export async function deleteTrip(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params.id as string;
    const trip = await prisma.trip.findFirst({
      where: { id, userId: req.user!.id },
    });
    if (!trip) throw new AppError('Trip not found.', 404);

    await prisma.trip.delete({ where: { id } });
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
