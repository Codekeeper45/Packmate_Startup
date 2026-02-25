# Frontend ↔ Backend Integration Guide

This document describes how to replace the current `sessionStorage` / `localStorage` logic in the React frontend with real API calls to the backend.

---

## 1. Create the API Client (`src/api/client.ts`)

```typescript
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: 'include', // sends JWT cookie automatically
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? 'API error');
  }

  const json = await res.json();
  return json.data as T;
}
```

Add to your `.env` (frontend):
```
VITE_API_URL=http://localhost:4000
```

---

## 2. Auth — Replace Frontend Session

**Before (sessionStorage):**
```typescript
sessionStorage.setItem('user', JSON.stringify(user));
const user = JSON.parse(sessionStorage.getItem('user') ?? 'null');
```

**After:**
```typescript
// src/api/auth.ts
import { apiFetch } from './client';

export const getMe = () => apiFetch<User>('/auth/me');
export const logout = () => apiFetch('/auth/logout', { method: 'POST' });
// Login: redirect browser to backend
export const loginWithGoogle = () => window.location.href = `${BASE}/auth/google`;
```

Use a React context / hook:
```typescript
const { data: user } = useQuery({ queryKey: ['me'], queryFn: getMe });
```

---

## 3. AI Generation — Replace AIGeneration.tsx

**Before:**
```typescript
// called OpenAI directly from the browser (insecure — API key exposed!)
const response = await openai.chat.completions.create({ ... });
```

**After:**
```typescript
// src/api/generate.ts
import { apiFetch } from './client';
import type { PackingListContent, TripInput } from '../types';

export interface GenerateResponse {
  packingList: PackingListContent;
  weather: WeatherContext | null;
  trip: Trip | null;
}

export function generatePackingList(
  tripInput: TripInput & { save?: boolean },
): Promise<GenerateResponse> {
  return apiFetch('/api/generate', {
    method: 'POST',
    body: JSON.stringify(tripInput),
  });
}
```

In `AIGeneration.tsx`, replace the OpenAI call:
```typescript
// OLD
const list = await callOpenAI(tripDetails);

// NEW
const { packingList, weather } = await generatePackingList({
  ...tripDetails,
  save: true, // persist trip + list to DB
});
```

---

## 4. Packing List Sync — Replace localStorage

**Before:**
```typescript
localStorage.setItem('packingList', JSON.stringify(list));
```

**After:**
```typescript
// src/api/trips.ts
import { apiFetch } from './client';

export const updateList = (tripId: string, content: PackingListContent) =>
  apiFetch(`/api/trips/${tripId}/list`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  });
```

Call `updateList` when user checks/unchecks an item (debounce ~500ms):
```typescript
const debouncedSync = useMemo(
  () => debounce((content) => updateList(tripId, content), 500),
  [tripId],
);

// On every checkbox change:
debouncedSync(updatedContent);
```

---

## 5. Trip History

```typescript
// src/api/trips.ts
export const getTrips = () => apiFetch<Trip[]>('/api/trips');
export const getTripById = (id: string) => apiFetch<Trip>(`/api/trips/${id}`);
export const deleteTrip = (id: string) =>
  apiFetch(`/api/trips/${id}`, { method: 'DELETE' });
```

---

## 6. Templates

```typescript
// src/api/templates.ts
export const saveTemplate = (name: string, content: PackingListContent) =>
  apiFetch('/api/templates', { method: 'POST', body: JSON.stringify({ name, content }) });

export const getTemplates = () => apiFetch('/api/templates');
```

---

## 7. Summary of Changes

| Old | New |
|---|---|
| `sessionStorage` for user | `/auth/me` + JWT cookie |
| Direct OpenAI call in browser | `POST /api/generate` |
| `localStorage` for packing list | `PUT /api/trips/:id/list` |
| In-memory trip history | `GET /api/trips` |
| No templates | `POST/GET /api/templates` |

---

## 8. Running Both Together

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
npm run dev
```

CORS is already configured on the backend to allow `http://localhost:5173`.
