# Pro Companion — Backend

Node.js REST API for DSA & System Design interview prep. Standalone repo — no dependency on the frontend.

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ / TypeScript |
| Framework | Express.js |
| ORM | TypeORM (PostgreSQL) |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Validation | Zod |
| Scheduler | node-cron (per-user daily reminders) |
| Email | Nodemailer (Gmail SMTP) |
| Push | Expo Server SDK |

## Prerequisites

- Node.js 20+
- Docker Desktop (runs PostgreSQL)

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

```bash
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Long random string for signing tokens |
| `AI_SERVICE_URL` | AI service URL (default: `http://localhost:8000`) |
| `EMAIL_USER` | Gmail address for reminder emails |
| `EMAIL_PASS` | Gmail App Password |
| `APP_URL` | Frontend URL — used in reminder email links |

### 3. Start the database

```bash
docker compose up -d
```

> Tables are created automatically by TypeORM on first startup (`synchronize: true` in dev).

### 4. Seed the roadmap

Inserts the full 7-stage DSA roadmap (166 problems). Safe to run multiple times.

```bash
npm run seed
```

### 5. Start the server

```bash
npm run dev       # development — watch mode, restarts on save
npm start         # production — runs compiled dist/
```

Server runs on `http://localhost:3001`.

## Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start in watch mode (tsx) |
| `npm run build` | Compile TypeScript to dist/ |
| `npm start` | Run compiled build |
| `npm run seed` | Insert roadmap data (idempotent) |
| `npm run lint` | Type-check without emitting |

## Project architecture

```
backend/
├── docker-compose.yml          # PostgreSQL 16 on port 5433
├── .env.example                # environment variable template
├── docs/
│   └── api.md                  # full API endpoint reference
└── src/
    ├── index.ts                # entry point — init DB then start server
    ├── app.ts                  # Express setup (middleware, routes)
    ├── data-source.ts          # TypeORM DataSource config
    ├── entities/               # TypeORM entity classes (one per table)
    │   ├── User.ts
    │   ├── Stage.ts
    │   ├── Topic.ts
    │   ├── Problem.ts
    │   ├── UserProgress.ts
    │   └── Streak.ts
    ├── middleware/
    │   └── auth.ts             # JWT verification — attaches userId to request
    ├── routes/
    │   ├── auth.ts             # POST /register, POST /login, GET /me
    │   ├── roadmap.ts          # GET / (nested), GET /next
    │   ├── progress.ts         # POST / (upsert), GET /
    │   ├── streaks.ts          # GET /
    │   └── users.ts            # PATCH /push-token, PATCH /reminder-time
    ├── services/
    │   ├── streak.ts           # streak update logic (increment / reset / skip)
    │   ├── email.ts            # Nodemailer Gmail SMTP
    │   └── push.ts             # Expo push notification sender
    ├── jobs/
    │   └── reminder.ts         # cron — fires every minute, matches reminder_time
    └── seed/
        ├── roadmap.seed.ts     # static data: 7 stages, 21 topics, 166 problems
        └── run.ts              # seed runner (uses TypeORM repos, idempotent)
```

## Database schema

6 tables managed by TypeORM entities:

```
users ──────────────┐
  id (uuid PK)      │
  email             │  1:1
  password_hash     ├──── streaks
  reminder_time     │       current_streak
  expo_push_token   │       longest_streak
                    │       last_active_date
                    │
stages              │  1:N
  number (unique)   ├──── user_progress
  title             │       problem_id (FK)
    │ 1:N           │       status (solved/failed/skipped)
  topics            │       time_taken_seconds
    │ 1:N           │       solved_at
  problems ─────────┘
    title
    difficulty (easy/med/hard)
    pattern
```

## API reference

See [docs/api.md](docs/api.md).
