const fs = require("fs-extra")
const path = require("path")
const yaml = require("js-yaml")
const {constantPath} = require("../build/common/webpack.path")

const env = process.env.NODE_ENV || 'development';

const FILE_ENV_NAME = {
    development: 'dev',
    production: 'prod',
};

const getConfig = () => {
    const filePath = path.join(constantPath, `${FILE_ENV_NAME[env]}.yaml`);

    if (!fs.existsSync(filePath)) {
        throw new Error(`Can not find config file: ${filePath}`);
    }

    return yaml.load(fs.readFileSync(filePath, 'utf8'));
}

module.exports = {
    getConfig
}
