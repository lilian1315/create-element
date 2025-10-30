import { InterfaceDeclaration, SyntaxKind } from "ts-morph"

const interfacesReccursiveExtendsMap = new Map<InterfaceDeclaration, Set<InterfaceDeclaration>>()

export function getInterfaceReccursiveExtends(iface: InterfaceDeclaration): Set<InterfaceDeclaration> {
    if (interfacesReccursiveExtendsMap.has(iface)) return interfacesReccursiveExtendsMap.get(iface)!

    const result: Set<InterfaceDeclaration> = new Set()

    const extendsExprs = iface.getExtends()
    for (const expr of extendsExprs) {
        const symbol = expr.getExpression().getSymbol()
        if (symbol) {
            const decl = symbol.getDeclarations().find(d => d.isKind(SyntaxKind.InterfaceDeclaration)) as InterfaceDeclaration | undefined

            if (decl) {
                result.add(decl)
                getInterfaceReccursiveExtends(decl).forEach(i => result.add(i))
            } else {
                console.warn(`${expr.getText()} (not resolved)`)
            }
        } else {
            console.warn(`${expr.getText()} (not resolved)`)
        }
    }

    return result
}