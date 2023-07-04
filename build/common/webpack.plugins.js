const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin")
const {WebpackPluginInstance} = require("webpack")
const WebpackBar = require("webpackbar")
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { rootPath } = require("./webpack.path")
const {getConfig} = require("../../constant")
const dev =getConfig();

/**
 * @type {WebpackPluginInstance}
 */
const Plugins = [
    new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
            messages: [`You application is running here http://localhost:${dev.env.port || 8080}`],
        },
        clearConsole: true,
    }),
    new WebpackBar({
        profile: true
    }),
    new HtmlWebpackPlugin({
        template: path.resolve(rootPath, './resources/index.html'),
        filename: 'index.html'
    }),
]

module.exports = Plugins

