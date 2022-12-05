<h1 align="center">
  <a href="https://npmjs.com/package/minimce" target="_blank" rel="noopener noreferrer">
    MiniMCE <sup><img alt="version" src="https://versionbadg.es/cloydlau/minimce.svg"></sup>
  </a>
</h1>

<p align="center">
  富文本编辑器，可离线使用的 <a href="https://github.com/tinymce/tinymce">TinyMCE</a> Vue 2.6 / 2.7 / 3 封装，支持 Nuxt 2 / 3
</p>

<p align="center">
  <a href="https://bundlephobia.com/package/minimce"><img alt="minzipped size" src="https://img.shields.io/bundlephobia/minzip/minimce"></a>
  <a href="https://eslint.org"><img alt="code style" src="https://img.shields.io/badge/code_style-ESLint-4B32C3.svg?logo=eslint"></a>
  <a href="https://conventionalcommits.org"><img alt="conventional commits" src="https://img.shields.io/badge/commits-Conventional-FE5196.svg?logo=conventionalcommits&logoColor=white"></a>
  <a href="https://github.com/cloydlau/minimce#develop"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>
</p>

<br>

## 对比 tinymce-vue

是的，TinyMCE 已经有官方的 Vue 封装 [tinymce-vue](https://github.com/tinymce/tinymce-vue) 了，但它:

- 需要加载至少 **380kB** 的网络资源（开启插件全家桶将达到 **563kB**，还没算上付费插件），外网会很慢，甚至超时
- 有[域名检测](#域名检测)，会弹窗警告
- 用不同的版本号来适配不同的 Vue 版本，升级成本较高
- 默认功能最小化，需要繁杂的配置，还不支持全局传参

![tinymce-vue](https://raw.githubusercontent.com/cloydlau/minimce/main/tinymce-vue.png)

![minimce](https://raw.githubusercontent.com/cloydlau/minimce/main/minimce.png)

<br>

## 特性

- 基于 TinyMCE 6
- Vue 2.6 / 2.7 / 3 通用
- 支持 SSR，Nuxt 2 / 3 通用
- 支持微前端（比如 [wujie](https://github.com/Tencent/wujie)）
- 可离线使用，零网络延迟
- 无[域名检测](#域名检测)，无弹窗困扰
- 插件全家桶开箱即用
- 提供常用自定义插件示例
    - 插入 Word 文档（.docx），兼容 Microsoft Office、WPS
    - 插入本地图片
    - 插入本地视频
    - 插入本地音频
    - 插入电话链接
    - 插入小程序页面链接
- 支持浅色模式 & 深色模式，主题、图标、内容样式均可自定义
- 支持将 HTML 输出为普通文本
- 局部注册 + 局部传参，也可以全局注册 + 全局传参（[vue-global-config](https://github.com/cloydlau/vue-global-config) 提供技术支持）

<br>

## 安装

### 外置依赖

- `vue`
- `tinymce`
- `@vue/composition-api` 仅 Vue 2.6 或更早版本需要

<br>

### Vue 3

```shell
npm add minimce tinymce
```

#### 局部注册

```vue
<template>
  <MiniMCE
    :options="{
      language: 'zh-Hans',
    }"
  />
</template>

<script setup>
import MiniMCE from 'minimce'

// 在组件外部引入静态资源的目的是方便用户对其进行更换
import 'tinymce/skins/ui/oxide/skin.min.css' // 皮肤
import 'tinymce/themes/silver/theme' // 主题
import 'tinymce/icons/default/icons' // 图标
import './langs/zh-Hans' // 语言（非必须，默认英文，下载地址: https://www.tiny.cloud/get-tiny/language-packages）
</script>
```

#### 全局注册

```ts
import MiniMCE from 'minimce'

// 在组件外部引入静态资源的目的是方便用户对其进行更换
import 'tinymce/skins/ui/oxide/skin.min.css' // 皮肤
import 'tinymce/themes/silver/theme' // 主题
import 'tinymce/icons/default/icons' // 图标
import './langs/zh-Hans' // 语言（非必须，默认英文，下载地址: https://www.tiny.cloud/get-tiny/language-packages）

app.use(MiniMCE, {
  // 全局 props（单向数据流）
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
    href="https://unpkg.com/tinymce/skins/ui/oxide/skin.min.css"
  >
</head>

<body>
  <div id="app">
    <minimce :options="options"></minimce>
  </div>
  <script type="importmap">
    {
      "imports": {
        "vue": "https://unpkg.com/vue/dist/vue.esm-browser.prod.js",
        "vue-demi": "https://unpkg.com/vue-demi/lib/v3/index.mjs",
        "tinymce": "https://unpkg.com/tinymce",
        "minimce": "https://unpkg.com/minimce@0.7/dist/minimce.mjs"
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
          theme_url: 'https://unpkg.com/tinymce/themes/silver/theme',
          // 图标
          icons_url: 'https://unpkg.com/tinymce/icons/default/icons',
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

#### CDN + UMD

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <!-- 皮肤 -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/tinymce/skins/ui/oxide/skin.min.css"
  >
</head>

<body>
  <div id="app">
    <minimce :options="options"></minimce>
  </div>

  <script src="https://unpkg.com/vue"></script>
  <script src="https://unpkg.com/vue-demi"></script>
  <script src="https://unpkg.com/tinymce"></script>
  <script src="https://unpkg.com/minimce@0.7/dist/minimce.umd.js"></script>
  <script>
    const { createApp } = Vue

    createApp({
      setup: () => ({
        options: {
          // 主题
          theme_url: 'https://unpkg.com/tinymce/themes/silver/theme',
          // 图标
          icons_url: 'https://unpkg.com/tinymce/icons/default/icons',
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
npm add minimce tinymce
```

#### 局部注册

```vue
<template>
  <MiniMCE
    :options="{
      language: 'zh-Hans',
    }"
  />
</template>

<script setup>
import MiniMCE from 'minimce'

// 在组件外部引入静态资源的目的是方便用户对其进行更换
import 'tinymce/skins/ui/oxide/skin.min.css' // 皮肤
import 'tinymce/themes/silver/theme' // 主题
import 'tinymce/icons/default/icons' // 图标
import './langs/zh-Hans' // 语言（非必须，默认英文，下载地址: https://www.tiny.cloud/get-tiny/language-packages）
</script>
```

#### 全局注册

```ts
import MiniMCE from 'minimce'

// 在组件外部引入静态资源的目的是方便用户对其进行更换
import 'tinymce/skins/ui/oxide/skin.min.css' // 皮肤
import 'tinymce/themes/silver/theme' // 主题
import 'tinymce/icons/default/icons' // 图标
import './langs/zh-Hans' // 语言（非必须，默认英文，下载地址: https://www.tiny.cloud/get-tiny/language-packages）

Vue.use(MiniMCE, {
  // 全局 props（单向数据流）
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
    href="https://unpkg.com/tinymce/skins/ui/oxide/skin.min.css"
  >
</head>

<body>
  <div id="app">
    <minimce :options="options"></minimce>
  </div>
  <script type="importmap">
    {
      "imports": {
        "vue": "https://unpkg.com/vue@2/dist/vue.esm.browser.min.js",
        "vue-demi": "https://unpkg.com/vue-demi/lib/v2.7/index.mjs",
        "tinymce": "https://unpkg.com/tinymce",
        "minimce": "https://unpkg.com/minimce@0.7/dist/minimce.mjs"
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
            theme_url: 'https://unpkg.com/tinymce/themes/silver/theme',
            // 图标
            icons_url: 'https://unpkg.com/tinymce/icons/default/icons',
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

#### CDN + UMD

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <!-- 皮肤 -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/tinymce/skins/ui/oxide/skin.min.css"
  >
</head>

<body>
  <div id="app">
    <minimce :options="options"></minimce>
  </div>

  <script src="https://unpkg.com/vue@2"></script>
  <script src="https://unpkg.com/vue-demi"></script>
  <script src="https://unpkg.com/tinymce"></script>
  <script src="https://unpkg.com/minimce@0.7/dist/minimce.umd.js"></script>
  <script>
    new Vue({
      components: { minimce: MiniMCE },
      data() {
        return {
          options: {
            // 主题
            theme_url: 'https://unpkg.com/tinymce/themes/silver/theme',
            // 图标
            icons_url: 'https://unpkg.com/tinymce/icons/default/icons',
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
npm add minimce tinymce @vue/composition-api
```

#### 局部注册

```vue
<template>
  <MiniMCE
    :options="{
      language: 'zh-Hans',
    }"
  />
</template>

<script>
import VCA from '@vue/composition-api'
import MiniMCE from 'minimce'

// 在组件外部引入静态资源的目的是方便用户对其进行更换
import 'tinymce/skins/ui/oxide/skin.min.css' // 皮肤
import 'tinymce/themes/silver/theme' // 主题
import 'tinymce/icons/default/icons' // 图标
import './langs/zh-Hans' // 语言（非必须，默认英文，下载地址: https://www.tiny.cloud/get-tiny/language-packages）

Vue.use(VCA)

export default {
  components: { MiniMCE },
}
</script>
```

#### 全局注册

```ts
import VCA from '@vue/composition-api'
import MiniMCE from 'minimce'

// 在组件外部引入静态资源的目的是方便用户对其进行更换
import 'tinymce/skins/ui/oxide/skin.min.css' // 皮肤
import 'tinymce/themes/silver/theme' // 主题
import 'tinymce/icons/default/icons' // 图标
import './langs/zh-Hans' // 语言（非必须，默认英文，下载地址: https://www.tiny.cloud/get-tiny/language-packages）

Vue.use(VCA)

Vue.use(MiniMCE, {
  // 全局 props（单向数据流）
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
    href="https://unpkg.com/tinymce/skins/ui/oxide/skin.min.css"
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
        "vue": "https://unpkg.com/vue@2.6/dist/vue.esm.browser.min.js",
        "@vue/composition-api": "https://unpkg.com/@vue/composition-api/dist/vue-composition-api.mjs",
        "@vue/composition-api/dist/vue-composition-api.mjs": "https://unpkg.com/@vue/composition-api/dist/vue-composition-api.mjs",
        "vue-demi": "https://unpkg.com/vue-demi/lib/v2/index.mjs",
        "tinymce": "https://unpkg.com/tinymce",
        "minimce": "https://unpkg.com/minimce@0.7/dist/minimce.mjs"
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
          theme_url: 'https://unpkg.com/tinymce/themes/silver/theme',
          // 图标
          icons_url: 'https://unpkg.com/tinymce/icons/default/icons',
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

#### CDN + UMD

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <!-- 皮肤 -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/tinymce/skins/ui/oxide/skin.min.css"
  >
</head>

<body>
  <div id="app">
    <minimce :options="options"></minimce>
  </div>

  <script src="https://unpkg.com/vue@2.6"></script>
  <script src="https://unpkg.com/@vue/composition-api"></script>
  <script src="https://unpkg.com/vue-demi"></script>
  <script src="https://unpkg.com/tinymce"></script>
  <script src="https://unpkg.com/minimce@0.7/dist/minimce.umd.js"></script>
  <script>
    const { createApp } = VueCompositionAPI

    const app = createApp({
      setup: () => ({
        options: {
          // 主题
          theme_url: 'https://unpkg.com/tinymce/themes/silver/theme',
          // 图标
          icons_url: 'https://unpkg.com/tinymce/icons/default/icons',
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
npm add minimce tinymce
```

#### 局部注册

```vue
<!-- ~/components/MiniMCE.client.vue -->

<template>
  <MiniMCE v-bind="attrs" />
</template>

<script setup>
import MiniMCE from 'minimce'

const attrs = useAttrs()
</script>
```

```vue
<template>
  <client-only>
    <MiniMCE v-model="value" v-bind="{/* 局部 props & attrs */}" />
  </client-only>
</template>

<script setup>
const value = ref()
</script>
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
<template>
  <client-only>
    <MiniMCE v-model="value" />
  </client-only>
</template>

<script setup>
const value = ref()
</script>
```

<br>

### Nuxt 2 + Vue 2.7

```shell
npm add minimce tinymce
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
<template>
  <client-only>
    <MiniMCE v-model="value" v-bind="{/* 局部 props & attrs */}" />
  </client-only>
</template>

<script setup>
import { ref } from 'vue'

const MiniMCE = () => process.client
  ? import('minimce')
  : Promise.resolve({ render: h => h('div') })

const value = ref()
</script>
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
<template>
  <client-only>
    <MiniMCE v-model="value" />
  </client-only>
</template>

<script setup>
import { ref } from 'vue'

const value = ref()
</script>
```

<br>

### Nuxt 2 + Vue 2.6 或更早版本

```shell
npm add minimce tinymce @vue/composition-api
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
<template>
  <client-only>
    <MiniMCE v-model="value" v-bind="{/* 局部 props & attrs */}" />
  </client-only>
</template>

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
<template>
  <client-only>
    <MiniMCE v-model="value" />
  </client-only>
</template>

<script>
export default {
  data() {
    return {
      value: undefined,
    }
  },
}
</script>
```

<br>

## Props

| 名称         | 说明                                     | 类型    | 可选值                                             | 默认值                                                                            |
| ------------ | ---------------------------------------- | ------- | -------------------------------------------------- | --------------------------------------------------------------------------------- |
| v-model      | 绑定值                                   | string  |                                                    |                                                                                   |
| disabled     | 是否禁用（禁用模式不可编辑，保留工具栏） | boolean |                                                    | `false`                                                                           |
| outputFormat | 输出格式                                 | string  | `'html'` / `'text'`                                | `'html'`                                                                          |
| options      | TinyMCE 配置                             | object  | [官方文档](https://www.tiny.cloud/docs/tinymce/6/) | [查看代码](https://github.com/cloydlau/minimce/blob/main/src/Component.ts#L102) |

<br>

## Expose

| 名称 | 说明    | 类型   |
| ---- | ------- | ------ |
| id   | 元素 id | string |

<br>

## 事件

| 名称 | 说明                                                                                                                    | 参数                                                                 |
| ---- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| init | [init_instance_callback](https://www.tiny.cloud/docs/tinymce/6/editor-important-options/#init_instance_callback) 执行时 | [editor](https://www.tiny.cloud/docs/tinymce/6/apis/tinymce.editor/) |

<br>

## 获取 [TinyMCE Editor](https://www.tiny.cloud/docs/tinymce/6/apis/tinymce.editor/) 实例

### 只有一个实例时

```vue
<template>
  <MiniMCE ref="minimce" @init="onInit" />
</template>

<script setup>
import { ref } from 'vue'
import tinymce from 'tinymce/tinymce'

const minimce = ref()
function onInit(editor) {
  // 方式1
  console.log(editor)
  // 方式2
  console.log(tinymce.activeEditor)
  // 方式3
  console.log(tinymce.get((minimce.value.id)))
}
</script>
```

### 有多个实例时

```vue
<template>
  <MiniMCE ref="minimce1" @init="onInit1" />
  <MiniMCE ref="minimce2" @init="onInit2" />
</template>

<script setup>
import { ref } from 'vue'
import tinymce from 'tinymce/tinymce'

const minimce1 = ref()
function onInit1(editor) {
  // 方式1
  console.log(editor)
  // 方式2
  console.log(tinymce.get((minimce1.value.id)))
}

const minimce2 = ref()
function onInit2(editor) {
  // 方式1
  console.log(editor)
  // 方式2
  console.log(tinymce.get((minimce2.value.id)))
}
</script>
```

### 在全局配置中获取

```ts
app.use(MiniMCE, {
  options: {
    // 方式1
    setup(editor) {
      console.log(editor)
    },
    // 方式2
    init_instance_callback(editor) {
      console.log(editor)
    },
  },
})
```

<br>

<a name="域名检测"></a>

## 域名检测

TinyMCE 有四种价格计划: 

- Core（免费）
- Essential
- Professional
- Flexible

如果没有注册 Tiny 账号、或者没有在账号设置中登记域名，界面上会有警告弹出（**即使你使用的是免费的 Core 计划**）

> 当然，你可以用 CSS 来屏蔽弹窗，只是不推荐这种方式

TinyMCE 提供了两种加载方式: 

- CDN（tinymce-vue 采用的方式）: 需要注册账号以提供 `api-key`，并在账号设置中登记所有用到 TinyMCE 的项目域名
- NPM（minimce 采用的方式）: 没有 `api-key` 参数，所以不需要注册账号、不需要登记域名，参考 [Tiny 官方解释](https://stackoverflow.com/questions/63398432/how-to-use-tinymce-5-api-key-using-npm)

<br>

## 内容样式

富文本的内容样式建议在展示侧自行添加，而不是在富文本的生产侧添加，因为: 

1. 富文本的生产侧无法满足展示侧各自的定制化需求
2. 展示侧可能包含小程序，小程序不支持 `style` 标签

<br>

## 插件示例

### 插入 Word 文档（.docx），兼容 Microsoft Office、WPS

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

注意: 粘贴可以片段粘贴，插入只能整个文档插入

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
        if (typeof res.data?.data === 'string')
          success(res.data.data)

        else
          failure(res.data?.message)

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
  。举个例子，浏览器禁止以编程方式访问文件系统，所以无法解析文档中使用 `file://` 协议的图片（WPS 使用的就是此协议）。

- 粘贴微软 Word 文档（Windows 系统、≥ 2013 版本）中<font color="#dd0000">受保护视图</font>的内容，将仅得到**无格式的普通文本**，这是受保护视图与剪贴板的交互机制决定的。

- 受微软 Excel 网页版限制，粘贴<font color="#dd0000">微软 Excel 网页版</font>的内容将仅得到**无格式的普通文本**。

<br>

## 粘贴网页内容（HTML）

### 格式

粘贴的网页内容默认会保留一定的源格式， 启用 PowerPaste
插件后，对格式的处理将会更加完善。详见 [Improved HTML Cleaning](https://www.tiny.cloud/docs/tinymce/6/powerpaste-support/#improved-html-cleaning)

如需获取纯文本，选中**编辑**-**粘贴为文本**再进行粘贴

**清除格式**按钮得到的<font color="#dd0000">不是</font>纯文本，可以自定义清除效果: 
[Removing a format](https://www.tiny.cloud/docs/tinymce/6/content-formatting/#removing-a-format)

<br>

### 图片

如果用户复制第三方网站的内容到编辑框内，静态资源（如图片）可能无法正常显示，这是因为: 

1. 第三方网站没有开启静态资源的跨域访问

2. 第三方网站对静态资源做了 referrer 校验

TinyMCE 的 `urlconverter_callback`、`paste_postprocess` API 不支持异步操作，所以批量转存图片可行性低

技术上是可以解决的，可以通过 nginx 动态代理配合这两个 API 来处理

请自行评估相关风险

<br>

## 更新日志

各版本详细改动请参考 [release notes](https://github.com/cloydlau/minimce/releases) 。

<br>

## 开发

1. [安装 Deno](https://x.deno.js.cn/#%E5%AE%89%E8%A3%85%E6%9C%80%E6%96%B0%E7%89%88)

2. `npm add pnpm @cloydlau/scripts -g; pnpm i`

3. 启动

    - `pnpm dev3`
    - `pnpm dev2.7`
    - `pnpm dev2.6`

<br>
