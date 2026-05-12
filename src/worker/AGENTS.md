# AGENTS Guidelines for `src/worker`

## Scope
- Applies to worker processes and message-processing logic in `src/worker`.

## Processing Flow
- Keep a clear worker pipeline:
  - consume message -> parse/validate payload -> execute domain task -> persist/publish result.
- Keep handlers focused on orchestration; keep business logic in dedicated service/domain classes.
- Keep queue names, routing keys, and payload contracts backward compatible with producer/consumer integrations.

## Reliability Expectations
- Handle malformed/invalid queue messages safely without crashing the worker process.
- Keep logging through `Logger` with useful context for each processing stage.
- Prefer non-blocking async processing patterns to avoid starving the event loop.
- Make acknowledgement/retry behavior explicit and consistent with failure-handling requirements.

## Dependency Usage
- Reuse shared app abstractions instead of duplicating logic:
  - `QueueHandler`
  - `ServiceFactory` and project services
  - `QueueEnum`

## Testing
- Add/adjust tests under `src/worker/__test__` for:
  - worker handler behavior on valid and invalid messages
  - core domain task behavior
  - failure paths (parse errors, service errors, retry/ack expectations)
- Keep tests deterministic and focused on observable outcomes.
