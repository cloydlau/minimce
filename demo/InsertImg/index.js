import Vue from 'vue'
import component from './index.vue'

const Constructor = Vue.extend({
  render: h => h(component)
})

export default (data = {}) => new Promise((resolve, reject) => {
  const instance = new Constructor({
    el: document.createElement('div'),
    data
  })

  instance.$children[0].$on('login', () => {
    instance.$el.remove()
  })

  document.body.appendChild(instance.$el)
})
