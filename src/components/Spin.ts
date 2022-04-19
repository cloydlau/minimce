import './Spin.css'
import { h, defineComponent } from 'vue-demi'

export default defineComponent({
  setup: () => () => h('div', { class: 'sk-cube-grid' }, [
    h('div', { class: 'sk-cube sk-cube1' }),
    h('div', { class: 'sk-cube sk-cube2' }),
    h('div', { class: 'sk-cube sk-cube3' }),
    h('div', { class: 'sk-cube sk-cube4' }),
    h('div', { class: 'sk-cube sk-cube5' }),
    h('div', { class: 'sk-cube sk-cube6' }),
    h('div', { class: 'sk-cube sk-cube7' }),
    h('div', { class: 'sk-cube sk-cube8' }),
    h('div', { class: 'sk-cube sk-cube9' }),
  ])
})
