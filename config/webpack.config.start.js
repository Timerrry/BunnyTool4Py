require('babel-register') ({
    presets: [ 'env' ]
})

const commandLineArgs =  require("command-line-args")
const optionDefinitions = [
    { name: 'target', alias: "t", type: String, defaultValue: false },
    {name: 'env', alias: "e", type: String, defaultValue: false},
]

let args = commandLineArgs(optionDefinitions, {argv: process.argv.slice(1), partial: true}) //命令行参数
let {target, env} = args;
let module_name = "./webpack.config." + target + "." + env + ".js";
module.exports = require(module_name);
