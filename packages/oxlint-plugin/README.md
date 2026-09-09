# @lilian1315/oxlint-plugin

Oxlint rules for validating explicit DOM types used with `@lilian1315/create-element` JSX.

## Configuration

```json
{
  "jsPlugins": ["@lilian1315/oxlint-plugin"],
  "rules": {
    "create-element/valid-jsx-element-type-assertion": "error"
  }
}
```

The rule validates `asDom<'div'>(<div />)` and direct assertions such as
`<div /> as HTMLDivElement`. Mismatches are automatically fixable.
