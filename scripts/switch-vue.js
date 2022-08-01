import parseArgs from 'https://deno.land/x/deno_minimist@v1.0.2/mod.ts'
import Prompt from 'https://deno.land/x/prompt@v1.0.0/mod.ts'

const deps = {
  2: {
    '@vitejs/plugin-vue2': 'latest',
    '@vue/test-utils': '1',
    'element-ui': 'latest',
    'vue': '2',
  },
  3: {
    '@vitejs/plugin-vue': 'latest',
    '@vue/compiler-sfc': 'latest',
    '@vue/test-utils': 'latest',
    'element-plus': 'latest',
    'vue': 'latest',
  },
}
const args = parseArgs(Deno.args)
const pkg = JSON.parse(Deno.readTextFileSync('./package.json'))
const run = async (opt) => {
  const p = Deno.run(opt)
  const { code } = await p.status() // (*1); wait here for child to finish
  p.close()
  return new TextDecoder().decode(await p.output()).trim()
}

const targetVersion = args._[0] || 3
const currentVersion = (pkg.devDependencies.vue.startsWith('2')
  || pkg.devDependencies.vue.substring(1).startsWith('2'))
  ? 2
  : 3

function useVersion(version) {
  for (const k in deps[version ^ 1])
    delete pkg.devDependencies[k]

  for (const k in deps[version])
    pkg.devDependencies[k] = deps[version][k]

  Deno.writeTextFileSync('./package.json', JSON.stringify(pkg, null, 2))
  console.warn(`Vue 版本已切换至 ${version}`)
}

if (args.force) {
  useVersion(targetVersion)
}
else if (currentVersion !== targetVersion === 3) {
  const { yes } = await Prompt.prompts({
    type: 'confirm',
    name: 'yes',
    message: `是否切换至 Vue ${targetVersion}？`,
  })
  if (yes)
    useVersion(targetVersion)
}
else {
  console.warn('Vue 版本未切换')
}

await run('npx', ['vue-demi-switch', targetVersion])
await run('pnpm', ['i'])
