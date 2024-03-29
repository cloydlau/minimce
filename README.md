<h1 align="center">
  <a href="https://npmjs.com/package/minimce" target="_blank" rel="noopener noreferrer">
    MiniMCE <sup><img alt="version" src="https://img.shields.io/npm/v/minimce.svg?style=flat-square&color=white&label="></sup>
  </a>
</h1>

<p align="center">
  富文本编辑器，可离线使用的 <a href="https://github.com/tinymce/tinymce">TinyMCE</a> Vue 2.6/2.7/3 一体通用封装。
</p>

<p align="center">
  <a href="https://bundlephobia.com/package/minimce"><img alt="minzipped size" src="https://img.shields.io/bundlephobia/minzip/minimce"></a>
  <a href="https://conventionalcommits.org"><img alt="conventional commits" src="https://img.shields.io/badge/commits-Conventional-FE5196.svg?logo=conventionalcommits"></a>
  <a href="https://github.com/antfu/eslint-config"><img alt="code style" src="https://antfu.me/badge-code-style.svg"></a>
  <a href="https://github.com/cloydlau/minimce#develop"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>
</p>

<br>

## ⚠ DEPRECATED

> **Warning**
>
> minimce 已升级至原作者 [cloydlau](https://github.com/cloydlau) 的 [faim](https://github.com/cloydlau/faim)
>
> 不仅能力得到增强，为了后续的漏洞修复和迭代优化，请尽快迁移

<br>

## 对比 tinymce-vue
是的，TinyMCE 已经有官方的 Vue 封装 [tinymce-vue](https://github.com/tinymce/tinymce-vue) 了，但它：

- 需要加载至少 **380kB** 的网络资源 (开启插件全家桶将达到 **563kB**，还没算上付费插件)，外网会很慢，甚至超时
- 有[域名检测](#域名检测)，会弹窗警告
- 用不同的版本号来适配不同的 Vue 版本，升级成本较高
- 默认功能最小化，需要繁杂的配置，还不支持全局传参

![tinymce-vue](https://raw.githubusercontent.com/cloydlau/minimce/main/tinymce-vue.png)

![minimce](https://raw.githubusercontent.com/cloydlau/minimce/main/minimce.png)

<br>

## 特性

- 基于 TinyMCE 6
- Vue 2.6/2.7/3 一体通用
- 支持 SSR，Nuxt 2/3 一体通用
- 支持微前端 ([wujie](https://github.com/Tencent/wujie)，[qiankun](https://github.com/umijs/qiankun)，[single-spa](https://github.com/single-spa/single-spa)……)
- 可离线使用，零网络延迟
- 无[域名检测](#域名检测)，无弹窗困扰
- 插件全家桶开箱即用
- 提供常用自定义插件示例
    - 插入 Word 文档 (`.docx`)，兼容 Microsoft Office、WPS
    - 插入本地图片
    - 插入本地视频
    - 插入本地音频
    - 插入电话链接
    - 插入小程序页面链接
- 支持浅色模式 & 深色模式，主题、图标、内容样式均可自定义
- 支持将 HTML 输出为普通文本
- 局部注册并传参，或全局注册并传参 ([vue-global-config](https://github.com/cloydlau/vue-global-config) 提供技术支持)

<br>

## 安装

### 外置依赖

- vue
- tinymce
- ~~@vue/composition-api~~：仅 Vue 2.6 或更早版本需要

<br>

### Vue 3

```shell
npm i minimce tinymce
```

#### 局部注册

```vue
<script setup>
import MiniMCE from 'minimce'

// 在组件外部引入静态资源的目的是方便用户对其进行更换
import 'tinymce/skins/ui/oxide/skin.min.css'

// 皮肤
import 'tinymce/themes/silver/theme'

// 主题
import 'tinymce/icons/default/icons'

// 图标
import './langs/zh-Hans' // 语言（非必须，默认英文，下载地址: https://www.tiny.cloud/get-tiny/language-packages）
</script>

<template>
  <MiniMCE
    :options="{
      language: 'zh-Hans',
    }"
  />
</template>
```

#### 全局注册

```ts
import MiniMCE from 'minimce'

// 在组件外部引入静态资源的目的是方便用户对其进行更换
import 'tinymce/skins/ui/oxide/skin.min.css'

// 皮肤
import 'tinymce/themes/silver/theme'

// 主题
import 'tinymce/icons/default/icons'

// 图标
import './langs/zh-Hans' // 语言（非必须，默认英文，下载地址: https://www.tiny.cloud/get-tiny/language-packages）

app.use(MiniMCE, {
  // 全局 props & attrs (单向数据流)
  options: {
    language: 'zh-Hans',
  },
})
```

#### CDN + ESM

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <!-- 皮肤 -->
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/tinymce/skins/ui/oxide/skin.min.css"
  >
</head>

<body>
  <div id="app">
    <minimce :options="options"></minimce>
  </div>
  <script type="importmap">
    {
      "imports": {
        "vue": "https://cdn.jsdelivr.net/npm/vue/dist/vue.esm-browser.prod.js",
        "vue-demi": "https://cdn.jsdelivr.net/npm/vue-demi/lib/v3/index.mjs",
        "tinymce": "https://cdn.jsdelivr.net/npm/tinymce",
        "minimce": "https://cdn.jsdelivr.net/npm/minimce@0.9/dist/minimce.mjs"
      }
    }
  </script>
  <script type="module">
    import { createApp } from 'vue'
    import MiniMCE from 'minimce'

    createApp({
      setup: () => ({
        options: {
          // 主题
          theme_url: 'https://cdn.jsdelivr.net/npm/tinymce/themes/silver/theme',
          // 图标
          icons_url: 'https://cdn.jsdelivr.net/npm/tinymce/icons/default/icons',
          // 语言（非必须，默认英文，下载地址: https://www.tiny.cloud/get-tiny/language-packages）
          // language_url: 'https://xxx',
        },
      }),
    }).component('minimce', MiniMCE)
      .mount('#app')
  </script>
</body>

</html>
```

#### CDN + IIFE

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <!-- 皮肤 -->
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/tinymce/skins/ui/oxide/skin.min.css"
  >
</head>

<body>
  <div id="app">
    <minimce :options="options"></minimce>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue"></script>
  <script src="https://cdn.jsdelivr.net/npm/vue-demi"></script>
  <script src="https://cdn.jsdelivr.net/npm/tinymce"></script>
  <script src="https://cdn.jsdelivr.net/npm/minimce@0.9/dist/minimce.umd.js"></script>
  <script>
    const { createApp } = Vue

    createApp({
      setup: () => ({
        options: {
          // 主题
          theme_url: 'https://cdn.jsdelivr.net/npm/tinymce/themes/silver/theme',
          // 图标
          icons_url: 'https://cdn.jsdelivr.net/npm/tinymce/icons/default/icons',
          // 语言（非必须，默认英文，下载地址: https://www.tiny.cloud/get-tiny/language-packages）
          // language_url: 'https://xxx',
        },
      }),
    }).component('minimce', MiniMCE)
      .mount('#app')
  </script>
</body>

</html>
```

<br>

### Vue 2.7

```shell
npm i minimce tinymce
```

#### 局部注册

```vue
<script setup>
import MiniMCE from 'minimce'

// 在组件外部引入静态资源的目的是方便用户对其进行更换
import 'tinymce/skins/ui/oxide/skin.min.css'

// 皮肤
import 'tinymce/themes/silver/theme'

// 主题
import 'tinymce/icons/default/icons'

// 图标
import './langs/zh-Hans' // 语言（非必须，默认英文，下载地址: https://www.tiny.cloud/get-tiny/language-packages）
</script>

<template>
  <MiniMCE
    :options="{
      language: 'zh-Hans',
    }"
  />
</template>
```

#### 全局注册

```ts
import MiniMCE from 'minimce'

// 在组件外部引入静态资源的目的是方便用户对其进行更换
import 'tinymce/skins/ui/oxide/skin.min.css'

// 皮肤
import 'tinymce/themes/silver/theme'

// 主题
import 'tinymce/icons/default/icons'

// 图标
import './langs/zh-Hans' // 语言（非必须，默认英文，下载地址: https://www.tiny.cloud/get-tiny/language-packages）

Vue.use(MiniMCE, {
  // 全局 props & attrs (单向数据流)
  options: {
    language: 'zh-Hans',
  },
})
```

#### CDN + ESM

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <!-- 皮肤 -->
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/tinymce/skins/ui/oxide/skin.min.css"
  >
</head>

<body>
  <div id="app">
    <minimce :options="options"></minimce>
  </div>
  <script type="importmap">
    {
      "imports": {
        "vue": "https://cdn.jsdelivr.net/npm/vue@2/dist/vue.esm.browser.min.js",
        "vue-demi": "https://cdn.jsdelivr.net/npm/vue-demi/lib/v2.7/index.mjs",
        "tinymce": "https://cdn.jsdelivr.net/npm/tinymce",
        "minimce": "https://cdn.jsdelivr.net/npm/minimce@0.9/dist/minimce.mjs"
      }
    }
  </script>
  <script type="module">
    import Vue from 'vue'
    import MiniMCE from 'minimce'

    new Vue({
      components: { minimce: MiniMCE },
      data() {
        return {
          options: {
            // 主题
            theme_url: 'https://cdn.jsdelivr.net/npm/tinymce/themes/silver/theme',
            // 图标
            icons_url: 'https://cdn.jsdelivr.net/npm/tinymce/icons/default/icons',
            // 语言（非必须，默认英文，下载地址: https://www.tiny.cloud/get-tiny/language-packages）
            // language_url: 'https://xxx',
          },
        }
      },
    }).$mount('#app')
  </script>
</body>

</html>
```

#### CDN + IIFE

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <!-- 皮肤 -->
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/tinymce/skins/ui/oxide/skin.min.css"
  >
</head>

<body>
  <div id="app">
    <minimce :options="options"></minimce>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
  <script src="https://cdn.jsdelivr.net/npm/vue-demi"></script>
  <script src="https://cdn.jsdelivr.net/npm/tinymce"></script>
  <script src="https://cdn.jsdelivr.net/npm/minimce@0.9/dist/minimce.umd.js"></script>
  <script>
    new Vue({
      components: { minimce: MiniMCE },
      data() {
        return {
          options: {
            // 主题
            theme_url: 'https://cdn.jsdelivr.net/npm/tinymce/themes/silver/theme',
            // 图标
            icons_url: 'https://cdn.jsdelivr.net/npm/tinymce/icons/default/icons',
            // 语言（非必须，默认英文，下载地址: https://www.tiny.cloud/get-tiny/language-packages）
            // language_url: 'https://xxx',
          },
        }
      },
    }).$mount('#app')
  </script>
</body>

</html>
```

<br>

### Vue 2.6 或更早版本

```shell
npm i minimce tinymce @vue/composition-api
```

#### 局部注册

```vue
<script>
import VCA from '@vue/composition-api'
import MiniMCE from 'minimce'

// 在组件外部引入静态资源的目的是方便用户对其进行更换
import 'tinymce/skins/ui/oxide/skin.min.css'

// 皮肤
import 'tinymce/themes/silver/theme'

// 主题
import 'tinymce/icons/default/icons'

// 图标
import './langs/zh-Hans' // 语言（非必须，默认英文，下载地址: https://www.tiny.cloud/get-tiny/language-packages）

Vue.use(VCA)

export default {
  components: { MiniMCE },
}
</script>

<template>
  <MiniMCE
    :options="{
      language: 'zh-Hans',
    }"
  />
</template>
```

#### 全局注册

```ts
import VCA from '@vue/composition-api'
import MiniMCE from 'minimce'

// 在组件外部引入静态资源的目的是方便用户对其进行更换
import 'tinymce/skins/ui/oxide/skin.min.css'

// 皮肤
import 'tinymce/themes/silver/theme'

// 主题
import 'tinymce/icons/default/icons'

// 图标
import './langs/zh-Hans' // 语言（非必须，默认英文，下载地址: https://www.tiny.cloud/get-tiny/language-packages）

Vue.use(VCA)

Vue.use(MiniMCE, {
  // 全局 props & attrs (单向数据流)
  options: {
    language: 'zh-Hans',
  },
})
```

#### CDN + ESM

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <!-- 皮肤 -->
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/tinymce/skins/ui/oxide/skin.min.css"
  >
</head>

<body>
  <div id="app">
    <minimce :options="options"></minimce>
  </div>
  <script>
    window.process = { env: { NODE_ENV: 'production' } }
  </script>
  <script type="importmap">
    {
      "imports": {
        "vue": "https://cdn.jsdelivr.net/npm/vue@2.6/dist/vue.esm.browser.min.js",
        "@vue/composition-api": "https://cdn.jsdelivr.net/npm/@vue/composition-api/dist/vue-composition-api.mjs",
        "@vue/composition-api/dist/vue-composition-api.mjs": "https://cdn.jsdelivr.net/npm/@vue/composition-api/dist/vue-composition-api.mjs",
        "vue-demi": "https://cdn.jsdelivr.net/npm/vue-demi/lib/v2/index.mjs",
        "tinymce": "https://cdn.jsdelivr.net/npm/tinymce",
        "minimce": "https://cdn.jsdelivr.net/npm/minimce@0.9/dist/minimce.mjs"
      }
    }
  </script>
  <script type="module">
    import { createApp } from '@vue/composition-api'
    import MiniMCE from 'minimce'

    const app = createApp({
      setup: () => ({
        options: {
          // 主题
          theme_url: 'https://cdn.jsdelivr.net/npm/tinymce/themes/silver/theme',
          // 图标
          icons_url: 'https://cdn.jsdelivr.net/npm/tinymce/icons/default/icons',
          // 语言（非必须，默认英文，下载地址: https://www.tiny.cloud/get-tiny/language-packages）
          // language_url: 'https://xxx',
        },
      }),
    })

    app.component('minimce', MiniMCE)
    app.mount('#app')
  </script>
</body>

</html>
```

#### CDN + IIFE

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <!-- 皮肤 -->
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/tinymce/skins/ui/oxide/skin.min.css"
  >
</head>

<body>
  <div id="app">
    <minimce :options="options"></minimce>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue@2.6"></script>
  <script src="https://cdn.jsdelivr.net/npm/@vue/composition-api"></script>
  <script src="https://cdn.jsdelivr.net/npm/vue-demi"></script>
  <script src="https://cdn.jsdelivr.net/npm/tinymce"></script>
  <script src="https://cdn.jsdelivr.net/npm/minimce@0.9/dist/minimce.umd.js"></script>
  <script>
    const { createApp } = VueCompositionAPI

    const app = createApp({
      setup: () => ({
        options: {
          // 主题
          theme_url: 'https://cdn.jsdelivr.net/npm/tinymce/themes/silver/theme',
          // 图标
          icons_url: 'https://cdn.jsdelivr.net/npm/tinymce/icons/default/icons',
          // 语言（非必须，默认英文，下载地址: https://www.tiny.cloud/get-tiny/language-packages）
          // language_url: 'https://xxx',
        },
      }),
    })

    app.component('minimce', MiniMCE)
    app.mount('#app')
  </script>
</body>

</html>
```

<br>

### Nuxt 3

```shell
npm i minimce tinymce
```

#### 局部注册

```vue
<!-- ~/components/MiniMCE.client.vue -->

<script setup>
import MiniMCE from 'minimce'

const attrs = useAttrs()
</script>

<template>
  <MiniMCE v-bind="attrs" />
</template>
```

```vue
<script setup>
const value = ref()
</script>

<template>
  <client-only>
    <MiniMCE
      v-model="value"
      v-bind="{/* 局部 props & attrs */}"
    />
  </client-only>
</template>
```

#### 全局注册

```ts
// ~/plugins/MiniMCE.client.ts

import MiniMCE from 'minimce'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MiniMCE, {
    // 全局 props & attrs（单向数据流）
  })
})
```

```vue
<script setup>
const value = ref()
</script>

<template>
  <client-only>
    <MiniMCE v-model="value" />
  </client-only>
</template>
```

<br>

### Nuxt 2 + Vue 2.7

```shell
npm i minimce tinymce
```

#### 局部注册

```ts
// nuxt.config.js

export default {
  build: {
    extend(config) {
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      })
    },
  },
}
```

```vue
<script setup>
import { ref } from 'vue'

function MiniMCE() {
  return process.client
    ? import('minimce')
    : Promise.resolve({ render: h => h('div') })
}

const value = ref()
</script>

<template>
  <client-only>
    <MiniMCE
      v-model="value"
      v-bind="{/* 局部 props & attrs */}"
    />
  </client-only>
</template>
```

#### 全局注册

```ts
// nuxt.config.js

export default {
  plugins: ['~/plugins/MiniMCE.client'],
  build: {
    extend(config) {
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      })
    },
  },
}
```

```ts
// ~/plugins/MiniMCE.client.js

import Vue from 'vue'
import MiniMCE from 'minimce'

Vue.use(MiniMCE, {
  // 全局 props & attrs（单向数据流）
})
```

```vue
<script setup>
import { ref } from 'vue'

const value = ref()
</script>

<template>
  <client-only>
    <MiniMCE v-model="value" />
  </client-only>
</template>
```

<br>

### Nuxt 2 + Vue 2.6 或更早版本

```shell
npm i minimce tinymce @vue/composition-api
```

#### 局部注册

```ts
// nuxt.config.js

export default {
  build: {
    extend(config) {
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      })
    },
  },
}
```

```vue
<script>
import Vue from 'vue'
import VCA from '@vue/composition-api'

Vue.use(VCA)

export default {
  components: {
    MiniMCE: () => process.client
      ? import('minimce')
      : Promise.resolve({ render: h => h('div') }),
  },
  data() {
    return {
      value: undefined,
    }
  },
}
</script>

<template>
  <client-only>
    <MiniMCE
      v-model="value"
      v-bind="{/* 局部 props & attrs */}"
    />
  </client-only>
</template>
```

#### 全局注册

```ts
// nuxt.config.js

export default {
  plugins: ['~/plugins/MiniMCE.client'],
  build: {
    extend(config) {
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      })
    },
  },
}
```

```ts
// ~/plugins/MiniMCE.client.js

import Vue from 'vue'
import VCA from '@vue/composition-api'
import MiniMCE from 'minimce'

Vue.use(VCA)
Vue.use(MiniMCE, {
  // 全局 props & attrs（单向数据流）
})
```

```vue
<script>
export default {
  data() {
    return {
      value: undefined,
    }
  },
}
</script>

<template>
  <client-only>
    <MiniMCE v-model="value" />
  </client-only>
</template>
```

<br>

## 属性

| 名称                                            | 说明                                                   | 类型    | 默认值                                                                         |
|-------------------------------------------------|------------------------------------------------------|---------|--------------------------------------------------------------------------------|
| modelValue (Vue 3) /<br>value (Vue 2) / v-model | 绑定值                                                 | string  |                                                                                |
| disabled                                        | 禁用状态                                               | boolean | `false`                                                                        |
| outputFormat                                    | 输出格式，`'html'` 或 `'text'`                          | string  | `'html'`                                                                       |
| options                                         | [TinyMCE 配置](https://www.tiny.cloud/docs/tinymce/6/) | object  | [查看代码](https://github.com/cloydlau/minimce/blob/main/src/Component.ts#L93) |

<br>

## 外部属性

| 名称 | 说明    | 类型   |
|------|-------|--------|
| id   | 元素 ID | string |

<br>

## 获取 [TinyMCE Editor](https://www.tiny.cloud/docs/tinymce/6/apis/tinymce.editor/) 实例

```vue
<!-- 示例: 监听 TinyMCE 的事件 -->

<script setup>
import { reactive, ref } from 'vue'
import tinymce from 'tinymce/tinymce'

const miniMCERef = ref()
const options = reactive({
  setup(editor) {
    // 方式1
    editor.on('init', (e) => {
      console.log('init', e)

      // 方式2
      tinymce.get(miniMCERef.value.id).on('Change', (e) => {
        console.log('Change', e)
      })

      // 方式3
      tinymce.activeEditor.on('Change', (e) => {
        console.log('Change', e)
      })
    })
  },
  // 方式4
  init_instance_callback(editor) {
    editor.on('Change', (e) => {
      console.log('Change', e)
    })
  },
})
</script>

<template>
  <MiniMCE
    ref="miniMCERef"
    :options="options"
  />
</template>
```

<br>

## 显隐控制

请使用 `v-if` 控制显隐。

由于实际的富文本元素并没有挂载在 `options.selector` 上面，所以使用 `v-show` 切换显隐会有问题。

<br>

## 内容样式

富文本的内容样式建议在展示侧自行添加，而不是在富文本的生产侧添加，因为：

1. 富文本的生产侧无法满足展示侧各自的定制化需求
2. 展示侧可能包含小程序，小程序不支持 `style` 标签

<br>

<a name="域名检测"></a>

## 域名检测

TinyMCE 有四种价格计划：

- Core (免费)
- Essential
- Professional
- Flexible

如果没有注册 Tiny 账号、或者没有在账号设置中登记域名，界面上会有警告弹出 (**即使你使用的是免费的 Core 计划**)

> 当然，你可以用 CSS 来屏蔽弹窗，只是不推荐这种方式

TinyMCE 提供了两种加载方式：

- CDN (tinymce-vue 采用的方式)：需要注册账号以提供 `api-key`，并在账号设置中登记所有用到 TinyMCE 的项目域名
- NPM (MiniMCE 采用的方式)：没有 `api-key` 参数，所以不需要注册账号、不需要登记域名，参考 [Tiny 官方解释](https://stackoverflow.com/questions/63398432/how-to-use-tinymce-5-api-key-using-npm)

<br>

## 插件示例

### 插入 Word 文档 (`.docx`)，兼容 Microsoft Office、WPS

- [Vue 3](https://github.com/cloydlau/minimce/blob/main/demo/vue3/plugins/insert-word.ts)
- [Vue 2](https://github.com/cloydlau/minimce/blob/main/demo/vue2/plugins/insert-word.ts)

### 插入本地图片

- [Vue 2](https://github.com/cloydlau/minimce/blob/main/demo/vue2/plugins/InsertImage)

### 插入本地视频

- [Vue 2](https://github.com/cloydlau/minimce/blob/main/demo/vue2/plugins/InsertFile)

### 插入本地音频

- [Vue 2](https://github.com/cloydlau/minimce/blob/main/demo/vue2/plugins/InsertFile)

### 插入电话链接

- [Vue 3](https://github.com/cloydlau/minimce/blob/main/demo/vue3/plugins/InsertTel)
- [Vue 2](https://github.com/cloydlau/minimce/blob/main/demo/vue2/plugins/InsertTel)

### 插入小程序页面链接

- [Vue 3](https://github.com/cloydlau/minimce/blob/main/demo/vue3/plugins/InsertMiniProgramPageLink)
- [Vue 2](https://github.com/cloydlau/minimce/blob/main/demo/vue2/plugins/InsertMiniProgramPageLink)

<br>

## 粘贴 Word 文档

TinyMCE 提供了 premium 插件 PowerPaste，可用于粘贴 Word 文档，但兼容性一般，尤其是不支持 WPS

MiniMCE 提供了插入 Word 文档的插件示例，兼容 Microsoft Office、WPS，可在一定程度上替代 PowerPaste

注意：粘贴可以片段粘贴，插入只能整个文档插入

### PowerPaste 插件

```ts
// PowerPaste 配置示例

import MiniMCE from 'minimce'
import axios from 'axios'
import createAxiosShortcut from 'axios-shortcut'

const { POST } = createAxiosShortcut(axios)

app.use(MiniMCE, {
  options: {
    images_upload_handler(blobInfo, success, failure) {
      const blob = blobInfo.blob()
      const file = new File(
        [blob],
        blobInfo.filename(),
        { type: blob.type }
      )

      POST.upload(process.env.VUE_APP_UPLOAD_API, {
        file
      }).then((res) => {
        if (typeof res.data?.data === 'string') {
          success(res.data.data)
        } else {
          failure(res.data?.message)
        }

      }).catch((err) => {
        failure(String(err))
      })
    },
  }
})
```

- 兼容性
  ![PowerPaste 插件兼容性](https://raw.githubusercontent.com/cloydlau/minimce/main/powerpaste-compatibility.png)

- 受浏览器限制，PowerPaste 插件**无法支持微软 Word 和 Excel 文档所支持的<font color="#dd0000">所有</font>图片类型**
  。举个例子，浏览器禁止以编程方式访问文件系统，所以无法解析文档中使用 `file://` 协议的图片 (WPS 使用的就是此协议)。

- 粘贴微软 Word 文档 (Windows 系统、≥ 2013 版本) 中<font color="#dd0000">受保护视图</font>的内容，将仅得到**无格式的普通文本**，这是受保护视图与剪贴板的交互机制决定的。

- 受微软 Excel 网页版限制，粘贴<font color="#dd0000">微软 Excel 网页版</font>的内容将仅得到**无格式的普通文本**。

<br>

## 粘贴网页内容 (HTML)

### 格式

粘贴的网页内容默认会保留一定的源格式，启用 PowerPaste
插件后，对格式的处理将会更加完善。详见 [Improved HTML Cleaning](https://www.tiny.cloud/docs/tinymce/6/powerpaste-support/#improved-html-cleaning)

如需获取纯文本，选中**编辑**-**粘贴为文本**再进行粘贴

**清除格式**按钮得到的<font color="#dd0000">不是</font>纯文本，可以自定义清除效果：
[Removing a format](https://www.tiny.cloud/docs/tinymce/6/content-formatting/#removing-a-format)

<br>

### 图片

如果用户复制第三方网站的内容到编辑框内，静态资源 (如图片) 可能无法正常显示，这是因为：

1. 第三方网站没有开启静态资源的跨域访问

2. 第三方网站对静态资源做了 Referer 校验

TinyMCE 的 `urlconverter_callback`、`paste_postprocess` API 不支持异步操作，所以批量转存图片可行性低

技术上是可以解决的，可以通过 NGINX 动态代理配合这两个 API 来处理

请自行评估相关风险

<br>

## 更新日志

各版本详细改动请参考 [release notes](https://github.com/cloydlau/minimce/releases)

<br>
