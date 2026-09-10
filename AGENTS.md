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

- Build (order matters): `vp run build` (= `build:types` → `build:plugin` → `build:core`). Do NOT use `vp run -r build` on a clean checkout — it skips the ordering and `create-element`/`oxlint-plugin` depend on the generated types.
- Verify: `vp run check` (oxlint type-aware + typecheck; CI/publish runs this). Fix: `vp check --fix`.
- Format style: no semicolons, single quotes, sorted imports (root `vite.config.ts` `fmt`). `**/generated/**` is excluded from lint/fmt.
- Per-package: `vp run --filter <pkg> <cmd>`, or run `vp …` inside the package dir.

## Packages

- `packages/create-element` — core lib. Entrypoints: `src/index.ts` (DOM `h`/`createElement`), `src/virtual/` (vnode/mount), `src/server/` (renderToString), plus 5 reactive adapters (`alien-signals/`, `alien-deepsignals/`, `faisceau/`, `preact-signals/`, `vue-reactivity/`), each with `index` + `virtual/` + `server/` + `jsx-runtime`/`jsx-dev-runtime`. Adapters are thin wrappers over `src/reactive-element.ts` / `reactive-virtual.ts` / `reactive-server.ts` via each adapter's `reactivity.ts` — fix shared logic there, not in all 5 copies.
- `packages/elements-writable-properties-types` — codegen'd types from `@types/web`. Build: `vp run build:types` (runs `node scripts/generate.ts`, reads `node_modules/@types/web`). Never hand-edit `generated/`; regenerate instead.
- `packages/oxlint-plugin` — custom rule `create-element/valid-jsx-element-type-assertion` (JSX `as` / `asDom<T>` must match intrinsic tag). Wired in root `vite.config.ts` `lint.jsPlugins`; `typeAware: true, typeCheck: true`.

## Tests

- `packages/create-element`: vitest in **browser mode** (chromium via playwright, `typecheck.enabled: true`). Needs Playwright chromium installed. `tests/*.spec.ts(x)` = browser DOM tests, `tests/*.spec-d.ts(x)` = type tests. Single test from package dir: `vp test run tests/create-element.spec.ts`.
- `tests-node/package-exports.spec.mjs` runs with `node --test` (`vp run --filter @lilian1315/create-element test:node`) **against `dist/`** — rebuild (`vp run --filter @lilian1315/create-element build`) before running; asserts exact export lists including every adapter's `index/virtual/server/jsx-runtime/jsx-dev-runtime`.
- `packages/oxlint-plugin`: plain node tests, `vp test run`.
- Coverage (core only): `vp test run --coverage` from `packages/create-element`.

## Gotchas

- Dual publish: `jsr.json` exports point at `src/*.ts`, `package.json` exports at `dist/*.js`, `pack.entry` is `src/**/index.ts` + `jsx-runtime`/`jsx-dev-runtime` (unbundled). Adding a public entry requires updating all three; keep `package.json` version and `jsr.json` version in sync.
- `deno.json` is **generated** by `vp run generate-deno-config` (staged hook regenerates it on `pnpm-workspace.yaml` changes). Never hand-edit.
- Deps: versions live in `pnpm-workspace.yaml` `catalog:` with `overrides` pinning `vite`/`vitest`; signal libs are **optional** peerDeps. Add shared deps as `catalog:`, not pinned versions.
- JSX: consumers use `"jsx": "react-jsx", "jsxImportSource": "@lilian1315/create-element"`; SVG/MathML need `svg:`/`math:` prefixes (bare `svg`/`math` roots excepted).
- Release: tag `push` of `@lilian1315/create-element@*.*.*` / `@lilian1315/elements-writable-properties-types@*.*.*` triggers `.github/workflows/publish.yml` (`vp run check` → `build:core` → `jsr publish` + `pnpm publish`). Local bump helpers: `vp run release:core`, `vp run release:types` (use `bumpp`).
