import type {
  Context,
  Diagnostic,
  ESTree,
  Fixer,
  Ranged,
  Reference,
  Scope,
  Span,
  Variable,
  Visitor,
} from '@oxlint/plugins'
import { describe, expect, it } from 'vite-plus/test'

import plugin from '../src/index'

function getCreate(): (context: Context) => Visitor {
  const rule = plugin.rules['valid-jsx-type-assertion']
  if (!rule || !('create' in rule) || 'createOnce' in rule || typeof rule.create !== 'function')
    throw new Error('rule valid-jsx-type-assertion must expose a create method')
  return rule.create
}

const create = getCreate()

function span(): Span {
  const position = { line: 1, column: 0 }
  return { range: [0, 0], start: 0, end: 0, loc: { start: position, end: position } }
}

const program: ESTree.Program = {
  type: 'Program',
  body: [],
  sourceType: 'module',
  comments: [],
  tokens: [],
  ...span(),
  parent: null,
}

function jsxIdentifier(name: string): ESTree.JSXIdentifier {
  return { type: 'JSXIdentifier', name, ...span(), parent: program }
}

function jsxElementName(tag: string): ESTree.JSXElementName {
  if (!tag.includes(':')) return jsxIdentifier(tag)
  const [namespace, name] = tag.split(':')
  const namespaced: ESTree.JSXNamespacedName = {
    type: 'JSXNamespacedName',
    namespace: jsxIdentifier(namespace),
    name: jsxIdentifier(name),
    ...span(),
    parent: program,
  }
  namespaced.namespace.parent = namespaced
  namespaced.name.parent = namespaced
  return namespaced
}

function jsxElement(tag: string): ESTree.JSXElement {
  const name = jsxElementName(tag)
  const opening: ESTree.JSXOpeningElement = {
    type: 'JSXOpeningElement',
    name,
    attributes: [],
    selfClosing: true,
    ...span(),
    parent: program,
  }
  name.parent = opening
  const element: ESTree.JSXElement = {
    type: 'JSXElement',
    openingElement: opening,
    children: [],
    closingElement: null,
    ...span(),
    parent: program,
  }
  opening.parent = element
  return element
}

function typeReference(name: string): ESTree.TSTypeReference {
  const reference: ESTree.TSTypeReference = {
    type: 'TSTypeReference',
    typeName: { type: 'Identifier', name, ...span(), parent: program },
    typeArguments: null,
    ...span(),
    parent: program,
  }
  reference.typeName.parent = reference
  return reference
}

function jsxAssertion(tag: string, assertedType: string): ESTree.TSAsExpression {
  const expression = jsxElement(tag)
  const typeAnnotation = typeReference(assertedType)
  const assertion: ESTree.TSAsExpression = {
    type: 'TSAsExpression',
    expression,
    typeAnnotation,
    ...span(),
    parent: program,
  }
  expression.parent = assertion
  typeAnnotation.parent = assertion
  return assertion
}

function buildCall(tag: string, assertedType: string): ESTree.CallExpression {
  return buildExpression(jsxElement(tag), assertedType)
}

function identifier(name: string): ESTree.IdentifierReference {
  return { type: 'Identifier', name, ...span(), parent: program }
}

function buildExpression(element: ESTree.Expression, assertedType: string): ESTree.CallExpression {
  const callee: ESTree.IdentifierReference = {
    type: 'Identifier',
    name: 'build',
    ...span(),
    parent: program,
  }
  const typeArgument: ESTree.TSLiteralType = {
    type: 'TSLiteralType',
    literal: { type: 'Literal', value: assertedType, raw: null, ...span(), parent: program },
    ...span(),
    parent: program,
  }
  typeArgument.literal.parent = typeArgument
  const typeArguments: ESTree.TSTypeParameterInstantiation = {
    type: 'TSTypeParameterInstantiation',
    params: [typeArgument],
    ...span(),
    parent: program,
  }
  typeArgument.parent = typeArguments
  const call: ESTree.CallExpression = {
    type: 'CallExpression',
    callee,
    typeArguments,
    arguments: [element],
    optional: false,
    ...span(),
    parent: program,
  }
  callee.parent = call
  typeArguments.parent = call
  element.parent = call
  return call
}

function makeScope(upper: Scope | null = null): Scope {
  return { set: new Map<string, Variable>(), upper } as Scope
}

function defineVariable(
  scope: Scope,
  name: string,
  init: ESTree.Expression | null,
  kind: ESTree.VariableDeclaration['kind'] = 'const',
): Variable {
  const id: ESTree.BindingIdentifier = { type: 'Identifier', name, ...span(), parent: program }
  const declaration: ESTree.VariableDeclaration = {
    type: 'VariableDeclaration',
    kind,
    declarations: [],
    ...span(),
    parent: program,
  }
  const node: ESTree.VariableDeclarator = {
    type: 'VariableDeclarator',
    id,
    init,
    ...span(),
    parent: declaration,
  }
  id.parent = node
  if (init) init.parent = node
  declaration.declarations.push(node)
  const variable: Variable = {
    name,
    scope,
    identifiers: [id],
    references: [],
    defs: [{ type: 'Variable', name: id, node, parent: declaration }],
  }
  scope.set.set(name, variable)
  return variable
}

