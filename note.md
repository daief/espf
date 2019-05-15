### 安装 `electron` 很慢、`node install.js` 报错

切换 `electron` 为淘宝镜像源，在 `.npmrc` 中添加，

```bash
electron_mirror=https://npm.taobao.org/mirrors/electron/

# 顺便了解了下以下模块的镜像 url
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
phantomjs_cdnurl=http://npm.taobao.org/mirrors/phantomjs
```

### electron hot reload

use [electron-reload](https://github.com/yan-foto/electron-reload).