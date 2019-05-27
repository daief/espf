import { extendConfig } from '@axew/jugg';
import * as CopyPlugin from 'copy-webpack-plugin';

export default extendConfig({
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
