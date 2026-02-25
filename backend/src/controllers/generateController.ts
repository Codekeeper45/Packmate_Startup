import { Response, NextFunction } from 'express';
import { tripSchema } from '../middleware/validate';
import { getWeatherForecast } from '../services/weatherService';
import { generatePackingList } from '../services/aiService';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest, WeatherContext } from '../types';

/**
 * POST /api/generate
 *
 * Flow:
 *  1. Validate trip input (Zod).
 *  2. Fetch weather forecast (best-effort — proceed even if API fails).
 *  3. Call OpenAI with trip context + weather → structured PackingListContent.
 *  4. Optionally persist the trip + list if `save: true` is passed in body.
 *  5. Return generated list + weather context to the frontend.
 */
export async function generate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // 1. Validate
    const tripInput = tripSchema.parse(req.body);
    const shouldSave: boolean = req.body.save === true;

    // 2. Fetch weather (non-blocking failure)
    let weather: WeatherContext | null = null;
    try {
      weather = await getWeatherForecast(
        tripInput.location,
        new Date(tripInput.startDate),
        new Date(tripInput.endDate),
      );
    } catch (weatherErr) {
      console.warn('[WeatherService] Could not fetch forecast:', (weatherErr as Error).message);
    }

    // 3. Generate packing list via OpenAI
    const packingList = await generatePackingList(tripInput, weather);

    // 4. Optionally persist trip + list
    let savedTrip = null;
    if (shouldSave && req.user) {
      savedTrip = await prisma.trip.create({
        data: {
          userId: req.user.id,
          location: tripInput.location,
          startDate: new Date(tripInput.startDate),
          endDate: new Date(tripInput.endDate),
          accommodation: tripInput.accommodation,
          activityLevel: tripInput.activityLevel,
          weatherContext: weather as object | undefined,
          packingList: {
            create: {
              userId: req.user.id,
              content: packingList as unknown as import('@prisma/client').Prisma.InputJsonValue,
            },
          },
        },
        include: { packingList: true },
      });
    }

    // 5. Respond
    res.json({
      success: true,
      data: {
        packingList,
        weather,
        trip: savedTrip,
      },
    });
  } catch (err) {
    next(err);
  }
}
