const { extendConfig } = require('@axew/jugg');

module.exports = extendConfig({
  webpack: () => {
    return {
      target: 'electron-main',
      node: {
        __dirname: false,
        __filename: false,
      },
    };
  },
  html: false,
  filename: 'index',
  sourceMap: false,
});
