# AGENTS.md

NestJS monorepo managed with Turborepo and nub.

## Tooling

- Node.js: pinned to an exact LTS version in `mise.toml`. Use mise to install and switch versions (`mise install`); do not add `.nvmrc`, `.node-version`, or Volta config. When upgrading, bump `mise.toml` to the latest patch of the current LTS line and keep `engines.node` in `package.json` consistent.
- Package manager: `nub` (never npm, pnpm, or yarn). Add root dev dependencies with `nub add -D -W <pkg>`.
- Lint: Oxlint (`nub run lint`), including the vendored anti-slop rules in `tools/oxlint/anti-slop`.
- Format: Oxfmt (`nub run format`).
- Type check: `nub run check-types`.
- Do not add ESLint or Prettier.

## Commits

- Follow Conventional Commits (`type(scope): subject`). commitlint enforces this in the `commit-msg` hook.
- Always write the entire commit message in English, including the subject and the body, regardless of the language used in the conversation.
- Never bypass hooks with `--no-verify`.

## Testing: TDD is mandatory

- Never write unit tests after the implementation. Tests always come first.
- Workflow: write a failing test, confirm it fails for the expected reason, write the minimum code to make it pass, then refactor with tests green.
- For complex changes, first enumerate every failure scenario (invalid input, edge cases, error paths, boundary conditions), write tests for all of them, and only then write the production code.

## Testing: fast by default

- Prefer unit tests and integration tests over end-to-end (E2E) tests. Write E2E tests only for a few critical flows that cannot be covered otherwise.
- Tests must be fast. In most cases they must not depend on a real database, network, message broker, or other external services: a slow or stateful dependency blocks the whole test suite.
- Isolate I/O behind interfaces (NestJS providers) and substitute in-memory fakes or test doubles through dependency injection, not module mocking.
- Tests that genuinely need real infrastructure must be the exception, kept in a separate suite, and never block the default fast test run.
