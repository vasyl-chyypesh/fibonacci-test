# AGENTS Guidelines for `src/app`

## Scope
- Applies to API server, routes, middleware, storage, services, and app tests under `src/app`.

## Architecture Expectations
- Keep the layered flow:
  - Route/middleware -> service -> storage/queue
- Construct dependencies via `ServiceFactory` where existing code expects it.
- Keep middleware order intentional in router setup (`logging`, throttling, routes, not-found, error handler).

## API Change Rules
- Validate input/output via existing schema and validator patterns.
- Reuse existing error types/messages from `utils/errors` for consistent responses.
- Preserve HTTP status code behavior unless the task explicitly changes API contracts.

## Logging & Error Handling
- Use `Logger` for operational logs.
- Surface domain/HTTP errors through existing middleware chain instead of ad-hoc response handling.
- Ensure shutdown/startup behavior in `index.ts` and `server.ts` remains graceful.

## Testing
- Add or update tests near changed behavior under `src/app/__test__` or feature-local `__test__`.
- Follow current test stack: `node:test`, `assert`, and `supertest` where needed.
- Prefer behavior-focused tests (status codes, payload shape, side effects), not internal implementation details.
