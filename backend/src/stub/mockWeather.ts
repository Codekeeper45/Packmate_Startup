/**
 * Mock Weather Service — returns realistic fake forecast data.
 * Use instead of the real weatherService.ts in stub mode.
 */
import { WeatherContext, WeatherForecastDay } from '../types';

const DESCRIPTIONS = [
  'partly cloudy', 'sunny intervals', 'light rain', 'overcast', 'clear sky',
];

function randomBetween(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

export function getMockWeatherForecast(
  location: string,
  startDate: Date,
  endDate: Date,
): WeatherContext {
  const days: WeatherForecastDay[] = [];

  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.min(
    Math.ceil((endDate.getTime() - startDate.getTime()) / msPerDay) + 1,
    5,
  );

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(startDate.getTime() + i * msPerDay);
    const tempMin = randomBetween(8, 18);
    const tempMax = tempMin + randomBetween(4, 10);
    const rain = Math.random() > 0.65;

    days.push({
      date: date.toISOString().split('T')[0],
      description: DESCRIPTIONS[i % DESCRIPTIONS.length],
      tempMin,
      tempMax,
      humidity: randomBetween(45, 85),
      rain,
      snow: false,
      windSpeedKmh: randomBetween(10, 35),
    });
  }

  const overallMin = Math.min(...days.map(d => d.tempMin));
  const overallMax = Math.max(...days.map(d => d.tempMax));
  const hasRain = days.some(d => d.rain);

  const summary =
    `[STUB] Forecast for ${location}: ${overallMin}–${overallMax}°C. ` +
    `${hasRain ? 'Some rain expected.' : 'Mostly dry.'} ` +
    `${days.length} day(s) of data.`;

  return { location, days, summary };
}
