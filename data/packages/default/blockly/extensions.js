'use strict';

Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.configs = {};

Blockly.Blocks.extensions.updateConfigs = function(configs) {
    Blockly.Blocks.extensions.configs = configs;
}

Blockly.Blocks.extensions.getConfig = function(type, name) {
    var configs = Blockly.Blocks.extensions.configs[type];
    var config = configs.find(function(c){return c.name === name;});
    return config.property;
}

Blockly.Blocks.extensions.getConfig = function(type, name) {
    var configs = Blockly.Blocks.extensions.configs[type];
    var config = configs.find(function(c){return c.name === name;});
    return config.property;
}

Blockly.Blocks.extensions.genComponentOptions = function(type, defaultOptions) {
    var config = Blockly.Blocks.extensions.configs[type];
    return config && config.map(function(o) { return [o.name, o.name]; }) || defaultOptions;
}
