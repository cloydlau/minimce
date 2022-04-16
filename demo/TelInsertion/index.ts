import { createVNode, render } from 'vue-demi'
import Constructor from './index.vue'

let vm

function mount (miniMCE) {
  vm = createVNode(Constructor, { miniMCE })
  vm.appContext = this.appContext
  const container = document.createElement('div')
  render(vm, container)
}

function open () {
  vm.component.exposed.open()
}

export default { mount, open }
