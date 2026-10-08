# @lilian1315/create-element

Describe HTML, SVG, and MathML trees with `h` or JSX, then render them in the browser or on the server. Tree construction does not create DOM nodes, run components, or subscribe to signals.

## Browser

```tsx
/** @jsxImportSource @lilian1315/create-element/preact-signals */

import { signal } from '@preact/signals-core'
import { build } from '@lilian1315/create-element/preact-signals/dom'
import { dispose } from '@lilian1315/create-element/preact-signals/dom'

const count = signal(0)
const button = build<'button'>(
  <button
    class={{ counter: true }}
    style={{ color: 'red' }}
    data={{ testId: 'counter' }}
    onclick={() => count.value++}
  >
    Count: {count}
  </button>,
)

document.body.append(button)

dispose(button)
button.remove()
```

`build(h('button', { children: 'Save' }))` infers `HTMLButtonElement`. JSX erases its intrinsic tag from the expression type, so use `build<'button'>(<button />)` when you need that precise return type. The generic does not perform a runtime check. The Oxlint rule checks a literal JSX root, including SVG and MathML tags, but cannot establish the root of a variable or user component.

`build` accepts one `h`/JSX description. A component may render it, but its result must contain exactly one element. Empty results and multiple roots throw. A Fragment cannot be a `build` root. `build` returns a detached live DOM element.

`h` accepts intrinsic tag names only. Call reusable functions directly, such as `Counter({ count: 1 })`, or use `<Counter count={1} />` in JSX to defer their execution until rendering.

`h` accepts children only in `props.children`:

```ts
import { h } from '@lilian1315/create-element'
import { build } from '@lilian1315/create-element/dom'

const button = build(h('button', { children: ['Save ', 1] }))
```

Children may contain text, numbers, ignored booleans and empty values, nested arrays, tree descriptions, native signals for the selected integration, and existing DOM nodes. Existing nodes retain their identity and move when inserted. Prefix nested SVG and MathML tags with `svg:` and `math:`; the root `svg` and `math` tags need no prefix.

## DOM lifecycle

| Operation              | Result                                                         |
| ---------------------- | -------------------------------------------------------------- |
| `build(tree)`          | Detached element with effects and listeners installed          |
| `bind(element, props)` | Applies supplied props and returns a cleanup function          |
| `dispose(element)`     | Stops resources managed on the element and its current subtree |
| `mount(target, tree)`  | Replaces target content and returns a cleanup for that mount   |

`dispose` is idempotent and leaves the element in the DOM. Native `element.remove()` does not dispose it. A `bind` cleanup stops its effects and listeners, leaving the last DOM values in place. Each element has one active binding, whether installed by `build`, `mount`, or `bind`. Calling `bind` on an already managed element throws before mutation; call `dispose(element)` or its binding cleanup before binding it again. A shared symbol enforces this rule across integrations. A stale mount cleanup cannot remove a newer mount on the same target.

Use `bind` to initialize an existing, unbound element:

```ts
import { bind } from '@lilian1315/create-element/preact-signals/dom'
import { signal } from '@preact/signals-core'

const input = document.createElement('input')
const value = signal('initial')
const stop = bind(input, { value, oninput: () => (value.value = input.value) })
// Later: stop() leaves the last value and removes the managed listener.
```

A managed child moved to another parent retains its resources. Cleaning its former parent or mount does not dispose that moved child; dispose it or its current parent when it is no longer needed.

`bind` leaves absent props and existing children untouched. Passing `children` or `innerHTML` replaces all old children and cleans library resources in the removed subtree. Explicit `children: null` or `children: undefined` empties the element, as does `innerHTML: ''`. `children` and `innerHTML` are mutually exclusive; using both throws before mutation. Treat `innerHTML` as trusted or sanitize it before passing it to the renderer.

`class` accepts a string, string array, or object of booleans. Strings and arrays replace the class list; objects update their named classes. `style` accepts a string or property object; a string replaces the inline style, while an object updates its named properties. `data` updates named dataset entries: strings set values, `true` sets an empty attribute, and `false`, `null`, and `undefined` remove entries. Values and object members may be native signals. When a reactive object loses a key, its previously managed contribution is removed. Cleanup leaves the last applied DOM state.

`ref` is a tag typed callback that receives the initialized element synchronously, even when it is detached. It may return a cleanup function, which runs once on binding cleanup, `dispose`, or removal by the renderer. Replacing an element's children does not clean that element's own ref. Refs are not called during SSR. User components must pass a received ref to an intrinsic element themselves.

