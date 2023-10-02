import { resolveConfig } from 'vue-global-config'
import type { App } from 'vue-demi'
import Component from './Component'

const globalProps: Record<keyof any, any> = {}

type SFCWithInstall = typeof Component & {
  install: (app: App, options?: Record<keyof any, any>) => void
}

function withInstall(sfc: typeof Component): SFCWithInstall {
  (sfc as SFCWithInstall).install = (app: App, options = {}): void => {
    const { props } = resolveConfig(options, Component.props)
    Object.assign(globalProps, props)
    app.component(sfc.name as string, sfc as object)
  }

  return sfc as SFCWithInstall
}

export { globalProps }
export default withInstall(Component)
