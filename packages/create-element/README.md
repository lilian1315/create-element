# @lilian1315/create-element

Type-safe `document.createElement` wrapper with JSX support and optional reactive lib integrations for building DOM elements.

## Features

- Type-safe element creation with TypeScript ([Usage](#usage))
- Support for HTML, SVG, and MathML elements
- Simple attribute and event handling ([Attributes](#attributes))
- JSX support ([JSX Support](#jsx-support))
- Optional reactive programming with [alien-signals](https://github.com/stackblitz/alien-signals), [alien-deepsignals](https://www.npmjs.com/package/alien-deepsignals), [faisceau](https://github.com/lilian1315/faisceau), and [@preact/signals-core](https://github.com/preactjs/signals) ([Reactive Support](#reactive-support-optional))

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
  onclick: () => console.log('Clicked!')
}, 'Click me')

// Nested elements
const app = h('div', null, [
  h('h1', null, 'My App'),
  button
])
```

## API

### `h(tag, attributes?, ...children)`

- `tag`: HTML tag name (e.g., `'div'`, `'button'`)
- `attributes`: Optional object with element attributes
- `children`: Child elements or text

### Attributes

```typescript
// Classes
h('div', { class: 'btn primary' })
h('div', { class: ['btn', 'primary'] })
h('div', { class: { btn: true, primary: true, active: false } })

// Styles
h('div', { style: 'color: red' })
h('div', { style: { color: 'red', fontSize: '16px' } })

// Events
h('button', { onclick: () => console.log('clicked') })

// Data attributes
h('div', { data: { testId: 'my-component' } })
```

### SVG and MathML

```typescript
// SVG elements
const svg = h('svg', { width: '100', height: '100' })
const circle = h('svg:circle', { cx: '50', cy: '50', r: '20' })

// MathML elements
const math = h('math')
const variable = h('math:mi', null, 'x')
```

## JSX Support

Use JSX syntax with TypeScript configuration:

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@lilian1315/create-element"
  }
}
```

```tsx
// Regular JSX
function App() {
  return (
    <div class="container">
      <h1>My App</h1>
      <button onclick={() => console.log('clicked')}>
        Click me
      </button>
    </div>
  )
}
```

For reactive JSX, set `jsxImportSource` to the adapter you use (e.g. `@lilian1315/create-element/alien-signals`, `@lilian1315/create-element/alien-deepsignals`, `@lilian1315/create-element/faisceau`, `@lilian1315/create-element/preact-signals`).

## Reactive Support (Optional)

`@lilian1315/create-element` ships multiple reactive adapters. Import `h` from the adapter that matches your signal library and install the corresponding dependency. Attributes, styles, datasets, and children will stay in sync automatically.

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

## License

MIT
