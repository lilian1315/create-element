import type { Context, Diagnostic, ESTree, Fixer, Ranged, Span, Visitor } from '@oxlint/plugins'
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

function asDomCall(tag: string, assertedType: string): ESTree.CallExpression {
  const element = jsxElement(tag)
  const callee: ESTree.IdentifierReference = {
    type: 'Identifier',
    name: 'asDom',
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

function createContext(report: (report: Diagnostic) => void): Context {
  // The rule only uses `report`; FileContext carries ~50 unrelated members
  // (sourceCode, scopeManager, …) that are not worth faking.
  return { report } as Context
}

function runVisitor(visit: (visitor: Visitor) => void): Diagnostic[] {
  const reports: Diagnostic[] = []
  const visitor = create(createContext((report) => reports.push(report)))
  visit(visitor)
  return reports
}

function verify(tag: string, assertedType: string): Diagnostic[] {
  return runVisitor((visitor) => visitor.TSAsExpression?.(jsxAssertion(tag, assertedType)))
}

function verifyAsDom(tag: string, assertedType: string): Diagnostic[] {
  return runVisitor((visitor) => visitor.CallExpression?.(asDomCall(tag, assertedType)))
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

  it('checks the explicit type argument passed to asDom', () => {
    expect(verifyAsDom('button', 'button')).toHaveLength(0)
    expect(verifyAsDom('button', 'div')[0]?.data?.expected).toBe('button')
  })

  it('ignores tags which are not part of the runtime intrinsic element map', () => {
    expect(verify('custom-element', 'CustomElement')).toHaveLength(0)
  })
})
