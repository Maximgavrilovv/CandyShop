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
| API | http://localhost:3000/api |
| Swagger | http://localhost:3000/api/docs |
| Health | http://localhost:3000/api/health |

## Test users

| Email | Password |
|---|---|
| alice@example.com | password123 |
| bob@example.com | password123 |

## Business rule: checkout auth

By default, users must be logged in to check out. To allow guest checkout, set in `.env` or `docker-compose.yml`:

```
CHECKOUT_REQUIRES_AUTH=false
```

Browsing the catalog is always public — no login required.

## Running the tests

```bash
# Start DB and run migrations
docker compose up postgres -d
docker compose run --rm migrate

# Run tests (from backend/)
cd backend
DB_HOST=localhost npm test
```

Or with the Makefile: `make test`

Or exec into the running container:
```bash
docker compose up -d
docker compose exec backend npm test
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

## What I cut

- Quantity editing in cart (add again to increment, or remove)
- Order history page in the UI (endpoint exists)
- Pagination on catalog (small dataset)
- Refresh tokens (out of scope per brief)
- Guest cart persistence (if CHECKOUT_REQUIRES_AUTH=false, guest users don't have a saved cart — noted as next step)
