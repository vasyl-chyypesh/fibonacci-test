# AGENTS Guidelines

## Project Overview
- Node.js + TypeScript monorepo-style service with:
  - HTTP API in `src/app`
  - Queue worker in `src/worker`
  - Infra code in `infrastructure`
  - UI code in `docs`
- Runtime uses ESM (`"type": "module"`), so use `.js` extension in TypeScript imports.

## General Coding Rules
- Keep changes focused and minimal; do not refactor unrelated areas.
- Preserve existing architecture (service factory, queue handler, Redis-backed storage).
- Avoid `console.*` in business code; use `Logger` where logging is needed.
- Prefer explicit types and small functions with single responsibility.
- Keep files and naming consistent with current conventions in `src/`.

## Validation Checklist
- Run formatting/lint/tests relevant to changed code:
  - `npm run prettier`
  - `npm run lint`
  - `npm test`
- For API behavior changes, also run integration tests where applicable:
  - `npm run test:integration`

## API & Contracts
- Keep request/response shapes backward compatible unless explicitly asked.
- Continue using existing validation and error middleware patterns in `src/app/api`.
- Keep `/health` endpoint semantics stable unless requirement says otherwise.

## Safety
- Never commit secrets or credentials.
- Do not change CI/security scripts unless task explicitly requires it.
