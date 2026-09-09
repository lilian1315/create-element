/** @jsxImportSource ../src */

import { expectTypeOf } from 'vite-plus/test'

import { asDom } from '../src/index'

const div = asDom<'div'>(<div />)
const path = asDom<'svg:path'>(<svg:path />)

expectTypeOf(div).toEqualTypeOf<HTMLDivElement>()
expectTypeOf(path).toEqualTypeOf<SVGPathElement>()
