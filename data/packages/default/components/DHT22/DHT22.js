'use strict';
Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.DHT22_HUE = 210; // 模块颜色 0-360，或者 #abcdef

Blockly.Blocks.extensions.list_dht22 = function() {
  return Blockly.Blocks.extensions.genComponentOptions("dht22", [["DHT22温湿度传感器", "DHT22温湿度传感器"]]);
}

Blockly.Msg.ARD_EXT_DHT22_NAME = "读取";
Blockly.Msg.ARD_EXT_DHT22_READ = "的";
Blockly.Msg.ARD_EXT_DHT22_TEMPERATURE = "温湿度";
Blockly.Msg.ARD_EXT_DHT22_DISTANCE_DISTANCE = "温度";
Blockly.Msg.ARD_EXT_DHT22_DISTANCE_DISTANCE_AVG = "湿度";
Blockly.Msg.ARD_EXT_DHT22_DISTANCE_TIP = "DHT22温湿度传感器";

Blockly.Blocks.ext_dht22_temperature = {
  init: function() {
    this.setColour(Blockly.Blocks.extensions.DHT22_HUE);

    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_DHT22_NAME)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_dht22), 'DHT22')
        .appendField(Blockly.Msg.ARD_EXT_DHT22_READ)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.ARD_EXT_DHT22_DISTANCE_DISTANCE, '.readTemperature()'], [Blockly.Msg.ARD_EXT_DHT22_DISTANCE_DISTANCE_AVG, '.readHumidity()']]), 'ACTION')

    this.setOutput(true, Blockly.Types.DECIMAL.output);
    this.setTooltip(Blockly.Msg.ARD_EXT_DHT22_DISTANCE_TIP);
  },
  getBlockType: function() {
    return Blockly.Types.DECIMAL;
  },
};

Blockly.Arduino.ext_dht22_temperature = function(block) {
  var dht22 = block.getFieldValue('DHT22');
  var action = block.getFieldValue('ACTION');

  var config = Blockly.Blocks.extensions.getConfig("dht22", dht22);
  var pin = config.pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');
  // Blockly.Arduino.reservePin(block, echo, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');

  Blockly.Arduino.addInclude('DHT', '#include <DHT.h>');

  var varName = dht22.replace(/^(.*)-(\d+)$/, "dht22-$2");
  varName = Blockly.Arduino.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE);
  var globalCode = 'DHT ' + varName + '(' + pin + ', DHT22);';
  var pinSetupCodesa = varName + '.begin();';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCodesa, false);

  Blockly.Arduino.addVariable(varName, globalCode, false);

  // var code = varName + '.' + action + '()';
  var code = varName + action;
  // return code;
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
