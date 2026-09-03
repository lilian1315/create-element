/** @jsxImportSource ../src/virtual */

import { expect, it } from 'vitest'

import { renderToString } from '../src/server/index'
import { mount } from '../src/virtual/index'
import type { VNodeChildren } from '../src/virtual/types'

function Greeting({ children, name }: { children?: VNodeChildren; name: string }) {
  return (
    <strong>
      Hello {name}
      {children}
    </strong>
  )
}

it('uses the virtual JSX runtime for components and fragments', () => {
  const tree = (
    <>
      <Greeting name="Ada">!</Greeting>
      <span key="suffix"> Welcome</span>
    </>
  )

  expect(renderToString(tree)).toBe('<strong>Hello Ada!</strong><span> Welcome</span>')

  const target = document.createElement('main')
  mount(target, tree)
  expect(target.innerHTML).toBe('<strong>Hello Ada!</strong><span> Welcome</span>')
})
