'use strict';
Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.LIMIT_SWITCH_HUE = 210; // 模块颜色 0-360，或者 #abcdef

Blockly.Blocks.extensions.list_limitSwitch = function() {
  return Blockly.Blocks.extensions.genComponentOptions("limitSwitch", [["碰撞传感器", "碰撞传感器"]]);
}

Blockly.Msg.ARD_EXT_LIMIT_SWITCH_STATUS_NAME = "碰撞传感器";
Blockly.Msg.ARD_EXT_LIMIT_SWITCH_STATUS_STATUS = "状态值";
Blockly.Msg.ARD_EXT_LIMIT_SWITCH_STATUS_TIP = "碰撞传感器状态";

Blockly.Blocks.ext_limitSwitch_status = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/DigitalRead');
    this.setColour(Blockly.Blocks.extensions.LIMIT_SWITCH_HUE);

    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_LIMIT_SWITCH_STATUS_NAME)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_limitSwitch), 'LIMIT_SWITCH')
        .appendField(Blockly.Msg.ARD_EXT_LIMIT_SWITCH_STATUS_STATUS);

    this.setOutput(true, Blockly.Types.BOOLEAN.output);
    this.setTooltip(Blockly.Msg.ARD_EXT_LIMIT_SWITCH_STATUS_TIP);
  },

  getBlockType: function() {
    return Blockly.Types.BOOLEAN;
  },
};

Blockly.Arduino.ext_limitSwitch_status = function(block) {
  var limitSwitch = block.getFieldValue('LIMIT_SWITCH');

  var config = Blockly.Blocks.extensions.getConfig("limitSwitch", limitSwitch);
  var pin = config.pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.INPUT, 'Digital Read');

  var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'digitalRead(' + pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
