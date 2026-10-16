# @lilian1315/create-element

[![npm](https://img.shields.io/npm/v/@lilian1315/create-element)](https://npmx.dev/package/@lilian1315/create-element)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Describe HTML, SVG, and MathML trees with `createVNode` or JSX, then render them in the browser or on the server. Tree construction does not create DOM nodes, run components, or subscribe to signals.

## Features

- **Type-safe** — tag-aware props and refs, and DOM return types for direct `createVNode` roots
- **HTML, SVG, and MathML** — namespace-aware prefixes (`svg:circle`, `math:mi`)
- **JSX** — use JSX syntax via the standard `react-jsx` transform
- **DOM and SSR** — render the same tree descriptions in the browser or on the server
- **Optional native reactivity** — integrations for alien-signals, alien-deepsignals, faisceau, Preact Signals, and Vue Reactivity

## Contents

- [Quick start](#quick-start)
- [Browser](#browser)
- [JSX and components](#jsx-and-components)
- [Signal integrations](#signal-integrations)
- [DOM lifecycle](#dom-lifecycle)
- [Props and refs](#props-and-refs)
- [Reactive children and keyed lists](#reactive-children-and-keyed-lists)
- [Server rendering](#server-rendering)
- [Public types](#public-types)
- [Entrypoints and specialization](#entrypoints-and-specialization)
- [Troubleshooting](#troubleshooting)
- [Packages](#packages)
- [Development](#development)

## Quick start

```bash
pnpm add @lilian1315/create-element
```

```ts
import { createVNode } from '@lilian1315/create-element'
import { mount } from '@lilian1315/create-element/dom'

const unmount = mount(
  document.body,
  createVNode('div', {
    class: 'container',
    children: [
      createVNode('h1', { children: 'Hello World!' }),
      createVNode('button', { onclick: () => alert('Clicked!'), children: 'Click me' }),
    ],
  }),
)

// Later: unmount()
```

`createVNode` describes a tree; `mount` renders it into a container, replacing its existing content. Here, `unmount()` removes the rendered content and its managed click listener, leaving the container in place. No signal library is required. With a signal integration, unmounting also stops reactive subscriptions.

The base entry works without a signal library. To use a reactive integration, also install its optional peer dependency; for the examples below:

```bash
pnpm add @preact/signals-core
```

## Browser

```tsx
/** @jsxImportSource @lilian1315/create-element/preact-signals */

import { mount } from '@lilian1315/create-element/preact-signals/dom'
import { signal } from '@preact/signals-core'

const count = signal(0)
const unmount = mount(
  document.body,
  <button
    class={{ counter: true }}
    style={{ color: 'red' }}
    data={{ testId: 'counter' }}
    onclick={() => count.value++}
  >
    Count: {count}
  </button>,
)

// When you no longer need the button:
// unmount()
```

Pass the signal itself (`count`), not its current value (`count.value`), to keep the child reactive. `unmount()` stops updates, removes the managed listener, and removes the mounted content.

### Creating a detached element with `build`

Use `mount` for rendering into a container with a single cleanup function. Use `build` when you need a detached DOM element and want to manage insertion and removal yourself.

`build(createVNode('button', { children: 'Save' }))` infers `HTMLButtonElement`. JSX erases its intrinsic tag from the expression type, so use `build<'button'>(<button />)` when you need that precise return type. The generic does not perform a runtime check. The Oxlint rule verifies inline intrinsic JSX roots and simple `const` references or aliases, including SVG and MathML tags. It rejects explicit tag generics when the root cannot be verified, such as parameters, function results, and user components; omit the generic in those cases.

`build` accepts one `createVNode`/JSX description. An intrinsic root returns a detached live DOM element; a component or Fragment root returns a `DocumentFragment`. Appending that fragment moves its children into the target. Prefer `mount` for component or Fragment roots so that you have one cleanup function for the entire rendered range. Reserve explicit tag generics such as `build<'button'>` for matching intrinsic roots.

`createVNode` accepts intrinsic tag names only. Call reusable functions directly, such as `Counter({ count: 1 })`, or use `<Counter count={1} />` in JSX to defer their execution until rendering.

`createVNode` accepts children only in `props.children`:

```ts
import { createVNode } from '@lilian1315/create-element'
import { build } from '@lilian1315/create-element/dom'

const button = build(createVNode('button', { children: ['Save ', 1] }))
```

Children may contain text, numbers, empty values, nested arrays, tree descriptions, native signals for the selected integration, and existing DOM nodes. Existing nodes retain their identity and move when inserted. Prefix nested SVG and MathML tags with `svg:` and `math:`; the root `svg` and `math` tags need no prefix.

## JSX and components

Configure TypeScript's automatic JSX transform, and put JSX in `.tsx` files:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@lilian1315/create-element/preact-signals"
  }
}
```

For non-reactive JSX, use `@lilian1315/create-element` instead. A per-file `@jsxImportSource` comment, as in the browser example, overrides this setting.

Components are functions that return children. JSX defers calling them until rendering:

```tsx
import type { Component } from '@lilian1315/create-element/preact-signals'
import { mount } from '@lilian1315/create-element/preact-signals/dom'

const Greeting: Component<{ name: string }> = ({ name }) => <p>Hello, {name}!</p>

const unmount = mount(document.body, <Greeting name="Ada" />)
// Later: unmount()
```

There is no React component lifecycle or automatic tracking of reads in a component body. Pass native sources into props or children for updates, and use a computed source for derived trees. Components can return arrays or Fragments for multiple siblings. For conditional children, use `condition ? <p>Ready</p> : null` rather than `condition && <p>Ready</p>`: booleans are not part of the public child type.

Namespaces are explicit, even inside a namespaced parent:

```tsx
const icon = (
  <svg>
    <svg:circle cx={12} cy={12} r={10} />
  </svg>
)
const formula = (
  <math>
    <math:mi>x</math:mi>
  </math>
)
```

## Signal integrations

Choose the entry matching your native source type:

| Entry suffix         | Install alongside this package | Accepted sources              |
| -------------------- | ------------------------------ | ----------------------------- |
| Base (no suffix)     | Nothing                        | Plain values only             |
| `/alien-signals`     | `alien-signals`                | Signals and computed signals  |
| `/alien-deepsignals` | `alien-deepsignals`            | Signals and computed signals  |
| `/faisceau`          | `faisceau`                     | Native `Reactive` values      |
| `/preact-signals`    | `@preact/signals-core`         | Signals and computed signals  |
| `/vue-reactivity`    | `@vue/reactivity`              | Refs, including computed refs |

Use that suffix consistently in your `createVNode`/type imports, DOM or server imports, and `jsxImportSource`. Integrations recognize their own native sources, not arbitrary callbacks or another library's signals. There is no runtime adapter registration.

Pass sources directly to keep a binding live. Reading a source before passing it produces a snapshot:

```ts
import { createVNode } from '@lilian1315/create-element/preact-signals'
import { build } from '@lilian1315/create-element/preact-signals/dom'
import { computed, signal } from '@preact/signals-core'

const count = signal(0)
const label = computed(() => `Count: ${count.value}`)
const button = build(
  createVNode('button', {
    title: label,
    onclick: () => count.value++,
    children: count,
  }),
)
```

## DOM lifecycle

| Operation                   | Result                                                            |
| --------------------------- | ----------------------------------------------------------------- |
| `build(tree)`               | Detached element or fragment with effects and listeners installed |
| `createElement(tag, props)` | Creates a detached element and binds supplied props immediately   |
| `bind(element, props)`      | Applies supplied props and returns a cleanup function             |
| `dispose(element)`          | Stops resources managed on the element and its current subtree    |
| `mount(target, tree)`       | Replaces target content and returns a cleanup for that mount      |

`dispose` is idempotent and leaves the element in the DOM. Native `element.remove()` does not dispose it. A `bind` cleanup stops its effects and listeners, leaving the last DOM values in place. Each element has one active binding, whether installed by `build`, `mount`, `bind`, or `createElement` with props. Calling `bind` on an already managed element throws before mutation; call `dispose(element)` or its binding cleanup before binding it again. A shared symbol enforces this rule across integrations. A stale mount cleanup cannot remove a newer mount on the same target.

### Mounting into a container

```ts
import { createVNode } from '@lilian1315/create-element'
import { mount } from '@lilian1315/create-element/dom'

const target = document.createElement('main')
document.body.append(target)
const unmount = mount(target, [
  createVNode('h1', { children: 'Welcome' }),
  createVNode('p', { children: 'Multiple roots are supported here.' }),
])

// Later: unmount() removes the mounted range and releases its resources.
// The target itself remains in the document.
```

`mount` also accepts text, empty children, Fragments, and native child sources from the selected integration. It replaces existing content; it does not hydrate server-rendered HTML.

### Binding an existing element

Use `bind` to initialize an existing, unbound element:

```ts
import { bind } from '@lilian1315/create-element/preact-signals/dom'
import { signal } from '@preact/signals-core'

const input = document.createElement('input')
const value = signal('initial')
const stop = bind(input, { value, oninput: () => (value.value = input.value) })
// Later: stop() leaves the last value and removes the managed listener.
```

Manually moving a managed child to another parent does not transfer ownership. When its former render tree removes or disposes it, its effects, listeners, and refs are cleaned up even though the DOM node remains in its new parent.

`bind` leaves absent props and existing children untouched. Passing `children` or `innerHTML` replaces all old children and cleans library resources in the removed subtree. Explicit `children: null` or `children: undefined` empties the element, as does `innerHTML: ''`. `children` and `innerHTML` are mutually exclusive; using both throws before mutation. Treat `innerHTML` as trusted or sanitize it before passing it to the renderer.

## Props and refs

Props use writable DOM property names, such as `htmlFor`, `tabIndex`, `value`, and `checked`. Use `class` rather than `className`, and lowercase event props such as `onclick` and `oninput` rather than React-style `onClick`. Events are native DOM events, not synthetic events.

`class` accepts a string, string array, or object of booleans. Strings and arrays replace the class list; objects update their named classes. `style` accepts a string or property object; a string replaces the inline style, while an object updates its named properties. `data` updates named dataset entries: strings set values, `true` sets an empty attribute, and `false`, `null`, and `undefined` remove entries. Values and object members may be native signals. When a reactive object loses a key, its previously managed contribution is removed. Cleanup leaves the last applied DOM state.

`ref` is a tag typed callback that receives the initialized element synchronously, even when it is detached. It may return a cleanup function, which runs once on binding cleanup, `dispose`, or removal by the renderer. Replacing an element's children does not clean that element's own ref. Refs are not called during SSR. User components must pass a received ref to an intrinsic element themselves.

```ts
import { createVNode } from '@lilian1315/create-element'
import { build, dispose } from '@lilian1315/create-element/dom'

const panel = build(
  createVNode('section', {
    ref: (element) => {
      const observer = new ResizeObserver(() => {
        console.log(element.getBoundingClientRect().width)
      })
      observer.observe(element)
      return () => observer.disconnect()
    },
  }),
)
document.body.append(panel)
// Later: dispose(panel) disconnects the observer; panel.remove() removes the node.
```

## Reactive children and keyed lists

Reactive children reconcile with their previous tree. Matching elements update in place, and unchanged signal bindings and refs stay active. Unkeyed children match by position and type. For lists that reorder, insert, or remove items, give each sibling a stable, unique string or number `key`, such as `createVNode('li', { key: item.id, children: item.label })`. A matching key and type preserve the DOM node across moves; changing either replaces it. Keys are local to siblings and are never rendered as attributes. Keyed components and fragments preserve their entire DOM range. Reorders use native `moveBefore` when available and applicable, preserving browser state such as focus, and otherwise fall back to `insertBefore`. Calling `mount` again still replaces the target's content.

```ts
import { createVNode } from '@lilian1315/create-element/preact-signals'
import { build } from '@lilian1315/create-element/preact-signals/dom'
import { computed, signal } from '@preact/signals-core'

const items = signal([
  { id: 'a', label: 'First' },
  { id: 'b', label: 'Second' },
])
const rows = computed(() =>
  items.value.map((item) => createVNode('li', { key: item.id, children: item.label })),
)
const list = build(createVNode('ul', { children: rows }))
document.body.append(list)

items.value = [...items.value].reverse() // Reuses the existing <li> nodes.
// Later: dispose(list) from the same /dom entry, then list.remove().
```

Use item identities for keys, not array indices when items can move. Returning a new tree from a computed source lets the renderer reconcile it; repeatedly calling `mount` replaces the whole mount instead.

## Server rendering

```ts
import { createVNode } from '@lilian1315/create-element/vue-reactivity'
import { renderToString } from '@lilian1315/create-element/vue-reactivity/server'

const html = renderToString(createVNode('p', { children: 'Hello' }))
// '<p>Hello</p>'
```

The server renderer does not need `document` and runs the entire render untracked, including native signal reads inside components. It restores the caller's tracking state even if rendering throws. It escapes text and attributes, preserves namespace and form rules, and throws if it encounters a real DOM node. `innerHTML` is serialized as supplied. There is no public hydration API yet.

Use the base `/server` entry for plain trees or the matching integration's `/server` entry for native sources. Rendering is synchronous: it reads the current source values without installing subscriptions. Event listeners and ref callbacks are not serialized. To share a tree between browser and server, avoid existing DOM nodes and keep browser-only work inside refs or event handlers.

## Public types

Each base or integration entry exports `Component<Props>`, `VNodeProps<TagOrElement>`, `VNodePropsMap`, `VNodeChild`, `VNodeChildValue`, `VNodeChildren`, `MaybeSource<Value>`, `VNode`, `DomElement`, `PrefixedElementTag`, `ElementPrefixedTagNameMap`. These types use the native source type of that entry. Signal payloads must match their prop or child values; `Signal<unknown>` does not bypass these checks.

`bind` shares `VNodeProps` with `createVNode`, `createElement`, and JSX. `VNodeProps` accepts a tag name or native element type, such as `VNodeProps<'input'>` or `VNodeProps<HTMLInputElement>`. Native elements and subclasses use the generated `WritableDOMType` mapping; refs retain the exact received element type. Custom subclass properties are excluded. Mapping uses TypeScript's structural element types, so structurally identical interfaces cannot be distinguished.

`VNodeChildValue` describes a value rendered by a child source, including arrays whose members may themselves be sources. Use it when a signal can switch between different kinds of children:

```ts
import { createVNode, type VNodeChildValue } from '@lilian1315/create-element/preact-signals'
import { signal } from '@preact/signals-core'

const content = signal<VNodeChildValue>(createVNode('span', { children: 'Ready' }))
content.value = [createVNode('button', { children: 'Continue' }), ' or cancel']
```

## Entrypoints and specialization

The base package and each of `alien-signals`, `alien-deepsignals`, `faisceau`, `preact-signals`, and `vue-reactivity` expose the same paths:

| Path                                       | Exports                                              |
| ------------------------------------------ | ---------------------------------------------------- |
| `@lilian1315/create-element[/integration]` | `createVNode`                                        |
| `…/dom`                                    | `build`, `createElement`, `bind`, `dispose`, `mount` |
| `…/server`                                 | `renderToString`                                     |
| `…/jsx-runtime`, `…/jsx-dev-runtime`       | JSX compiler entries                                 |

Import `build` from `…/dom` (previously exported from the base or integration entry). The root entry only describes trees and has no DOM renderer dependency.

The public entry inventory in `packages/create-element/scripts/entries.ts` drives the build and the npm export map. The build updates the core package's `package.json` with `packages/create-element/scripts/generate-exports.ts`.

Set `jsxImportSource` to the base path or the integration path in `tsconfig.json`. Each integration uses its own native source detector, reader, effect, and untracked reader.

Following [Formisch's build-time specialization](https://formisch.dev/blog/one-core-six-frameworks/), the JSX, DOM, and SSR entries have one source implementation. `vp pack` compiles those entries for the base package and each integration. The plugin in `packages/create-element/scripts/specialize-reactivity.ts` redirects imports of `reactivity-ops/index.ts` to `reactivity-ops/<integration>.ts`, including the `Source` type in the emitted declarations. There is no runtime engine selector and no generated copy of the renderers in `src/`.

npm publishes the specialized JavaScript files and matching declarations in `dist/`. See [Development](#development) for build, test, and watch tasks.

## Troubleshooting

| Symptom                                       | What to check                                                                                                                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `build` is not exported from the root         | Import it from `@lilian1315/create-element/dom` or the selected integration's `/dom` entry.                                                                                                            |
| A signal renders once but does not update     | Pass the source itself, not a pre-read value. Check that JSX and renderer imports use the matching integration.                                                                                        |
| `bind` reports an active binding              | `build` already binds its result. Dispose it or run the previous binding cleanup before rebinding.                                                                                                     |
| Updates continue after removing a node        | Native DOM removal does not stop effects. Call `dispose` before removal, or use the cleanup returned by `mount`.                                                                                       |
| JSX has an imprecise DOM return type          | Use `build<'input'>(<input />)` for a literal intrinsic root. The optional [Oxlint plugin](https://github.com/lilian1315/create-element/tree/main/packages/oxlint-plugin) checks that the tag matches. |
| A conditional child is rejected by TypeScript | Return `null` for the empty branch instead of `false`.                                                                                                                                                 |
| SSR throws on a child                         | Real DOM nodes are browser-only; use tree descriptions for shared content.                                                                                                                             |

## Packages

| Package                                                                                                                                                | Description                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| [`@lilian1315/create-element`](https://github.com/lilian1315/create-element/tree/main/packages/create-element)                                         | Tree descriptions, DOM rendering, SSR, JSX, and signal integrations |
| [`@lilian1315/elements-writable-properties-types`](https://github.com/lilian1315/create-element/tree/main/packages/elements-writable-properties-types) | Auto-generated TypeScript types for writable DOM element properties |
| [`@lilian1315/oxlint-plugin-create-element`](https://github.com/lilian1315/create-element/tree/main/packages/oxlint-plugin)                            | Checks explicit DOM types on JSX roots                              |

## Development

```bash
vp install
vp exec playwright install --with-deps chromium
vpr test
vpr check
```

The workspace uses [Vite+](https://viteplus.dev/). Project commands are Vite tasks defined in the root and package `vite.config.ts` files. Run them with `vpr` (short for `vp run`); built-in commands such as `vp build` and `vp test` do not run these tasks. The `prepare` lifecycle script remains in `package.json` to configure commit hooks during installation.

`vpr test` handles required builds through task dependencies; there is no separate build step before testing. It includes core browser tests in Playwright Chromium, type tests against built entries, package-export checks in Node, generated DOM type tests, and plugin rule tests using Oxlint's `RuleTester`. `vpr check` runs formatting, linting, and type checks; `vpr fix` applies formatting and lint fixes.

Use `vpr build` when you need build artifacts without running tests. It builds only library packages in dependency order, excluding examples. Core and plugin build tasks also declare their dependency builds, so targeted builds regenerate the writable-property types first.

For focused runs, pass arguments through the package's task:

```bash
vpr --filter @lilian1315/create-element test --project browser tests/api.spec.ts
vpr --filter @lilian1315/create-element test --project exports
vpr --filter @lilian1315/create-element dev
vpr --filter @lilian1315/create-element coverage
vpr --filter @lilian1315/oxlint-plugin-create-element test
```

The core `test` and `coverage` tasks build first. Its `dev` task runs the packager in watch mode. Release tasks are `vpr release:core`, `vpr release:plugin`, and `vpr release:types`; they run their declared checks before bumping and tagging with `bumpp`. Publishing runs through `.github/workflows/publish.yml` when a package's release tag is pushed.

The root `README.md` is the documentation source of truth. `packages/create-element/README.md` is a tracked symlink to `../../README.md`. GitHub stores it as a link rather than a separate rendered Markdown file. Because npm omits symlinks, the publish workflow replaces the link with an identical regular file before publishing to npm. For local packing, materialize the README in a temporary package copy rather than replacing the tracked symlink.

## License

MIT
