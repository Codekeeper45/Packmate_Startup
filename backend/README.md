# Packmate Backend

Express.js + TypeScript API for the Packmate Travel Packing List Generator.

---

## Stack
| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express.js 4 (TypeScript) |
| Database | PostgreSQL 15+ |
| ORM | Prisma 5 |
| Auth | Google OAuth 2.0 + JWT (HTTP-only cookie) |
| AI | OpenAI GPT-4o-mini |
| Weather | OpenWeatherMap 5-day Forecast API |
| Validation | Zod |

---

## Quick Start

### 1. Copy env file
```bash
cp .env.example .env
# Fill in all values
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run database migrations
```bash
npm run db:migrate
# or for prototype/development:
npm run db:push
```

### 4. Start dev server
```bash
npm run dev
# Server runs on http://localhost:4000
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `JWT_COOKIE_MAX_AGE_MS` | Cookie max-age in milliseconds |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `GOOGLE_REDIRECT_URI` | Must match Google Console setting |
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENAI_MODEL` | Model name (default: `gpt-4o-mini`) |
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key |
| `PORT` | Server port (default: `4000`) |
| `CLIENT_ORIGIN` | Frontend URL for CORS (default: `http://localhost:5173`) |

---

## API Reference

### Auth
| Method | Path | Description |
|---|---|---|
| GET | `/auth/google` | Redirect to Google OAuth |
| GET | `/auth/google/callback` | OAuth callback, sets JWT cookie |
| POST | `/auth/logout` | Clear session cookie |
| GET | `/auth/me` | Get current user (protected) |

### AI Generation
| Method | Path | Description |
|---|---|---|
| POST | `/api/generate` | Generate packing list from trip details |

**Body:**
```json
{
  "location": "Barcelona, Spain",
  "startDate": "2026-06-01",
  "endDate": "2026-06-10",
  "accommodation": "hotel",
  "activityLevel": "moderate",
  "save": true
}
```

### Trips
| Method | Path | Description |
|---|---|---|
| POST | `/api/trips` | Create trip |
| GET | `/api/trips` | List user's trips |
| GET | `/api/trips/:id` | Get trip + packing list |
| PUT | `/api/trips/:id/list` | Update packing list (check items etc.) |
| DELETE | `/api/trips/:id` | Delete trip |

### Templates
| Method | Path | Description |
|---|---|---|
| POST | `/api/templates` | Save list as template |
| GET | `/api/templates` | List user's templates |
| GET | `/api/templates/:id` | Get template |
| DELETE | `/api/templates/:id` | Delete template |

---

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # DB schema (User, Trip, PackingList)
├── src/
│   ├── server.ts              # Express app entry point
│   ├── lib/
│   │   └── prisma.ts          # Prisma client singleton
│   ├── types/
│   │   └── index.ts           # Shared TypeScript types
│   ├── utils/
│   │   └── jwt.ts             # JWT sign/verify helpers
│   ├── services/
│   │   ├── aiService.ts       # OpenAI prompt engineering + call
│   │   ├── weatherService.ts  # OpenWeatherMap fetch + aggregation
│   │   └── authService.ts     # Google OAuth exchange
│   ├── middleware/
│   │   ├── auth.ts            # requireAuth guard
│   │   ├── errorHandler.ts    # Global error handler
│   │   └── validate.ts        # Zod schemas
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── tripController.ts
│   │   ├── generateController.ts
│   │   └── templateController.ts
│   └── routes/
│       ├── auth.ts
│       ├── trips.ts
│       ├── generate.ts
│       └── templates.ts
├── .env.example
├── package.json
└── tsconfig.json
```
