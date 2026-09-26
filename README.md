# nestjs-monorepo-template

NestJS monorepo with [Turborepo](https://turborepo.dev) and [nub](https://github.com/nubjs/nub).

## Structure

- `apps/*`: applications (NestJS)
- `packages/typescript-config`: shared base `tsconfig` (`@repo/typescript-config/base.json`)
- `tools/oxlint/anti-slop`: vendored Oxlint rules ([anti-slop](https://github.com/dmmulroy/anti-slop))

## Tooling

- Node.js LTS, version pinned in `mise.toml` (`mise install`)
- TypeScript
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) for linting
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) for formatting

## Commands

```sh
nub install
nub run build
nub run dev
nub run lint
nub run check-types
nub run format        # format files
nub run format:check  # check only
```

## Git hooks

[Lefthook](https://lefthook.dev) runs on `pre-commit` against staged files: `oxlint --fix`, then `oxfmt`, re-adding the fixes to the commit. Lint errors block the commit.

Hooks are installed by the `prepare` script during `nub install`. To reinstall manually: `nubx lefthook install`.

## AI agents

- `AGENTS.md` (loaded by Claude Code through `CLAUDE.md`): project rules for agents.
- `.claude/skills/`: NestJS skills from [nestjs-agent-skills](https://github.com/amirtaherkhani/nestjs-agent-skills), tracked in `skills-lock.json`. Update with `nub dlx skills update -p`.
- `.mcp.json`: [Context7](https://context7.com) MCP server for up-to-date library docs. Optionally set `CONTEXT7_API_KEY` for higher rate limits.
