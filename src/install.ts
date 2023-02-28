import { resolveConfig } from 'vue-global-config'
import type { App, Component } from 'vue-demi'
import component from './component'

const globalProps: Record<string | symbol, any> = {}

type SFCWithInstall = Component & {
  install: (app: App, options?: Record<string | symbol, any>) => void
}

function withInstall(sfc: Component): SFCWithInstall {
  ;(sfc as SFCWithInstall).install = (app: App, options = {}): void => {
    const { props } = resolveConfig(options, component.props)
    Object.assign(globalProps, props)
    app.component(sfc.name as string, sfc as Object)
  }

  return sfc as SFCWithInstall
}

export { globalProps }
export default withInstall(component)
