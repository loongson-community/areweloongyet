<div align="center">
  <img alt="咱龙了吗？AREWELOONGYET? by the Loongson Community" src="./art/logo-readme.png" height="150" />
  <p>Your one-stop portal for following LoongArch upstream work.</p>
</div>

[简体中文](./README.md)

---

## Construction Progress

* [x] Domain
* [x] Visual design
* [ ] Basic structure
    - [ ] Key software
    - [ ] Distros
    - [ ] Learning materials (external links)
    - [ ] Community (external links)
    - [ ] Homepage
    - [ ] I18n
* [x] GHA workflow
* [ ] Contributor guide

### License

Content inside this repo is licensed under the [CC-BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
A copy of the license is [available locally](./LICENSE) too.

### Local Development

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

```
$ yarn  # install/upgrade deps if needed
$ yarn make-plugins  # if src/plugins/awly-data-plugin is touched
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.
