import assert from 'node:assert/strict'
import test from 'node:test'

import plugin from '../dist/index.mjs'

const rule = plugin.rules['valid-jsx-element-type-assertion']

function jsxAssertion(tag, assertedType) {
  const [namespace, name] = tag.includes(':') ? tag.split(':') : [undefined, tag]
  return {
    expression: {
      type: 'JSXElement',
      openingElement: {
        name: namespace
          ? {
              type: 'JSXNamespacedName',
              namespace: { type: 'JSXIdentifier', name: namespace },
              name: { type: 'JSXIdentifier', name },
            }
          : { type: 'JSXIdentifier', name },
      },
    },
    typeAnnotation: {
      type: 'TSTypeReference',
      typeName: { type: 'Identifier', name: assertedType },
    },
  }
}

function verify(tag, assertedType) {
  const reports = []
  const visitor = rule.create({ report: (report) => reports.push(report) })
  visitor.TSAsExpression(jsxAssertion(tag, assertedType))
  return reports
}

function verifyAsDom(tag, assertedType) {
  const reports = []
  const visitor = rule.create({ report: (report) => reports.push(report) })
  const assertion = jsxAssertion(tag, assertedType)
  visitor.CallExpression({
    callee: { type: 'Identifier', name: 'asDom' },
    arguments: [assertion.expression],
    typeArguments: {
      params: [
        {
          type: 'TSLiteralType',
          literal: { type: 'Literal', value: assertedType },
        },
      ],
    },
  })
  return reports
}

void test('accepts matching HTML, SVG, and MathML assertions', () => {
  assert.equal(verify('div', 'HTMLDivElement').length, 0)
  assert.equal(verify('svg', 'SVGSVGElement').length, 0)
  assert.equal(verify('svg:path', 'SVGPathElement').length, 0)
  assert.equal(verify('math:mi', 'MathMLElement').length, 0)
})

void test('reports a mismatch and supplies the correct fix', () => {
  const [report] = verify('div', 'HTMLSpanElement')
  assert.equal(report.messageId, 'incorrect')
  assert.deepEqual(report.data, {
    tag: 'div',
    expected: 'HTMLDivElement',
    actual: 'HTMLSpanElement',
  })

  const fixer = { replaceText: (node, text) => ({ node, text }) }
  assert.equal(report.fix(fixer).text, 'HTMLDivElement')
})

void test('checks the explicit type argument passed to asDom', () => {
  assert.equal(verifyAsDom('button', 'button').length, 0)
  assert.equal(verifyAsDom('button', 'div')[0].data.expected, 'button')
})

void test('ignores tags which are not part of the runtime intrinsic element map', () => {
  assert.equal(verify('custom-element', 'CustomElement').length, 0)
})