Reactive children reconcile with their previous tree. Matching elements update in place, and unchanged signal bindings and refs stay active. Unkeyed children match by position and type. For lists that reorder, insert, or remove items, give each sibling a stable, unique string or number `key`, such as `h('li', { key: item.id, children: item.label })`. A matching key and type preserve the DOM node across moves; changing either replaces it. Keys are local to siblings and are never rendered as attributes. Keyed components and fragments preserve their entire DOM range. Reorders use native `moveBefore` when available and applicable, preserving browser state such as focus, and otherwise fall back to `insertBefore`. Calling `mount` again still replaces the target's content.

## Server rendering

```ts
import { h } from '@lilian1315/create-element/vue-reactivity'
import { renderToString } from '@lilian1315/create-element/vue-reactivity/server'

const html = renderToString(h('p', { children: 'Hello' }))
```

The server renderer does not need `document` and runs the entire render untracked, including native signal reads inside components. It restores the caller's tracking state even if rendering throws. It escapes text and attributes, preserves namespace and form rules, and throws if it encounters a real DOM node. `innerHTML` is serialized as supplied. There is no public hydration API yet.

## Public types

Each base or integration entry exports `Component<Props>`, `VNodeProps<TagOrElement>`, `VNodePropsMap`, `VNodeChild`, `VNodeChildValue`, `VNodeChildren`, `MaybeSource<Value>`, `VNode`, `DomElement`, `PrefixedElementTag`, `ElementPrefixedTagNameMap`. These types use the native source type of that entry. Signal payloads must match their prop or child values; `Signal<unknown>` does not bypass these checks.

`bind` shares `VNodeProps` with `h` and JSX. `VNodeProps` accepts a tag name or native element type, such as `VNodeProps<'input'>` or `VNodeProps<HTMLInputElement>`. Native elements and subclasses use the generated `WritableDOMType` mapping; refs retain the exact received element type. Custom subclass properties are excluded. Mapping uses TypeScript's structural element types, so structurally identical interfaces cannot be distinguished.

`VNodeChildValue` describes a value rendered by a child source, including arrays whose members may themselves be sources. Use it when a signal can switch between different kinds of children:

```ts
import { h, type VNodeChildValue } from '@lilian1315/create-element/preact-signals'
import { signal } from '@preact/signals-core'

const content = signal<VNodeChildValue>(h('span', { children: 'Ready' }))
content.value = [h('button', { children: 'Continue' }), ' or cancel']
```

## Entrypoints and specialization

The base package and each of `alien-signals`, `alien-deepsignals`, `faisceau`, `preact-signals`, and `vue-reactivity` expose the same paths:

| Path                                       | Exports                             |
| ------------------------------------------ | ----------------------------------- |
| `@lilian1315/create-element[/integration]` | `h`                                 |
| `…/dom`                                    | `build`, `bind`, `dispose`, `mount` |
| `…/server`                                 | `renderToString`                    |
| `…/jsx-runtime`, `…/jsx-dev-runtime`       | JSX compiler entries                |

Import `build` from `…/dom` (previously exported from the base or integration entry). The root entry only describes trees and has no DOM renderer dependency.

The public entry inventory in `scripts/entries.ts` drives the build and the npm/JSR export maps. The build regenerates both manifests with `scripts/generate-exports.ts`.

Set `jsxImportSource` to the base path or the integration path in `tsconfig.json`. Each integration uses its own native source detector, reader, effect, and untracked reader.

Following [Formisch's build-time specialization](https://formisch.dev/blog/one-core-six-frameworks/), the JSX, DOM, and SSR entries have one source implementation. `vp pack` compiles those entries for the base package and each integration. The plugin in `scripts/specialize-reactivity.ts` redirects imports of `reactivity-ops/index.ts` to `reactivity-ops/<integration>.ts`, including the `Source` type in the emitted declarations. There is no runtime engine selector and no generated copy of the renderers in `src/`.

Both npm and JSR publish the specialized files in `dist/`; JSR's JavaScript entries reference their declarations with `@ts-self-types`. Run `vpr build` before working on consumers, or `vpr --filter @lilian1315/create-element dev` to rebuild all integrations on changes. `vpr test` builds the package before testing its integrations and published types. Run `vpr --filter @lilian1315/create-element test:exports` to check the published entrypoints and dependency isolation.
