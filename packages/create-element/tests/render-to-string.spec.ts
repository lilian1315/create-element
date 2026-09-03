import { describe, expect, it, vi } from 'vite-plus/test'

import { renderToString } from '../src/server/index'
import { h } from '../src/virtual/index'
import { Fragment, jsx } from '../src/virtual/jsx-runtime'

describe('renderToString', () => {
  it('renders text, components, fragments, and empty children', () => {
    const Greeting = ({ name }: { name: string }) => h('strong', null, `Hello ${name}`)
    const tree = jsx(Fragment, {
      children: [jsx(Greeting, { name: 'Ada' }), ' <3 ', 0, false, null, undefined],
    })

    expect(renderToString(tree)).toBe('<strong>Hello Ada</strong> &lt;3 0')
  })

  it('serializes DOM-like props and escapes unsafe values', () => {
    const onclick = vi.fn()
    const tree = h(
      'main',
      {
        ariaHidden: 'false',
        class: { active: true, hidden: false },
        data: { actionName: 'save&close', disabled: false, ready: true },
        hidden: true,
        id: 'a"&<b',
        onclick,
        style: { color: 'red', fontSize: '19px' },
      },
      'A & B < C',
    )

    expect(renderToString(tree)).toBe(
      '<main aria-hidden="false" class="active" data-action-name="save&amp;close" data-ready hidden id="a&quot;&amp;&lt;b" style="color:red;font-size:19px;">A &amp; B &lt; C</main>',
    )
    expect(onclick).not.toHaveBeenCalled()
  })

  it('normalizes property aliases and boolean enumerated attributes', () => {
    const tree = h(
      'label',
      {
        className: 'field',
        contentEditable: 'false',
        draggable: false,
        htmlFor: 'name',
        spellcheck: true,
      },
      'Name',
    )

    expect(renderToString(tree)).toBe(
      '<label class="field" contenteditable="false" draggable="false" for="name" spellcheck="true">Name</label>',
    )
  })

  it('renders raw innerHTML, including an empty string', () => {
    expect(renderToString(h('div', { innerHTML: '<span>raw & trusted</span>' }))).toBe(
      '<div><span>raw & trusted</span></div>',
    )
    expect(renderToString(h('div', { innerHTML: '' }))).toBe('<div></div>')
  })

  it('renders void elements without children or closing tags', () => {
    expect(renderToString(h('img', { alt: 'avatar', src: '/avatar.png' }, 'ignored'))).toBe(
      '<img alt="avatar" src="/avatar.png"/>',
    )
  })

  it('renders SVG and MathML names and attributes', () => {
    const tree = [
      h(
        'svg',
        { viewBox: '0 0 10 10' },
        h('svg:circle', { cx: 5, fillRule: 'evenodd', strokeWidth: 2 }),
      ),
      h('math', null, h('math:mi', { className: 'variable' }, 'x')),
    ]

    expect(renderToString(tree)).toBe(
      '<svg viewBox="0 0 10 10"><circle cx="5" fill-rule="evenodd" stroke-width="2"></circle></svg><math><mi class="variable">x</mi></math>',
    )
  })

  it('reflects textarea and select values into markup', () => {
    const tree = [
      h('textarea', { value: 'A & B' }),
      h(
        'select',
        { value: 'b' },
        h('option', { value: 'a' }, 'A'),
        h('option', { value: 'b' }, 'B'),
      ),
    ]

    expect(renderToString(tree)).toBe(
      '<textarea>A &amp; B</textarea><select><option value="a">A</option><option value="b" selected>B</option></select>',
    )
  })
})
