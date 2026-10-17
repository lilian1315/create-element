import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

import ts from '@typescript/typescript6'
import { SingleBar } from 'cli-progress'

import { getExcludedInterfaceMembers } from './utils/get_excluded_interface_members.ts'

const progressBar = new SingleBar({
  format: '[{bar}] {percentage}% | {value}/{total}{info}',
})
const sourceText = readFileSync('./node_modules/@types/web/index.d.ts', 'utf8')
const sourceFile = ts.createSourceFile(
  'index.d.ts',
  sourceText,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
)
const interfaces = sourceFile.statements.filter(ts.isInterfaceDeclaration)
const interfacesByName = new Map<string, ts.InterfaceDeclaration>()
for (const iface of interfaces) {
  if (!interfacesByName.has(iface.name.text)) interfacesByName.set(iface.name.text, iface)
}

function getTagNameMap(interfaceName: string): Record<string, string> {
  const iface = interfacesByName.get(interfaceName)
  if (!iface) throw new Error(`${interfaceName} was not found in @types/web`)

  return Object.fromEntries(
    iface.members.flatMap((member) => {
      if (!ts.isPropertySignature(member) || !ts.isStringLiteral(member.name) || !member.type) {
        return []
      }
      return [[member.name.text, member.type.getText(sourceFile)]]
    }),
  )
}
const primaryInterfaceNames = new Set<string>()
const selectedInterfaceNames = new Set<string>()
const recursiveExtendsCache = new Map<string, Set<string>>()
const rootInterfaceNames = new Set([
  'HTMLElement',
  'SVGElement',
  'MathMLElement',
  'HTMLElementTagNameMap',
  'HTMLElementDeprecatedTagNameMap',
  'SVGElementTagNameMap',
  'MathMLElementTagNameMap',
])

function getRecursiveExtends(name: string, stack = new Set<string>()): Set<string> {
  const cached = recursiveExtendsCache.get(name)
  if (cached) return cached
  if (stack.has(name)) return new Set()

  const result = new Set<string>()
  const nextStack = new Set(stack).add(name)
  const iface = interfacesByName.get(name)

  for (const clause of iface?.heritageClauses ?? []) {
    if (clause.token !== ts.SyntaxKind.ExtendsKeyword) continue
    for (const type of clause.types) {
      const parentName = type.expression.getText(sourceFile)
      result.add(parentName)
      getRecursiveExtends(parentName, nextStack).forEach((ancestor) => result.add(ancestor))
    }
  }

  recursiveExtendsCache.set(name, result)
  return result
}

console.log('Filtering interfaces...')
progressBar.start(interfaces.length, 0, { info: '' })

for (const iface of interfaces) {
  progressBar.increment(1, { info: ` | Checking ${iface.name.text}` })
  const inheritedNames = getRecursiveExtends(iface.name.text)

  if (
    !rootInterfaceNames.has(iface.name.text) &&
    !inheritedNames.has('HTMLElement') &&
    !inheritedNames.has('SVGElement') &&
    !inheritedNames.has('MathMLElement')
  ) {
    continue
  }

  primaryInterfaceNames.add(iface.name.text)
  selectedInterfaceNames.add(iface.name.text)
  inheritedNames.forEach((name) => {
    if (interfacesByName.has(name)) selectedInterfaceNames.add(name)
    else console.warn(`${name} (not resolved)`)
  })
}
progressBar.stop()

const selectedInterfaces = [...selectedInterfaceNames].map((name) => interfacesByName.get(name)!)
const totalMembers = selectedInterfaces.reduce((total, iface) => total + iface.members.length, 0)

console.log('Removing unwanted interface members and transforming getters/setters to properties...')
progressBar.start(totalMembers, 0, { info: '' })

const generatedInterfaces = selectedInterfaces.map((iface) => {
  const excludedMembers = getExcludedInterfaceMembers(iface.name.text)
  const setterProperties: ts.PropertySignature[] = []
  const members: ts.TypeElement[] = []

  for (const member of iface.members) {
    const name = member.name && ts.isIdentifier(member.name) ? member.name.text : undefined
    progressBar.increment(1, {
      info: ` | Processing ${iface.name.text}${name ? `.${name}` : ''}`,
    })

    if (
      (name && excludedMembers.includes(name)) ||
      ts.isMethodSignature(member) ||
      ts.isGetAccessorDeclaration(member) ||
      ts.isIndexSignatureDeclaration(member)
    ) {
      continue
    }

    if (ts.isPropertySignature(member)) {
      const svgBaseValType = getSVGAnimatedBaseValType(member)

      if (svgBaseValType) {
        const svgAnimatedMember = ts.factory.createPropertySignature(
          undefined,
          member.name,
          undefined,
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword),
        )

        ts.addSyntheticLeadingComment(
          svgAnimatedMember,
          ts.SyntaxKind.MultiLineCommentTrivia,
          '* Not supported yet. You must use a ref to set this property manually. ',
          true,
        )

        members.push(svgAnimatedMember)
      } else if (!member.modifiers?.some((m) => m.kind === ts.SyntaxKind.ReadonlyKeyword)) {
        members.push(member)
      }
    } else if (ts.isSetAccessorDeclaration(member)) {
      const parameter = member.parameters[0]
      setterProperties.push(
        ts.factory.createPropertySignature(undefined, member.name, undefined, parameter.type),
      )
    } else {
      members.push(member)
    }
  }

  const modifiers = primaryInterfaceNames.has(iface.name.text)
    ? [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)]
    : undefined

  return ts.factory.updateInterfaceDeclaration(
    iface,
    modifiers,
    iface.name,
    iface.typeParameters,
    iface.heritageClauses,
    [...setterProperties, ...members],
  )
})
progressBar.stop()

