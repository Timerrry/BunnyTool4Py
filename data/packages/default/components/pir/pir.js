'use strict';
Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.PIR_HUE = 210; // 模块颜色 0-360，或者 #abcdef

Blockly.Blocks.extensions.list_pir = function() {
  return Blockly.Blocks.extensions.genComponentOptions("pir", [["人体红外感知", "人体红外感知"]]);
}

Blockly.Msg.ARD_EXT_PIR_STATUS_NAME = "人体红外感知";
Blockly.Msg.ARD_EXT_PIR_STATUS_STATUS = "状态值";
Blockly.Msg.ARD_EXT_PIR_STATUS_TIP = "人体红外感知状态";

Blockly.Blocks.ext_pir_status = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/DigitalRead');
    this.setColour(Blockly.Blocks.extensions.PIR_HUE);

    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_PIR_STATUS_NAME)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_pir), 'PIR')
        .appendField(Blockly.Msg.ARD_EXT_PIR_STATUS_STATUS);

    this.setOutput(true, Blockly.Types.BOOLEAN.output);
    this.setTooltip(Blockly.Msg.ARD_EXT_PIR_STATUS_TIP);
  },

  getBlockType: function() {
    return Blockly.Types.BOOLEAN;
  },
};

Blockly.Arduino.ext_pir_status = function(block) {
  var pir = block.getFieldValue('PIR');

  var config = Blockly.Blocks.extensions.getConfig("pir", pir);
  var pin = config.pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.INPUT, 'Digital Read');

  var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'digitalRead(' + pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
