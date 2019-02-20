'use strict';
Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.HC_SR04_HUE = 210; // 模块颜色 0-360，或者 #abcdef

Blockly.Blocks.extensions.list_ultrasonic = function() {
  return Blockly.Blocks.extensions.genComponentOptions("ultrasonic", [["超声波传感器", "超声波传感器"]]);
}

Blockly.Msg.ARD_EXT_HC_SR04_PING = "Ping";
Blockly.Msg.ARD_EXT_HC_SR04_PING_TIP = "超声波Ping";

Blockly.Blocks.ext_ultrasonic_ping = {
  init: function() {
    this.setColour(Blockly.Blocks.extensions.HC_SR04_HUE);

    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_ultrasonic), 'ULTRASONIC')
        .appendField(Blockly.Msg.ARD_EXT_HC_SR04_PING);

    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARD_EXT_HC_SR04_PING_TIP);
  }
};

Blockly.Arduino.ext_ultrasonic_ping = function(block) {
  var ultrasonic = block.getFieldValue('ULTRASONIC');

  var config = Blockly.Blocks.extensions.getConfig("ultrasonic", ultrasonic);
  var tring = config.tring;
  var echo = config.echo;

  Blockly.Arduino.reservePin(block, tring, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');
  Blockly.Arduino.reservePin(block, echo, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');

  Blockly.Arduino.addInclude('SR04', '#include <SR04.h>');

  var varName = ultrasonic.replace(/^(.*)-(\d+)$/, "ultrasonic-$2");
  varName = Blockly.Arduino.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE);
  var globalCode = 'SR04 ' + varName + '(' + echo + ', ' + tring + ');';

  Blockly.Arduino.addVariable(varName, globalCode, false);

  var code = varName + '.Ping();\n';
  return code;
};


Blockly.Msg.ARD_EXT_HC_SR04_DISTANCE_DISTANCE = "测量距离";
Blockly.Msg.ARD_EXT_HC_SR04_DISTANCE_DISTANCE_AVG = "测量平均距离";
Blockly.Msg.ARD_EXT_HC_SR04_DISTANCE_GET_DISTANCE = "上次测量的距离";
Blockly.Msg.ARD_EXT_HC_SR04_DISTANCE_TIP = "超声波测量距离";

Blockly.Blocks.ext_ultrasonic_distance = {
  init: function() {
    this.setColour(Blockly.Blocks.extensions.HC_SR04_HUE);

    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_ultrasonic), 'ULTRASONIC')
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.ARD_EXT_HC_SR04_DISTANCE_DISTANCE, 'Distance'], [Blockly.Msg.ARD_EXT_HC_SR04_DISTANCE_DISTANCE_AVG, 'DistanceAvg'], [Blockly.Msg.ARD_EXT_HC_SR04_DISTANCE_GET_DISTANCE, 'getDistance']]), 'ACTION');

    this.setOutput(true, Blockly.Types.DECIMAL.output);
    this.setTooltip(Blockly.Msg.ARD_EXT_HC_SR04_PING_TIP);
  },
  getBlockType: function() {
    return Blockly.Types.DECIMAL;
  },
};

Blockly.Arduino.ext_ultrasonic_distance = function(block) {
  var ultrasonic = block.getFieldValue('ULTRASONIC');
  var action = block.getFieldValue('ACTION');

  var config = Blockly.Blocks.extensions.getConfig("ultrasonic", ultrasonic);
  var tring = config.tring;
  var echo = config.echo;

  Blockly.Arduino.reservePin(block, tring, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');
  Blockly.Arduino.reservePin(block, echo, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');

  Blockly.Arduino.addInclude('SR04', '#include <SR04.h>');

  var varName = ultrasonic.replace(/^(.*)-(\d+)$/, "ultrasonic-$2");
  varName = Blockly.Arduino.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE);
  var globalCode = 'SR04 ' + varName + '(' + echo + ', ' + tring + ');';

  Blockly.Arduino.addVariable(varName, globalCode, false);

  var code = varName + '.' + action + '()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
