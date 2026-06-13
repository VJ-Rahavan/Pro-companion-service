# API Reference

Base URL: `http://localhost:3001`

All protected routes require an `Authorization: Bearer <token>` header.

---

## Auth

### POST `/api/auth/register`
Creates a new user account.

**Body**
```json
{ "email": "user@example.com", "password": "min8chars" }
```

**Response `201`**
```json
{
  "data": {
    "user": { "id": "uuid", "email": "user@example.com", "created_at": "..." },
    "token": "eyJ..."
  }
}
```

---

### POST `/api/auth/login`
Returns a JWT for an existing user.

**Body**
```json
{ "email": "user@example.com", "password": "yourpassword" }
```

**Response `200`**
```json
{
  "data": {
    "user": { "id": "uuid", "email": "user@example.com" },
    "token": "eyJ..."
  }
}
```

---

### GET `/api/auth/me` 🔒
Returns the authenticated user's profile.

**Response `200`**
```json
{
  "data": { "id": "uuid", "email": "...", "reminder_time": "20:00:00", "created_at": "..." }
}
```

---

## Roadmap

### GET `/api/roadmap` 🔒
Returns all 7 stages with their topics and problems. Each problem includes the user's progress status.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "number": 1,
      "title": "Foundations",
      "topics": [
        {
          "id": "uuid",
          "name": "Arrays & strings",
          "problems": [
            {
              "id": "uuid",
              "title": "Two sum",
              "difficulty": "easy",
              "pattern": "hash map",
              "status": "solved"
            }
          ]
        }
      ]
    }
  ]
}
```

---

### GET `/api/roadmap/next` 🔒
Returns the next unsolved problem in roadmap order.

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "title": "Valid anagram",
    "difficulty": "easy",
    "pattern": "frequency count",
    "topic": "Arrays & strings",
    "stage_number": 1,
    "stage_title": "Foundations"
  }
}
```
Returns `{ "data": null, "message": "All problems solved!" }` when complete.

---

## Progress

### POST `/api/progress` 🔒
Logs a problem attempt. Re-submitting the same problem updates the existing record.

**Body**
```json
{
  "problem_id": "uuid",
  "status": "solved",
  "time_taken_seconds": 1200
}
```
`status` must be `"solved"`, `"failed"`, or `"skipped"`.
`time_taken_seconds` is optional.

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "problem_id": "uuid",
    "status": "solved",
    "time_taken_seconds": 1200,
    "solved_at": "2026-06-13T10:00:00Z"
  }
}
```

---

### GET `/api/progress` 🔒
Returns all progress records for the authenticated user, most recent first.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "problem_id": "uuid",
      "status": "solved",
      "time_taken_seconds": 900,
      "solved_at": "...",
      "title": "Two sum",
      "difficulty": "easy",
      "pattern": "hash map"
    }
  ]
}
```

---

## Streaks

### GET `/api/streaks` 🔒
Returns the authenticated user's streak data.

**Response `200`**
```json
{
  "data": {
    "current_streak": 5,
    "longest_streak": 12,
    "last_active_date": "2026-06-12"
  }
}
```

---

## Users

### PATCH `/api/users/push-token` 🔒
Saves an Expo push notification token. Called by the mobile app after the user grants permission.

**Body**
```json
{ "expo_push_token": "ExponentPushToken[...]" }
```

**Response `200`**
```json
{ "data": { "message": "Push token saved" } }
```

---

### PATCH `/api/users/reminder-time` 🔒
Updates the user's daily reminder time.

**Body**
```json
{ "reminder_time": "21:00" }
```
Format must be `HH:MM` (24-hour).

**Response `200`**
```json
{ "data": { "message": "Reminder time updated" } }
```

---

## AI Service

Base URL: `http://localhost:8000`
Called internally by the backend — not directly from the frontend.

### POST `/generate-solution`
Generates a solution using Groq or Gemini (configured via `AI_PROVIDER` env var).

**Body**
```json
{
  "problem_title": "Trapping rain water",
  "pattern": "two pointers",
  "difficulty": "hard"
}
```

**Response `200`**
```json
{
  "approach": "Use two pointers from both ends...",
  "solution_code": "def trap(height):\n    ...",
  "time_complexity": "O(n)",
  "space_complexity": "O(1)",
  "related_problems": [
    { "title": "Container with most water", "pattern": "two pointers", "why": "Same shrink-from-both-ends logic" },
    { "title": "Minimum size subarray sum", "pattern": "sliding window", "why": "Variable-size window pattern" },
    { "title": "Largest rectangle in histogram", "pattern": "monotonic stack", "why": "Area under constraints" }
  ]
}
```

### GET `/health`
Returns `{ "ok": true, "provider": "groq" }` — useful for checking which AI provider is active.

---

## Error responses

All endpoints return errors in this format:

```json
{ "error": "Human-readable message" }
```

| Status | Meaning |
|--------|---------|
| `400` | Validation failed — check the request body |
| `401` | Missing or invalid JWT token |
| `404` | Resource not found |
| `409` | Conflict (e.g. email already registered) |
| `500` | Server error |
