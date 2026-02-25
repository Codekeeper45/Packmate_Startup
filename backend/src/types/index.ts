import { Request } from 'express';

// ─────────────────────────────────────────────
//  Packing List Domain
// ─────────────────────────────────────────────
export interface PackingItem {
  name: string;
  quantity: number;
  packed: boolean;
}

export type PackingListContent = Record<string, PackingItem[]>;

// ─────────────────────────────────────────────
//  Trip
// ─────────────────────────────────────────────
export type AccommodationType = 'hotel' | 'hostel' | 'airbnb' | 'tent' | 'other';
export type ActivityLevelType = 'light' | 'moderate' | 'intense';

export interface TripInput {
  location: string;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  accommodation: AccommodationType;
  activityLevel: ActivityLevelType;
}

// ─────────────────────────────────────────────
//  Weather
// ─────────────────────────────────────────────
export interface WeatherForecastDay {
  date: string;
  description: string;
  tempMin: number;
  tempMax: number;
  humidity: number;
  rain: boolean;
  snow: boolean;
  windSpeedKmh: number;
}

export interface WeatherContext {
  location: string;
  days: WeatherForecastDay[];
  summary: string; // Human-readable summary for the LLM prompt
}

// ─────────────────────────────────────────────
//  JWT / Auth
// ─────────────────────────────────────────────
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Extend Express Request to carry authenticated user
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    avatar?: string | null;
  };
}

// ─────────────────────────────────────────────
//  API Response Shapes
// ─────────────────────────────────────────────
export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─────────────────────────────────────────────
//  Google OAuth Token Response
// ─────────────────────────────────────────────
export interface GoogleUserInfo {
  sub: string;         // googleId
  email: string;
  name: string;
  picture?: string;
}
