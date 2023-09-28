# 第三方字体资源

目前本站会在构建时嵌入**得意黑**与 **Oswald** 两款字体资源。
这是考虑到：

* Oswald 字体可通过 Google Fonts 加载，但本站主要受众在中国大陆境内，到此服务的连接可能不稳定，当无法访问时将造成不可接受的页面加载延迟；
* 得意黑字体属于新生事物，目前尚未有大的字体 CDN 服务提供之；
* 作者孤陋寡闻，离开前端研发一线多年，不清楚中国大陆是否存在与 Google Fonts 对标的公益设施。

此处 vendor 的资源版本如下：

* 得意黑: https://github.com/atelier-anchor/smiley-sans/releases/tag/v1.1.1
* Oswald: https://github.com/googlefonts/OswaldFont/tree/5298dbd8f4478518940aa047b1f498225a87b9ed

## 得意黑字体的切片方式

[cn-fontsource](https://github.com/wc-ex/cn-fontsource) 项目提供了一种不错的提高字型加载性能的开箱即用方案。
然而[它生成的得意黑字体包](https://www.npmjs.com/package/cn-fontsource-smiley-sans-oblique-regular)不适合使用：

* 字体名多了「Oblique」，该是 Oblique 的地方却变成了 Regular
* 没有正确设置 `font-style: oblique` 以及得意黑的标志性 6&deg; slant，因此在与人工 slant 了这么多的 Oswald 配合起来之后，出现重复 slant 现象

又考虑到 JSDelivr 在国内访问速度不见得就快，因此我们只得自己打一遍包：

* `npm install --global @wcex/cn-fontsource`
* 由于该命令行工具行为不能配置，会强制上传到 npm，因此编辑它的 `index.js`，把后侧的上传部分代码注释掉（可参考它旁边的未 minified JS 文件来知道怎么改）
* 造一个临时目录，按照 cn-fontsource 项目 README 要求，随便写一个 `font.json5`
* 把正确版本的得意黑 OTF 文件放到这个目录下边
* `cn-fontsource .`
* 把生成的 `tmp` 目录下（仍有几层子目录）所有 `woff2` 文件和 `font.css` 拿出来，弃掉其他
* 编辑 `font.css`
    - 修复字体名：去掉 ` Oblique` 字样
    - 在所有行的 `font-family` 之后，`src` 之前，添加 `font-style: oblique 6deg;font-weight: 500;`
