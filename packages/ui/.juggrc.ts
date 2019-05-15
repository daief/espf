import { extendConfig } from '@axew/jugg';

export default extendConfig({
  webpack: () => {
    return {
      target: 'electron-renderer',
    };
  },
});
