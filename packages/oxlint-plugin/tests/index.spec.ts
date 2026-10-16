import { RuleTester } from 'vite-plus/lint/plugins-dev'
import { describe, it } from 'vite-plus/test'

import plugin from '../src/index'

RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const rule = plugin.rules['valid-jsx-type-assertion']
if (!rule) throw new Error('Missing valid-jsx-type-assertion rule')

const tester = new RuleTester({
  languageOptions: { parserOptions: { lang: 'tsx' } },
})

tester.run('valid-jsx-type-assertion', rule, {
  valid: [
    '<div /> as HTMLDivElement',
    '<svg /> as SVGSVGElement',
    '<svg:path /> as SVGPathElement',
    '<math:mi /> as MathMLElement',
    '<custom-element /> as CustomElement',
    "build<'button'>(<button />)",
    ...['span', 'svg:path', 'math:mi'].map((tag) => ({
      name: `resolves a const ${tag} root`,
      code: `const tree = <${tag} />; build<'${tag}'>(tree)`,
    })),
    {
      name: 'follows const aliases',
      code: "const tree = <span />; const alias = tree; build<'span'>(alias)",
    },
    {
      name: 'finds a const in an enclosing scope',
      code: "const tree = <span />; function render() { return build<'span'>(tree) }",
    },
    {
      name: 'resolves alias initializers in their own lexical scope',
      code: `
        const tree = <span />
        const alias = tree
        function render() {
          const tree = <div />
          return build<'span'>(alias)
        }
      `,
    },
    {
      name: 'allows unverifiable roots when no tag generic is supplied',
      code: 'function render(tree) { return build(tree) }',
    },
    {
      name: 'ignores other functions and member calls',
      code: "other<'span'>(tree); dom.build<'span'>(tree)",
    },
  ],
  invalid: [
    {
      name: 'fixes direct DOM assertions',
      code: '<div /> as HTMLSpanElement',
      errors: [
        {
          messageId: 'assertion',
          data: { tag: 'div', expected: 'HTMLDivElement', actual: 'HTMLSpanElement' },
        },
      ],
      output: '<div /> as HTMLDivElement',
    },
    ...['button', 'svg:path', 'math:mi'].map((tag) => ({
      name: `fixes an inline ${tag} root's build tag`,
      code: `build<'div'>(<${tag} />)`,
      errors: [{ messageId: 'build', data: { tag, expected: tag, actual: 'div' } }],
      output: `build<'${tag}'>(<${tag} />)`,
    })),
    {
      name: 'follows const aliases and fixes mismatching tags',
      code: "const tree = <span />; const alias = tree; build<'div'>(alias)",
      errors: [{ messageId: 'build', data: { tag: 'span', expected: 'span', actual: 'div' } }],
      output: "const tree = <span />; const alias = tree; build<'span'>(alias)",
    },
    {
      name: 'uses the nearest binding',
      code: "const tree = <span />; { const tree = <div />; build<'span'>(tree) }",
      errors: [{ messageId: 'build', data: { tag: 'div', expected: 'div', actual: 'span' } }],
      output: "const tree = <span />; { const tree = <div />; build<'div'>(tree) }",
    },
    ...['(<span />)', '<span /> as HTMLSpanElement', '<span /> satisfies VNode', '(<span />)!'].map(
      (expression) => ({
        name: `resolves the JSX root through ${expression}`,
        code: `const tree = ${expression}; build<'div'>(tree)`,
        errors: [{ messageId: 'build', data: { tag: 'span', expected: 'span', actual: 'div' } }],
        output: `const tree = ${expression}; build<'span'>(tree)`,
      }),
    ),
    {
      name: 'does not trust an incorrect DOM assertion',
      code: "const tree = <span /> as HTMLDivElement; build<'div'>(tree)",
      errors: [{ messageId: 'assertion' }, { messageId: 'build' }],
      output: "const tree = <span /> as HTMLSpanElement; build<'span'>(tree)",
    },
    ...['let', 'var'].map((kind) => ({
      name: `rejects mutable ${kind} bindings`,
      code: `${kind} tree = <span />; build<'span'>(tree)`,
      errors: [{ messageId: 'unverifiableBuild' }],
      output: null,
    })),
    ...[
      {
        name: 'does not fall back to an outer const when shadowed by a mutable binding',
        code: "const tree = <span />; { let tree; build<'span'>(tree) }",
      },
      {
        name: 'rejects unresolved identifiers',
        code: "build<'span'>(tree)",
      },
      {
        name: 'rejects imported bindings',
        code: "import { tree } from './tree'; build<'span'>(tree)",
      },
      {
        name: 'rejects function parameters, including shadowed const names',
        code: "const tree = <span />; function render(tree) { return build<'span'>(tree) }",
      },
      {
        name: 'rejects cyclic aliases without recursing indefinitely',
        code: "const first = second; const second = first; build<'span'>(first)",
      },
      {
        name: 'does not infer an intrinsic root from a destructuring initializer',
        code: "const { tree } = <span />; build<'span'>(tree)",
      },
      {
        name: 'rejects const bindings with subsequent writes',
        code: "const tree = <span />; tree = <div />; build<'span'>(tree)",
      },
      {
        name: 'rejects const bindings initialized by a function call',
        code: "const tree = getTree(); build<'span'>(tree)",
      },
      {
        name: 'rejects call results',
        code: "build<'span'>(getTree())",
      },
      {
        name: 'rejects component roots',
        code: "build<'span'>(<Component />)",
      },
      {
        name: 'rejects unknown intrinsic roots',
        code: "build<'span'>(<custom-element />)",
      },
      {
        name: 'rejects fragment roots',
        code: "build<'span'>(<><span /></>)",
      },
      {
        name: 'rejects nonliteral tag generics instead of trusting them',
        code: 'build<Tag>(<span />)',
      },
    ].map((test) => ({
      ...test,
      errors: [{ messageId: 'unverifiableBuild' }],
      output: null,
    })),
  ],
})
