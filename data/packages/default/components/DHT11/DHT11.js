'use strict';
Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.DHT11_HUE = 210; // 模块颜色 0-360，或者 #abcdef

Blockly.Blocks.extensions.list_dht11 = function() {
  return Blockly.Blocks.extensions.genComponentOptions("dht11", [["DHT11温湿度传感器", "DHT11温湿度传感器"]]);
}

Blockly.Msg.ARD_EXT_DHT11_NAME = "读取";
Blockly.Msg.ARD_EXT_DHT11_READ = "的";
Blockly.Msg.ARD_EXT_DHT11_TEMPERATURE = "温湿度";
Blockly.Msg.ARD_EXT_DHT11_DISTANCE_DISTANCE = "温度";
Blockly.Msg.ARD_EXT_DHT11_DISTANCE_DISTANCE_AVG = "湿度";
Blockly.Msg.ARD_EXT_DHT11_DISTANCE_TIP = "DHT11温湿度传感器";

Blockly.Blocks.ext_dht11_temperature = {
  init: function() {
    this.setColour(Blockly.Blocks.extensions.DHT11_HUE);

    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_DHT11_NAME)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_dht11), 'DHT11')
        .appendField(Blockly.Msg.ARD_EXT_DHT11_READ)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.ARD_EXT_DHT11_DISTANCE_DISTANCE, '.readTemperature()'], [Blockly.Msg.ARD_EXT_DHT11_DISTANCE_DISTANCE_AVG, '.readHumidity()']]), 'ACTION')

    this.setOutput(true, Blockly.Types.DECIMAL.output);
    this.setTooltip(Blockly.Msg.ARD_EXT_DHT11_DISTANCE_TIP);
  },
  getBlockType: function() {
    return Blockly.Types.DECIMAL;
  },
};

Blockly.Arduino.ext_dht11_temperature = function(block) {
  var dht11 = block.getFieldValue('DHT11');
  var action = block.getFieldValue('ACTION');

  var config = Blockly.Blocks.extensions.getConfig("dht11", dht11);
  var pin = config.pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');
  // Blockly.Arduino.reservePin(block, echo, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');

  Blockly.Arduino.addInclude('DHT', '#include <DHT.h>');

  var varName = dht11.replace(/^(.*)-(\d+)$/, "dht11-$2");
  varName = Blockly.Arduino.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE);
  var globalCode = 'DHT ' + varName + '(' + pin + ', DHT11);';
  var pinSetupCodesa = varName + '.begin();';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCodesa, false);

  Blockly.Arduino.addVariable(varName, globalCode, false);

  // var code = varName + '.' + action + '()';
  var code = varName + action;
  // return code;
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
