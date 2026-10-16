import type { DOMTypes, WritableDOMType } from '@lilian1315/elements-writable-properties-types'
import { describe, expectTypeOf, it } from 'vite-plus/test'

interface CustomAnchor extends HTMLAnchorElement {
  customProperty: string
}

describe('WritableDOMType', () => {
  it('maps HTML, SVG, and MathML elements to their writable interfaces', () => {
    expectTypeOf<WritableDOMType<HTMLAnchorElement>>().toEqualTypeOf<DOMTypes.HTMLAnchorElement>()
    expectTypeOf<WritableDOMType<HTMLInputElement>>().toEqualTypeOf<DOMTypes.HTMLInputElement>()
    expectTypeOf<WritableDOMType<SVGCircleElement>>().toEqualTypeOf<DOMTypes.SVGCircleElement>()
    expectTypeOf<WritableDOMType<SVGSVGElement>>().toEqualTypeOf<DOMTypes.SVGSVGElement>()
    expectTypeOf<WritableDOMType<MathMLElement>>().toEqualTypeOf<DOMTypes.MathMLElement>()
  })

  it('maps subclasses to their native writable interface', () => {
    expectTypeOf<WritableDOMType<CustomAnchor>>().toEqualTypeOf<DOMTypes.HTMLAnchorElement>()
  })

  it('distributes over element unions', () => {
    expectTypeOf<WritableDOMType<HTMLAnchorElement | HTMLInputElement>>().toEqualTypeOf<
      DOMTypes.HTMLAnchorElement | DOMTypes.HTMLInputElement
    >()
  })

  it('rejects non-element types and preserves never', () => {
    // @ts-expect-error only native DOM element types are accepted
    expectTypeOf<WritableDOMType<Text>>().toBeNever()
    // @ts-expect-error unknown does not satisfy the element constraint
    expectTypeOf<WritableDOMType<unknown>>().toBeNever()
    expectTypeOf<WritableDOMType<never>>().toBeNever()
  })

  it('preserves writable property types', () => {
    expectTypeOf<WritableDOMType<HTMLAnchorElement>['href']>().toEqualTypeOf<string>()
  })

  it('excludes readonly properties, methods, and subclass additions', () => {
    expectTypeOf<WritableDOMType<CustomAnchor>>().not.toHaveProperty('nodeType')
    expectTypeOf<WritableDOMType<CustomAnchor>>().not.toHaveProperty('click')
    expectTypeOf<WritableDOMType<CustomAnchor>>().not.toHaveProperty('customProperty')
  })
})
