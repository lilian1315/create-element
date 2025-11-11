import { describe, test, expect, vi } from 'vitest'
import { el as elCore } from '../src/index'
import { el as elAlienDeepsignals } from '../src/alien-deepsignals/index'
import type { PrefixedElementTag, ElementPrefixedTagNameMap } from '../src/types'

type TagInstanceTuple<
    T extends PrefixedElementTag = PrefixedElementTag
> = [T, new () => ElementPrefixedTagNameMap[T]]

const factories: [string, typeof elCore][] = [
    ['core', elCore],
    ['alien-deepsignals', elAlienDeepsignals],
]

for (const [factoryName, el] of factories) {
    describe(`el (${factoryName})`, () => {
        test('create whith just tag', () => {
            const tagInstanceMap: TagInstanceTuple[] = [
                ['a', HTMLAnchorElement],
                ['div', HTMLDivElement],
                ['svg', SVGSVGElement],
                ['svg:circle', SVGCircleElement],
                ['math', Element as any], // MathMLElement not supported by Happy Dom
                ['math:mi', Element as any], // MathMLElement not supported by Happy Dom
            ]

            tagInstanceMap.forEach(([tag, constructor]) => {
                let element = el(tag)
                expect(element).toBeInstanceOf(constructor)
            })
        })

        test('create whith tag and attributes', () => {
            const element = el('img', {
                src: 'http://test/img.png',
                alt: 'image test',
                hidden: true,
            })

            expect(element.src).toBe('http://test/img.png')
            expect(element.alt).toBe('image test')
            expect(element.hidden).toBe(true)
        })

        test('support class attribute (string)', () => {
            const element = el('span', { class: 'class1 class2' })

            expect(element.classList.contains('class1')).toBe(true)
            expect(element.classList.contains('class2')).toBe(true)
        })

        test('support class attribute (array)', () => {
            const element = el('span', { class: ['class1', 'class2'] })

            expect(element.classList.contains('class1')).toBe(true)
            expect(element.classList.contains('class2')).toBe(true)
        })

        test('support class attribute (object)', () => {
            const element = el('span', {
                class: {
                    class1: true,
                    class2: true,
                    class3: false,
                }
            })

            expect(element.classList.contains('class1')).toBe(true)
            expect(element.classList.contains('class2')).toBe(true)
            expect(element.classList.contains('class3')).toBe(false)
        })

        test('support style attribute (string)', () => {
            const element = el('h2', { style: 'color: red; font-size: 19px' })

            expect(element.style.color).toBe('red')
            expect(element.style.fontSize).toBe('19px')
        })

        test('support style attribute (object)', () => {
            const element = el('h2', {
                style: {
                    color: 'red',
                    fontSize: '19px',
                }
            })

            expect(element.style.color).toBe('red')
            expect(element.style.fontSize).toBe('19px')
        })

        test('support event listener attribute', () => {
            const onclick = vi.fn(() => null)
            const element = el('p', { onclick })

            element.click()
            expect(onclick).toHaveBeenCalled()

            const onchange = vi.fn(() => null)

            const element2 = el('input', { onchange })

            element2.dispatchEvent(new Event('change'))
            expect(onchange).toHaveBeenCalled()
        })

        test('support data attribute', () => {
            const element = el('main', {
                data: {
                    name: 'test',
                    other: 'other test',
                }
            })

            expect(element.dataset.name).toBe('test')
            expect(element.dataset.other).toBe('other test')
        })

        {
            const span = el('span', { children: 'span element' })
            const span2 = el('span', null, ' span2 element')
            const span3 = el('span', null, ' span3 element')

            const children = [
                [
                    152,
                    ' first string element ',
                    span,
                    ' last element'
                ], [span2], span3, ' real last!'
            ]

            const expectedTextContent = '152 first string element span element last element span2 element span3 element real last!'

            const doTest = function(element: HTMLElement) {
                expect(span.innerText).toBe('span element')
                expect(span2.innerText).toBe(' span2 element')
                expect(span3.innerText).toBe(' span3 element')
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
                expect(element.innerText).toBe(expectedTextContent)
            }

            test('support children attribute', () => doTest(el('aside', { children })))
            test('support children', () => doTest(el('aside', null, ...children)))
        }
    })
}