function createContext(
  report: (report: Diagnostic) => void,
  getScope: (node: ESTree.Node) => Scope,
): Context {
  // Only mock the context members used by this rule.
  return { report, sourceCode: { getScope } } as Context
}

function runVisitor(
  visit: (visitor: Visitor) => void,
  getScope: (node: ESTree.Node) => Scope = () => makeScope(),
): Diagnostic[] {
  const reports: Diagnostic[] = []
  const visitor = create(createContext((report) => reports.push(report), getScope))
  visit(visitor)
  return reports
}

function verify(tag: string, assertedType: string): Diagnostic[] {
  return runVisitor((visitor) => visitor.TSAsExpression?.(jsxAssertion(tag, assertedType)))
}

function verifyBuild(tag: string, assertedType: string): Diagnostic[] {
  return runVisitor((visitor) => visitor.CallExpression?.(buildCall(tag, assertedType)))
}

describe('valid-jsx-type-assertion', () => {
  it('accepts matching HTML, SVG, and MathML assertions', () => {
    expect(verify('div', 'HTMLDivElement')).toHaveLength(0)
    expect(verify('svg', 'SVGSVGElement')).toHaveLength(0)
    expect(verify('svg:path', 'SVGPathElement')).toHaveLength(0)
    expect(verify('math:mi', 'MathMLElement')).toHaveLength(0)
  })

  it('reports a mismatch and supplies the correct fix', () => {
    const [report] = verify('div', 'HTMLSpanElement')
    expect(report?.data).toEqual({
      tag: 'div',
      expected: 'HTMLDivElement',
      actual: 'HTMLSpanElement',
    })

    const fixer = {
      replaceText: (node: Ranged, text: string) => ({ range: node.range, text }),
    } as Fixer
    expect(report?.fix?.(fixer)).toMatchObject({ text: 'HTMLDivElement' })
  })

  it('checks the explicit type argument passed to build', () => {
    expect(verifyBuild('button', 'button')).toHaveLength(0)
    expect(verifyBuild('button', 'div')[0]?.data?.expected).toBe('button')
  })

  it('ignores tags which are not part of the runtime intrinsic element map', () => {
    expect(verify('custom-element', 'CustomElement')).toHaveLength(0)
  })

  it.each(['span', 'svg:path', 'math:mi'])('resolves const JSX roots for %s', (tag) => {
    const scope = makeScope()
    defineVariable(scope, 'tree', jsxElement(tag))
    const reports = runVisitor(
      (visitor) => visitor.CallExpression?.(buildExpression(identifier('tree'), tag)),
      () => scope,
    )
    expect(reports).toHaveLength(0)
  })

  it('follows const aliases and fixes mismatching tags', () => {
    const scope = makeScope()
    defineVariable(scope, 'tree', jsxElement('span'))
    defineVariable(scope, 'alias', identifier('tree'))
    const [report] = runVisitor(
      (visitor) => visitor.CallExpression?.(buildExpression(identifier('alias'), 'div')),
      () => scope,
    )
    expect(report?.messageId).toBe('build')
    expect(report?.data?.expected).toBe('span')
    const fixer = {
      replaceText: (node: Ranged, text: string) => ({ range: node.range, text }),
    } as Fixer
    expect(report?.fix?.(fixer)).toMatchObject({ text: "'span'" })
  })

  it('uses the nearest binding, including bindings which cannot be verified', () => {
    const outer = makeScope()
    const inner = makeScope(outer)
    defineVariable(outer, 'tree', jsxElement('span'))
    defineVariable(inner, 'tree', jsxElement('div'))
    const check = () =>
      runVisitor(
        (visitor) => visitor.CallExpression?.(buildExpression(identifier('tree'), 'span')),
        () => inner,
      )
    expect(check()[0]?.data?.expected).toBe('div')
    defineVariable(inner, 'tree', null, 'let')
    expect(check()[0]?.messageId).toBe('unverifiableBuild')
  })

  it('resolves alias initializers in their own lexical scope', () => {
    const outer = makeScope()
    const inner = makeScope(outer)
    defineVariable(outer, 'tree', jsxElement('span'))
    const initializer = identifier('tree')
    defineVariable(outer, 'alias', initializer)
    defineVariable(inner, 'tree', jsxElement('div'))
    const reports = runVisitor(
      (visitor) => visitor.CallExpression?.(buildExpression(identifier('alias'), 'span')),
      (node) => (node === initializer ? outer : inner),
    )
    expect(reports).toHaveLength(0)
  })

  it.each(['let', 'var'] as const)('rejects mutable %s bindings without autofixing', (kind) => {
    const scope = makeScope()
    defineVariable(scope, 'tree', jsxElement('span'), kind)
    const [report] = runVisitor(
      (visitor) => visitor.CallExpression?.(buildExpression(identifier('tree'), 'span')),
      () => scope,
    )
    expect(report?.messageId).toBe('unverifiableBuild')
    expect(report?.fix).toBeUndefined()
  })

  it('rejects unresolved identifiers, imported bindings, and function parameters', () => {
    const scope = makeScope()
    for (const type of ['ImportBinding', 'Parameter'] as const) {
      const variable = defineVariable(scope, type, jsxElement('span'))
      variable.defs[0]!.type = type
    }
    for (const name of ['unknown', 'ImportBinding', 'Parameter']) {
      const reports = runVisitor(
        (visitor) => visitor.CallExpression?.(buildExpression(identifier(name), 'span')),
        () => scope,
      )
      expect(reports[0]?.messageId).toBe('unverifiableBuild')
    }
  })

  it('rejects cyclic aliases without recursing indefinitely', () => {
    const scope = makeScope()
    defineVariable(scope, 'first', identifier('second'))
    defineVariable(scope, 'second', identifier('first'))
    const reports = runVisitor(
      (visitor) => visitor.CallExpression?.(buildExpression(identifier('first'), 'span')),
      () => scope,
    )
    expect(reports[0]?.messageId).toBe('unverifiableBuild')
  })

  it.each([
    'ParenthesizedExpression',
    'TSAsExpression',
    'TSSatisfiesExpression',
    'TSNonNullExpression',
  ] as const)('looks through %s without trusting asserted types', (type) => {
    const scope = makeScope()
    const expression = jsxElement('span')
    const wrapped = {
      type,
      expression,
      typeAnnotation: typeReference('VNode'),
      ...span(),
      parent: program,
    } as ESTree.Expression
    expression.parent = wrapped
    defineVariable(scope, 'tree', wrapped)
    const reports = runVisitor(
      (visitor) => visitor.CallExpression?.(buildExpression(identifier('tree'), 'div')),
      () => scope,
    )
    expect(reports[0]?.data?.expected).toBe('span')
  })

  it('does not infer an intrinsic root from a destructuring initializer', () => {
    const scope = makeScope()
    const variable = defineVariable(scope, 'tree', jsxElement('span'))
    const node = variable.defs[0]!.node as ESTree.VariableDeclarator
    node.id = { type: 'ObjectPattern', properties: [], ...span(), parent: node }
    const reports = runVisitor(
      (visitor) => visitor.CallExpression?.(buildExpression(identifier('tree'), 'span')),
      () => scope,
    )
    expect(reports[0]?.messageId).toBe('unverifiableBuild')
  })

  it('rejects const bindings with subsequent writes', () => {
    const scope = makeScope()
    const variable = defineVariable(scope, 'tree', jsxElement('span'))
    variable.references.push({ init: false, isWrite: () => true } as Reference)
    const reports = runVisitor(
      (visitor) => visitor.CallExpression?.(buildExpression(identifier('tree'), 'span')),
      () => scope,
    )
    expect(reports[0]?.messageId).toBe('unverifiableBuild')
  })

  it('rejects const bindings initialized by a function call', () => {
    const scope = makeScope()
    defineVariable(scope, 'tree', buildCall('span', 'span'))
    const reports = runVisitor(
      (visitor) => visitor.CallExpression?.(buildExpression(identifier('tree'), 'span')),
      () => scope,
    )
    expect(reports[0]?.messageId).toBe('unverifiableBuild')
  })

  it('rejects call results, components, and unknown intrinsic roots', () => {
    for (const expression of [
      buildCall('span', 'span'),
      jsxElement('Component'),
      jsxElement('custom-element'),
    ]) {
      const reports = runVisitor((visitor) =>
        visitor.CallExpression?.(buildExpression(expression, 'span')),
      )
      expect(reports[0]?.messageId).toBe('unverifiableBuild')
    }
  })

  it('does not restrict build calls without an explicit tag', () => {
    const call = buildExpression(identifier('tree'), 'span')
    call.typeArguments = null
    expect(runVisitor((visitor) => visitor.CallExpression?.(call))).toHaveLength(0)
  })

  it('rejects nonliteral tag generics instead of trusting them', () => {
    const call = buildCall('span', 'span')
    call.typeArguments!.params = [typeReference('Tag')]
    const reports = runVisitor((visitor) => visitor.CallExpression?.(call))
    expect(reports[0]?.messageId).toBe('unverifiableBuild')
  })
})
