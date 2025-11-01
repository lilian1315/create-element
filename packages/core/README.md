# @lmoulanier/el

A simple `document.createElement` alternative with TypeScript support for creating DOM elements.

## Features

- Type-safe element creation with TypeScript
- Support for HTML, SVG, and MathML elements
- Simple attribute and event handling
- Optional reactive programming with `alien-deepsignals`

## Installation

```bash
pnpm add @lmoulanier/el
```

## Usage

```typescript
import { el } from '@lmoulanier/el'

// Create a simple element
const div = el('div', { class: 'container' }, 'Hello World!')

// With event handlers
const button = el('button', {
  onclick: () => console.log('Clicked!')
}, 'Click me')

// Nested elements
const app = el('div', null, [
  el('h1', null, 'My App'),
  button
])
```

## API

### `el(tag, attributes?, ...children)`

- `tag`: HTML tag name (e.g., `'div'`, `'button'`)
- `attributes`: Optional object with element attributes
- `children`: Child elements or text

### Attributes

```typescript
// Classes
el('div', { class: 'btn primary' })
el('div', { class: ['btn', 'primary'] })
el('div', { class: {btn: true, primary: true, active: false} })

// Styles  
el('div', { style: 'color: red' })
el('div', { style: { color: 'red', fontSize: '16px' } })

// Events
el('button', { onclick: () => console.log('clicked') })

// Data attributes
el('div', { data: { testId: 'my-component' } })
```

### SVG and MathML

```typescript
// SVG elements
const svg = el('svg', { width: '100', height: '100' })
const circle = el('svg:circle', { cx: '50', cy: '50', r: '20' })

// MathML elements  
const math = el('math')
const variable = el('math:mi', null, 'x')
```

## Reactive Support (Optional)

```typescript
import { el } from '@lmoulanier/el/alien-deepsignals'
import { signal } from 'alien-deepsignals'

const count = signal(0)

const counter = el('div', null, [
  el('p', null, 'Count: ', count),
  el('button', { onClick: () => count.set(count.get() + 1) }, 'Increment')
])
```

Requires: `pnpm add alien-deepsignals alien-signals`

## License

MIT