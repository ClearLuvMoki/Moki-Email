const {Configuration} = require("webpack")
const Module = require("./webpack.module")
const {srcPath, srcRenderPath} = require("./webpack.path")
const Plugins = require("./webpack.plugins")
const path = require("path")

/**
 * @type {Configuration}
 */
const CommonConfig = {
    module: Module,
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 10000,
            minRemainingSize: 0,
            maxAsyncRequests: 30,
            maxInitialRequests: 4,
            automaticNameDelimiter: '~',
        },
        minimize: true,
    },
    resolve: {
        modules: [path.resolve(srcPath), '../node_modules'],
        alias: {
            '@/src': path.join(__dirname, '../../src/'),
            '@/resources': path.join(__dirname, '../../resources'),
            '@/constant': path.join(__dirname, '../../constant'),
            '@/components': path.join(srcRenderPath, './components'),
            '@/pages': path.join(srcRenderPath, './pages'),
            '@/layout': path.join(srcRenderPath, './layout'),
            '@/routers': path.join(srcRenderPath, './routers'),
        },
        extensions: ['.', '.js', '.jsx', '.ts', '.tsx', '.json', '.yaml'],
    },
    plugins: Plugins
}

module.exports = CommonConfig;