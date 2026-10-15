# @lilian1315/oxlint-plugin-create-element

Oxlint rules for validating explicit DOM types used with `@lilian1315/create-element` JSX.

JSX expressions erase their intrinsic tag from the expression type. An explicit
`build<'button'>` generic restores a precise return type, but TypeScript alone does
not check that the JSX root is actually a button. This plugin catches that mismatch.

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
`<div /> as HTMLDivElement`. Mismatches are automatically fixable. It checks
literal intrinsic JSX roots; it cannot determine the root of a variable or
user component.

## Examples

```tsx
import { build } from '@lilian1315/create-element/dom'

// Valid: the explicit type matches the literal root.
const button = build<'button'>(<button>Save</button>)
const circle = build<'svg:circle'>(<svg:circle r={10} />)

// Invalid: the rule fixes the generic to 'button'.
const mismatch = build<'input'>(<button>Save</button>)
```

The rule also checks SVG and MathML prefixes and direct JSX assertions. It does
not add runtime validation or infer the rendered root of components. Prefer a
matching intrinsic root for an explicit `build` tag generic; use `mount` to manage
component or Fragment roots.

For a direct `h` root, `build(h('button', { children: 'Save' }))` already infers
`HTMLButtonElement`, so no explicit generic is needed.
