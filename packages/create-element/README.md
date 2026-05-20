# @lilian1315/create-element

[![npm](https://img.shields.io/npm/v/@lilian1315/create-element)](https://npmx.dev/package/@lilian1315/create-element)
[![jsr](https://jsr.io/badges/@lilian1315/create-element)](https://jsr.io/@lilian1315/create-element)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Type-safe `document.createElement` wrapper with JSX support and optional reactive library integrations for building DOM elements.

## Features

- **Type-safe** element creation with full TypeScript autocompletion ([Usage](#usage))
- Support for **HTML, SVG, and MathML** elements ([SVG and MathML](#svg-and-mathml))
- Flexible attribute handling: classes, styles, datasets, events ([Attributes](#attributes))
- **JSX** support with Fragments and function components ([JSX Support](#jsx-support))
- **Reactive adapters** for signal-based UI updates ([Reactive Support](#reactive-support-optional))

## Installation

```bash
pnpm add @lilian1315/create-element
```

## Usage

```typescript
import { h } from '@lilian1315/create-element'

// Create a simple element
const div = h('div', { class: 'container' }, 'Hello World!')

// With event handlers
const button = h('button', {
  onclick: () => console.log('Clicked!'),
  children: 'Click me',
})

// Nested elements
const app = h('div', null, [h('h1', null, 'My App'), button])
```

## API

### `h(tag, attributes?, ...children)`

Creates a DOM element and returns it.

| Parameter | Type | Description |
| --- | --- | --- |
| `tag` | `string` | HTML tag name (e.g. `'div'`), or prefixed for SVG/MathML (`'svg:circle'`, `'math:mi'`) |
| `attributes` | `object \| null` | Optional attribute bag including special helpers (`class`, `style`, `data`, `innerHTML`, `children`) |
| `children` | `Child[]` | Additional child nodes — strings, numbers, DOM nodes, `null`, or arrays thereof |

**Returns:** the created DOM element (`HTMLElement`, `SVGElement`, or `MathMLElement`).

### Attributes

```typescript
// Classes — string, array, or conditional object
h('div', { class: 'btn primary' })
h('div', { class: ['btn', 'primary'] })
h('div', { class: { btn: true, primary: true, active: false } })

// Styles — string or object
h('div', { style: 'color: red' })
h('div', { style: { color: 'red', fontSize: '16px' } })

// Events — lowercase on* handlers
h('button', { onclick: () => console.log('clicked') })

// Data attributes — mapped to element.dataset
h('div', {
  data: {
    testId: 'my-component', // data-test-id="my-component"
    active: true,           // data-active=""
    hidden: false,          // removed
    count: null,            // removed
    empty: undefined,       // removed
  },
})

// innerHTML (mutually exclusive with children)
h('div', { innerHTML: '<span>content</span>' })
```

### SVG and MathML

Use `svg:` or `math:` prefixes for namespace-aware element creation:

```typescript
// SVG elements
const svg = h('svg', { width: '100', height: '100' })
const circle = h('svg:circle', { cx: '50', cy: '50', r: '20' })

// MathML elements
const math = h('math')
const variable = h('math:mi', null, 'x')
```

The root `svg` and `math` tags do not need a prefix.

## JSX Support

Configure TypeScript to use the JSX runtime:

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@lilian1315/create-element",
  },
}
```

### Elements and function components

```tsx
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>
}

function App() {
  return (
    <div class="container">
      <Greeting name="World" />
      <button onclick={() => console.log('clicked')}>Click me</button>
    </div>
  )
}

document.body.appendChild(App())
```

### Fragments

Use `Fragment` to group children without an extra DOM wrapper. A Fragment returns a `Node[]`.

```tsx
import { Fragment } from '@lilian1315/create-element/jsx-runtime'

function List() {
  return (
    <>
      <li>One</li>
      <li>Two</li>
    </>
  )
}
```

### Reactive JSX

For reactive JSX, set `jsxImportSource` to the adapter path:

| Signal library | `jsxImportSource` |
| --- | --- |
| alien-signals | `@lilian1315/create-element/alien-signals` |
| alien-deepsignals | `@lilian1315/create-element/alien-deepsignals` |
| faisceau | `@lilian1315/create-element/faisceau` |
| @preact/signals-core | `@lilian1315/create-element/preact-signals` |
| @vue/reactivity | `@lilian1315/create-element/vue-reactivity` |

## Reactive Support (Optional)

Each reactive adapter wraps `createElement` so that signal/computed values in attributes, styles, datasets, and children are automatically tracked and updated in the DOM.

Import `h` from the adapter that matches your signal library and install the corresponding peer dependency.

### alien-signals

```typescript
import { h } from '@lilian1315/create-element/alien-signals'
import { computed, signal } from 'alien-signals'

const count = signal(0)
const label = computed(() => `Count: ${count()}`)

const counter = h('section', { class: 'counter' }, [
  h('p', null, label),
  h('button', { onclick: () => count(count() + 1) }, 'Increment'),
])
```

Requires: `pnpm add alien-signals`

### alien-deepsignals

```typescript
import { h } from '@lilian1315/create-element/alien-deepsignals'
import { computed, signal } from 'alien-deepsignals'

const count = signal(0)
const label = computed(() => `Count: ${count.get()}`)

const counter = h('section', null, [
  h('p', null, label),
  h('button', { onclick: () => count.set(count.get() + 1) }, 'Increment'),
])
```

Requires: `pnpm add alien-deepsignals`

### faisceau

```typescript
import { h } from '@lilian1315/create-element/faisceau'
import { computed, signal } from 'faisceau'

const count = signal(0)
const label = computed(() => `Count: ${count.get()}`)

const counter = h('section', null, [
  h('p', null, label),
  h('button', { onclick: () => count.set(count.get() + 1) }, 'Increment'),
])
```

Requires: `pnpm add faisceau`

### @preact/signals-core

```typescript
import { h } from '@lilian1315/create-element/preact-signals'
import { computed, signal } from '@preact/signals-core'

const count = signal(0)
const label = computed(() => `Count: ${count.value}`)

const counter = h('section', null, [
  h('p', null, label),
  h('button', { onclick: () => (count.value = count.value + 1) }, 'Increment'),
])
```

Requires: `pnpm add @preact/signals-core`

### @vue/reactivity

```typescript
import { h } from '@lilian1315/create-element/vue-reactivity'
import { computed, ref } from '@vue/reactivity'

const count = ref(0)
const label = computed(() => `Count: ${count.value}`)

const counter = h('section', null, [
  h('p', null, label),
  h('button', { onclick: () => count.value++ }, 'Increment'),
])
```

Requires: `pnpm add @vue/reactivity`

## License

MIT
