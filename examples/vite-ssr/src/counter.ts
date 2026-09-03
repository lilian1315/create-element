import { shallowRef } from '@vue/reactivity'

import { h } from '@lilian1315/create-element/vue-reactivity/virtual'

export function createCounter() {
  const count = shallowRef(0)

  count.value = 5

  return h('output', { class: 'counter' }, 'Reactive snapshot: ', count)
}
