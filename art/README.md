# areweloongyet.com 设计稿

此处的内容是 areweloongyet.com / “咱龙了吗？”项目的设计稿。

由于时间以及手残等种种原因，本项目的最主要视觉元素——Logo 是一些现成内容的混搭。

*   龙头

    直接使用 Google 以 SIL OFL 1.1 许可证开源的 Noto Color Emoji 字型的[龙头字形](https://github.com/googlefonts/noto-emoji/blob/v2.038/svg/emoji\_u1f432.svg)。字形矢量图的许可为 Apache 2.0。

*   小龙头

    同上，来自 Noto Color Emoji 的[蛇的字形](https://github.com/googlefonts/noto-emoji/blob/v2020-09-16-unicode13_1/svg/emoji_u1f40d.svg)。

*   墨镜（Thug Life glasses）

    按照最常见的像素风 Thug Life glasses meme 自行绘制。

*   标题中文字型（包括但不限于 Logo 中的“咱龙了吗？”字样）

    使用 atelierAnchor/锚坞 以 SIL OFL 1.1 许可证开源的[得意黑](https://github.com/atelier-anchor/smiley-sans)字型。

*   标题西文字型（包括但不限于 Logo 中的“AREWELOONGYET? by the Loongson Community”字样）

    使用 Google 以 SIL OFL 1.1 许可证开源的 [Oswald 字型](https://github.com/googlefonts/OswaldFont)。

## 如何更新设计

用于构建站点的图片资源最终都来自此处的设计稿。

* `logo.svg` 中的 `for-repo-readme` 图层是 `cn-and-en` 图层的内容置于一个整像素宽高的矩形上，再居中排布的结果。
* `logo-readme.svg` 是 `logo.svg` 的 `for-repo-readme` 图层粘贴过来再去掉那个底部矩形的结果。
* `logo-readme.png` 是 `logo-readme.svg` 用 Inkscape 导出后 `pngcrush` 的结果。
* `logo-site.svg` 是将 `logo.svg` 的 `chinese` 图层的内容挪到 32x144 画布另存为的结果。
* `logo-site-en.svg` 是将 `logo.svg` 的 `english title` 图层的内容挪到 32x252 画布另存为的结果。
* `static/img/logo.svg` 是在 Inkscape 中另存 `logo-site.svg` 为优化的 SVG 的结果。
* `static/img/logo.svg` 是在 Inkscape 中另存 `logo-site-en.svg` 为优化的 SVG 的结果。
* `static/img/favicon.ico` 是在 Gimp 将 `favicon.xcf` 先合并为单个图层再保存为 Windows ICO 格式的结果。
