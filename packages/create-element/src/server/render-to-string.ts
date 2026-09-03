import type { ElementVNode, VNode, VNodeChildren } from '../virtual/types'
import { isElementVNode, isVNode } from '../virtual/vnode'

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
  ['className', 'class'],
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
  resolveValue: (value: unknown) => unknown
  selectValue?: unknown
}

/** Renders a virtual tree to static HTML without requiring a DOM implementation. */
export function renderToString(children: VNodeChildren): string {
  return renderToStringWithResolver(children, identity)
}

/** @internal Renders a tree while resolving adapter-specific reactive values. */
export function renderToStringWithResolver(
  children: unknown,
  resolveValue: (value: unknown) => unknown,
): string {
  return renderChildren(children, { resolveValue })
}

function renderChildren(children: unknown, context: RenderContext): string {
  const resolvedChildren = context.resolveValue(children)
  if (resolvedChildren !== children) return renderChildren(resolvedChildren, context)

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
    let value = context.resolveValue(Reflect.get(vnode.props, property))

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

    if (name === 'className' && Reflect.has(vnode.props, 'class')) continue
    if (name === 'htmlFor' && Reflect.has(vnode.props, 'for')) continue

    if (name === 'data') {
      attributes += serializeData(value, context)
      continue
    }

    if (name === 'class') {
      value = normalizeClass(value, context)
    } else if (name === 'style' && typeof value === 'object' && value !== null) {
      value = serializeStyle(value, context)
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
      context.resolveValue(Reflect.get(vnode.props, 'value')),
      context.selectValue,
      context,
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
        resolveValue: context.resolveValue,
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

  if (namespace === 'svg') return name === 'className' ? 'class' : name
  if (namespace === 'math') return name === 'className' ? 'class' : name

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

function serializeData(value: unknown, context: RenderContext): string {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return ''

  let attributes = ''
  for (const [key, dataValue] of Object.entries(value)) {
    attributes += serializeAttribute(
      `data-${camelCaseToKebabCase(key)}`,
      context.resolveValue(dataValue),
    )
  }
  return attributes
}

function normalizeClass(value: unknown, context: RenderContext): string | undefined {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value.filter((className) => typeof className === 'string' && className).join(' ')
  }
  if (typeof value !== 'object' || value === null) return undefined

  return Object.entries(value)
    .filter(([, enabled]) => context.resolveValue(enabled) === true)
    .map(([className]) => className)
    .join(' ')
}

function serializeStyle(value: object, context: RenderContext): string {
  let style = ''

  for (const property of Reflect.ownKeys(value)) {
    if (typeof property === 'symbol') continue
    const propertyValue = context.resolveValue(Reflect.get(value, property))
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

function optionMatchesSelectValue(
  optionValue: unknown,
  selectValue: unknown,
  context: RenderContext,
): boolean {
  if (Array.isArray(selectValue)) {
    return selectValue.some((value) => context.resolveValue(value) === optionValue)
  }
  return optionValue !== undefined && optionValue === selectValue
}

function identity(value: unknown): unknown {
  return value
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
