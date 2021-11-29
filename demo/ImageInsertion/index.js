import Vue from 'vue'
import component from './index.vue'

let instance

export function initImageInsertionDialog (options) {
  return new Promise((resolve, reject) => {
    const Constructor = Vue.extend({
      render: h => h(component)
    })

    instance = new Constructor({
      el: document.createElement('div'),
      mounted () {
        resolve(this)
      },
      destroyed () {
        reject(this)
      },
      ...options,
    })

    /*instance.$children[0].$on('update:show', n => {

    })*/

    //document.body.appendChild(instance.$el)
    instance.$mount(document.body)
  })
}

export function openImageInsertionDialog () {
  instance.$children[0].show = true
}
