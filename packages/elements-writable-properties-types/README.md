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

Map a native element type directly to its writable interface:

```typescript
import type { WritableDOMType } from '@lilian1315/elements-writable-properties-types'

type AnchorProps = WritableDOMType<HTMLAnchorElement> // DOMTypes.HTMLAnchorElement
type InputProps = WritableDOMType<HTMLInputElement> // DOMTypes.HTMLInputElement
```

`WritableDOMType` checks specific interfaces before their base interfaces, supports
subclasses, and distributes over unions. Unsupported types resolve to `never`.
Matching follows TypeScript's structural typing: interfaces with identical shapes
cannot be distinguished by name and use the first matching generated branch.

The package also exports the generated DOM interface names used by tooling:

```typescript
import {
  elementTagNameMap,
  htmlElementTagNameMap,
  mathMLElementTagNameMap,
  svgElementTagNameMap,
} from '@lilian1315/elements-writable-properties-types/tag-name-map'

elementTagNameMap.div // 'HTMLDivElement'
elementTagNameMap['svg:path'] // 'SVGPathElement'
```

## Regenerating

The types are generated from `@types/web` using the TypeScript 6 compiler API:

```bash
vpr --filter @lilian1315/elements-writable-properties-types build
```

## Testing

```bash
vpr --filter @lilian1315/elements-writable-properties-types test
```

The task regenerates the types, then runs Vitest type tests using `expectTypeOf`. These cover native element mappings, subclasses, unions, invalid inputs, and excluded properties. They also run with the workspace's `vpr test` task.

## License

MIT
