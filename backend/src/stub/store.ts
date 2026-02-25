/**
 * In-memory store — replaces Prisma/PostgreSQL for stub mode.
 * All data lives in Maps and is reset on server restart.
 */
import { randomUUID } from 'crypto';
import { PackingListContent } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoreUser {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  googleId: string | null;
  createdAt: Date;
}

export interface StoreTrip {
  id: string;
  userId: string;
  location: string;
  startDate: Date;
  endDate: Date;
  accommodation: string;
  activityLevel: string;
  weatherContext: unknown;
  createdAt: Date;
  packingList?: StorePackingList | null;
}

export interface StorePackingList {
  id: string;
  tripId: string | null;
  userId: string | null;
  name: string | null;
  isTemplate: boolean;
  content: PackingListContent;
  createdAt: Date;
}

// ─── Seed test user ──────────────────────────────────────────────────────────

const TEST_USER_ID = 'stub-user-001';

const users = new Map<string, StoreUser>([
  [
    TEST_USER_ID,
    {
      id: TEST_USER_ID,
      email: 'test@packmate.dev',
      name: 'Test User',
      avatar: null,
      googleId: null,
      createdAt: new Date(),
    },
  ],
]);

const trips = new Map<string, StoreTrip>();
const packingLists = new Map<string, StorePackingList>();

// ─── User helpers ─────────────────────────────────────────────────────────────

export const db = {
  user: {
    findUnique: (id: string): StoreUser | undefined => users.get(id),
    findByEmail: (email: string): StoreUser | undefined =>
      [...users.values()].find(u => u.email === email),
    upsert: (data: Partial<StoreUser> & { email: string; name: string }): StoreUser => {
      const existing = db.user.findByEmail(data.email);
      if (existing) {
        Object.assign(existing, data);
        return existing;
      }
      const user: StoreUser = {
        id: randomUUID(),
        email: data.email,
        name: data.name,
        avatar: data.avatar ?? null,
        googleId: data.googleId ?? null,
        createdAt: new Date(),
      };
      users.set(user.id, user);
      return user;
    },
    getTestUser: (): StoreUser => users.get(TEST_USER_ID)!,
  },

  trip: {
    findMany: (userId: string): StoreTrip[] =>
      [...trips.values()]
        .filter(t => t.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map(t => ({ ...t, packingList: db.packingList.findByTrip(t.id) ?? null })),

    findOne: (id: string, userId: string): StoreTrip | undefined => {
      const t = trips.get(id);
      if (!t || t.userId !== userId) return undefined;
      return { ...t, packingList: db.packingList.findByTrip(id) ?? null };
    },

    create: (data: Omit<StoreTrip, 'id' | 'createdAt' | 'packingList'>): StoreTrip => {
      const trip: StoreTrip = { ...data, id: randomUUID(), createdAt: new Date() };
      trips.set(trip.id, trip);
      return trip;
    },

    delete: (id: string): void => {
      trips.delete(id);
      const list = db.packingList.findByTrip(id);
      if (list) packingLists.delete(list.id);
    },
  },

  packingList: {
    findByTrip: (tripId: string): StorePackingList | undefined =>
      [...packingLists.values()].find(l => l.tripId === tripId),

    findTemplates: (userId: string): StorePackingList[] =>
      [...packingLists.values()]
        .filter(l => l.userId === userId && l.isTemplate)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),

    findTemplateById: (id: string, userId: string): StorePackingList | undefined => {
      const l = packingLists.get(id);
      return l?.isTemplate && l.userId === userId ? l : undefined;
    },

    upsertForTrip: (tripId: string, userId: string, content: PackingListContent): StorePackingList => {
      const existing = db.packingList.findByTrip(tripId);
      if (existing) {
        existing.content = content;
        return existing;
      }
      const list: StorePackingList = {
        id: randomUUID(),
        tripId,
        userId,
        name: null,
        isTemplate: false,
        content,
        createdAt: new Date(),
      };
      packingLists.set(list.id, list);
      return list;
    },

    createTemplate: (userId: string, name: string, content: PackingListContent): StorePackingList => {
      const list: StorePackingList = {
        id: randomUUID(),
        tripId: null,
        userId,
        name,
        isTemplate: true,
        content,
        createdAt: new Date(),
      };
      packingLists.set(list.id, list);
      return list;
    },

    delete: (id: string): void => {
      packingLists.delete(id);
    },
  },
};
