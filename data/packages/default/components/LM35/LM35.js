'use strict';
Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.LM35_HUE = 210; // 模块颜色 0-360，或者 #abcdef

Blockly.Blocks.extensions.list_lm35 = function() {
  return Blockly.Blocks.extensions.genComponentOptions("lm35", [["LM35温度传感器", "LM35温度传感器"]]);
}

Blockly.Msg.ARD_EXT_LM35_NAME = "温度传感器";
Blockly.Msg.ARD_EXT_LM35_READ = "读取";
Blockly.Msg.ARD_EXT_LM35_TEMPERATURE = "温度";
Blockly.Msg.ARD_EXT_LM35_DISTANCE_DISTANCE = "摄氏";
Blockly.Msg.ARD_EXT_LM35_DISTANCE_DISTANCE_AVG = "华氏";
Blockly.Msg.ARD_EXT_LM35_DISTANCE_GET_DISTANCE = "开尔文";
Blockly.Msg.ARD_EXT_LM35_DISTANCE_TIP = "LM35温度传感器";

Blockly.Blocks.ext_lm35_temperature = {
  init: function() {
    this.setColour(Blockly.Blocks.extensions.LM35_HUE);

    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_LM35_NAME)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_lm35), 'LM35')
        .appendField(Blockly.Msg.ARD_EXT_LM35_READ)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.ARD_EXT_LM35_DISTANCE_DISTANCE, '.cel()'], [Blockly.Msg.ARD_EXT_LM35_DISTANCE_DISTANCE_AVG, '.fah()'], [Blockly.Msg.ARD_EXT_LM35_DISTANCE_GET_DISTANCE, '.kel()']]), 'ACTION')
        .appendField(Blockly.Msg.ARD_EXT_LM35_TEMPERATURE);

    this.setOutput(true, Blockly.Types.DECIMAL.output);
    this.setTooltip(Blockly.Msg.ARD_EXT_LM35_DISTANCE_TIP);
  },
  getBlockType: function() {
    return Blockly.Types.DECIMAL;
  },
};

Blockly.Arduino.ext_lm35_temperature = function(block) {
  var lm35 = block.getFieldValue('LM35');
  var action = block.getFieldValue('ACTION');

  var config = Blockly.Blocks.extensions.getConfig("lm35", lm35);
  var pin = config.pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');
  // Blockly.Arduino.reservePin(block, echo, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');

  Blockly.Arduino.addInclude('LM35', '#include <LM35.h>');

  var varName = lm35.replace(/^(.*)-(\d+)$/, "lm35-$2");
  varName = Blockly.Arduino.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE);
  var globalCode = 'LM35 ' + varName + '(' + pin + ');';

  Blockly.Arduino.addVariable(varName, globalCode, false);

  // var code = varName + '.' + action + '()';
  var code = varName + action;
  // return code;
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
