/**
 * Weather Service
 * Uses OpenWeatherMap 5-day / 3-hour forecast endpoint.
 * Aggregates hourly slots into per-day summaries → WeatherContext.
 */
import axios from 'axios';
import { WeatherContext, WeatherForecastDay } from '../types';

const BASE_URL = process.env.OPENWEATHER_BASE_URL ?? 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.OPENWEATHER_API_KEY!;

interface OWMForecastItem {
  dt: number;
  main: { temp_min: number; temp_max: number; humidity: number };
  weather: { description: string; main: string }[];
  wind: { speed: number }; // m/s
  rain?: { '3h'?: number };
  snow?: { '3h'?: number };
  dt_txt: string;
}

interface OWMForecastResponse {
  city: { name: string; country: string };
  list: OWMForecastItem[];
}

/**
 * Fetch aggregated weather forecast for a location between startDate and endDate.
 * Falls back gracefully if the dates exceed the free 5-day window.
 */
export async function getWeatherForecast(
  location: string,
  startDate: Date,
  endDate: Date,
): Promise<WeatherContext> {
  const response = await axios.get<OWMForecastResponse>(`${BASE_URL}/forecast`, {
    params: {
      q: location,
      appid: API_KEY,
      units: 'metric',
      cnt: 40, // max 5 days × 8 slots/day
    },
  });

  const { list, city } = response.data;

  // Group 3-hour slots by date string (YYYY-MM-DD)
  const byDay = new Map<string, OWMForecastItem[]>();
  for (const item of list) {
    const day = item.dt_txt.split(' ')[0];
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(item);
  }

  const days: WeatherForecastDay[] = [];
  byDay.forEach((slots, date) => {
    const temps = slots.flatMap(s => [s.main.temp_min, s.main.temp_max]);
    const tempMin = Math.round(Math.min(...temps));
    const tempMax = Math.round(Math.max(...temps));
    const humidity = Math.round(slots.reduce((a, s) => a + s.main.humidity, 0) / slots.length);
    const rain = slots.some(s => (s.rain?.['3h'] ?? 0) > 0 || s.weather[0].main === 'Rain');
    const snow = slots.some(s => (s.snow?.['3h'] ?? 0) > 0 || s.weather[0].main === 'Snow');
    const windSpeedKmh = Math.round(
      (slots.reduce((a, s) => a + s.wind.speed, 0) / slots.length) * 3.6,
    );
    const description = slots[Math.floor(slots.length / 2)].weather[0].description;

    days.push({ date, description, tempMin, tempMax, humidity, rain, snow, windSpeedKmh });
  });

  // Filter to the requested date range (best effort)
  const start = startDate.toISOString().split('T')[0];
  const end = endDate.toISOString().split('T')[0];
  const filtered = days.filter(d => d.date >= start && d.date <= end);
  const relevant = filtered.length > 0 ? filtered : days.slice(0, 3);

  const summary = buildSummary(relevant, city.name, city.country);

  return { location: `${city.name}, ${city.country}`, days: relevant, summary };
}

function buildSummary(days: WeatherForecastDay[], city: string, country: string): string {
  if (days.length === 0) return `Weather data unavailable for ${city}.`;

  const allTemps = days.flatMap(d => [d.tempMin, d.tempMax]);
  const overallMin = Math.min(...allTemps);
  const overallMax = Math.max(...allTemps);
  const hasRain = days.some(d => d.rain);
  const hasSnow = days.some(d => d.snow);
  const avgWind = Math.round(days.reduce((a, d) => a + d.windSpeedKmh, 0) / days.length);

  const conditions: string[] = [];
  if (hasRain) conditions.push('rain expected');
  if (hasSnow) conditions.push('snow expected');
  if (avgWind > 30) conditions.push(`strong winds (~${avgWind} km/h)`);
  if (conditions.length === 0) conditions.push('mostly clear/cloudy');

  return (
    `Forecast for ${city}, ${country}: temperature range ${overallMin}–${overallMax}°C. ` +
    `Conditions: ${conditions.join(', ')}. ` +
    `${days.length} day(s) of data available.`
  );
}
