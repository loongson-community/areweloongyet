<div align="center">
  <img alt="咱龙了吗？AREWELOONGYET? by the Loongson Community" src="./art/logo-readme.png" height="150" />
  <p>一站式了解 LoongArch 的上游生态建设。</p>
</div>

[English](./README.en.md)

---

### 施工进度

* [x] 域名
* [x] 视觉设计
* [x] 基本结构
    - [x] 关键软件
    - [x] 发行版
    - [ ] 学习材料外链
    - [x] 交流社区外链
    - [x] 首页
    - [ ] 国际化
* [x] GHA 工作流
* [ ] 贡献者指南

### 许可证

本储存库中的内容以 [CC-BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可证授权。
您也可浏览[该许可证的本地副本](./LICENSE)。

### 本地开发

本站以 [Docusaurus 2](https://docusaurus.io/)，一款现代化的静态网站生成器构建。

```
$ yarn  # 如果需要的话，安装或升级依赖
$ yarn make-plugins  # 如果变更了 src/plugins/awly-data-plugin 的话
$ yarn start
```

此命令会启动本地开发服务器，并打开一个浏览器窗口。
大部分变更都会自动触发窗口更新，不用手工重启服务器。
