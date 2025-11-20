import type { InterfaceDeclaration } from 'ts-morph'
import { SyntaxKind } from 'ts-morph'

const interfacesRecursiveExtendsMap = new Map<InterfaceDeclaration, Set<InterfaceDeclaration>>()

export function getInterfaceRecursiveExtends(iface: InterfaceDeclaration): Set<InterfaceDeclaration> {
  if (interfacesRecursiveExtendsMap.has(iface)) return interfacesRecursiveExtendsMap.get(iface)!

  const result: Set<InterfaceDeclaration> = new Set()

  const extendsExprs = iface.getExtends()
  for (const expr of extendsExprs) {
    const symbol = expr.getExpression().getSymbol()
    if (symbol) {
      const decl = symbol.getDeclarations().find((d) => d.isKind(SyntaxKind.InterfaceDeclaration)) as InterfaceDeclaration | undefined

      if (decl) {
        result.add(decl)
        getInterfaceRecursiveExtends(decl).forEach((i) => result.add(i))
      } else {
        console.warn(`${expr.getText()} (not resolved)`)
      }
    } else {
      console.warn(`${expr.getText()} (not resolved)`)
    }
  }

  return result
}
