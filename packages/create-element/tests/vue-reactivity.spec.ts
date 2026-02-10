import type { Children } from '../src/vue-reactivity/types'
import { computed, ref } from '@vue/reactivity'
import { expect, it } from 'vitest'
import { h } from '../src/vue-reactivity/index'

it.concurrent('support ref / computed attributes', () => {
  const title = ref('initial title')
  const cols = ref(20)
  const hidden = ref(true)
  const computedTitle = computed(() => `computed: ${title.value}`)

  const textarea = h('textarea', { title, cols, hidden })
  const p = h('p', { title: computedTitle })

  expect(textarea.title).toBe('initial title')
  expect(textarea.cols).toBe(20)
  expect(textarea.hidden).toBe(true)
  expect(p.title).toBe('computed: initial title')

  title.value = 'new title'
  cols.value = 30
  hidden.value = false

  expect(textarea.title).toBe('new title')
  expect(textarea.cols).toBe(30)
  expect(textarea.hidden).toBe(false)
  expect(p.title).toBe('computed: new title')
})

it.concurrent('support class attribute ((Ref|ComputedRef)<string>)', () => {
  const className = ref('class1 class2')
  const element = h('span', { class: className })
  const element2 = h('span', { class: computed(() => className.value) })

  expect(element.classList.contains('class1')).toBe(true)
  expect(element.classList.contains('class2')).toBe(true)

  expect(element2.classList.contains('class1')).toBe(true)
  expect(element2.classList.contains('class2')).toBe(true)

  className.value = 'class3 class4'

  expect(element.classList.contains('class1')).toBe(false)
  expect(element.classList.contains('class2')).toBe(false)
  expect(element.classList.contains('class3')).toBe(true)
  expect(element.classList.contains('class4')).toBe(true)

  expect(element2.classList.contains('class1')).toBe(false)
  expect(element2.classList.contains('class2')).toBe(false)
  expect(element2.classList.contains('class3')).toBe(true)
  expect(element2.classList.contains('class4')).toBe(true)
})

it.concurrent('support class attribute ((Ref|ComputedRef)<string[]>)', () => {
  const classArray = ref(['class1', 'class2'])
  const element = h('span', { class: classArray })
  const element2 = h('span', { class: computed(() => classArray.value) })

  expect(element.classList.contains('class1')).toBe(true)
  expect(element.classList.contains('class2')).toBe(true)

  expect(element2.classList.contains('class1')).toBe(true)
  expect(element2.classList.contains('class2')).toBe(true)

  classArray.value = ['class3', 'class4']

  expect(element.classList.contains('class1')).toBe(false)
  expect(element.classList.contains('class2')).toBe(false)
  expect(element.classList.contains('class3')).toBe(true)
  expect(element.classList.contains('class4')).toBe(true)

  expect(element2.classList.contains('class1')).toBe(false)
  expect(element2.classList.contains('class2')).toBe(false)
  expect(element2.classList.contains('class3')).toBe(true)
  expect(element2.classList.contains('class4')).toBe(true)
})

it.concurrent('support class attribute ({ [className: string]: (Ref|ComputedRef)<boolean> })', () => {
  const isSelected = ref(true)
  const isNotSelected = computed(() => !isSelected.value)
  const element = h('span', {
    class: {
      isSelected,
      isNotSelected,
      class1: true,
      class2: false,
    },
  })

  expect(element.classList.contains('isSelected')).toBe(true)
  expect(element.classList.contains('isNotSelected')).toBe(false)
  expect(element.classList.contains('class1')).toBe(true)
  expect(element.classList.contains('class2')).toBe(false)

  isSelected.value = false

  expect(element.classList.contains('isSelected')).toBe(false)
  expect(element.classList.contains('isNotSelected')).toBe(true)
  expect(element.classList.contains('class1')).toBe(true)
  expect(element.classList.contains('class2')).toBe(false)
})

it.concurrent('support style attribute ((Ref|ComputedRef)<string>)', () => {
  const style = ref('color: red; font-size: 19px')
  const computedTitle = computed(() => `${style.value}; font-weight: bold`)
  const element = h('h2', { style })
  const element2 = h('h2', { style: computedTitle })

  expect(element.style.color).toBe('red')
  expect(element.style.fontSize).toBe('19px')
  expect(element2.style.color).toBe('red')
  expect(element2.style.fontSize).toBe('19px')
  expect(element2.style.fontWeight).toBe('bold')

  style.value = 'color: blue; font-size: 25px'

  expect(element.style.color).toBe('blue')
  expect(element.style.fontSize).toBe('25px')
  expect(element2.style.color).toBe('blue')
  expect(element2.style.fontSize).toBe('25px')
  expect(element2.style.fontWeight).toBe('bold')
})

