import type { DOMTypes, WritableDOMType } from '@lilian1315/elements-writable-properties-types'

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <Value>() => Value extends Right ? 1 : 2
    ? true
    : false
type Expect<Value extends true> = Value

interface CustomAnchor extends HTMLAnchorElement {
  customProperty: string
}

export type MappingChecks = [
  Expect<Equal<WritableDOMType<HTMLAnchorElement>, DOMTypes.HTMLAnchorElement>>,
  Expect<Equal<WritableDOMType<HTMLInputElement>, DOMTypes.HTMLInputElement>>,
  Expect<Equal<WritableDOMType<SVGCircleElement>, DOMTypes.SVGCircleElement>>,
  Expect<Equal<WritableDOMType<SVGSVGElement>, DOMTypes.SVGSVGElement>>,
  Expect<Equal<WritableDOMType<MathMLElement>, DOMTypes.MathMLElement>>,
  Expect<Equal<WritableDOMType<CustomAnchor>, DOMTypes.HTMLAnchorElement>>,
  Expect<
    Equal<
      WritableDOMType<HTMLAnchorElement | HTMLInputElement>,
      DOMTypes.HTMLAnchorElement | DOMTypes.HTMLInputElement
    >
  >,
  // @ts-expect-error only native DOM element types are accepted
  Expect<Equal<WritableDOMType<Text>, never>>,
  // @ts-expect-error unknown does not satisfy the element constraint
  Expect<Equal<WritableDOMType<unknown>, never>>,
  Expect<Equal<WritableDOMType<never>, never>>,
  Expect<Equal<WritableDOMType<HTMLAnchorElement>['href'], string>>,
  Expect<
    Equal<
      Extract<'nodeType' | 'click' | 'customProperty', keyof WritableDOMType<CustomAnchor>>,
      never
    >
  >,
]
