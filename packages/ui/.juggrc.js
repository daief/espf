// 在 tsconfig.json 将 module 设置为 ESModule
// 并且该文件使用 ESModule 语法时，出现一系列错误，故改成 js 文件并使用 commonjs 规范
const { extendConfig } = require('@axew/jugg');

module.exports = extendConfig({
  tsCustomTransformers: {
    before: [
      [
        'ts-import-plugin',
        {
          libraryDirectory: 'lib',
          libraryName: 'antd',
          style: true,
        },
      ],
    ],
  },
  webpack: () => {
    return {
      target: 'electron-renderer',
      resolve: {
        alias: {
          '@ant-design/icons/lib/dist$': '@/antdIcon',
        },
      },
    };
  },
  css: {
    loaderOptions: {
      postcss: {
        // TODO hack, wait to fix
        plugins: [],
      },
    },
  },
});
