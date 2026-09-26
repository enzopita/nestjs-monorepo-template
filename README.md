# nestjs-monorepo-template

Monorepo NestJS com [Turborepo](https://turborepo.dev) e [nub](https://github.com/nubjs/nub).

## Estrutura

- `apps/*`: aplicações (NestJS)
- `packages/typescript-config`: `tsconfig` base compartilhado (`@repo/typescript-config/base.json`)
- `tools/oxlint/anti-slop`: regras Oxlint vendorizadas ([anti-slop](https://github.com/dmmulroy/anti-slop))

## Ferramentas

- Node.js LTS, versão fixada no `mise.toml` (`mise install`)
- TypeScript
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) para lint
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) para formatação

## Comandos

```sh
nub install
nub run build
nub run dev
nub run lint
nub run check-types
nub run format        # formata
nub run format:check  # só verifica
```

## Git hooks

[Lefthook](https://lefthook.dev) roda no `pre-commit` sobre os arquivos staged: `oxlint --fix` e depois `oxfmt`, re-adicionando as correções ao commit. Erros de lint bloqueiam o commit.

Os hooks são instalados pelo script `prepare` no `nub install`. Para reinstalar manualmente: `nubx lefthook install`.
