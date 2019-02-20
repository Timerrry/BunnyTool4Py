'use strict';
Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.POT_HUE = 210; // 模块颜色 0-360，或者 #abcdef

Blockly.Blocks.extensions.list_pot = function() {
  return Blockly.Blocks.extensions.genComponentOptions("pot", [["电位器", "电位器"]]);
}

Blockly.Msg.ARD_EXT_POT_STATUS_NAME = "电位器";
Blockly.Msg.ARD_EXT_POT_VALUE_VALUE = "数值";
Blockly.Msg.ARD_EXT_POT_VALUE_TIP = "电位器状态";

Blockly.Blocks.ext_pot_value = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/AnalogRead');
    this.setColour(Blockly.Blocks.extensions.POT_HUE);

    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_POT_STATUS_NAME)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_pot), 'POT')
        .appendField(Blockly.Msg.ARD_EXT_POT_VALUE_VALUE);

    this.setOutput(true, Blockly.Types.NUMBER.output);
    this.setTooltip(Blockly.Msg.ARD_EXT_POT_VALUE_TIP);
  },

  getBlockType: function() {
    return Blockly.Types.NUMBER;
  },
};

Blockly.Arduino.ext_pot_value = function(block) {
  var pot = block.getFieldValue('POT');

  var config = Blockly.Blocks.extensions.getConfig("pot", pot);
  var pin = config.pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.INPUT, 'Analog Read');

  var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'analogRead(' + pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
