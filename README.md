# 🍬 Candy Shop

Browse a candy catalog, add to cart, check out.

## Stack
- **Backend** — NestJS (TypeScript), TypeORM, PostgreSQL
- **Frontend** — Vue 3 (Composition API), Tailwind CSS, Vite
- **Infrastructure** — Docker Compose

## Running

First run (or after code changes):
```bash
docker compose up --build
```

Subsequent runs (images already built, no code changes):
```bash
docker compose up
```

Or use the Makefile shortcuts: `make up` / `make start` / `make down`.

| Service  | URL |
|---|---|
| Frontend | http://localhost:8080 |
| Swagger | http://localhost:3000/api/docs |
| Health | http://localhost:3000/api/health |

## Test users

| Email | Password |
|---|---|
| alice@example.com | password123 |
| bob@example.com | password123 |


## Running the tests

```bash
# Run tests (from backend/)
# Run an app with
docker compose up
cd backend
npm install (if there are errors, use mirror):
npm install --registry https://registry.npmmirror.com
set DB_HOST=localhost && npm test
```

## API summary

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/login | — | Get JWT |
| GET | /api/candies | — | List catalog (public) |
| GET | /api/cart | ✓ | View cart |
| POST | /api/cart/items | ✓ | Add item |
| DELETE | /api/cart/items/:id | ✓ | Remove item |
| POST | /api/orders/checkout | configurable | Checkout (see CHECKOUT_REQUIRES_AUTH) |
| GET | /api/orders | ✓ | Order history |
| GET | /api/health | — | Health check |
