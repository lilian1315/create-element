# @lilian1315/create-element

[![npm](https://img.shields.io/npm/v/@lilian1315/create-element)](https://npmx.dev/package/@lilian1315/create-element)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Create real HTML, SVG, and MathML nodes with typed properties, JSX, and optional native signals. The default API creates DOM immediately: no virtual tree, renderer, or `build` step is required.

Deferred trees and server rendering are available separately under `/virtual`.

## Contents

- [Quick start](#quick-start)
- [JSX and components](#jsx-and-components)
- [Signal integrations](#signal-integrations)
- [DOM lifecycle](#dom-lifecycle)
- [Props and refs](#props-and-refs)
- [Virtual trees](#virtual-trees)
- [Server rendering](#server-rendering)
- [Public types](#public-types)
- [Entrypoints and specialization](#entrypoints-and-specialization)
- [Packages](#packages)
- [Development](#development)

## Quick start

```bash
pnpm add @lilian1315/create-element
```

```ts
import { createElement, dispose } from '@lilian1315/create-element'

const button = createElement('button', {
  class: 'primary',
  children: 'Save',
  onclick: () => console.log('Saved'),
})

document.body.append(button)

// Later: stop managed listeners/effects, then remove the node.
dispose(button)
button.remove()
```

`button` is an `HTMLButtonElement`. Props, children, event listeners, and refs are initialized before `createElement` returns. Insertion and removal use ordinary DOM methods. No signal library is required.

Children may be DOM nodes, VNodes, strings, numbers, `null`, `undefined`, or nested arrays of these values. Reactive integrations also accept their native sources. A DOM node keeps its identity when inserted; a VNode is materialized by the shared DOM engine.

## JSX and components

Configure TypeScript and write JSX in `.tsx` files:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@lilian1315/create-element"
  }
}
```

```tsx
import { dispose } from '@lilian1315/create-element'

const button = <button onclick={() => console.log('Saved')}>Save</button>
document.body.append(button)

// Later: dispose(button)
```

Default JSX returns a DOM `Node`, not a VNode. Intrinsic tags create their corresponding DOM elements. `createElement('button', props)` gives a precise `HTMLButtonElement` return type when needed; JSX expressions have the shared `Node` type. The optional [Oxlint plugin](packages/oxlint-plugin) checks direct assertions such as `<button /> as HTMLButtonElement` against the intrinsic tag.

Components execute immediately, once per JSX call, with all their props:

```tsx
import type { Child, Component } from '@lilian1315/create-element'

const Panel: Component<{ title: string; children?: Child }> = ({ title, children }) => (
  <section>
    <h2>{title}</h2>
    {children}
  </section>
)

const panel = (
  <Panel title="Welcome">
    <p>Ready.</p>
  </Panel>
)
document.body.append(panel)
```

A component can return DOM nodes, VNodes, text, arrays, empty values, or supported native sources. Non-node results are materialized as a `DocumentFragment`. Component bodies are not automatically rerun when a signal changes; pass sources into props and children for live updates.

Fragments also create real `DocumentFragment` objects:

```tsx
const children = (
  <>
    <span>A</span>
    <span>B</span>
  </>
)
const parent = <div>{children}</div>
```

Inserting a fragment consumes it, just like native DOM insertion. Its children retain their bindings in their new parent. Use the parent for later disposal, or dispose an uninserted fragment directly. A fragment is not a reusable virtual description.

SVG and MathML use explicit namespaces, including inside a namespaced parent:

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

Bare `svg` and `math` roots are supported; other namespaced tags require `svg:` or `math:` prefixes. For conditional children, use `condition ? <p>Ready</p> : null`; booleans are not supported children.

## Signal integrations

Choose the entry matching your source library and install its optional peer dependency:

| Entry suffix         | Install alongside this package | Accepted sources              |
| -------------------- | ------------------------------ | ----------------------------- |
| Base (no suffix)     | Nothing                        | Plain values only             |
| `/alien-signals`     | `alien-signals`                | Signals and computed signals  |
| `/alien-deepsignals` | `alien-deepsignals`            | Signals and computed signals  |
| `/faisceau`          | `faisceau`                     | Native `Reactive` values      |
| `/preact-signals`    | `@preact/signals-core`         | Signals and computed signals  |
| `/vue-reactivity`    | `@vue/reactivity`              | Refs, including computed refs |

```tsx
/** @jsxImportSource @lilian1315/create-element/preact-signals */

import { dispose } from '@lilian1315/create-element/preact-signals'
import { computed, signal } from '@preact/signals-core'

const count = signal(0)
const label = computed(() => `Count: ${count.value}`)
const button = (
  <button title={label} onclick={() => count.value++}>
    {count}
  </button>
)
document.body.append(button)

// Later: dispose(button) stops the subscriptions and managed listener.
```

Set `jsxImportSource` to the same integration path, or use a per-file pragma as above. Pass sources themselves, not pre-read values: `children: count` stays live, while `children: count.value` is a snapshot. Integrations recognize their own native sources, not arbitrary callbacks or another library's signals. There is no runtime adapter registration.

For computed, keyed tree reconciliation rather than immediate node creation, use the integration's [virtual entry](#virtual-trees).

## DOM lifecycle

| Operation                    | Result                                                          |
| ---------------------------- | --------------------------------------------------------------- |
| `createElement(tag, props?)` | Creates a detached element and binds supplied props immediately |
| `bind(element, props)`       | Initializes an existing unbound element; returns cleanup        |
| `dispose(node)`              | Stops managed resources on the node and its current subtree     |

`dispose` is idempotent and leaves nodes in place. Native DOM removal does not stop effects or managed listeners. Dispose before removing a managed subtree, or keep the cleanup returned by `bind`:

```ts
import { bind } from '@lilian1315/create-element/vue-reactivity'
import { shallowRef } from '@vue/reactivity'

const input = document.createElement('input')
const value = shallowRef('initial')
const stop = bind(input, {
  value,
  oninput: () => {
    value.value = input.value
  },
})

// Later: stop() removes subscriptions/listeners but leaves the last DOM values.
```

One active binding owns an element, including bindings installed by `createElement` with props, JSX, and virtual rendering. Binding an already managed element throws before mutation; dispose it or run its previous cleanup first. Ownership is shared across integrations. `createElement('div')` without props creates an unbound element.

`bind` preserves absent props and existing children. Supplying `children` or `innerHTML` replaces the old content and cleans managed resources in the removed subtree. Explicit empty children clear the element. Moving a managed child does not transfer ownership: its former binding may clean its resources later, while leaving the node in its new parent.

## Props and refs

Props use writable DOM property names such as `htmlFor`, `tabIndex`, `value`, and `checked`. Use `class`, lowercase native event names such as `onclick`, and native DOM events rather than React-style props or synthetic events.

- `class`: string, string array, or object of booleans. Objects update named classes; strings and arrays replace the class list.
- `style`: CSS string or property object, including custom properties such as `'--accent'`. Objects update named styles.
- `data`: dataset entries. Strings set values, `true` sets an empty attribute, and `false`, `null`, or `undefined` remove entries.
- `ref`: receives the initialized element synchronously and may return a cleanup function. Cleanup runs once when its binding is disposed.

Integrations support native sources in properties and structured values. Cleanup leaves the last DOM values in place. `children` and `innerHTML` are mutually exclusive; sanitize untrusted HTML before assigning it.

```ts
import { createElement, dispose } from '@lilian1315/create-element'

const panel = createElement('section', {
  ref: (element) => {
    const observer = new ResizeObserver(() => console.log(element.clientWidth))
    observer.observe(element)
    return () => observer.disconnect()
  },
})

document.body.append(panel)
// Later: dispose(panel) disconnects the observer.
```

## Virtual trees

Opt into deferred descriptions through `/virtual`. Constructing a VNode does not create DOM, execute components, or subscribe to sources.

The DOM and virtual APIs interoperate: immediate JSX, `createElement`, and `bind` accept VNode children, while virtual DOM rendering accepts existing DOM nodes without cloning them. Mixing representations uses the same binding, reconciliation, and cleanup engine. Only SSR rejects real DOM nodes.

```tsx
/** @jsxImportSource @lilian1315/create-element/virtual */

import { dispose } from '@lilian1315/create-element'
import { createVNode } from '@lilian1315/create-element/virtual'
import { build, mount } from '@lilian1315/create-element/virtual/dom'

const tree = createVNode('button', { children: 'Save' })
const button = build(tree) // HTMLButtonElement
document.body.append(button)

const stop = mount(
  document.body,
  <main>
    <p>Welcome</p>
  </main>,
)
// Later: stop() removes the mounted range and releases its resources.
// Or: dispose(button) stops resources on an independently built node.
```

`build` materializes an intrinsic root as a DOM element and a component/Fragment root as a `DocumentFragment`. Virtual JSX erases its tag from the expression type; `build<'button'>(<button />)` restores a precise DOM type. The generic performs no runtime validation. The Oxlint plugin verifies literal intrinsic roots and simple `const` aliases; it rejects unverifiable explicit tags, including component and fragment roots. Omit the generic when the root is unknown.

`mount` replaces a target's contents and returns one cleanup for the mounted range. A stale cleanup cannot remove a newer mount. It accepts virtual descriptions, nodes, text, arrays, empty values, and supported native sources. It does not hydrate server HTML.

Virtual `createVNode` accepts intrinsic tag names and children in `props.children`. Virtual components execute during rendering; use JSX to describe them. Import virtual `Component` and shared `Child` types from the matching `/virtual` entry.

For reactive lists, use a computed source of VNodes and stable sibling-local keys:

```ts
import { createVNode } from '@lilian1315/create-element/preact-signals/virtual'
import { mount } from '@lilian1315/create-element/preact-signals/virtual/dom'
import { computed, signal } from '@preact/signals-core'

const items = signal([
  { id: 'a', label: 'First' },
  { id: 'b', label: 'Second' },
])
const rows = computed(() =>
  items.value.map((item) => createVNode('li', { key: item.id, children: item.label })),
)
const stop = mount(document.body, createVNode('ul', { children: rows }))
items.value = [...items.value].reverse()
// Later: stop()
```

Matching keys and types preserve nodes across updates; unkeyed children match by position and type. Keys describe virtual reconciliation, not default DOM JSX identity. Repeated `mount` calls replace the mount rather than patching it.

## Server rendering

SSR is part of the virtual API and runs without a DOM implementation:

```tsx
/** @jsxImportSource @lilian1315/create-element/vue-reactivity/virtual */

import { renderToString } from '@lilian1315/create-element/vue-reactivity/virtual/server'
import { shallowRef } from '@vue/reactivity'

const count = shallowRef(5)
const html = renderToString(<output>Count: {count}</output>)
// '<output>Count: 5</output>'
```

Use the base `/virtual/server` entry for plain trees. Rendering is synchronous and untracked: it reads current native source values without installing subscriptions. Text and attributes are escaped; event listeners and refs are omitted. Real DOM nodes are rejected. `innerHTML` is serialized as supplied. There is no public hydration API.

## Public types

The root and integration entries export `ElementProps<TagOrElement>`, `ElementPropsMap`, `Component<Props>`, `Child`, `ChildValue`, `Children`, `MaybeSource<Value>`, `DomElement`, `PrefixedElementTag`, and `ElementPrefixedTagNameMap`.

`ElementProps` powers both `createElement` and `bind`; refs infer the specific element type. Binding a native element or subclass uses the generated `WritableDOMType` mapping, excluding readonly properties, methods, and custom subclass properties. Mapping follows TypeScript's structural typing.

The corresponding `/virtual` entry exports `VNode`, `VNodeProps<TagOrElement>`, `VNodePropsMap`, and the virtual `Component<Props>` type, plus shared child, element, and source types. `Child`, `ChildValue`, and `Children` are the same types in both APIs. Native source payloads are checked in both APIs; unknown payloads cannot bypass prop or child constraints.

## Entrypoints and specialization

Each base or integration entry exposes this structure:

| Path                                                 | Runtime exports                    |
| ---------------------------------------------------- | ---------------------------------- |
| `@lilian1315/create-element[/integration]`           | `createElement`, `bind`, `dispose` |
| `…/jsx-runtime`, `…/jsx-dev-runtime`                 | Immediate DOM JSX                  |
| `…/virtual`                                          | `createVNode`                      |
| `…/virtual/dom`                                      | `build`, `mount`                   |
| `…/virtual/server`                                   | `renderToString`                   |
| `…/virtual/jsx-runtime`, `…/virtual/jsx-dev-runtime` | Deferred JSX                       |

Set `jsxImportSource` to the root/integration path for DOM JSX, or append `/virtual` for deferred JSX. Keep the same native integration throughout a tree. The virtual server entry can be imported and used without `document`; calling the default DOM factories requires a DOM implementation.

JSX runtime functions are compiler targets, not a hand-written creation API. Use TSX or `createElement`/`createVNode` directly; the runtime's `JSX` namespace defines consumer-facing JSX types and validation.

Following [Formisch's build-time specialization](https://formisch.dev/blog/one-core-six-frameworks/), the integrations share binding and reconciliation code. `packages/create-element/scripts/specialize-reactivity.ts` selects native primitives and source declarations at build time. `packages/create-element/scripts/entries.ts` defines the npm exports; the build updates the manifest. npm publishes specialized JavaScript and matching declarations from `dist/`.

## Packages

| Package                                                                                         | Purpose                                                           |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [`@lilian1315/create-element`](packages/create-element)                                         | DOM creation, JSX, native signals, and optional virtual rendering |
| [`@lilian1315/elements-writable-properties-types`](packages/elements-writable-properties-types) | Generated writable DOM types and tag maps; separately published   |
| [`@lilian1315/oxlint-plugin-create-element`](packages/oxlint-plugin)                            | Checks intrinsic DOM assertions and explicit virtual build tags   |

## Development

```bash
vp install
vp exec playwright install --with-deps chromium
vpr test
vpr check
```

Project commands are [Vite+](https://viteplus.dev/) tasks in root/package `vite.config.ts` files. Use `vpr` (`vp run`), rather than the similarly named built-in `vp build` or `vp test`. The installation lifecycle `prepare` script stays in `package.json` to configure commit hooks.

Test tasks perform their required builds. `vpr test` runs DOM and virtual browser/type tests, Node export checks, generated DOM type tests, and plugin `RuleTester` cases. `vpr check` verifies formatting, lint, and types; `vpr fix` applies fixes. `vpr build` produces library artifacts without tests and excludes examples.

```bash
vpr --filter @lilian1315/create-element test --project browser tests/jsx/plain.spec.tsx
vpr --filter @lilian1315/create-element test --project exports
vpr --filter @lilian1315/create-element dev
vpr --filter @lilian1315/create-element coverage
vpr --filter @lilian1315/oxlint-plugin-create-element test
```

Package build tasks include dependency builds, so targeted builds regenerate writable-property types first. Release tasks are `vpr release:core`, `vpr release:plugin`, and `vpr release:types`; their checks precede `bumpp`. Publishing runs through `.github/workflows/publish.yml` when a package tag is pushed.

This root README is the documentation source of truth. `packages/create-element/README.md` is a tracked symlink to it. npm omits symlinks, so CI materializes an identical regular file in the package before publishing. For local packing, materialize the README in a temporary package copy rather than replacing the tracked symlink.

## License

MIT
