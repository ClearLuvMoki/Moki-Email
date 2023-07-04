const {merge} = require("webpack-merge")
const {Configuration} = require("webpack")
const path = require("path");
const {rootPath, srcRenderPath, releaseRenderPath} = require("../common/webpack.path")
const {getConfig} = require("../../constant")
const CommonConfig = require("../common/webpack.common");
const {spawn} = require("child_process");

const dev = getConfig();

/**
 * @type {Configuration}
 */
const WebpackDev = {
    entry: {
        main: path.join(srcRenderPath, './index.tsx')
    },
    output: {
        path: path.resolve(releaseRenderPath),
        filename: 'js/[name].[contenthash:8].bundle.js',
        clean: true
    },
    mode: 'development',
    target: ['web', 'electron-renderer'],
    stats: 'errors-only',
    infrastructureLogging: {
        colors: true,
        level: 'error'
    },
    cache: {
        type: 'filesystem',
        cacheDirectory: path.resolve(rootPath, './node_modules/.cache/webpack')
    },
    devServer: {
        port: dev.env.port || 8080,
        client: {
            overlay: {
                errors: true
            }
        },
        setupMiddlewares(middlewares) {
            console.log('Starting Main builder...');
            spawn('npm', ['run', 'dev:main'], {
                shell: true,
                stdio: 'inherit'
            })
                .on('close', (code) => console.log(`Build Main close, code:${code}`))
                .on('error', (spawnError) =>
                    console.log(`Webpack --- Build Main err:${spawnError}`)
                );
            return middlewares;
        }
    },

}


module.exports = merge(CommonConfig, WebpackDev);