it.concurrent('support style attribute (MayBeReactiveObject<CSSStyleDeclaration>)', () => {
  const fontSize = ref('19px')
  const lineHeightRaw = ref(1.5)
  const lineHeight = computed(() => `${lineHeightRaw.value}em`)

  const element = h('h2', {
    style: {
      fontSize,
      lineHeight,
    },
  })

  expect(element.style.fontSize).toBe('19px')
  expect(element.style.lineHeight).toBe('1.5em')

  fontSize.value = '25px'
  lineHeightRaw.value = 2

  expect(element.style.fontSize).toBe('25px')
  expect(element.style.lineHeight).toBe('2em')
})

it.concurrent('support ref / computed data attribute', () => {
  const name = ref('test')
  const other = computed(() => `other ${name.value}`)
  const element = h('main', {
    data: {
      name,
      other,
    },
  })

  expect(element.dataset.name).toBe('test')
  expect(element.dataset.other).toBe('other test')

  name.value = 'TEST'

  expect(element.dataset.name).toBe('TEST')
  expect(element.dataset.other).toBe('other TEST')
})

it.concurrent('support children property / attribute with refs / computed child', () => {
  const doTestChild = (factory: (children: Children[]) => HTMLElement) => {
    const numberSignal = ref(1)
    const computedChild = computed(() => `ComputedRef number: ${numberSignal.value}`)
    const stringSignal = ref('Initial string')
    const node = h('span', { children: 'Initial node' })
    const node2 = h('span', { children: 'Other node' })
    const nodeSignal = ref(node)

    const element = factory([
      numberSignal,
      computedChild,
      'regular string',
      stringSignal,
      nodeSignal,
    ])

    expect(element.childNodes[0].textContent).toBe('1')
    expect(element.childNodes[1].textContent).toBe('ComputedRef number: 1')
    expect(element.childNodes[2].textContent).toBe('regular string')
    expect(element.childNodes[3].textContent).toBe('Initial string')
    expect(element.childNodes[4]).toBe(node)

    numberSignal.value = 42
    stringSignal.value = 'Updated string'
    nodeSignal.value = node2

    expect(element.childNodes[0].textContent).toBe('42')
    expect(element.childNodes[1].textContent).toBe('ComputedRef number: 42')
    expect(element.childNodes[2].textContent).toBe('regular string')
    expect(element.childNodes[3].textContent).toBe('Updated string')
    expect(element.childNodes[4]).toBe(node2)
  }

  doTestChild((children) => h('div', { children }))
  doTestChild((children) => h('div', null, ...children))
})

it.concurrent('support children property / attribute with reactive array', () => {
  const doTestReactiveArray = (factory: (children: Children[]) => HTMLElement) => {
    const node = h('span', { children: 'first node' })
    const node2 = h('span', { children: 'Other node' })
    const node3 = h('span', { children: 'Third node' })

    const signalArray = ref([node, 'regular string', node2, node3])

    const element = factory(['before', signalArray, 'after'])

    expect(element.childNodes.length).toBe(6)
    expect(element.childNodes[0].textContent).toBe('before')
    expect(element.childNodes[1]).toBe(node)
    expect(element.childNodes[2].textContent).toBe('regular string')
    expect(element.childNodes[3]).toBe(node2)
    expect(element.childNodes[4]).toBe(node3)
    expect(element.childNodes[5].textContent).toBe('after')

    signalArray.value = [node, 'regular string', node3, node2]

    expect(element.childNodes.length).toBe(6)
    expect(element.childNodes[0].textContent).toBe('before')
    expect(element.childNodes[1]).toBe(node)
    expect(element.childNodes[2].textContent).toBe('regular string')
    expect(element.childNodes[3]).toBe(node3)
    expect(element.childNodes[4]).toBe(node2)
    expect(element.childNodes[5].textContent).toBe('after')

    signalArray.value = [node2, 'updated string']

    expect(element.childNodes.length).toBe(4)
    expect(element.childNodes[0].textContent).toBe('before')
    expect(element.childNodes[1]).toBe(node2)
    expect(element.childNodes[2].textContent).toBe('updated string')
    expect(element.childNodes[3].textContent).toBe('after')

    signalArray.value = []

    expect(element.childNodes.length).toBe(3)
    expect(element.childNodes[0].textContent).toBe('before')
    expect(element.childNodes[1]).toBeInstanceOf(Comment)
    expect(element.childNodes[2].textContent).toBe('after')
  }

  doTestReactiveArray((children) => h('div', { children }))
  doTestReactiveArray((children) => h('div', null, ...children))
})

it.concurrent('support reactive innerHTML attribute', () => {
  const innerHTML = ref('<p>Test innerHTML</p><span>With a span</span>')
  const element = h('div', { innerHTML })

  expect(element.childNodes[0]).toBeInstanceOf(HTMLParagraphElement)
  expect(element.childNodes[1]).toBeInstanceOf(HTMLSpanElement)

  innerHTML.value = '<h3>New innerHTML</h3><a href="#">With a link</a>'

  expect(element.childNodes[0]).toBeInstanceOf(HTMLHeadingElement)
  expect(element.childNodes[1]).toBeInstanceOf(HTMLAnchorElement)

  innerHTML.value = ''

  expect(element.childNodes.length).toBe(0)
})
