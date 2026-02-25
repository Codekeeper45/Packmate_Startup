/**
 * Mock AI Service — returns a pre-built packing list.
 * Adapts slightly based on accommodation & activityLevel.
 * Use instead of the real aiService.ts in stub mode.
 */
import { TripInput, WeatherContext, PackingListContent } from '../types';

export function getMockPackingList(
  trip: TripInput,
  _weather: WeatherContext | null,
): PackingListContent {
  const isTent = trip.accommodation === 'tent';
  const isIntense = trip.activityLevel === 'intense';
  const isLight = trip.activityLevel === 'light';

  const days =
    Math.ceil(
      (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    ) + 1;

  const shirts = Math.min(days, 7);
  const pants = Math.min(Math.ceil(days / 2), 4);

  const list: PackingListContent = {
    Clothing: [
      { name: 'T-Shirts', quantity: shirts, packed: false },
      { name: 'Underwear', quantity: shirts, packed: false },
      { name: 'Pants / Trousers', quantity: pants, packed: false },
      { name: 'Socks', quantity: shirts, packed: false },
      { name: 'Light Jacket', quantity: 1, packed: false },
      ...(isIntense
        ? [{ name: 'Sport Shorts', quantity: 2, packed: false }]
        : []),
      ...(isTent
        ? [{ name: 'Thermal Underwear', quantity: 1, packed: false }]
        : []),
    ],
    Footwear: [
      { name: 'Sneakers', quantity: 1, packed: false },
      ...(isIntense
        ? [{ name: 'Hiking Boots', quantity: 1, packed: false }]
        : []),
      { name: 'Flip Flops', quantity: 1, packed: false },
    ],
    Toiletries: [
      { name: 'Toothbrush', quantity: 1, packed: false },
      { name: 'Toothpaste', quantity: 1, packed: false },
      { name: 'Shampoo', quantity: 1, packed: false },
      { name: 'Deodorant', quantity: 1, packed: false },
      { name: 'Sunscreen SPF 50', quantity: 1, packed: false },
      { name: 'Razor', quantity: 1, packed: false },
    ],
    Electronics: [
      { name: 'Phone Charger', quantity: 1, packed: false },
      { name: 'Power Bank', quantity: 1, packed: false },
      { name: 'Universal Adapter', quantity: 1, packed: false },
      { name: 'Earphones', quantity: 1, packed: false },
    ],
    Documents: [
      { name: 'Passport / ID', quantity: 1, packed: false },
      { name: 'Travel Insurance', quantity: 1, packed: false },
      { name: 'Booking Confirmations', quantity: 1, packed: false },
      { name: 'Credit / Debit Card', quantity: 2, packed: false },
    ],
    'Health & Safety': [
      { name: 'Paracetamol', quantity: 1, packed: false },
      { name: 'Plasters / Band-Aids', quantity: 10, packed: false },
      { name: 'Hand Sanitizer', quantity: 1, packed: false },
      ...(isIntense
        ? [
            { name: 'Blister Prevention', quantity: 1, packed: false },
            { name: 'Knee Brace', quantity: 1, packed: false },
          ]
        : []),
    ],
    ...(isTent
      ? {
          Camping: [
            { name: 'Sleeping Bag', quantity: 1, packed: false },
            { name: 'Sleeping Mat', quantity: 1, packed: false },
            { name: 'Headlamp', quantity: 1, packed: false },
            { name: 'Camp Stove', quantity: 1, packed: false },
            { name: 'Water Purification Tablets', quantity: 1, packed: false },
          ],
        }
      : {}),
    ...(!isLight
      ? {
          Backpack: [
            { name: 'Daypack 20L', quantity: 1, packed: false },
            { name: 'Dry Bag', quantity: 1, packed: false },
          ],
        }
      : {}),
    Miscellaneous: [
      { name: 'Reusable Water Bottle', quantity: 1, packed: false },
      { name: 'Umbrella / Raincoat', quantity: 1, packed: false },
      { name: 'Travel Pillow', quantity: 1, packed: false },
      { name: 'Snacks', quantity: 3, packed: false },
    ],
  };

  return list;
}
