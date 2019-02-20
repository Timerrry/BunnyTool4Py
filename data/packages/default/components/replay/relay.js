'use strict';
Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.RELAY_HUE = 210; // 模块颜色 0-360，或者 #abcdef

Blockly.Blocks.extensions.list_relay = function() {
  return Blockly.Blocks.extensions.genComponentOptions("relay", [["继电器", "继电器"]]);
}

Blockly.Msg.ARD_EXT_RELAY_SET_NAME = "继电器";
Blockly.Msg.ARD_EXT_RELAY_SET_OUTPUT = "输出";
Blockly.Msg.ARD_EXT_RELAY_HIGH = "高电平";
Blockly.Msg.ARD_EXT_RELAY_LOW = "低电平";
Blockly.Msg.ARD_EXT_RELAY_SET_TIP = "继电器输出状态";

Blockly.Blocks.ext_relay_set = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
    this.setColour(Blockly.Blocks.extensions.RELAY_HUE);

    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_RELAY_SET_NAME)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_relay), 'RELAY')
        .appendField(Blockly.Msg.ARD_EXT_RELAY_SET_OUTPUT)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.ARD_EXT_RELAY_HIGH, 'HIGH'], [Blockly.Msg.ARD_EXT_RELAY_LOW, 'LOW']]), 'STATE');

    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARD_EXT_RELAY_SET_TIP);
  }
};

Blockly.Arduino.ext_relay_set = function(block) {
  var relay = block.getFieldValue('RELAY');
  var state = block.getFieldValue('STATE');

  var config = Blockly.Blocks.extensions.getConfig("relay", relay);
  var pin = config.pin;
  var triggerMode = config.triggerMode;
  state = state === "HIGH" ? (triggerMode === "HIGH" ? "HIGH" : "LOW") : (triggerMode === "HIGH" ? "LOW" : "HIGH");

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');

  var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'digitalWrite(' + pin + ', ' + state + ');\n';
  return code;
};
