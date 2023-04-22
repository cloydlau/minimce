import { createVNode, render } from 'vue-demi'
import Component from './index.vue'

let vm

function mount(props) {
  const el = document.createElement('div')
  vm = createVNode(Component, props)
  // eslint-disable-next-line @typescript-eslint/no-invalid-this
  vm.appContext = this._context
  render(vm, el)
}

function open() {
  vm.component.exposed.open()
}

export default { mount, open }
