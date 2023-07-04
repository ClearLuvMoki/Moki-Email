const {ModuleOptions} = require("webpack")


const assetsRegex = /\.(jpe?g|png|gif|pdf|svg)$/;
const jsRegex = /\.[jt]sx?$/;

/**
 * @type {ModuleOptions}
 */
const Module = {
    rules: [
        {
            test: jsRegex,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'ts-loader',
                    options: {
                        happyPackMode: true,
                        transpileOnly: true,
                    },
                },
            ],
        },
        {
            test: assetsRegex,
            type: 'javascript/auto',
            loader: 'file-loader',
            options: {
                esModule: false,
                loader: 'url-loader',
                name: 'assets/[name].[ext]',
                options: {
                    limit: 10240,
                },
            },
        },
    ]
}

module.exports = Module;

