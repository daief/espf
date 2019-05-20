const { extendConfig } = require('@axew/jugg');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = extendConfig({
  webpack: () => {
    return {
      target: 'electron-main',
      node: {
        __dirname: false,
        __filename: false,
      },
      plugins: [new CopyPlugin(['./package.json'])],
    };
  },
  html: false,
  filename: 'main',
  sourceMap: false,
});