function getSVGAnimatedBaseValType(member: ts.PropertySignature): ts.TypeNode | undefined {
  const type = member.type
  if (
    !type ||
    !ts.isTypeNode(type) ||
    !ts.isTypeReferenceNode(type) ||
    !ts.isIdentifier(type.typeName)
  ) {
    return undefined
  }

  const typeName = type?.typeName?.text

  if (!typeName) return undefined

  if (!typeName.startsWith('SVGAnimated')) return undefined

  const iface = interfacesByName.get(typeName)
  const baseVal = iface?.members.find(
    (member) =>
      ts.isPropertySignature(member) &&
      ts.isIdentifier(member.name) &&
      member.name.text === 'baseVal',
  )

  return baseVal && ts.isPropertySignature(baseVal) ? baseVal.type : undefined
}

const namespace = ts.factory.createModuleDeclaration(
  [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
  ts.factory.createIdentifier('DOMTypes'),
  ts.factory.createModuleBlock(generatedInterfaces),
  ts.NodeFlags.Namespace,
)
const generatedSourceFile = ts.factory.updateSourceFile(
  sourceFile,
  [namespace],
  false,
  [],
  [],
  false,
  [],
)
const output = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed }).printFile(generatedSourceFile)

// Test descendants before their ancestors so a specific element does not fall
// through to its base interface. Names make unrelated interfaces deterministic.
const elementInterfaceNames = [...primaryInterfaceNames]
  .filter((name) => {
    const ancestors = getRecursiveExtends(name)
    return (
      ['HTMLElement', 'SVGElement', 'MathMLElement'].includes(name) ||
      ['HTMLElement', 'SVGElement', 'MathMLElement'].some((root) => ancestors.has(root))
    )
  })
  .sort((left, right) => {
    const depthDifference = getRecursiveExtends(right).size - getRecursiveExtends(left).size
    return depthDifference || left.localeCompare(right, 'en')
  })

const writableDOMTypeBranches = ['HTMLElement', 'SVGElement', 'MathMLElement']
  .map((root) => {
    const names = elementInterfaceNames.filter(
      (name) => name === root || getRecursiveExtends(name).has(root),
    )
    return `type Writable${root}Type<Element> =
${names.map((name) => `    Element extends ${name} ? DOMTypes.${name} :`).join('\n')}
    never;
`
  })
  .join('\n')

const writableDOMType = `
${writableDOMTypeBranches}
/**
 * Maps a native DOM element or subclass to its generated writable properties.
 * Matching is structural: indistinguishable interfaces use the first matching
 * branch. Unions distribute over their members; unsupported types resolve to never.
 */
export type WritableDOMType<Element extends HTMLElement | SVGElement | MathMLElement> =
    Element extends HTMLElement ? WritableHTMLElementType<Element> :
    Element extends SVGElement ? WritableSVGElementType<Element> :
    Element extends MathMLElement ? WritableMathMLElementType<Element> :
    never;
`

console.log('Saving types...')
if (!existsSync('./generated')) mkdirSync('./generated')
writeFileSync('./generated/index.d.ts', output + writableDOMType)

const htmlElementTagNameMap = {
  ...getTagNameMap('HTMLElementTagNameMap'),
  ...getTagNameMap('HTMLElementDeprecatedTagNameMap'),
}
const svgElementTagNameMap = getTagNameMap('SVGElementTagNameMap')
const mathMLElementTagNameMap = getTagNameMap('MathMLElementTagNameMap')
const elementTagNameMap: Record<string, string> = { ...htmlElementTagNameMap }

for (const [tag, type] of Object.entries(svgElementTagNameMap)) {
  elementTagNameMap[tag === 'svg' ? tag : `svg:${tag}`] = type
}
for (const [tag, type] of Object.entries(mathMLElementTagNameMap)) {
  elementTagNameMap[tag === 'math' ? tag : `math:${tag}`] = type
}

const runtimeMapSource = `// Generated from @types/web. Do not edit manually.
export const htmlElementTagNameMap = ${JSON.stringify(htmlElementTagNameMap, null, 2)}
export const svgElementTagNameMap = ${JSON.stringify(svgElementTagNameMap, null, 2)}
export const mathMLElementTagNameMap = ${JSON.stringify(mathMLElementTagNameMap, null, 2)}
export const elementTagNameMap = ${JSON.stringify(elementTagNameMap, null, 2)}
`
const runtimeMapTypes = `export const htmlElementTagNameMap: Readonly<Record<string, string>>
export const svgElementTagNameMap: Readonly<Record<string, string>>
export const mathMLElementTagNameMap: Readonly<Record<string, string>>
export const elementTagNameMap: Readonly<Record<string, string>>
`

writeFileSync('./generated/tag-name-map.js', runtimeMapSource)
writeFileSync('./generated/tag-name-map.d.ts', runtimeMapTypes)
