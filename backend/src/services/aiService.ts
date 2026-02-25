/**
 * AI Service
 * Builds a context-aware prompt using trip details + weather forecast,
 * then calls OpenAI to generate a structured PackingListContent JSON.
 */
import OpenAI from 'openai';
import { TripInput, WeatherContext, PackingListContent } from '../types';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';
const MAX_TOKENS = Number(process.env.OPENAI_MAX_TOKENS ?? 2048);

// ─────────────────────────────────────────────
//  Prompt Engineering
// ─────────────────────────────────────────────

function buildSystemPrompt(): string {
  return `You are PackMate AI, an expert travel assistant that generates personalized packing lists.

TASK
Generate a comprehensive, context-aware packing list for the trip described by the user.

OUTPUT FORMAT — respond ONLY with a single valid JSON object, no markdown fences, no explanation.
The JSON must strictly follow this TypeScript type:
{
  [category: string]: {
    name: string;       // Item name (concise, 1-4 words)
    quantity: number;   // Realistic quantity (≥ 1)
    packed: boolean;    // Always false in generated lists
  }[]
}

RULES
- Categories must be Title Case strings (e.g. "Clothing", "Toiletries", "Electronics").
- Include 6–12 relevant categories; each category must have 3–12 items.
- Adapt items to the weather (rain → umbrella/raincoat; cold → layers; heat → sun protection).
- Adapt items to accommodation (tent → sleeping bag, camp stove; hotel → fewer bulky items).
- Adapt items to activity level (intense → sport gear, first aid; light → casual clothes).
- Do NOT add items irrelevant to the trip context.
- Do NOT wrap the JSON in code blocks or add any surrounding text.`;
}

function buildUserPrompt(trip: TripInput, weather: WeatherContext | null): string {
  const durationDays =
    Math.ceil(
      (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    ) + 1;

  const accommodationLabels: Record<string, string> = {
    hotel: 'Hotel (comfort, amenities provided)',
    hostel: 'Hostel (shared dorms, bring padlock/towel)',
    airbnb: 'Airbnb / apartment (self-catering)',
    tent: 'Camping tent (no amenities, bring everything)',
    other: 'Other accommodation',
  };

  const activityLabels: Record<string, string> = {
    light: 'Light (sightseeing, leisure, restaurants)',
    moderate: 'Moderate (day hikes, cycling, city walks)',
    intense: 'Intense (mountaineering, multi-day trekking, water sports)',
  };

  const weatherSection = weather
    ? `WEATHER FORECAST\n${weather.summary}\nDetailed days:\n${weather.days
        .map(
          d =>
            `  • ${d.date}: ${d.description}, ${d.tempMin}–${d.tempMax}°C, ` +
            `humidity ${d.humidity}%, wind ${d.windSpeedKmh} km/h` +
            (d.rain ? ', RAIN' : '') +
            (d.snow ? ', SNOW' : ''),
        )
        .join('\n')}`
    : 'WEATHER FORECAST\nNot available — use destination climate knowledge.';

  return `TRIP DETAILS
Destination: ${trip.location}
Dates: ${trip.startDate} to ${trip.endDate} (${durationDays} day${durationDays !== 1 ? 's' : ''})
Accommodation: ${accommodationLabels[trip.accommodation] ?? trip.accommodation}
Activity Level: ${activityLabels[trip.activityLevel] ?? trip.activityLevel}

${weatherSection}

Generate the packing list JSON now.`;
}

// ─────────────────────────────────────────────
//  Main Export
// ─────────────────────────────────────────────

export async function generatePackingList(
  trip: TripInput,
  weather: WeatherContext | null,
): Promise<PackingListContent> {
  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    temperature: 0.4,           // balanced creativity vs. consistency
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: buildSystemPrompt() },
      { role: 'user', content: buildUserPrompt(trip, weather) },
    ],
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error('OpenAI returned an empty response.');

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`OpenAI returned invalid JSON: ${raw.slice(0, 200)}`);
  }

  // Validate shape
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('OpenAI response is not a JSON object.');
  }

  // Ensure every category is an array of PackingItems
  const result = parsed as Record<string, unknown>;
  for (const [category, items] of Object.entries(result)) {
    if (!Array.isArray(items)) {
      throw new Error(`Category "${category}" is not an array.`);
    }
    for (const item of items as unknown[]) {
      if (
        typeof item !== 'object' ||
        item === null ||
        typeof (item as Record<string, unknown>).name !== 'string' ||
        typeof (item as Record<string, unknown>).quantity !== 'number'
      ) {
        throw new Error(`Invalid item in category "${category}".`);
      }
      // Ensure packed is always false on fresh generation
      (item as Record<string, unknown>).packed = false;
    }
  }

  return result as PackingListContent;
}
