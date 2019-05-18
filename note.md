### 安装 `electron` 很慢、`node install.js` 报错

切换 `electron` 为淘宝镜像源，在 `.npmrc` 中添加，

```bash
electron_mirror=https://npm.taobao.org/mirrors/electron/

# 顺便了解了下以下模块的镜像 url
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
phantomjs_cdnurl=http://npm.taobao.org/mirrors/phantomjs
```

实际上更改完后依旧安装多次才成功。

### electron hot reload

~~use [electron-reload](https://github.com/yan-foto/electron-reload).~~

结合 nodemon、ts-node 到达热更新重启的目的。

### 设置 tsconfig 中 module 为 esnext

在 `.juggrc.ts` 从 @axew/jugg 导入（使用 import）内容时，编辑器提示模块找不到且运行时报错。解决方式是使用 commonjs 规范，失去了 TS 的提示，暂且把配置文件改成了 js。
