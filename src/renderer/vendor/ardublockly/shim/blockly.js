require("expose-loader?goog!./blockly_compressed.goog.js");

module.exports = require('imports-loader?Blockly=../../../shim/blocks_compressed,goog=../../../shim/blockly_compressed.goog!exports-loader?Blockly!../blockly/msg/js/zh-hans');
