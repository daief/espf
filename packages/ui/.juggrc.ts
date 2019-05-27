import { extendConfig } from '@axew/jugg';
// @ts-ignore
import * as MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

export default extendConfig({
  outputDir: '../../dist/ui',
  sourceMap: false,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
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
      '@axew/jugg-plugin-react/lib/ts-rhl-transformer',
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
      plugins: [
        new MonacoWebpackPlugin({
          // TODO error if only  set these
          // languages: ['shell'],
          // features: ['comment', 'findController'],
        }),
      ],
    };
  },
  css: {
    loaderOptions: {
      postcss: false,
    },
  },
});
