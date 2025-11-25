# @lilian1315/create-element

A type-safe `document.createElement` wrapper with JSX support and optional integrations ([alien-signals](https://github.com/stackblitz/alien-signals), [@preact/signals-core](https://github.com/preactjs/signals), etc.) for building DOM elements.

## Features

- Type-safe element creation with TypeScript
- Support for HTML, SVG, and MathML elements
- Simple attribute and event handling
- JSX support
- Optional reactive programming with [alien-signals](https://github.com/stackblitz/alien-signals), [@preact/signals-core](https://github.com/preactjs/signals) and more

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

For reactive JSX, use `jsxImportSource: "@lilian1315/create-element/alien-signals"`

## Reactive Support (Optional)

```typescript
import { h } from '@lilian1315/create-element/alien-signals'
import { signal } from 'alien-signals'

const count = signal(0)

const counter = h('div', null, [
  h('p', null, 'Count: ', count),
  h('button', { onClick: () => count(count() + 1) }, 'Increment')
])
```

Requires: `pnpm add alien-signals`

## License

MIT
