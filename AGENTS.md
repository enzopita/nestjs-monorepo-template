# AGENTS.md

NestJS monorepo (Turborepo + nub). Node.js version is pinned in `mise.toml`.

## Commands

- `nub run lint`, `nub run format`, `nub run check-types`
- Root dev dependency: `nub add -D -W <pkg>`

## Commits

- Conventional Commits, enforced by commitlint.
- Write the entire commit message in English, subject and body.

## Testing

- TDD: write tests before the code, never after. For complex changes, list every failure scenario first, write those tests, then implement.
- Prefer unit and integration tests over E2E.
- Keep tests fast: in most cases no real database or external services. Use in-memory fakes via NestJS dependency injection.
