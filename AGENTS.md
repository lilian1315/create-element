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

Keep repository guidance below the managed `VITE PLUS` section.

## Validation

For code changes, validate in order:

1. Run `vpr test`; test tasks handle their required builds. The workspace test task includes core browser/type tests, built-export checks, and plugin tests.
2. Run `vpr check` for formatting, linting, and type checks.

Validation is complete when every applicable command passes; report any failed or blocked command.

## Task-specific guidance

- **API/JSX:** Read [JSX and components](README.md#jsx-and-components) and [public types](README.md#public-types) before changing tree construction or materialization.
- **DOM ownership:** Read [DOM lifecycle](README.md#dom-lifecycle) and `packages/create-element/tests/{binding-ownership,reconciliation,reactive-api}.spec.ts` before changing binding or cleanup behavior. Preserve single ownership, idempotent cleanup, and the tested moved-node behavior.
- **Reactivity:** Read `packages/create-element/scripts/specialize-reactivity.ts` and `packages/create-element/tests/reactivity-fixtures.ts` before changing adapter behavior. Implement shared behavior in core; keep native primitives and `Source<T>` in `packages/create-element/src/reactivity-ops/`.
- **Core tests:** Follow `packages/create-element/tests/jsx/` for per-adapter TSX runtime/type tests. Use the package's `test` task to build before testing; pass `--project browser` or `--project exports` for focused runs (see [Development](README.md#development)). Tests resolve published `dist/` entries. Browser tests require Playwright Chromium.
- **Lint rules:** Read `packages/oxlint-plugin/README.md` for the verification contract. Follow `packages/oxlint-plugin/tests/index.spec.ts`: use `RuleTester` from `vite-plus/lint/plugins-dev` with real TSX, message IDs, and fixed output (`null` when unfixable).
- **Generated types:** Update `packages/elements-writable-properties-types/scripts/generate.ts` or its `@types/web` input, then regenerate with `vpr --filter @lilian1315/elements-writable-properties-types build`. Treat `generated/` as generator output, not hand-maintained source.
- **Tasks/packaging/releases:** Read [Development](README.md#development), the relevant package's `vite.config.ts`, and `.github/workflows/publish.yml` before changing task dependencies, build outputs, or publishing. Change core exports through `packages/create-element/scripts/entries.ts`; the build regenerates the manifest. Package build tasks declare dependency builds explicitly, so targeted builds and releases also regenerate types. Keep `prepare` in `package.json` as the install lifecycle hook.

## Dependencies

Add shared versions to `pnpm-workspace.yaml`'s catalog and reference them with `catalog:`. Keep signal libraries as optional peer dependencies. The writable-properties types package remains a separately published workspace dependency.
