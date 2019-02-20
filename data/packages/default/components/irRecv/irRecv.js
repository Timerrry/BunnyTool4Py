'use strict';
Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.IR_RECV_HUE = '#DC143C'; // 模块颜色 0-360，或者 #abcdef

Blockly.Blocks.extensions.list_irRecv = function() {
  return Blockly.Blocks.extensions.genComponentOptions("irRecv", [["红外接收", "红外接收"]]);
}

Blockly.Msg.ARD_EXT_IR_RECV_NAME = "红外接收";
Blockly.Msg.ARD_EXT_IR_RECV_STATUS = "有信号";
Blockly.Msg.ARD_EXT_IR_RECV_KEY = "按键值";
Blockly.Msg.ARD_EXT_IR_RECV_WAIT = "等待接收下一组信号";

Blockly.Blocks.ext_irRecv_status = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/DigitalRead');
    this.setColour(Blockly.Blocks.extensions.IR_RECV_HUE);

    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_irRecv), 'IR_RECV')
        .appendField(Blockly.Msg.ARD_EXT_IR_RECV_STATUS);

    this.setOutput(true, Blockly.Types.BOOLEAN.output);
    this.setTooltip(Blockly.Msg.ARD_EXT_IR_RECV_STATUS_TIP);
  },

  getBlockType: function() {
    return Blockly.Types.BOOLEAN;
  },
};

Blockly.Arduino.ext_irRecv_status = function(block) {
  var irRecv = block.getFieldValue('IR_RECV');

  var config = Blockly.Blocks.extensions.getConfig("irRecv", irRecv);
  var pin = config.pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.INPUT, 'Digital Read');
  Blockly.Arduino.addInclude('IR_RECV', '#include <IRremote.h>');

  var varName = irRecv.replace(/^(.*)-(\d+)$/, "irRecv-$2");
  varName = Blockly.Arduino.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE);
  var globalCode = varName + ' irrecv(' + pin + ');';
  Blockly.Arduino.addVariable('decode_results', 'decode_results results;', false);

  Blockly.Arduino.addVariable(varName, globalCode, false);

  var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);
  Blockly.Arduino.addSetup('irrecv_' + pin, 'irrecv.enableIRIn();', false);

  var code = 'irrecv.decode(&results)';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Blocks.ext_irRecv_key_value = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/AnalogRead');
    this.setColour(Blockly.Blocks.extensions.IR_RECV_HUE);

    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_irRecv), 'IR_RECV')
        .appendField(Blockly.Msg.ARD_EXT_IR_RECV_KEY);

    this.setOutput(true, Blockly.Types.NUMBER.output);
    this.setTooltip(Blockly.Msg.ARD_EXT_IR_RECV_VALUE_TIP);
  },

  getBlockType: function() {
    return Blockly.Types.NUMBER;
  },
};

Blockly.Arduino.ext_irRecv_key_value = function(block) {
  var irRecv = block.getFieldValue('IR_RECV');

  var config = Blockly.Blocks.extensions.getConfig("irRecv", irRecv);
  var pin = config.pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.INPUT, 'Analog Read');

  var varName = irRecv.replace(/^(.*)-(\d+)$/, "irRecv-$2");
  varName = Blockly.Arduino.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE);
  var globalCode = varName + ' irrecv(' + pin + ');';

  Blockly.Arduino.addVariable(varName, globalCode, false);
  Blockly.Arduino.addVariable('decode_results', 'decode_results results;', false);

  var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);
  Blockly.Arduino.addSetup('irrecv_' + pin, 'irrecv.enableIRIn();', false);

  var code = 'results.value, HEX';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Blocks.ext_irRecv_wait = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/AnalogRead');
    this.setColour(Blockly.Blocks.extensions.IR_RECV_HUE);

    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_irRecv), 'IR_RECV')
        .appendField(Blockly.Msg.ARD_EXT_IR_RECV_WAIT);

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);

    // this.setOutput(true, Blockly.Types.NUMBER.output);
    this.setTooltip(Blockly.Msg.ARD_EXT_IR_RECV_VALUE_TIP);
  },

  getBlockType: function() {
    return Blockly.Types.NUMBER;
  },
};

Blockly.Arduino.ext_irRecv_wait = function(block) {
  var irRecv = block.getFieldValue('IR_RECV');

  var config = Blockly.Blocks.extensions.getConfig("irRecv", irRecv);
  var pin = config.pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.INPUT, 'Analog Read');

  var varName = irRecv.replace(/^(.*)-(\d+)$/, "irRecv-$2");
  varName = Blockly.Arduino.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE);
  var globalCode = varName + ' irrecv(' + pin + ');';

  Blockly.Arduino.addVariable(varName, globalCode, false);
  Blockly.Arduino.addVariable('decode_results', 'decode_results results;', false);

  var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);
  Blockly.Arduino.addSetup('irrecv_' + pin, 'irrecv.enableIRIn();', false);

  var code = 'irrecv.resume();\n';
  return code;
};