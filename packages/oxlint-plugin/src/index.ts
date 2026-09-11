import { elementTagNameMap } from '@lilian1315/elements-writable-properties-types/element-tag-name-map'
import type { Context, ESTree, Plugin, Rule } from '@oxlint/plugins'

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
    messages: { incorrect: '`<{{tag}}>` returns `<{{expected}}>`, not `<{{actual}}>`.' },
  },
  create(context: Context) {
    function getIntrinsicTag(jsx: ESTree.Node): string | undefined {
      if (jsx.type !== 'JSXElement') return
      return getJsxTagName(jsx.openingElement.name)
    }

    function report(
      node: ESTree.Node,
      tag: string,
      expected: string,
      actual: string,
      replacement: string,
    ): void {
      context.report({
        node,
        messageId: 'incorrect',
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

      report(annotation, tag, expected, actual, expected)
    }

    function verifyAsDom(jsx: ESTree.Node, annotation: ESTree.TSType): void {
      const tag = getIntrinsicTag(jsx)
      if (!tag || !elementTagNameMap[tag] || annotation.type !== 'TSLiteralType') return
      if (annotation.literal.type !== 'Literal' || typeof annotation.literal.value !== 'string')
        return

      const actual = annotation.literal.value
      if (actual === tag) return

      report(annotation, tag, tag, actual, `'${tag}'`)
    }

    return {
      TSAsExpression(node) {
        verifyAssertion(node.expression, node.typeAnnotation)
      },
      CallExpression(node) {
        if (node.callee.type !== 'Identifier' || node.callee.name !== 'asDom') return
        const typeArguments = node.typeArguments
        if (typeArguments?.params.length !== 1 || node.arguments.length !== 1) return
        verifyAsDom(node.arguments[0], typeArguments.params[0])
      },
    }
  },
}

const plugin: Plugin = {
  meta: { name: 'create-element' },
  rules: { 'valid-jsx-element-type-assertion': validJsxElementTypeAssertion },
}

export default plugin
