# @lilian1315/oxlint-plugin-create-element

Oxlint rules for validating explicit DOM types used with `@lilian1315/create-element` JSX.

## Configuration

```json
{
  "jsPlugins": ["@lilian1315/oxlint-plugin-create-element"],
  "rules": {
    "create-element/valid-jsx-type-assertion": "error"
  }
}
```

The rule validates `asDom<'div'>(<div />)` and direct assertions such as
`<div /> as HTMLDivElement`. Mismatches are automatically fixable.
