import { describe, expect, it, vi } from 'vitest'
import { h as elAlienDeepsignals } from '../src/alien-deepsignals/index'
import { h as elCore } from '../src/index'

const factories: [string, typeof elCore][] = [
  ['core', elCore],
  ['alien-deepsignals', elAlienDeepsignals],
]

for (const [factoryName, h] of factories) {
  describe(`h (${factoryName})`, () => {
    it.concurrent('create whith just tag', () => {
      expect(h('a')).toBeInstanceOf(HTMLAnchorElement)
      expect(h('div')).toBeInstanceOf(HTMLDivElement)
      expect(h('svg')).toBeInstanceOf(SVGSVGElement)
      expect(h('svg:circle')).toBeInstanceOf(SVGCircleElement)
      expect(h('math')).toBeInstanceOf(Element) // MathMLElement not supported by Happy Dom
      expect(h('math:mi')).toBeInstanceOf(Element) // MathMLElement not supported by Happy Dom
    })

    it.concurrent('create whith tag and attributes', () => {
      const element = h('img', {
        src: 'http://test/img.png',
        alt: 'image test',
        hidden: true,
      })

      expect(element.src).toBe('http://test/img.png')
      expect(element.alt).toBe('image test')
      expect(element.hidden).toBe(true)
    })

    it.concurrent('create whith tag and unknown attributes', () => {
      const symbol = Symbol('test symbol')
      const element = h('picture', {
        [symbol]: 'Test symbol',
        unknown: 'Test unknown',
      })
      // @ts-expect-error symbol attribute
      expect(element[symbol]).toBe('Test symbol')
      expect(element.getAttribute('unknown')).toBe('Test unknown')
    })

    it.concurrent('support class attribute (string)', () => {
      const element = h('span', { class: 'class1 class2' })

      expect(element.classList.contains('class1')).toBe(true)
      expect(element.classList.contains('class2')).toBe(true)
    })

    it.concurrent('support class attribute (array)', () => {
      const element = h('span', { class: ['class1', 'class2'] })

      expect(element.classList.contains('class1')).toBe(true)
      expect(element.classList.contains('class2')).toBe(true)
    })

    it.concurrent('support class attribute (object)', () => {
      const element = h('span', {
        class: {
          class1: true,
          class2: true,
          class3: false,
        },
      })

      expect(element.classList.contains('class1')).toBe(true)
      expect(element.classList.contains('class2')).toBe(true)
      expect(element.classList.contains('class3')).toBe(false)
    })

    it.concurrent('support style attribute (string)', () => {
      const element = h('h2', { style: 'color: red; font-size: 19px' })

      expect(element.style.color).toBe('red')
      expect(element.style.fontSize).toBe('19px')
    })

    it.concurrent('support style attribute (object)', () => {
      const element = h('h2', {
        style: {
          color: 'red',
          fontSize: '19px',
        },
      })

      expect(element.style.color).toBe('red')
      expect(element.style.fontSize).toBe('19px')
    })

    it.concurrent('support event listener attribute', () => {
      const onclick = vi.fn(() => null)
      const element = h('p', { onclick })

      element.click()
      expect(onclick).toHaveBeenCalled()

      const onchange = vi.fn(() => null)

      const element2 = h('input', { onchange })

      element2.dispatchEvent(new Event('change'))
      expect(onchange).toHaveBeenCalled()
    })

    it.concurrent('support data attribute', () => {
      const element = h('main', {
        data: {
          name: 'test',
          other: 'other test',
        },
      })

      expect(element.dataset.name).toBe('test')
      expect(element.dataset.other).toBe('other test')
    })

    it.concurrent('support children property / attribute', () => {
      const span = h('span', { children: 'span element' })
      const span2 = h('span', null, ' span2 element')
      const span3 = h('span', null, ' span3 element')

      const children = [
        [
          152,
          ' first string element ',
          null,
          span,
          undefined,
          ' last element',
        ],
        [null, undefined, span2],
        null,
        span3,
        undefined,
        ' real last!',
      ]

      const expectedTextContent = '152 first string element span element last element span2 element span3 element real last!'

      const doTest = function (element: HTMLElement) {
        expect(span.textContent).toBe('span element')
        expect(span2.textContent).toBe(' span2 element')
        expect(span3.textContent).toBe(' span3 element')
        expect(element.childNodes[0]).toBeInstanceOf(Text)
        expect(element.childNodes[0].textContent).toBe('152')
        expect(element.childNodes[1]).toBeInstanceOf(Text)
        expect(element.childNodes[1].textContent).toBe(' first string element ')
        expect(element.childNodes[2]).toBe(span)
        expect(element.childNodes[3]).toBeInstanceOf(Text)
        expect(element.childNodes[3].textContent).toBe(' last element')
        expect(element.childNodes[4]).toBe(span2)
        expect(element.childNodes[5]).toBe(span3)
        expect(element.childNodes[6]).toBeInstanceOf(Text)
        expect(element.childNodes[6].textContent).toBe(' real last!')
        expect(element.textContent).toBe(expectedTextContent)
      }

      doTest(h('aside', { children }))
      doTest(h('aside', null, ...children))
    })
  })
}
