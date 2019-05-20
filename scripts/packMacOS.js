const packager = require('electron-packager');
const { resolve } = require('path');
const { electronVersion } = require('electron');
const pkg = require('../package.json');

(async () => {
  const appPaths = await packager({
    dir: resolve(__dirname, '../dist/'),
    platform: 'darwin',
    arch: 'x64',
    electronVersion,
    overwrite: true,
    asar: true,
    prune: true,
    ignore: [
      'node_modules/.bin',
      '.git',
      'node_modules/electron-*',
      'packages/*',
    ],
    out: resolve(__dirname, '../release/'),
    appVersion: pkg.version,
  });
  console.log(appPaths);
})();
