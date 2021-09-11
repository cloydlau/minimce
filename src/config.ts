let globalConfig: { [key: string]: any } = {}

export const init = (opts: { [key: string]: any } = {}) => {
  for (let k in opts) {
    globalConfig[k] = opts[k]
  }
}

export default globalConfig
