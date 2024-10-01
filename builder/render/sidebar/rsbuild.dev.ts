import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { join } from 'path';
import { srcRenderPath } from '../../common/paths';
import CommonConfig from '../../common/rsbuild.common';


const Config = defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: join(srcRenderPath, "./sidebar-view",'./index.tsx'),
    },
  },
  server: {
    port: 8087,
  },
});

module.exports = Object.assign(CommonConfig, Config);
