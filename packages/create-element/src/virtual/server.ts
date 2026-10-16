import * as reactivity from '../reactivity-ops'
import type { ElementVNode, Child, VNode } from '../types'
import { isElementVNode, isVNode } from '../vnode'

export type { Child } from '../types'

export function renderToString(tree: Child): string {
  return reactivity.REACTIVE_ENABLED
    ? reactivity.untracked(() => renderChildren(tree, {}))
    : renderChildren(tree, {})
}

function resolve(value: unknown): unknown {
  return reactivity.REACTIVE_ENABLED && reactivity.isReactive(value)
    ? resolve(reactivity.peek(value))
    : value
}

const unsafeName = /[\s\\/='"\0<>]/
const namespaceAttribute = /^(xlink|xmlns|xml)([A-Z])/
const htmlLowerCase =
  /^(?:accessK|auto[A-Z]|cell|ch|col|cont|cross|dateT|encT|form[A-Z]|frame|hrefL|inputM|maxL|minL|noV|playsI|popoverT|readO|rowS|src[A-Z]|tabI|useM|item[A-Z])/
const svgCamelCase =
  /^ac|^ali|arabic|basel|cap|clipPath$|clipRule$|color|dominant|enable|fill|flood|font|glyph[^R]|horiz|image|letter|lighting|marker[^WUH]|overline|panose|pointe|paint|rendering|shape|stop|strikethrough|stroke|text[^L]|transform|underline|unicode|units|^v[^i]|^w|^xH/

const voidElements = new Set([
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

const enumeratedAttributes = new Set(['draggable', 'spellcheck'])

const htmlAttributeAliases = new Map<string, string>([
  ['acceptCharset', 'accept-charset'],
  ['defaultChecked', 'checked'],
  ['defaultSelected', 'selected'],
  ['defaultValue', 'value'],
  ['htmlFor', 'for'],
  ['httpEquiv', 'http-equiv'],
])

type Namespace = 'html' | 'math' | 'svg'

interface ElementName {
  name: string
  namespace: Namespace
}

interface RenderContext {
  selectValue?: unknown
}

function renderChildren(children: unknown, context: RenderContext): string {
  const resolvedChildren = reactivity.REACTIVE_ENABLED ? resolve(children) : children
  if (reactivity.REACTIVE_ENABLED && resolvedChildren !== children)
    return renderChildren(resolvedChildren, context)

  if (
    children === null ||
    children === undefined ||
    children === true ||
    children === false ||
    children === ''
  ) {
    return ''
  }

  if (Array.isArray(children)) {
    return children.map((child) => renderChildren(child, context)).join('')
  }

  if (typeof children === 'string') return escapeText(children)
  if (typeof children === 'number') return children.toString()
  if (isDomNode(children)) {
    throw new TypeError('Cannot render a DOM Node to a string')
  }
  if (!isVNode(children)) return ''

  return renderVNode(children, context)
}

function renderVNode(vnode: VNode, context: RenderContext): string {
  if (typeof vnode.type === 'function') {
    const rendered = Reflect.apply(vnode.type, undefined, [vnode.props])
    return renderChildren(rendered, context)
  }

  return isElementVNode(vnode) ? renderElement(vnode, context) : ''
}

function renderElement(vnode: ElementVNode, context: RenderContext): string {
  const element = getElementName(vnode.type)
  if (unsafeName.test(element.name)) throw new Error(`Invalid element name: ${element.name}`)

  let attributes = ''
  let children: unknown = Reflect.get(vnode.props, 'children')
  let rawHTML = ''
  let hasInnerHTML = false
  let selectValue = context.selectValue

  for (const property of Reflect.ownKeys(vnode.props)) {
    if (typeof property === 'symbol') continue

    let name = property
    let value = reactivity.REACTIVE_ENABLED
      ? resolve(Reflect.get(vnode.props, property))
      : Reflect.get(vnode.props, property)

    if (
      name === 'children' ||
      name === 'key' ||
      name === 'ref' ||
      name === '__self' ||
      name === '__source'
    ) {
      continue
    }

    if (name === 'innerHTML') {
      hasInnerHTML = value !== undefined && value !== null
      if (hasInnerHTML) rawHTML = String(value)
      continue
    }

    if (typeof value === 'function' || name.startsWith('on')) continue

    if (name === 'htmlFor' && Reflect.has(vnode.props, 'for')) continue

    if (name === 'data') {
      attributes += serializeData(value)
      continue
    }

    if (name === 'class') {
      value = normalizeClass(value)
    } else if (name === 'style' && typeof value === 'object' && value !== null) {
      value = serializeStyle(value)
    }

    if (name === 'defaultValue' || name === 'value') {
      if (element.namespace === 'html' && element.name === 'textarea') {
        children = value
        continue
      }

      if (element.namespace === 'html' && element.name === 'select') {
        selectValue = value
        continue
      }
    }

    name = normalizeAttributeName(name, element.namespace)
    attributes += serializeAttribute(name, value)
  }

  if (
    element.namespace === 'html' &&
    element.name === 'option' &&
    !Reflect.has(vnode.props, 'selected') &&
    !Reflect.has(vnode.props, 'defaultSelected') &&
    optionMatchesSelectValue(
      reactivity.REACTIVE_ENABLED
        ? resolve(Reflect.get(vnode.props, 'value'))
        : Reflect.get(vnode.props, 'value'),
      context.selectValue,
    )
  ) {
    attributes += ' selected'
  }

  if (element.namespace === 'html' && voidElements.has(element.name)) {
    return `<${element.name}${attributes}/>`
  }

  const content = hasInnerHTML
    ? rawHTML
    : renderChildren(children, {
        selectValue,
      })

  return `<${element.name}${attributes}>${content}</${element.name}>`
}

function getElementName(type: ElementVNode['type']): ElementName {
  if (type === 'svg') return { name: type, namespace: 'svg' }
  if (type.startsWith('svg:')) return { name: type.slice(4), namespace: 'svg' }
  if (type === 'math') return { name: type, namespace: 'math' }
  if (type.startsWith('math:')) return { name: type.slice(5), namespace: 'math' }
  return { name: type, namespace: 'html' }
}

function normalizeAttributeName(name: string, namespace: Namespace): string {
  if (name.startsWith('aria') && name.length > 4 && isUpperCase(name[4])) {
    return `aria-${camelCaseToKebabCase(name.slice(4))}`
  }

  if (namespaceAttribute.test(name)) {
    return name.replace(namespaceAttribute, '$1:$2').toLowerCase()
  }

  if (namespace === 'svg' && svgCamelCase.test(name)) {
    return name === 'panose1' ? 'panose-1' : camelCaseToKebabCase(name)
  }

  if (namespace === 'svg' || namespace === 'math') return name

  const attributeName = htmlAttributeAliases.get(name) ?? name
  return htmlLowerCase.test(attributeName) ? attributeName.toLowerCase() : attributeName
}

function serializeAttribute(name: string, value: unknown): string {
  if (unsafeName.test(name) || value === null || value === undefined) return ''

  if (typeof value === 'boolean') {
    if (name.startsWith('aria-') || enumeratedAttributes.has(name)) {
      return ` ${name}="${value.toString()}"`
    }

    return value ? ` ${name}` : ''
  }

  if (typeof value === 'string') {
    return value === '' ? ` ${name}` : ` ${name}="${escapeAttribute(value)}"`
  }

  if (typeof value === 'number' || typeof value === 'bigint') {
    return ` ${name}="${value.toString()}"`
  }

  return ''
}

function serializeData(value: unknown): string {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return ''

  let attributes = ''
  for (const [key, dataValue] of Object.entries(value)) {
    const resolved = reactivity.REACTIVE_ENABLED ? resolve(dataValue) : dataValue
    if (resolved === true || typeof resolved === 'string') {
      attributes += serializeAttribute(`data-${camelCaseToKebabCase(key)}`, resolved)
    }
  }
  return attributes
}

function normalizeClass(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value.filter((className) => typeof className === 'string' && className).join(' ')
  }
  if (typeof value !== 'object' || value === null) return undefined

  return Object.entries(value)
    .filter(([, enabled]) => (reactivity.REACTIVE_ENABLED ? resolve(enabled) : enabled) === true)
    .map(([className]) => className)
    .join(' ')
}

function serializeStyle(value: object): string {
  let style = ''

  for (const property of Reflect.ownKeys(value)) {
    if (typeof property === 'symbol') continue
    const propertyValue = reactivity.REACTIVE_ENABLED
      ? resolve(Reflect.get(value, property))
      : Reflect.get(value, property)
    if (
      propertyValue === null ||
      propertyValue === undefined ||
      propertyValue === '' ||
      (typeof propertyValue !== 'string' && typeof propertyValue !== 'number')
    ) {
      continue
    }

    const name = property.startsWith('--') ? property : cssPropertyToKebabCase(property)
    style += `${name}:${propertyValue.toString()};`
  }

  return style
}

function optionMatchesSelectValue(optionValue: unknown, selectValue: unknown): boolean {
  if (Array.isArray(selectValue)) {
    return selectValue.some(
      (value) => (reactivity.REACTIVE_ENABLED ? resolve(value) : value) === optionValue,
    )
  }
  return optionValue !== undefined && optionValue === selectValue
}

function isDomNode(value: unknown): boolean {
  if (typeof Node !== 'undefined' && value instanceof Node) return true
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof Reflect.get(value, 'nodeType') === 'number' &&
    typeof Reflect.get(value, 'cloneNode') === 'function'
  )
}

function camelCaseToKebabCase(value: string): string {
  return value
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
}

function cssPropertyToKebabCase(value: string): string {
  const kebabCase = camelCaseToKebabCase(value)
  return kebabCase.startsWith('ms-') ? `-${kebabCase}` : kebabCase
}

function isUpperCase(value: string): boolean {
  return value >= 'A' && value <= 'Z'
}

function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeAttribute(value: string): string {
  return escapeText(value).replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
