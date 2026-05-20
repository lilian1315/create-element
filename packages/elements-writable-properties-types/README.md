# @lilian1315/elements-writable-properties-types

Auto-generated TypeScript type definitions for **writable** DOM element properties, derived from `@types/web`.

## Purpose

Standard `HTMLElement` interfaces include both read-only and writable properties. This package extracts only the writable properties for each element type, making it suitable for type-safe attribute assignment in libraries like `@lilian1315/create-element`.

## Installation

```bash
pnpm add -D @lilian1315/elements-writable-properties-types
```

## Usage

```typescript
import type { DOMTypes } from '@lilian1315/elements-writable-properties-types'

// Only writable properties of HTMLInputElement
type InputProps = DOMTypes.HTMLElementTagNameMap['input']
// { value: string; checked: boolean; placeholder: string; ... }
```

## Regenerating

The types are generated from `@types/web` using `ts-morph`:

```bash
pnpm --filter @lilian1315/elements-writable-properties-types build
```

## License

MIT
