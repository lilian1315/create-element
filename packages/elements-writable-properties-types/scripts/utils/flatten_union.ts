import type { ts, Type } from 'ts-morph'

export function flattenUnion(union: Type<ts.UnionType>): Set<Type<ts.Type>> {
  const types = new Set<Type<ts.Type>>()

  union.getUnionTypes().forEach((type) => {
    if (type.isUnion()) flattenUnion(type).forEach((t) => types.add(t))
    else types.add(type)
  })

  return types
}
