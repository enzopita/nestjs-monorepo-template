# AGENTS.md

NestJS monorepo (Turborepo + nub). Node.js version is pinned in `mise.toml`.

## Commands

- `nub run lint`, `nub run format`, `nub run check-types`
- `nub run test`, `nub run test:e2e`, `nub run test:cov`
- Root dev dependency: `nub add -D -W <pkg>`
- Agent skills: `nub dlx skills update -p` (tracked in `skills-lock.json`; review the diff before committing)

## Commits

- Conventional Commits, enforced by commitlint.
- Write the entire commit message in English, subject and body.

## Testing

- TDD: write tests before the code, never after. For complex changes, list every failure scenario first, write those tests, then implement.
- Prefer unit and integration tests over E2E.
- Keep tests fast: in most cases no real database or external services. Use in-memory fakes via NestJS dependency injection.

## Architecture

- Follow `.claude/skills/nestjs-architecture-principles`: start with a flat feature module (controller, service, DTOs); add layers, ports, or repositories only when real pressure justifies it.
- References to NestJS skills that are not installed can be ignored. AGENTS.md wins over any skill.

## Type safety

- Strict TypeScript everywhere (`@repo/typescript-config/base.json`); never loosen compiler flags per app.
- No `any`, `as unknown as`, non-null `!`, or `@ts-ignore`. Narrow with type guards or parse with a schema at the boundary instead of asserting.
- An unavoidable `as` needs a `// SAFETY:` comment stating the checked invariant.
- Type-aware oxlint rules enforce this; fix the types, do not disable the rule.
- `apps/api` builds with TypeScript 6 (`typescript` alias, required by the Nest CLI) and type-checks with TypeScript 7 (`typescript7`). Revisit when Nest supports TS 7.

## Validation

- Use Standard Schema with Zod via the built-in `StandardSchemaValidationPipe` and `@Body({ schema })`. Do not use class-validator or nestjs-zod.
- OpenAPI comes from the same schemas via `@nestjs/swagger` (`standardSchema` on response decorators).

## Documentation

- Before using a library, framework, or CLI API, fetch current docs via the Context7 MCP (`.mcp.json`). Do not rely on memory for version-specific APIs.
- If Context7 lacks the answer or you are still unsure, search the web (official docs, changelogs, release notes) before writing code.
