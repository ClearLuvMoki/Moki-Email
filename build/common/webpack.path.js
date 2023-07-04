const path = require("path")
// root path
const rootPath = path.join(__dirname, '../..');
// src path
const srcPath = path.join(rootPath, './src');
// main path
const srcMainPath = path.join(srcPath, './main');
// render path
const srcRenderPath = path.join(srcPath, './render');

const distPath = path.join(rootPath, './dist');
// output main
const releaseMainPath = path.join(distPath, './main');
// output render
const releaseRenderPath = path.join(distPath, './renderer');

// constant path
const constantPath = path.join(rootPath, './constant');

module.exports = {
    rootPath,
    srcPath,
    srcMainPath,
    srcRenderPath,
    constantPath,
    distPath,
    releaseMainPath,
    releaseRenderPath
}



