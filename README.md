# Pro Companion — Backend

Node.js REST API. Standalone — no dependency on the frontend repo.

## Stack

- Express.js + TypeScript
- PostgreSQL via `pg` (raw SQL, no ORM)
- JWT auth, bcrypt, zod validation
- node-cron (daily reminders), Nodemailer (email), Expo Server SDK (push notifications)

## Prerequisites

- Node.js 20+
- Docker Desktop (for PostgreSQL)

## Setup

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
| `AI_SERVICE_URL` | URL of the AI service (default: `http://localhost:8000`) |
| `EMAIL_USER` | Gmail address for reminders |
| `EMAIL_PASS` | Gmail App Password |
| `APP_URL` | Frontend URL — used in reminder email links |

### 3. Start the database

```bash
docker compose up -d
```

### 4. Run migrations

```bash
npm run migrate
```

### 5. Seed the roadmap

Inserts the full 7-stage DSA roadmap (100+ problems). Safe to run multiple times.

```bash
npm run seed
```

### 6. Start the server

```bash
npm run dev       # development (watch mode)
npm start         # production
```

Runs on `http://localhost:3001`.

## Database commands

```bash
npm run migrate   # apply pending migrations
npm run seed      # insert roadmap data
```

To add a new migration:
1. Create `migrations/00X_describe_change.sql`
2. Run `npm run migrate`

## Project structure

```
backend/
├── migrations/
│   └── 001_create_tables.sql
├── docs/
│   └── api.md                  # full API reference
└── src/
    ├── db/
    │   ├── pool.ts             # pg connection pool
    │   └── migrate.ts          # migration runner
    ├── middleware/
    │   └── auth.ts             # JWT verification
    ├── routes/
    │   ├── auth.ts
    │   ├── roadmap.ts
    │   ├── progress.ts
    │   ├── streaks.ts
    │   └── users.ts
    ├── services/
    │   ├── email.ts
    │   ├── push.ts
    │   └── streak.ts
    ├── jobs/
    │   └── reminder.ts         # cron job — runs every minute
    └── seed/
        ├── roadmap.seed.ts
        └── run.ts
```

## API reference

See [docs/api.md](docs/api.md).
# Pro-companion-service
