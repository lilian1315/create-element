# @lilian1315/create-element

[![npm](https://img.shields.io/npm/v/@lilian1315/create-element)](https://npmx.dev/package/@lilian1315/create-element)
[![jsr](https://jsr.io/badges/@lilian1315/create-element)](https://jsr.io/@lilian1315/create-element)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Type-safe `document.createElement` wrapper with JSX support and optional reactive library integrations for building DOM elements.

## Packages

| Package                                                                                           | Description                                                                   |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [`@lilian1315/create-element`](./packages/create-element)                                         | Core library — type-safe element creation, JSX runtime, and reactive adapters |
| [`@lilian1315/elements-writable-properties-types`](./packages/elements-writable-properties-types) | Auto-generated TypeScript types for writable DOM element properties           |

## Quick Start

```bash
pnpm add @lilian1315/create-element
```

```typescript
import { h } from '@lilian1315/create-element'

const app = h('div', { class: 'container' }, [
  h('h1', null, 'Hello World!'),
  h('button', { onclick: () => alert('Clicked!') }, 'Click me'),
])

document.body.appendChild(app)
```

## Features

- **Type-safe** — full TypeScript support with autocompletion for element attributes
- **HTML, SVG, and MathML** — create any DOM element with namespace-aware prefixes (`svg:circle`, `math:mi`)
- **JSX** — use JSX syntax via standard `react-jsx` transform
- **Reactive adapters** — optional first-class integrations with popular signal libraries:
  - [alien-signals](https://github.com/stackblitz/alien-signals)
  - [alien-deepsignals](https://github.com/CCherry07/alien-deepsignals)
  - [faisceau](https://github.com/lilian1315/faisceau)
  - [@preact/signals-core](https://github.com/preactjs/signals)
  - [@vue/reactivity](https://github.com/vuejs/core/tree/main/packages/reactivity)

## Documentation

See the full [API documentation and usage guide](./packages/create-element/README.md).

## Development

```bash
pnpm install
pnpm -r build
pnpm -r test
```

## License

MIT
