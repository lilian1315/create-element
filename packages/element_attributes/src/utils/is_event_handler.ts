import type { PropertySignature, SourceFile, ts, Type, TypeElementTypes } from "ts-morph";
import { SyntaxKind } from "ts-morph";
import { flattenUnion } from "./flatten_union.ts";

export function isEventHandler(m: TypeElementTypes, sourceFile: SourceFile): m is PropertySignature {
    const eventInterfaceType = sourceFile.getInterfaceOrThrow('Event').getType()

    if(!m.isKind(SyntaxKind.PropertySignature) || !m.getName().startsWith('on')) return false
    
    const firstParameterType = m
        .getType()
        .getCallSignatures()[0]
        ?.getParameters()[0]
        ?.getDeclarations()[0]
        ?.getType()

    if(firstParameterType.isAssignableTo(eventInterfaceType)) return true
    
    const possibleFirstParameterInterfaces = new Set<Type<ts.InterfaceType>>
    if(firstParameterType.isInterface()) {
        possibleFirstParameterInterfaces.add(firstParameterType)
    } else if (firstParameterType.isUnion()) {
        Array.from(flattenUnion(firstParameterType))
            .filter((t) => t.isInterface())
            .forEach((t) => possibleFirstParameterInterfaces.add(t))
    }

    return Array.from(possibleFirstParameterInterfaces)
        .some((i) => i.isAssignableTo(eventInterfaceType))
}