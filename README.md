# minimce / 富文本编辑器 tinymce封装


### Feature

- √ 无缝集成imgpond/filepool 支持本地图片/本地音频/本地视频上传
- √ 支持获取前n个字符作为缩略简介（html转普通文本） n值可配置
- √ 全局安装/单独引入 通用参数支持全局配置


### Installation
![NPM](https://nodei.co/npm/minimce.png)
```
yarn add minimce
依赖项：vue element-ui plain-kit imgpond filepool

全局引入：
import Minimce from 'minimce'
Vue.use(Minimce)

局部引入：
import Minimce from 'minimce'
components: { Minimce }
```


### Quick Start
```
请参考/demo中极简示例
请将/public/tinymce-static文件夹拷贝至项目中/public文件夹下
```
