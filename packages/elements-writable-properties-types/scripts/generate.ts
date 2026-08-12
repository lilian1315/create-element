import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { EOL } from 'node:os'

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
    !inheritedNames.has('SVGElement')
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
      ts.isIndexSignatureDeclaration(member) ||
      (ts.isPropertySignature(member) &&
        member.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ReadonlyKeyword))
    ) {
      continue
    }

    if (ts.isSetAccessorDeclaration(member)) {
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

const namespace = ts.factory.createModuleDeclaration(
  [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
  ts.factory.createIdentifier('DOMTypes'),
  ts.factory.createModuleBlock(generatedInterfaces),
  ts.NodeFlags.Namespace,
)
const generatedSourceFile = ts.factory.updateSourceFile(sourceFile, [namespace], false, [], [], false, [])
const newLineKind = EOL === '\r\n' ? ts.NewLineKind.CarriageReturnLineFeed : ts.NewLineKind.LineFeed
const output = ts.createPrinter({ newLine: newLineKind }).printFile(generatedSourceFile)

console.log('Saving types...')
if (!existsSync('./generated')) mkdirSync('./generated')
writeFileSync('./generated/index.d.ts', output)
