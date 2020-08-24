# minimce / 富文本编辑器 tinymce封装


### Feature

- √ 无缝集成imgpond/filepool 支持本地图片/本地音频/本地视频上传
- √ 支持获取前n个字符作为缩略简介（html转普通文本） n值可配置
- √ 全局安装/单独引入 通用参数支持全局配置

### Installation
![NPM](https://nodei.co/npm/minimce.png)
``` bash
$ yarn add minimce
```

**Dependencies**：vue element-ui plain-kit imgpond filepool

<hr/>

```js
import { Minimce } from 'minimce'
components: { Minimce }
```

**Globally:**
```js
import Minimce from 'minimce'
Vue.use(Minimce)
```

### Quick Start

*请将/public/tinymce-static文件夹拷贝至项目中/public文件夹下

```html
<Minimce v-model=""/>
```

| 参数 | 说明 | 配置方式 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| value / v-model | 双绑 | props | String | | |
| apiKey | tinymce api key | 全局，props | String | | |
| html2text | 是否开启html转普通文本功能 | 全局，props | Boolean | | false |
| text | value对应的普通文本（仅在html2text为true时有效） | props | String | | |
| textMaxlength | 普通文本取自前多少个字符（设置为Infinity则不设上限） | 全局，props | Number |  | |
| Imgpond | 上传图片插件（配置组件后自动开启功能） | 全局 | Vue Component | | |
| Filepool | 上传文件插件（配置组件后自动开启功能） | 全局 | Vue Component | | |
| audioMenuItem | 是否显示音频上传按钮（仅在配置了Filepool时有效） | 全局，props | Boolean | | true |
| MobileLink | 插入移动端页面链接插件（配置组件后自动开启功能） | 全局 | Vue Component | | |

Imgpond:

> 如果觉得tinymce自带的图片上传功能不够完善 可拓展Imgpond进行使用

```js
import Imgpond from 'imgpond'
Vue.use(Imgpond)

import Minimce from 'minimce'
Vue.use(Minimce, {
  Imgpond: Imgpond.Imgpond //默认导出的是普通对象 Imgpond.Imgpond才是组件本身
})
```

Filepool:

> 如果觉得tinymce自带的文件上传功能不够完善 可拓展Filepool进行使用

```js
import Filepool from 'filepool'
Vue.use(Filepool)

import Minimce from 'minimce'
Vue.use(Minimce, {
  Filepool: Filepool.Filepool //默认导出的是普通对象 Filepool.Filepool才是组件本身
})
```

MobileLink:

> tinymce的插入链接功能只能插入普通链接 如果需要定制化需求 比如想要插入的链接是移动端某个页面的链接 可以自定义一个组件

```js
import MobileLink from '@/components/MobileLink'

import Minimce from 'minimce'
Vue.use(Minimce, {
  MobileLink
})
```

