# @lilian1315/oxlint-plugin-create-element

Oxlint rules for validating explicit DOM types used with `@lilian1315/create-element` JSX.

Default JSX creates DOM nodes, while `/virtual` JSX creates deferred VNodes.
Both erase their intrinsic tag from the shared expression type. This plugin checks
direct DOM assertions and explicit virtual `build<'button'>` tags against known JSX roots.

## Installation

```bash
pnpm add -D @lilian1315/oxlint-plugin-create-element
```

## Configuration

Add the plugin and rule to your Oxlint configuration (for example, `.oxlintrc.json`):

```json
{
  "jsPlugins": ["@lilian1315/oxlint-plugin-create-element"],
  "rules": {
    "create-element/valid-jsx-type-assertion": "error"
  }
}
```

The rule validates `build<'div'>(<div />)` and direct assertions such as
`<div /> as HTMLDivElement`. Mismatches are automatically fixable. For `build`,
it also follows simple `const` references and aliases to intrinsic JSX roots,
respecting lexical scope. Parentheses, `as`, `satisfies`, and non-null assertions
do not hide the original root.

Explicit build tags must be string literals with a verifiable intrinsic JSX root.
Mutable variables, parameters, imports, function results, components, and fragments
cannot be verified and are reported without an automatic fix. Inline a matching
intrinsic root, use a `const` initialized from one, or omit the generic.

## Examples

```tsx
/** @jsxImportSource @lilian1315/create-element/virtual */

import { build } from '@lilian1315/create-element/virtual/dom'
import type { JSX } from '@lilian1315/create-element/virtual/jsx-runtime'

// Valid: the explicit type matches the literal root.
const button = build<'button'>(<button>Save</button>)
const circle = build<'svg:circle'>(<svg:circle r={10} />)

// Invalid: the rule fixes the generic to 'button'.
const mismatch = build<'input'>(<button>Save</button>)

const tree = <span />
const alias = tree
const span = build<'span'>(alias) // Valid: the const root is known.
const wrong = build<'div'>(tree) // Invalid: fixes the generic to 'span'.

function render(tree: JSX.Element) {
  return build<'span'>(tree) // Invalid: the root cannot be verified.
}
```

The rule also checks SVG and MathML prefixes and direct JSX assertions. It does
not add runtime validation or infer the rendered root of components. Prefer a
matching intrinsic root for an explicit `build` tag generic; use `mount` to manage
component or Fragment roots.

For a direct `createVNode` root from `/virtual`, `build(createVNode('button', { children: 'Save' }))` already infers
`HTMLButtonElement`, so no explicit generic is needed.
