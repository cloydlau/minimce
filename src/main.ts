import MiniMCE from './index'
import { init } from './config'

// @ts-ignore
MiniMCE.install = (app, options) => {
  init(options)
  app.component(MiniMCE.name, MiniMCE)
}

export default MiniMCE
