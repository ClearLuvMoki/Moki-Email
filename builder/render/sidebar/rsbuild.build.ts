import {defineConfig} from '@rsbuild/core';
import {pluginReact} from '@rsbuild/plugin-react';
import {join} from 'path';
import {releaseRenderPath, srcRenderPath} from '../../common/paths';
import CommonConfig from '../../common/rsbuild.common';


const Config = defineConfig({
    plugins: [pluginReact()],
    source: {
        entry: {
            index: join(srcRenderPath, "./sidebar-view", './index.tsx'),
        },
    },
    output: {
        assetPrefix: './',
        cleanDistPath: process.env.NODE_ENV === 'production',
        distPath: {
            root: join(releaseRenderPath, "./sidebar-view"),
        },
    },
});

module.exports = Object.assign(CommonConfig, Config);
