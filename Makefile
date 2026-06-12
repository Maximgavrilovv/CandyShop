.PHONY: up start down logs test
up:
	docker compose up --build
start:
	docker compose up
down:
	docker compose down
logs:
	docker compose logs -f
test:
	docker compose up postgres -d
	docker compose run --rm migrate
	cd backend && DB_HOST=localhost npm test
