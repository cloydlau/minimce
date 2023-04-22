import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import App from './index.vue'
import useMiniMCE from './useMiniMCE'

const app = createApp(App)
useMiniMCE(app)
app
  .use(ElementPlus)
  .mount('#app')
