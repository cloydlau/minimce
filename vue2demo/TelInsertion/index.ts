import Component from './index.vue'
import Vue from 'vue'
//import store from '@/store'

let vm

function mount (props) {
  const el = document.createElement('div')

  const Constructor = Vue.extend({
    render: h => h(Component),
    //store,
  })

  vm = new Constructor({
    el,
    ...props,
  })

  vm.$mount(document.body)
}

function open () {
  vm.$children[0].open()
}

export default { mount, open }
