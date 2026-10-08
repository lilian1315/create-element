import { h } from '@lilian1315/create-element/vue-reactivity'
import { shallowRef } from '@vue/reactivity'

export function createCounter() {
  const count = shallowRef(0)

  count.value = 5

  return h('output', { class: 'counter', children: ['Reactive snapshot: ', count] })
}
