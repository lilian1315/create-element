import { elementTagNameMap } from '@lilian1315/elements-writable-properties-types/tag-name-map'
import type { Context, ESTree, Plugin, Rule, Scope, Variable } from '@oxlint/plugins'

function getJsxTagName(name: ESTree.JSXElementName): string | undefined {
  if (name.type === 'JSXIdentifier') return name.name
  if (name.type === 'JSXNamespacedName') return `${name.namespace.name}:${name.name.name}`
  return undefined
}

const validJsxElementTypeAssertion: Rule = {
  meta: {
    type: 'problem',
    docs: { description: 'Require JSX DOM element assertions to match their intrinsic tag' },
    fixable: 'code',
    schema: [],
    messages: {
      build: 'This JSX.Element is a `<{{expected}}>`, not a `<{{actual}}>`.',
      unverifiableBuild:
        'Cannot verify this explicit build tag. Use intrinsic JSX or a const initialized from intrinsic JSX, and a literal tag generic; otherwise omit the generic.',
      assertion: 'This JSX.Element is a `{{expected}}`, not a `{{actual}}`.',
    },
  },
  create(context: Context) {
    function getIntrinsicTag(jsx: ESTree.Node): string | undefined {
      if (jsx.type !== 'JSXElement') return
      return getJsxTagName(jsx.openingElement.name)
    }

    function resolveIntrinsicTag(
      node: ESTree.Node,
      seen = new Set<Variable>(),
    ): string | undefined {
      if (
        node.type === 'ParenthesizedExpression' ||
        node.type === 'TSAsExpression' ||
        node.type === 'TSSatisfiesExpression' ||
        node.type === 'TSNonNullExpression'
      ) {
        return resolveIntrinsicTag(node.expression, seen)
      }
      if (node.type !== 'Identifier') return getIntrinsicTag(node)

      let scope: Scope | null = context.sourceCode.getScope(node)
      while (scope) {
        const variable = scope.set.get(node.name)
        if (!variable) {
          scope = scope.upper
          continue
        }
        if (seen.has(variable) || variable.defs.length !== 1) return
        seen.add(variable)
        const definition = variable.defs[0]
        if (
          definition.type !== 'Variable' ||
          definition.parent?.type !== 'VariableDeclaration' ||
          definition.parent.kind !== 'const' ||
          definition.node.type !== 'VariableDeclarator' ||
          definition.node.id.type !== 'Identifier' ||
          !definition.node.init ||
          variable.references.some((reference) => reference.isWrite() && !reference.init)
        )
          return
        return resolveIntrinsicTag(definition.node.init, seen)
      }
    }

    function report(
      node: ESTree.Node,
      tag: string,
      expected: string,
      actual: string,
      replacement: string,
      messageId: string,
    ): void {
      context.report({
        node,
        messageId,
        data: { tag, expected, actual },
        fix: (fixer) => fixer.replaceText(node, replacement),
      })
    }

    function verifyAssertion(jsx: ESTree.Node, annotation: ESTree.TSType): void {
      const tag = getIntrinsicTag(jsx)
      if (!tag || annotation.type !== 'TSTypeReference') return
      if (annotation.typeName.type !== 'Identifier') return

      const expected = elementTagNameMap[tag]
      const actual = annotation.typeName.name
      if (!expected || actual === expected) return

      report(annotation, tag, expected, actual, expected, 'assertion')
    }

    function verifyBuild(jsx: ESTree.Node, annotation: ESTree.TSType): void {
      const tag = resolveIntrinsicTag(jsx)
      if (
        !tag ||
        !elementTagNameMap[tag] ||
        annotation.type !== 'TSLiteralType' ||
        annotation.literal.type !== 'Literal' ||
        typeof annotation.literal.value !== 'string'
      ) {
        context.report({ node: annotation, messageId: 'unverifiableBuild' })
        return
      }

      const actual = annotation.literal.value
      if (actual === tag) return

      report(annotation, tag, tag, actual, `'${tag}'`, 'build')
    }

    return {
      TSAsExpression(node) {
        verifyAssertion(node.expression, node.typeAnnotation)
      },
      CallExpression(node) {
        if (node.callee.type !== 'Identifier' || node.callee.name !== 'build') return
        const typeArguments = node.typeArguments
        if (typeArguments?.params.length !== 1 || node.arguments.length !== 1) return
        verifyBuild(node.arguments[0], typeArguments.params[0])
      },
    }
  },
}

const plugin: Plugin = {
  meta: { name: 'create-element' },
  rules: { 'valid-jsx-type-assertion': validJsxElementTypeAssertion },
}

export default plugin
