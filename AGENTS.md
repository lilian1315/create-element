<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

# Repo notes (create-element)

Do not hand-edit between the `VITE PLUS` markers above — that section is managed by `vp create` / `vp config`. Put repo guidance below.

## Commands

- Build: `vpr build` (runs each `packages/*` `build` in workspace dependency order — types first. Never use bare `vpr -r build`: it would also build `examples/*`).
- Verify: `vp check` (oxlint type-aware + typecheck; CI/publish runs this). Fix: `vp check --fix`.
- Format style: no semicolons, single quotes, sorted imports (root `vite.config.ts` `fmt`). `**/generated/**` is excluded from lint/fmt.
- Per-package: `vpr --filter <pkg> <cmd>`, or run `vp …` inside the package dir.
- Orchestration (`_release:core`, `_release:plugin`, `_release:types`) lives in root `vite.config.ts` `run.tasks`; invoke with `vpr <name>`.

## Packages

- `packages/create-element` — `h`/JSX describe deferred trees. Public paths: base or integration entry (`h`, `build`, types), `/dom` (`bind`, `dispose`, `mount`), `/server` (`renderToString`), and JSX runtimes. Shared sources: `types.ts` (DOM, VNode and binding types), `vnode.ts` (VNode construction and guards), `effect-scope.ts` (effect cleanup), `dom.ts` (public DOM entry), `dom-core.ts` (reconciliation and node ownership), `dom-props.ts` (one binding implementation), and `server.ts` (SSR). Native integrations live in `reactivity-ops/`; `scripts/specialize-reactivity.ts` redirects its plain `index.ts` to `<integration>.ts` for runtime and declarations. Fix shared behavior once; keep native details and generic `Source<T>` in those five small modules. Read `docs/api-refactor-brief.fr.md` when changing API or lifecycle contracts.
- DOM ownership: one active binding per element, including bindings installed by `build` and `mount`. `bind` rejects an active binding until cleanup or `dispose`. Preserve resources on moved nodes when cleaning their former parent. Keep rendered-node scopes independent of their original parent; use `EffectScope` children for resources within a binding.
- `packages/elements-writable-properties-types` — codegen'd types from `@types/web`. Regenerate: `vpr --filter @lilian1315/elements-writable-properties-types build` (runs `node scripts/generate.ts`, reads `node_modules/@types/web`). Never hand-edit `generated/`; regenerate instead.
- `packages/oxlint-plugin` — custom rule `create-element/valid-jsx-type-assertion` (JSX `as` / `build<Tag>` must match the literal intrinsic tag). Wired in root `vite.config.ts` `lint.jsPlugins`; `typeAware: true, typeCheck: true`.

## Tests

- All suites: `vpr test` (runs each `packages/*` `test`: core browser + typecheck, plugin node; scriptless packages are skipped). Dist export tests are NOT included — run `vpr --filter @lilian1315/create-element test:exports` (auto-builds `dist/` via task dep).
- `packages/create-element`: vitest **projects** (`browser`: chromium via playwright + `typecheck.enabled`; `exports`: `tests/package-exports.spec.ts` against `dist/`). Needs Playwright chromium installed (`playwright install --with-deps chromium`). `tests/*.spec.ts(x)` = browser DOM tests, `tests/*.spec-d.ts(x)` = type tests against public built entries. Tests depend on `build`. Single test from package dir: `vp test run --project browser tests/api.spec.ts` after rebuilding.
- `tests/package-exports.spec.ts` runs with vitest (`vpr --filter @lilian1315/create-element test:exports`, i.e. `vp test run --project exports` + `build` dep) **against `dist/`**; checks public runtime exports, the npm entry inventory and matching declarations, and isolated native dependencies in JS and declarations.
- `packages/oxlint-plugin-create-element`: plain node tests, `vp test run`.
- Coverage (core only): `vp test run --coverage --project browser` from `packages/create-element`.

## Gotchas

- npm publishes the specialized `dist/*.js` and `.d.ts` outputs. Keep `package.json` exports in sync with the named entries in the package's pack config; rebuild before validating consumers or publishing.
- Deps: versions live in `pnpm-workspace.yaml` `catalog:` with `overrides` pinning `vite`/`vitest`; signal libs are **optional** peerDeps. Add shared deps as `catalog:`, not pinned versions.
- JSX: consumers use `"jsx": "react-jsx", "jsxImportSource": "@lilian1315/create-element"`; SVG/MathML need `svg:`/`math:` prefixes (bare `svg`/`math` roots excepted).
- Release: tag `push` of `@lilian1315/create-element@*.*.*` / `@lilian1315/oxlint-plugin-create-element@*.*.*` / `@lilian1315/elements-writable-properties-types@*.*.*` triggers `.github/workflows/publish.yml` (`vpr build` → `vpr test` → export tests → `vp check` → npm publish). Local bump helpers: `vpr release:core`, `vpr release:types`, `vpr release:plugin` (use `bumpp`).
