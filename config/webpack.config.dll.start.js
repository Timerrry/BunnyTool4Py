require('babel-register') ({
    presets: [ 'env' ]
})
module.exports = require("./webpack.config.renderer.dev.dll.js");
