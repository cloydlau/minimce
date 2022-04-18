import { createVNode, render } from 'vue-demi'
import Component from './index.vue'

let vm

function mount (props) {
  const el = document.createElement('div')
  vm = createVNode(Component, props)
  vm.appContext = this.appContext
  render(vm, el)
}

function open () {
  vm.component.exposed.open()
}

export default { mount, open }
