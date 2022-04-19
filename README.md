# MiniMCE

## 特性

- 基于 [TinyMCE](https://github.com/tinymce/tinymce) v6.0（最新版）
- 可离线使用，无网络延迟
- 提供 Vue 2 & Vue 3 版本
- 提供常用插件示例
  - 插入 Word 文档（.docx），兼容 Microsoft Office、WPS
  - 插入本地图片
  - 插入本地视频
  - 插入本地音频
  - 插入电话链接
  - 插入小程序页面链接
- 适配 [element-plus](https://github.com/element-plus/element-plus) & [element-ui](https://github.com/ElemeFE/element)
  （只读状态默认跟随 `el-form`）
- 全局或局部引入，参数支持全局或局部配置（Powered by [vue-global-config](https://github.com/cloydlau/vue-global-config.git)）

<br>

## 安装

![NPM](https://nodei.co/npm/minimce.png)

```bash
npm add minimce
```

### 版本说明

Vue 3 请使用 `^0.3` 以上版本

Vue 2 请使用 `~0.2` 版本

### 全局引入

```ts

import 'minimce/dist/style.css'
import MiniMCE from 'minimce'

app.use(MiniMCE, {
  // 全局配置
})
```

### 局部引入

```vue

<template>
  <MiniMCE v-bind="{/* 局部配置 */}"/>
</template>

<script setup>
import 'minimce/dist/style.css'
import MiniMCE from 'minimce'
</script>
```

<br>

## 参数

| 名称              | 说明                       | 类型                                                                 | 可选值 | 默认值     |
|-----------------|--------------------------|--------------------------------------------------------------------| --- |---------|
| v-model / value | HTML 格式的绑定值              | string                                                             | |         |
| apiKey          | TinyMCE API key          | string                                                             | https://www.tiny.cloud/auth/signup/ |         |
| disabled        | 是否禁用（禁用模式不可编辑，保留工具栏）     | boolean                                                            | | `false` |
| readonly        | 是否只读（只读模式仅展示 HTML，相当于预览） | boolean                                                            | | `false` |
| init            | TinyMCE 配置               | object                                                             | https://www.tiny.cloud/docs/configure/ | https://github.com/cloydlau/minimce/blob/master/src/MiniMCE.ts        |
| ...             | `@tinymce/tinymce-vue` 配置               |                                                              | https://www.tiny.cloud/docs/integrations/vue/#configuringtheeditor |         |

<br>

## 参数配置规则

- 双向绑定参数（`v-model`）仅支持局部配置
- 其余参数均支持全局或局部配置

权重：

- 局部配置高于全局配置
- 对于对象类型的参数，局部配置会与全局配置进行合并，同名属性会被局部配置覆盖

<br>

## 内容样式

富文本的内容样式建议在展示侧自行添加，而不是在富文本的生产侧添加，因为：

1. 富文本的生产侧无法满足各展示侧的定制化需求
2. 展示侧可能包含小程序，小程序不支持 `style` 标签

默认内置样式：

> 可拷贝至富文本展示端使用

```
line-height: 1.8;
overflow: auto;

p {
  margin-block-end: 0;
  margin-block-start: 0;
}

img {
  max-width: 100%;
  height: auto !important;
  vertical-align: middle;
}
```

<br>

## 插件示例

- [插入 Word 文档（.docx），兼容 Microsoft Office、WPS](https://github.com/cloydlau/minimce/blob/master/vue3demo/plugins/insert-word.ts)
- [插入本地图片](https://github.com/cloydlau/minimce/blob/master/vue3demo/plugins/InsertImage)
- [插入本地视频](https://github.com/cloydlau/minimce/blob/master/vue3demo/plugins/InsertVideo)
- [插入本地音频](https://github.com/cloydlau/minimce/blob/master/vue3demo/plugins/InsertAudio)
- [插入电话链接](https://github.com/cloydlau/minimce/blob/master/vue3demo/plugins/InsertTel)
- [插入小程序页面链接](https://github.com/cloydlau/minimce/blob/master/vue3demo/plugins/InsertMiniProgramPageLink)

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
  init: {
    images_upload_handler (blobInfo, success, failure) {
      const blob = blobInfo.blob()
      const file = new File(
        [blob],
        blobInfo.filename(),
        { type: blob.type }
      )

      POST.upload(process.env.VUE_APP_UPLOAD_API, {
        file
      }).then(res => {
        if (typeof res.data?.data === 'string') {
          success(res.data.data)
        } else {
          failure(res.data?.message)
        }
      }).catch(err => {
        failure(String(err))
      })
    },
  }
})
```

- 兼容性
  ![PowerPaste 插件兼容性](./powerpaste-compatibility.png)

- 受浏览器限制，PowerPaste 插件**无法支持微软 Word 和 Excel 文档所支持的<font color="#dd0000">所有</font>图片类型**
  。举个例子，浏览器禁止以编程方式访问文件系统，所以无法解析文档中使用 `file://` 协议的图片（WPS 使用的就是此协议）。

- 粘贴微软 Word 文档（Windows 系统、≥ 2013 版本）中<font color="#dd0000">受保护视图</font>的内容，将仅得到**无格式的普通文本**，这是受保护视图与剪贴板的交互机制决定的。

- 受微软 Excel 网页版限制，粘贴<font color="#dd0000">微软 Excel 网页版</font>的内容将仅得到**无格式的普通文本**。

<br>

## 粘贴网页内容（HTML）

### 格式

粘贴的网页内容默认会保留一定的源格式， 启用 PowerPaste
插件后，对格式的处理将会更加完善。详见 https://www.tiny.cloud/docs/enterprise/system-requirements/#improvedhtmlcleaning

如需获取纯文本，选中**编辑**-**粘贴为文本**再进行粘贴

**清除格式**按钮得到的<font color="#dd0000">不是</font>纯文本，可以自定义清除效果：
https://www.tiny.cloud/docs/configure/content-formatting/#removingaformat

<br>

### 图片

如果用户复制第三方网站的内容到编辑框内，静态资源（如图片）可能无法正常显示，这是因为：

1. 第三方网站没有开启静态资源的跨域访问

2. 第三方网站对静态资源做了 referrer 校验

TinyMCE 的 `urlconverter_callback`、`paste_postprocess` API 不支持异步操作，所以批量转存图片可行性低

技术上是可以解决的，可以通过 nginx 动态代理配合这两个 API 来处理

请自行评估相关风险

<br>
